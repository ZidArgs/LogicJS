import {
    immute
} from "../../../../data/Immutable.js";
import AbstractNode from "./AbstractNode.js";
import Edge from "./Edge.js";

export default class Node extends AbstractNode {

    #edges = new Map();

    #dataMutation;

    constructor(name, dataMutation = {}) {
        if (typeof dataMutation !== "object" || Array.isArray(dataMutation)) {
            throw new TypeError("dataMutation must be a dict");
        }
        super(name);
        if (dataMutation != null) {
            this.#dataMutation = immute(dataMutation);
        }
    }

    set dataMutation(value = {}) {
        if (value == null || typeof value !== "object" || Array.isArray(value)) {
            throw new TypeError("dataMutation must be a dict");
        }
        this.#dataMutation = immute(value);
    }

    get dataMutation() {
        return this.#dataMutation;
    }

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
        const res = {
            dataMutation: this.#dataMutation,
            edges: {}
        };
        for (const [name, edge] of this.#edges) {
            res.edges[name] = edge.serialize();
        }
        return res;
    }

}
