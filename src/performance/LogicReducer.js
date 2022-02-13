
function filterNull(input) {
    return input != null;
}

function filterTrue(input) {
    return input.type != "true";
}

function filterFalse(input) {
    return input.type != "false";
}

function logicReducer(input) {
    switch (input.type) {
        case "and": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull).filter(filterTrue)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            if (output.el.some((e) => e.type == "false")) {
                return {type: "false"}
            }
            return output;
        }
        case "nand": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull).filter(filterTrue)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            if (output.el.some((e) => e.type == "false")) {
                return {type: "true"}
            }
            return output;
        }
        case "or": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull).filter(filterFalse)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            if (output.el.some((e) => e.type == "true")) {
                return {type: "true"}
            }
            return output;
        }
        case "nor": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull).filter(filterFalse)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            if (output.el.some((e) => e.type == "true")) {
                return {type: "false"}
            }
            return output;
        }
        case "xor": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            if (output.el[0].type == "true" && output.el[1].type == "true" || output.el[0].type == "false" && output.el[1].type == "false") {
                return {type: "false"}
            }
            if (output.el[0].type == "false" && output.el[1].type == "true" || output.el[0].type == "true" && output.el[1].type == "false") {
                return {type: "true"}
            }
            return output;
        }
        case "xnor": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            if (output.el[0].type == "true" && output.el[1].type == "true" || output.el[0].type == "false" && output.el[1].type == "false") {
                return {type: "true"}
            }
            if (output.el[0].type == "false" && output.el[1].type == "true" || output.el[0].type == "true" && output.el[1].type == "false") {
                return {type: "false"}
            }
            return output;
        }
        case "add":
        case "sub":
        case "mul":
        case "div":
        case "mod":
        case "pow":
        case "eq":
        case "neq":
        case "gt":
        case "gte":
        case "lt":
        case "lte": {
            const output = {
                type: input.type,
                el: input.el.map(logicReducer).filter(filterNull)
            };
            if (output.el.length == 0) {
                return;
            }
            if (output.el.length == 1) {
                return output.el[0];
            }
            return output;
        }
        case "min":
        case "max": {
            const output = {
                type: input.type,
                el: logicReducer(input.el),
                value: input.value
            };
            if (output.el == null) {
                return;
            }
            return output;
        }
        case "not": {
            const output = {
                "type": "not",
                "el": logicReducer(input.el)
            }
            if (output.el == null) {
                return;
            }
            if (output.el.type == "false") {
                return {type: "true"}
            }
            if (output.el.type == "true") {
                return {type: "false"}
            }
            return output;
        }
        default: {
            return input;
        }
    }
}

class LogicReducer {

    reduceLogic(config) {
        return {
            edges: this.#reduceEdges(config.edges),
            mixins: this.#reduceMixins(config.mixins)
        };
    }

    #reduceEdges(edges) {
        const res = {};
        for (const s in edges) {
            res[s] = res[s] ?? {};
            const targets = edges[s];
            for (const t in targets) {
                const edge = targets[t];
                const logic = edge.logic;
                const data = edge.data;
                res[s][t] = {
                    logic: logicReducer(logic) ?? {type: "false"},
                    data: logicReducer(data) ?? undefined
                };
            }
        }
        return res;
    }

    #reduceMixins(mixins) {
        const res = {};
        for (const n in mixins) {
            const mixin = mixins[name];
            const logic = mixin.logic;
            const params = mixin.params;
            res.mixins[n] = {
                logic: logicReducer(logic) ?? {type: "false"},
                params
            }
        }
        return res;
    }

}

export default new LogicReducer();
