import ProcessorStatement from "../../ProcessorStatement.js";
import AbstractNode from "./AbstractNode.js";

const EDGE_SPLITTER = " -> ";
const EDGE_PATTERN = /^([^\s]+) -> ([^\s]+)$/;

export default class Edge {

    #source;

    #target;

    #logic;

    #transformData;

    constructor(source, target, logic, transformData) {
        if (!(source instanceof AbstractNode)) {
            throw new TypeError("source must be a descendant of AbstractNode");
        }
        if (!(target instanceof AbstractNode)) {
            throw new TypeError("target must be a descendant of AbstractNode");
        }
        if (!(logic instanceof ProcessorStatement)) {
            throw new TypeError("logic must be a ProcessorStatement");
        }
        this.#source = source;
        this.#target = target;
        this.#logic = logic;
        this.#transformData = transformData;
    }

    get source() {
        return this.#source;
    }

    get target() {
        return this.#target;
    }

    get logic() {
        return this.#logic;
    }

    get transformData() {
        return this.#transformData;
    }

    serialize() {
        return {
            logic: this.#logic,
            transformData: this.#transformData
        };
    }

    toString() {
        return Edge.createEdgeId(this.#source, this.#target);
    }

    toEntry() {
        return [this.#source, this.#target];
    }

    static createEdgeId(source, target) {
        return `${source}${EDGE_SPLITTER}${target}`;
    }

    static splitEdgeId(edgeId) {
        const patternResult = EDGE_PATTERN.exec(edgeId);
        if (patternResult != null) {
            const [, sourceName, targetName] = patternResult;
            return [sourceName, targetName];
        }
        return null;
    }

}
