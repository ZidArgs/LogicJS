import DataMap from "../../data/DataMap.js";
import DebugValues from "../../enum/DebugValues.js";
import DebugOptions from "../../state/DebugOptions.js";
import LogicProgram from "../components/LogicProgram.js";
import TraverseDataMap from "../data/TraverseDataMap.js";

export default class LogicStatementHelperFactory {

    #program;

    #memIn;

    #traverseDataMap;

    constructor(program, memIn, traverseDataMap) {
        if (!(program instanceof LogicProgram)) {
            throw new TypeError("program must be an instance of LogicProgram");
        }
        if (!(memIn instanceof DataMap)) {
            throw new TypeError("memIn must be an instance of DataMap");
        }
        if (!(traverseDataMap instanceof TraverseDataMap)) {
            throw new TypeError("traverseDataMap must be an instance of TraverseDataMap");
        }
        this.#program = program;
        this.#memIn = memIn;
        this.#traverseDataMap = traverseDataMap;
    }

    createTraverseAndMemoryValueGetter() {
        const allTargetNodes = this.#program.getAllTargetedNodes();

        return (key) => {
            if (allTargetNodes.has(key)) {
                return +this.#traverseDataMap.has(key);
            } else if (this.#memIn.has(key)) {
                return this.#memIn.get(key);
            }
            return 0;
        };
    }

    createAtResolver(getValue, params) {
        const atResolver = (nodeName, logicFn) => {
            if (!this.#traverseDataMap.has(nodeName)) {
                return false;
            }
            const dataMapList = this.#traverseDataMap.get(nodeName);
            return dataMapList.some((dataMap) => {
                const getData = LogicStatementHelperFactory.createDataMapValueGetter(dataMap);
                return logicFn({
                    val: getValue,
                    data: getData,
                    exec: this.createLogicStatementExecutor(dataMap, getValue, getData, atResolver),
                    at: atResolver,
                    params
                });
            });
        };
        return atResolver;
    }

    createLogicStatementExecutor(getValue, getData, atResolver) {
        const exec = (name, ...params) => {
            const fn = this.#program.getFunction(name);
            if (fn != null) {
                const defParams = fn.params;

                for (const i in defParams) {
                    if (typeof params[i] == "undefined") {
                        params[i] = defParams[i];
                    }
                }

                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.groupCollapsed(`execute mixin { ${name} }`);
                    console.log(fn.toString());
                    console.log("default parameters: ", defParams);
                    console.log("call parameters: ", params);
                }

                const res = fn({
                    val: getValue,
                    data: getData,
                    exec,
                    at: atResolver,
                    params
                });

                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.log(`result: ${res}`);
                    console.groupEnd(`execute mixin { ${name} }`);
                }
                return res;
            }
            return 0;
        };
        return exec;
    }

    static createDataMapValueGetter(dataMap) {
        if (!(dataMap instanceof DataMap)) {
            throw new TypeError("dataMap must be an instance of DataMap");
        }

        return (key) => {
            if (dataMap.has(key)) {
                return dataMap.get(key);
            }
            return 0;
        };
    }

}

