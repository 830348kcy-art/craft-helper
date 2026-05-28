/**
 * 실제 마인크래프트 텍스처를 CDN에서 가져오는 헬퍼.
 * Source: InventivetalentDev/minecraft-assets (Mojang 공식 텍스처 미러)
 * CDN: jsdelivr (캐시 + 빠른 응답)
 */

const CDN = "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20/assets/minecraft/textures";

/** ID가 Mojang의 vanilla 이름과 다를 때 매핑. */
const ITEM_OVERRIDES: Record<string, string> = {
  // 무기/도구 - 우리 ID는 "sword_diamond"지만 vanilla는 "diamond_sword"
  sword_diamond:    "item/diamond_sword.png",
  sword_netherite:  "item/netherite_sword.png",
  sword_iron:       "item/iron_sword.png",
  pickaxe_iron:     "item/iron_pickaxe.png",
  pickaxe_diamond:  "item/diamond_pickaxe.png",
  axe_diamond:      "item/diamond_axe.png",
  shovel_diamond:   "item/diamond_shovel.png",
  hoe_diamond:      "item/diamond_hoe.png",
  // 다른 이름의 vanilla 텍스처
  nether_quartz:    "item/quartz.png",
  eye_of_ender:     "item/ender_eye.png",
  totem:            "item/totem_of_undying.png",
  boat:             "item/oak_boat.png",
  spawn_egg_creeper:"item/creeper_spawn_egg.png",
  // 애니메이션 텍스처 (frame 0)
  compass:          "item/compass_00.png",
  recovery_compass: "item/recovery_compass_00.png",
  clock:            "item/clock_00.png",
  // 블록 폴더에 있는 것들 (저장 블록·셜커 상자 등)
  diamond_block:    "block/diamond_block.png",
  shulker_box:      "block/shulker_box.png",
  dragon_egg_item:  "block/dragon_egg.png",
  // 빈 지도 등
  map:              "item/map.png",
};

