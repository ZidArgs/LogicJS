import TreeLogicWrapper from "./TreeLogicWrapper.js";

function getAbsolutePath(path) {
    return new URL(path, import.meta.url);
}

async function importModule(url) {
    const modulePath = getAbsolutePath(url);
    return import(modulePath)
        .then(res => {
            try {
                const {default: def, ...other} = res ?? {};
                return [def, other];
            } catch(err) {
                throw new Error(`Error extracting module\n${err}`)
            }
        })
        .catch(err => {throw new Error(`Error appending module "${url}" ${err}`)});
}

async function getProcessor() {
    const workerPath = getAbsolutePath("./worker/TreeLogic.worker.js");
    const name = "TreeLogic";
    const type = "module";
    if ("SharedWorker" in window) {
        const worker = (new SharedWorker(workerPath, {name, type})).port;
        return new TreeLogicWrapper(worker);
    }
    if ("Worker" in window) {
        const worker = new Worker(workerPath, {name, type});
        return new TreeLogicWrapper(worker);
        
    }
    const [TreeLogicFakeWorker] = await importModule("./TreeLogicFakeWorker.js");
    return TreeLogicFakeWorker;
}

const LogicProcessor = await getProcessor();
LogicProcessor.addEventListener("logic", (event) => {
    console.log("logic", event.data);
});

export default LogicProcessor;
