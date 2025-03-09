import DataMap from "/LogicJS/data/DataMap.js";

export function traverseDataMapForcedReachableData() {
    const res = [];

    const childData = new DataMap();
    childData.set("age", "child");
    childData.set("day", true);
    childData.set("night", true);
    childData.set("dampe", true);
    res.push(childData);

    const adultData = new DataMap();
    childData.set("age", "adult");
    childData.set("day", true);
    childData.set("night", true);
    childData.set("dampe", true);
    res.push(adultData);

    return res;
}

export function traverseDataMapHasData(targetDataList, compareData) {
    const compareDataEra = compareData.get("age");
    for (const targetData of targetDataList) {
        if (targetData.get("age") == compareDataEra) {
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
    const compareDataEra = compareData.get("age");
    let found = false;
    for (const targetData of targetDataList) {
        if (targetData.get("age") == compareDataEra) {
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
        targetData.set("age", compareData.get("age"));
        targetData.set("day", !!compareData.get("day"));
        targetData.set("night", !!compareData.get("night"));
        targetData.set("dampe", !!compareData.get("dampe"));
        targetDataList.push(targetData);
    }
}
