class DataMapIterator extends Iterator {

    #values;

    constructor(values) {
        super();
        this.#values = Array.from(values);
    }

    static {
        Object.defineProperty(this.prototype, Symbol.toStringTag, {
            value: "DataMap Iterator",
            configurable: true,
            enumerable: false,
            writable: false
        });

        delete this.prototype.constructor;
    }

    next() {
        if (this.#values.length) {
            const value = this.#values.shift();
            return {
                value: value,
                done: false
            };
        }
        return {
            value: undefined,
            done: true
        };
    }

}

export default class DataMap {

    #data = new Map();

    constructor(data = {}) {
        for (const [key, value] of Object.entries(data)) {
            this.set(key, value);
        }
    }

    get size() {
        return this.#data.size;
    }

    set(key, value) {
        switch (typeof value) {
            case "boolean":
            case "string": {
                this.#data.set(key, value);
            } break;
            case "number": {
                if (!isNaN(value)) {
                    this.#data.set(key, value);
                }
            } break;
            default: {
                if (value == null) {
                    this.#data.set(key, null);
                }
            }
        }
        return this;
    }

    has(key) {
        return this.#data.has(key);
    }

    get(key) {
        return this.#data.get(key);
    }

    delete(key) {
        return this.#data.delete(key);
    }

    values() {
        return this.#data.values();
    }

    keys() {
        return this.#data.keys();
    }

    entries() {
        return this.#data.entries();
    }

    [Symbol.iterator]() {
        return new DataMapIterator(this.#data.entries());
    }

    getAll() {
        const res = {};
        for (const [key, value] of this.#data) {
            res[key] = value;
        }
        return res;
    }

    equals(other) {
        if (!(other instanceof DataMap)) {
            return false;
        }

        if (this.#data.size != other.size) {
            return false;
        }
        return this.#data.entries().every(([k, v]) => v === other.get(k));
    }

    toString() {
        const data = this.#data.entries();
        data.sort(([a], [b]) => a.localeCompare(b));
        return `DataMap[${data.map((e) => e.join(":")).join(",")}]`;
    }

}
