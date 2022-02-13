import AbstractLiteral from "../abstract/AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #ref;

    #category;

    constructor(ref, category) {
        super();
        this.#ref = ref;
        this.#category = category;
    }

    toJSON()  {
        const ref = this.#ref instanceof AbstractLiteral ? this.#ref.toJSON() : this.#ref;
        if (this.#category != null) {
            return {
                type: "pointer",
                el: ref,
                category: this.#category
            };
        } else {
            return {
                type: "pointer",
                el: ref
            };
        }
    }

}
