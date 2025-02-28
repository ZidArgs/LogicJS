import DebugValues from "../../enum/DebugValues.js";
import DebugOptions from "../../state/DebugOptions.js";
import StatementCompiler from "../../util/StatementCompiler.js";
import LogicGraph from "./graph/LogicGraph.js";

const LOG_GROUP_LOAD_LOGIC = "LogicProgram - load";
const LOG_BUILD_FUNCTIONS = "LogicProgram - build functions";
const LOG_SET_FUNCTION = "LogicProgram - set function";

export default class LogicProgram {

    #graph = new LogicGraph();

    #logicFunctions = new Map();

    clear() {
        this.#graph.clear();
        this.#logicFunctions.clear();
    }

    load(config) {
        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.groupCollapsed(LOG_GROUP_LOAD_LOGIC);
        }

        const targetNodes = this.#graph.load(config.edges);

        this.#buildFunctions(config.functions);

        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.groupCollapsed(LOG_GROUP_LOAD_LOGIC);
        }

        return targetNodes;
    }

    setEdge(sourceName, targetName, logic, data) {
        return this.#graph.setEdge(sourceName, targetName, logic, data);
    }

    getNode(name) {
        return this.#graph.getNode(name);
    }

    getAllNodes() {
        return this.#graph.getAllNodes();
    }

    getAllEdges() {
        return this.#graph.getAllEdges();
    }

    getAllTargetedNodes() {
        return this.#graph.getAllTargetedNodes();
    }

    setFunction(name, logic, params = {}) {
        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.time(LOG_SET_FUNCTION);
        }

        if (logic == null) {
            this.#logicFunctions.delete(name);
        } else {
            const fn = StatementCompiler.compile(logic, params);
            this.#logicFunctions.set(name, fn);
        }

        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.timeEnd(LOG_SET_FUNCTION);
        }
    }

    getFunction(name) {
        return this.#logicFunctions.get(name);
    }

    getAllFunctions() {
        return Object.fromEntries(this.#logicFunctions.entries());
    }

    serialize() {
        const res = {
            edges: this.#graph.serialize(),
            functions: {}
        };

        for (const [name, fn] of this.#logicFunctions) {
            res.functions[name] = fn.serialize();
        }

        return res;
    }

    #buildFunctions(config) {
        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.time(LOG_BUILD_FUNCTIONS);
        }

        for (const name in config) {
            const logicFunction = config[name];
            const logic = logicFunction.logic;
            const params = logicFunction.params;
            const fn = StatementCompiler.compile(logic, params);
            this.#logicFunctions.set(name, fn);
        }

        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.timeEnd(LOG_BUILD_FUNCTIONS);
        }
    }

}
