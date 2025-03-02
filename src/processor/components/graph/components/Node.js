import AbstractNode from "./AbstractNode.js";
import Edge from "./Edge.js";

export default class Node extends AbstractNode {

    #edges = new Map();

    append(node, logic, dataMutation) {
        if (!(node instanceof AbstractNode)) {
            throw new TypeError("node must be an instance of AbstractNode");
        }
        const newEdge = !this.#edges.has(node.name);
        this.#edges.set(node.name, new Edge(this, node, logic, dataMutation));
        if (newEdge) {
            const event = new Event("edge_added");
            event.sourceNode = this;
            event.targetNode = node;
            this.dispatchEvent(event);
        }
    }

    remove(node) {
        if (!(node instanceof AbstractNode)) {
            throw new TypeError("node must be an instance of AbstractNode");
        }
        if (this.#edges.delete(node.name)) {
            const event = new Event("edge_removed");
            event.sourceNode = this;
            event.targetNode = node;
            this.dispatchEvent(event);
        }
    }

    getEdges() {
        return this.#edges.values();
    }

    getEdge(name) {
        return this.#edges.get(name);
    }

    isLeaf() {
        return !this.#edges.size;
    }

    serialize() {
        const res = {};
        for (const [name, edge] of this.#edges) {
            res[name] = edge.serialize();
        }
        return res;
    }

}
