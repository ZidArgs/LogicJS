import LogicEdge from "./LogicEdge.js";

const EDGES = new WeakMap();
const NAME = new WeakMap();

export default class LogicNode {

    constructor(name, data) {
        EDGES.set(this, new Map());
        NAME.set(this, name);
    }

    getName() {
        return NAME.get(this);
    }

    append(node, condition, data) {
        if (node instanceof LogicNode) {
            const edges = EDGES.get(this);
            edges.set(node.getName(), new LogicEdge(this, node, condition, data));
        } else {
            throw new TypeError("Expected type Node");
        }
    }

    remove(node) {
        if (node instanceof LogicNode) {
            const edges = EDGES.get(this);
            edges.delete(node.getName());
        } else {
            throw new TypeError("Expected type Node");
        }
    }

    getTargets() {
        const edges = EDGES.get(this);
        return edges.keys();
    }

    getEdge(name) {
        const edges = EDGES.get(this);
        return edges.get(name);
    }

    hasEdges() {
        const edges = EDGES.get(this);
        return !!edges.size;
    }

    generate() {
        const edges = EDGES.get(this);
        const res = {};
        for (const [name, edge] of edges) {
            res[name] = edge.generate();
        }
        return res;
    }
    
}
