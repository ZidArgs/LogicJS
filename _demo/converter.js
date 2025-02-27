import fs from "fs";
import path from "path";

import TreeLogic from "../src/generator/TreeLogic.js";

const __dirname = path.resolve();

const inLogicFile = path.join(__dirname, "/_demo/logic.json");
const outLogicFile = path.join(__dirname, "/_demo/logic.out.json");

const treeLogic = new TreeLogic();

treeLogic.loadLogic(JSON.parse(fs.readFileSync(inLogicFile).toString()), false);

fs.writeFileSync(outLogicFile, JSON.stringify(treeLogic.serialize(), null, 4));
