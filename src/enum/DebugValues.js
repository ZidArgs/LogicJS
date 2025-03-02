import Enum from "../data/Enum.js";

export default class DebugValues extends Enum {

    static LOGIC_CHANGES = new this("LOGIC_CHANGES");

    static MEMORY_CHANGES = new this("MEMORY_CHANGES");

    static REDIRECT_CHANGES = new this("REDIRECT_CHANGES");

    static EXECUTE_LOGIC = new this("EXECUTE_LOGIC");

    static TRAVERSE_GRAPH = new this("TRAVERSE_GRAPH");

}
