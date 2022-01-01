import Processor from "./processor/Processor.js";

const PROCESSOR = new Processor();

class TreeLogicFakeWorker extends EventTarget {

    async setDebug(value) {
        PROCESSOR.debug = value;
    }

    async getDebug() {
        const res = PROCESSOR.debug;
        return res;
    }

    async clearGraph() {
        PROCESSOR.clearGraph();
    }

    async load(config) {
        PROCESSOR.load(config);
    }
    
    async setEdge(source, target, value) {
        PROCESSOR.setEdge(source, target, value);
    }
    
    async setMixin(name, value) {
        PROCESSOR.setMixin(name, value);
    }
    
    async clearRedirects() {
        PROCESSOR.clearRedirects();
    }
    
    async setRedirect(source, target, reroute) {
        PROCESSOR.setRedirect(source, target, reroute);
    }
    
    async setAllRedirects(redirects) {
        PROCESSOR.setAllRedirects(redirects);
    }
    
    async getRedirect(source, target) {
        const res = PROCESSOR.getRedirect(source, target);
        return res;
    }
    
    async getEdges() {
        const res = PROCESSOR.getEdges();
        return res;
    }
    
    async getTargetNodes() {
        const res = PROCESSOR.getTargetNodes();
        return res;
    }
    
    async addReachable(target) {
        PROCESSOR.addReachable(target);
    }
    
    async deleteReachable(target) {
        PROCESSOR.deleteReachable(target);
    }
    
    async clearReachables() {
        PROCESSOR.clearReachables();
    }
    
    async traverse(startNode) {
        const res = PROCESSOR.traverse(startNode);
        const ev = new Event("logic");
        ev.data = res;
        this.dispatchEvent(ev);
    }
    
    async set(key, value) {
        PROCESSOR.set(key, value);
    }
    
    async setAll(values) {
        PROCESSOR.setAll(values);
    }
    
    async get(ref) {
        const res = PROCESSOR.get(ref);
        return res;
    }
    
    async getAll() {
        const res = PROCESSOR.getAll();
        return res;
    }
    
    async has(ref) {
        const res = PROCESSOR.has(ref);
        return res;
    }
    
    async reset() {
        PROCESSOR.reset();
    }
    
    async isDirty() {
        const res = PROCESSOR.isDirty();
        return res;
    }
    
}

export default new TreeLogicFakeWorker();
