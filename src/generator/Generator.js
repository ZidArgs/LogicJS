import LogicMixin from "./components/LogicMixin.js";
import LogicNode from "./components/LogicNode.js";

const EDGES = new WeakMap();
const MIXINS = new WeakMap();

export default class Generator {

    constructor() {
        EDGES.set(this, new Map());
        MIXINS.set(this, new Map());
    }

    getNode(name) {
        const edges = EDGES.get(this);
        if (!edges.has(name)) {
            const node = new LogicNode(name);
            edges.set(name, node);
            return node;
        }
        return edges.get(name);
    }

    setEdge(source, target, logic, data) {
        const sNode = this.getNode(source);
        const tNode = this.getNode(target);
        sNode.append(tNode, logic, data);
    }

    removeEdge(source, target) {
        const sNode = this.getNode(source);
        const tNode = this.getNode(target);
        sNode.remove(tNode);
    }

    loadEdges(config) {
        for (const name in config) {
            const node = config[name];
            if (node == null) {
                continue;
            }
            this.loadNode(name, node);
        }
    }

    loadNode(name, config) {
        for (const tName in config) {
            const edge = config[tName];
            if (edge == null) {
                continue;
            }
            if (edge.logic == null) {
                this.setEdge(name, tName, edge);
            } else {
                this.setEdge(name, tName, edge.logic, edge.data);
            }
        }
    }

    setMixin(name, logic, params) {
        const mixins = MIXINS.get(this);
        mixins.set(name, new LogicMixin(logic, params));
    }

    removeMixin(name) {
        const mixins = MIXINS.get(this);
        mixins.delete(name);
    }

    loadMixins(config) {
        for (const name in config) {
            const fn = config[name];
            if (fn == null) {
                continue;
            }
            if (fn.logic == null) {
                this.setMixin(name, fn);
            } else {
                this.setMixin(name, fn.logic, fn.params);
            }
        }
    }

    loadLogic(config) {
        this.loadEdges(config.edges);
        this.loadMixins(config.mixins);
    }

    run() {
        const edges = EDGES.get(this);
        const mixins = MIXINS.get(this);
        const res = {
            edges: {},
            mixins: {}
        }
        for (const [name, node] of edges) {
            if (node.hasEdges()) {
                res.edges[name] = node.generate();
            }
        }
        for (const [name, fn] of mixins) {
            const mixin = fn.generate();
            res.mixins[name] = mixin;
        }
        return res;
    }

}
