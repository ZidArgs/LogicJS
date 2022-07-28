import FileLoader from "./util/FileLoader.js";
import LogicGenerator from "../src/generator/LogicGenerator.js";
import LogicGraph from "../src/processor/LogicGraph.js";

const logicGraph = new LogicGraph();

const WANT_OUTPUT_LOG = [
    "logic.location.lake.c_fishing_adult",
    "logic.location.woods.c_warp",
    "logic.location.kokiri.c_storm_grotto"
];
const START_VALUES = {
    "option.logic_rules": "logic_rules_glitchless",
    "option.starting_age": "child",
    "option.consider_buyable": false,
    "option.bombchu_logic": false,
    "option.skip_child_zelda": false,
    "option.skip_epona_race": false,
    "option.free_scarecrow": false,
    "option.keysanity_small": false,
    "option.track_keys": true,
    "option.track_bosskeys": true,
    "option.scrubsanity": false,
    "option.cowsanity": false,
    "option.shopsanity": "off",
    "option.beansanity": false,
    "option.shuffleMediCarpet": false,
    "option.doors_open_forest": "doors_open_forest_open",
    "option.doors_open_kakariko": "doors_open_kakariko_closed",
    "option.doors_open_temple": false,
    "option.doors_open_zora": "doors_open_zora_closed",
    "option.gerudo_fortress_open": "gerudo_fortress_open_default",
    "option.trade_sequence_start_item": 1,
    "option.big_poe_count": 10,
    "option.keysanity_small_old": "keysanity_small_ignore",
    "option.keysanity_boss_old": "keysanity_boss_ignore",
    "option.skullsanity": false,
    "option.sun_song_skulltuta": false,
    "option.shuffle_dungeons": false,
    "option.entrance_shuffle_interior": "entrance_shuffle_off",
    "option.shuffle_grottos": false,
    "option.shuffle_overworld": false,
    "option.shuffle_owls": false,
    "option.shuffle_warps": false,
    "option.shuffle_spawns": false,
    "option.mixed_entrance_pool": false,
    "option.light_arrow_cutscene": "light_arrow_cutscene_vanilla",
    "option.lacs_skulltulas": 100,
    "option.stone_count_lacs": 3,
    "option.medallion_count_lacs": 6,
    "option.dungeon_count_lacs": 9,
    "option.ganon_castle_open": "ganon_castle_open_default",
    "option.ganon_castle_skulltulas": 100,
    "option.stone_count_bridge": 3,
    "option.medallion_count_bridge": 6,
    "option.dungeon_count_bridge": 9,
    "option.ganon_boss_door_open": false,
    "option.trials_random": false,
    "option.number_trials": 6,
    "option.forest_trial": true,
    "option.water_trial": true,
    "option.shadow_trial": true,
    "option.fire_trial": true,
    "option.light_trial": true,
    "option.spirit_trial": true,
    "skip.lens_required": "lens_required_default",
    "skip.grottos_without_agony": true,
    "skip.rusted_switches": false,
    "skip.fewer_tunic_requirements": false,
    "skip.visible_collisions": false,
    "skip.adult_kokiri_gs": false,
    "skip.lost_woods_bridge": false,
    "skip.mido_backflip": false,
    "skip.lost_woods_gs_bean": false,
    "skip.lab_wall_gs": false,
    "skip.water_hookshot_entry": false,
    "skip.lab_diving": false,
    "skip.valley_crate_hovers": false,
    "skip.gerudo_kitchen": false,
    "skip.wasteland_crossing": false,
    "skip.lens_wasteland": false,
    "skip.reverse_wasteland": false,
    "skip.colossus_gs": false,
    "skip.kakariko_tower_gs": false,
    "skip.kakariko_rooftop_gs": false,
    "skip.man_on_roof": false,
    "skip.windmill_poh": false,
    "skip.graveyard_poh": false,
    "skip.child_dampe_race_poh": false,
    "skip.shadow_fire_arrow_entry": false,
    "skip.dmt_climb_hovers": false,
    "skip.dmt_bombable": false,
    "skip.dmt_soil_gs": false,
    "skip.trail_gs_lower_hookshot": false,
    "skip.trail_gs_lower_bean": false,
    "skip.trail_gs_upper": false,
    "skip.biggoron_bolero": false,
    "skip.trail_gs_lower_hovers": false,
    "skip.link_goron_dins": false,
    "skip.goron_city_leftmost": false,
    "skip.goron_city_pot_with_strength": false,
    "skip.goron_city_pot": false,
    "skip.child_rolling_with_strength": false,
    "skip.goron_grotto": false,
    "skip.crater_upper_to_lower": false,
    "skip.crater_bean_poh_with_hovers": false,
    "skip.zora_river_lower": false,
    "skip.zora_river_upper": false,
    "skip.zora_with_hovers": false,
    "skip.zora_with_cucco": false,
    "skip.domain_gs": false,
    "skip.king_zora_skip": false,
    "skip.castle_storms_gs": false,
    "skip.lens_botw": false,
    "skip.child_deadhand": false,
    "skip.botw_basement": false,
    "skip.botw_cage_gs": false,
    "skip.botw_mq_dead_hand_key": false,
    "skip.botw_mq_pits": false,
    "skip.deku_basement_gs": false,
    "skip.deku_b1_webs_with_bow": false,
    "skip.deku_b1_skip": false,
    "skip.deku_mq_compass_gs": false,
    "skip.deku_mq_log": false,
    "skip.dc_vines_gs": false,
    "skip.dc_scrub_room": false,
    "skip.dc_scarecrow_gs": false,
    "skip.dc_staircase": false,
    "skip.dc_slingshot_skip": false,
    "skip.dc_jump": false,
    "skip.dc_mq_child_bombs": false,
    "skip.dc_mq_eyes": false,
    "skip.dc_mq_child_back": false,
    "skip.jabu_scrub_jump_dive": false,
    "skip.jabu_boss_gs_adult": false,
    "skip.jabu_mq_sot_gs": false,
    "skip.lens_jabu_mq": false,
    "skip.ice_block_gs": false,
    "skip.ice_mq_scarecrow": false,
    "skip.ice_mq_red_ice_gs": false,
    "skip.gtg_without_hookshot": false,
    "skip.lens_gtg": false,
    "skip.gtg_fake_wall": false,
    "skip.lens_gtg_mq": false,
    "skip.gtg_mq_without_hookshot": false,
    "skip.gtg_mq_with_hookshot": false,
    "skip.lens_castle": false,
    "skip.spirit_trial_hookshot": false,
    "skip.lens_castle_mq": false,
    "skip.shadow_trial_mq": false,
    "skip.fire_trial_mq": false,
    "skip.light_trial_mq": false,
    "skip.forest_outdoors_ledge": false,
    "skip.forest_outdoor_east_gs": false,
    "skip.forest_vines": false,
    "skip.forest_scarecrow": false,
    "skip.forest_outside_backdoor": false,
    "skip.forest_mq_block_puzzle": false,
    "skip.forest_mq_hallway_switch": false,
    "skip.forest_well_swim": false,
    "skip.forest_mq_hallway_switch_jumpslash": false,
    "skip.forest_mq_hallway_switch_hookshot": false,
    "skip.forest_door_frame": false,
    "skip.forest_first_gs": false,
    "skip.fire_boss_door_jump": false,
    "skip.fire_song_of_time": false,
    "skip.fire_strength": false,
    "skip.fire_scarecrow": false,
    "skip.fire_flame_maze": false,
    "skip.fire_mq_near_boss": false,
    "skip.fire_mq_bk_chest": false,
    "skip.fire_mq_bombable_chest": false,
    "skip.fire_mq_climb": false,
    "skip.fire_mq_maze_side_room": false,
    "skip.fire_mq_blocked_chest": false,
    "skip.fire_mq_maze_hovers": false,
    "skip.fire_mq_maze_jump": false,
    "skip.fire_mq_above_maze_gs": false,
    "skip.fire_mq_flame_maze": false,
    "skip.water_temple_torch_longshot": false,
    "skip.water_central_bow": false,
    "skip.water_cracked_wall_nothing": false,
    "skip.water_cracked_wall_hovers": false,
    "skip.water_boss_key_region": false,
    "skip.water_dragon_bombchu": false,
    "skip.water_dragon_jump_dive": false,
    "skip.water_bk_jump_dive": false,
    "skip.water_bk_chest": false,
    "skip.water_north_basement_ledge_jump": false,
    "skip.water_river_gs": false,
    "skip.water_falling_platform_gs": false,
    "skip.water_dragon_adult": false,
    "skip.water_dragon_child": false,
    "skip.water_central_gs_irons": false,
    "skip.water_falling_platform_gs_hookshot": false,
    "skip.water_mq_central_pillar": false,
    "skip.water_mq_locked_gs": false,
    "skip.water_central_gs_fw": false,
    "skip.water_falling_platform_gs_boomerang": false,
    "skip.lens_shadow": false,
    "skip.shadow_umbrella": false,
    "skip.lens_shadow_back": false,
    "skip.shadow_freestand_key": false,
    "skip.shadow_statue": false,
    "skip.lens_shadow_mq": false,
    "skip.shadow_mq_gap": false,
    "skip.shadow_mq_huge_pit": false,
    "skip.lens_shadow_mq_back": false,
    "skip.shadow_mq_invisible_blades": false,
    "skip.shadow_umbrella_gs": false,
    "skip.spirit_child_bombchu": false,
    "skip.spirit_lower_adult_switch": false,
    "skip.spirit_map_chest": false,
    "skip.spirit_sun_chest": false,
    "skip.spirit_lobby_gs": false,
    "skip.lens_spirit": false,
    "skip.spirit_wall": false,
    "skip.spirit_mq_frozen_eye": false,
    "skip.lens_spirit_mq": false,
    "skip.spirit_mq_lower_adult": false,
    "skip.spirit_mq_sun_block_gs": false,
    "skip.spirit_mq_sun_block_sot": false,
    "skip.spirit_lobby_jump": false,
    "skip.invisible_ocarina": false,
    "skip.invisible_ocarina_midair": false,
    "item.ocarina": 1,
    "item.song_storm": 1,
    "item.hookshot": 1
};

