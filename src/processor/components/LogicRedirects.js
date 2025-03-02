import DebugValues from "../../enum/DebugValues.js";
import DebugOptions from "../../state/DebugOptions.js";
import Edge from "./graph/components/Edge.js";

const LOG_CHANGE_REDIRECT = "GRAPH LOGIC REDIRECT CHANGE";
const LOG_RESET_REDIRECT = "GRAPH LOGIC REDIRECT RESET";

export default class LogicRedirects {

    #redirects = new Map();

    set(source, target, reroute) {
        const fromEdge = Edge.createEdgeId(source, target);
        const toNode = `${reroute}`;

        if (DebugOptions.has(DebugValues.REDIRECT_CHANGES)) {
            console.groupCollapsed(LOG_CHANGE_REDIRECT);
            console.log(fromEdge, toNode);
        }

        if (reroute == null) {
            this.#redirects.delete(fromEdge);
        } else {
            this.#redirects.set(fromEdge, toNode);
        }

        if (DebugOptions.has(DebugValues.REDIRECT_CHANGES)) {
            console.groupEnd(LOG_CHANGE_REDIRECT);
        }
    }

    setAll(redirects) {
        if (DebugOptions.has(DebugValues.REDIRECT_CHANGES)) {
            console.groupCollapsed(LOG_CHANGE_REDIRECT);
        }

        for (const {source, target, reroute} of redirects) {
            const fromEdge = Edge.createEdgeId(source, target);
            const toNode = `${reroute}`;

            if (DebugOptions.has(DebugValues.REDIRECT_CHANGES)) {
                console.log(fromEdge, toNode);
            }
            if (reroute == null) {
                this.#redirects.delete(fromEdge);
            } else {
                this.#redirects.set(fromEdge, toNode);
            }
        }

        if (DebugOptions.has(DebugValues.REDIRECT_CHANGES)) {
            console.groupEnd(LOG_CHANGE_REDIRECT);
        }
    }

    get(source, target) {
        const fromEdge = Edge.createEdgeId(source, target);

        if (this.#redirects.has(fromEdge)) {
            return this.#redirects.get(fromEdge);
        }
        return target;
    }

    getAll() {
        const res = {};
        for (const [key, value] of this.#redirects) {
            res[key] = value;
        }
        return res;
    }

    clear() {
        if (DebugOptions.has(DebugValues.REDIRECT_CHANGES)) {
            console.log(LOG_RESET_REDIRECT);
        }
        this.#redirects.clear();
    }

}
