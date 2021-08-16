import Processor from "./logic/Processor.js";

function sendMessage(target, data) {
    const ev = new Event("message");
    ev.data = data;
    target.dispatchEvent(ev);
}

class TreeLogicFakeWorker extends EventTarget {
    
    postMessage({type = "", data = {}} = {}) {
        switch (type) {
            case "clearGraph": {
                Processor.clearGraph();
            } break;
            case "load": {
                Processor.load(data);
            } break;
            // TODO
            case "getAll": {
                const res = self.LOGIC_PROCESSOR.getAll();
                sendMessage(this, {type, data: res});
            } break;
        }
    }

}

export default new TreeLogicFakeWorker();
