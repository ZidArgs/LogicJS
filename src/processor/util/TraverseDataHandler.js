import DataMap from "../../data/DataMap.js";

export default class TraverseDataHandler {

    static #defaultUpdateDeterminationFunction(targetDataList, compareData) {
        return targetDataList.some((targetData) => !targetData.equals(compareData));
    }

    static #defaultUpdateFunction(targetDataList, compareData) {
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

    #updateDeteminationFunction = TraverseDataHandler.#defaultUpdateDeterminationFunction;

    #updateFunction = TraverseDataHandler.#defaultUpdateFunction;

    setUpdateDeterminationFunction(updateDeteminationFunction) {
        if (updateDeteminationFunction != null && typeof updateDeteminationFunction !== "function") {
            this.#updateDeteminationFunction = TraverseDataHandler.#defaultUpdateDeterminationFunction;
        } else {
            this.#updateDeteminationFunction = updateDeteminationFunction;
        }
    }

    determineNeedsUpdate(targetDataList, compareData) {
        if (!Array.isArray(targetDataList) || targetDataList.some((targetData) => !(targetData instanceof DataMap))) {
            throw new TypeError("targetDataList must be an array of DataMap");
        }
        if (!(compareData instanceof DataMap)) {
            throw new TypeError("compareData must be an instance of DataMap");
        }
        return this.#updateDeteminationFunction(targetDataList, compareData);
    }

    setUpdateFunction(updateFunction) {
        if (updateFunction != null && typeof updateFunction !== "function") {
            this.#updateFunction = TraverseDataHandler.#defaultUpdateFunction;
        } else {
            this.#updateFunction = updateFunction;
        }
    }

    updateData(targetDataList, compareData) {
        if (!Array.isArray(targetDataList) || targetDataList.some((targetData) => !(targetData instanceof DataMap))) {
            throw new TypeError("targetDataList must be an array of DataMap");
        }
        if (!(compareData instanceof DataMap)) {
            throw new TypeError("compareData must be an instance of DataMap");
        }
        return this.#updateFunction(targetDataList, compareData);
    }

}
