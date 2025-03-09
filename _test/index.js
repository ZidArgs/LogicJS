import DebugValues from "/LogicJS/enum/DebugValues.js";
import DebugOptions from "/LogicJS/state/DebugOptions.js";
import LogicProcessor from "/LogicJS/processor/LogicProcessor.js";

import FileLoader from "./util/FileLoader.js";
import {
    traverseDataMapForcedReachableData, traverseDataMapHasData, traverseDataMapUpdateData
} from "./util/TraverseDataHandler.js";
import {
    traverseDataMapForcedReachableData as traverseDataMapForcedReachableDataOOT,
    traverseDataMapHasData as traverseDataMapHasDataOOT,
    traverseDataMapUpdateData as traverseDataMapUpdateDataOOT
} from "./util/TraverseDataHandlerOOT.js";
import {
    isEqual
} from "./util/Comparator.js";

const logicProcessor = new LogicProcessor();

const WANT_OUTPUT_LOG = [];

async function printResult(result) {
    console.log("result", result);
    const output = await logicProcessor.getAllOutput();
    console.log("output", output);
    for (const key of WANT_OUTPUT_LOG) {
        console.log(key, output[key]);
    }
}

async function loadLogic(file) {
    logicProcessor.reset();
    const logic = await FileLoader.json(file);
    logicProcessor.program.load(logic);
}

// ------------ SIMPLE ---------------------

const START_DATA_SIMPLE = {
    foobar: "barfoo"
};
const START_VALUES_SIMPLE = {
    test_1: 1,
    test_2: 1,
    test_3: 1
};

async function runTestSimple() {
    console.group("RUN LOGIC TEST - SIMPLE");

    console.time("INIT LOGIC");
    await loadLogic("logic.simple.json");
    console.timeEnd("INIT LOGIC");

    console.time("SET INPUT");
    logicProcessor.setAllInput(START_VALUES_SIMPLE);
    console.timeEnd("SET INPUT");

    console.time("TRAVERSE LOGIC");
    const result = logicProcessor.execute("root", START_DATA_SIMPLE);
    console.timeEnd("TRAVERSE LOGIC");

    await printResult(result);

    console.groupEnd("RUN LOGIC TEST - SIMPLE");
}

async function runTestSimpleDebug() {
    console.group("RUN LOGIC TEST - SIMPLE DEBUG");

    DebugOptions
        .set(DebugValues.LOGIC_CHANGES)
        .set(DebugValues.MEMORY_CHANGES)
        .set(DebugValues.REDIRECT_CHANGES)
        .set(DebugValues.EXECUTE_LOGIC)
        .set(DebugValues.TRAVERSE_GRAPH);

    await loadLogic("logic.simple.json");

    logicProcessor.setAllInput(START_VALUES_SIMPLE);

    logicProcessor.execute("root", START_DATA_SIMPLE);

    DebugOptions
        .unset(DebugValues.LOGIC_CHANGES)
        .unset(DebugValues.MEMORY_CHANGES)
        .unset(DebugValues.REDIRECT_CHANGES)
        .unset(DebugValues.EXECUTE_LOGIC)
        .unset(DebugValues.TRAVERSE_GRAPH);

    console.groupEnd("RUN LOGIC TEST - SIMPLE DEBUG");
}

document.getElementById("runlogic_simple").onclick = runTestSimple;
document.getElementById("runlogic_simple_debug").onclick = runTestSimpleDebug;

// ------------ COMPLEX ---------------------

const START_DATA_COMPLEX = {
    state: "a",
    a: true,
    b: false,
    c: false
};
const START_VALUES_COMPLEX = {
    "option[start_state]": "a",
    "item[foobar]": 1,
    "item[barfoo]": 1,
    "item[farboo]": 0
};

async function runTestComplex() {
    console.group("RUN LOGIC TEST - COMPLEX");

    console.time("INIT LOGIC");
    await loadLogic("logic.complex.json");
    console.timeEnd("INIT LOGIC");

    console.time("REGISTER TRAVERSE DATA HANDLER");
    logicProcessor.traverseDataHandler.setGetForcedReachableDataFunction(traverseDataMapForcedReachableData);
    logicProcessor.traverseDataHandler.setHasDataFunction(traverseDataMapHasData);
    logicProcessor.traverseDataHandler.setUpdateDataFunction(traverseDataMapUpdateData);
    console.timeEnd("REGISTER TRAVERSE DATA HANDLER");

    console.time("SET INPUT");
    logicProcessor.setAllInput(START_VALUES_COMPLEX);
    console.timeEnd("SET INPUT");

    console.time("TRAVERSE LOGIC");
    const result = logicProcessor.execute("root", START_DATA_COMPLEX);
    console.timeEnd("TRAVERSE LOGIC");

    await printResult(result);

    console.groupEnd("RUN LOGIC TEST - COMPLEX");
}

