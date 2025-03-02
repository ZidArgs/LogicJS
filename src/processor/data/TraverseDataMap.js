import DataMap from "../../data/DataMap.js";
import TraverseDataHandler from "../util/TraverseDataHandler.js";

export default class TraverseDataMap {

    #traverseDataHandler = new TraverseDataHandler();

    #reachables = new Map();

    add(name) {
        if (!this.#reachables.has(name)) {
            this.#reachables.set(name, []);
        }
    }

    has(name) {
        return this.#reachables.has(name);
    }

    setData(name, data) {
        this.add(name);
        if (data != null && data instanceof DataMap) {
            const reachableData = this.#reachables.get(name);
            if (this.#traverseDataHandler.determineNeedsUpdate(reachableData, data)) {
                // TODO update reachable data
            }
        }
    }

    hasData(name, data) {
        if (this.#reachables.has(name)) {
            if (data != null && data instanceof DataMap) {
                const reachableData = this.#reachables.get(name);
                return !this.#traverseDataHandler.determineNeedsUpdate(reachableData, data);
            }
        }
        return false;
    }

    get size() {
        return this.#reachables.size;
    }

}
