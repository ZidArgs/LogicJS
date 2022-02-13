import AbstractLiteral from "../abstract/AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #ref;

    #value;

    #category;

    constructor(ref, value, category) {
        super();
        this.#ref = ref;
        this.#value = value;
        this.#category = category;
    }

    toJSON()  {
        const ref = this.#ref instanceof AbstractLiteral ? this.#ref.toJSON() : this.#ref;
        const value = this.#value instanceof AbstractLiteral ? this.#value.toJSON() : this.#value;
        if (this.#category != null) {
            return {
                type: "state",
                el: ref,
                value: value,
                category: this.#category
            };
        } else {
            return {
                type: "state",
                el: ref,
                value: value
            };
        }
    }

}
