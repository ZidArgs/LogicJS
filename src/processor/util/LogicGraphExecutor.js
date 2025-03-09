import TraverseDataMap from "../data/TraverseDataMap.js";
import DataMap from "../../data/DataMap.js";
import DebugValues from "../../enum/DebugValues.js";
import DebugOptions from "../../state/DebugOptions.js";
import LogicProgram from "../components/LogicProgram.js";
import LogicRedirects from "../components/LogicRedirects.js";
import LogicStatementHelperFactory from "./LogicStatementHelperFactory.js";
import LogicTraversionQueueEntry from "../components/LogicTraversionQueueEntry.js";

const LOG_EXECUTE_LOGIC = "GRAPH LOGIC EXECUTION";

export default class LogicGraphExecutor {

    #program;

    #memIn;

    #memOut;

    #redirects;

    #forcedReachable;

    #collectibles;

    #traverseDataMap = new TraverseDataMap();

    #logicStatementHelperFactory;

    constructor(program, memIn, memOut, redirects, forcedReachable, collectibles) {
        if (!(program instanceof LogicProgram)) {
            throw new TypeError("program must be an instance of LogicProgram");
        }
        if (!(memIn instanceof DataMap)) {
            throw new TypeError("memIn must be an instance of DataMap");
        }
        if (!(memOut instanceof DataMap)) {
            throw new TypeError("memOut must be an instance of DataMap");
        }
        if (!(redirects instanceof LogicRedirects)) {
            throw new TypeError("redirects must be an instance of LogicRedirects");
        }
        if (!(forcedReachable instanceof Set)) {
            throw new TypeError("forcedReachable must be an instance of Set");
        }
        if (!(collectibles instanceof Map)) {
            throw new TypeError("collectibles must be an instance of Map");
        }
        this.#program = program;
        this.#memIn = memIn;
        this.#memOut = memOut;
        this.#redirects = redirects;
        this.#forcedReachable = forcedReachable;
        this.#collectibles = collectibles;

        this.#logicStatementHelperFactory = new LogicStatementHelperFactory(this.#program, this.#memIn, this.#traverseDataMap);
    }

    get traverseDataMap() {
        return this.#traverseDataMap;
    }

