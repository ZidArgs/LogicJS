import AbstractOperator from "../abstract/AbstractOperator.js";

export default class Literal extends AbstractOperator {

    #value;

    constructor(value) {
        super();
        this.#value = value;
    }

    append(el) {
        if (this.children.length < 1) {
            super.append(el);
        }
    }

    toJSON()  {
        return {
            type: "regexp",
            content: this.children.slice(0, 1).map((e) => e.toJSON())[0],
            value: this.#value
        };
    }

}
