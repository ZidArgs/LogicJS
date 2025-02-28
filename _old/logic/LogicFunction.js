const PARAM_TYPES = ["undefined", "boolean", "number", "string"];

export default class LogicFunction {

    #logic;

    #params;

    constructor(logic, params) {
        this.#logic = logic;
        this.#params = LogicFunction.parseParams(params);
    }

    serialize() {
        return {
            logic: this.#logic,
            params: this.#params
        };
    }

    static parseParams(params) {
        if (typeof params == "object" && params != null) {
            if (Array.isArray(params)) {
                return params.reduce((a, v) => ({
                    ...a,
                    [v]: undefined
                }), {});
            } else {
                const res = {};
                for (const name in params) {
                    const def = params[name];
                    const type = typeof def;
                    res[name] = PARAM_TYPES.includes(type) ? def : undefined;
                }
                return res;
            }
        }
        return {};
    }

}
