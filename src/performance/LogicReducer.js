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
    switch (input?.type) {
        case "and": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterTrue)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "false")) {
                return {type: "false"}
            }
            return output;
        }
        case "nand": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterTrue)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "false")) {
                return {type: "true"}
            }
            return output;
        }
        case "or": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterFalse)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "true")) {
                return {type: "true"}
            }
            return output;
        }
        case "nor": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterFalse)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "true")) {
                return {type: "false"}
            }
            return output;
        }
        case "xor": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content[0].type == "true" && output.content[1].type == "true" || output.content[0].type == "false" && output.content[1].type == "false") {
                return {type: "false"}
            }
            if (output.content[0].type == "false" && output.content[1].type == "true" || output.content[0].type == "true" && output.content[1].type == "false") {
                return {type: "true"}
            }
            return output;
        }
        case "xnor": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content[0].type == "true" && output.content[1].type == "true" || output.content[0].type == "false" && output.content[1].type == "false") {
                return {type: "true"}
            }
            if (output.content[0].type == "false" && output.content[1].type == "true" || output.content[0].type == "true" && output.content[1].type == "false") {
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
                content: input.content.map(logicReducer).filter(filterNull)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            return output;
        }
        case "min":
        case "max": {
            const output = {
                type: input.type,
                content: logicReducer(input.content),
                value: input.value
            };
            if (output.content == null) {
                return;
            }
            return output;
        }
        case "not": {
            const output = {
                "type": "not",
                "el": logicReducer(input.content)
            }
            if (output.content == null) {
                return;
            }
            if (output.content.type == "false") {
                return {type: "true"}
            }
            if (output.content.type == "true") {
                return {type: "false"}
            }
            if (output.content.type == "not") {
                return output.content.content
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
                try {
                    res[s][t] = {
                        logic: logicReducer(logic) ?? {type: "false"},
                        data: logicReducer(data) ?? undefined
                    };
                } catch (err) {
                    console.error(`Error in edge "${s}" -> "${t}"`, err);
                }
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
            try {
                res.mixins[n] = {
                    logic: logicReducer(logic) ?? {type: "false"},
                    params
                };
            } catch (err) {
                console.error(`Error in mixin "${n}"`, err);
            }
        }
        return res;
    }

}

export default new LogicReducer();
