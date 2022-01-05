import DataWrapper from "./DataWrapper.js";

const REACHABLES = new WeakMap();

export default class TraverseDataMap {

    constructor() {
        REACHABLES.set(this, new Map());
    }

    add(name) {
        const reachables = REACHABLES.get(this);
        if (!reachables.has(name)) {
            reachables.set(name, new Map());
        }
    }

    has(name) {
        const reachables = REACHABLES.get(this);
        return reachables.has(name);
    }

    setData(name, dataWrapper) {
        if (dataWrapper instanceof DataWrapper) {
            const reachables = REACHABLES.get(this);
            if (!reachables.has(name)) {
                reachables.set(name, new Map());
            }
            const reach = reachables.get(name);
            reach.set(dataWrapper.toString(), dataWrapper);
        }
    }

    hasData(name, dataWrapper) {
        if (dataWrapper instanceof DataWrapper) {
            const reachables = REACHABLES.get(this);
            if (reachables.has(name)) {
                const reach = reachables.get(name);
                return reach.has(dataWrapper.toString());
            }
        }
        return false;
    }

    forEach(name, fn) {
        if (typeof fn != "function") return;
        const reachables = REACHABLES.get(this);
        if (reachables.has(name)) {
            const reach = reachables.get(name);
            for (const [, value] of reach) {
                fn(value);
            }
        }
    }

}
