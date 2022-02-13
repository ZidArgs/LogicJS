import AbstractLiteral from "../abstract/AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    toJSON() {
        return {type: "false"};
    }

}
