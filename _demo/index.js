import FileLoader from "./util/FileLoader.js";
import Generator from "../src/generator/Generator.js";
import LogicProcessor from "../src/LogicProcessor.js";

const WANT_OUTPUT_LOG = [
    "logic.location.lake.c_fishing_adult",
    "logic.location.woods.c_warp"
];
const START_VALUES = {
    "option.starting_age": "child",
    "option.light_arrow_cutscene": "light_arrow_cutscene_vanilla",
    "option.consider_buyable": false,
    "option.bombchu_logic": false,
    "option.keysanity_small": "keysanity_small_ignore",
    "option.keysanity_boss": "keysanity_boss_ignore",
    "option.entrance_shuffle": true,
    "option.scrubsanity": false,
    "option.cowsanity": false,
    "option.beansanity": false,
    "option.skullsanity": false,
    "option.doors_open_forest": "doors_open_forest_open",
    "option.doors_open_mountain": false,
    "option.doors_open_temple": true,
    "option.doors_open_zora": "doors_open_zora_closed",
    "option.gerudo_fortress_open": "gerudo_fortress_open_default",
    "option.ganon_castle_open": "ganon_castle_open_default",
    "option.trade_sequence_start_item": 1,
    "option.forest_trial": true,
    "option.water_trial": true,
    "option.shadow_trial": true,
    "option.fire_trial": true,
    "option.light_trial": true,
    "option.spirit_trial": true,
    "option.ganon_boss_door_open": false,
    "skip.lens_required": "lens_required_default",
    "skip.hidden_grotto_no_agony": false,
    "skip.fewer_tunic": false,
    "skip.child_deadhand": false,
    "skip.man_on_roof": false,
    "skip.dodongo_staircase": false,
    "skip.dodongo_spike": false,
    "skip.gerudo_kitchen": false,
    "skip.deku_vine_gs": false,
    "skip.hammer_through_wall": false,
    "skip.botw_strength_sticks": false,
    "skip.fotmq_puzzle_bombchu": false,
    "skip.spt_child_bridge_bombchu": false,
    "skip.windmill_hp": false,
    "skip.crater_bean_hp": false,
    "skip.zora_cucco": false,
    "skip.gtgmq_silver_hook": false,
    "skip.fot_east_vines_hook": false,
    "skip.fotmq_well_hook": false,
    "skip.dm_bomb_strength": false,
    "skip.forest_adult_gs_hover": false,
    "skip.sptmq_frozen_nofire": false,
    "skip.fitmq_bosskey_nobow": false,
    "skip.zora_hover": false,
    "skip.wt_bosskey_noitem": false,
    "option.entrance_shuffle_dungeons": false,
    "item.ocarina": 1,
    "item.hookshot": 1
};

LogicProcessor.addEventListener("logic", async (event) => {
    const res = await LogicProcessor.getAll();
    console.log(res);
    for (const key of WANT_OUTPUT_LOG) {
        console.log(key, res[key]);
    }
});

async function loadLogic() {
    const logic = await FileLoader.json(`logic.json`);

    const generator = new Generator();
    generator.loadLogic(logic);
    const generatedLogic = generator.run();

    LogicProcessor.load(generatedLogic);
}

// ---------------------------------

async function initDebug() {
    LogicProcessor.setDebug("extended");

    await loadLogic();

    LogicProcessor.setAll(START_VALUES);

    LogicProcessor.traverse("region.root", {
        foobar: "barfoo"
    });

    LogicProcessor.setDebug(false);
}

async function init() {
    console.time("INIT LOGIC");
    await loadLogic();
    console.timeEnd("INIT LOGIC");

    LogicProcessor.setAll(START_VALUES);

    console.time("TRAVERSE LOGIC");
    LogicProcessor.traverse("region.root", {
        foobar: "barfoo"
    });
    console.timeEnd("TRAVERSE LOGIC");
}

document.getElementById("runlogic").onclick = init;
document.getElementById("runlogic_debug").onclick = initDebug;
