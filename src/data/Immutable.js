import {deepClone} from "../util/DeepClone.js";

const HANDLER = {
    get(target, property) {
        return target[property];
    },
    set() {
        return false;
    },
    deleteProperty() {
        return false;
    },
    defineProperty() {
        return false;
    },
    preventExtensions() {
        return false;
    },
    setPrototypeOf() {
        return false;
    }
};

const TYPE_TAG = Symbol("Immutable");

/**
 * Create an immutable Object utilizing Proxy
 * @param {Object} data an object to immute, primitives can not be immuted
 * @returns {Proxy} the Proxy immuting the data
 */
export function immute(data) {
    if (data != null && typeof data == "object" && !data[TYPE_TAG]) {
        if (Array.isArray(data)) {
            const res = data.map(immute);
            const proxy = new Proxy(res, HANDLER);
            Object.defineProperty(res, TYPE_TAG, {value: true});
            return proxy;
        }
        if (data.constructor == Object) {
            const res = {};
            for (const key in data) {
                const value = data[key];
                res[key] = immute(value);
            }
            const proxy = new Proxy(res, HANDLER);
            Object.defineProperty(res, TYPE_TAG, {value: true});
            return proxy;
        }
    }
    return data;
}

export function unImmute(data) {
    if (data != null && typeof data == "object") {
        if (data[TYPE_TAG]) {
            return deepClone(data);
        }
        if (Array.isArray(data)) {
            return data.map(unImmute);
        }
        if (data.constructor == Object) {
            const res = {};
            for (const key in data) {
                const value = data[key];
                res[key] = unImmute(value);
            }
            return res;
        }
    }
    return data;
}
