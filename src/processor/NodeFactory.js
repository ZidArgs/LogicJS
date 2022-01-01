import Node from "./components/Node.js";

const NODES = new WeakMap();

export default class NodeFactory {

    constructor() {
        NODES.set(this, new Map());
    }

    reset() {
        const nodes = NODES.get(this);
        nodes.clear();
    }

    get(name) {
        const nodes = NODES.get(this);
        if (nodes.has(name)) {
            return nodes.get(name);
        }
        const node = new Node(name);
        nodes.set(name, node);
        return node;
    }

    getNames() {
        const nodes = NODES.get(this);
        return nodes.keys();
    }

}
