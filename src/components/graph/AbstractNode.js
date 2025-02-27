export default class AbstractNode {

    #name;

    constructor(name) {
        if (new.target === AbstractNode) {
            throw new Error("can not construct abstract class");
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
