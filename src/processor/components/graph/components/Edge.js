import {
    immute
} from "../../../../data/Immutable.js";
import LogicStatement from "../../LogicStatement.js";
import AbstractNode from "./AbstractNode.js";

const EDGE_SPLITTER = " -> ";
const EDGE_PATTERN = /^([^\s]+) -> ([^\s]+)$/;

export default class Edge {

    #source;

    #target;

    #logic;

    #dataMutation;

    constructor(source, target, logic, dataMutation = {}) {
        if (!(source instanceof AbstractNode)) {
            throw new TypeError("source must be an instance of AbstractNode");
        }
        if (!(target instanceof AbstractNode)) {
            throw new TypeError("target must be an instance of AbstractNode");
        }
        if (!(logic instanceof LogicStatement)) {
            throw new TypeError("logic must be a ProcessorStatement");
        }
        if (typeof dataMutation !== "object" || Array.isArray(dataMutation)) {
            throw new TypeError("dataMutation must be a dict");
        }
        this.#source = source;
        this.#target = target;
        this.#logic = logic;
        if (dataMutation != null) {
            this.#dataMutation = immute(dataMutation);
        }
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

    set dataMutation(value = {}) {
        if (value == null || typeof value !== "object" || Array.isArray(value)) {
            throw new TypeError("dataMutation must be a dict");
        }
        this.#dataMutation = immute(value);
    }

    get dataMutation() {
        return this.#dataMutation;
    }

    serialize() {
        return {
            dataMutation: this.#dataMutation,
            logic: this.#logic.serialize().logic
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
