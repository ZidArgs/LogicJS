import LogicFunction from "../components/LogicFunction.js";
import Node from "../components/graph/Node.js";

export default class LogicGenerator {

    #nodes;

    #logicFunctions;

    getNode(name) {
        if (!this.#nodes.has(name)) {
            const node = new Node(name);
            this.#nodes.set(name, node);
            return node;
        }
        return this.#nodes.get(name);
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

    setFunction(name, logic, params) {
        this.#logicFunctions.set(name, new LogicFunction(logic, params));
    }

    removeFunction(name) {
        this.#logicFunctions.delete(name);
    }

    loadFunctions(config) {
        for (const name in config) {
            const fn = config[name];
            if (fn == null) {
                continue;
            }
            if (fn.logic == null) {
                this.setFunction(name, fn);
            } else {
                this.setFunction(name, fn.logic, fn.params);
            }
        }
    }

    loadLogic(config) {
        this.loadEdges(config.edges);
        this.loadFunctions(config.functions ?? config.mixins);
    }

    serialize() {
        const res = {
            edges: {},
            functions: {}
        };
        for (const [name, node] of this.#nodes) {
            if (!node.isLeaf()) {
                res.edges[name] = node.serialize();
            }
        }
        for (const [name, fn] of this.#logicFunctions) {
            const logicFunction = fn.serialize();
            res.functions[name] = logicFunction;
        }
        return res;
    }

}
