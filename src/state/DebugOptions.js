const ACTIVE = new Set();

class DebugOptions {

    #active = false;

    get active() {
        return this.#active;
    }

    set active(value) {
        this.#active = value;
    }

    isActive(name) {
        return ACTIVE.has(name);
    }

    activate(name) {
        ACTIVE.add(name);
    }

    deactivate(name) {
        ACTIVE.delete(name);
    }

}

export default new DebugOptions();
