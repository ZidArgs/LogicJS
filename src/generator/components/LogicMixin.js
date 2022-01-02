const PARAM_TYPES = ["undefined", "boolean", "number", "string"];
const LOGIC = new WeakMap();
const PARAMS = new WeakMap();

function parseParams(params) {
    if (typeof params == "object") {
        if (Array.isArray(params)) {
            return params.reduce((a, v) => ({ ...a, [v]: undefined}), {});
        } else {
            const res = {};
            for (const name in params) {
                const def = params[name];
                const type = typeof def;
                res[name] = PARAM_TYPES.includes(type) ? def : undefined;
            }
        }
    }
}

export default class LogicMixin {

    constructor(logic, params) {
        LOGIC.set(this, logic);
        PARAMS.set(this, parseParams(params));
    }

    render() {
        return {
            logic: LOGIC.get(this),
            params: PARAMS.get(this)
        };
    }

}
