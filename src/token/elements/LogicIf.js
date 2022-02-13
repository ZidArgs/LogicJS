import AbstractLiteral from "./abstract/AbstractLiteral.js";

export default class Operator extends AbstractLiteral {

    #condition;

    #success;

    #failed;

    constructor(condition, success, failed) {
        super();
        this.#condition = condition;
        this.#success = success;
        this.#failed = failed;
    }

    toJSON()  {
        return {
            type: "if",
            el: this.#condition,
            then: this.#success,
            else: this.#failed
        };
    }

}
