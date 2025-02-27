import LogicResultStorage from "../data/LogicResultStorage.js";

export default class LogicTraverseDataHandler {

    static #defaultTraverseDataMutator(key, oldValue, newValue) {
        return newValue;
    }

    static #defaultTraverseDataComparator(key, oldValue, newValue) {
        return oldValue === newValue;
    }

    #mutator = LogicTraverseDataHandler.#defaultTraverseDataMutator;

    #comparator = LogicTraverseDataHandler.#defaultTraverseDataComparator;

    setMutator(mutator) {
        if (mutator != null && typeof mutator !== "function") {
            throw new TypeError("mutator must be a function or null");
        }
        this.#mutator = mutator ?? LogicTraverseDataHandler.#defaultTraverseDataMutator;
    }

    setComparator(comparator) {
        if (comparator != null && typeof comparator !== "function") {
            throw new TypeError("comparator must be a function or null");
        }
        this.#comparator = comparator ?? LogicTraverseDataHandler.#defaultTraverseDataComparator;
    }

    compareTraverseData(oldData, newData) {
        // TODO remove this after implementing writeTraverseData
        const comparatorFn = this.#comparator;
        const mutatorFn = this.#mutator;
        const allKeys = new Set([...oldData.keys(), ...newData.keys()]);
        for (const key of allKeys) {
            const oldValue = oldData.get(key);
            const newValue = newData.get(key);
            const mutatedNewValue = mutatorFn(key, oldValue, newValue);
            comparatorFn(key, oldValue, mutatedNewValue);
        }
    }

    writeTraverseData(targetNode, data) {
        // TODO fetch old traverse data
        // TODO compare old data with new data
        // TODO update stored data if comparison results to false
    }

}
