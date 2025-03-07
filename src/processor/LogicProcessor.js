import DataMap from "../data/DataMap.js";
import DebugOptions from "../state/DebugOptions.js";
import DebugValues from "../enum/DebugValues.js";
import LogicProgram from "./components/LogicProgram.js";
import LogicRedirects from "./components/LogicRedirects.js";
import LogicGraphExecutor from "./util/LogicGraphExecutor.js";

const LOG_SET_MEMORY_IN = "GRAPH LOGIC INPUT MEMORY SET";
const LOG_CLEAR_MEMORY_FULL = "GRAPH LOGIC FULL MEMORY RESET";
const LOG_CLEAR_MEMORY_OUT = "GRAPH LOGIC OUTPUT MEMORY RESET";

export default class LogicProcessor {

    #program = new LogicProgram();

    #memIn = new DataMap();

    #memOut = new DataMap();

    #redirects = new LogicRedirects();

    #forcedReachable = new Set();

    #logicGraphExecutor = new LogicGraphExecutor(this.#program, this.#memIn, this.#memOut, this.#redirects, this.#forcedReachable);

    #dirty = false;

    constructor() {
        this.#program.addEventListener("cleared_nodes", () => {
            this.#memOut.clear();
            this.#dirty = true;
        });
        this.#program.addEventListener("added_nodes", (event) => {
            for (const nodeName of event.added) {
                if (!this.#memOut.has(nodeName)) {
                    this.#memOut.set(nodeName, false);
                }
            }
            this.#dirty = true;
        });
    }

    reset() {
        this.program.clear();
        this.redirects.clear();
        this.traverseDataHandler.reset();
        this.#forcedReachable.clear();
        this.resetMemory();
        this.#dirty = false;
    }

    get program() {
        return this.#program;
    }

    get redirects() {
        return this.#redirects;
    }

    get traverseDataHandler() {
        return this.#logicGraphExecutor.traverseDataMap.traverseDataHandler;
    }

    isDirty() {
        return this.#dirty;
    }

    setInput(key, value) {
        if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
            console.groupCollapsed(LOG_SET_MEMORY_IN);
            console.log(key, value);
        }

        this.#memIn.set(key, value);

        if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
            console.groupEnd(LOG_SET_MEMORY_IN);
        }

        this.#dirty = true;
    }

    setAllInput(values) {
        if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
            console.groupCollapsed(LOG_SET_MEMORY_IN);
        }

        if (typeof values === "object" && values != null) {
            if (Symbol.iterator in Object(values)) {
                for (const [key, value] of value[Symbol.iterator]) {
                    if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
                        console.log(key, value);
                    }
                    this.#memIn.set(key, value);
                }
            } else {
                for (const [key, value] of Object.entries(values)) {
                    if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
                        console.log(key, value);
                    }
                    this.#memIn.set(key, value);
                }
            }
        }

        if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
            console.groupEnd(LOG_SET_MEMORY_IN);
        }

        this.#dirty = true;
    }

    getOutput(ref) {
        return this.#memOut.get(ref) ?? false;
    }

    getAllOutput() {
        return this.#memOut.getAll();
    }

    hasOutput(ref) {
        return this.#memOut.has(ref);
    }

    resetMemory() {
        if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
            console.log(LOG_CLEAR_MEMORY_FULL);
        }

        this.#memIn.clear();
        this.#memOut.clear();

        for (const node of this.#program.getAllTargetedNodes()) {
            const nodeName = node.name;
            this.#memOut.set(nodeName, false);
        }

        this.#dirty = true;
    }

    resetOutput() {
        if (DebugOptions.has(DebugValues.MEMORY_CHANGES)) {
            console.log(LOG_CLEAR_MEMORY_OUT);
        }

        this.#memOut.clear();

        for (const node of this.#program.getAllTargetedNodes()) {
            const nodeName = node.name;
            this.#memOut.set(nodeName, false);
        }

        this.#dirty = true;
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

    execute(startNodeName, startData = {}) {
        this.#logicGraphExecutor.execute(startNodeName, new DataMap(startData));
        this.#dirty = false;
    }

}
