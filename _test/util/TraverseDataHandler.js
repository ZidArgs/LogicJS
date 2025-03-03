import DataMap from "/LogicJS/data/DataMap.js";

export function traverseDataMapForcedReachableData() {
    const res = [];

    const childData = new DataMap();
    childData.set("era", "child");
    childData.set("day", true);
    childData.set("night", true);
    childData.set("dampe", true);
    res.push(childData);

    const adultData = new DataMap();
    adultData.set("era", "adult");
    adultData.set("day", true);
    adultData.set("night", true);
    adultData.set("dampe", true);
    res.push(adultData);

    return res;
}

export function traverseDataMapHasData(targetDataList, compareData) {
    const compareDataEra = compareData.get("era");
    for (const targetData of targetDataList) {
        if (targetData.get("era") == compareDataEra) {
            if (!targetData.get("day") && compareData.get("day")) {
                return false;
            }
            if (!targetData.get("night") && compareData.get("night")) {
                return false;
            }
            if (!targetData.get("dampe") && compareData.get("dampe")) {
                return false;
            }
            return true;
        }
    }
    return false;
}

export function traverseDataMapUpdateData(targetDataList, compareData) {
    const compareDataEra = compareData.get("era");
    let found = false;
    for (const targetData of targetDataList) {
        if (targetData.get("era") == compareDataEra) {
            found = true;
            if (compareData.get("day")) {
                targetData.set("day", true);
            }
            if (compareData.get("night")) {
                targetData.set("night", true);
            }
            if (compareData.get("dampe")) {
                targetData.set("dampe", true);
            }
        }
    }
    if (!found) {
        const targetData = new DataMap();
        targetData.set("era", compareData.get("era"));
        targetData.set("day", !!compareData.get("day"));
        targetData.set("night", !!compareData.get("night"));
        targetData.set("dampe", !!compareData.get("dampe"));
        targetDataList.push(targetData);
    }
}
