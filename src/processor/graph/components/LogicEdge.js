export const EDGE_PATTERN = /^([^ ]+) -> ([^ ]+)$/;

export default class LogicEdge {

    #source;

    #target;

    #logic;

    #data;

    constructor(source, target, logic, data) {
        this.#source = source;
        this.#target = target;
        this.#logic = logic;
        this.#data = data;
    }

    getLogic() {
        return this.#logic;
    }

    getData() {
        return this.#data;
    }

    get target() {
        return this.#target;
    }

    get source() {
        return this.#source;
    }

    toString() {
        return `${this.#source} -> ${this.#target}`;
    }

}
