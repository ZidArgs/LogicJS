import DataMap from "../../data/DataMap.js";

export function createValueGetter(allTargets, traversedDataMap, memIn) {
    if (!(memIn instanceof Set)) {
        throw new TypeError("allTargets must be an instance of Set");
    }
    // if (!(traversedDataMap instanceof DataMap)) {
    //     throw new TypeError("traversedDataMap must be an instance of DataMap");
    // }
    if (!(memIn instanceof DataMap)) {
        throw new TypeError("memIn must be an instance of DataMap");
    }

    return (key) => {
        if (allTargets.has(key)) {
            return +traversedDataMap.has(key);
        } else if (memIn.has(key)) {
            return memIn.get(key);
        }
        return 0;
    };
}
