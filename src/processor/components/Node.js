import Edge from "./Edge.js";

const EDGES = new WeakMap();
const NAME = new WeakMap();
const FILTER = new WeakMap();
const DATA = new WeakMap();

export default class Node {

    constructor(name, filter) {
        EDGES.set(this, new Map());
        NAME.set(this, name);
        FILTER.set(this, filter);
        DATA.set(this, {});
    }

    getName() {
        return NAME.get(this);
    }

    setData(name, key, value) {
        const data = DATA.get(this);
        data[name] = {
            ...data[name],
            [key]: !!value
        };
    }

    getData(name, key) {
        const data = DATA.get(this);
        return data[name]?.[key];
    }

    getAllData() {
        const data = DATA.get(this);
        const res = {};
        for (const name in data) {
            res[name] = {
                ...data[name]
            };
        }
        return res;
    }

    getFilter() {
        const filter = FILTER.get(this);
        const res = {};
        for (const name in filter) {
            res[name] = {
                ...filter[name]
            };
        }
        return res;
    }

    append(node, condition, filter) {
        if (node instanceof Node) {
            const edges = EDGES.get(this);
            edges.set(node.getName(), new Edge(this, node, condition, filter));
        } else {
            throw new TypeError("Expected type Node");
        }
    }

    remove(node) {
        if (node instanceof Node) {
            const edges = EDGES.get(this);
            edges.delete(node.getName());
        } else {
            throw new TypeError("Expected type Node");
        }
    }

    getTargets() {
        const edges = EDGES.get(this);
        return edges.keys();
    }

    getEdge(name) {
        const edges = EDGES.get(this);
        return edges.get(name);
    }

    toString() {
        return this.getName();
    }
    
}
