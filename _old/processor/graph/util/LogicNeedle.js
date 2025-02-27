import LogicNode from "../components/LogicNode.js";
import LogicScope from "../data/LogicScope.js";

function isNull(value) {
    return value === null || value === undefined;
}

function isPrimitive(value) {
    if (value == null) {
        return isNull(value);
    }
    const type = typeof value;
    return type !== "object" && type !== "function";
}

export class LogicNeedle {

    #logicScope;

    #traversionData = new Map();

    #currentNode;

    constructor(logicScope, node) {
        if (!(logicScope instanceof LogicScope)) {
            throw new TypeError("logicScope must be an instance of LogicScope");
        }
        if (!(node instanceof LogicNode)) {
            throw new TypeError("node must be an instance of LogicNode");
        }
        this.#logicScope = logicScope;
        this.#currentNode = node;
    }

    clone() {
        const res = new LogicNeedle(this.#logicScope, this.#currentNode);
        res.#traversionData = new Map(this.#traversionData);
        return res;
    }

    traverse(name) {
        const next = this.#currentNode.getEdge(name);
        if (next != null) {
            // const {node, condition, data} = next;
            // TODO
        }
    }

    setTraversionData(key, value) {
        if (typeof key !== "string" || key === "") {
            throw new Error("key has to be a non empty string");
        }
        if (!isPrimitive(value)) {
            throw new Error("value has to be a primitive (undefined, null, boolean, number, string)");
        }
        this.#traversionData.set(key, value);
    }

    getTraversionData(key) {
        if (typeof key !== "string" || key === "") {
            throw new Error("key has to be a non empty string");
        }
        return this.#traversionData.get(key);
    }

}
