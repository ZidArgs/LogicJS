import AbstractOperator from "./abstract/AbstractOperator.js";

export default class Operator extends AbstractOperator {

    #ref;

    constructor(ref) {
        super();
        this.#ref = ref;
    }

    toJSON()  {
        return {
            type: "mixin",
            el: this.#ref,
            params: this.children.map(e => e.toJSON())
        };
    }

}
