const NODE_NAME_PATTERN = /^([^\s]+)$/;

export default class AbstractNode {

    #name;

    constructor(name) {
        if (new.target === AbstractNode) {
            throw new Error("can not construct abstract class");
        }
        if (!NODE_NAME_PATTERN.test(name)) {
            throw new Error("name must be an unemty string with no whitespace");
        }
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    toString() {
        return this.name;
    }

}
