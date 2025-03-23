import UsageCounter from "../data/UsageCounter.js";
import Node from "../processor/components/graph/components/Node.js";
import {
    debounceCacheData
} from "./Debouncer.js";

export default class NodeFactory extends EventTarget {

    #nodes = new Map();

    #targetedNodes = new UsageCounter();

    #leafNodes = new Set();

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

    getOrCreateNode(name, dataMutation) {
        if (this.#nodes.has(name)) {
            const node = this.#nodes.get(name);
            if (dataMutation != null) {
                node.dataMutation = dataMutation;
            }
            return node;
        }
        const node = new Node(name, dataMutation);
        this.#leafNodes.add(node);
        node.addEventListener("edge_added", (event) => {
            this.#targetedNodes.increase(event.targetNode);
            this.#leafNodes.delete(event.sourceNode);
        });
        node.addEventListener("edge_removed", (event) => {
            this.#targetedNodes.decrease(event.targetNode);
            if (event.sourceNode.isLeaf()) {
                this.#leafNodes.add(event.sourceNode);
            }
        });
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
        return this.#targetedNodes.all();
    }

    getAllLeafNodes() {
        return Array.from(this.#leafNodes.keys());
    }

    #notifyAddedNodes = debounceCacheData((newNodes) => {
        const event = new Event("added");
        event.added = newNodes;
        this.dispatchEvent(event);
    });

}
