import DataMap from "../../data/DataMap.js";

export default class TraverseDataHandler {

    // traverseDataMapForcedReachableData

    static #defaultGetForcedReachableDataFunction() {
        return [new DataMap()];
    }

    static #defaultHasDataFunction(targetDataList, compareData) {
        return targetDataList.some((targetData) => !targetData.equals(compareData));
    }

    static #defaultUpdateDataFunction(targetDataList, compareData) {
        if (targetDataList.length) {
            const targetData = targetDataList[0];
            for (const [key, value] of compareData) {
                targetData.set(key, value);
            }
        } else {
            targetDataList.push(compareData);
        }
        return targetDataList.some((targetData) => !targetData.equals(compareData));
    }

    #getForcedReachableDataFunction = TraverseDataHandler.#defaultGetForcedReachableDataFunction;

    #hasDataFunction = TraverseDataHandler.#defaultHasDataFunction;

    #updateDataFunction = TraverseDataHandler.#defaultUpdateDataFunction;

    reset() {
        this.#getForcedReachableDataFunction = TraverseDataHandler.#defaultGetForcedReachableDataFunction;
        this.#hasDataFunction = TraverseDataHandler.#defaultHasDataFunction;
        this.#updateDataFunction = TraverseDataHandler.#defaultUpdateDataFunction;
    }

    setGetForcedReachableDataFunction(getForcedReachableDataFunction) {
        if (getForcedReachableDataFunction != null && typeof hasDataFunction !== "function") {
            this.#getForcedReachableDataFunction = TraverseDataHandler.#defaultGetForcedReachableDataFunction;
        } else {
            this.#getForcedReachableDataFunction = getForcedReachableDataFunction;
        }
    }

    getForcedReachableData() {
        return this.#getForcedReachableDataFunction();
    }

    setHasDataFunction(hasDataFunction) {
        if (hasDataFunction != null && typeof hasDataFunction !== "function") {
            this.#hasDataFunction = TraverseDataHandler.#defaultHasDataFunction;
        } else {
            this.#hasDataFunction = hasDataFunction;
        }
    }

    hasData(targetDataList, compareData) {
        if (!Array.isArray(targetDataList) || targetDataList.some((targetData) => !(targetData instanceof DataMap))) {
            throw new TypeError("targetDataList must be an array of DataMap");
        }
        if (!(compareData instanceof DataMap)) {
            throw new TypeError("compareData must be an instance of DataMap");
        }
        return this.#hasDataFunction(targetDataList, compareData);
    }

    setUpdateDataFunction(updateDataFunction) {
        if (updateDataFunction != null && typeof updateDataFunction !== "function") {
            this.#updateDataFunction = TraverseDataHandler.#defaultUpdateDataFunction;
        } else {
            this.#updateDataFunction = updateDataFunction;
        }
    }

    updateData(targetDataList, compareData) {
        if (!Array.isArray(targetDataList) || targetDataList.some((targetData) => !(targetData instanceof DataMap))) {
            throw new TypeError("targetDataList must be an array of DataMap");
        }
        if (!(compareData instanceof DataMap)) {
            throw new TypeError("compareData must be an instance of DataMap");
        }
        return this.#updateDataFunction(targetDataList, compareData);
    }

}
