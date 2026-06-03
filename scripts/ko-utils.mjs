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
  stairs: "계단",
  wall: "담장",
  button: "버튼",
  pressure_plate: "압력판",
  sign: "표지판",
  hanging_sign: "매달린 표지판",
  wall_sign: "벽 표지판",
  wall_hanging_sign: "벽 매달린 표지판",
  boat: "보트",
  chest_boat: "상자가 실린 보트",
  wood: "나무",
  hyphae: "균사",
  stem: "줄기",
  nylium: "균사체",
  wart: "사마귀",
  wart_block: "사마귀 블록",
  spawn_egg: "생성 알",
  bucket: "양동이",
  minecart: "광산 수레",
  horse_armor: "말 갑옷",
  pottery_sherd: "도자기 조각",
  smithing_template: "대장장이 형판",
  armor_trim: "갑옷 장식",
  bundle: "꾸러미",
  dye: "염료",
  disc: "음반",
  music_disc: "음반",
  trim: "장식",
  template: "형판",
  sherd: "조각",
  leaves: "잎",
  sapling: "묘목",
  shelf: "선반",
  banner: "배너",
  bed: "침대",
  block: "블록",
  ore: "광석",
  ingot: "주괴",
  nugget: "조각",
  raw: "원석",
  stage: "단계",
  stem: "줄기",
  fan: "부채산호",
  coral_block: "산호 블록",
  attached_melon_stem: "배치된 수박 줄기",
  attached_pumpkin_stem: "배치된 호박 줄기",
  big_dripleaf: "큰 버들잎",
  small_dripleaf: "작은 버들잎",
  beetroots: "비트",
  carrots: "당근",
  potatoes: "감자",
  wheat: "밀",
  cocoa: "코코아",
  melon_stem: "수박 줄기",
  pumpkin_stem: "호박 줄기",
  sweet_berry_bush: "달콤한 열매 덤불",
  cave_vines: "동굴 덩굴",
  twisting_vines: "뒤틀린 덩굴",
  weeping_vines: "늘어진 덩굴",
  nether_sprouts: "네더 새싹",
  crimson_fungus: "진홍 균",
  warped_fungus: "뒤틀린 균",
  crimson_roots: "진홍 뿌리",
  warped_roots: "뒤틀린 뿌리",
  dead_bush: "마른 덤불",
  short_grass: "짧은 잔디",
  tall_grass: "키 큰 잔디",
  short_dry_grass: "짧은 마른 잔디",
  tall_dry_grass: "키 큰 마른 잔디",
  leaf_litter: "낙엽",
  firefly_bush: "반딧불 덤불",
  item_frame: "아이템 액자",
  glow_item_frame: "발광 아이템 액자",
  turtle_egg: "거북 알",
  frogspawn: "개구리알",
  air: "공기",
  barrier: "배리어",
  structure_void: "구조물 공허",
  light: "빛",
  moving_piston: "움직이는 피스톤",
  piston_head: "피스톤 머리",
  tripwire: "철사",
  tripwire_hook: "철사 후크",
  activator_rail: "활성화 레일",
  detector_rail: "감지 레일",
  powered_rail: "파워드 레일",
};

