import AbstractOperator from "../abstract/AbstractOperator.js";

export default class FunctionReference extends AbstractOperator {

    #ref;

    constructor(ref) {
        super();
        this.#ref = ref;
    }

    toJSON()  {
        return {
            type: "function",
            ref: this.#ref,
            params: this.children.map((e) => e.toJSON())
        };
    }

}
