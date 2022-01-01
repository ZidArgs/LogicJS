const SOURCE = new WeakMap();
const TARGET = new WeakMap();
const CONDITION = new WeakMap();
const FILTER = new WeakMap();

export default class Edge {

    constructor(source, target, condition, filter) {
        SOURCE.set(this, source);
        TARGET.set(this, target);
        CONDITION.set(this, condition);
        FILTER.set(this, filter);
    }

    getCondition() {
        return CONDITION.get(this);
    }

    getFilter() {
        return FILTER.get(this);
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