const MATERIALS = {
  andesite: "안산암",
  diorite: "섬록암",
  granite: "화강암",
  stone: "돌",
  cobblestone: "둥근돌",
  deepslate: "심층암",
  cobbled_deepslate: "깨진 심층암",
  blackstone: "흑암",
  gilded_blackstone: "금박 흑암",
  polished_blackstone: "매끄러운 흑암",
  polished_blackstone_brick: "매끄러운 흑암 벽돌",
  polished_blackstone_bricks: "매끄러운 흑암 벽돌",
  chiseled_polished_blackstone: "조각된 매끄러운 흑암",
  cracked_polished_blackstone_bricks: "갈라진 매끄러운 흑암 벽돌",
  basalt: "현무암",
  polished_basalt: "매끄러운 현무암",
  smooth_basalt: "매끄러운 현무암",
  tuff: "응회암",
  tuff_brick: "응회암 벽돌",
  tuff_bricks: "응회암 벽돌",
  chiseled_tuff: "조각된 응회암",
  chiseled_tuff_brick: "조각된 응회암 벽돌",
  chiseled_tuff_bricks: "조각된 응회암 벽돌",
  polished_tuff: "매끄러운 응회암",
  calcite: "방해석",
  dripstone: "점적석",
  amethyst: "자수정",
  prismarine: "프리즈마린",
  purpur: "퍼퍼",
  quartz: "석영",
  sandstone: "사암",
  red_sandstone: "붉은 사암",
  cut_sandstone: "깎인 사암",
  cut_red_sandstone: "깎인 붉은 사암",
  chiseled_sandstone: "조각된 사암",
  chiseled_red_sandstone: "조각된 붉은 사암",
  smooth_sandstone: "매끄러운 사암",
  smooth_red_sandstone: "매끄러운 붉은 사암",
  smooth_stone: "매끄러운 돌",
  smooth_quartz: "매끄러운 석영",
  stone_brick: "돌 벽돌",
  stone_bricks: "돌 벽돌",
  mossy_stone_bricks: "이끼 낀 돌 벽돌",
  cracked_stone_bricks: "갈라진 돌 벽돌",
  chiseled_stone_bricks: "조각된 돌 벽돌",
  deepslate_brick: "심층암 벽돌",
  deepslate_bricks: "심층암 벽돌",
  deepslate_tile: "심층암 타일",
  deepslate_tiles: "심층암 타일",
  cracked_deepslate_bricks: "갈라진 심층암 벽돌",
  cracked_deepslate_tiles: "갈라진 심층암 타일",
  chiseled_deepslate: "조각된 심층암",
  polished_deepslate: "매끄러운 심층암",
  cobbled_deepslate: "깨진 심층암",
  reinforced_deepslate: "강화 심층암",
  mud_brick: "진흙 벽돌",
  mud_bricks: "진흙 벽돌",
  packed_mud: "굳은 진흙",
  packed_ice: "얼어붙은 얼음",
  blue_ice: "푸른 얼음",
  frosted_ice: "서리 얼음",
  nether_brick: "네더 벽돌",
  nether_bricks: "네더 벽돌",
  red_nether_brick: "붉은 네더 벽돌",
  red_nether_bricks: "붉은 네더 벽돌",
  cracked_nether_bricks: "갈라진 네더 벽돌",
  chiseled_nether_bricks: "조각된 네더 벽돌",
  end_stone_brick: "엔드 석 벽돌",
  end_stone_bricks: "엔드 석 벽돌",
  quartz_brick: "석영 벽돌",
  quartz_bricks: "석영 벽돌",
  chiseled_quartz_block: "조각된 석영 블록",
  resin_brick: "수지 벽돌",
  resin_bricks: "수지 벽돌",
  chiseled_resin_bricks: "조각된 수지 벽돌",
  copper: "구리",
  cut_copper: "깎인 구리",
  chiseled_copper: "조각된 구리",
  exposed_copper: "약간 녹슨 구리",
  weathered_copper: "녹슨 구리",
  oxidized_copper: "산화된 구리",
  waxed_copper_block: "왁스칠한 구리 블록",
  waxed_cut_copper: "왁스칠한 깎인 구리",
  waxed_exposed_copper: "왁스칠한 약간 녹슨 구리",
  waxed_weathered_copper: "왁스칠한 녹슨 구리",
  waxed_oxidized_copper: "왁스칠한 산화된 구리",
  terracotta: "테라코타",
  concrete: "콘크리트",
  concrete_powder: "콘크리트 가루",
  glazed_terracotta: "윤이 나는 테라코타",
  stained_glass: "색유리",
  stained_glass_pane: "색유리 판",
  wool: "양털",
  carpet: "양탄자",
  candle: "양초",
  shulker_box: "셜커 상자",
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
  brain_coral_block: "뇌 산호 블록",
  bubble_coral_block: "거품 산호 블록",
  fire_coral_block: "불 산호 블록",
  horn_coral_block: "뿔 산호 블록",
  tube_coral_block: "관 산호 블록",
  dead_brain_coral_block: "죽은 뇌 산호 블록",
  dead_bubble_coral_block: "죽은 거품 산호 블록",
  dead_fire_coral_block: "죽은 불 산호 블록",
  dead_horn_coral_block: "죽은 뿔 산호 블록",
  dead_tube_coral_block: "죽은 관 산호 블록",
  brain_coral_fan: "뇌 부채산호",
  bubble_coral_fan: "거품 부채산호",
  fire_coral_fan: "불 부채산호",
  horn_coral_fan: "뿔 부채산호",
  tube_coral_fan: "관 부채산호",
  dead_brain_coral_fan: "죽은 뇌 부채산호",
  dead_bubble_coral_fan: "죽은 거품 부채산호",
  dead_fire_coral_fan: "죽은 불 부채산호",
  dead_horn_coral_fan: "죽은 뿔 부채산호",
  dead_tube_coral_fan: "죽은 관 부채산호",
  azalea: "진달래",
  flowering_azalea: "꽃 핀 진달래",
  azalea_leaves: "진달래 잎",
  flowering_azalea_leaves: "꽃 핀 진달래 잎",
  mangrove_propagule: "맹그로브 번식지",
  muddy_mangrove_roots: "진흙 맹그로브 뿌리",
  pale_hanging_moss: "창백한 매달린 이끼",
  pale_moss_carpet: "창백한 이끼 카펫",
  pink_petals: "분홍 꽃잎",
  wildflowers: "들꽃",
  firefly_bush: "반딧불 덤불",
  pitcher_plant: "벌레잡이풀",
  pitcher_crop: "벌레잡이풀",
  big_dripleaf_stem: "큰 버들잎 줄기",
  small_dripleaf: "작은 버들잎",
  pointed_dripstone: "점적 돌기",
  dripstone_block: "점적석 블록",
  budding_amethyst: "싹트는 자수정",
  amethyst_cluster: "자수정 군집",
  small_amethyst_bud: "작은 자수정 봉우리",
  medium_amethyst_bud: "중간 자수정 봉우리",
  large_amethyst_bud: "큰 자수정 봉우리",
  crimson_nylium: "진홍 균사체",
  warped_nylium: "뒤틀린 균사체",
  crimson_fungus: "진홍 균",
  warped_fungus: "뒤틀린 균",
  crimson_roots: "진홍 뿌리",
  warped_roots: "뒤틀린 뿌리",
  nether_wart_block: "네더 사마귀 블록",
  warped_wart_block: "뒤틀린 사마귀 블록",
  soul_sand: "영혼 모래",
  soul_soil: "영혼 흙",
  netherrack: "네더랙",
  end_stone: "엔드 석",
  obsidian: "흑요석",
  crying_obsidian: "우는 흑요석",
  glowstone: "발광석",
  shroomlight: "버섯불",
  magma: "마그마",
  magma_block: "마그마 블록",
  ancient_debris: "고대 잔해",
  netherite_block: "네더라이트 블록",
  iron_block: "철 블록",
  gold_block: "금 블록",
  diamond_block: "다이아몬드 블록",
  emerald_block: "에메랄드 블록",
  lapis_block: "청금석 블록",
  redstone_block: "레드스톤 블록",
  coal_block: "석탄 블록",
  copper_block: "구리 블록",
  raw_iron_block: "원석 철 블록",
  raw_gold_block: "원석 금 블록",
  raw_copper_block: "원석 구리 블록",
  bone_block: "뼈 블록",
  hay_block: "건초 블록",
  slime_block: "점액 블록",
  honey_block: "꿀 블록",
  dried_kelp_block: "말린 다시마 블록",
  melon: "수박",
  pumpkin: "호박",
  carved_pumpkin: "조각된 호박",
  jack_o_lantern: "잭오랜턴",
  cactus: "선인장",
  bamboo: "대나무",
  bamboo_block: "대나무 블록",
  bamboo_mosaic: "대나무 모자이크",
  sugar_cane: "사탕수수",
  kelp: "다시마",
  seagrass: "해초",
  vine: "덩굴",
  lily_pad: "연꽃잎",
  cobweb: "거미줄",
  snow: "눈",
  powder_snow: "가루눈",
  ice: "얼음",
  glass: "유리",
  glass_pane: "유리판",
  tinted_glass: "차광 유리",
  ladder: "사다리",
  scaffolding: "비계",
  chain: "사슬",
  iron_bars: "철창",
  lightning_rod: "피뢰침",
  end_rod: "엔드 막대",
  dragon_egg: "드래곤 알",
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
  open_eyeblossom: "핀 눈꽃",
  closed_eyeblossom: "닫힌 눈꽃",
  torchflower: "횃불꽃",
  heavy_core: "중량 코어",
  pale_moss_block: "창백한 이끼 블록",
  frogspawn: "개구리알",
  sniffer_egg: "스니퍼 알",
  decorated_pot: "장식된 항아리",
  suspicious_sand: "수상한 모래",
  suspicious_gravel: "수상한 자갈",
  respawn_anchor: "리스폰 정박기",
  beacon: "신호기",
  conduit: "전달체",
  target: "과녁",
  lodestone: "자석석",
  bell: "종",
  anvil: "모루",
  grindstone: "숫돌",
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
  lever: "레버",
  daylight_detector: "햇빛 감지기",
  note_block: "노트 블록",
  tnt: "티엔티",
  sponge: "스폰지",
  wet_sponge: "젖은 스폰지",
  sea_lantern: "바다 랜턴",
  campfire: "모닥불",
  soul_campfire: "영혼 모닥불",
  torch: "횃불",
  soul_torch: "영혼 횃불",
  lantern: "랜턴",
  soul_lantern: "영혼 랜턴",
  copper_lantern: "구리 랜턴",
  copper_bulb: "구리 전구",
  copper_grate: "구리 격자",
  copper_door: "구리 문",
  copper_trapdoor: "구리 다락문",
  iron_door: "철 문",
  iron_trapdoor: "철 다락문",
  activator_rail: "활성화 레일",
  detector_rail: "감지 레일",
  powered_rail: "파워드 레일",
  rail: "레일",
  dirt: "흙",
  grass_block: "잔디 블록",
  podzol: "포드졸",
  mycelium: "균사체",
  coarse_dirt: "거친 흙",
  rooted_dirt: "뿌리 박힌 흙",
  farmland: "경작지",
  dirt_path: "흙길",
  sand: "모래",
  red_sand: "붉은 모래",
  gravel: "자갈",
  clay: "점토",
  mud: "진흙",
  moss_block: "이끼 블록",
  infested_stone: "벌레 먹은 돌",
  infested_cobblestone: "벌레 먹은 둥근돌",
  infested_deepslate: "벌레 먹은 심층암",
  infested_chiseled_stone_bricks: "벌레 먹은 조각된 돌 벽돌",
  infested_cracked_stone_bricks: "벌레 먹은 갈라진 돌 벽돌",
  infested_mossy_stone_bricks: "벌레 먹은 이끼 낀 돌 벽돌",
  infested_stone_bricks: "벌레 먹은 돌 벽돌",
  coal_ore: "석탄 광석",
  iron_ore: "철 광석",
  gold_ore: "금 광석",
  diamond_ore: "다이아몬드 광석",
  emerald_ore: "에메랄드 광석",
  lapis_ore: "청금석 광석",
  redstone_ore: "레드스톤 광석",
  copper_ore: "구리 광석",
  nether_quartz_ore: "네더 석영 광석",
  nether_gold_ore: "네더 금 광석",
  ancient_debris: "고대 잔해",
  spore_blossom: "포자 꽃",
  glow_lichen: "발광 이끼",
  froglight: "개구리불",
  ochre_froglight: "황토색 개구리불",
  verdant_froglight: "초록 개구리불",
  pearlescent_froglight: "자줄빛 개구리불",
  froglight_ochre: "황토색 개구리불",
  froglight_verdant: "초록 개구리불",
  froglight_pearlescent: "자줄빛 개구리불",
};

