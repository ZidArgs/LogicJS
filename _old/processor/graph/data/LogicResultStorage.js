
export default class LogicResultStorage {

    #data = new Map();

    #changed = false;

    set(key, value) {
        this.#data.set(key, value);
        this.#changed = true;
    }

    get(key) {
        return this.#data.get(key);
    }

    hasChange() {
        return this.#changed;
    }

    flush() {
        this.#changed = false;
    }

    clear() {
        this.#data.clear();
        this.#changed = false;
    }

}