/** 블록 ID 매핑 — 블록은 여러 면을 가지므로 대표 텍스처 지정. */
const BLOCK_OVERRIDES: Record<string, string> = {
  grass_block:        "block/grass_block_side.png",
  podzol:             "block/podzol_side.png",
  mycelium:           "block/mycelium_side.png",
  oak_log:            "block/oak_log.png",
  birch_log:          "block/birch_log.png",
  spruce_log:         "block/spruce_log.png",
  jungle_log:         "block/jungle_log.png",
  acacia_log:         "block/acacia_log.png",
  dark_oak_log:       "block/dark_oak_log.png",
  mangrove_log:       "block/mangrove_log.png",
  cherry_log:         "block/cherry_log.png",
  bamboo_block:       "block/bamboo_block.png",
  // 광석 — deepslate 분포지만 대표 텍스처는 일반 광석으로
  coal_ore:           "block/coal_ore.png",
  iron_ore:           "block/iron_ore.png",
  gold_ore:           "block/gold_ore.png",
  diamond_ore:        "block/diamond_ore.png",
  emerald_ore:        "block/emerald_ore.png",
  lapis_ore:          "block/lapis_ore.png",
  redstone_ore:       "block/redstone_ore.png",
  copper_ore:         "block/copper_ore.png",
  // 기능 블록 — 정면 텍스처 우선
  furnace:            "block/furnace_front.png",
  blast_furnace:      "block/blast_furnace_front.png",
  smoker:             "block/smoker_front.png",
  crafting_table:     "block/crafting_table_front.png",
  enchanting_table:   "block/enchanting_table_top.png",
  jukebox:            "block/jukebox_top.png",
  note_block:         "block/note_block.png",
  bookshelf:          "block/bookshelf.png",
  chest:              "block/oak_planks.png", // chest는 entity, planks로 대체
  barrel:             "block/barrel_top.png",
  composter:          "block/composter_side.png",
  lectern:            "block/lectern_front.png",
  beacon:             "block/beacon.png",
  conduit:            "block/conduit.png",
  hopper_block:       "block/hopper_outside.png",
  dispenser:          "block/dispenser_front.png",
  dropper:            "block/dropper_front.png",
  observer:           "block/observer_front.png",
  piston:             "block/piston_top.png",
  sticky_piston:      "block/piston_top_sticky.png",
  redstone_lamp:      "block/redstone_lamp.png",
  comparator:         "block/comparator.png",
  repeater:           "block/repeater.png",
  brewing_stand:      "block/brewing_stand.png",
  cauldron:           "block/cauldron_side.png",
  anvil:              "block/anvil.png",
  grindstone:         "block/grindstone_side.png",
  smithing_table:     "block/smithing_table_top.png",
  // 자연
  stone:              "block/stone.png",
  cobblestone:        "block/cobblestone.png",
  mossy_cobblestone:  "block/mossy_cobblestone.png",
  smooth_stone:       "block/smooth_stone.png",
  stone_bricks:       "block/stone_bricks.png",
  andesite:           "block/andesite.png",
  diorite:            "block/diorite.png",
  granite:            "block/granite.png",
  deepslate:          "block/deepslate.png",
  tuff:               "block/tuff.png",
  calcite:            "block/calcite.png",
  sand:               "block/sand.png",
  red_sand:           "block/red_sand.png",
  gravel:             "block/gravel.png",
  clay:               "block/clay.png",
  mud:                "block/mud.png",
  sandstone:          "block/sandstone_top.png",
  // 자원 블록
  iron_block:         "block/iron_block.png",
  gold_block:         "block/gold_block.png",
  diamond_block:      "block/diamond_block.png",
  emerald_block:      "block/emerald_block.png",
  redstone_block:     "block/redstone_block.png",
  lapis_block:        "block/lapis_block.png",
  coal_block:         "block/coal_block.png",
  honey_block:        "block/honey_block_side.png",
  slime_block:        "block/slime_block.png",
  amethyst_block:     "block/amethyst_block.png",
  // 네더/엔드
  obsidian:           "block/obsidian.png",
  crying_obsidian:    "block/crying_obsidian.png",
  respawn_anchor:     "block/respawn_anchor_top.png",
  netherrack:         "block/netherrack.png",
  nether_brick:       "block/nether_bricks.png",
  glowstone:          "block/glowstone.png",
  soul_sand:          "block/soul_sand.png",
  shroomlight:        "block/shroomlight.png",
  magma_block:        "block/magma.png",
  end_stone:          "block/end_stone.png",
  purpur_block:       "block/purpur_block.png",
  end_rod:            "block/end_rod.png",
  dragon_egg:         "block/dragon_egg.png",
  // 나무
  oak_planks:         "block/oak_planks.png",
  // 잡종
  tnt:                "block/tnt_side.png",
  glass:              "block/glass.png",
  glass_pane:         "block/glass.png",
  ice:                "block/ice.png",
  packed_ice:         "block/packed_ice.png",
  blue_ice:           "block/blue_ice.png",
  ancient_debris:     "block/ancient_debris_side.png",
  bed:                "block/red_wool.png", // bed는 entity, 양털로 대체
  wool_white:         "block/white_wool.png",
  torch:              "block/torch.png",
  lantern:            "block/lantern.png",
  soul_lantern:       "block/soul_lantern.png",
  campfire:           "block/campfire_log.png",
  spawner:            "block/spawner.png",
  dirt:               "block/dirt.png",
};

