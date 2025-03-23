import fs from "fs";
import path from "path";

import LogicGraph from "../src/processor/components/graph/LogicGraph.js";

const __dirname = path.resolve();

const inLogicFile = path.join(__dirname, "/_test/oot.logic.json");
const outLogicFile = path.join(__dirname, "/_test/oot.logic.json");

const logicGraph = new LogicGraph();

const logic = JSON.parse(fs.readFileSync(inLogicFile).toString());

logicGraph.load(logic.graph);

const convertedLogic = {
    version: logic.version,
    graph: logicGraph.serialize(),
    functions: logic.functions
};

fs.writeFileSync(outLogicFile, JSON.stringify(convertedLogic, null, 4) + "\n");
