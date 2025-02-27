import AbstractNode from "./AbstractNode.js";

export const EDGE_PATTERN = /^([^ ]+) -> ([^ ]+)$/;

export default class Edge {

    #source;

    #target;

    #logic;

    #transformData;

    constructor(source, target, logic, transformData) {
        if (!(source instanceof AbstractNode)) {
            throw new TypeError("source must be a descendant of AbstractNode");
        }
        if (!(target instanceof AbstractNode)) {
            throw new TypeError("target must be a descendant of AbstractNode");
        }
        this.#source = source;
        this.#target = target;
        this.#logic = logic;
        this.#transformData = transformData;
    }

    get source() {
        return this.#source;
    }

    get target() {
        return this.#target;
    }

    get logic() {
        return this.#logic;
    }

    get transformData() {
        return this.#transformData;
    }

    serialize() {
        return {
            logic: this.#logic,
            transformData: this.#transformData
        };
    }

    toString() {
        return `${this.#source} -> ${this.#target}`;
    }

    toEntry() {
        return [this.#source, this.#target];
    }

}
