export function determineNeedsUpdate(targetDataList, compareData) {
    // check child data
    if (compareData.get("child")) {
        for (const targetData of targetDataList) {
            if (targetData.get("child")) {
                if (!targetData.get("day") && compareData.get("day")) {
                    return true;
                }
                if (!targetData.get("night") && compareData.get("night")) {
                    return true;
                }
                if (!targetData.get("dampe") && compareData.get("dampe")) {
                    return true;
                }
            }
        }
    }
    // check adult data
    if (compareData.get("adult")) {
        for (const targetData of targetDataList) {
            if (targetData.get("adult")) {
                if (!targetData.get("day") && compareData.get("day")) {
                    return true;
                }
                if (!targetData.get("night") && compareData.get("night")) {
                    return true;
                }
                if (!targetData.get("dampe") && compareData.get("dampe")) {
                    return true;
                }
            }
        }
    }
    // no update is needed
    return false;
}

export function updateData(targetDataList, compareData) {
    // update child data
    if (compareData.get("child")) {
        for (const targetData of targetDataList) {
            if (targetData.get("child")) {
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
        // add if nothing was found
    }
    // update adult data
    if (compareData.get("adult")) {
        for (const targetData of targetDataList) {
            if (targetData.get("adult")) {
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
        // add if nothing was found
    }
}
