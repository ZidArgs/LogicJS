import PortHandler from "./PortHandler.js";
import Processor from "../processor/Processor.js";

const PROCESSOR = new Processor();

PortHandler.addEventListener("message", (event) => {
    const port = event.port;
    const {id, action, type = "", data = {}} = event.data;
    switch (type) {
        case "debug": {
            if (action == "post") {
                const {value} = data;
                PROCESSOR.debug = value;
            } else if (action == "get") {
                const res = PROCESSOR.debug;
                PortHandler.sendOne(port, {
                    id,
                    type,
                    data: res
                });
            }
        } break;
        case "clearGraph": {
            PROCESSOR.clearGraph();
        } break;
        case "load": {
            const {config} = data;
            PROCESSOR.load(config);
        } break;
        case "setEdge": {
            const {source, target, value} = data;
            PROCESSOR.setEdge(source, target, value);
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
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
        } break;
        case "getEdges": {
            const res = PROCESSOR.getEdges();
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
        } break;
        case "getTargetNodes": {
            const res = PROCESSOR.getTargetNodes();
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
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
            const {
                startNode,
                startData
            } = data;
            const res = PROCESSOR.traverse(startNode, startData);
            PortHandler.sendAll({
                type,
                data: res
            });
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
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
        } break;
        case "getAll": {
            const res = PROCESSOR.getAll();
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
        } break;
        case "has": {
            const {ref} = data;
            const res = PROCESSOR.has(ref);
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
        } break;
        case "reset": {
            PROCESSOR.reset();
        } break;
        case "isDirty": {
            const res = PROCESSOR.isDirty();
            PortHandler.sendOne(port, {
                id,
                type,
                data: res
            });
        } break;
    }
});
