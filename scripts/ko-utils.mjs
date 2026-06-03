/**
 * 한국어 이름/재료명 생성 유틸 (generate-catalog, generate-recipes 공용)
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const COLORS = {
  white: "흰색",
  orange: "주황",
  magenta: "자홍",
  light_blue: "하늘색",
  yellow: "노란",
  lime: "연두",
  pink: "분홍",
  gray: "회색",
  light_gray: "회백색",
  cyan: "청록",
  purple: "보라",
  blue: "파란",
  brown: "갈색",
  green: "초록",
  red: "빨간",
  black: "검정",
};

const WOODS = {
  oak: "참나무",
  spruce: "가문비",
  birch: "자작나무",
  jungle: "정글",
  acacia: "아카시아",
  dark_oak: "짙은 참나무",
  mangrove: "맹그로브",
  cherry: "벚나무",
  bamboo: "대나무",
  crimson: "진홍",
  warped: "뒤틀린",
  pale_oak: "창백한 참나무",
};

const BLOCK_PARTS = {
  planks: "판자",
  log: "원목",
  wood: "나무",
  door: "문",
  trapdoor: "다락문",
  fence: "울타리",
  fence_gate: "울타리 문",
  stairs: "계단",
  slab: "반 블록",
  button: "버튼",
  pressure_plate: "압력판",
  sign: "표지판",
  hanging_sign: "매달린 표지판",
  leaves: "잎",
  sapling: "묘목",
  shelf: "선반",
  boat: "보트",
  chest_boat: "상자가 실린 보트",
  wool: "양털",
  carpet: "양탄자",
  concrete: "콘크리트",
  concrete_powder: "콘크리트 가루",
  terracotta: "테라코타",
  glazed_terracotta: "윤이 나는 테라코타",
  stained_glass: "색유리",
  stained_glass_pane: "색유리 판",
  shulker_box: "셜커 상자",
  candle: "양초",
  bed: "침대",
  banner: "배너",
  wall_banner: "벽 배너",
  ore: "광석",
  block: "블록",
  bricks: "벽돌",
  brick: "벽돌",
  brick_slab: "벽돌 반 블록",
  brick_stairs: "벽돌 계단",
  brick_wall: "벽돌 담장",
  tiles: "타일",
  pillar: "기둥",
  chiseled: "조각된",
  polished: "매끄러운",
  cut: "깎인",
  cracked: "갈라진",
  mossy: "이끼 낀",
  smooth: "매끄러운",
  exposed: "약간 녹슨",
  weathered: "녹슨",
  oxidized: "산화된",
  waxed: "왁스칠한",
  bulb: "전구",
  grate: "격자",
  bars: "창",
  chain: "사슬",
  lantern: "랜턴",
  torch: "횃불",
  ladder: "사다리",
  rail: "레일",
  powered_rail: "파워드 레일",
  detector_rail: "감지 레일",
  activator_rail: "활성화 레일",
  nylium: "균사체",
  wart_block: "사마귀 블록",
  roots: "뿌리",
  fungus: "균",
  stem: "줄기",
  hyphae: "균사",
  coral: "산호",
  coral_block: "산호 블록",
  coral_fan: "부채산호",
  froglight: "개구리불",
  amethyst_cluster: "자수정 군집",
  bud: "봉우리",
  slab: "반 블록",
};

let koNames = {};
let koIngredients = {};

try {
  koNames = JSON.parse(readFileSync(resolve(__dirname, "ko-names.json"), "utf-8"));
} catch {
  koNames = {};
}

try {
  koIngredients = JSON.parse(
    readFileSync(resolve(__dirname, "ko-ingredients.json"), "utf-8")
  );
} catch {
  koIngredients = {};
}

/** snake_case ID → 한국어 표시명 */
export function idToKoName(id) {
  if (koNames[id]) return koNames[id];

  // color_material patterns
  for (const [color, ko] of Object.entries(COLORS)) {
    if (id.startsWith(`${color}_`)) {
      const rest = id.slice(color.length + 1);
      const part = BLOCK_PARTS[rest] ?? rest.replace(/_/g, " ");
      return `${ko} ${part}`;
    }
  }

  // wood_material patterns
  for (const [wood, ko] of Object.entries(WOODS)) {
    if (id === wood) return ko;
    if (id.startsWith(`${wood}_`)) {
      const rest = id.slice(wood.length + 1);
      const part = BLOCK_PARTS[rest] ?? rest.replace(/_/g, " ");
      return `${ko} ${part}`;
    }
    if (id.startsWith(`stripped_${wood}_`)) {
      const rest = id.slice(`stripped_${wood}_`.length);
      const part = BLOCK_PARTS[rest] ?? rest.replace(/_/g, " ");
      return `껍질 벗긴 ${ko} ${part}`;
    }
    if (id === `stripped_${wood}_log` || id === `stripped_${wood}`) {
      return `껍질 벗긴 ${ko} 원목`;
    }
  }

  // deepslate_ore etc
  if (id.startsWith("deepslate_")) {
    const rest = id.slice("deepslate_".length);
    return `심층암 ${idToKoName(rest).replace(/^심층암 /, "")}`;
  }

  // common suffixes
  const known = {
    cobblestone: "둥근돌",
    cobbled_deepslate: "깨진 심층암",
    grass_block: "잔디 블록",
    dirt: "흙",
    stone: "돌",
    bedrock: "기반암",
    netherrack: "네더랙",
    end_stone: "엔드 석",
    obsidian: "흑요석",
    glowstone: "발광석",
    soul_sand: "영혼 모래",
    soul_soil: "영혼 흙",
    shroomlight: "버섯불",
    ancient_debris: "고대 잔해",
    netherite_block: "네더라이트 블록",
    beacon: "신호기",
    conduit: "전달체",
    spawner: "몹 스폰기",
    trial_spawner: "시련 스폰기",
    vault: "금고",
    crafter: "제작기",
    sculk: "스컬크",
    sculk_sensor: "스컬크 감지기",
    sculk_shrieker: "스컬크 외침기",
    sculk_catalyst: "스컬크 촉매",
    sculk_vein: "스컬크 정맥",
    calibrated_sculk_sensor: "조율된 스컬크 감지기",
    creaking_heart: "크리킹 심장",
    resin_block: "수지 블록",
    resin_bricks: "수지 벽돌",
    resin_clump: "수지 덩어리",
    resin_brick: "수지 벽돌",
    open_eyeblossom: "핀 눈꽃",
    closed_eyeblossom: "닫힌 눈꽃",
    torchflower: "횃불꽃",
    heavy_core: "중량 코어",
    pale_moss_block: "창백한 이끼 블록",
    pale_moss_carpet: "창백한 이끼 카펫",
    pale_hanging_moss: "창백한 매달린 이끼",
    frogspawn: "개구리알",
    sniffer_egg: "스니퍼 알",
    decorated_pot: "장식된 항아리",
    suspicious_sand: "수상한 모래",
    suspicious_gravel: "수상한 자갈",
    lightning_rod: "피뢰침",
    iron_bars: "철창",
    chain: "사슬",
    ladder: "사다리",
    scaffolding: "비계",
    hay_bale: "건초더미",
    slime_block: "점액 블록",
    honey_block: "꿀 블록",
    target: "과녁",
    lodestone: "자석석",
    bell: "종",
    grindstone: "숫돌",
    anvil: "모루",
    smithing_table: "대장장이 작업대",
    stonecutter: "석재 절단기",
    cartography_table: "지도 제작대",
    fletching_table: "화살 작업대",
    loom: "베틀",
    lectern: "독서대",
    jukebox: "주크박스",
    bookshelf: "책장",
    chiseled_bookshelf: "조각된 책장",
    composter: "퇴비통",
    barrel: "통",
    chest: "상자",
    ender_chest: "엔더 상자",
    trapped_chest: "덫 상자",
    shulker_box: "셜커 상자",
    hopper: "호퍼",
    dropper: "투척기",
    dispenser: "발사기",
    observer: "관측기",
    piston: "피스톤",
    sticky_piston: "끈끈이 피스톤",
    repeater: "레드스톤 중계기",
    comparator: "레드스톤 비교기",
    redstone_lamp: "레드스톤 조명",
    redstone_torch: "레드스톤 횃불",
    redstone_block: "레드스톤 블록",
    lever: "레버",
    tripwire_hook: "철사 후크",
    daylight_detector: "햇빛 감지기",
    note_block: "노트 블록",
    tnt: "TNT",
    sponge: "스폰지",
    wet_sponge: "젖은 스폰지",
    prismarine: "프리즈마린",
    prismarine_bricks: "프리즈마린 벽돌",
    dark_prismarine: "어두운 프리즈마린",
    sea_lantern: "바다 랜턴",
    kelp: "다시마",
    seagrass: "해초",
    bamboo: "대나무",
    sugar_cane: "사탕수수",
    cactus: "선인장",
    pumpkin: "호박",
    carved_pumpkin: "조각된 호박",
    jack_o_lantern: "잭오랜턴",
    melon: "수박",
    vine: "덩굴",
    lily_pad: "연꽃잎",
    cobweb: "거미줄",
    snow: "눈",
    ice: "얼음",
    packed_ice: "얼어붙은 얼음",
    blue_ice: "푸른 얼음",
    powder_snow: "가루눈",
    glass: "유리",
    glass_pane: "유리판",
    tinted_glass: "차광 유리",
    iron_door: "철 문",
    iron_trapdoor: "철 다락문",
    copper_block: "구리 블록",
    copper_ore: "구리 광석",
    iron_ore: "철 광석",
    gold_ore: "금 광석",
    diamond_ore: "다이아몬드 광석",
    emerald_ore: "에메랄드 광석",
    lapis_ore: "청금석 광석",
    redstone_ore: "레드스톤 광석",
    coal_ore: "석탄 광석",
    nether_quartz_ore: "네더 석영 광석",
    nether_gold_ore: "네더 금 광석",
    amethyst_block: "자수정 블록",
    budding_amethyst: "싹트는 자수정",
    amethyst_cluster: "자수정 군집",
    small_amethyst_bud: "작은 자수정 봉우리",
    medium_amethyst_bud: "중간 자수정 봉우리",
    large_amethyst_bud: "큰 자수정 봉우리",
    calcite: "방해석",
    tuff: "응회암",
    dripstone_block: "점적석 블록",
    pointed_dripstone: "점적 돌기",
    moss_block: "이끼 블록",
    azalea: "진달래",
    spore_blossom: "포자 꽃",
    big_dripleaf: "큰 버들잎",
    small_dripleaf: "작은 버들잎",
    glow_lichen: "발광 이끼",
    frogspawn: "개구리알",
    allium: "알리움",
    poppy: "양귀비",
    dandelion: "민들레",
    cornflower: "수레국화",
    oxeye_daisy: "데이지",
    azure_bluet: "선애기별꽃",
    tulip: "튤립",
    lily_of_the_valley: "은방울꽃",
    wither_rose: "위더 장미",
    sunflower: "해바라기",
    lilac: "라일락",
    rose_bush: "장미 덤불",
    peony: "모란",
    pink_petals: "분홍 꽃잎",
    wildflowers: "들꽃",
    torchflower: "횃불꽃",
    pitcher_plant: "벌레잡이풀",
    pitcher_crop: "벌레잡이풀",
    sweet_berry_bush: "달콤한 열매 덤불",
    cave_vines: "동굴 덩굴",
    twisting_vines: "뒤틀린 덩굴",
    weeping_vines: "늘어진 덩굴",
    nether_sprouts: "네더 새싹",
    crimson_fungus: "진홍 균",
    warped_fungus: "뒤틀린 균",
    crimson_roots: "진홍 뿌리",
    warped_roots: "뒤틀린 뿌리",
    nether_wart: "네더 사마귀",
    soul_torch: "영혼 횃불",
    soul_lantern: "영혼 랜턴",
    soul_campfire: "영혼 모닥불",
    campfire: "모닥불",
    lantern: "랜턴",
    torch: "횃불",
    candle: "양초",
    end_rod: "엔드 막대",
    dragon_egg: "드래곤 알",
    end_portal_frame: "엔드 차원문 틀",
    crying_obsidian: "우는 흑요석",
    respawn_anchor: "리스폰 정박기",
    purpur_block: "퍼퍼 블록",
    chorus_plant: "후렴초",
    chorus_flower: "후렴화",
    end_stone_bricks: "엔드 석 벽돌",
    nether_bricks: "네더 벽돌",
    red_nether_bricks: "붉은 네더 벽돌",
    quartz_block: "석영 블록",
    quartz_bricks: "석영 벽돌",
    chiseled_quartz_block: "조각된 석영 블록",
    smooth_quartz: "매끄러운 석영",
    sand: "모래",
    red_sand: "붉은 모래",
    gravel: "자갈",
    clay: "점토",
    mud: "진흙",
    packed_mud: "굳은 진흙",
    coarse_dirt: "거친 흙",
    rooted_dirt: "뿌리 박힌 흙",
    podzol: "포드졸",
    mycelium: "균사체",
    farmland: "경작지",
    dirt_path: "흙길",
    infested_stone: "벌레 먹은 돌",
    infested_cobblestone: "벌레 먹은 둥근돌",
    infested_deepslate: "벌레 먹은 심층암",
    reinforced_deepslate: "강화 심층암",
    bone_block: "뼈 블록",
    hay_block: "건초 블록",
    dried_kelp_block: "말린 다시마 블록",
    bamboo_block: "대나무 블록",
    bamboo_mosaic: "대나무 모자이크",
    stripped_bamboo_block: "껍질 벗긴 대나무 블록",
    mangrove_propagule: "맹그로브 번식지",
    muddy_mangrove_roots: "진흙 맹그로브 뿌리",
    leaf_litter: "낙엽",
    short_grass: "짧은 잔디",
    tall_grass: "키 큰 잔디",
    short_dry_grass: "짧은 마른 잔디",
    tall_dry_grass: "키 큰 마른 잔디",
    firefly_bush: "반딧불 덤불",
    bush: "덤불",
    creaking_heart: "크리킹 심장",
    heavy_core: "중량 코어",
    dried_ghast: "말린 가스트",
    copper_torch: "구리 횃불",
    item_frame: "아이템 액자",
    glow_item_frame: "발광 아이템 액자",
    turtle_egg: "거북 알",
    sea_pickle: "바다 피클",
    brain_coral: "뇌 산호",
    bubble_coral: "거품 산호",
    fire_coral: "불 산호",
    horn_coral: "뿔 산호",
    tube_coral: "관 산호",
    dead_brain_coral: "죽은 뇌 산호",
    dead_bubble_coral: "죽은 거품 산호",
    dead_fire_coral: "죽은 불 산호",
    dead_horn_coral: "죽은 뿔 산호",
    dead_tube_coral: "죽은 관 산호",
    dead_bush: "마른 덤불",
    brown_mushroom: "갈색 버섯",
    red_mushroom: "빨간 버섯",
    brown_mushroom_block: "갈색 버섯 블록",
    red_mushroom_block: "빨간 버섯 블록",
    mushroom_stem: "버섯 줄기",
    bee_nest: "벌집",
    beehive: "양봉장",
    honeycomb_block: "벌집 블록",
    cake: "케이크",
    flower_pot: "화분",
    brewing_stand: "양조대",
    cauldron: "가마솥",
    enchanting_table: "마법 부여대",
    furnace: "화로",
    blast_furnace: "용광로",
    smoker: "훈연기",
    crafting_table: "작업대",
    fletching_table: "화살 작업대",
    cartography_table: "지도 제작대",
    loom: "베틀",
    stonecutter: "석재 절단기",
    // items common
    iron_ingot: "철 주괴",
    gold_ingot: "금 주괴",
    copper_ingot: "구리 주괴",
    netherite_ingot: "네더라이트 주괴",
    diamond: "다이아몬드",
    emerald: "에메랄드",
    stick: "막대기",
    string: "실",
    feather: "깃털",
    flint: "부싯돌",
    coal: "석탄",
    charcoal: "숯",
    wheat: "밀",
    bread: "빵",
    bucket: "양동이",
    water_bucket: "물 양동이",
    lava_bucket: "용암 양동이",
    milk_bucket: "우유 양동이",
    bow: "활",
    arrow: "화살",
    shield: "방패",
    shears: "가위",
    compass: "나침반",
    clock: "시계",
    map: "빈 지도",
    spyglass: "망원경",
    lead: "끈",
    name_tag: "이름표",
    saddle: "안장",
    elytra: "겉날개",
    totem_of_undying: "불사의 토템",
    trident: "삼지창",
    crossbow: "쇠뇌",
    fishing_rod: "낚싯대",
    flint_and_steel: "부싯돌과 부시",
    fire_charge: "화염구",
    ender_pearl: "엔더 진주",
    ender_eye: "엔더의 눈",
    blaze_rod: "블레이즈 막대",
    blaze_powder: "블레이즈 가루",
    nether_star: "네더의 별",
    ghast_tear: "가스트 눈물",
    magma_cream: "마그마 크림",
    slime_ball: "점액 덩어리",
    gunpowder: "화약",
    paper: "종이",
    book: "책",
    leather: "가죽",
    rabbit_hide: "토끼 가죽",
    egg: "알",
    sugar: "설탕",
    apple: "사과",
    golden_apple: "황금 사과",
    carrot: "당근",
    potato: "감자",
    beetroot: "비트",
    melon_slice: "수박 조각",
    sweet_berries: "달콤한 열매",
    glow_berries: "발광 열매",
    chorus_fruit: "후렴과",
    popped_chorus_fruit: "튀긴 후렴과",
    honey_bottle: "꿀병",
    honeycomb: "벌집 조각",
    amethyst_shard: "자수정 조각",
    quartz: "네더 석영",
    lapis_lazuli: "청금석",
    redstone: "레드스톤",
    glowstone_dust: "발광석 가루",
    bone: "뼈",
    bone_meal: "뼛가루",
    ink_sac: "잉크 주머니",
    glow_ink_sac: "발광 잉크 주머니",
    cocoa_beans: "코코아 콩",
    wheat_seeds: "밀 씨앗",
    pumpkin_seeds: "호박 씨앗",
    melon_seeds: "수박 씨앗",
    beetroot_seeds: "비트 씨앗",
    torchflower_seeds: "횃불꽃 씨앗",
    pitcher_pod: "벌레잡이풀 콩",
    nautilus_shell: "노틸러스 껍데기",
    heart_of_the_sea: "바다의 심장",
    shulker_shell: "셜커 껍데기",
    echo_shard: "메아리 조각",
    netherite_scrap: "네더라이트 파편",
    ancient_debris: "고대 잔해",
    raw_iron: "철 원석",
    raw_gold: "금 원석",
    raw_copper: "구리 원석",
    iron_nugget: "철 조각",
    gold_nugget: "금 조각",
    copper_nugget: "구리 조각",
    experience_bottle: "경험치 병",
    dragon_breath: "드래곤의 숨결",
    phantom_membrane: "팬텀 막",
    turtle_scute: "거북 등딱지",
    armadillo_scute: "아르마딜로 비늘",
    wind_charge: "돌풍",
    breeze_rod: "브리즈 막대",
    trial_key: "시련 열쇠",
    ominous_trial_key: "불길한 시련 열쇠",
    ominous_bottle: "불길한 병",
    mace: "철퇴",
    wolf_armor: "늑대 갑옷",
    resin_clump: "수지 덩어리",
    recovery_compass: "회복 나침반",
    brush: "솔",
    decorated_pot: "장식된 항아리",
    pottery_sherd: "도자기 조각",
    music_disc_13: "음반 (13)",
    music_disc_cat: "음반 (cat)",
  };

  if (known[id]) return known[id];

  // generic: split underscores, capitalize words - keep English-ish as last resort
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** 영문 item/block id → 레시피 재료 한국어명 */
export function idToKoIngredient(id, count = 1) {
  const name = koIngredients[id] ?? idToKoName(id);
  if (count === 1) return name;
  return `${name} ×${count}`;
}

/** 블록 카테고리 추론 */
export function inferBlockCategory(id) {
  if (/ore|debris|raw_/.test(id)) return "광석";
  if (/log|planks|wood|sapling|leaves|bamboo|stem|hyphae|nylium|roots|propagule/.test(id))
    return "나무";
  if (/wool|carpet|concrete|terracotta|glazed|stained_glass|candle|banner/.test(id))
    return "장식";
  if (/torch|lantern|campfire|sea_lantern|froglight|copper_bulb/.test(id)) return "조명";
  if (/door|trapdoor|fence|stairs|slab|wall|button|pressure_plate|sign|shelf/.test(id))
    return "건축";
  if (/rail|ladder|scaffolding/.test(id)) return "이동";
  if (
    /piston|repeater|comparator|observer|dispenser|dropper|hopper|lever|daylight|note_block|target|sculk_sensor|calibrated/.test(
      id
    )
  )
    return "레드스톤";
  if (/furnace|smoker|blast|brewing|enchanting|crafting|smithing|stonecutter|cartography|fletching|loom|lectern|jukebox|cauldron|composter|barrel|chest|ender_chest|trapped/.test(id))
    return "기능";
  if (/nether|netherrack|soul|crimson|warped|shroomlight|magma|glowstone|ancient/.test(id))
    return "네더";
  if (/end_|purpur|chorus|dragon|elytra/.test(id)) return "엔드";
  if (/sculk|trial|vault|crafter|heavy_core|creaking|decorated_pot|suspicious|sniffer|frogspawn|resin|eyeblossom|torchflower|pale_/.test(id))
    return "특수";
  if (/flower|rose|tulip|daisy|lily|allium|poppy|dandelion|cornflower|azalea|spore|vine|kelp|seagrass|bamboo|cactus|melon|pumpkin|crop|wheat|carrot|potato|beetroot|berry|mushroom|coral|fern|grass|bush|moss|leaf|wildflower|petals|sprouts|fungus|wart|lichen|dripleaf|pitcher|torchflower/.test(id))
    return "식물";
  if (/dirt|grass|stone|cobble|sand|gravel|clay|mud|deepslate|andesite|diorite|granite|tuff|calcite|dripstone|ice|snow|podzol|mycelium|farmland|path|infested/.test(id))
    return "자연";
  if (/iron_block|gold_block|diamond_block|emethyst|lapis|redstone_block|coal_block|copper_block|netherite|raw_|honey|slime|hay|bone/.test(id))
    return "자원";
  return "건축";
}

/** 아이템 카테고리 추론 */
export function inferItemCategory(id) {
  if (/pickaxe|axe|shovel|hoe|shears|fishing_rod|flint_and_steel|compass|clock|spyglass|lead|brush|bucket/.test(id))
    return "도구";
  if (/sword|bow|crossbow|trident|mace|arrow|shield/.test(id)) return "무기";
  if (/helmet|chestplate|leggings|boots|horse_armor|wolf_armor/.test(id)) return "방어구";
  if (/apple|bread|meat|fish|stew|soup|pie|cookie|cake|berries|carrot|potato|beetroot|melon|chorus|honey|milk|egg/.test(id))
    return "음식";
  if (/seeds|wheat|beetroot_seeds|melon_seeds|pumpkin_seeds|pitcher_pod|torchflower_seeds/.test(id))
    return "농작물";
  if (/ingot|nugget|diamond|emerald|coal|charcoal|quartz|lapis|redstone|amethyst|scrap|raw_|shard|pearl|rod|powder|tear|cream|ball|gunpowder|slime|honeycomb|echo|debris|wind_charge|breeze|resin_clump/.test(id))
    return "자원";
  if (/stick|string|feather|flint|leather|paper|book|sugar|bone|ink|dye|nautilus|heart_of_the_sea|shulker|phantom|scute|dragon_breath|nether_star|blaze|ender|gunpowder|experience/.test(id))
    return "재료";
  if (/potion|splash|lingering|tipped/.test(id)) return "양조";
  if (/enchanted|experience_bottle/.test(id)) return "마법";
  if (/spawn_egg/.test(id)) return "크리에이티브";
  if (/music_disc/.test(id)) return "음악";
  if (/boat|minecart|rail|saddle|elytra|name_tag|recovery_compass/.test(id)) return "이동";
  if (/totem|trial_key|ominous|decorated|pottery|map|writable_book|written_book|firework|banner|bed|skull|head/.test(id))
    return "특수";
  return "재료";
}

export function pickEmoji(type, id) {
  if (type === "block") {
    if (/ore|ingot|diamond|emerald|gold|iron|copper|coal|lapis|redstone|quartz|amethyst/.test(id))
      return "💎";
    if (/log|planks|wood|sapling|bamboo|stem/.test(id)) return "🪵";
    if (/leaves|grass|flower|vine|moss|fern|bush|petals|wildflowers/.test(id)) return "🌿";
    if (/torch|lantern|campfire|light|glow|lamp|candle|froglight|bulb/.test(id)) return "🔥";
    if (/door|trapdoor|fence|stairs|slab|wall|brick|concrete|wool|terracotta|glass/.test(id))
      return "🟫";
    if (/nether|soul|crimson|warped|magma|obsidian/.test(id)) return "🟥";
    if (/end|purpur|chorus|dragon/.test(id)) return "🟪";
    if (/water|ice|snow|kelp|sea|prismarine|sponge/.test(id)) return "🟦";
    if (/sculk|trial|vault|crafter|heavy|resin|creaking/.test(id)) return "⬛";
    return "🟫";
  }
  if (/sword|axe|pickaxe|shovel|hoe|bow|crossbow|trident|mace|shield/.test(id)) return "⚔️";
  if (/helmet|chestplate|leggings|boots|wolf_armor/.test(id)) return "🦺";
  if (/apple|bread|meat|fish|stew|pie|cookie|berries|carrot|potato/.test(id)) return "🍖";
  if (/ingot|diamond|emerald|coal|quartz|lapis|redstone|amethyst|scrap|nugget/.test(id))
    return "💎";
  if (/potion/.test(id)) return "🧪";
  if (/book|enchanted/.test(id)) return "📖";
  return "📦";
}

export function blockDescription(id, name) {
  return `${name}. 마인크래프트에서 사용하는 블록입니다.`;
}

export function itemDescription(id, name) {
  return `${name}. 마인크래프트에서 획득·사용하는 아이템입니다.`;
}

export function inferTool(id) {
  if (/ore|stone|cobble|deepslate|brick|concrete|terracotta|obsidian|ancient|netherite|debris|furnace|anvil|iron|gold|diamond|emerald|lapis|redstone|coal|copper|calcite|tuff|dripstone|amethyst|quartz|prismarine|purpur|end_stone|netherrack|basalt|blackstone|deepslate|trial|vault|crafter|heavy|spawner/.test(id))
    return "곡괭이";
  if (/log|planks|wood|sapling|leaves|bamboo|stem|hyphae|nylium|roots|door|trapdoor|fence|sign|shelf|campfire|scaffolding|lectern|bookshelf|composter|barrel|chest|jukebox|note_block|mangrove|beehive|bee_nest|resin|pale_oak|cherry|crimson|warped/.test(id))
    return "도끼";
  if (/dirt|grass|sand|gravel|clay|mud|podzol|mycelium|soul_sand|snow|farmland|path|sponge|sculk|moss|hay|target|dragon_egg|decorated|suspicious|turtle_egg|frogspawn|sniffer|leaf_litter|mangrove_roots/.test(id))
    return "삽";
  if (/leaves|vine|cobweb|sculk|moss|hay|scaffolding|bamboo|sea_pickle|sweet_berry|cave_vines|glow_lichen|leaf_litter|moss|sculk_vein/.test(id))
    return "가위";
  if (/wool|carpet/.test(id)) return "가위";
  if (/glass|ice|sea_lantern|glowstone|lantern|torch|candle|redstone_lamp|froglight|copper_bulb|sea_pickle|turtle_egg|decorated_pot|cake|flower_pot/.test(id))
    return "없음";
  return "곡괭이";
}

export function inferHardness(id) {
  if (/bedrock|barrier|reinforced|trial_spawner|vault|heavy_core|end_portal|command_block/.test(id))
    return 50.0;
  if (/obsidian|ancient_debris|netherite|crying_obsidian|respawn_anchor|anvil|enchanting/.test(id))
    return 5.0;
  if (/deepslate|cobbled_deepslate|reinforced/.test(id)) return 3.5;
  if (/ore/.test(id)) return 3.0;
  if (/stone|cobble|brick|concrete|terracotta/.test(id)) return 1.5;
  if (/wood|planks|log|door|fence|sapling|bamboo/.test(id)) return 2.0;
  if (/dirt|sand|gravel|mud|clay|snow/.test(id)) return 0.5;
  if (/leaves|grass|flower|vine|fern|moss|sculk|torch|candle/.test(id)) return 0.2;
  return 1.0;
}

export { koNames, koIngredients, COLORS, WOODS };
