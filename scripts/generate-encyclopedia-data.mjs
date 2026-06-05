/**
 * 위키 참고 몹·바이옴 데이터 생성
 * node scripts/generate-encyclopedia-data.mjs
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const mobs = [
  // ── 오버월드 · 수동적 ──
  { id: "bat", name: "박쥐", dimension: "overworld", emoji: "🦇", category: "수동적", health: 6, drops: [], spawn: "동굴·폐광(밝기 3 이하)", traits: "벽에 매달려 휴식. 플레이어를 공격하지 않음.", description: "어두운 동굴에서 날아다니는 작은 몹. 경험치는 거의 없다." },
  { id: "chicken", name: "닭", dimension: "overworld", emoji: "🐔", category: "수동적", health: 4, drops: ["feather", "chicken", "egg"], spawn: "잔디 블록, 밝기 9 이상", traits: "알을 낳음. 낙하 시 날개 펄럭여 피해 감소.", description: "초반 식량·깃털 공급원." },
  { id: "cow", name: "소", dimension: "overworld", emoji: "🐄", category: "수동적", health: 10, drops: ["leather", "beef"], spawn: "잔디 블록, 밝기 9 이상", traits: "번식: 밀 2개. 우유 양동이로 채집.", description: "가죽·음식·책장 제작의 기본 공급원." },
  { id: "pig", name: "돼지", dimension: "overworld", emoji: "🐷", category: "수동적", health: 10, drops: ["porkchop"], spawn: "잔디 블록", traits: "당근으로 유인·번식. 안장+지팡이로 탑승.", description: "초반 식량·번식용." },
  { id: "sheep", name: "양", dimension: "overworld", emoji: "🐑", category: "수동적", health: 8, drops: ["wool", "mutton"], spawn: "잔디 블록", traits: "가위로 양털 채취(양 생존). 밀로 번식.", description: "침대 제작에 양털이 필수." },
  { id: "horse", name: "말", dimension: "overworld", emoji: "🐴", category: "수동적", health: 30, drops: ["leather"], spawn: "평원·사바나", traits: "길들이기·안장·갑옷 착용. 점프력·속도 능력치 다양.", description: "이동 수단으로 유용." },
  { id: "donkey", name: "당나귀", dimension: "overworld", emoji: "🫏", category: "수동적", health: 30, drops: ["leather"], spawn: "평원(말과 함께)", traits: "상자 부착 가능. 말보다 느리지만 짐 운반.", description: "소형 이동 창고." },
  { id: "rabbit", name: "토끼", dimension: "overworld", emoji: "🐇", category: "수동적", health: 3, drops: ["rabbit", "rabbit_hide", "rabbit_foot"], spawn: "사막·타이가·설원", traits: "당근·황금 당근으로 번식. 희귀 발 발톱 드롭.", description: "사막·눈 바이옴에서 흔함." },
  { id: "squid", name: "오징어", dimension: "overworld", emoji: "🦑", category: "수동적", health: 10, drops: ["ink_sac"], spawn: "바다·강", traits: "피해 시 먹물 방출. 수중 호흡.", description: "먹물·검은 염료 제작 재료." },
  { id: "glow_squid", name: "발광 오징어", dimension: "overworld", emoji: "✨", category: "수동적", health: 10, drops: ["glow_ink_sac"], spawn: "깊은 바다·동굴 수중", traits: "발광 먹물 방출. 어둠 속 시야 확보.", description: "발광 표지판·발광 아이템 프레임에 사용." },
  { id: "cod", name: "대구", dimension: "overworld", emoji: "🐟", category: "수동적", health: 3, drops: ["cod"], spawn: "일반·차가운 바다", traits: "물 속에서만 생존. 물고기 양동이에 담을 수 있음.", description: "생선 음식·거래 재료." },
  { id: "salmon", name: "연어", dimension: "overworld", emoji: "🐟", category: "수동적", health: 3, drops: ["salmon"], spawn: "강·한대·냉대 바다", traits: "위로 헤엄치는 특유의 움직임.", description: "강가 낚시·식량." },
  { id: "tropical_fish", name: "열대어", dimension: "overworld", emoji: "🐠", category: "수동적", health: 3, drops: ["tropical_fish"], spawn: "따뜻한·온대 바다", traits: "다양한 색 패턴. 물고기 양동이에 담아 수족관.", description: "장식용 물고기." },
  { id: "turtle", name: "거북", dimension: "overworld", emoji: "🐢", category: "수동적", health: 30, drops: ["seagrass"], spawn: "해변(모래 위)", traits: "알 부화. 성체는 가죽·등딱지 드롭.", description: "거북 등딱지(호흡 연장) 획득." },
  { id: "cat", name: "고양이", dimension: "overworld", emoji: "🐱", category: "수동적", health: 10, drops: [], spawn: "마을·늪 오두막", traits: "생선·생연어로 길들임. 크리퍼·팬텀 겁줌.", description: "마을 방어·애완용." },
  { id: "ocelot", name: "오실롯", dimension: "overworld", emoji: "🐆", category: "수동적", health: 10, drops: [], spawn: "정글", traits: "생선으로 유인. 크리퍼 회피.", description: "정글에서 길들여 고양이로 전환." },
  { id: "parrot", name: "앵무새", dimension: "overworld", emoji: "🦜", category: "수동적", health: 6, drops: ["feather"], spawn: "정글", traits: "씨앗·쿠키로 긴들임. 플레이어 어깨에 앉음. 소리 모방.", description: "정글 탐험 시 동반자." },
  { id: "panda", name: "판다", dimension: "overworld", emoji: "🐼", category: "수동적", health: 20, drops: ["bamboo"], spawn: "대나무 정글", traits: "대나무·케이크 번식. 성격(보통·게으름·걱정)에 따라 행동 다름.", description: "대나무 정글 전용." },
  { id: "fox", name: "여우", dimension: "overworld", emoji: "🦊", category: "수동적", health: 10, drops: ["sweet_berries"], spawn: "타이가·눈 타이가", traits: "달콤한 열매로 번식. 밤에 닭·토끼 사냥.", description: "타이가 생태계의 포식자." },
  { id: "axolotl", name: "아홀로틀", dimension: "overworld", emoji: "🦎", category: "수동적", health: 14, drops: [], spawn: "늪 지하 동굴 수중", traits: "버킷에 담아 이동. 플레이어 대신 적 공격.", description: "수중 전투 보조." },
  { id: "frog", name: "개구리", dimension: "overworld", emoji: "🐸", category: "수동적", health: 10, drops: [], spawn: "늪", traits: "올챙이로 번식. 슬라임볼·마그마 큐브를 구슬로 변환.", description: "온대·따뜻·추운 개구리 색 변종." },
  { id: "allay", name: "알레이", dimension: "overworld", emoji: "🧚", category: "수동적", health: 20, drops: [], spawn: "약탈자 전초기지 감옥", traits: "아이템 수집·전달. 노트 블록 소리에 반응.", description: "자동화·정렬에 활용." },
  { id: "sniffer", name: "스니퍼", dimension: "overworld", emoji: "🦕", category: "수동적", health: 14, drops: ["torchflower_seeds"], spawn: "스니퍼 알 부화", traits: "땅을 파서 고대 씨앗 발굴.", description: "1.20 고대 식물 복원." },
  { id: "camel", name: "낙타", dimension: "overworld", emoji: "🐫", category: "수동적", health: 32, drops: [], spawn: "사막 마을", traits: "두 명 동시 탑승. 긴 점프.", description: "사막 이동 수단." },
  { id: "villager", name: "주민", dimension: "overworld", emoji: "🧑‍🌾", category: "수동적", health: 20, drops: [], spawn: "마을·인공 주민 생성기", traits: "직업·거래. 좀비 주민 치료 가능.", description: "에메랄드 거래로 장비·식량 확보." },
  { id: "wandering_trader", name: "떠돌이 상인", dimension: "overworld", emoji: "🧳", category: "수동적", health: 20, drops: [], spawn: "플레이어 근처(랜덤)", traits: "에메랄드로 희귀 식물·블록 거래. 라마 동반.", description: "난 씨앗·삼나무 묘목 등 구매." },
  { id: "iron_golem", name: "철 골렘", dimension: "overworld", emoji: "🤖", category: "수동적", health: 100, drops: ["iron_ingot", "poppy"], spawn: "마을(주민 수 충족)·플레이어 제작", traits: "주민 보호. 플레이어가 만든 골렘은 중립.", description: "마을 방어·철 공급." },
  { id: "snow_golem", name: "눈 골렘", dimension: "overworld", emoji: "⛄", category: "수동적", health: 4, drops: ["snowball"], spawn: "플레이어 제작(눈+호박)", traits: "눈덩이 투척. 더운 바이옴에서 녹음.", description: "장식·소형 방어." },
  // ── 오버월드 · 중립 ──
  { id: "wolf", name: "늑대", dimension: "overworld", emoji: "🐺", category: "중립", health: 20, drops: [], spawn: "숲·타이가", traits: "뼈다귀로 길들임. 주인 공격 시 전원 적대.", description: "충성스러운 동료." },
  { id: "bee", name: "꿀벌", dimension: "overworld", emoji: "🐝", category: "중립", health: 10, drops: [], spawn: "벌집·벌통 근처", traits: "꽃 수분. 공격 시 독·군체 공격.", description: "꿀·벌집·왁스 생산." },
  { id: "dolphin", name: "돌고래", dimension: "overworld", emoji: "🐬", category: "중립", health: 10, drops: ["cod"], spawn: "따뜻한·온대 바다", traits: "플레이어 수영 가속. 생선 먹이.", description: "해상 이동 보조." },
  { id: "goat", name: "염소", dimension: "overworld", emoji: "🐐", category: "중립", health: 10, drops: ["goat_horn"], spawn: "눈 덮인 비탈·봉우리", traits: "높은 점프·밀치기. 뿔 드롭.", description: "산악 지형 이동." },
  { id: "polar_bear", name: "북극곰", dimension: "overworld", emoji: "🐻‍❄️", category: "중립", health: 30, drops: ["cod", "salmon"], spawn: "얼어붙은·눈 덮인 바이옴", traits: "새끼 근처 접근 시 공격.", description: "눈 바이옴의 위협." },
  { id: "llama", name: "라마", dimension: "overworld", emoji: "🦙", category: "중립", health: 30, drops: ["leather"], spawn: "산악·사바나 고원", traits: "상자 부착. 침 뱉기(공격 시).", description: "산간 운반대." },
  { id: "spider", name: "거미", dimension: "overworld", emoji: "🕷️", category: "중립", health: 16, drops: ["string", "spider_eye"], spawn: "어두운 곳(밝기 7 이하)", traits: "벽·천장 이동. 낮에는 중립.", description: "실·거미 눈 공급." },
  { id: "cave_spider", name: "동굴 거미", dimension: "overworld", emoji: "🕸️", category: "중립", health: 12, drops: ["string", "spider_eye"], spawn: "폐광·동굴", traits: "독 공격. 작고 빠름.", description: "폐광 탐사 시 주의." },
  { id: "drowned", name: "드라운드", dimension: "overworld", emoji: "🧟‍♂️", category: "중립", health: 20, drops: ["rotten_flesh", "copper_ingot", "trident"], spawn: "어두운 물·좀비 익사", traits: "삼지창 투척. 물·육지 모두 이동.", description: "삼지창·구리 획득." },
  // ── 오버월드 · 적대적 ──
  { id: "zombie", name: "좀비", dimension: "overworld", emoji: "🧟", category: "적대적", health: 20, drops: ["rotten_flesh", "iron_ingot", "carrot", "potato"], spawn: "어두운 곳(밝기 7 이하)", traits: "플레이어 추적. 물에서 떠오르지 못함. 아기 좀비는 더 빠름.", description: "가장 흔한 적대적 몹. 첫 밤의 주된 위협." },
  { id: "husk", name: "허스크", dimension: "overworld", emoji: "🏜️", category: "적대적", health: 20, drops: ["rotten_flesh"], spawn: "사막·사바나(밤)", traits: "공격 시 배고픔 효과 부여.", description: "사막 변종 좀비." },
  { id: "skeleton", name: "스켈레톤", dimension: "overworld", emoji: "💀", category: "적대적", health: 20, drops: ["bone", "arrow", "bow"], spawn: "어두운 곳", traits: "활 원거리 공격. 햇빛에 불타 죽음.", description: "뼈·화살·활 공급." },
  { id: "stray", name: "스트레이", dimension: "overworld", emoji: "❄️", category: "적대적", health: 20, drops: ["bone", "arrow", "bow"], spawn: "눈 덮인 바이옴", traits: "서리 화살(이동 속도 감소).", description: "설원 변종 스켈레톤." },
  { id: "creeper", name: "크리퍼", dimension: "overworld", emoji: "💥", category: "적대적", health: 20, drops: ["gunpowder", "music_disc"], spawn: "어두운 곳", traits: "접근 시 폭발. 번개 맞으면 충전 크리퍼.", description: "건축물 파괴 주의. 활·히트앤런." },
  { id: "phantom", name: "팬텀", dimension: "overworld", emoji: "👻", category: "적대적", health: 20, drops: ["phantom_membrane"], spawn: "3일 이상 잠 안 잔 플레이어 위", traits: "공중 급강하 공격. 고양이·오celot 회피.", description: "팬텀 막(느린 낙하) 재료." },
  { id: "witch", name: "마녀", dimension: "overworld", emoji: "🧙", category: "적대적", health: 26, drops: ["glass_bottle", "glowstone_dust", "gunpowder", "redstone"], spawn: "늪 오두막·어두운 곳(희귀)", traits: "포션 투척(피해·독·속도).", description: "포션 재료 드롭." },
  { id: "slime", name: "슬라임", dimension: "overworld", emoji: "🟢", category: "적대적", health: 16, drops: ["slime_ball"], spawn: "슬라임 청크(지하)", traits: "죽으면 작은 슬라임으로 분열.", description: "끈끈이 피스톤·도약대 재료." },
  { id: "silverfish", name: "좀벌레", dimension: "overworld", emoji: "🪲", category: "적대적", health: 8, drops: [], spawn: "요새·벌레 먹은 블록", traits: "벽 속 숨기. 주변 좀벌레 소환.", description: "요새 탐험 시 방해." },
  { id: "pillager", name: "약탈자", dimension: "overworld", emoji: "🏹", category: "적대적", health: 24, drops: ["crossbow", "emerald"], spawn: "약탈자 전초기지·습격", traits: "석궁 공격. 불악의 효과 시 습격대.", description: "불악의 효과·습격 이벤트." },
  { id: "vindicator", name: "변명자", dimension: "overworld", emoji: "🪓", category: "적대적", health: 24, drops: ["emerald"], spawn: "우민 저택·습격", traits: "도끼 근접 공격. 매우 빠름.", description: "우민 저택 보스급 몹." },
  { id: "evoker", name: "소환사", dimension: "overworld", emoji: "✨", category: "적대적", health: 24, drops: ["totem_of_undying", "emerald"], spawn: "우민 저택", traits: "벡스 소환·아규 지팡이(이빨).", description: "불사의 토템 획득." },
  { id: "ravager", name: "파괴수", dimension: "overworld", emoji: "🦏", category: "적대적", health: 100, drops: ["saddle"], spawn: "습격(5파)", traits: "높은 체력·넉백. 블록 파괴.", description: "습격 최종 보스급." },
  { id: "warden", name: "워든", dimension: "overworld", emoji: "👁️", category: "적대적", health: 500, drops: ["sculk_catalyst"], spawn: "심층암(스컬크 센서 경보)", traits: "청각 기반 추적. 시야 없음. 원거리 음파.", description: "심층암 최강 몹. 회피 권장." },
  { id: "bogged", name: "보그드", dimension: "overworld", emoji: "🦴", category: "적대적", health: 16, drops: ["bone", "arrow", "bow"], spawn: "늪·시험 동굴", traits: "독 화살. 뼈로 구성.", description: "늪지대 스켈레톤 변종." },
  { id: "breeze", name: "브리즈", dimension: "overworld", emoji: "💨", category: "적대적", health: 30, drops: ["breeze_rod"], spawn: "시험 회전실", traits: "바람 투사체·넉백.", description: "시험 회전실 전용." },
  { id: "zombie_villager", name: "좀비 주민", dimension: "overworld", emoji: "🧟‍♂️", category: "적대적", health: 20, drops: ["rotten_flesh"], spawn: "좀비화된 주민", traits: "황금 사과+포션으로 치료 가능.", description: "할인 거래 주민으로 복원." },
  // ── 오버월드 · 보스 ──
  { id: "wither", name: "위더", dimension: "overworld", emoji: "💀", category: "보스", health: 300, drops: ["nether_star"], spawn: "플레이어 소환(위더 해골+영혼 모래)", traits: "폭발·위더 효과. 보스 생명력 바.", description: "네더 스타·신호기 재료." },
  // ── 네더 ──
  { id: "piglin", name: "피글린", dimension: "nether", emoji: "🐽", category: "중립", health: 16, drops: ["gold_nugget", "gold_ingot"], spawn: "네더, 진홍빛 숲·요새", traits: "금 갑옷 착용 시 중립. 금 던지면 거래.", description: "금을 소지하지 않으면 공격." },
  { id: "piglin_brute", name: "피글린 야수", dimension: "nether", emoji: "👊", category: "적대적", health: 50, drops: ["golden_axe"], spawn: "요새 폐허", traits: "항상 적대. 금으로 유혹 불가.", description: "요새 폐허 수호." },
  { id: "zombified_piglin", name: "좀비화 피글린", dimension: "nether", emoji: "🧟‍♂️", category: "중립", health: 20, drops: ["rotten_flesh", "gold_nugget"], spawn: "네더 전역", traits: "선공 시 주변 전원 적대화.", description: "함부로 공격하지 말 것." },
  { id: "hoglin", name: "호글린", dimension: "nether", emoji: "🐗", category: "적대적", health: 40, drops: ["porkchop", "leather"], spawn: "진홍빛 숲", traits: "높은 체력·넉백. 오버월드에서 조글린화.", description: "네더 고기·가죽." },
  { id: "zoglin", name: "조글린", dimension: "nether", emoji: "🐗", category: "적대적", health: 40, drops: ["rotten_flesh"], spawn: "오버월드로 나온 호글린", traits: "항상 적대. 번식 불가.", description: "호글린의 오버월드 변종." },
  { id: "strider", name: "스트라이더", dimension: "nether", emoji: "🦵", category: "수동적", health: 20, drops: ["string"], spawn: "용암 위", traits: "뒤틀린 버섯 낚싯대로 탑승·유인.", description: "용암 위 이동 수단." },
  { id: "ghast", name: "가스트", dimension: "nether", emoji: "👻", category: "적대적", health: 10, drops: ["ghast_tear", "gunpowder"], spawn: "네더 넓은 공간", traits: "화염구. 반사 가능.", description: "재생 포션·화약 재료." },
  { id: "blaze", name: "블레이즈", dimension: "nether", emoji: "🔥", category: "적대적", health: 20, drops: ["blaze_rod"], spawn: "네더 요새", traits: "공중 부유, 화염구.", description: "양조·마법부여대 필수." },
  { id: "magma_cube", name: "마그마 큐브", dimension: "nether", emoji: "🟠", category: "적대적", health: 16, drops: ["magma_cream"], spawn: "네더 요새·현무암 삼각주", traits: "슬라임과 유사, 분열.", description: "마그마 크림(포션)." },
  { id: "wither_skeleton", name: "위더 스켈레톤", dimension: "nether", emoji: "☠️", category: "적대적", health: 20, drops: ["bone", "coal", "wither_skeleton_skull"], spawn: "네더 요새", traits: "위더 효과. 검 드롭.", description: "위더 소환 재료." },
  { id: "enderman", name: "엔더맨", dimension: "end", emoji: "🟣", category: "중립", health: 40, drops: ["ender_pearl"], spawn: "엔드·오버월드(밤)·뒤틀린 숲", traits: "시선 맞추면 공격. 물·비 약점.", description: "엔더 진주·엔더 상자 핵심 재료." },
  // ── 엔드 ──
  { id: "endermite", name: "엔더마이트", dimension: "end", emoji: "🪲", category: "적대적", health: 8, drops: [], spawn: "엔더 진주 사용 시", traits: "작고 빠름.", description: "엔더 진주 텔레포트 부작용." },
  { id: "shulker", name: "셜커", dimension: "end", emoji: "📦", category: "적대적", health: 30, drops: ["shulker_shell"], spawn: "엔드 도시", traits: "유도 탄환. 쉘 효과 부여.", description: "셜커 상자 제작." },
  { id: "ender_dragon", name: "엔더 드래곤", dimension: "end", emoji: "🐉", category: "보스", health: 200, drops: ["dragon_egg", "experience"], spawn: "엔드 메인 섬", traits: "엔드 수정탑 파괴 후 공략. 최종 보스.", description: "게임 클리어 보스." },
];

const biomes = [
  // 눈 덮인
  { id: "snowy_plains", name: "눈 덮인 평원", dimension: "overworld", group: "눈 덮인", emoji: "❄️", temperature: 0.0, blocks: ["snow_block", "snow", "ice"], mobs: ["stray", "rabbit", "polar_bear", "villager"], traits: "높이와 관계없이 눈이 내리고 물이 얼음. 이글루·마을 생성.", description: "옛 '설원' 바이옴. 스트레이와 북극곰, 흰·검은 토끼가 등장한다." },
  { id: "ice_spikes", name: "역 고드름", dimension: "overworld", group: "눈 덮인", emoji: "🧊", temperature: 0.0, blocks: ["packed_ice", "ice", "snow_block"], mobs: ["stray", "rabbit", "polar_bear"], traits: "뾰족한 역 고드름 기둥. 꽁꽁 언 얼음 지형.", description: "눈 덮인 평원의 희귀 변종. 장관 있지만 이동이 어렵다." },
  { id: "snowy_taiga", name: "눈 덮인 타이가", dimension: "overworld", group: "눈 덮인", emoji: "🌲", temperature: -0.5, blocks: ["snow", "spruce_log", "sweet_berry_bush"], mobs: ["wolf", "fox", "rabbit", "villager"], traits: "가문비나무 숲에 눈 덮임. 이글루 생성 가능.", description: "늑대·달콤한 열매·설원 마을." },
  { id: "snowy_slopes", name: "눈 덮인 비탈", dimension: "overworld", group: "눈 덮인", emoji: "⛷️", temperature: -0.3, blocks: ["snow_block", "stone", "powder_snow"], mobs: ["goat", "rabbit"], traits: "산악 눈 비탈. 가루눈 구덩이 주의.", description: "1.18 산맥 업데이트의 고산 지형." },
  { id: "jagged_peaks", name: "뾰족한 봉우리", dimension: "overworld", group: "눈 덮인", emoji: "🏔️", temperature: -0.7, blocks: ["stone", "snow_block", "ice"], mobs: ["goat"], traits: "날카로운 봉우리. 에메랄드 광석.", description: "가장 극한의 산악 바이옴." },
  { id: "frozen_peaks", name: "얼어붙은 봉우리", dimension: "overworld", group: "눈 덮인", emoji: "🗻", temperature: -0.7, blocks: ["snow_block", "packed_ice", "stone"], mobs: ["goat"], traits: "얼음과 눈으로 덮인 봉우리.", description: "뾰족한 봉우리보다 완만한 고산 지형." },
  // 차가운
  { id: "taiga", name: "타이가", dimension: "overworld", group: "차가운", emoji: "🌲", temperature: 0.25, blocks: ["spruce_log", "podzol", "sweet_berry_bush"], mobs: ["wolf", "fox", "rabbit"], traits: "가문비나무·늑대. 눈 타이가 변종 존재.", description: "늑대 길들이기·베리 채집에 유리." },
  { id: "old_growth_pine_taiga", name: "거대 가문비나무 타이가", dimension: "overworld", group: "차가운", emoji: "🌲", temperature: 0.25, blocks: ["spruce_log", "podzol", "moss_carpet"], mobs: ["wolf", "fox"], traits: "매우 큰 가문비나무. 이끼 덮인 바닥.", description: "목재 수확에 최적." },
  { id: "windswept_hills", name: "바람에 휩쓸린 언덕", dimension: "overworld", group: "차가운", emoji: "⛰️", temperature: 0.2, blocks: ["stone", "emerald_ore", "spruce_log"], mobs: ["goat", "llama"], traits: "험준한 산비탈. 에메랄드 광석.", description: "옛 '산악' 바이옴. 염소·라마 서식." },
  { id: "meadow", name: "초원", dimension: "overworld", group: "차가운", emoji: "🌼", temperature: 0.5, blocks: ["grass_block", "tall_grass", "allium"], mobs: ["rabbit", "donkey", "bee"], traits: "산 중턱의 꽃 초원. 벌·당나귀.", description: "평화로운 고산 초원." },
  // 중간/녹색
  { id: "plains", name: "평원", dimension: "overworld", group: "중간", emoji: "🌾", temperature: 0.8, blocks: ["grass_block", "oak_log", "dandelion"], mobs: ["cow", "pig", "sheep", "villager", "horse"], traits: "가장 흔한 바이옴. 마을 생성 가능.", description: "초반 거점으로 적합한 넓은 초원." },
  { id: "sunflower_plains", name: "해바라기 평원", dimension: "overworld", group: "중간", emoji: "🌻", temperature: 0.8, blocks: ["grass_block", "sunflower", "oak_log"], mobs: ["cow", "sheep", "horse"], traits: "해바라기가 많이 핀 평원 변종.", description: "평원의 희귀 변종." },
  { id: "forest", name: "숲", dimension: "overworld", group: "중간", emoji: "🌳", temperature: 0.7, blocks: ["oak_log", "birch_log", "grass_block"], mobs: ["cow", "wolf", "sheep"], traits: "참나무·자작나무 혼합. 어두운 숲은 적 스폰 주의.", description: "원목·식량 확보에 유리." },
  { id: "flower_forest", name: "꽃 숲", dimension: "overworld", group: "중간", emoji: "🌸", temperature: 0.7, blocks: ["oak_log", "grass_block", "poppy"], mobs: ["rabbit", "bee"], traits: "거의 모든 종류의 꽃 생성.", description: "염료·장식용 꽃 채집." },
  { id: "birch_forest", name: "자작나무 숲", dimension: "overworld", group: "중간", emoji: "🌳", temperature: 0.6, blocks: ["birch_log", "grass_block"], mobs: ["bee", "wolf"], traits: "자작나무가 주를 이룸.", description: "밝은 목재 확보." },
  { id: "dark_forest", name: "어두운 숲", dimension: "overworld", group: "중간", emoji: "🌑", temperature: 0.7, blocks: ["dark_oak_log", "mushroom"], mobs: ["sheep", "villager"], traits: "짙은 나뭇잎으로 어두움. 적 스폰 많음.", description: "짙은 참나무·버섯." },
  { id: "swamp", name: "늪", dimension: "overworld", group: "중간", emoji: "🐸", temperature: 0.8, blocks: ["water", "lily_pad", "oak_log"], mobs: ["frog", "slime", "witch", "villager"], traits: "얕은 물·당근·갈색 버섯. 마녀 오두막.", description: "슬라임·개구리·마녀 서식." },
  { id: "jungle", name: "정글", dimension: "overworld", group: "중간", emoji: "🌴", temperature: 0.95, blocks: ["jungle_log", "vine", "cocoa"], mobs: ["parrot", "ocelot", "panda"], traits: "높은 나무·덩굴. 정글 사원.", description: "코코아·오celot·앵무새." },
  { id: "sparse_jungle", name: "성긴 정글", dimension: "overworld", group: "중간", emoji: "🌿", temperature: 0.95, blocks: ["jungle_log", "grass_block"], mobs: ["parrot", "ocelot"], traits: "정글보다 나무가 적음.", description: "정글과 사바나 사이." },
  { id: "bamboo_jungle", name: "대나무 정글", dimension: "overworld", group: "중간", emoji: "🎋", temperature: 0.95, blocks: ["bamboo", "jungle_log"], mobs: ["panda", "parrot"], traits: "대나무 밀림. 판다 서식.", description: "대나무·판다 획득." },
  { id: "cherry_grove", name: "벚꽃 숲", dimension: "overworld", group: "중간", emoji: "🌸", temperature: 0.5, blocks: ["cherry_log", "cherry_leaves", "grass_block"], mobs: ["rabbit", "bee", "pig"], traits: "분홍 벚꽃 나무. 1.20 추가.", description: "장관 있는 산악 벚꽃 지대." },
  { id: "mushroom_fields", name: "버섯 들판", dimension: "overworld", group: "중간", emoji: "🍄", temperature: 0.9, blocks: ["mycelium", "red_mushroom", "brown_mushroom"], mobs: ["mooshroom"], traits: "적대적 몹 스폰 없음(우민 제외). 무시룸만.", description: "희귀하고 안전한 섬." },
  // 건조/따뜻한
  { id: "desert", name: "사막", dimension: "overworld", group: "건조", emoji: "🏜️", temperature: 2.0, blocks: ["sand", "cactus", "dead_bush"], mobs: ["rabbit", "villager", "husk"], traits: "나무 부족. 사막 사원·우물·낙타.", description: "초반 나무 확보가 어려울 수 있음." },
  { id: "savanna", name: "사바나", dimension: "overworld", group: "건조", emoji: "🦁", temperature: 2.0, blocks: ["acacia_log", "grass_block", "tall_grass"], mobs: ["horse", "llama", "villager", "husk"], traits: "아카시아나무·평탄. 마을 생성.", description: "목재·마을·말 확보." },
  { id: "badlands", name: "악지", dimension: "overworld", group: "건조", emoji: "🏜️", temperature: 2.0, blocks: ["terracotta", "red_sand", "gold_ore"], mobs: ["rabbit"], traits: "채색 테라코타·금 광석. 폐광 생성.", description: "건축용 테라코타·금 채굴." },
  { id: "wooded_badlands", name: "나무가 우거진 악지", dimension: "overworld", group: "건조", emoji: "🌵", temperature: 2.0, blocks: ["terracotta", "oak_log", "coarse_dirt"], mobs: ["rabbit"], traits: "악지에 나무가 있는 희귀 변종.", description: "악지 중 유일하게 목재 확보 가능." },
  // 물
  { id: "river", name: "강", dimension: "overworld", group: "물", emoji: "🏞️", temperature: 0.5, blocks: ["water", "sand", "clay"], mobs: ["salmon", "squid", "drowned"], traits: "육지를 가로지르는 수로.", description: "낚시·점토·이동 경로." },
  { id: "beach", name: "해변", dimension: "overworld", group: "물", emoji: "🏖️", temperature: 0.8, blocks: ["sand", "water", "sugar_cane"], mobs: ["turtle"], traits: "바다와 육지 경계. 난파선.", description: "모래·유리·거북 알." },
  { id: "ocean", name: "바다", dimension: "overworld", group: "물", emoji: "🌊", temperature: 0.5, blocks: ["water", "kelp", "seagrass"], mobs: ["squid", "dolphin", "cod"], traits: "넓은 수역. 해저 유적·몬ument.", description: "해저 탐험·가디언 전투." },
  { id: "deep_ocean", name: "깊은 바다", dimension: "overworld", group: "물", emoji: "🌊", temperature: 0.5, blocks: ["water", "prismarine"], mobs: ["guardian", "elder_guardian", "squid"], traits: "해저 유적·가디언. 매우 깊음.", description: "스폰지·프리즈머린 획득." },
  { id: "warm_ocean", name: "따뜻한 바다", dimension: "overworld", group: "물", emoji: "🐠", temperature: 0.5, blocks: ["water", "coral_block", "seagrass"], mobs: ["tropical_fish", "dolphin", "squid"], traits: "산호초·열대어.", description: "산호 채집·수족관." },
  { id: "frozen_ocean", name: "얼어붙은 바다", dimension: "overworld", group: "물", emoji: "🧊", temperature: 0.0, blocks: ["ice", "water", "snow"], mobs: ["squid", "stray", "polar_bear"], traits: "얼음 표면. 눈 덮인 변종.", description: "북극 해양 탐험." },
  // 동굴
  { id: "lush_caves", name: "무성한 동굴", dimension: "overworld", group: "동굴", emoji: "💧", temperature: 0.5, blocks: ["moss_block", "azalea", "clay"], mobs: ["axolotl", "glow_squid", "bat"], traits: "이끼·덩굴·아잘리아. 아홀로틀.", description: "1.17 동굴의 푸른 지하." },
  { id: "dripstone_caves", name: "점적석 동굴", dimension: "overworld", group: "동굴", emoji: "🪨", temperature: 0.8, blocks: ["dripstone_block", "pointed_dripstone", "water"], mobs: ["bat", "zombie"], traits: "종유석·석순. 물이 떨어짐.", description: "동굴 탐험·석회암 채굴." },
  { id: "deep_dark", name: "심층암", dimension: "overworld", group: "동굴", emoji: "🌑", temperature: 0.8, blocks: ["sculk", "deepslate"], mobs: ["warden"], traits: "스컬크 블록. 워든 서식. 고대 도시.", description: "가장 위험한 지하 바이옴." },
  // 네더
  { id: "nether_wastes", name: "네더 황무지", dimension: "nether", group: "네더", emoji: "🔥", temperature: 2.0, blocks: ["netherrack", "lava", "nether_quartz_ore"], mobs: ["zombified_piglin", "ghast", "magma_cube"], traits: "가장 흔한 네더 바이옴. 석영 광석.", description: "네더 입문 지역." },
  { id: "crimson_forest", name: "진홍빛 숲", dimension: "nether", group: "네더", emoji: "🍄", temperature: 2.0, blocks: ["crimson_stem", "crimson_nylium", "shroomlight"], mobs: ["hoglin", "piglin", "zombified_piglin"], traits: "호글린·피글린. 진홍빛 자루.", description: "목재·거래·고기 확보." },
  { id: "warped_forest", name: "뒤틀린 숲", dimension: "nether", group: "네더", emoji: "🌀", temperature: 2.0, blocks: ["warped_stem", "warped_nylium", "shroomlight"], mobs: ["enderman", "strider"], traits: "엔더맨 다수. 비교적 안전.", description: "엔더 진주·뒤틀린 목재." },
  { id: "soul_sand_valley", name: "영혼 모래 골짜기", dimension: "nether", group: "네더", emoji: "💀", temperature: 2.0, blocks: ["soul_sand", "soul_soil", "basalt"], mobs: ["skeleton", "ghast", "enderman"], traits: "영혼 모래·영혼 토양.", description: "영혼 모닥불·영혼 횃불 재료." },
  { id: "basalt_deltas", name: "현무암 삼각주", dimension: "nether", group: "네더", emoji: "🌋", temperature: 2.0, blocks: ["basalt", "blackstone", "magma_block"], mobs: ["magma_cube", "ghast"], traits: "험한 지형. 흑요석·현무암.", description: "블랙스톤 채굴에 적합." },
  // 엔드
  { id: "the_end", name: "엔드", dimension: "end", group: "엔드", emoji: "🌌", temperature: 0.5, blocks: ["end_stone", "chorus_plant", "obsidian"], mobs: ["enderman", "ender_dragon", "endermite"], traits: "메인 섬·드래곤 보스.", description: "게임 최종 지역." },
  { id: "end_highlands", name: "엔드 고지", dimension: "end", group: "엔드", emoji: "🏔️", temperature: 0.5, blocks: ["end_stone", "chorus_flower"], mobs: ["enderman", "shulker"], traits: "후렴과·엔드 도시.", description: "셜커·엘리트라 획득." },
  { id: "end_midlands", name: "엔드 중간 지대", dimension: "end", group: "엔드", emoji: "🪨", temperature: 0.5, blocks: ["end_stone"], mobs: ["enderman"], traits: "메인 섬과 외곽 사이.", description: "엔더맨 농장에 사용." },
  { id: "end_barrens", name: "엔드 불모지", dimension: "end", group: "엔드", emoji: "🌑", temperature: 0.5, blocks: ["end_stone"], mobs: ["enderman"], traits: "후렴과 없는 황량한 지대.", description: "외곽 섬의 빈 공간." },
  { id: "small_end_islands", name: "작은 엔드 섬", dimension: "end", group: "엔드", emoji: "🏝️", temperature: 0.5, blocks: ["end_stone", "chorus_plant"], mobs: ["enderman"], traits: "메인 섬 주변 작은 섬.", description: "엔드 게이트웨이 탐험." },
];

writeFileSync(resolve(root, "data/mobs.json"), JSON.stringify(mobs, null, 2) + "\n");
writeFileSync(resolve(root, "data/biomes.json"), JSON.stringify(biomes, null, 2) + "\n");
console.log(`Wrote ${mobs.length} mobs, ${biomes.length} biomes`);
