
import NodeFactory from "../util/NodeFactory.js";
import EdgeCompiler from "../compiler/EdgeCompiler.js";
import FunctionCompiler from "../compiler/FunctionCompiler.js";
import TraverseDataMap from "../../_old/processor/components/TraverseDataMap.js"; // XXX
import DataMap from "../data/DataMap.js";

export default class LogicTester {

    #nodeFactory = new NodeFactory();

    #logicFunctions = new Map();

    #logicFunctionParams = new Map();

    #memIn = new Map();

    #memOut = new Map(); // XXX is this needed?

    clearLogic() {
        this.#nodeFactory.reset();
        this.#logicFunctions.clear();
        this.#logicFunctionParams.clear();
        this.#memIn.clear();
        this.#memOut.clear();
    }

    loadLogic(config) {
        for (const name in config.edges) {
            const children = config.edges[name];
            const node = this.#nodeFactory.get(name);
            for (const child in children) {
                const edge = children[child];
                const logic = edge.logic;
                const data = edge.data;
                const dataFns = {};
                for (const key in data) {
                    dataFns[key] = EdgeCompiler.compile(data[key]);
                }
                const fn = EdgeCompiler.compile(logic);
                node.append(this.#nodeFactory.get(child), fn, dataFns);
                if (!this.#memOut.has(child)) {
                    this.#memOut.set(child, false);
                }
            }
        }
        for (const name in config.mixins) {
            const mixin = config.mixins[name];
            const logic = mixin.logic;
            const params = mixin.params;
            const fn = FunctionCompiler.compile(logic);
            this.#logicFunctions.set(name, fn);
            this.#logicFunctionParams.set(name, params ?? []);
        }
    }

    setAll(values) {
        if (values instanceof Map) {
            for (const [k, v] of values) {
                this.#memIn.set(k, v);
            }
        } else if (typeof values == "object" && !Array.isArray(values)) {
            for (const k in values) {
                const v = values[k];
                this.#memIn.set(k, v);
            }
        }
    }

    getFunctions() {
        const res = [];
        for (const [name] of this.#logicFunctions) {
            res.push(name);
        }
        return res;
    }

    testLogic(startData = {}) {
        return {
            edges: this.#executeEdges(startData),
            mixins: this.#executeFunctions(startData)
        };
    }

    /* all edges */
    #executeEdges(startData) {
        const allTargets = this.#nodeFactory.getAllTargetedNodes();
        const traversedDataMap = new TraverseDataMap();
        const queue = this.#nodeFactory.getAllEdges();
        const success = new Set();
        const failed = new Set();
        const executionData = new DataMap(startData);

        const getValue =  (key) => {
            if (allTargets.has(key)) {
                return +traversedDataMap.has(key);
            } else if (this.#memIn.has(key)) {
                return this.#memIn.get(key);
            }
            return 0;
        };

        const getData = (wrapper) => {
            return (name) => {
                return wrapper.getData(name);
            };
        };

        const execute = (executionData) => {
            return (name, ...params) => {
                if (this.#logicFunctions.has(name)) {
                    const fn = this.#logicFunctions.get(name);
                    const defParams = this.#logicFunctionParams.get(name);
                    for (const i in defParams) {
                        if (typeof params[i] == "undefined") {
                            params[i] = defParams[i];
                        }
                    }
                    const res = fn(getValue, getData(executionData), execute(executionData), params);
                    return res;
                }
                return 0;
            };
        };

        let changed = true;
        while (!!queue.length && !!changed) {
            changed = false;
            let counts = queue.length;
            while (counts--) {
                const edge = queue.shift();
                const fn = edge.getCondition();
                const res = fn(getValue, getData(executionData), execute(executionData));
                if (res) {
                    success.add(edge.toString());
                    changed = true;
                    const name = edge.getTarget().getName();
                    traversedDataMap.setData(name, executionData);
                } else {
                    queue.push(edge);
                }
            }
        }

        for (const edge of queue) {
            failed.add(edge.toString());
        }

        return {success, failed};
    }

    /* all mixins */
    #executeFunctions(startData) {
        const allTargets = this.#nodeFactory.getAllTargetedNodes();
        const success = new Set();
        const failed = new Set();

        const executionData = new DataMap(startData);

        const getValue =  (key) => {
            if (allTargets.has(key)) {
                return 1;
            } else if (this.#memIn.has(key)) {
                return this.#memIn.get(key);
            }
            return 0;
        };

        const getData = (wrapper) => {
            return (name) => {
                return wrapper.getData(name);
            };
        };

        const execute = (executionData) => {
            return (name, ...params) => {
                if (this.#logicFunctions.has(name)) {
                    const fn = this.#logicFunctions.get(name);
                    const defParams = this.#logicFunctionParams.get(name);
                    for (const i in defParams) {
                        if (typeof params[i] == "undefined") {
                            params[i] = defParams[i];
                        }
                    }
                    const res = fn(getValue, getData(executionData), execute(executionData), params);
                    return res;
                }
                return 0;
            };
        };

        for (const [name, fn] of this.#logicFunctions) {
            const res = fn(getValue, getData(executionData), execute(executionData));
            if (res) {
                success.add(name);
            } else {
                failed.add(name);
            }
        }

        return {success, failed};
    }

}