async function runTestComplexDebug() {
    console.group("RUN LOGIC TEST - COMPLEX DEBUG");

    DebugOptions
        .set(DebugValues.LOGIC_CHANGES)
        .set(DebugValues.MEMORY_CHANGES)
        .set(DebugValues.REDIRECT_CHANGES)
        .set(DebugValues.EXECUTE_LOGIC)
        .set(DebugValues.TRAVERSE_GRAPH);

    await loadLogic("logic.complex.json");

    logicProcessor.traverseDataHandler.setGetForcedReachableDataFunction(traverseDataMapForcedReachableData);
    logicProcessor.traverseDataHandler.setHasDataFunction(traverseDataMapHasData);
    logicProcessor.traverseDataHandler.setUpdateDataFunction(traverseDataMapUpdateData);

    logicProcessor.setAllInput(START_VALUES_COMPLEX);

    logicProcessor.execute("root", START_DATA_COMPLEX);

    DebugOptions
        .unset(DebugValues.LOGIC_CHANGES)
        .unset(DebugValues.MEMORY_CHANGES)
        .unset(DebugValues.REDIRECT_CHANGES)
        .unset(DebugValues.EXECUTE_LOGIC)
        .unset(DebugValues.TRAVERSE_GRAPH);

    console.groupEnd("RUN LOGIC TEST - COMPLEX DEBUG");
}

document.getElementById("runlogic_complex").onclick = runTestComplex;
document.getElementById("runlogic_complex_debug").onclick = runTestComplexDebug;

// ------------ OOT ---------------------

const START_DATA_OOT = {
    age: "child",
    day: true,
    night: false,
    dampe: false
};
const START_VALUES_OOT = await FileLoader.json("oot.data.json");
const COLLECTIBLES_VALUES_OOT = await FileLoader.json("oot.collectibles.json");
const EXPECTED_VALUES_OOT = await FileLoader.json("oot.expected.json");

async function runTestOOT() {
    console.group("RUN LOGIC TEST - OOT");

    console.time("INIT LOGIC");
    await loadLogic("oot.logic.json");

    for (const [locationName, valueName] of Object.entries(COLLECTIBLES_VALUES_OOT)) {
        logicProcessor.setCollectible(locationName, valueName);
    }

    logicProcessor.program.setInjectedFunction("function[has_all_notes_for_song]", ({val, params} = {}) => {
        return val(`calculated[has_all_notes_for_song(${params.song})]`);
    });
    console.timeEnd("INIT LOGIC");

    console.time("REGISTER TRAVERSE DATA HANDLER");
    logicProcessor.traverseDataHandler.setGetForcedReachableDataFunction(traverseDataMapForcedReachableDataOOT);
    logicProcessor.traverseDataHandler.setHasDataFunction(traverseDataMapHasDataOOT);
    logicProcessor.traverseDataHandler.setUpdateDataFunction(traverseDataMapUpdateDataOOT);
    console.timeEnd("REGISTER TRAVERSE DATA HANDLER");

    console.time("SET INPUT");
    logicProcessor.setAllInput(START_VALUES_OOT);
    console.timeEnd("SET INPUT");

    console.time("TRAVERSE LOGIC");
    const result = logicProcessor.execute("region[root]", START_DATA_OOT);
    console.timeEnd("TRAVERSE LOGIC");

    await printResult(result);
    const output = await logicProcessor.getAllOutput();
    console.log("as expected", isEqual(output, EXPECTED_VALUES_OOT));

    console.groupEnd("RUN LOGIC TEST - OOT");
}

async function runTestOOTDebug() {
    console.group("RUN LOGIC TEST - OOT DEBUG");

    DebugOptions
        .set(DebugValues.LOGIC_CHANGES)
        .set(DebugValues.MEMORY_CHANGES)
        .set(DebugValues.REDIRECT_CHANGES)
        .set(DebugValues.EXECUTE_LOGIC)
        .set(DebugValues.TRAVERSE_GRAPH);

    console.time("INIT LOGIC");
    await loadLogic("oot.logic.json");

    for (const [locationName, valueName] of Object.entries(COLLECTIBLES_VALUES_OOT)) {
        logicProcessor.setCollectible(locationName, valueName);
    }

    logicProcessor.program.setInjectedFunction("function[has_all_notes_for_song]", ({val, params} = {}) => {
        return val(`calculated[has_all_notes_for_song(${params.song})]`);
    });
    console.timeEnd("INIT LOGIC");

    logicProcessor.traverseDataHandler.setGetForcedReachableDataFunction(traverseDataMapForcedReachableData);
    logicProcessor.traverseDataHandler.setHasDataFunction(traverseDataMapHasData);
    logicProcessor.traverseDataHandler.setUpdateDataFunction(traverseDataMapUpdateData);

    logicProcessor.setAllInput(START_VALUES_OOT);

    const result = logicProcessor.execute("region[root]", START_DATA_OOT);
    await printResult(result);
    console.log("as expected", isEqual(result, EXPECTED_VALUES_OOT));

    DebugOptions
        .unset(DebugValues.LOGIC_CHANGES)
        .unset(DebugValues.MEMORY_CHANGES)
        .unset(DebugValues.REDIRECT_CHANGES)
        .unset(DebugValues.EXECUTE_LOGIC)
        .unset(DebugValues.TRAVERSE_GRAPH);

    console.groupEnd("RUN LOGIC TEST - OOT DEBUG");
}

document.getElementById("runlogic_oot").onclick = runTestOOT;
document.getElementById("runlogic_oot_debug").onclick = runTestOOTDebug;
