const SOURCE = new WeakMap();
const TARGET = new WeakMap();
const LOGIC = new WeakMap();
const DATA = new WeakMap();

export const EDGE_PATTERN = /^([^ ]+) -> ([^ ]+)$/;

export default class Edge {

    constructor(source, target, logic, data) {
        SOURCE.set(this, source);
        TARGET.set(this, target);
        LOGIC.set(this, logic);
        DATA.set(this, data);
    }

    getLogic() {
        return LOGIC.get(this);
    }

    getData() {
        return DATA.get(this);
    }

    getTarget() {
        return TARGET.get(this);
    }

    getSource() {
        return SOURCE.get(this);
    }

    toString() {
        return `${SOURCE.get(this)} => ${TARGET.get(this)}`;
    }

}
