/* literals */
import LiteralFalse from "./elements/LiteralFalse.js";
import LiteralTrue from "./elements/LiteralTrue.js";
import LiteralString from "./elements/LiteralString.js";
import LiteralNumber from "./elements/LiteralNumber.js";
import LiteralValue from "./elements/LiteralValue.js";
import LiteralPointer from "./elements/LiteralPointer.js";
import LiteralState from "./elements/LiteralState.js";
import LiteralParam from "./elements/LiteralParam.js";
import LiteralData from "./elements/LiteralData.js";
/* operators */
import OperatorAnd from "./elements/OperatorAnd.js";
import OperatorNand from "./elements/OperatorNand.js";
import OperatorOr from "./elements/OperatorOr.js";
import OperatorNor from "./elements/OperatorNor.js";
import OperatorNot from "./elements/OperatorNot.js";
import OperatorXor from "./elements/OperatorXor.js";
import OperatorXnor from "./elements/OperatorXnor.js";
/* restrictors */
import OperatorMin from "./elements/OperatorMin.js";
import OperatorMax from "./elements/OperatorMax.js";
/* comparators */
import ComparatorEqual from "./elements/ComparatorEqual.js";
import ComparatorNotEqual from "./elements/ComparatorNotEqual.js";
import ComparatorLessThan from "./elements/ComparatorLessThan.js";
import ComparatorLessThanEqual from "./elements/ComparatorLessThanEqual.js";
import ComparatorGreaterThan from "./elements/ComparatorGreaterThan.js";
import ComparatorGreaterThanEqual from "./elements/ComparatorGreaterThanEqual.js";
/* math */
import MathAdd from "./elements/MathAdd.js";
import MathSub from "./elements/MathSub.js";
import MathMul from "./elements/MathMul.js";
import MathDiv from "./elements/MathDiv.js";
import MathMod from "./elements/MathMod.js";
import MathPow from "./elements/MathPow.js";
/* logic */
import LogicMixin from "./elements/LogicMixin.js";
import LogicIf from "./elements/LogicIf.js";
/* referrer */
import ReferrerAt from "./elements/ReferrerAt.js";

export default {
    /* literals */
    "false":    (...params) => new LiteralFalse(...params),
    "true":     (...params) => new LiteralTrue(...params),
    "string":   (...params) => new LiteralString(...params),
    "number":   (...params) => new LiteralNumber(...params),
    "value":    (...params) => new LiteralValue(...params),
    "pointer":  (...params) => new LiteralPointer(...params),
    "state":    (...params) => new LiteralState(...params),
    "param":    (...params) => new LiteralParam(...params),
    "data":     (...params) => new LiteralData(...params),
    /* operators */
    "and":      (...params) => new OperatorAnd(...params),
    "nand":     (...params) => new OperatorNand(...params),
    "or":       (...params) => new OperatorOr(...params),
    "nor":      (...params) => new OperatorNor(...params),
    "not":      (...params) => new OperatorNot(...params),
    "xor":      (...params) => new OperatorXor(...params),
    "xnor":     (...params) => new OperatorXnor(...params),
    /* restrictors */
    "min":      (...params) => new OperatorMin(...params),
    "max":      (...params) => new OperatorMax(...params),
    /* comparators */
    "eq":       (...params) => new ComparatorEqual(...params),
    "neq":      (...params) => new ComparatorNotEqual(...params),
    "lt":       (...params) => new ComparatorLessThan(...params),
    "lte":      (...params) => new ComparatorLessThanEqual(...params),
    "gt":       (...params) => new ComparatorGreaterThan(...params),
    "gte":      (...params) => new ComparatorGreaterThanEqual(...params),
    /* math */
    "add":      (...params) => new MathAdd(...params),
    "sub":      (...params) => new MathSub(...params),
    "mul":      (...params) => new MathMul(...params),
    "div":      (...params) => new MathDiv(...params),
    "mod":      (...params) => new MathMod(...params),
    "pow":      (...params) => new MathPow(...params),
    /* logic */
    "mixin":    (...params) => new LogicMixin(...params),
    "if":       (...params) => new LogicIf(...params),
    /* referrer */
    "at":       (...params) => new ReferrerAt(...params)
};
