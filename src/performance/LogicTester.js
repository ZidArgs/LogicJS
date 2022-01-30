


import NodeFactory from "../processor/NodeFactory.js";
import EdgeCompiler from "../processor/compiler/EdgeCompiler.js";
import MixinCompiler from "../processor/compiler/MixinCompiler.js";
import TraverseDataMap from "../processor/components/TraverseDataMap.js";
import DataWrapper from "../processor/components/DataWrapper.js";

const MIXINS = new WeakMap();
const MIXIN_PARAMS = new WeakMap();
const MEM_I = new WeakMap();
const MEM_O = new WeakMap();
const NODES = new WeakMap();

export default class LogicTester {

    constructor() {
        NODES.set(this, new NodeFactory());
        MIXINS.set(this, new Map());
        MIXIN_PARAMS.set(this, new Map());
        MEM_I.set(this, new Map());
        MEM_O.set(this, new Map());
    }

    clearLogic() {
        const nodeFactory = NODES.get(this);
        const mixins = MIXINS.get(this);
        const mixinParams = MIXIN_PARAMS.get(this);
        const mem_i = MEM_I.get(this);
        const mem_o = MEM_O.get(this);
        // ---
        nodeFactory.reset();
        mixins.clear();
        mixinParams.clear();
        mem_i.clear();
        mem_o.clear();
    }

    loadLogic(config) {
        const nodeFactory = NODES.get(this);
        const mixins = MIXINS.get(this);
        const mixinParams = MIXIN_PARAMS.get(this);
        const mem_o = MEM_O.get(this);
        // ---
        for (const name in config.edges) {
            const children = config.edges[name];
            const node = nodeFactory.get(name);
            for (const child in children) {
                const edge = children[child];
                const logic = edge.logic;
                const data = edge.data;
                const dataFns = {};
                for (const key in data) {
                    dataFns[key] = EdgeCompiler.compile(data[key]);
                }
                const fn = EdgeCompiler.compile(logic);
                node.append(nodeFactory.get(child), fn, dataFns);
                if (!mem_o.has(child)) {
                    mem_o.set(child, false);
                }
            }
        }
        for (const name in config.mixins) {
            const mixin = config.mixins[name];
            const logic = mixin.logic;
            const params = mixin.params;
            const fn = MixinCompiler.compile(logic);
            mixins.set(name, fn);
            mixinParams.set(name, params ?? []);
        }
    }

    setAll(values) {
        const mem_i = MEM_I.get(this);
        if (values instanceof Map) {
            for (const [k, v] of values) {
                mem_i.set(k, v);
            }
        } else if (typeof values == "object" && !Array.isArray(values)) {
            for (const k in values) {
                const v = values[k];
                mem_i.set(k, v);
            }
        }
    }

    getMixins() {
        const mixins = MIXINS.get(this);
        const res = [];
        for (const [name] of mixins) {
            res.push(name);
        }
        return res;
    }

    getEdges() {
        const nodeFactory = NODES.get(this);
        const nodes = nodeFactory.getNames();
        const res = [];
        for (const name of nodes) {
            const node = nodeFactory.get(name);
            const children = node.getTargets();
            for (const ch of children) {
                res.push([name, ch]);
            }
        }
        return res;
    }

    getEdgeInstances() {
        const nodeFactory = NODES.get(this);
        const nodes = nodeFactory.getNames();
        const res = [];
        for (const name of nodes) {
            const node = nodeFactory.get(name);
            const children = node.getTargets();
            for (const ch of children) {
                res.push(node.getEdge(ch));
            }
        }
        return res;
    }

    testLogic(startData = {}) {
        return {
            edges: this.executeEdges(startData),
            mixins: this.executeMixins(startData)
        };
    }

    /* all edges */
    executeEdges(startData) {
        const allTargets = this.getTargetNodes();
        const traversedDataMap = new TraverseDataMap();
        const mixins = MIXINS.get(this);
        const mixinParams = MIXIN_PARAMS.get(this);
        const mem_i = MEM_I.get(this);
        const queue = this.getEdgeInstances();
        const success = new Set();
        const failed = new Set();
        const dataWrapper = new DataWrapper(null, startData);

        const getValue =  key => {
            if (allTargets.has(key)) {
                return +traversedDataMap.has(key);
            } else if (mem_i.has(key)) {
                return mem_i.get(key);
            }
            return 0;
        };

        const getData = wrapper => {
            return name => {
                return wrapper.getData(name);
            };
        };

        const execute = dataWrapper => {
            return (name, ...params) => {
                if (mixins.has(name)) {
                    const fn = mixins.get(name);
                    const defParams = mixinParams.get(name);
                    for (const i in defParams) {
                        if (typeof params[i] == "undefined") {
                            params[i] = defParams[i];
                        }
                    }
                    const res = fn(getValue, getData(dataWrapper), execute(dataWrapper), params);
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
                const res = fn(getValue, getData(dataWrapper), execute(dataWrapper));
                if (res) {
                    success.add(edge.toString());
                    changed = true;
                    const name = edge.getTarget().getName();
                    traversedDataMap.setData(name, dataWrapper);
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
    executeMixins(startData) {
        const mixins = MIXINS.get(this);
        const mixinParams = MIXIN_PARAMS.get(this);
        const allTargets = this.getTargetNodes();
        const mem_i = MEM_I.get(this);
        const success = new Set();
        const failed = new Set();

        const dataWrapper = new DataWrapper(null, startData);

        const getValue =  key => {
            if (allTargets.has(key)) {
                return 1;
            } else if (mem_i.has(key)) {
                return mem_i.get(key);
            }
            return 0;
        };

        const getData = wrapper => {
            return name => {
                return wrapper.getData(name);
            };
        };

        const execute = dataWrapper => {
            return (name, ...params) => {
                if (mixins.has(name)) {
                    const fn = mixins.get(name);
                    const defParams = mixinParams.get(name);
                    for (const i in defParams) {
                        if (typeof params[i] == "undefined") {
                            params[i] = defParams[i];
                        }
                    }
                    const res = fn(getValue, getData(dataWrapper), execute(dataWrapper), params);
                    return res;
                }
                return 0;
            };
        };

        for (const [name, fn] of mixins) {
            const res = fn(getValue, getData(dataWrapper), execute(dataWrapper));
            if (res) {
                success.add(name);
            } else {
                failed.add(name);
            }
        }

        return {success, failed};
    }

}
