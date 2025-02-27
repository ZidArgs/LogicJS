import LogicNode from "../components/LogicNode.js";

export default class LogicNodeFactory {

    #nodes = new Map();

    reset() {
        this.#nodes.clear();
    }

    get(name) {
        if (this.#nodes.has(name)) {
            return this.#nodes.get(name);
        }
        const node = new LogicNode(name);
        this.#nodes.set(name, node);
        return node;
    }

    getNames() {
        return this.#nodes.keys();
    }

}
