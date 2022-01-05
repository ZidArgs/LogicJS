
const EDGE = new WeakMap();
const DATA = new WeakMap();

export default class DataWrapper {

    constructor(edge, data = {}) {
        EDGE.set(this, edge);
        DATA.set(this, data);
    }

    getEdge() {
        return EDGE.get(this);
    }

    setData(name, value) {
        const data = DATA.get(this);
        data[name] = value;
    }

    getData(name) {
        const data = DATA.get(this);
        return data[name];
    }

    getAllData() {
        const data = DATA.get(this);
        const res = {};
        for (const name in data) {
            res[name] = data[name];
        }
        return res;
    }

    toString() {
        const data = this.getAllData();
        return JSON.stringify(data, Object.keys(data).sort());
    }
    
}
