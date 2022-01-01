import LogicFunction from "./components/LogicFunction.js";
import LogicNode from "./components/LogicNode.js";

const TREE = new WeakMap();
const FUNCTIONS = new WeakMap();

export default class TreeLogic {

    constructor() {
        TREE.set(this, new Map());
        FUNCTIONS.set(this, new Map());
    }

    getNode(name) {
        const tree = TREE.get(this);
        if (!tree.has(name)) {
            const node = new LogicNode(name);
            tree.set(name, node);
            return node;
        }
        return tree.get(name);
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

    loadTree(config) {
        for (const name in config) {
            const node = config[name];
            if (node == null) continue;
            if (node.edges == null) {
                this.loadNode(name, node);
            } else {
                this.loadNode(name, node.edges);
                const sNode = this.getNode(name);
                sNode.setData(node.data);
            }
        }
    }

    loadNode(name, config) {
        for (const tName in config) {
            const edge = config[tName];
            if (edge == null) continue;
            if (edge.logic == null) {
                this.setEdge(name, tName, edge);
            } else {
                this.setEdge(name, tName, edge.logic, edge.data);
            }
        }
    }

    setFunction(name, logic, params) {
        const functions = FUNCTIONS.get(this);
        functions.set(name, new LogicFunction(logic, params));
    }

    removeFunction(name) {
        const functions = FUNCTIONS.get(this);
        functions.delete(name);
    }

    loadFunctions(config) {
        for (const name in config) {
            const fn = config[name];
            if (fn == null) continue;
            if (fn.logic == null) {
                this.setFunction(name, new LogicFunction(fn));
            } else {
                this.setFunction(name, new LogicFunction(fn.logic, fn.params));
            }
        }
    }

    toJSON() {
        const tree = TREE.get(this);
        const functions = FUNCTIONS.get(this);
        const res = {
            tree: {},
            functions: {}
        }
        for (const [name, node] of tree) {
            res.tree[name] = node.toJSON();
        }
        for (const [name, fn] of functions) {
            res.functions[name] = fn.toJSON();
        }
        return res;
    }

}
