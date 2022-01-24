import TreeLogicWrapper from "./TreeLogicWrapper.js";

const SUPPORTS_WORKER_TYPE = (() => {
    let supports = false;
    const tester = {
        get type() {
            supports = true;
            return "module";
        }
    };
    try {
        const worker = new Worker("blob://", tester);
        worker.terminate();
    } catch(err) {
        err
    }
    return supports;
})();

function getAbsolutePath(path) {
    return new URL(path, import.meta.url);
}

async function importModule(url) {
    const modulePath = getAbsolutePath(url);
    return import(modulePath)
        .then(res => {
            try {
                const {
                    default: def, ...other
                } = res ?? {};
                return [def, other];
            } catch(err) {
                throw new Error(`Error extracting module\n${err}`)
            }
        })
        .catch(err => { throw new Error(`Error appending module "${url}" ${err}`) });
}

export async function getProcessor(noWorker) {
    const workerPath = getAbsolutePath("./worker/TreeLogic.w.js");
    const name = "TreeLogic";
    const type = "module";
    if (!noWorker) {
        if ("SharedWorker" in window && SUPPORTS_WORKER_TYPE) {
            const worker = new SharedWorker(workerPath, {
                name,
                type
            });
            worker.onerror
            worker.port.start();
            return new TreeLogicWrapper(worker.port);
        }
        if ("Worker" in window && SUPPORTS_WORKER_TYPE) {
            const worker = new Worker(workerPath, {
                name,
                type
            });
            return new TreeLogicWrapper(worker);
        }
    }
    const [TreeLogicFakeWorker] = await importModule("./TreeLogicFakeWorker.js");
    return TreeLogicFakeWorker;
}

export default await getProcessor();
