import AbstractNode from "./AbstractNode.js";
import Edge from "./Edge.js";

export default class Node extends AbstractNode {

    #edges = new Map();

    append(node, logic, transformData) {
        if (node instanceof AbstractNode) {
            this.#edges.set(node.getName(), new Edge(this, node, logic, transformData));
        } else {
            throw new TypeError("Expected type Node");
        }
    }

    remove(node) {
        if (node instanceof AbstractNode) {
            this.#edges.delete(node.name);
        } else {
            throw new TypeError("Expected type Node");
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
