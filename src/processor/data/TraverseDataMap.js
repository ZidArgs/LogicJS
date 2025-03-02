import DataMap from "../../data/DataMap.js";
import TraverseDataHandler from "../util/TraverseDataHandler.js";

export default class TraverseDataMap {

    #traverseDataHandler = new TraverseDataHandler();

    #reachables = new Map();

    get dataHandler() {
        return this.#traverseDataHandler;
    }

    add(name, ...dataList) {
        if (!this.has(name)) {
            this.#reachables.set(name, []);
        }
        for (const data of dataList) {
            if (data != null && data instanceof DataMap) {
                const reachableData = this.#reachables.get(name);
                if (!this.#traverseDataHandler.hasData(reachableData, data)) {
                    this.#traverseDataHandler.updateData(reachableData, data);
                }
            }
        }
    }

    has(name, data) {
        if (this.#reachables.has(name)) {
            if (data != null && data instanceof DataMap) {
                const reachableData = this.#reachables.get(name);
                return this.#traverseDataHandler.hasData(reachableData, data);
            }
            return true;
        }
        return false;
    }

    get(name) {
        if (this.has(name)) {
            const res = [];
            const dataList = this.#reachables.get(name);
            for (const data of dataList) {
                res.push(data);
            }
            return res;
        }
        return null;
    }

    getAllReachableData() {
        const res = {};
        for (const [name, dataMapList] of this.#reachables) {
            res[name] = [];
            for (const dataMap of dataMapList) {
                res[name].push(dataMap.getAll());
            }
        }
        return res;
    }

    reset() {
        this.#reachables.clear();
    }

    get size() {
        return this.#reachables.size;
    }

}
