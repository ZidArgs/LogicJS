class DebugOptions {

    #active = new Set();

    has(name) {
        return this.#active.has(name);
    }

    set(name) {
        this.#active.add(name);
        return this;
    }

    unset(name) {
        this.#active.delete(name);
        return this;
    }

}

export default new DebugOptions();
