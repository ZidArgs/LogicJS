import DataMap from "../../data/DataMap.js";
import Edge from "./graph/components/Edge.js";

export default class LogicTraversionQueueEntry {

    #edge;

    #dataMap;

    #mutatedDataMap;

    constructor(edge, dataMap) {
        if (!(edge instanceof Edge)) {
            throw new TypeError("edge must be an instance of Edge");
        }
        this.#edge = edge;
        if (dataMap != null) {
            if (!(dataMap instanceof DataMap)) {
                throw new TypeError("dataMap must be an instance of DataMap or null");
            }
            this.#dataMap = new DataMap(dataMap);
            this.#mutatedDataMap = new DataMap(dataMap);
        } else {
            this.#dataMap = new DataMap();
            this.#mutatedDataMap = new DataMap();
        }
        for (const [key, value] of Object.entries(edge.dataMutation)) {
            this.#mutatedDataMap.set(key, value);
        }
    }

    get edge() {
        return this.#edge;
    }

    get dataMap() {
        return this.#dataMap;
    }

    get mutatedDataMap() {
        return this.#mutatedDataMap;
    }

}
