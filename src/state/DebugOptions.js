import DebugValues from "../enum/DebugValues.js";

class DebugOptions {

    #active = new Set();

    has(option) {
        return this.#active.has(option);
    }

    set(option) {
        if (!DebugValues.includes(option)) {
            throw new TypeError("option has to be a value of DebugValues");
        }
        this.#active.add(option);
        return this;
    }

    unset(option) {
        if (!DebugValues.includes(option)) {
            throw new TypeError("option has to be a value of DebugValues");
        }
        this.#active.delete(option);
        return this;
    }

}

export default new DebugOptions();
