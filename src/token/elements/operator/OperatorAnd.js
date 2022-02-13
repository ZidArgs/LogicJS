import AbstractOperator from "../abstract/AbstractOperator.js";

export default class Operator extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "and",
            el: this.children.map(e => e.toJSON())
        };
    }

}