const MOBS = {
  allay: "알레이",
  armadillo: "아르마딜로",
  axolotl: "아홀로틀",
  bat: "박쥐",
  bee: "벌",
  blaze: "블레이즈",
  bogged: "보그드",
  breeze: "브리즈",
  camel: "낙타",
  cat: "고양이",
  cave_spider: "동굴 거미",
  chicken: "닭",
  cod: "대구",
  cow: "소",
  creaking: "크리킹",
  creeper: "크리퍼",
  dolphin: "돌고래",
  donkey: "당나귀",
  drowned: "드rowned",
  elder_guardian: "엘더 가디언",
  ender_dragon: "엔더 드래곤",
  enderman: "엔더맨",
  endermite: "엔더mite",
  evoker: "소환사",
  fox: "여우",
  frog: "개구리",
  ghast: "가스트",
  glow_squid: "발광 오징어",
  goat: "염소",
  guardian: "가디언",
  hoglin: "호글린",
  horse: "말",
  husk: "허스크",
  iron_golem: "철 골lem",
  llama: "라마",
  magma_cube: "마그마 큐브",
  mooshroom: "무shroom",
  mule: "노새",
  ocelot: "오celot",
  panda: "판다",
  parrot: "앵무새",
  phantom: "팬텀",
  pig: "돼지",
  piglin: "피글린",
  piglin_brute: "피글린 brute",
  pillager: "약탈자",
  polar_bear: "북극곰",
  pufferfish: "복어",
  rabbit: "토끼",
  ravager: "파괴수",
  salmon: "연어",
  sheep: "양",
  shulker: "셜커",
  silverfish: "좀be",
  skeleton: "스켈레톤",
  skeleton_horse: "스켈레톤 말",
  slime: "슬라임",
  sniffer: "스니퍼",
  snow_golem: "눈 골lem",
  spider: "거미",
  squid: "오징어",
  stray: "스트ray",
  strider: "스트라ider",
  tadpole: "올챙이",
  trader_llama: "상인 라마",
  tropical_fish: "열대어",
  turtle: "거북",
  vex: "벡스",
  villager: "주민",
  vindicator: "변명자",
  wandering_trader: "떠돌이 상인",
  warden: "워든",
  witch: "마녀",
  wither: "위더",
  wither_skeleton: "위더 스켈레톤",
  wolf: "늑대",
  zoglin: "조글린",
  zombie: "좀비",
  zombie_horse: "좀비 말",
  zombie_villager: "좀비 주민",
  zombified_piglin: "좀비화 피글린",
  ender_dragon: "엔더 드래곤",
  giant: "거인",
  illusioner: "환술사",
  zombie_horse: "좀비 말",
};