    execute(startNodeName, startData) {
        if (!(startData instanceof DataMap)) {
            throw new TypeError("startData must be an instance of DataMap");
        }

        const startNode = this.#program.getNode(startNodeName);

        if (startNode == null) {
            console.error("GRAPH LOGIC EXECUTION - could not find start node", startNodeName);
            return;
        }

        console.groupCollapsed(LOG_EXECUTE_LOGIC);
        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC) || DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
            console.time("data collection time");
        }

        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC)) {
            console.log("start node", startNodeName);
            console.log("input", this.#memIn.getAll());
            console.log("redirects", this.#redirects.getAll());
            console.log("forced", Array.from(this.#forcedReachable));
        }

        const allTargetNodes = this.#program.getAllTargetedNodes();
        const allTargetNodeNames = new Set();
        for (const node of allTargetNodes) {
            allTargetNodeNames.add(node.name);
        }

        const allLeafNodes = this.#program.getAllLeafNodes();
        const allLeafNodeNames = new Set();
        for (const node of allLeafNodes) {
            allLeafNodeNames.add(node.name);
        }

        this.#traverseDataMap.reset();
        for (const name of this.#forcedReachable) {
            this.#traverseDataMap.add(name, ...this.#traverseDataMap.dataHandler.getForcedReachableData());
        }

        const collectedValues = new Map();
        const getValue = this.#logicStatementHelperFactory.createTraverseAndMemoryValueGetter(collectedValues);
        const collect = this.#logicStatementHelperFactory.createValueCollector(collectedValues);

        let logicCalculationCounter = 0;
        let reachableCount = 0;
        const queue = [];

        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC) || DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
            console.timeEnd("data collection time");
            console.log("traverse nodes...");
        }
        console.time("execution time");

        for (const edge of startNode.getEdges()) {
            const queueEntry = new LogicTraversionQueueEntry(edge, startData);
            queue.push(queueEntry);
            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.log(`queue edge { ${edge} } with data`, startData.getAll());
            }
        }

        let changed = true;
        while (!!queue.length && !!changed) {
            changed = false;
            let elementCount = queue.length;
            while (elementCount--) {
                const queueEntry = queue.shift();
                const dataMap = queueEntry.dataMap;
                const edge = queueEntry.edge;
                const sourceNode = edge.source;
                const targetNode = edge.target;
                const condition = edge.logic;

                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.groupCollapsed(`traverse edge { ${edge} } with data`, dataMap.getAll());
                    console.log(condition.toString());
                }

                const getData = LogicStatementHelperFactory.createDataMapValueGetter(dataMap);
                const atResolver = this.#logicStatementHelperFactory.createAtResolver(getValue);
                const execute = this.#logicStatementHelperFactory.createLogicStatementExecutor(getValue, getData);

                const cRes = condition({
                    val: getValue,
                    data: getData,
                    exec: execute,
                    at: atResolver
                });
                logicCalculationCounter++;

                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.log(`result: ${cRes}`);
                }

                if (cRes) {
                    changed = true;
                    const name = this.#redirects.get(sourceNode.name, targetNode.name);

                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        if (name != targetNode.name) {
                            console.log(`redirecting edge { ${edge} } to point to { ${name} }`);
                        }
                    }

                    if (name != "") {
                        if (this.#collectibles.has(name)) {
                            const collectibleName = this.#collectibles.get(name);
                            collect(collectibleName);
                        }

                        const resultDataMap = queueEntry.mutatedDataMap;
                        const node = this.#program.getNode(name);
                        this.#traverseDataMap.add(name, resultDataMap);
                        const childEdges = node.getEdges();
                        for (const childEdge of childEdges) {
                            const childSourceNode = childEdge.source;
                            const childTargetNode = childEdge.target;
                            const chName = this.#redirects.get(childSourceNode.name, childTargetNode.name);
                            const newQueueEntry = new LogicTraversionQueueEntry(childEdge, resultDataMap);
                            const newEntryDataMap = newQueueEntry.mutatedDataMap;
                            if (!this.#traverseDataMap.has(chName, newEntryDataMap)) {
                                queue.push(newQueueEntry);

                                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                                    console.log(`queue edge { ${childEdge} } with data`, resultDataMap.getAll(), childEdge.dataMutation);
                                }
                            } else if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                                console.log(`ignore edge { ${childEdge} } with data`, resultDataMap.getAll(), childEdge.dataMutation);
                            }
                        }
                    }
                } else {
                    queue.push(queueEntry);

                    if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                        console.log(`requeue edge { ${edge} } with data`, dataMap.getAll(), edge.dataMutation);
                    }
                }

                if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                    console.groupEnd(`traverse edge { ${edge} }`);
                    if (reachableCount != this.#traverseDataMap.size) {
                        console.log("reachable changed", this.#traverseDataMap.getAllReachableData());
                    }
                }

                reachableCount = this.#traverseDataMap.size;
            }
        }
        /* end traversion */

        const changes = {};
        for (const node of allTargetNodes) {
            const nodeName = node.name;
            const value = this.#traverseDataMap.has(nodeName);
            if (this.#memOut.get(nodeName) != value) {
                this.#memOut.set(nodeName, value);
                changes[nodeName] = value;
            }
        }

        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC) || DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
            if (DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
                console.groupEnd("traversion graph");
            }
            console.log("success");
            console.log("reachable", this.#traverseDataMap.getAllReachableData());
            console.log("output", this.#memOut.getAll());
            console.log("changes", changes);
        }
        console.log("logic calculation count", logicCalculationCounter);
        console.timeEnd("execution time");
        console.groupEnd(LOG_EXECUTE_LOGIC);

        return changes;
    }

}