/** 레시피 격자 셀에 나오는 한국어 이름 → 텍스처. */
export const KOREAN_TO_TEXTURE: Record<string, string> = {
  // 자원
  "다이아몬드":           "item/diamond.png",
  "철 주괴":              "item/iron_ingot.png",
  "철":                   "item/iron_ingot.png",
  "철 조각":              "item/iron_nugget.png",
  "금 주괴":              "item/gold_ingot.png",
  "금":                   "item/gold_ingot.png",
  "금 조각":              "item/gold_nugget.png",
  "구리 주괴":             "item/copper_ingot.png",
  "네더라이트 주괴":        "item/netherite_ingot.png",
  "에메랄드":              "item/emerald.png",
  "청금석":                "item/lapis_lazuli.png",
  "레드스톤":              "item/redstone.png",
  "레드스톤 가루":          "item/redstone.png",
  "석탄":                  "item/coal.png",
  "숯":                    "item/charcoal.png",
  "자수정 조각":            "item/amethyst_shard.png",
  "네더 석영":              "item/quartz.png",
  // 재료
  "막대기":                "item/stick.png",
  "막대":                  "item/stick.png",
  "실":                    "item/string.png",
  "깃털":                  "item/feather.png",
  "부싯돌":                "item/flint.png",
  "화약":                  "item/gunpowder.png",
  "가죽":                  "item/leather.png",
  "종이":                  "item/paper.png",
  "책":                    "item/book.png",
  "사탕수수":              "item/sugar_cane.png",
  "설탕":                  "item/sugar.png",
  "사과":                  "item/apple.png",
  "수박 조각":             "item/melon_slice.png",
  "수박":                  "block/melon_side.png",
  "호박":                  "block/pumpkin_side.png",
  "밀":                    "item/wheat.png",
  "당근":                  "item/carrot.png",
  "감자":                  "item/potato.png",
  "코코아 콩":             "item/cocoa_beans.png",
  "알":                    "item/egg.png",
  "후크":                  "item/tripwire_hook.png",
  "점액 덩어리":           "item/slime_ball.png",
  "점액":                  "item/slime_ball.png",
  "블레이즈 막대":          "item/blaze_rod.png",
  "엔더 진주":             "item/ender_pearl.png",
  "불꽃 가루":             "item/blaze_powder.png",
  "네더의 별":             "item/nether_star.png",
  "노틸러스 껍데기":         "item/nautilus_shell.png",
  "바다의 심장":            "item/heart_of_the_sea.png",
  "셜커 껍데기":            "item/shulker_shell.png",
  "메아리 조각":            "item/echo_shard.png",
  // 블록 재료
  "둥근돌":                "block/cobblestone.png",
  "돌":                    "block/stone.png",
  "판자":                  "block/oak_planks.png",
  "나무 판자":             "block/oak_planks.png",
  "원목":                  "block/oak_log.png",
  "흑요석":                "block/obsidian.png",
  "모래":                  "block/sand.png",
  "유리":                  "block/glass.png",
  "발광석":                "block/glowstone.png",
  "철 블록":               "block/iron_block.png",
  "금 블록":               "block/gold_block.png",
  "다이아몬드 블록":         "block/diamond_block.png",
  "매끄러운 돌":            "block/smooth_stone.png",
  "돌 반 블록":             "block/smooth_stone.png",
  "나무 반 블록":           "block/oak_planks.png",
  "울타리":                "block/oak_planks.png",
  "나무 울타리":            "block/oak_planks.png",
  "화로":                  "block/furnace_front.png",
  "상자":                  "item/chest.png",
  "활":                    "item/bow.png",
  "피스톤":                "block/piston_top.png",
  "책장":                  "block/bookshelf.png",
  "레드스톤 횃불":          "block/redstone_torch.png",
  "횃불":                  "block/torch.png",
  "우유 양동이":            "item/milk_bucket.png",
  // 도구
  "곡괭이":                "item/iron_pickaxe.png",
  "검":                    "item/iron_sword.png",
  // 자동 농장 단면도용
  "옵저버":                "block/observer_front.png",
  "디스펜서":              "block/dispenser_front.png",
  "발사기":                "block/dispenser_front.png",
  "투척기":                "block/dropper_front.png",
  "물":                    "block/water_overlay.png",
  "물 양동이":              "item/water_bucket.png",
  "용암":                  "block/lava_still.png",
  "용암 양동이":            "item/lava_bucket.png",
  "트랩도어":              "block/oak_trapdoor.png",
  "양털":                  "block/white_wool.png",
  "선인장":                "block/cactus_side.png",
  "대나무":                "block/bamboo_stalk.png",
  "사탕수수 식물":          "item/sugar_cane.png",
  "흙":                    "block/dirt.png",
  "잔디 블록":              "block/grass_block_side.png",
  "닭":                    "item/egg.png",
  "레일":                  "block/rail.png",
  "레버":                  "block/lever.png",
  "버튼":                  "block/oak_planks.png",
  "씨앗":                  "item/wheat_seeds.png",
  "당근 작물":              "item/carrot.png",
  "감자 작물":              "item/potato.png",
  "수박 줄기":              "item/melon_seeds.png",
  "호박 줄기":              "item/pumpkin_seeds.png",
  "수박 블록":              "block/melon_side.png",
  "호박 블록":              "block/pumpkin_side.png",
  "낚싯대":                "item/fishing_rod.png",
  "다이아몬드 곡괭이":       "item/diamond_pickaxe.png",
  "다이아몬드 검":           "item/diamond_sword.png",
  "철 곡괭이":              "item/iron_pickaxe.png",
  "철 검":                  "item/iron_sword.png",
  "철 도끼":                "item/iron_axe.png",
  "끈끈이 피스톤":           "block/piston_top_sticky.png",
  "공기":                  "",
  "·":                      "",
};

