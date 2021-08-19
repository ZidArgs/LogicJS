const WORKER = new WeakMap();

export default class TreeLogic {

    constructor(worker) {
        WORKER.set(this, worker);
    }

    set debug(value) {

    }

    get debug() {
        return 1;
    }

    clearGraph() {

    }

    load(config) {

    }
    
    setEdge(source, target, value) {

    }
    
    setMixin(name, value) {

    }
    
    clearRedirects() {

    }
    
    setRedirect(source, target, reroute) {

    }
    
    setAllRedirects(redirects) {

    }
    
    getRedirect(source, target) {

    }
    
    getEdges() {

    }
    
    getTargetNodes() {

    }
    
    addReachable(target) {

    }
    
    deleteReachable(target) {

    }
    
    clearReachables() {

    }
    
    traverse(startNode) {

    }
    
    set(key, value) {

    }
    
    setAll(values) {

    }
    
    get(ref) {

    }
    
    getAll() {

    }
    
    has(ref) {

    }
    
    reset() {

    }
    
    isDirty() {

    }
    
}
