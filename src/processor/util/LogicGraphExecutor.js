import DataMap from "../../data/DataMap.js";
import DebugValues from "../../enum/DebugValues.js";
import DebugOptions from "../../state/DebugOptions.js";
import LogicProgram from "../components/LogicProgram.js";
import LogicRedirects from "../components/LogicRedirects.js";

const LOG_EXECUTE_LOGIC = "GRAPH LOGIC EXECUTION";

class LogicGraphExecutor {

    #program;

    #memIn;

    #memOut;

    #redirects;

    #forcedReachable;

    constructor(program, memIn, memOut, redirects, forcedReachable) {
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
        this.#program = program;
        this.#memIn = memIn;
        this.#memOut = memOut;
        this.#redirects = redirects;
        this.#forcedReachable = forcedReachable;
    }

    execute(startNodeName, startData = {}) {
        const startNode = this.#program.getNode(startNodeName);

        if (startNode == null) {
            console.error("GRAPH LOGIC EXECUTION - could not find start node", startNodeName);
            return;
        }

        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC) || DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
            console.groupCollapsed(LOG_EXECUTE_LOGIC);
            console.groupCollapsed("GRAPH LOGIC EXECUTION");
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

        const changes = {};

        for (const name of this.#forcedReachable) {
            //traversedDataMap.add(name); // TODO store reachables
        }

        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC) || DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
            console.timeEnd("data collection time");
            console.log("traverse nodes...");
            console.time("execution time");
        }

        if (DebugOptions.has(DebugValues.EXECUTE_LOGIC) || DebugOptions.has(DebugValues.TRAVERSE_GRAPH)) {
            console.timeEnd("execution time");
            console.groupEnd(LOG_EXECUTE_LOGIC);
        }
    }

}
