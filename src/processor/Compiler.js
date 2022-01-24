const TRANSPILERS = {
    /* literals */
    "true":     (logic) => "1",
    "false":    (logic) => "0",
    "string":   (logic) => `"${escapeString(logic.el)}"`,
    "number":   (logic) => toNumber(logic.el),
    "value":    (logic) => `(val("${escape(logic.el)}")||0)`,
    "pointer":  (logic) => `(val(val("${escape(logic.el)}")||"")||0)`,
    "state":    (logic) => `(val("${escape(logic.el)}")||"")=="${escape(logic.value)}"`,

    /* operators */
    "and":      (logic) => `${multiElementOperation(logic.el, "&&")}`,
    "nand":     (logic) => `!${multiElementOperation(logic.el, "&&")}`,
    "or":       (logic) => `${multiElementOperation(logic.el, "||")}`,
    "nor":      (logic) => `!${multiElementOperation(logic.el, "||")}`,
    "not":      (logic) => `!(${buildLogic(logic.el)})`,
    "xor":      (logic) => `${twoElementOperation(logic.el, "^") || 1}`,
    "xnor":     (logic) => `!${twoElementOperation(logic.el, "^") || 1}`,

    /* restrictors */
    "min":      (logic) => `(${buildLogic(logic.el)}>=${escapeNumber(logic.value)})`,
    "max":      (logic) => `(${buildLogic(logic.el)}<=${escapeNumber(logic.value)})`,

    /* comparators */
    "eq":       (logic) => twoElementOperation(logic.el, "=="),
    "neq":      (logic) => twoElementOperation(logic.el, "!="),
    "lt":       (logic) => twoElementOperation(logic.el, "<"),
    "lte":      (logic) => twoElementOperation(logic.el, "<="),
    "gt":       (logic) => twoElementOperation(logic.el, ">"),
    "gte":      (logic) => twoElementOperation(logic.el, ">="),

    /* math */
    "add":      (logic) => mathMultiElementOperation(logic.el, "+"),
    "sub":      (logic) => mathMultiElementOperation(logic.el, "-"),
    "mul":      (logic) => mathMultiElementOperation(logic.el, "*"),
    "div":      (logic) => mathMultiElementOperation(logic.el, "/"),
    "mod":      (logic) => mathMultiElementOperation(logic.el, "%"),
    "pow":      (logic) => mathTwoElementOperation(logic.el, "**"),

    /* mixins */
    "mixin":    (logic) => `exec("${escape(logic.el)}"${functionParams(logic.params)})`,
    "param":    (logic) => `param[${toNumber(logic.el)}]`,

    /* special */
    "if":       (logic) => `(${buildLogic(logic.el)}?${escape(logic.then ?? 0)}:${escape(logic.else ?? 0)})`,
    "at":       (logic) => logic.el ? `((val("${escape(logic.node)}")||0)&&${buildLogic(logic.el)})` : `(val("${escape(logic.node)}")||0)`,
    "data":     (logic) => `data("${escapeString(logic.el)}")`
};

const dependencies = new Set();

/* STRINGS */
function escapeString(str, def = "") {
    if (typeof str != "string") {
        if (typeof str == "number" && !isNaN(str)) {
            return str;
        }
        return def;
    }
    return str.replace(/[\\"]/g, "\\$&");
}

/* ELEMENTS */
function escape(str, def = "") {
    if (typeof str != "string") {
        if (typeof str == "number" && !isNaN(str)) {
            return str;
        }
        return def;
    }
    const res = str.replace(/[\\"]/g, "\\$&");
    dependencies.add(res);
    return res;
}

function twoElementOperation(els, join) {
    return mathMultiElementOperation(els.slice(0, 2), join);
}

function multiElementOperation(els, join) {
    if (els.length == 0) {
        return 0;
    }
    return `(${els.map(buildLogic).join(join)})`;
}

/* MATH */
function escapeNumber(val) {
    val = parseInt(val);
    if (!isNaN(val)) {
        return val;
    }
    return 0;
}

function toNumber(val) {
    return `(parseInt(${val})||0)`
}

function mathTwoElementOperation(els, join) {
    return mathMultiElementOperation(els.slice(0, 2), join);
}

function mathMultiElementOperation(els, join) {
    if (els.length == 0) {
        return 0;
    }
    return `${els.map(buildLogic).map(toNumber).join(join)}`;
}

/* FUNCTION PARAMS */
function escapeParam(val) {
    if (typeof val == "boolean") {
        return val;
    }
    if (typeof val == "number") {
        if (!isNaN(val)) {
            return val;
        }
        return 0;
    }
    if (typeof val == "string") {
        return val.replace(/[\\"]/g, "\\$&");
    }
}

function functionParams(els) {
    if (els == null || els.length == 0) {
        return "";
    }
    return `,${els.map(escapeParam).join(",")}`;
}

/* INITIATOR */
function buildLogic(logic) {
    if (typeof logic != "object") {
        logic = {
            type: logic
        };
    }
    if (TRANSPILERS[logic.type] != null) {
        return TRANSPILERS[logic.type](logic);
    }
    return 0;
}

class Compiler {

    compile(logic) {
        const buf = buildLogic(logic);
        const fn = new Function("val", "data", "exec", `return ${buf}`);
        Object.defineProperty(fn, "requires", {
            value: dependencies
        });
        dependencies.clear();
        return fn;
    }

    compileMixin(logic) {
        const buf = buildLogic(logic);
        const fn = new Function("val", "data", "exec", "params", `return ${buf}`);
        Object.defineProperty(fn, "requires", {
            value: dependencies
        });
        dependencies.clear();
        return fn;
    }

}

export default new Compiler;
