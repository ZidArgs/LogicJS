const WORKER = new WeakMap();
const MSG_RES = new WeakMap();
const MSG_CNT = new WeakMap();

export default class TreeLogic extends EventTarget {

    constructor(worker) {
        super();
        const msgRes = new Map();
        WORKER.set(this, worker);
        MSG_RES.set(this, msgRes);
        MSG_CNT.set(this, 0);
        worker.addEventListener("message", (event) => {
            const {
                id, type = "", data = {}
            } = event.data;
            if (type == "traverse") {
                const ev = new Event("logic");
                ev.data = data;
                this.dispatchEvent(ev);
            } else if (msgRes.has(id)) {
                const resolve = msgRes.get(id);
                resolve(data);
            } else {
                console.warn("unknown event", event.data);
            }
        });
    }

    /*#*/__get(type, data) {
        return new Promise((resolve) => {
            const msg = {
                action: "get",
                type,
                data
            };
            const msgCnt = MSG_CNT.get(this);
            MSG_CNT.set(this, msgCnt + 1);
            const msgRes = MSG_RES.get(this);
            msgRes.set(msgCnt, resolve);
            msg.id = msgCnt;
            const worker = WORKER.get(this);
            worker.postMessage(msg)
        });
    }

    /*#*/__post(type, data) {
        return new Promise((resolve) => {
            const msg = {
                action: "post",
                type,
                data
            };
            const worker = WORKER.get(this);
            worker.postMessage(msg);
            resolve();
        });
    }

    async setDebug(value) {
        await this.__post("debug", {
            value
        });
    }

    async getDebug() {
        return await this.__get("debug");
    }

    async clearGraph() {
        await this.__post("clearGraph");
    }

    async load(config) {
        await this.__post("load", {
            config
        });
    }
    
    async setEdge(source, target, value) {
        await this.__post("setEdge", {
            source,
            target,
            value
        });
    }
    
    async setMixin(name, value) {
        await this.__post("setMixin", {
            name,
            value
        });
    }
    
    async clearRedirects() {
        await this.__post("clearRedirects");
    }
    
    async setRedirect(source, target, reroute) {
        await this.__post("setRedirect", {
            source,
            target,
            reroute
        });
    }
    
    async setAllRedirects(redirects) {
        await this.__post("setAllRedirects", {
            redirects
        });
    }
    
    async getRedirect(source, target) {
        return await this.__get("getRedirect", {
            source,
            target
        });
    }
    
    async getEdges() {
        return await this.__get("getEdges");
    }
    
    async getTargetNodes() {
        return await this.__get("getTargetNodes");
    }
    
    async addReachable(target) {
        await this.__post("addReachable", {
            target
        });
    }
    
    async deleteReachable(target) {
        await this.__post("deleteReachable", {
            target
        });
    }
    
    async clearReachables() {
        await this.__post("clearReachables");
    }
    
    async traverse(startNode, startData) {
        await this.__post("traverse", {
            startNode,
            startData
        });
    }
    
    async set(key, value) {
        await this.__post("set", {
            key,
            value
        });
    }
    
    async setAll(values) {
        await this.__post("setAll", {
            values
        });
    }
    
    async get(ref) {
        return await this.__get("get", {
            ref
        });
    }
    
    async getAll() {
        return await this.__get("getAll");
    }
    
    async has(ref) {
        return await this.__get("has", {
            ref
        });
    }
    
    async reset() {
        await this.__post("reset");
    }
    
    async isDirty() {
        return await this.__get("isDirty");
    }
    
}
