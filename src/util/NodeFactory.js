import Node from "../components/graph/Node.js";

export default class NodeFactory {

    #nodes = new Map();

    clear() {
        this.#nodes.clear();
    }

    get(name) {
        if (this.#nodes.has(name)) {
            return this.#nodes.get(name);
        }
        const node = new Node(name);
        this.#nodes.set(name, node);
        return node;
    }

    getNames() {
        return this.#nodes.keys();
    }

    getAllEdges() {
        const nodeNames = this.getNames();
        const res = [];
        for (const name of nodeNames) {
            const node = this.get(name);
            const edges = node.getEdges();
            for (const edge of edges) {
                res.push(edge);
            }
        }
        return res;
    }

    getAllTargetedNodes() {
        const edges = this.getEdges();
        const res = new Set();
        for (const edge of edges) {
            res.add(edge.target);
        }
        return res;
    }

}
