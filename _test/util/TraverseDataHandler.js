import DataMap from "/LogicJS/data/DataMap.js";

export function traverseDataMapForcedReachableData() {
    const res = [];

    const childData = new DataMap();
    childData.set("state", "a");
    childData.set("a", true);
    childData.set("b", true);
    childData.set("c", true);
    res.push(childData);

    const adultData = new DataMap();
    adultData.set("state", "b");
    childData.set("a", true);
    childData.set("b", true);
    childData.set("c", true);
    res.push(adultData);

    return res;
}

export function traverseDataMapHasData(targetDataList, compareData) {
    const compareDataEra = compareData.get("state");
    for (const targetData of targetDataList) {
        if (targetData.get("state") == compareDataEra) {
            if (!targetData.get("a") && compareData.get("a")) {
                return false;
            }
            if (!targetData.get("b") && compareData.get("b")) {
                return false;
            }
            if (!targetData.get("c") && compareData.get("c")) {
                return false;
            }
            return true;
        }
    }
    return false;
}

export function traverseDataMapUpdateData(targetDataList, compareData) {
    const compareDataEra = compareData.get("state");
    let found = false;
    for (const targetData of targetDataList) {
        if (targetData.get("state") == compareDataEra) {
            found = true;
            if (compareData.get("a")) {
                targetData.set("a", true);
            }
            if (compareData.get("b")) {
                targetData.set("b", true);
            }
            if (compareData.get("c")) {
                targetData.set("c", true);
            }
        }
    }
    if (!found) {
        const targetData = new DataMap();
        targetData.set("state", compareData.get("state"));
        targetData.set("a", !!compareData.get("a"));
        targetData.set("b", !!compareData.get("b"));
        targetData.set("c", !!compareData.get("c"));
        targetDataList.push(targetData);
    }
}