async function printResult(data) {
    console.time("PRINT TRAVERSE LOGIC");
    console.log("data", data);
    console.timeEnd("PRINT TRAVERSE LOGIC");
    const res = await logicGraph.getAll();
    console.log("all data", res);
    for (const key of WANT_OUTPUT_LOG) {
        console.log(key, res[key]);
    }
    console.timeEnd("TRAVERSE LOGIC");
}

async function loadLogic() {
    const logic = await FileLoader.json(`logic.json`);

    const generator = new LogicGenerator();
    generator.loadLogic(logic);
    const generatedLogic = generator.generate();

    logicGraph.loadLogic(generatedLogic);
}

// ---------------------------------

async function runTest() {
    console.time("INIT LOGIC");
    await loadLogic();
    console.timeEnd("INIT LOGIC");

    console.time("ACTIVATE TRAVERSE LOGIC");
    logicGraph.setAll(START_VALUES);

    console.time("TRAVERSE LOGIC");
    const result = logicGraph.exec("region.root", {foobar: "barfoo"});
    console.timeEnd("ACTIVATE TRAVERSE LOGIC");

    printResult(result);
}

async function runTestDebug() {
    logicGraph.setDebug("extended");

    await loadLogic();

    logicGraph.setAll(START_VALUES);

    const result = logicGraph.exec("region.root", {foobar: "barfoo"});

    logicGraph.setDebug(false);

    printResult(result);
}

document.getElementById("runlogic").onclick = runTest;
document.getElementById("runlogic_debug").onclick = runTestDebug;
