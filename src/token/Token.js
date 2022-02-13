/* literal */
import LiteralFalse from "./elements/literal/LiteralFalse.js";
import LiteralTrue from "./elements/literal/LiteralTrue.js";
import LiteralString from "./elements/literal/LiteralString.js";
import LiteralNumber from "./elements/literal/LiteralNumber.js";
import LiteralValue from "./elements/literal/LiteralValue.js";
import LiteralPointer from "./elements/literal/LiteralPointer.js";
import LiteralState from "./elements/literal/LiteralState.js";
import LiteralParam from "./elements/literal/LiteralParam.js";
import LiteralData from "./elements/literal/LiteralData.js";
/* operator */
import OperatorAnd from "./elements/operator/OperatorAnd.js";
import OperatorNand from "./elements/operator/OperatorNand.js";
import OperatorOr from "./elements/operator/OperatorOr.js";
import OperatorNor from "./elements/operator/OperatorNor.js";
import OperatorNot from "./elements/operator/OperatorNot.js";
import OperatorXor from "./elements/operator/OperatorXor.js";
import OperatorXnor from "./elements/operator/OperatorXnor.js";
/* restrictor */
import OperatorMin from "./elements/restrictor/RestrictorMin.js";
import OperatorMax from "./elements/restrictor/RestrictorMax.js";
/* comparator */
import ComparatorEqual from "./elements/comparator/ComparatorEqual.js";
import ComparatorNotEqual from "./elements/comparator/ComparatorNotEqual.js";
import ComparatorLessThan from "./elements/comparator/ComparatorLessThan.js";
import ComparatorLessThanEqual from "./elements/comparator/ComparatorLessThanEqual.js";
import ComparatorGreaterThan from "./elements/comparator/ComparatorGreaterThan.js";
import ComparatorGreaterThanEqual from "./elements/comparator/ComparatorGreaterThanEqual.js";
/* math */
import MathAdd from "./elements/math/MathAdd.js";
import MathSub from "./elements/math/MathSub.js";
import MathMul from "./elements/math/MathMul.js";
import MathDiv from "./elements/math/MathDiv.js";
import MathMod from "./elements/math/MathMod.js";
import MathPow from "./elements/math/MathPow.js";
/* logic */
import LogicMixin from "./elements/logic/LogicMixin.js";
import LogicIf from "./elements/logic/LogicIf.js";
/* referrer */
import ReferrerAt from "./elements/referrer/ReferrerAt.js";

export default {
    /* literal */
    "false":    (...params) => new LiteralFalse(...params),
    "true":     (...params) => new LiteralTrue(...params),
    "string":   (...params) => new LiteralString(...params),
    "number":   (...params) => new LiteralNumber(...params),
    "value":    (...params) => new LiteralValue(...params),
    "pointer":  (...params) => new LiteralPointer(...params),
    "state":    (...params) => new LiteralState(...params),
    "param":    (...params) => new LiteralParam(...params),
    "data":     (...params) => new LiteralData(...params),
    /* operator */
    "and":      (...params) => new OperatorAnd(...params),
    "nand":     (...params) => new OperatorNand(...params),
    "or":       (...params) => new OperatorOr(...params),
    "nor":      (...params) => new OperatorNor(...params),
    "not":      (...params) => new OperatorNot(...params),
    "xor":      (...params) => new OperatorXor(...params),
    "xnor":     (...params) => new OperatorXnor(...params),
    /* restrictor */
    "min":      (...params) => new OperatorMin(...params),
    "max":      (...params) => new OperatorMax(...params),
    /* comparator */
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
