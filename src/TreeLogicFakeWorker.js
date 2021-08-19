import Processor from "./util/logic/Processor.js";

const PROCESSOR = new Processor();

function sendMessage(target, data) {
    const ev = new Event("message");
    ev.data = data;
    target.dispatchEvent(ev);
}

class TreeLogicFakeWorker extends EventTarget {
    
    postMessage({type = "", data = {}} = {}) {
        switch (type) {
            case "set debug": {
                const {value} = data;
                PROCESSOR.debug = value;
            } break;
            case "get debug": {
                const res = PROCESSOR.debug;
                sendMessage(this, {type, data: res});
            } break;
            case "clearGraph": {
                PROCESSOR.clearGraph();
            } break;
            case "load": {
                const {config} = data;
                PROCESSOR.load(config);
            } break;
            case "setEdge": {
                const {target, value} = data;
                PROCESSOR.setEdge(target, value);
            } break;
            case "setMixin": {
                const {name, value} = data;
                PROCESSOR.setMixin(name, value);
            } break;
            case "clearRedirects": {
                PROCESSOR.clearRedirects();
            } break;
            case "setRedirect": {
                const {source, target, reroute} = data;
                PROCESSOR.setRedirect(source, target, reroute);
            } break;
            case "setAllRedirects": {
                const {redirects} = data;
                PROCESSOR.setAllRedirects(redirects);
            } break;
            case "getRedirect": {
                const {source, target} = data;
                const res = PROCESSOR.getRedirect(source, target);
                sendMessage(this, {type, data: res});
            } break;
            case "getEdges": {
                const res = PROCESSOR.getEdges();
                sendMessage(this, {type, data: res});
            } break;
            case "getTargetNodes": {
                const res = PROCESSOR.getTargetNodes();
                sendMessage(this, {type, data: res});
            } break;
            case "addReachable": {
                const {target} = data;
                PROCESSOR.addReachable(target);
            } break;
            case "deleteReachable": {
                const {target} = data;
                PROCESSOR.deleteReachable(target);
            } break;
            case "clearReachables": {
                PROCESSOR.clearReachables();
            } break;
            case "traverse": {
                const {startNode} = data;
                const res = PROCESSOR.traverse(startNode);
                sendMessage(this, {type, data: res});
            } break;
            case "set": {
                const {key, value} = data;
                PROCESSOR.set(key, value);
            } break;
            case "setAll": {
                const {values} = data;
                PROCESSOR.setAll(values);
            } break;
            case "get": {
                const {ref} = data;
                const res = PROCESSOR.get(ref);
                sendMessage(this, {type, data: res});
            } break;
            case "getAll": {
                const res = PROCESSOR.getAll();
                sendMessage(this, {type, data: res});
            } break;
            case "has": {
                const {ref} = data;
                const res = PROCESSOR.has(ref);
                sendMessage(this, {type, data: res});
            } break;
            case "reset": {
                PROCESSOR.reset();
            } break;
            case "isDirty": {
                const res = PROCESSOR.isDirty();
                sendMessage(this, {type, data: res});
            } break;
        }
    }

}

export default new TreeLogicFakeWorker();
