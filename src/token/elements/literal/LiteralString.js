import AbstractLiteral from "../abstract/AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #ref;

    constructor(ref) {
        super();
        this.#ref = ref;
    }

    toJSON()  {
        return {
            type: "string",
            value: this.#ref
        };
    }

}
