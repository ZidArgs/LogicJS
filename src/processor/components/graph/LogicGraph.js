import DebugValues from "../../../enum/DebugValues.js";
import DebugOptions from "../../../state/DebugOptions.js";
import StatementCompiler from "../../../util/StatementCompiler.js";
import NodeFactory from "../../../util/NodeFactory.js";

const LOG_CLEAR = "LogicGraph - clear";
const LOG_LOAD = "LogicGraph - load";
const LOG_ADD_EDGE = "LogicGraph - setEdge";

export default class LogicGraph {

    #nodeFactory = new NodeFactory();

    clear() {
        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.log(LOG_CLEAR);
        }
        this.#nodeFactory.reset();
    }

    load(config) {
        const targetNodes = new Set();

        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.time(LOG_LOAD);
        }

        for (const name in config) {
            const children = config[name];
            const sourceNode = this.#nodeFactory.getOrCreateNode(name);
            for (const child in children) {
                const edge = children[child];
                const logic = edge.logic;
                const data = edge.data;

                const targetNode = this.#nodeFactory.getOrCreateNode(child);
                this.#createEdge(sourceNode, targetNode, logic, data);
                targetNodes.add(child);
            }
        }

        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.timeEnd(LOG_LOAD);
        }

        return Array.from(targetNodes);
    }

    setEdge(sourceName, targetName, logic, data) {
        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.time(LOG_ADD_EDGE);
        }

        const sourceNode = this.#nodeFactory.getOrCreateNode(sourceName);
        const targetNode = this.#nodeFactory.getOrCreateNode(targetName);
        if (logic == null) {
            sourceNode.remove(targetNode);
        } else {
            this.#createEdge(sourceNode, targetNode, logic, data);
        }

        if (DebugOptions.has(DebugValues.LOGIC_CHANGES)) {
            console.timeEnd(LOG_ADD_EDGE);
        }
    }

    getNode(name) {
        return this.#nodeFactory.getNode(name);
    }

    getAllNodes() {
        return this.#nodeFactory.getAllNodes();
    }

    getAllEdges() {
        return this.#nodeFactory.getAllEdges();
    }

    getAllTargetedNodes() {
        return this.#nodeFactory.getAllTargetedNodes();
    }

    serialize() {
        const res = {};
        for (const node of this.getAllNodes()) {
            if (!node.isLeaf()) {
                res[node.name] = node.serialize();
            }
        }
        return res;
    }

    #createEdge(sourceNode, targetNode, logic, data) {
        const dataFns = {};
        for (const key in data) {
            dataFns[key] = StatementCompiler.compile(data[key]);
        }
        const fn = StatementCompiler.compile(logic);
        sourceNode.append(targetNode, fn, dataFns);
    }

}
