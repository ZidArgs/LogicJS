import DebugValues from "/LogicJS/enum/DebugValues.js";
import DebugOptions from "/LogicJS/state/DebugOptions.js";
import LogicProcessor from "/LogicJS/processor/LogicProcessor.js";
import FileLoader from "./util/FileLoader.js";

const logicProcessor = new LogicProcessor();

const WANT_OUTPUT_LOG = [];

const START_VALUES = {
    test_1: 1,
    test_2: 1,
    test_3: 1
};

async function printResult(result) {
    console.log("result", result);
    const output = await logicProcessor.getAllOutput();
    console.log("output", output);
    for (const key of WANT_OUTPUT_LOG) {
        console.log(key, output[key]);
    }
}

async function loadLogic() {
    const logic = await FileLoader.json(`logic.simple.json`);
    logicProcessor.program.load(logic);
}

// ---------------------------------

async function runTest() {
    console.group("RUN LOGIC TEST");

    console.time("INIT LOGIC");
    await loadLogic();
    console.timeEnd("INIT LOGIC");

    console.time("SET INPUT");
    logicProcessor.setAllInput(START_VALUES);
    console.timeEnd("SET INPUT");

    console.time("TRAVERSE LOGIC");
    const result = logicProcessor.execute("root", {foobar: "barfoo"});
    console.timeEnd("TRAVERSE LOGIC");

    printResult(result);

    console.groupEnd("RUN LOGIC TEST");
}

async function runTestDebug() {
    DebugOptions
        .set(DebugValues.LOGIC_CHANGES)
        .set(DebugValues.MEMORY_CHANGES)
        .set(DebugValues.REDIRECT_CHANGES)
        .set(DebugValues.EXECUTE_LOGIC)
        .set(DebugValues.TRAVERSE_GRAPH);

    await loadLogic();

    logicProcessor.setAllInput(START_VALUES);

    logicProcessor.execute("root", {foobar: "barfoo"});

    DebugOptions
        .unset(DebugValues.LOGIC_CHANGES)
        .unset(DebugValues.MEMORY_CHANGES)
        .unset(DebugValues.REDIRECT_CHANGES)
        .unset(DebugValues.EXECUTE_LOGIC)
        .unset(DebugValues.TRAVERSE_GRAPH);
}

document.getElementById("runlogic").onclick = runTest;
document.getElementById("runlogic_debug").onclick = runTestDebug;
