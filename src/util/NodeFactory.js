import UsageCounter from "../data/UsageCounter.js";
import Node from "../processor/components/graph/components/Node.js";
import {debounceCacheData} from "./Debouncer.js";

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
        const node = this.#nodes.get(name);
        if (node != null) {
            if (dataMutation != null) {
                node.dataMutation = dataMutation;
            }
            return node;
        }
        const newNode = new Node(name, dataMutation);
        this.#leafNodes.add(newNode);
        newNode.addEventListener("edge_added", (event) => {
            this.#targetedNodes.increase(event.targetNode);
            this.#leafNodes.delete(event.sourceNode);
        });
        newNode.addEventListener("edge_removed", (event) => {
            this.#targetedNodes.decrease(event.targetNode);
            if (event.sourceNode.isLeaf()) {
                this.#leafNodes.add(event.sourceNode);
            }
        });
        this.#nodes.set(name, newNode);
        this.#notifyAddedNodes(name);
        return newNode;
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
        event.added = newNodes.map(([node]) => node);
        this.dispatchEvent(event);
    });

}
