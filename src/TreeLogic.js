import Import from "./util/import/Import.js";
import Path from "./util/Path.js";

const path = new Path(import.meta.url);

async function getRegistry() {
    if ("SharedWorker" in window) {
        return await Import.module("./worker/SharedWorkerRegistry.js");
    }
    if ("Worker" in window) {
        return await Import.module("./worker/WorkerRegistry.js");
    }
}

async function registerWorker() {
    const registry = await getRegistry();
    if (registry != null) {
        const workerPath = path.getAbsolute("./TreeLogic.worker.js");
        return registry.register("TreeLogic", workerPath)
    } else {
        return await Import.module("./TreeLogicFakeWorker.js");
    }
}

const WORKER = registerWorker();

class TreeLogic extends EventTarget {

    constructor() {
        super();
        if (WORKER) {
            WORKER.onmessage = function(e) {
                const payload = e.data;
                this.onModuleEvent(payload);
            }.bind(this);
        }
    }

    async triggerModuleEvent(payload) {
        if (WORKER) {
            WORKER.postMessage(payload);
        }
    }

}

export default new TreeLogic();
