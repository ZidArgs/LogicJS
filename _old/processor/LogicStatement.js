import StatementCompiler from "./compiler/StatementCompiler.js";

export default class LogicStatement {

    #value = true;

    #logic = null;

    #data = new Map();

    #dirty = false;

    constructor(logic = true) {
        if (typeof logic == "object") {
            const compiledLogic = StatementCompiler.compile(logic);
            if (typeof compiledLogic === "function") {
                this.#logic = compiledLogic;
                this.#value = this.exec();
            }
        } else if (logic != null) {
            this.#value = logic;
        } else {
            this.#value = false;
        }
    }

    #getValue(key) {
        return this.#data.get(key);
    }

    #execute() {
        return this.#logic((key) => {
            return this.#getValue(key);
        });
    }

    exec() {
        if (this.#logic != null && this.#dirty) {
            this.#value = this.#execute();
            this.#dirty = false;
        }
        return this.#value;
    }

    setDataValue(key, value) {
        if (this.#logic != null) {
            const old = this.#data.get(key);
            if (old != value) {
                this.#data.set(key, value);
                this.#dirty = true;
            }
        }
    }

    removeDataValue(key) {
        if (this.#logic != null && this.#data.has(key)) {
            this.#data.delete(key);
            this.#dirty = true;
        }
    }

    clearData() {
        if (this.#logic != null) {
            this.#data.clear();
            this.#dirty = true;
        }
    }

    get value() {
        return this.#value;
    }

    isDirty() {
        return this.#dirty;
    }

}
