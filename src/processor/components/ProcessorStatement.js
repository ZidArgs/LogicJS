const PARAM_TYPES = ["undefined", "boolean", "number", "string"];

export default class ProcessorStatement extends Function {

    #dependencies = new Set();

    #params;

    #source;

    constructor(statement, {dependencies = [], params = {}, source = {}}) {
        super("val", "data", "exec", "params = {}", `return ${statement}`);

        this.#source = structuredClone(source);
        if (Symbol.iterator in Object(dependencies)) {
            for (const req of dependencies) {
                this.#dependencies.add(req);
            }
        }
        this.#params = ProcessorStatement.parseParams(params);
    }

    get source() {
        return structuredClone(this.#source);
    }

    get dependencies() {
        return new Set(this.#dependencies);
    }

    get params() {
        return structuredClone(this.#params);
    }

    get paramNames() {
        return Object.keys(this.#params);
    }

    getParamType(name) {
        return this.#params[name];
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

    serialize() {
        return {
            logic: this.source,
            params: this.params
        };
    }

}
