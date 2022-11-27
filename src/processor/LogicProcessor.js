import DataWrapper from "./components/DataWrapper.js";
import {
    EDGE_PATTERN
} from "./components/Edge.js";
import TraverseDataMap from "./components/TraverseDataMap.js";
import LogicGraph from "./LogicGraph.js";

export default class LogicProcessor {

    #graph;

    #memIn = new Map();

    #memOut = new Map();

    #forcedReachable = new Set();

    #dirty = false;

    constructor(graph) {
        if (!(graph instanceof LogicGraph)) {
            throw new TypeError("can only run on LogicGraph")
        }
        this.#graph = graph;
    }

    isDirty() {
        return this.#dirty;
    }

    addReachable(target) {
        this.#forcedReachable.add(target);
    }

    deleteReachable(target) {
        this.#forcedReachable.delete(target);
    }

    clearReachables() {
        this.#forcedReachable.clear();
    }

    /* broad search */
    exec(startNode, startData = {}) {
        const allTargets = this.#graph.getTargetNodes();
        let reachableCount = 0;
        const traversedDataMap = new TraverseDataMap();
        const changes = {};
        const debug = DEBUG.get(this);
        const start = this.#graph.getNode(startNode);

        if (start != null) {
            const startDataWrapper = new DataWrapper(start, startData);

            if (debug) {
                const redirectMatrix = REDIRECT_MATRIX.get(this);
                console.groupCollapsed("GRAPH LOGIC EXECUTION");
                console.log("input", Object.fromEntries(this.#memIn));
                console.log("redirects", Object.fromEntries(redirectMatrix));
                console.log("forced", Array.from(this.#forcedReachable));
                console.log("traverse nodes...");
                console.time("execution time");
                if (debug == "extended") {
                    console.groupCollapsed("traversion graph");
                }
            }

            for (const name of this.#forcedReachable) {
                traversedDataMap.add(name);
            }

            const getValue = (key) => {
                if (allTargets.has(key)) {
                    return +traversedDataMap.has(key);
                } else if (this.#memIn.has(key)) {
                    return this.#memIn.get(key);
                }
                return 0;
            };

            const getData = (dataWrapper) => {
                return (name) => {
                    const patternResult = EDGE_PATTERN.exec(name);
                    if (patternResult != null) {
                        const [, sourceName, targetName] = patternResult;
                        return this.#graph.getRedirect(sourceName, targetName);
                    }
                    return dataWrapper.getData(name);
                };
            };

            const execute = (dataWrapper) => {
                return (name, ...params) => {
                    const {fn, params: defParams} = this.#graph.getMixin(name);
                    if (fn != null) {
                        for (const i in defParams) {
                            if (typeof params[i] == "undefined") {
                                params[i] = defParams[i];
                            }
                        }

                        if (debug == "extended") {
                            console.groupCollapsed(`execute mixin { ${name} }`);
                            console.log(fn.toString());
                            console.log("default parameters: ", defParams);
                            console.log("call parameters: ", params);
                        }

                        const res = fn(getValue, getData(dataWrapper), execute(dataWrapper), params);

                        if (debug == "extended") {
                            console.log(`result: ${res}`);
                            console.groupEnd(`execute mixin { ${name} }`);
                        }
                        return res;
                    }
                    return 0;
                };
            };

            const getNewData = (dataWrapper, newData = {}) => {
                const res = dataWrapper?.getAllData() ?? {};
                for (const name in newData) {
                    const fn = newData[name];
                    if (typeof fn == "function") {
                        res[name] = fn(getValue, getData(dataWrapper), execute);
                    }
                }
                return res;
            };

            /* start traversion */
            const queue = [];
            for (const ch of start.getTargets()) {
                const edge = start.getEdge(ch);
                const newData = getNewData(startDataWrapper, edge.getData());
                const newDataWrapper = new DataWrapper(edge, newData);
                queue.push(newDataWrapper);
                if (debug == "extended") {
                    console.log(`queue edge { ${edge} } with data`, newDataWrapper.getAllData());
                }
            }
            let changed = true;
            while (!!queue.length && !!changed) {
                changed = false;
                let counts = queue.length;
                while (counts--) {
                    const dataWrapper = queue.shift();
                    const edge = dataWrapper.getEdge();
                    const srcNode = edge.getSource();
                    const condition = edge.getLogic();
                    if (debug == "extended") {
                        console.groupCollapsed(`traverse edge { ${edge} }`);
                        console.log(condition.toString());
                    }
                    const cRes = condition(getValue(dataWrapper), getData(dataWrapper), execute(dataWrapper));
                    if (cRes) {
                        if (debug == "extended") {
                            console.log(`result: ${cRes}`);
                        }
                        changed = true;
                        const name = this.#graph.getRedirect(srcNode.getName(), edge.getTarget().getName());
                        if (debug == "extended") {
                            if (name != edge.getTarget().getName()) {
                                console.log(`redirecting edge { ${edge} } to point to { ${name} }`);
                            }
                        }
                        if (name != "") {
                            const node = this.#graph.getNode(name);
                            traversedDataMap.setData(name, dataWrapper);
                            const targets = node.getTargets();
                            for (const ch of targets) {
                                const chEdge = node.getEdge(ch);
                                const chName = this.#graph.getRedirect(chEdge.getSource().getName(), chEdge.getTarget().getName());
                                const newData = getNewData(dataWrapper, chEdge.getData());
                                const newDataWrapper = new DataWrapper(chEdge, newData);
                                if (!traversedDataMap.has(chName, newDataWrapper)) {
                                    queue.push(newDataWrapper);
                                    if (debug == "extended") {
                                        console.log(`queue edge { ${chEdge} } with data`, newDataWrapper.getAllData());
                                    }
                                }
                            }
                        }
                    } else {
                        queue.push(dataWrapper);
                        if (debug == "extended") {
                            console.log(`queue edge { ${edge} } with data`, dataWrapper.getAllData());
                        }
                    }
                    if (debug == "extended") {
                        console.groupEnd(`traverse edge { ${edge} }`);
                        if (reachableCount != traversedDataMap.size) {
                            console.log("reachable changed", traversedDataMap.getAll());
                        }
                    }
                    reachableCount = traversedDataMap.size;
                }
            }
            /* end traversion */

            this.#dirty = false;
            for (const ch of allTargets) {
                const v = traversedDataMap.has(ch);
                if (this.#memOut.get(ch) != v) {
                    this.#memOut.set(ch, v);
                    changes[ch] = v;
                }
            }
            if (debug) {
                if (debug == "extended") {
                    console.groupEnd("traversion graph");
                }
                console.log("success");
                console.timeEnd("execution time");
                console.log("reachable", traversedDataMap.getAll());
                console.log("output", Object.fromEntries(this.#memOut));
                console.log("changes", changes);
                console.groupEnd("GRAPH LOGIC EXECUTION");
            }
        }
        return changes;
    }

}
