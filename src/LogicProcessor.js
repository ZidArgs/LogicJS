import Import from "./util/import/Import.js";
import Path from "./util/Path.js";
import TreeLogicWrapper from "./TreeLogicWrapper.js";

const path = new Path(import.meta.url);

async function importModule(url) {
    const modulePath = path.getAbsolute(url);
    return await Import.module(modulePath);
}

async function getRegistry() {
    if ("SharedWorker" in window) {
        const [SharedWorkerRegistry] = await importModule("./worker/SharedWorkerRegistry.js");
        return SharedWorkerRegistry;
    }
    if ("Worker" in window) {
        const [WorkerRegistry] = await importModule("./worker/WorkerRegistry.js");
        return WorkerRegistry;
    }
}

async function getProcessor() {
    const registry = await getRegistry();
    if (registry != null) {
        const workerPath = path.getAbsolute("./TreeLogic.worker.js");
        const worker = registry.register("TreeLogic", workerPath);
        return new TreeLogicWrapper(worker);
    } else {
        const [TreeLogicFakeWorker] = await importModule("./TreeLogicFakeWorker.js");
        return TreeLogicFakeWorker;
    }
}

const LogicProcessor = await getProcessor();
LogicProcessor.addEventListener("logic", (event) => {
    console.log("logic", event.data);
});

export default LogicProcessor;