const SUFFIX_ORDER = [
  "_wall_hanging_sign",
  "_hanging_sign",
  "_wall_sign",
  "_pressure_plate",
  "_fence_gate",
  "_chest_boat",
  "_spawn_egg",
  "_smithing_template",
  "_armor_trim",
  "_pottery_sherd",
  "_horse_armor",
  "_minecart",
  "_bucket",
  "_boat",
  "_trapdoor",
  "_fence",
  "_button",
  "_stairs",
  "_slab",
  "_wall",
  "_sign",
  "_bed",
  "_banner",
  "_bundle",
  "_dye",
  "_disc",
  "_shelf",
  "_leaves",
  "_sapling",
  "_planks",
  "_log",
  "_wood",
  "_hyphae",
  "_stem",
  "_nylium",
  "_roots",
  "_fungus",
  "_wart_block",
  "_coral_fan",
  "_coral_block",
  "_coral",
  "_block",
  "_ore",
];

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

  if (MATERIALS[id]) return MATERIALS[id];
  for (const [mat, ko] of Object.entries(MATERIALS)) {
    if (id.startsWith(`${mat}_`)) {
      const rest = id.slice(mat.length + 1);
      const part = BLOCK_PARTS[rest];
      if (part) return `${ko} ${part}`;
    }
  }

  if (id.endsWith("_spawn_egg")) {
    const mob = id.slice(0, -10);
    const mobKo = MOBS[mob] ?? idToKoName(mob);
    return `${mobKo} 생성 알`;
  }

  if (id.endsWith("_bucket")) {
    const content = id.slice(0, -7);
    if (content === "water") return "물 양동이";
    if (content === "lava") return "용암 양동이";
    if (content === "milk") return "우유 양동이";
    if (content === "powder_snow") return "가루눈 양동이";
    const contentKo = MATERIALS[content] ?? MOBS[content] ?? idToKoName(content);
    return `${contentKo} 양동이`;
  }

  if (id.endsWith("_pottery_sherd")) {
    const prefix = id.slice(0, -14);
    const prefixKo = BLOCK_PARTS[prefix] ?? MATERIALS[prefix] ?? idToKoName(prefix);
    return `${prefixKo} 도자기 조각`;
  }

  if (id.endsWith("_smithing_template")) {
    const prefix = id.slice(0, -18);
    const prefixKo = BLOCK_PARTS[prefix] ?? MATERIALS[prefix] ?? idToKoName(prefix);
    return `${prefixKo} 대장장이 형판`;
  }

  if (id.endsWith("_armor_trim")) {
    return `${idToKoName(id.slice(0, -11))} 갑옷 장식`;
  }

  if (id.startsWith("music_disc_")) {
    return `음반 (${id.slice(11)})`;
  }

  if (id.startsWith("infested_")) {
    return `벌레 먹은 ${idToKoName(id.slice(9))}`;
  }

  if (id.startsWith("waxed_")) {
    return `왁스칠한 ${idToKoName(id.slice(6))}`;
  }

  const PREFIXES = {
    cracked_: "갈라진 ",
    chiseled_: "조각된 ",
    polished_: "매끄러운 ",
    smooth_: "매끄러운 ",
    cut_: "깎인 ",
    exposed_: "약간 녹슨 ",
    weathered_: "녹슨 ",
    oxidized_: "산화된 ",
    stripped_: "껍질 벗긴 ",
    dead_: "죽은 ",
  };
  for (const [pre, koPre] of Object.entries(PREFIXES)) {
    if (id.startsWith(pre)) {
      return koPre + idToKoName(id.slice(pre.length));
    }
  }

  if (id.startsWith("potted_")) {
    return `화분에 심은 ${idToKoName(id.slice(7))}`;
  }

  const TOOL_SUFFIX = {
    pickaxe: "곡괭이",
    axe: "도끼",
    shovel: "삽",
    hoe: "괭이",
    sword: "검",
  };
  const ARMOR_SUFFIX = {
    helmet: "투구",
    chestplate: "흉갑",
    leggings: "레깅스",
    boots: "부츠",
  };
  const TIERS = {
    wooden: "나무",
    stone: "돌",
    iron: "철",
    golden: "금",
    diamond: "다이아몬드",
    netherite: "네더라이트",
    chainmail: "사슬",
  };
  for (const [tier, tierKo] of Object.entries(TIERS)) {
    for (const [tool, toolKo] of Object.entries(TOOL_SUFFIX)) {
      if (id === `${tier}_${tool}`) return `${tierKo} ${toolKo}`;
    }
    for (const [armor, armorKo] of Object.entries(ARMOR_SUFFIX)) {
      if (id === `${tier}_${armor}`) return `${tierKo} ${armorKo}`;
    }
  }

  if (id.endsWith("_on_a_stick")) {
    const base = id.slice(0, -11);
    return `${idToKoName(base)}가 달린 막대`;
  }

  for (const suffix of SUFFIX_ORDER) {
    if (!id.endsWith(suffix)) continue;
    const base = id.slice(0, -suffix.length);
    const suffixKey = suffix.slice(1);
    const suffixPart = BLOCK_PARTS[suffixKey];
    if (!suffixPart) continue;
    const baseKo = idToKoName(base);
    if (suffixKey === "block" && baseKo.includes("블록")) return baseKo;
    return `${baseKo} ${suffixPart}`.trim();
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
    fire: "불",
    lava: "용암",
    water: "물",
    air: "공기",
    fern: "고사리",
    large_fern: "키 큰 고사리",
    bubble_column: "거품 기둥",
    end_gateway: "엔드 관문",
    end_portal: "엔드 차원문",
    nether_portal: "네더 차원문",
    lava_cauldron: "용암 가마솥",
    water_cauldron: "물 가마솥",
    powder_snow_cauldron: "가루눈 가마솥",
    jigsaw: "직소 블록",
    structure_block: "구조 블록",
    structure_void: "구조물 공허",
    player_head: "플레이어 머리",
    beef: "익히지 않은 소고기",
    cooked_beef: "스테이크",
    porkchop: "익히지 않은 돼지고기",
    cooked_porkchop: "익힌 돼지고기",
    mutton: "익히지 않은 양고기",
    cooked_mutton: "익힌 양고기",
    chicken: "익히지 않은 닭고기",
    cooked_chicken: "익힌 닭고기",
    rabbit: "익히지 않은 토끼고기",
    cooked_rabbit: "익힌 토끼고기",
    cod: "생 대구",
    cooked_cod: "익힌 대구",
    salmon: "생 연어",
    cooked_salmon: "익힌 연어",
    baked_potato: "구운 감자",
    beetroot_soup: "비트 수프",
    mushroom_stew: "버섯 스튜",
    rabbit_stew: "토끼 스튜",
    suspicious_stew: "수상한 스튜",
    bowl: "그릇",
    armor_stand: "갑옷 거치대",
    debug_stick: "디버그 막대",
    knowledge_book: "지식의 책",
    filled_map: "지도",
    firework_rocket: "폭죽",
    firework_star: "폭죽 별",
    goat_horn: "염소 뿔",
    echo_shard: "메아리 조각",
    disc_fragment: "음반 조각",
    heart_of_the_sea: "바다의 심장",
    nautilus_shell: "노틸러스 껍데기",
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
    allium: "알리움",
    azure_bluet: "선애기별",
    blue_orchid: "파란 난초",
    cornflower: "수레국화",
    dandelion: "민들레",
    lilac: "라일락",
    lily_of_the_valley: "은방울꽃",
    orange_tulip: "주황 튤립",
    oxeye_daisy: "데이지",
    peony: "모란",
    pink_tulip: "분홍 튤립",
    poppy: "양귀비",
    red_tulip: "빨간 튤립",
    rose_bush: "장미 덤불",
    sunflower: "해바라기",
    white_tulip: "하얀 튤립",
    wither_rose: "위더 장미",
    cave_vines_plant: "동굴 덩굴 식물",
    redstone_wire: "레드스톤 선",
    soul_fire: "영혼 불",
    twisting_vines_plant: "뒤틀린 덩굴 식물",
    weeping_vines_plant: "늘어진 덩굴 식물",
    dragon_head: "드래곤 머리",
    end_crystal: "엔드 수정",
    lingering_potion: "잔류형 물약",
    painting: "그림",
    poisonous_potato: "독이 있는 감자",
    potion: "물약",
    splash_potion: "투척형 물약",
    tipped_arrow: "효과가 있는 화살",
    written_book: "글이 적힌 책",
    tnt: "티엔티",
  };

  if (known[id]) return known[id];

  const parts = id.split("_").map((p) => {
    return (
      BLOCK_PARTS[p] ??
      MATERIALS[p] ??
      MOBS[p] ??
      COLORS[p] ??
      WOODS[p] ??
      p
    );
  });
  return parts.join(" ");
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
