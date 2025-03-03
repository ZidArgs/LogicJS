import DataMap from "../data/DataMap.js";
import TraverseDataMap from "../processor/data/TraverseDataMap.js";
import LogicProgram from "../processor/components/LogicProgram.js";
import LogicStatementHelperFactory from "../processor/util/LogicStatementHelperFactory.js";

export default class LogicTester {

    #program = new LogicProgram();

    #memIn = new Map();

    #traverseDataMap = new TraverseDataMap();

    #logicStatementHelperFactory = new LogicStatementHelperFactory(this.#program, this.#memIn, this.#traverseDataMap);

    reset() {
        this.#program.clear();
        this.#memIn.clear();
    }

    resetMemory() {
        this.#memIn.clear();
    }

    get program() {
        return this.#program;
    }

    setInput(key, value) {
        this.#memIn.set(key, value);
    }

    setAllInput(values) {
        if (typeof values === "object" && values != null) {
            if (Symbol.iterator in Object(values)) {
                for (const [key, value] of value[Symbol.iterator]) {
                    this.#memIn.set(key, value);
                }
            } else {
                for (const [key, value] of Object.entries(value)) {
                    this.#memIn.set(key, value);
                }
            }
        }
    }

    testLogic(startData = {}) {
        return {
            edges: this.#executeEdges(startData),
            mixins: this.#executeFunctions(startData)
        };
    }

    /* all edges */
    #executeEdges(startData) {
        const allTargetNodes = this.#program.getAllTargetedNodes();
        const allTargetNodeNames = new Set();
        for (const node of allTargetNodes) {
            allTargetNodeNames.add(node.name);
        }

        this.#traverseDataMap.reset();

        const getValue = this.#logicStatementHelperFactory.createTraverseAndMemoryValueGetter();

        const queue = this.#program.getAllEdges();
        const success = new Set();
        const failed = new Set();
        const dataMap = new DataMap(startData);

        let changed = true;
        while (!!queue.length && !!changed) {
            changed = false;
            let elementCount = queue.length;
            while (elementCount--) {
                const edge = queue.shift();
                const condition = edge.logic;

                const getData = LogicStatementHelperFactory.createDataMapValueGetter(dataMap);
                const atResolver = this.#logicStatementHelperFactory.createAtResolver(getValue);
                const execute = this.#logicStatementHelperFactory.createLogicStatementExecutor(getValue, getData);

                const cRes = condition({
                    val: getValue,
                    data: getData,
                    exec: execute,
                    at: atResolver
                });

                if (cRes) {
                    changed = true;
                    const name = edge.getTarget().getName();
                    this.#traverseDataMap.setData(name, dataMap);
                    success.add(edge.toString());
                } else {
                    queue.push(edge);
                }
            }
        }

        for (const edge of queue) {
            failed.add(edge.toString());
        }

        return {success, failed};
    }

    /* all functions */
    #executeFunctions(startData) {
        const allTargetNodes = this.#program.getAllTargetedNodes();
        const allTargetNodeNames = new Set();
        for (const node of allTargetNodes) {
            allTargetNodeNames.add(node.name);
        }

        const success = new Set();
        const failed = new Set();

        const dataMap = new DataMap(startData);

        const getValue = this.#logicStatementHelperFactory.createTraverseAndMemoryValueGetter();

        const getData = LogicStatementHelperFactory.createDataMapValueGetter(dataMap);
        const atResolver = this.#logicStatementHelperFactory.createAtResolver(getValue);
        const execute = this.#logicStatementHelperFactory.createLogicStatementExecutor(getValue, getData);

        for (const [name, fn] of this.#program.getAllFunctions()) {
            const res = fn({
                val: getValue,
                data: getData,
                exec: execute,
                at: atResolver
            });

            if (res) {
                success.add(name);
            } else {
                failed.add(name);
            }
        }

        return {success, failed};
    }

}
