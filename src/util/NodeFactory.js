import Node from "../processor/components/graph/components/Node.js";
import {
    debounceCacheData
} from "./Debouncer.js";

export default class NodeFactory extends EventTarget {

    #nodes = new Map();

    clear() {
        this.#nodes.clear();
        this.#notifyAddedNodes.cancel();
        const event = new Event("clear");
        this.dispatchEvent(event);
    }

    getNode(name) {
        if (this.#nodes.has(name)) {
            return this.#nodes.get(name);
        }
        return null;
    }

    getOrCreateNode(name) {
        if (this.#nodes.has(name)) {
            return this.#nodes.get(name);
        }
        const node = new Node(name);
        this.#nodes.set(name, node);
        this.#notifyAddedNodes(name);
        return node;
    }

    getAllNodes() {
        return this.#nodes.values();
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

    #notifyAddedNodes = debounceCacheData((newNodes) => {
        const event = new Event("added");
        event.added = newNodes;
        this.dispatchEvent(event);
    });

}
