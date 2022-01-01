import LogicEdge from "./LogicEdge.js";

const EDGES = new WeakMap();
const NAME = new WeakMap();
const DATA = new WeakMap();

export default class LogicNode {

    constructor(name) {
        EDGES.set(this, new Map());
        NAME.set(this, name);
        DATA.set(this, {});
    }

    getName() {
        return NAME.get(this);
    }

    append(node, condition, data) {
        if (node instanceof Node) {
            const edges = EDGES.get(this);
            edges.set(node.getName(), new LogicEdge(this, node, condition, data));
        } else {
            throw new TypeError("Expected type Node");
        }
    }

    remove(node) {
        if (node instanceof Node) {
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

    setData(name, key, value) {
        const data = DATA.get(this);
        data[name] = {
            ...data[name],
            [key]: !!value
        };
    }

    toJSON() {
        const edges = EDGES.get(this);
        const res = {
            edges: {},
            data: {}
        }
        for (const [name, edge] of edges) {
            res.edges[name] = edge.toJSON();
        }
        return res;
    }
    
}