export function getItemTexture(id: string): string {
  const path = ITEM_OVERRIDES[id] ?? `item/${id}.png`;
  return `${CDN}/${path}`;
}

export function getBlockTexture(id: string): string {
  const path = BLOCK_OVERRIDES[id] ?? `block/${id}.png`;
  return `${CDN}/${path}`;
}

export function getTextureByName(name: string): string | undefined {
  // 정확한 매칭 우선
  if (KOREAN_TO_TEXTURE[name]) return `${CDN}/${KOREAN_TO_TEXTURE[name]}`;
  // 영문 ID 직접 시도 (item 우선, block 폴백은 SmartIcon이 onError로)
  // 예: "diamond"가 그대로 들어왔을 때
  if (/^[a-z_0-9]+$/.test(name)) {
    return `${CDN}/item/${name}.png`;
  }
  return undefined;
}

/** 영어 ID로부터 type에 맞는 텍스처 URL을 반환 */
export function getTextureUrl(id: string, type: "block" | "item" | "recipe"): string {
  if (type === "block") return getBlockTexture(id);
  return getItemTexture(id);
}

export { CDN };

/** 카테고리 슬러그 → 대표 텍스처 URL */
export function getCategoryTexture(slug: string): string {
  const map: Record<string, string> = {
    blocks:     getBlockTexture("grass_block"),
    items:      getItemTexture("diamond"),
    mobs:       getItemTexture("beef"),
    biomes:     getBlockTexture("oak_log"),
    redstone:   getItemTexture("redstone"),
    enchanting: getItemTexture("book"),
    nether:     getBlockTexture("netherrack"),
    end:        getBlockTexture("end_stone"),
    // 한국어 카테고리도 동일 매핑
    "자연":     getBlockTexture("grass_block"),
    "건축":     getBlockTexture("stone_bricks"),
    "나무":     getBlockTexture("oak_log"),
    "광물":     getItemTexture("diamond"),
    "자원":     getItemTexture("iron_ingot"),
    "음식":     getItemTexture("bread"),
    "재료":     getItemTexture("stick"),
    "농작물":   getItemTexture("wheat"),
    "도구":     getItemTexture("iron_pickaxe"),
    "무기":     getItemTexture("iron_sword"),
    "갑옷":     getItemTexture("iron_chestplate"),
    "장식":     getBlockTexture("stone_bricks"),
    "특수":     getItemTexture("nether_star"),
    "연료":     getItemTexture("coal"),
    "마법":     getItemTexture("enchanted_book"),
    "양조":     getItemTexture("brewing_stand"),
    "기타":     getBlockTexture("cobblestone"),
  };
  return map[slug] ?? getBlockTexture("cobblestone");
}
