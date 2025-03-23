import DataMap from "../../data/DataMap.js";
import DebugValues from "../../enum/DebugValues.js";
import DebugOptions from "../../state/DebugOptions.js";
import LogicProgram from "../components/LogicProgram.js";
import LogicStatement from "../components/LogicStatement.js";
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

    createValueCollector(collected) {
        if (!(collected instanceof Map)) {
            throw new TypeError("collected must be an instance of Map");
        }

        return (key) => {
            const value = collected.get(key) ?? this.#memIn.get(key) ?? 0;
            collected.set(key, value + 1);
            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.log("collected:", key);
            }
        };
    }

    createTraverseAndMemoryValueGetter(collected) {
        if (!(collected instanceof Map)) {
            throw new TypeError("collected must be an instance of Map");
        }

        const allTargetNodes = this.#program.getAllTargetedNodes();
        const allTargetNodeNames = new Set();
        for (const node of allTargetNodes) {
            allTargetNodeNames.add(node.name);
        }

        return (key) => {
            if (allTargetNodeNames.has(key)) {
                if (this.#traverseDataMap.has(key)) {
                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        console.log(`get value for { ${key} } - reached`);
                    }
                    return 1;
                }
                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.log(`get value for { ${key} } - not reached`);
                }
                return 0;
            }
            const result = collected.get(key) ?? this.#memIn.get(key) ?? 0;
            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.log(`get value for { ${key} } - ${result}`);
            }
            return result;
        };
    }

    createAtResolver(getValue, params) {
        const atResolver = (nodeName, logicFn) => {
            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.log(`run at for { ${nodeName} }`);
                console.log(logicFn.toString());
            }

            if (!this.#traverseDataMap.has(nodeName)) {
                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.log("node not reached");
                    console.groupEnd(`run at for { ${nodeName} }`);
                }
                return false;
            }
            const dataMapList = this.#traverseDataMap.get(nodeName);
            const res = dataMapList.some((dataMap) => {
                const getData = LogicStatementHelperFactory.createDataMapValueGetter(dataMap);
                return logicFn({
                    val: getValue,
                    data: getData,
                    exec: this.createLogicStatementExecutor(getValue, getData),
                    at: atResolver,
                    params
                });
            });

            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.log(`result: ${res}`);
                console.groupEnd(`run at for { ${nodeName} }`);
            }
            return res;
        };
        return atResolver;
    }

    createLogicStatementExecutor(getValue, getData) {
        const exec = (name, params = {}) => {
            const fn = this.#program.getInjectedFunction(name) ?? this.#program.getFunction(name);

            if (fn != null) {
                const defParams = fn.params;

                if (Array.isArray(params)) {
                    const arrParams = params;
                    params = {};
                    let i = 0;
                    for (const key in defParams) {
                        params[key] = arrParams[i++];
                    }
                }

                for (const key in defParams) {
                    if (typeof params[key] == "undefined") {
                        params[key] = defParams[key];
                    }
                }

                if (fn instanceof LogicStatement) {
                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        console.groupCollapsed(`execute function { ${name} }`);
                        console.log(fn.toString());
                        console.log("default parameters: ", defParams);
                        console.log("call parameters: ", params);
                    }

                    const atResolver = this.createAtResolver(getValue, params);

                    const res = fn({
                        val: getValue,
                        data: getData,
                        exec,
                        at: atResolver,
                        params
                    });

                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        console.log(`result: ${res}`);
                        console.groupEnd(`execute function { ${name} }`);
                    }
                    return res;
                } else if (typeof fn === "function") {
                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        console.groupCollapsed(`execute injected function { ${name} }`);
                        console.log(fn.toString());
                        console.log("default parameters: ", defParams);
                        console.log("call parameters: ", params);
                    }

                    const res = fn({
                        val: getValue,
                        data: getData,
                        params
                    });

                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        console.log(`result: ${res}`);
                        console.groupEnd(`execute injected function { ${name} }`);
                    }
                    return res;
                }
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
                const result = dataMap.get(key);
                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.log(`get data value for { ${key} } - ${result}`);
                }
                return result;
            }
            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.log(`get data value for { ${key} } - 0`);
            }
            return 0;
        };
    }

}

