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
            const {id, type = "", data = {}} = event.data;
            if (type == "exec") {
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

    #get(type, data) {
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

    #post(type, data) {
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
        await this.#post("debug", {value});
    }

    async getDebug() {
        return await this.#get("debug");
    }

    async clearLogic() {
        await this.#post("clearLogic");
    }

    async loadLogic(config) {
        await this.#post("loadLogic", {config});
    }

    async setEdge(source, target, value) {
        await this.#post("setEdge", {
            source,
            target,
            value
        });
    }

    async setMixin(name, value) {
        await this.#post("setMixin", {
            name,
            value
        });
    }

    async clearRedirects() {
        await this.#post("clearRedirects");
    }

    async setRedirect(source, target, reroute) {
        await this.#post("setRedirect", {
            source,
            target,
            reroute
        });
    }

    async setAllRedirects(redirects) {
        await this.#post("setAllRedirects", {redirects});
    }

    async getRedirect(source, target) {
        return await this.#get("getRedirect", {
            source,
            target
        });
    }

    async getEdges() {
        return await this.#get("getEdges");
    }

    async getTargetNodes() {
        return await this.#get("getTargetNodes");
    }

    async addReachable(target) {
        await this.#post("addReachable", {target});
    }

    async deleteReachable(target) {
        await this.#post("deleteReachable", {target});
    }

    async clearReachables() {
        await this.#post("clearReachables");
    }

    async exec(startNode, startData) {
        await this.#post("exec", {
            startNode,
            startData
        });
    }

    async set(key, value) {
        await this.#post("set", {
            key,
            value
        });
    }

    async setAll(values) {
        await this.#post("setAll", {values});
    }

    async get(ref) {
        return await this.#get("get", {ref});
    }

    async getAll() {
        return await this.#get("getAll");
    }

    async has(ref) {
        return await this.#get("has", {ref});
    }

    async reset() {
        await this.#post("reset");
    }

    async isDirty() {
        return await this.#get("isDirty");
    }

}
