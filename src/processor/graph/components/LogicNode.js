export default class LogicNode {

    #name;

    #edges = new Map();

    #data = new Map();

    constructor(name) {
        if (typeof name !== "string" || name === "") {
            throw new Error("name has to be a non empty string");
        }
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    setData(key, value) {
        this.#data.set(key, value);
    }

    getData(key) {
        return this.#data.get(key);
    }

    getAllData() {
        const res = {};
        for (const [key, value] of this.#data) {
            res[key] = value;
        }
        return res;
    }

    addEdge(node, condition, data) {
        if (!(node instanceof LogicNode)) {
            throw new TypeError("node must be an instance of LogicNode");
        }
        if (typeof condition !== "function") {
            throw new TypeError("condition must be a function");
        }
        if (!(data instanceof Map)) {
            throw new TypeError("data must be an instance of Map");
        }
        this.#edges.set(node.name, Object.freeze({node, condition, data}));
    }

    removeEdge(node) {
        if (!(node instanceof LogicNode)) {
            throw new TypeError("node must be an instance of LogicNode");
        }
        this.#edges.delete(node.name);
    }

    getEdge(name) {
        return this.#edges.get(name);
    }

    getAllEdges() {
        return this.#edges.keys();
    }

    toString() {
        return this.#name;
    }

}
