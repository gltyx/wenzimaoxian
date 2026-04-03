// 游戏配置和状态数据结构

// 游戏状态对象
const GameState = {
    // 玩家数据
    player: {
        name: '无名战士',
        level: 1,
        exp: 0,
        gold: 0,
        diamonds: 0,
        class: null, // warrior, mage, assassin
        hp: 100,
        maxHp: 100,
        atk: 10,
        def: 5,
        atkSpd: 1.0,
        crit: 5,
        critDmg: 150,
        antiCrit: 0,
        antiCritDmg: 0,
        vamp: 0,
        penetrate: 0,
        playerId: '', // 玩家ID：5数字+5字母
        vipLevel: 0,
        privileges: {
            ticketPriv:    false, // 门票特权
            rareEquipPriv: false, // 稀有装备特权
        },
        totalAdsWatched: 0, // 累计观看广告总次数（用于VIP自动升级）
        vipDailyDiamondClaimed: '', // 上次领取VIP每日钻石的日期key
        tickets: {
            elite: 0,
            hell: 0
        },
        adFreeCount: 0, // 免广告次数（0点重置部分）
        expPotionEndTime: 0, // 经验药水结束时间
        dropPotionEndTime: 0 // 爆率药水结束时间
    },

    // 装备系统
    equipment: {
        weapon: null,
        helmet: null,
        armor: null,
        boots: null,
        ring: null,
        necklace: null
    },

    // 技能系统
    skills: [null, null, null, null], // 4个技能槽位
    skillCooldowns: [0, 0, 0, 0], // 技能冷却时间（最后使用时间戳）

    // 背包
    inventory: [],

    // 宝石仓库
    gemPool: [],

    // 当前战斗信息
    battle: {
        isAuto: false,
        isPaused: false,
        currentEnemy: null,
        inDungeon: false,
        dungeonType: null, // 'elite', 'hell'
        dungeonLevel: 0,
        minionsKilled: 0 // 记录击杀的小怪数量
    },

    // 当前区域
    currentArea: 0,

    // 分解设置
    dismantleSettings: {
        equipment: [false, false, false, false, false, false, false, false, false, false, false, false, false],
        skill: [false, false, false, false, false],
        gem: [false, false, false, false, false]
    },

    // 自动分解开关
    autoDismantle: {
        equipment: false,
        skill: false,
        gem: false
    },

    // 游戏统计
    stats: {
        battlesWon: 0,
        monstersKilled: 0,
        itemsDropped: 0,
        shards: 0,           // 碎片总数
        qualityShards: {},   // 按品质分类的碎片 {qualityIndex: count}
        totalGoldEarned: 0,  // 累计获得金币
        totalPlayTime: 0,    // 总游戏时长（秒）
        enhanceCount: 0,     // 强化次数
        dismantleCount: 0,   // 分解次数
        // 称号进度统计
        areaKills: {},       // 各区域击杀数 {areaIndex: count}
        totalAreaKills: 0,   // 单个区域最高击杀数
        bestAreaIndex: 0,    // 最高击杀数的区域索引
        eventBossKills: 0,   // 击杀奇遇BOSS次数
        eliteTicketsUsed: 0, // 累计消耗精英门票
        hellTicketsUsed: 0,  // 累计消耗地狱门票
        enhanceConsecutiveFails: 0, // 强化连续失败次数
        enhanceConsecutiveSuccess: 0, // 单件装备连续强化成功次数
        weaponEnhanceLevel: 0 // 武器强化等级
    },

    // 已激活的称号列表
    titles: [],

    // 初始职业选择标记
    isInitialClassSelection: true,

    // 简化模式
    isSimplifiedMode: false
};

// 装备槽位基础属性配置
const EQUIPMENT_SLOTS = {
    weapon: { name: '武器', icon: '⚔️', base: { atk: 8 }, growth: { atk: 2 } },
    helmet: { name: '头盔', icon: '🛡️', base: { def: 7 }, growth: { def: 2 } },
    armor: { name: '铠甲', icon: '🦺', base: { def: 7 }, growth: { def: 2 } },
    boots: { name: '靴子', icon: '👢', base: { def: 4, hp: 17 }, growth: { def: 1, hp: 8 } },
    ring: { name: '戒指', icon: '💍', base: { def: 1, atk: 2, hp: 10 }, growth: { def: 1, atk: 1, hp: 4 } },
    necklace: { name: '项链', icon: '📿', base: { atk: 3, hp: 13 }, growth: { atk: 1, hp: 9 } }
};

// 装备品质配置 - 暗黑风格
// base 倍率采用指数曲线：残破×1.0 → 终焉×10.0，最高品质基础属性是最低品质的10倍
const EQUIPMENT_QUALITIES = [
    { id: 0,  name: '残破', color: '#9e9e9e', base: 1.00,  maxLevel: 10,  icon: '⬜' },
    { id: 1,  name: '锈蚀', color: '#4caf50', base: 1.20,  maxLevel: 20,  icon: '🟩' },
    { id: 2,  name: '凡铁', color: '#2196f3', base: 1.45,  maxLevel: 30,  icon: '🟦' },
    { id: 3,  name: '精良', color: '#9c27b0', base: 1.75,  maxLevel: 40,  icon: '🟪' },
    { id: 4,  name: '卓越', color: '#ff9800', base: 2.10,  maxLevel: 50,  icon: '🟧' },
    { id: 5,  name: '传说', color: '#f44336', base: 2.55,  maxLevel: 60,  icon: '🟥' },
    { id: 6,  name: '辉煌', color: '#ffd700', base: 3.05,  maxLevel: 70,  icon: '🟨' },
    { id: 7,  name: '神圣', color: '#e5e4e2', base: 3.65,  maxLevel: 80,  icon: '⬜' },
    { id: 8,  name: '永恒', color: '#00bcd4', base: 4.35,  maxLevel: 90,  icon: '🟩' },
    { id: 9,  name: '深渊', color: '#795548', base: 5.20,  maxLevel: 100, icon: '🟫' },
    { id: 10, name: '混沌', color: '#e91e63', base: 6.20,  maxLevel: 110, icon: '🟥' },
    { id: 11, name: '虚空', color: '#ff5722', base: 7.30,  maxLevel: 120, icon: '🟧' },
    { id: 12, name: '湮灭', color: '#607d8b', base: 8.70,  maxLevel: 130, icon: '🟦' },
    { id: 13, name: '终焉', color: '#3f51b5', base: 10.00, maxLevel: 150, icon: '🟪' }
];

// 装备前缀形容词
const EQUIPMENT_PREFIXES = [
    '破损的', '陈旧的', '普通的', '精良的', '卓越的', '完美的', '传奇的', '史诗的', '不朽的', '神话的'
];

// ========== 称号系统 ==========
// 称号配置：达成条件、图标、奖励属性
const TITLE_CONFIG = [
    // ===== 挂机类 =====
    { id: 'ten_li_po_sword_god', name: '十里坡剑神', icon: '🗡️', category: 'area',
      check: () => GameState.stats.totalAreaKills >= 30000,
      stats: { atk: 500 } },
    { id: 'area_lord', name: '区域之主', icon: '👑', category: 'area',
      check: () => GameState.stats.totalAreaKills >= 100000,
      stats: { atk: 300, def: 300 } },

    // ===== 运气类 =====
    { id: 'lucky_person', name: '幸运之人', icon: '🍀', category: 'luck',
      check: () => GameState.stats.eventBossKills >= 100,
      stats: { dropBonus: 0.1 } },
    { id: 'unlucky_guy', name: '非酋', icon: '😭', category: 'luck',
      check: () => GameState.stats.enhanceConsecutiveFails >= 5,
      stats: { enhanceBonus: 0.02 } },
    { id: 'chosen_one', name: '天选之人', icon: '✨', category: 'luck',
      check: () => {
          // 检查玩家身上是否有强化+8的装备
          for (const slot in GameState.equipment) {
              const item = GameState.equipment[slot];
              if (item && item.enhanceLevel >= 8) {
                  return true;
              }
          }
          return false;
      },
      stats: { enhanceBonus: 0.02 } },

    // ===== 精英副本类 =====
    { id: 'elite_challenger', name: '精英挑战者', icon: '🎫', category: 'elite',
      check: () => GameState.stats.eliteTicketsUsed >= 10000,
      stats: { dropBonus: 0.1 } },
    { id: 'elite_slaughterer', name: '精英屠杀者', icon: '🎫', category: 'elite',
      check: () => GameState.stats.eliteTicketsUsed >= 50000,
      stats: { dropBonus: 0.1 } },
    { id: 'elite_terminator', name: '精英终结者', icon: '🎫', category: 'elite',
      check: () => GameState.stats.eliteTicketsUsed >= 200000,
      stats: { dropBonus: 0.2 } },

    // ===== 地狱副本类 =====
    { id: 'hell_challenger', name: '地狱挑战者', icon: '🔥', category: 'hell',
      check: () => GameState.stats.hellTicketsUsed >= 5000,
      stats: { dropBonus: 0.1 } },
    { id: 'hell_slaughterer', name: '地狱屠杀者', icon: '🔥', category: 'hell',
      check: () => GameState.stats.hellTicketsUsed >= 20000,
      stats: { dropBonus: 0.1 } },
    { id: 'hell_terminator', name: '地狱终结者', icon: '🔥', category: 'hell',
      check: () => GameState.stats.hellTicketsUsed >= 50000,
      stats: { dropBonus: 0.2 } },

    // ===== 强化类 =====
    { id: 'forge_god', name: '锻造之神', icon: '🔨', category: 'enhance',
      check: () => GameState.stats.weaponEnhanceLevel >= 11,
      stats: { crit: 50 } }
];

// 计算所有已激活称号的总属性加成
function getTitleBonus() {
    const bonus = {
        atk: 0,
        def: 0,
        hp: 0,
        crit: 0,
        critDmg: 0,
        dropBonus: 0,
        enhanceBonus: 0
    };

    for (const title of TITLE_CONFIG) {
        if (GameState.titles.includes(title.id)) {
            for (const [key, value] of Object.entries(title.stats)) {
                if (bonus[key] !== undefined) {
                    bonus[key] += value;
                }
            }
        }
    }
    return bonus;
}

// 检查并激活新称号
function checkTitles() {
    let newTitles = [];
    for (const title of TITLE_CONFIG) {
        if (!GameState.titles.includes(title.id) && title.check()) {
            GameState.titles.push(title.id);
            newTitles.push(title);
        }
    }
    if (newTitles.length > 0) {
        const titleNames = newTitles.map(t => `${t.icon}${t.name}`).join(' ');
        addBattleLog(`🏆 获得称号: ${titleNames}`, 'success');
    }
}

// 重置强化连续成功/失败计数（切换装备时调用）
function resetEnhanceConsecutiveCount() {
    GameState.stats.enhanceConsecutiveFails = 0;
    GameState.stats.enhanceConsecutiveSuccess = 0;
}

// 装备名称 - 按品质分三类
const EQUIPMENT_NAMES = {
    weapon: {
        0: ['锈铁剑', '破战斧', '枯木杖', '生锈匕', '弯弓', '生锈镰', '石锤', '残破双刃'],
        1: ['铁剑', '钢斧', '木杖', '铁匕', '木弓', '铁镰', '铁锤', '双刀'],
        2: ['精铁剑', '精钢斧', '白橡杖', '精钢匕', '精铁弓', '精钢镰', '精铁锤', '精铁双刀'],
        3: ['寒霜剑', '烈焰斧', '闪电杖', '暗影匕', '猎鹰弓', '死神镰', '雷鸣锤', '幻影双刀'],
        4: ['卓越剑', '屠龙斧', '星辰杖', '毒匕', '追风弓', '血腥镰', '巨灵锤', '风暴双刀'],
        5: ['传说剑', '破晓斧', '元素杖', '刺杀匕', '射手弓', '毁灭镰', '战神锤', '双子刀'],
        6: ['辉煌剑', '泰坦斧', '光耀杖', '虚空匕', '神射手弓', '不朽镰', '雷霆锤', '圣洁双刀'],
        7: ['神圣剑', '天使斧', '神谕杖', '天国匕', '凤凰弓', '神圣镰', '天使锤', '神圣双刀'],
        8: ['永恒剑', '永恒斧', '永恒杖', '永恒匕', '永恒弓', '永恒镰', '永恒锤', '永恒双刀'],
        9: ['深渊剑', '深渊斧', '深渊杖', '深渊匕', '深渊弓', '深渊镰', '深渊锤', '深渊双刀'],
        10: ['混沌剑', '混沌斧', '混沌杖', '混沌匕', '混沌弓', '混沌镰', '混沌锤', '混沌双刀'],
        11: ['虚空剑', '虚空斧', '虚空杖', '虚空匕', '虚空弓', '虚空镰', '虚空锤', '虚空双刀'],
        12: ['湮灭剑', '湮灭斧', '湮灭杖', '湮灭匕', '湮灭弓', '湮灭镰', '湮灭锤', '湮灭双刀'],
        13: ['终焉之剑', '终焉之斧', '终焉之杖', '终焉之匕', '终焉之弓', '终焉之镰', '终焉之锤', '终焉双刀']
    },
    helmet: {
        0: ['锈铁盔', '破旧盔', '枯木冠', '破头巾', '破损面具', '锈钢盔', '破兜帽'],
        1: ['铁盔', '钢盔', '木冠', '布巾', '布面具', '钢盔', '布帽'],
        2: ['精铁盔', '精钢盔', '白橡冠', '精铁巾', '铁面具', '精钢盔', '精铁帽'],
        3: ['寒霜盔', '烈焰盔', '闪电冠', '暗影巾', '猎鹰面具', '死神盔', '幻影帽'],
        4: ['卓越盔', '屠龙盔', '星辰冠', '毒面巾', '追风面具', '血腥盔', '巨灵帽'],
        5: ['传说盔', '破晓盔', '元素冠', '刺杀巾', '射手面具', '毁灭盔', '战神帽'],
        6: ['辉煌盔', '泰坦盔', '光耀冠', '虚空巾', '神射面具', '不朽盔', '雷霆帽'],
        7: ['神圣盔', '天使盔', '神谕冠', '天国巾', '凤凰面具', '神圣盔', '天使帽'],
        8: ['永恒盔', '永恒盔', '永恒冠', '永恒巾', '永恒面具', '永恒盔', '永恒帽'],
        9: ['深渊盔', '深渊盔', '深渊冠', '深渊巾', '深渊面具', '深渊盔', '深渊帽'],
        10: ['混沌盔', '混沌盔', '混沌冠', '混沌巾', '混沌面具', '混沌盔', '混沌帽'],
        11: ['虚空盔', '虚空盔', '虚空冠', '虚空巾', '虚空面具', '虚空盔', '虚空帽'],
        12: ['湮灭盔', '湮灭盔', '湮灭冠', '湮灭巾', '湮灭面具', '湮灭盔', '湮灭帽'],
        13: ['终焉之盔', '终焉之盔', '终焉之冠', '终焉之巾', '终焉面具', '终焉之盔', '终焉帽']
    },
    armor: {
        0: ['锈铁甲', '破旧甲', '破布袍', '残皮甲', '铁甲'],
        1: ['铁甲', '钢甲', '布袍', '皮甲', '重甲'],
        2: ['精铁甲', '精钢甲', '白橡袍', '精铁皮甲', '精铁重甲'],
        3: ['寒霜甲', '烈焰甲', '闪电袍', '暗影甲', '猎鹰甲'],
        4: ['卓越甲', '屠龙甲', '星辰袍', '毒甲', '追风甲'],
        5: ['传说甲', '破晓甲', '元素袍', '刺杀甲', '射手甲'],
        6: ['辉煌甲', '泰坦甲', '光耀袍', '虚空甲', '神射甲'],
        7: ['神圣甲', '天使甲', '神谕袍', '天国甲', '凤凰甲'],
        8: ['永恒甲', '永恒甲', '永恒袍', '永恒甲', '永恒甲'],
        9: ['深渊甲', '深渊甲', '深渊袍', '深渊甲', '深渊甲'],
        10: ['混沌甲', '混沌甲', '混沌袍', '混沌甲', '混沌甲'],
        11: ['虚空甲', '虚空甲', '虚空袍', '虚空甲', '虚空甲'],
        12: ['湮灭甲', '湮灭甲', '湮灭袍', '湮灭甲', '湮灭甲'],
        13: ['终焉甲', '终焉甲', '终焉袍', '终焉甲', '终焉甲']
    },
    boots: {
        0: ['锈铁靴', '破旧靴', '破布鞋', '残皮靴', '铁靴'],
        1: ['铁靴', '钢靴', '布鞋', '皮靴', '重靴'],
        2: ['精铁靴', '精钢靴', '白橡鞋', '精铁皮靴', '精铁重靴'],
        3: ['寒霜靴', '烈焰靴', '闪电鞋', '暗影靴', '猎鹰靴'],
        4: ['卓越靴', '屠龙靴', '星辰鞋', '毒靴', '追风靴'],
        5: ['传说靴', '破晓靴', '元素鞋', '刺杀靴', '射手靴'],
        6: ['辉煌靴', '泰坦靴', '光耀鞋', '虚空靴', '神射靴'],
        7: ['神圣靴', '天使靴', '神谕鞋', '天国靴', '凤凰靴'],
        8: ['永恒靴', '永恒靴', '永恒鞋', '永恒靴', '永恒靴'],
        9: ['深渊靴', '深渊靴', '深渊鞋', '深渊靴', '深渊靴'],
        10: ['混沌靴', '混沌靴', '混沌鞋', '混沌靴', '混沌靴'],
        11: ['虚空靴', '虚空靴', '虚空鞋', '虚空靴', '虚空靴'],
        12: ['湮灭靴', '湮灭靴', '湮灭鞋', '湮灭靴', '湮灭靴'],
        13: ['终焉靴', '终焉靴', '终焉鞋', '终焉靴', '终焉靴']
    },
    ring: {
        0: ['锈铁戒', '破铜戒', '残石指环', '木环'],
        1: ['铜戒', '银戒', '石指环', '木环'],
        2: ['精铁戒', '精银戒', '精玉指环', '白橡环'],
        3: ['寒霜戒', '烈焰戒', '闪电指环', '暗影环'],
        4: ['卓越戒', '屠龙戒', '星辰指环', '毒环'],
        5: ['传说戒', '破晓戒', '元素指环', '刺杀环'],
        6: ['辉煌戒', '泰坦戒', '光耀指环', '虚空环'],
        7: ['神圣戒', '天使戒', '神谕指环', '天国环'],
        8: ['永恒戒', '永恒戒', '永恒指环', '永恒环'],
        9: ['深渊戒', '深渊戒', '深渊指环', '深渊环'],
        10: ['混沌戒', '混沌戒', '混沌指环', '混沌环'],
        11: ['虚空戒', '虚空戒', '虚空指环', '虚空环'],
        12: ['湮灭戒', '湮灭戒', '湮灭指环', '湮灭环'],
        13: ['终焉戒', '终焉戒', '终焉指环', '终焉环']
    },
    necklace: {
        0: ['锈铁坠', '破铜坠', '残石符', '木项链'],
        1: ['铜坠', '银坠', '石符', '木项链'],
        2: ['精铁坠', '精银坠', '精玉符', '白橡项链'],
        3: ['寒霜坠', '烈焰坠', '闪电符', '暗影项链'],
        4: ['卓越坠', '屠龙坠', '星辰符', '毒项链'],
        5: ['传说坠', '破晓坠', '元素符', '刺杀项链'],
        6: ['辉煌坠', '泰坦坠', '光耀符', '虚空项链'],
        7: ['神圣坠', '天使坠', '神谕符', '天国项链'],
        8: ['永恒坠', '永恒坠', '永恒符', '永恒项链'],
        9: ['深渊坠', '深渊坠', '深渊符', '深渊项链'],
        10: ['混沌坠', '混沌坠', '混沌符', '混沌项链'],
        11: ['虚空坠', '虚空坠', '虚空符', '虚空项链'],
        12: ['湮灭坠', '湮灭坠', '湮灭符', '湮灭项链'],
        13: ['终焉坠', '终焉坠', '终焉符', '终焉项链']
    }
};

// 强化成功率配置
const ENHANCE_SUCCESS_RATE = [100, 95, 85, 75, 65, 55, 45, 35, 25, 15, 15, 15, 15, 15, 15, 15];

// 分解碎片数量配置（装备/宝石/技能分解获得碎片数量）
// 装备品质：0-残破 1-锈蚀 2-凡铁 3-精良 4-卓越 5-传说 6-辉煌 7-神圣 8-永恒 9-深渊 10-混沌 11-虚空 12-湮灭 13-终焉
const DISMANTLE_SHARD_CONFIG = {
    // 装备分解碎片（所有品质都是1个碎片）
    equipment: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // 宝石分解碎片（所有品质都是1个碎片）
    gem: [1, 1, 1, 1, 1],
    // 技能分解碎片（所有品质都是1个碎片）
    skill: [1, 1, 1, 1, 1]
};

// 强化所需碎片数量计算公式：Math.floor((强化等级 - 1) / 3) + 1
// 1-3级需要1个碎片，4-6级需要2个碎片，7级需要3个碎片，8级需要4个...以此类推
function getRequiredShardsForEnhance(currentEnhanceLevel) {
    return Math.floor((currentEnhanceLevel) / 3) + 1;
}

// 装备词缀配置
const AFFIXES = {
    atkSpd: { name: '攻速', icon: '?', type: 'percentage' },
    crit: { name: '暴击', icon: '??', type: 'percentage' },
    critDmg: { name: '爆伤', icon: '??', type: 'number' },
    antiCrit: { name: '抗暴', icon: '???', type: 'percentage' },
    antiCritDmg: { name: '抗爆伤', icon: '??', type: 'number' },
    vamp: { name: '吸血', icon: '??', type: 'percentage' },
    penetrate: { name: '穿透', icon: '???', type: 'percentage' },
    expBonus: { name: '经验', icon: '??', type: 'percentage' },
    goldBonus: { name: '金币', icon: '??', type: 'percentage' },
    maxAtk: { name: '最大攻击力', icon: '??', type: 'percentage' }
};

// 品质词缀配置表（紫色以下不附带词缀，攻速和经验已减半）
const QUALITY_AFFIX_CONFIG = {
    3: { count: 3, atkSpd: [2, 7], crit: [5, 10], critDmg: [10, 40], antiCrit: [5, 10], antiCritDmg: [5, 20], vamp: [0.1, 0.5], penetrate: [10, 15], expBonus: [0.5, 2.5], goldBonus: [1, 5] },
    4: { count: 4, atkSpd: [5, 9], crit: [10, 15], critDmg: [20, 60], antiCrit: [10, 15], antiCritDmg: [10, 25], vamp: [0.2, 0.6], penetrate: [15, 20], expBonus: [1.5, 4], goldBonus: [3, 8] },
    5: { count: 5, atkSpd: [5, 11], crit: [10, 18], critDmg: [40, 80], antiCrit: [10, 18], antiCritDmg: [15, 30], vamp: [0.5, 0.8], penetrate: [15, 25], expBonus: [2.5, 5], goldBonus: [5, 10] },
    6: { count: 6, atkSpd: [7, 14], crit: [15, 20], critDmg: [60, 100], antiCrit: [15, 20], antiCritDmg: [20, 30], vamp: [0.5, 1.0], penetrate: [20, 25], expBonus: [5, 7.5], goldBonus: [10, 15] },
    7: { count: 6, atkSpd: [10, 15], crit: [20, 23], critDmg: [80, 130], antiCrit: [20, 23], antiCritDmg: [25, 30], vamp: [0.8, 1.2], penetrate: [25, 30], expBonus: [5, 10], goldBonus: [10, 20] },
    8: { count: 7, atkSpd: [12, 17], crit: [23, 25], critDmg: [100, 160], antiCrit: [23, 25], antiCritDmg: [30, 35], vamp: [1.0, 1.5], penetrate: [30, 35], expBonus: [7.5, 12.5], goldBonus: [15, 25] },
    9: { count: 6, atkSpd: [15, 20], crit: [25, 28], critDmg: [130, 200], antiCrit: [25, 28], antiCritDmg: [35, 45], vamp: [1.3, 1.8], penetrate: [35, 45], expBonus: [10, 15], goldBonus: [20, 30] },
    10: { count: 7, atkSpd: [20, 27], crit: [25, 35], critDmg: [160, 250], antiCrit: [25, 35], antiCritDmg: [40, 50], vamp: [1.5, 2.0], penetrate: [40, 50], expBonus: [15, 17.5], goldBonus: [30, 35] },
    11: { count: 8, atkSpd: [25, 35], crit: [30, 40], critDmg: [200, 300], antiCrit: [30, 40], antiCritDmg: [50, 60], vamp: [2.0, 3.0], penetrate: [50, 60], expBonus: [17.5, 20], goldBonus: [35, 40] },
    12: { count: 9, atkSpd: [35, 45], crit: [35, 45], critDmg: [300, 350], antiCrit: [35, 45], antiCritDmg: [55, 65], vamp: [2.5, 3.5], penetrate: [55, 65], expBonus: [20, 22.5], goldBonus: [40, 45] },
    13: { count: 10, atkSpd: [45, 50], crit: [45, 50], critDmg: [350, 400], antiCrit: [40, 50], antiCritDmg: [60, 70], vamp: [3.0, 4.0], penetrate: [60, 70], expBonus: [20, 25], goldBonus: [40, 50], maxAtk: [5, 15] }
};

// 技能品质配置
const SKILL_QUALITIES = [
    { id: 0, name: '灰', color: 'rgb(160,160,160)', multiplier: 1.00 },
    { id: 1, name: '绿', color: 'rgb(76,175,80)', multiplier: 1.15 },
    { id: 2, name: '蓝', color: 'rgb(33,150,243)', multiplier: 1.30 },
    { id: 3, name: '紫', color: 'rgb(156,39,176)', multiplier: 1.45 },
    { id: 4, name: '橙', color: 'rgb(255,152,0)', multiplier: 1.60 }
];

// 技能池配置（damage 为百分比倍率，如 150 代表 150% 攻击伤害）
const SKILL_POOL = {
    warrior: [
        { name: '刺杀剑术', cooldown: 5, damage: 150, icon: '⚔️', desc: '快速突刺，造成150%攻击伤害' },
        { name: '开天剑法', cooldown: 6, damage: 170, icon: '🗡️', desc: '强力斩击，造成170%攻击伤害' },
        { name: '逐日剑法', cooldown: 7, damage: 190, icon: '🌟', desc: '剑气纵横，造成190%攻击伤害' },
        { name: '裂天斩',   cooldown: 8, damage: 220, icon: '💥', desc: '终极剑技，造成220%攻击伤害' }
    ],
    mage: [
        { name: '小火球', cooldown: 5, damage: 200, icon: '🔥', desc: '投射火球，造成200%攻击伤害' },
        { name: '大火球', cooldown: 6, damage: 220, icon: '🌋', desc: '烈焰爆裂，造成220%攻击伤害' },
        { name: '雷电术', cooldown: 7, damage: 240, icon: '⚡', desc: '召唤雷电，造成240%攻击伤害' },
        { name: '灭天火', cooldown: 8, damage: 260, icon: '☄️', desc: '毁灭之焰，造成260%攻击伤害' }
    ],
    assassin: [
        { name: '背刺',   cooldown: 5, damage: 100, icon: '🗡️', desc: '从背后突袭，造成100%攻击伤害' },
        { name: '裂颅',   cooldown: 6, damage: 110, icon: '💀', desc: '精准打击要害，造成110%攻击伤害' },
        { name: 'X斩',    cooldown: 7, damage: 120, icon: '✖️', desc: '交叉斩击，造成120%攻击伤害' },
        { name: '致命一击', cooldown: 8, damage: 130, icon: '⚡', desc: '绝杀之刃，造成130%攻击伤害' }
    ],
    common: [
        { name: '当头一棒', cooldown: 5, damage: 100, icon: '🔨', desc: '猛力一击，造成100%攻击伤害' },
        { name: '致命一击', cooldown: 6, damage: 110, icon: '💢', desc: '精准打击要害，造成110%攻击伤害' },
        { name: '隐杀',   cooldown: 7, damage: 120, icon: '🌑', desc: '暗影突袭，造成120%攻击伤害' },
        { name: '堕天一击', cooldown: 8, damage: 130, icon: '🌠', desc: '天崩地裂的终极一击，造成130%攻击伤害' }
    ]
};

// 宝石词缀配置
const GEM_AFFIXES = {
    atk:         { name: '攻击',  icon: '⚔️',  type: 'number' },
    hp:          { name: '生命',  icon: '❤️',  type: 'number' },
    def:         { name: '防御',  icon: '🛡️',  type: 'number' },
    crit:        { name: '暴击',  icon: '🎯',  type: 'percentage' },
    critDmg:     { name: '爆伤',  icon: '💥',  type: 'number' },
    antiCrit:    { name: '抗暴击', icon: '🔰', type: 'percentage' },
    antiCritDmg: { name: '抗爆伤', icon: '💠', type: 'number' }
};

// 宝石品质配置
const GEM_QUALITIES = [
    { id: 0, name: '灰', color: 'rgb(160,160,160)' },
    { id: 1, name: '绿', color: 'rgb(76,175,80)' },
    { id: 2, name: '蓝', color: 'rgb(33,150,243)' },
    { id: 3, name: '紫', color: 'rgb(156,39,176)' },
    { id: 4, name: '橙', color: 'rgb(255,152,0)' }
];

// 宝石词缀范围配置
const GEM_AFFIX_RANGES = {
    0: { atk: [10, 140], hp: [10, 140], def: [10, 140], crit: [1, 12], critDmg: [10, 40], antiCrit: [1, 12], antiCritDmg: [10, 40] },
    1: { atk: [60, 150], hp: [60, 150], def: [60, 150], crit: [3, 15], critDmg: [20, 50], antiCrit: [3, 15], antiCritDmg: [20, 50] },
    2: { atk: [80, 170], hp: [80, 170], def: [80, 170], crit: [5, 18], critDmg: [30, 60], antiCrit: [5, 18], antiCritDmg: [30, 60] },
    3: { atk: [100, 180], hp: [100, 180], def: [100, 180], crit: [10, 20], critDmg: [40, 70], antiCrit: [10, 20], antiCritDmg: [40, 70] },
    4: { atk: [150, 200], hp: [150, 200], def: [150, 200], crit: [15, 25], critDmg: [50, 90], antiCrit: [15, 25], antiCritDmg: [50, 90] }
};

// 宝石孔位配置（品质对应孔位）
const GEM_HOLES = {
    0: 0, 1: 0, 2: 0, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4, 9: 4, 10: 4, 11: 5, 12: 6, 13: 6
};

// 装备掉落配置
const DROP_CONFIG = {
    // 装备掉落概率（每个怪物）—— 百分百爆率，品质随机
    equipmentChance: {
        normal: 1.0,      // 100%掉落装备
        boss: 1.0,        // 100%
        elite: 1.0,       // 100%
        hell: 1.0,        // 100%
        eventBoss: 1.0    // 100%
    },
    // 宝石掉落概率（按品质独立计算）
    // 挂机副本：灰色0.01% 绿色0.001% 其余不爆
    // 精英副本：灰色1% 绿色0.5% 蓝色0.3% 紫色0.2% 橙色0.1%
    // 地狱副本：精英的3倍
    gemChanceByQuality: {
        normal: [0.0001, 0.00001, 0, 0, 0],      // 灰0.01% 绿0.001% 蓝0% 紫0% 橙0%
        boss: [0.0001, 0.00001, 0, 0, 0],
        elite: [0.01, 0.005, 0.003, 0.002, 0.001], // 灰1% 绿0.5% 蓝0.3% 紫0.2% 橙0.1%
        hell: [0.03, 0.015, 0.009, 0.006, 0.003],  // 灰3% 绿1.5% 蓝0.9% 紫0.6% 橙0.3%
        eventBoss: [0.03, 0.015, 0.009, 0.006, 0.003] // 奇遇BOSS同地狱
    },
    // 技能书掉落概率（按品质独立计算）
    // 挂机副本：灰色0.01% 绿色0.001% 其余不爆
    // 精英副本：灰色1% 绿色0.5% 蓝色0.3% 紫色0.2% 橙色0.1%
    // 地狱副本：精英的3倍
    skillChanceByQuality: {
        normal: [0.0001, 0.00001, 0, 0, 0],      // 灰0.01% 绿0.001% 蓝0% 紫0% 橙0%
        boss: [0.0001, 0.00001, 0, 0, 0],
        elite: [0.01, 0.005, 0.003, 0.002, 0.001], // 灰1% 绿0.5% 蓝0.3% 紫0.2% 橙0.1%
        hell: [0.03, 0.015, 0.009, 0.006, 0.003],  // 灰3% 绿1.5% 蓝0.9% 紫0.6% 橙0.3%
        eventBoss: [0.03, 0.015, 0.009, 0.006, 0.003] // 奇遇BOSS同地狱
    }
};

// 品质掉落权重（概率）
const QUALITY_DROP_WEIGHTS = {
    // 挂机区域：小怪和头目
    normal: [0.80, 0.10, 0.05, 0.04, 0.008, 0.002],      // 灰80% 绿10% 蓝5% 紫4% 橙0.8% 红0.2%
    boss: [0.80, 0.10, 0.05, 0.04, 0.008, 0.002],       // 与小怪相同

    // 精英副本
    elite: [0, 0, 0, 0, 0.80, 0.10, 0.05, 0.03, 0.01, 0.005, 0.003, 0.0015, 0.0005],
    //       橙80% 红10% 黄5% 铂3% 钻1% 暗0.5% 神0.3% 至0.15% 臻0.05%

    // 地狱副本
    hell: [0, 0, 0, 0, 0.40, 0.30, 0.1497, 0.09, 0.03, 0.015, 0.009, 0.0045, 0.0015, 0.0003],
    //      橙40% 红30% 黄14.97% 铂9% 钻3% 暗1.5% 神0.9% 至0.45% 臻0.15% 无0.03%
};

// 根据权重随机品质（稀有装备特权：永恒及以上index≥8概率×3）
function rollQualityByWeight(weights) {
    const rareBonus = getRareEquipDropBonus(); // 1.0 or 3.0
    const ticketBonus = GameState.battle.inDungeon ? getTicketDropBonus() : 1.0;
    // 永恒=品质9(index 8)，视EQUIPMENT_QUALITIES定义，品质index>=8为永恒及以上
    const adjustedWeights = weights.map((w, i) => {
        let v = w;
        if (i >= 8 && rareBonus > 1) v *= rareBonus;
        if (ticketBonus > 1 && GameState.battle.inDungeon) v *= ticketBonus;
        return v;
    });
    const total = adjustedWeights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;
    let cumulative = 0;
    for (let i = 0; i < adjustedWeights.length; i++) {
        cumulative += adjustedWeights[i];
        if (rand < cumulative) return i;
    }
    return 0;
}

// 区域名称
const AREA_NAMES = [
    '新手平原', '翡翠草原', '幽暗森林', '迷雾沼泽', '岩石山脉',
    '烈焰峡谷', '冰封雪原', '雷电荒野', '毒雾沼泽', '血色城堡',
    '混沌深渊', '神殿废墟', '世界之巅', '冥界之门', '天空之城',
    '虚空裂隙', '末日废土', '远古神殿', '永恒之地', '混沌本源',
    '星辰遗迹', '暗影领域', '风暴之眼', '龙脊山脉', '深渊熔岩',
    '冰川要塞', '雷鸣平原', '暗夜森林', '火焰王座', '冰川圣殿',
    '虚空之门', '深渊裂口', '末日战场', '龙族遗迹', '神秘群岛',
    '暗影要塞', '风暴神殿', '星辰圣域', '龙族王座', '混沌圣殿'
];

// 怪物属性计算配置
const MONSTER_STATS_CONFIG = {
    // 根据文档中的怪物属性统计表
    // 每个数组元素对应一个区域 [血量, 攻击, 防御]
    areas: [
        [60, 5, 1],       // 新手平原 Lv.1-5
        [140, 13, 6],     // 翡翠草原 Lv.6-10
        [200, 30, 11],    // 幽暗森林 Lv.11-15
        [300, 60, 16],    // 迷雾沼泽 Lv.16-20
        [380, 100, 21],   // 岩石山脉 Lv.21-25
        [600, 150, 26],   // 烈焰峡谷 Lv.26-30
        [940, 250, 31],   // 冰封雪原 Lv.31-35
        [1520, 350, 360], // 雷电荒野 Lv.36-40
        [2200, 450, 410], // 毒雾沼泽 Lv.41-45
        [2700, 550, 460], // 血色城堡 Lv.46-50
        [3300, 666, 510], // 混沌深渊 Lv.51-55
        [5020, 777, 560], // 神殿废墟 Lv.56-60
        [9020, 888, 610], // 世界之巅 Lv.61-65
        [15100, 999, 660], // 冥界之门 Lv.66-70
        [19180, 1117, 710], // 天空之城 Lv.71-75
        [23260, 1225, 760], // 虚空裂隙 Lv.76-80
        [28340, 1303, 810], // 末日废土 Lv.81-85
        [34200, 1401, 860], // 远古神殿 Lv.86-90
        [41500, 1490, 910], // 永恒之地 Lv.91-95
        [46580, 1570, 960], // 混沌本源 Lv.96-100
        [50660, 1605, 1010], // 星辰遗迹 Lv.101-105
        [55740, 1730, 1060], // 暗影领域 Lv.106-110
        [61820, 1810, 1110], // 风暴之眼 Lv.111-115
        [65900, 1890, 1160], // 龙脊山脉 Lv.116-120
        [68980, 1970, 1210], // 深渊熔岩 Lv.121-125
        [72060, 2050, 1260], // 冰川要塞 Lv.126-130
        [75140, 2130, 1310], // 雷鸣平原 Lv.131-135
        [77220, 2210, 1360], // 暗夜森林 Lv.136-140
        [79300, 2290, 1410], // 火焰王座 Lv.141-145
        [82380, 2370, 1460], // 冰川圣殿 Lv.146-150
        [85460, 2405, 1510], // 虚空之门 Lv.151-155
        [87540, 2530, 1560], // 深渊裂口 Lv.156-160
        [92620, 2610, 1601], // 末日战场 Lv.161-165
        [95700, 2690, 1660], // 龙族遗迹 Lv.166-170
        [98780, 2770, 1710], // 神秘群岛 Lv.171-175
        [102860, 2850, 1760], // 暗影要塞 Lv.176-180
        [105940, 2930, 1801], // 风暴神殿 Lv.181-185
        [123020, 3010, 1806], // 星辰圣域 Lv.186-190
        [153100, 3090, 1901], // 龙族王座 Lv.191-195
        [200000, 3170, 1960]  // 混沌圣殿 Lv.196-200
    ]
};

// 怪物配置
const MONSTER_CONFIG = {
    // 怪物名称和图标配置 - 完全不重复，精美独特
    // 每个区域包含：[{name, icon}, {name, icon}, {name, icon}]
    areaMonsters: [
        [
            {name: '草蜢', icon: '🦗'}, 
            {name: '野兔', icon: '🐇'}, 
            {name: '草原首领', icon: '🦁'}
        ],           // 新手平原 Lv.1-5
        [
            {name: '绿草蛇', icon: '🐍'}, 
            {name: '斑马', icon: '🦓'}, 
            {name: '草原巨狮', icon: '🐯'}
        ],        // 翡翠草原 Lv.6-10
        [
            {name: '暗影狼', icon: '🐺'}, 
            {name: '树妖', icon: '🧝'}, 
            {name: '森林守护者', icon: '🦌'}
        ],     // 幽暗森林 Lv.11-15
        [
            {name: '沼泽鳄', icon: '🐊'}, 
            {name: '毒蛙', icon: '🐸'}, 
            {name: '沼泽之王', icon: '🦈'}
        ],       // 迷雾沼泽 Lv.16-20
        [
            {name: '石巨人', icon: '🗿'}, 
            {name: '山鹰', icon: '🦅'}, 
            {name: '山脉霸主', icon: '🦍'}
        ],       // 岩石山脉 Lv.21-25
        [
            {name: '火焰蜥蜴', icon: '🦎'}, 
            {name: '熔岩兽', icon: '🌋'}, 
            {name: '炎魔领主', icon: '👹'}
        ],   // 烈焰峡谷 Lv.26-30
        [
            {name: '雪狐', icon: '🦊'}, 
            {name: '冰晶兽', icon: '🐧'}, 
            {name: '冰霜巨人', icon: '🧊'}
        ],       // 冰封雪原 Lv.31-35
        [
            {name: '雷鸟', icon: '🦜'}, 
            {name: '闪电狼', icon: '⚡'}, 
            {name: '雷霆主宰', icon: '⛈️'}
        ],       // 雷电荒野 Lv.36-40
        [
            {name: '剧毒蜘蛛', icon: '🕷️'}, 
            {name: '沼泽毒蛇', icon: '🐍'}, 
            {name: '剧毒之王', icon: '☠️'}
        ], // 毒雾沼泽 Lv.41-45
        [
            {name: '骷髅兵', icon: '💀'}, 
            {name: '吸血鬼', icon: '🧛'}, 
            {name: '血色伯爵', icon: '🦇'}
        ],     // 血色城堡 Lv.46-50
        [
            {name: '深渊恶魔', icon: '👺'}, 
            {name: '虚空行者', icon: '👤'}, 
            {name: '深渊领主', icon: '😈'}
        ], // 混沌深渊 Lv.51-55
        [
            {name: '石像鬼', icon: '🗿'}, 
            {name: '守墓人', icon: '⚰️'}, 
            {name: '废墟守护灵', icon: '👻'}
        ],  // 神殿废墟 Lv.56-60
        [
            {name: '云霄巨人', icon: '🦾'}, 
            {name: '天空鹰', icon: '🦉'}, 
            {name: '山巅之王', icon: '🏔️'}
        ],   // 世界之巅 Lv.61-65
        [
            {name: '冥河摆渡人', icon: '🚣'}, 
            {name: '灵魂收割者', icon: '💀'}, 
            {name: '冥界之主', icon: '🦴'}
        ], // 冥界之门 Lv.66-70
        [
            {name: '天使', icon: '👼'}, 
            {name: '光之使者', icon: '✨'}, 
            {name: '天界君王', icon: '👑'}
        ],     // 天空之城 Lv.71-75
        [
            {name: '虚空虫', icon: '🐛'}, 
            {name: '空间裂痕', icon: '🌀'}, 
            {name: '虚空巨兽', icon: '🌌'}
        ],  // 虚空裂隙 Lv.76-80
        [
            {name: '丧尸', icon: '🧟'}, 
            {name: '辐射兽', icon: '☢️'}, 
            {name: '末日领主', icon: '🧟‍♂️'}
        ],       // 末日废土 Lv.81-85
        [
            {name: '古埃及兵', icon: '🏺'}, 
            {name: '神庙守卫', icon: '🏛️'}, 
            {name: '远古法老', icon: '🐪'}
        ], // 远古神殿 Lv.86-90
        [
            {name: '永恒骑士', icon: '🛡️'}, 
            {name: '时光守卫', icon: '⏳'}, 
            {name: '永恒之主', icon: '♾️'}
        ], // 永恒之地 Lv.91-95
        [
            {name: '混沌精灵', icon: '🧚'}, 
            {name: '原始野兽', icon: '🦖'}, 
            {name: '混沌之核', icon: '🔮'}
        ], // 混沌本源 Lv.96-100
        [
            {name: '星灵', icon: '⭐'}, 
            {name: '流星猎人', icon: '☄️'}, 
            {name: '星辰守护者', icon: '🌟'}
        ],   // 星辰遗迹 Lv.101-105
        [
            {name: '暗影刺客', icon: '🥷'}, 
            {name: '影魔', icon: '👤'}, 
            {name: '暗影领主', icon: '🌑'}
        ],     // 暗影领域 Lv.106-110
        [
            {name: '风刃猎手', icon: '🌪️'}, 
            {name: '风暴使者', icon: '🌀'}, 
            {name: '风暴之神', icon: '🌈'}
        ], // 风暴之眼 Lv.111-115
        [
            {name: '龙蜥', icon: '🦎'}, 
            {name: '翼龙', icon: '🦖'}, 
            {name: '龙族长者', icon: '🐲'}
        ],         // 龙脊山脉 Lv.116-120
        [
            {name: '熔岩巨人', icon: '🌋'}, 
            {name: '火焰精灵', icon: '🔥'}, 
            {name: '深渊炎魔', icon: '🔴'}
        ], // 深渊熔岩 Lv.121-125
        [
            {name: '冰霜守卫', icon: '🥶'}, 
            {name: '极地狼', icon: '🐺'}, 
            {name: '冰川领主', icon: '🐻‍❄️'}
        ],   // 冰川要塞 Lv.126-130
        [
            {name: '雷暴战兽', icon: '⚡'}, 
            {name: '闪电兽', icon: '🐾'}, 
            {name: '雷霆战神', icon: '⚔️'}
        ],   // 雷鸣平原 Lv.131-135
        [
            {name: '暗夜狼', icon: '🌑'}, 
            {name: '影树妖', icon: '🌲'}, 
            {name: '暗夜女巫', icon: '🧙‍♀️'}
        ],     // 暗夜森林 Lv.136-140
        [
            {name: '火焰骑士', icon: '🔥'}, 
            {name: '熔岩恶魔', icon: '👺'}, 
            {name: '炎帝', icon: '🏆'}
        ],     // 火焰王座 Lv.141-145
        [
            {name: '圣殿守卫', icon: '⚔️'}, 
            {name: '冰晶天使', icon: '👼'}, 
            {name: '冰神', icon: '❄️'}
        ],     // 冰川圣殿 Lv.146-150
        [
            {name: '虚空猎手', icon: '🌀'}, 
            {name: '空间恶魔', icon: '🌌'}, 
            {name: '虚空领主', icon: '🕳️'}
        ], // 虚空之门 Lv.151-155
        [
            {name: '深渊幽灵', icon: '👻'}, 
            {name: '地狱火', icon: '🔥'}, 
            {name: '深渊之主', icon: '👹'}
        ],   // 深渊裂口 Lv.156-160
        [
            {name: '末日骑士', icon: '🛡️'}, 
            {name: '辐射龙', icon: '☢️'}, 
            {name: '末日战神', icon: '⚔️'}
        ],   // 末日战场 Lv.161-165
        [
            {name: '龙族战士', icon: '🐉'}, 
            {name: '守护龙', icon: '🦎'}, 
            {name: '龙族之祖', icon: '🐲'}
        ],   // 龙族遗迹 Lv.166-170
        [
            {name: '海妖', icon: '🧜'}, 
            {name: '海怪', icon: '🦑'}, 
            {name: '海神', icon: '🌊'}
        ],             // 神秘群岛 Lv.171-175
        [
            {name: '暗影守卫', icon: '🖤'}, 
            {name: '影刺客', icon: '🗡️'}, 
            {name: '暗影大帝', icon: '🏅'}
        ],   // 暗影要塞 Lv.176-180
        [
            {name: '风暴祭司', icon: '🌪️'}, 
            {name: '雷霆巨人', icon: '⚡'}, 
            {name: '风暴之神', icon: '🎐'}
        ], // 风暴神殿 Lv.181-185
        [
            {name: '星之守护', icon: '⭐'}, 
            {name: '流星猎手', icon: '☄️'}, 
            {name: '星辰大帝', icon: '🌟'}
        ], // 星辰圣域 Lv.186-190
        [
            {name: '皇家龙卫', icon: '🐲'}, 
            {name: '龙族法师', icon: '🧙‍♂️'}, 
            {name: '龙族帝王', icon: '🎖️'}
        ], // 龙族王座 Lv.191-195
        [
            {name: '混沌守护者', icon: '🌀'}, 
            {name: '虚空战士', icon: '🌌'}, 
            {name: '混沌之神', icon: '🔮'}
        ] // 混沌圣殿 Lv.196-200
    ],
    baseStats: {
        hp: 100,
        atk: 10,
        def: 5,
        atkSpd: 1.0,
        crit: 5,
        critDmg: 150,
        exp: 10,
        gold: 10
    }
};

// 职业配置
const CLASSES = {
    warrior: {
        name: '战士',
        icon: '??',
        baseStats: { hp: 120, atk: 12, def: 7, atkSpd: 1.0, crit: 5, critDmg: 150 },
        growthStats: { hp: 15, atk: 2, def: 1.5, atkSpd: 0.02, crit: 0.3, critDmg: 3 },
        maxAtkSpd: 2.8
    },
    mage: {
        name: '法师',
        icon: '??',
        baseStats: { hp: 80, atk: 15, def: 4, atkSpd: 0.9, crit: 8, critDmg: 180 },
        growthStats: { hp: 10, atk: 2.5, def: 1, atkSpd: 0.01, crit: 0.5, critDmg: 4 },
        maxAtkSpd: 2.5
    },
    assassin: {
        name: '刺客',
        icon: '???',
        baseStats: { hp: 90, atk: 14, def: 5, atkSpd: 1.2, crit: 10, critDmg: 200 },
        growthStats: { hp: 12, atk: 2.2, def: 1.2, atkSpd: 0.04, crit: 0.7, critDmg: 5 },
        maxAtkSpd: 3.0
    }
};

// 精英副本配置（25级解锁，每10级一个，共18个，最高195级）
// 精英怪物属性 = 对应等级头目的双倍基础属性（在 spawnNextEnemy 中动态计算）
const ELITE_DUNGEON_NAMES = [
    '烈焰荒原', '幽暗矿脉', '毒雾沼泽', '碎骨要塞', '冰封废墟',
    '雷鸣峡谷', '炼狱熔岩', '血色丛林', '虚空裂隙', '死亡沙漠',
    '腐败神殿', '混沌深渊', '末日战场', '邪魔领域', '永夜王城',
    '湮灭之境', '神域禁地', '毁灭终焉'
];
// 精英副本专属BOSS头像（18个，按主题和强度递进）
const ELITE_DUNGEON_ICONS = [
    '🔥',   // Lv.25  烈焰荒原   - 火焰领主
    '⛏️',   // Lv.35  幽暗矿脉   - 黑暗矿魔
    '☠️',   // Lv.45  毒雾沼泽   - 剧毒死神
    '💀',   // Lv.55  碎骨要塞   - 骷髅战将
    '🧊',   // Lv.65  冰封废墟   - 冰霜魔王
    '⚡',   // Lv.75  雷鸣峡谷   - 雷霆暴君
    '🌋',   // Lv.85  炼狱熔岩   - 熔岩巨魔
    '🩸',   // Lv.95  血色丛林   - 血腥猎主
    '🌀',   // Lv.105 虚空裂隙   - 虚空裂魔
    '🏜️',   // Lv.115 死亡沙漠   - 死亡行者
    '🧿',   // Lv.125 腐败神殿   - 腐化神祭
    '🌑',   // Lv.135 混沌深渊   - 混沌魔眼
    '💣',   // Lv.145 末日战场   - 末日毁灭者
    '👿',   // Lv.155 邪魔领域   - 邪恶大魔王
    '🌘',   // Lv.165 永夜王城   - 永夜黑皇
    '🔱',   // Lv.175 湮灭之境   - 湮灭主宰
    '⚜️',   // Lv.185 神域禁地   - 神域煞神
    '🗡️',   // Lv.195 毁灭终焉   - 终焉破坏神
];
const ELITE_DUNGEONS = (() => {
    const dungeons = [];
    for (let i = 0; i < 18; i++) {
        const requiredLevel = 25 + i * 10; // 25, 35, 45 ... 195
        dungeons.push({
            level: requiredLevel,
            name: ELITE_DUNGEON_NAMES[i],
            monsterName: '打我爆一切',
            icon: ELITE_DUNGEON_ICONS[i],
        });
    }
    return dungeons;
})();

// 地狱副本名称（50~200级，每10级一个，共16个）
const HELL_DUNGEON_NAMES = [
    '血狱裂渊',   // Lv.50
    '炎狱熔核',   // Lv.60
    '暗魂炼狱',   // Lv.70
    '噬骨深渊',   // Lv.80
    '亡灵狱界',   // Lv.90
    '魔王禁地',   // Lv.100
    '混沌炼狱',   // Lv.110
    '虚空地狱',   // Lv.120
    '湮灭深渊',   // Lv.130
    '终焉裂隙',   // Lv.140
    '神魔炼狱',   // Lv.150
    '星辰地狱',   // Lv.160
    '永恒深渊',   // Lv.170
    '毁灭炼狱',   // Lv.180
    '混沌终焉',   // Lv.190
    '无尽地狱'    // Lv.200
];

// 地狱副本专属BOSS头像（16个，地狱风格，越到后期越震撼）
const HELL_DUNGEON_ICONS = [
    '🩻',   // Lv.50  血狱裂渊   - 血骨裂魔
    '🔴',   // Lv.60  炎狱熔核   - 炎狱核心
    '👁️',   // Lv.70  暗魂炼狱   - 暗魂凝视者
    '🦴',   // Lv.80  噬骨深渊   - 噬骨魔兽
    '💀',   // Lv.90  亡灵狱界   - 亡灵霸主
    '👺',   // Lv.100 魔王禁地   - 血面魔王
    '🌑',   // Lv.110 混沌炼狱   - 混沌侵噬者
    '🌀',   // Lv.120 虚空地狱   - 虚空破碎者
    '🔮',   // Lv.130 湮灭深渊   - 湮灭之眼
    '⚫',   // Lv.140 终焉裂隙   - 终焉裂魔
    '🕳️',   // Lv.150 神魔炼狱   - 神魔深渊主
    '✨',   // Lv.160 星辰地狱   - 堕落星神
    '🌌',   // Lv.170 永恒深渊   - 永恒深渊主
    '💥',   // Lv.180 毁灭炼狱   - 毁灭炽魂
    '🌪️',   // Lv.190 混沌终焉   - 混沌终焉主
    '👑',   // Lv.200 无尽地狱   - 无尽地狱王
];

// 地狱副本配置（50~200级，每10级一个，共16个）
const HELL_DUNGEONS = (() => {
    const dungeons = [];
    for (let i = 0; i < 16; i++) {
        const requiredLevel = 50 + i * 10; // 50, 60, 70 ... 200
        dungeons.push({
            level: requiredLevel,
            name: HELL_DUNGEON_NAMES[i],
            monsterName: '打我爆终极',
            icon: HELL_DUNGEON_ICONS[i],
        });
    }
    return dungeons;
})();

// 掉落率配置 - 普通区域
const DROP_RATES_NORMAL = {
    equip: { base: 1.0, quality: [0.8, 0.1, 0.05, 0.04, 0.008, 0.002, 0, 0, 0, 0, 0, 0, 0, 0] },
    skill: { base: 0.05, quality: [0.4, 0.35, 0.2, 0.05, 0, 0] },
    gem: { base: 0.03, quality: [0.5, 0.3, 0.15, 0.05, 0, 0] }
};

// 掉落率配置 - 精英副本
const DROP_RATES_ELITE = {
    equip: { base: 1.0, quality: [0, 0, 0, 0, 0.8, 0.1, 0.05, 0.03, 0.01, 0.005, 0.003, 0.0015, 0.0005, 0] },
    skill: { base: 0.1, quality: [0.2, 0.3, 0.35, 0.15, 0, 0] },
    gem: { base: 0.05, quality: [0.3, 0.35, 0.25, 0.1, 0, 0] }
};

// 掉落率配置 - 地狱副本
const DROP_RATES_HELL = {
    equip: { base: 1.0, quality: [0, 0, 0, 0, 0.4, 0.3, 0.1497, 0.09, 0.03, 0.015, 0.009, 0.0045, 0.0015, 0.0003] },
    skill: { base: 0.15, quality: [0.1, 0.2, 0.3, 0.3, 0.1, 0] },
    gem: { base: 0.1, quality: [0.1, 0.2, 0.3, 0.3, 0.1, 0] }
};

// 奇遇BOSS配置
const EVENT_BOSS_CONFIG = {
    baseChance: 0.00003, // 0.003%概率遇到奇遇BOSS（仅在挂机区域）
    isFixedDamage: true, // 是否固定伤害模式
    // 掉落品质：辉煌90% / 神圣5% / 永恒3% / 深渊1.5% / 混沌0.5% / 虚空0% / 湮灭0% / 终焉0%
    dropRates: [0, 0, 0, 0, 0, 0, 0.9, 0.05, 0.03, 0.015, 0.005, 0, 0, 0]
};

// ========== 战斗系统 ==========

// 根据等级获取怪物属性
function getMonsterStatsByLevel(level) {
    // 计算区域索引（从0开始）
    // 每个区域5个等级：1-5对应区域0, 6-10对应区域1, 以此类推
    const areaIndex = Math.floor((level - 1) / 5);

    // 获取该区域的怪物属性
    const areaStats = MONSTER_STATS_CONFIG.areas[areaIndex] || [60, 5, 1];

    // 除新手平原外，所有怪物的攻击、血量、防御提升一半
    let hp = areaStats[0];
    let atk = areaStats[1];
    let def = areaStats[2];
    
    if (areaIndex > 0) { // 区域0是新手平原，不提升
        hp = Math.floor(hp * 1.5);
        atk = Math.floor(atk * 1.5);
        def = Math.floor(def * 1.5);
    }

    // 经验公式：新手平原小怪10经验，每高一个区域经验增加20%
    // 区域0(新手平原): 10, 区域1(翡翠平原): 12, 区域2: 14.4... 取整
    const baseExp = 10;
    const expGrowth = Math.pow(1.2, areaIndex);
    const exp = Math.floor(baseExp * expGrowth);
    // 金币：小怪5，每区域+20%
    const gold = Math.floor(5 * expGrowth);

    return {
        hp: hp,
        atk: atk,
        def: def,
        atkSpd: 1.0,
        crit: 5,
        critDmg: 150,
        exp: exp,
        gold: gold
    };
}

// 生成怪物
function generateEnemy(areaIndex, enemyType = 'normal') {
    const area = AREA_NAMES[areaIndex] || AREA_NAMES[0];
    const baseLevel = areaIndex * 5 + 1;
    const stats = getMonsterStatsByLevel(baseLevel);

    // 获取该区域的怪物配置
    const areaMonsters = MONSTER_CONFIG.areaMonsters[areaIndex] || MONSTER_CONFIG.areaMonsters[0];
    let name;
    let icon;

    if (enemyType === 'eventBoss') {
        // 奇遇BOSS：固定属性
        name = '奇遇BOSS';
        icon = '💀';
        stats.hp = 200;
        stats.atk = 1;
        stats.def = 1;
        stats.antiCrit = 999; // 抗暴击修改为999
    } else if (enemyType === 'boss') {
        // 头目：经验是小怪的3倍
        name = areaMonsters[2].name;
        icon = areaMonsters[2].icon;
        stats.hp = Math.floor(stats.hp * 3);
        stats.atk = Math.floor(stats.atk * 2);
        stats.exp = Math.floor(stats.exp * 3); // 头目经验是小怪的3倍
    } else if (enemyType === 'elite') {
        // 精英怪物（使用小怪名称并加前缀）
        const minionIndex = Math.floor(Math.random() * 2);
        name = '精英' + areaMonsters[minionIndex].name;
        icon = areaMonsters[minionIndex].icon;
        stats.hp = Math.floor(stats.hp * 1.5);
        stats.atk = Math.floor(stats.atk * 1.5);
    } else {
        // 普通怪物
        const minionIndex = Math.floor(Math.random() * 2);
        name = areaMonsters[minionIndex].name;
        icon = areaMonsters[minionIndex].icon;
    }

    return {
        name: name,
        icon: icon,
        level: baseLevel,
        hp: stats.hp,
        maxHp: stats.hp,
        atk: stats.atk,
        def: stats.def,
        atkSpd: stats.atkSpd,
        crit: stats.crit,
        critDmg: stats.critDmg,
        antiCrit: stats.antiCrit,
        exp: stats.exp,
        gold: stats.gold,
        type: enemyType
    };
}

// 带配置生成怪物
function generateEnemyWithConfig(areaIndex, enemyType, dungeonMultiplier = 1.0) {
    const enemy = generateEnemy(areaIndex, enemyType);
    if (dungeonMultiplier > 1) {
        enemy.hp = Math.floor(enemy.hp * dungeonMultiplier);
        enemy.maxHp = enemy.hp;
        enemy.atk = Math.floor(enemy.atk * dungeonMultiplier);
        enemy.def = Math.floor(enemy.def * dungeonMultiplier);
        enemy.exp = Math.floor(enemy.exp * dungeonMultiplier);
        enemy.gold = Math.floor(enemy.gold * dungeonMultiplier);
    }
    return enemy;
}

// ============================================================
// 生成精英副本专属怪物
//   dungeonLevel - 副本等级要求（25/35/45 ... 195）
// 属性 = 该等级对应的 boss 基础属性 × 2
// 暴击/抗暴/爆伤按层数递增（每高10级×1.2），上限 crit/antiCrit≤600
// ============================================================
function generateEliteDungeonEnemy(dungeonLevel) {
    // boss 属性：getMonsterStatsByLevel 返回小怪基础，boss 是 hp×3、atk×2
    const baseStats = getMonsterStatsByLevel(dungeonLevel);
    const bossHp  = Math.floor(baseStats.hp  * 3);
    const bossAtk = Math.floor(baseStats.atk * 2);
    const bossDef = baseStats.def;

    // 精英 = boss × 2 × 10（血量增加十倍）
    const hp  = bossHp  * 2 * 10;
    const atk = bossAtk * 2;
    const def = bossDef * 2;

    // 暴击/抗暴/爆伤递增：tier = (dungeonLevel - 25) / 10，从0开始
    // 每高一个 tier 乘以 1.2，上限 crit/antiCrit = 600，爆伤无上限
    const tier = Math.max(0, (dungeonLevel - 25) / 10); // 0, 1, 2 ... 17
    const BASE_CRIT     = 70;
    const BASE_ANTI     = 70;
    const BASE_CRITDMG  = 500;
    const scaleFactor   = Math.pow(1.2, tier);
    const crit          = Math.min(600, Math.round(BASE_CRIT    * scaleFactor));
    const antiCrit      = Math.min(600, Math.round(BASE_ANTI    * scaleFactor));
    const critDmg       = Math.round(BASE_CRITDMG * scaleFactor);

    const exp  = Math.floor(baseStats.exp  * 3); // 精英副本经验 = 头目经验 = 小怪×3
    const gold = Math.floor(baseStats.gold * 3);

    // 从副本配置里取专属图标
    const eliteDungeon = ELITE_DUNGEONS.find(d => d.level === dungeonLevel);
    const icon = eliteDungeon ? eliteDungeon.icon : '👹';

    return {
        name:    '打我爆一切',
        icon:    icon,
        level:   dungeonLevel,
        hp:      hp,
        maxHp:   hp,
        atk:     atk,
        def:     def,
        atkSpd:  1.2,
        crit:    crit,
        critDmg: critDmg,
        antiCrit: antiCrit,
        exp:     exp,
        gold:    gold,
        type:    'elite'
    };
}

// ============================================================
// 生成地狱副本专属怪物
//   dungeonLevel - 副本等级要求（50/60/70 ... 200）
// 属性 = 该等级对应的 boss 基础属性 × 3
// 暴击/抗暴/爆伤按层数递增（每高10级×1.2），上限 crit/antiCrit≤700，爆伤无上限
// ============================================================
function generateHellDungeonEnemy(dungeonLevel) {
    // boss 属性：小怪基础 hp×3、atk×2
    const baseStats = getMonsterStatsByLevel(dungeonLevel);
    const bossHp  = Math.floor(baseStats.hp  * 3);
    const bossAtk = Math.floor(baseStats.atk * 2);
    const bossDef = baseStats.def;

    // 地狱怪 = boss × 3 × 10（血量增加十倍）
    const hp  = bossHp  * 3 * 10;
    const atk = bossAtk * 3;
    const def = bossDef * 3;

    // 暴击/抗暴/爆伤递增：tier = (dungeonLevel - 50) / 10，从0开始
    // 每高一个 tier 乘以 1.2，上限 crit/antiCrit = 700，爆伤无上限
    const tier = Math.max(0, (dungeonLevel - 50) / 10); // 0, 1, 2 ... 15
    const BASE_CRIT    = 150;
    const BASE_ANTI    = 150;
    const BASE_CRITDMG = 500;
    const scaleFactor  = Math.pow(1.2, tier);
    const crit         = Math.min(700, Math.round(BASE_CRIT    * scaleFactor));
    const antiCrit     = Math.min(700, Math.round(BASE_ANTI    * scaleFactor));
    const critDmg      = Math.round(BASE_CRITDMG * scaleFactor);

    const exp  = Math.floor(baseStats.exp  * 6); // 地狱副本经验 = 头目×2 = 小怪×6
    const gold = Math.floor(baseStats.gold * 6);

    // 从副本配置里取专属图标
    const hellDungeon = HELL_DUNGEONS.find(d => d.level === dungeonLevel);
    const icon = hellDungeon ? hellDungeon.icon : '😈';

    return {
        name:     '打我爆终极',
        icon:     icon,
        level:    dungeonLevel,
        hp:       hp,
        maxHp:    hp,
        atk:      atk,
        def:      def,
        atkSpd:   1.5,
        crit:     crit,
        critDmg:  critDmg,
        antiCrit: antiCrit,
        exp:      exp,
        gold:     gold,
        type:     'hell'
    };
}

// 生成敌人（兼容函数）
function spawnEnemy() {
    spawnNextEnemy();
}

  // 开始自动战斗
  let autoBattleInterval = null;
  let enemyBattleInterval = null;
  let playerBattleInterval = null; // 玩家攻击计时器（改为全局变量）

  function startAutoBattle() {
    console.log('startAutoBattle 被调用，当前 isAuto:', GameState.battle.isAuto);

      // 如果已经在运行中，清除旧计时器但不停止战斗
      if (GameState.battle.isAuto) {
          console.log('自动战斗已在运行中，清除旧计时器');
          if (autoBattleInterval) {
              clearInterval(autoBattleInterval);
              autoBattleInterval = null;
          }
          if (playerBattleInterval) {
              clearInterval(playerBattleInterval);
              playerBattleInterval = null;
          }
      }

      GameState.battle.isAuto = true;
      console.log('isAuto 设置为 true');


      // 计算实际攻速（考虑职业上限）
      let actualAtkSpd = GameState.player.atkSpd;
      const classConfig = CLASSES[GameState.player.class];
      if (classConfig && classConfig.maxAtkSpd) {
          actualAtkSpd = Math.min(actualAtkSpd, classConfig.maxAtkSpd);
      }

      // 玩家攻击计时器（现在存储到全局变量，可以在复活时清除）
      playerBattleInterval = setInterval(() => {
          if (!GameState.battle.isAuto) {
              console.log('停止玩家攻击计时器');
              clearInterval(playerBattleInterval);
              return;
          }

          const player = GameState.player;
          const enemy = GameState.battle.currentEnemy;

          if (enemy && enemy.hp > 0) {
              // 先检查并释放冷却完成的技能
              for (let i = 0; i < GameState.skills.length; i++) {
                  useSkill(i);
              }
              
              // 然后进行普通攻击
              playerAttack();
          }
      }, Math.floor(1000 / actualAtkSpd));

      console.log('玩家攻击计时器已设置，间隔:', Math.floor(1000 / actualAtkSpd), 'ms');

    // 敌人生成计时器（作为备份，防止怪物意外消失）
    if (autoBattleInterval) {
        clearInterval(autoBattleInterval);
    }
    autoBattleInterval = setInterval(() => {
        // 备用机制：如果怪物意外消失，立即生成新怪物
        if (!GameState.battle.currentEnemy && GameState.battle.isAuto) {
            spawnNextEnemy();
        }
        // 定期检查药水状态和更新Buff显示
        checkExpPotionStatus();
        checkDropPotionStatus();
        updateBuffStatus();
    }, 1000); // 延长到1秒，因为主要生成在击杀时立即进行
    console.log('敌人生成备用计时器已设置');
    console.log('药水状态检查和Buff更新已添加到主循环');

}

  // 停止自动战斗
  function stopAutoBattle() {
      GameState.battle.isAuto = false;
      if (autoBattleInterval) {
          clearInterval(autoBattleInterval);
          autoBattleInterval = null;
      }
      if (enemyBattleInterval) {
          clearInterval(enemyBattleInterval);
          enemyBattleInterval = null;
      }
      if (playerBattleInterval) {
          clearInterval(playerBattleInterval);
          playerBattleInterval = null;
      }
  }

// 生成下一个敌人
function spawnNextEnemy() {
    let enemyType = 'normal';

    // 检查奇遇BOSS（仅在挂机区域）
    if (!GameState.battle.inDungeon) {
        const vipBonus = getVipEncounterBonus();
        const eventBossChance = EVENT_BOSS_CONFIG.baseChance * vipBonus;
        if (Math.random() < eventBossChance) {
            enemyType = 'eventBoss';
            // 触发奇遇BOSS动画
            triggerEventBossAnimation();
        } else if (GameState.battle.minionsKilled >= 2) {
            // 挂机区域：击杀2只小怪后出现一个头目
            enemyType = 'boss';
            GameState.battle.minionsKilled = 0; // 重置计数器
        }
    } else if (GameState.battle.inDungeon && GameState.battle.dungeonType === 'elite') {
        enemyType = 'elite';
    } else if (GameState.battle.inDungeon && GameState.battle.dungeonType === 'hell') {
        enemyType = 'hell';
    }

    // 精英副本：直接用副本等级生成专属怪物，不走普通 areaIndex 逻辑
    if (GameState.battle.inDungeon && GameState.battle.dungeonType === 'elite') {
        // 计算门票消耗：25级7张，每10级+1张，105-195级固定15张
        const level = GameState.battle.dungeonLevel;
        let ticketCost;
        if (level >= 105 && level <= 195) {
            ticketCost = 15;
        } else {
            ticketCost = 7 + Math.floor((level - 25) / 10);
        }
        if (!GameState.player.tickets || GameState.player.tickets.elite < ticketCost) {
            showToast(`精英门票不足（需要${ticketCost}张），已退出副本`, 'error');
            // 退出副本回到挂机区域
            GameState.battle.inDungeon = false;
            GameState.battle.dungeonType = null;
            GameState.battle.dungeonLevel = 0;
            updateAreaDisplay();
            // 生成普通怪物（使用setTimeout避免递归调用）
            setTimeout(() => {
                spawnNextEnemy();
            }, 0);
            return;
        }
        // 扣除门票
        GameState.player.tickets.elite -= ticketCost;
        // 称号进度：累计消耗精英门票
        GameState.stats.eliteTicketsUsed += ticketCost;
        GameState.battle.currentEnemy = generateEliteDungeonEnemy(level);
        startBattle();
        showToast(`消耗${ticketCost}张精英门票`, 'info');
        return;
    }

    // 地狱副本：直接用副本等级生成专属怪物
    if (GameState.battle.inDungeon && GameState.battle.dungeonType === 'hell') {
        // 计算门票消耗：50-100级1张，110-150级2张，160-200级3张
        const level = GameState.battle.dungeonLevel;
        let ticketCost = 1;
        if (level >= 160) ticketCost = 3;
        else if (level >= 110) ticketCost = 2;
        if (!GameState.player.tickets || GameState.player.tickets.hell < ticketCost) {
            showToast(`地狱门票不足（需要${ticketCost}张），已退出副本`, 'error');
            // 退出副本回到挂机区域
            GameState.battle.inDungeon = false;
            GameState.battle.dungeonType = null;
            GameState.battle.dungeonLevel = 0;
            updateAreaDisplay();
            // 生成普通怪物（使用setTimeout避免递归调用）
            setTimeout(() => {
                spawnNextEnemy();
            }, 0);
            return;
        }
        // 扣除门票
        GameState.player.tickets.hell -= ticketCost;
        // 称号进度：累计消耗地狱门票
        GameState.stats.hellTicketsUsed += ticketCost;
        GameState.battle.currentEnemy = generateHellDungeonEnemy(level);
        startBattle();
        showToast(`消耗${ticketCost}张地狱门票`, 'info');
        return;
    }

    const areaIndex = GameState.currentArea;
    const dungeonMultiplier = 1.0;

    GameState.battle.currentEnemy = generateEnemyWithConfig(areaIndex, enemyType, dungeonMultiplier);
    startBattle();
}

// 开始战斗
function startBattle() {
    const enemy = GameState.battle.currentEnemy;
    if (!enemy) return;

    // 更新区域显示
    updateAreaDisplay();

    // 立即刷新战斗界面
    updateBattleStatus();
    updateCharacterStats();

    // 清除旧的敌人攻击计时器
    if (enemyBattleInterval) {
        clearInterval(enemyBattleInterval);
        enemyBattleInterval = null;
    }

    // 设置敌人攻击计时器
    const enemyAtkInterval = Math.floor(2000 / enemy.atkSpd);
    enemyBattleInterval = setInterval(() => {
        if (!GameState.battle.currentEnemy || !GameState.battle.isAuto) {
            clearInterval(enemyBattleInterval);
            enemyBattleInterval = null;
            return;
        }

        // 敌人攻击玩家
        const dmg = calculateDamage(enemy, GameState.player);
        // 敌人暴击率 - 玩家抗暴击 = 实际暴击概率
        const effectiveCrit = Math.max(0, (enemy.crit || 0) - (GameState.player.antiCrit || 0));
        const isCrit = Math.random() * 100 < effectiveCrit;
        // 敌人爆伤 - 玩家抗爆伤 = 实际爆伤倍率（最低100%）
        const effectiveCritDmg = Math.max(100, (enemy.critDmg || 150) - (GameState.player.antiCritDmg || 0));
        const finalDmg = isCrit ? Math.floor(dmg * effectiveCritDmg / 100) : dmg;
        GameState.player.hp -= finalDmg;

        // 显示伤害数字
        addBattleLog(`${enemy.name}对你造成了${finalDmg}点伤害${isCrit ? '(暴击!)' : ''}`);

        if (GameState.player.hp <= 0) {
            GameState.player.hp = 0;
            onPlayerDefeated();
        }

        updateBattleStatus();
        updateCharacterStats();
    }, enemyAtkInterval);
}

// 玩家攻击
function playerAttack() {
    const enemy = GameState.battle.currentEnemy;
    if (!enemy || enemy.hp <= 0) {
        return;
    }

    const dmg = calculateDamage(GameState.player, enemy);
    // 玩家暴击率 - 敌人抗暴击 = 实际暴击概率
    const effectivePlayerCrit = Math.max(0, GameState.player.crit - (enemy.antiCrit || 0));
    const isCrit = Math.random() * 100 < effectivePlayerCrit;
    // 玩家爆伤 - 敌人抗爆伤 = 实际爆伤倍率（最低100%）
    const effectivePlayerCritDmg = Math.max(100, GameState.player.critDmg - (enemy.antiCritDmg || 0));
    const finalDmg = isCrit ? Math.floor(dmg * effectivePlayerCritDmg / 100) : dmg;

    enemy.hp -= finalDmg;

    // 吸血
    if (GameState.player.vamp > 0) {
        const heal = Math.floor(finalDmg * GameState.player.vamp / 100);
        GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + heal);
    }

    showFloatingText(finalDmg, isCrit);
    addBattleLog(`你对${enemy.name}造成了${finalDmg}点伤害${isCrit ? '(暴击!)' : ''}`);

    if (enemy.hp <= 0) {
        enemy.hp = 0;
        onEnemyDefeated();
    }

    updateBattleStatus();
}

// 计算伤害
function calculateDamage(attacker, defender) {
    // 奇遇BOSS固定掉血1点
    if (defender.type === 'eventBoss') {
        return 1;
    }

    const baseDmg = Math.max(1, attacker.atk - Math.floor(defender.def * 0.5));
    // 穿透计算：穿透最高增伤为1倍伤害，400%穿透触发，100%穿透增加25%输出
    const penetrateBonus = attacker.penetrate || 0;
    // 计算穿透增伤比例：penetrateBonus/400，最大为1
    const penetrationMultiplier = Math.min(1, penetrateBonus / 400);
    const finalDmg = Math.floor(baseDmg * (1 + penetrationMultiplier));
    return Math.max(1, finalDmg);
}

// 释放技能
function useSkill(slotIndex) {
    const skill = GameState.skills[slotIndex];
    const enemy = GameState.battle.currentEnemy;
    
    // 检查技能是否存在
    if (!skill) return false;
    
    // 检查敌人是否存在且存活
    if (!enemy || enemy.hp <= 0) return false;
    
    // 检查技能冷却时间
    const currentTime = Date.now();
    const lastUsed = GameState.skillCooldowns[slotIndex] || 0;
    const cooldownMs = skill.cooldown * 1000;
    
    if (currentTime - lastUsed < cooldownMs) return false;
    
    // 计算技能伤害
    const baseDmg = calculateDamage(GameState.player, enemy);
    const skillDamage = Math.floor(baseDmg * skill.damage / 100);
    
    // 玩家暴击率 - 敌人抗暴击 = 实际暴击概率
    const effectivePlayerCrit = Math.max(0, GameState.player.crit - (enemy.antiCrit || 0));
    const isCrit = Math.random() * 100 < effectivePlayerCrit;
    
    // 玩家爆伤 - 敌人抗爆伤 = 实际爆伤倍率（最低100%）
    const effectivePlayerCritDmg = Math.max(100, GameState.player.critDmg - (enemy.antiCritDmg || 0));
    const finalDmg = isCrit ? Math.floor(skillDamage * effectivePlayerCritDmg / 100) : skillDamage;
    
    // 应用伤害
    enemy.hp -= finalDmg;
    
    // 吸血
    if (GameState.player.vamp > 0) {
        const heal = Math.floor(finalDmg * GameState.player.vamp / 100);
        GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + heal);
    }
    
    // 显示伤害飘血和战斗日志
    showFloatingText(finalDmg, isCrit);
    addBattleLog(`你使用${skill.name}对${enemy.name}造成了${finalDmg}点伤害${isCrit ? '(暴击!)' : ''}`);
    
    // 更新技能冷却时间
    GameState.skillCooldowns[slotIndex] = currentTime;
    
    // 检查敌人是否死亡
    if (enemy.hp <= 0) {
        enemy.hp = 0;
        onEnemyDefeated();
    }
    
    updateBattleStatus();
    return true;
}

// 敌人被击败
function onEnemyDefeated() {
    const enemy = GameState.battle.currentEnemy;
    if (!enemy) return;

    // 经验和金币
    let exp, gold;

    if (enemy.type === 'eventBoss') {
        // 奇遇BOSS：固定10000经验 + 当前等级经验的1% + 金币100W（固定数值，不享受任何加成）
        const levelExp = getExpCap(GameState.player.level);
        exp = 10000 + Math.floor(levelExp * 0.01);
        gold = 1000000; // 100W金币
    } else {
        const expBonus = getExpBonusExtra();
        const goldBonus = getVipGoldBonus();
        exp = Math.floor(enemy.exp * expBonus);
        gold = Math.floor(enemy.gold * goldBonus);
    }

    GameState.player.exp += exp;
    GameState.player.gold += gold;
    GameState.stats.battlesWon++;
    GameState.stats.monstersKilled++;

    // ---- 称号进度更新 ----
    // 挂机区域击杀（奇遇BOSS也计入）
    if (!GameState.battle.inDungeon) {
        const areaIdx = GameState.currentArea;
        if (!GameState.stats.areaKills[areaIdx]) {
            GameState.stats.areaKills[areaIdx] = 0;
        }
        GameState.stats.areaKills[areaIdx]++;
        // 更新单个区域最高击杀数
        if (GameState.stats.areaKills[areaIdx] > GameState.stats.totalAreaKills) {
            GameState.stats.totalAreaKills = GameState.stats.areaKills[areaIdx];
            GameState.stats.bestAreaIndex = areaIdx;
        }
    }

    // 奇遇BOSS击杀
    if (enemy.type === 'eventBoss') {
        GameState.stats.eventBossKills++;
    }

    // 检查并激活新称号
    checkTitles();

    // 在挂机区域击杀小怪时增加计数器（奇遇BOSS不影响）
    if (!GameState.battle.inDungeon && enemy.type === 'normal') {
        GameState.battle.minionsKilled++;
    }

    // ---- 每日任务进度 ----
    if (!GameState.battle.inDungeon) {
        // 区域扫荡：击杀普通/boss/奇遇boss都算
        DailyTaskSystem.addProgress('kill_normal', 1);
    } else if (GameState.battle.dungeonType === 'elite') {
        DailyTaskSystem.addProgress('kill_elite', 1);
    } else if (GameState.battle.dungeonType === 'hell') {
        DailyTaskSystem.addProgress('kill_hell', 1);
    }

    addBattleLog(`${enemy.name}被击败! 获得经验${exp}, 金币${gold}`);

    // 掉落物品
    rollDrops();

    // 清除敌人攻击计时器
    if (enemyBattleInterval) {
        clearInterval(enemyBattleInterval);
        enemyBattleInterval = null;
    }

    // 立即生成新敌人
    spawnNextEnemy();

    // 检查升级
    checkLevelUp();
    updateTopBar();
    updateCharacterStats();
}

// 玩家被击败
  function onPlayerDefeated() {
      stopAutoBattle();
      GameState.battle.isPaused = true;
      addBattleLog('你被击败了! 正在复活...', 'danger');
      startReviving();
  }

  // 复活
  function startReviving() {
      console.log('开始复活倒计时...');
      setTimeout(() => {
          console.log('复活倒计时结束，开始恢复玩家状态');

          // 清除所有可能存在的计时器
          if (playerBattleInterval) {
              clearInterval(playerBattleInterval);
              playerBattleInterval = null;
          }
          if (enemyBattleInterval) {
              clearInterval(enemyBattleInterval);
              enemyBattleInterval = null;
          }
          if (autoBattleInterval) {
              clearInterval(autoBattleInterval);
              autoBattleInterval = null;
          }

          // 恢复玩家HP
          GameState.player.hp = GameState.player.maxHp;
          GameState.battle.isPaused = false;

          // 如果在副本中，退出副本回到挂机区域
          if (GameState.battle.inDungeon) {
              const wasInDungeon = true;
              const dungeonType = GameState.battle.dungeonType;

              GameState.battle.inDungeon = false;
              GameState.battle.dungeonType = null;
              GameState.battle.dungeonLevel = 0;

              addBattleLog(`复活成功! 已从${dungeonType === 'elite' ? '精英' : '地狱'}副本返回挂机区域`, 'success');
          } else {
              addBattleLog('复活成功!', 'success');
          }

          updateCharacterStats();

          // 更新区域显示
          updateAreaDisplay();

          // 重新生成敌人
          GameState.battle.currentEnemy = null;
          spawnNextEnemy();

          // 重新启动自动战斗
          console.log('重新启动自动战斗');
          startAutoBattle();
      }, 3000);
  }

// 更新区域显示
function updateAreaDisplay() {
    const areaNameElement = document.getElementById('areaName');
    const areaLevelElement = document.getElementById('areaLevel');

    if (!areaNameElement || !areaLevelElement) return;

    if (GameState.battle.inDungeon) {
        if (GameState.battle.dungeonType === 'elite') {
            // 检查常量是否存在
            if (typeof ELITE_DUNGEONS !== 'undefined' && ELITE_DUNGEONS && ELITE_DUNGEONS.length > 0) {
                const dungeon = ELITE_DUNGEONS.find(d => d.level === GameState.battle.dungeonLevel);
                if (dungeon) {
                    areaNameElement.textContent = dungeon.name;
                    areaLevelElement.textContent = `Lv.${dungeon.level}`;
                }
            } else {
                console.error('ELITE_DUNGEONS 未定义或为空');
            }
        } else if (GameState.battle.dungeonType === 'hell') {
            // 检查常量是否存在
            if (typeof HELL_DUNGEONS !== 'undefined' && HELL_DUNGEONS && HELL_DUNGEONS.length > 0) {
                const dungeon = HELL_DUNGEONS.find(d => d.level === GameState.battle.dungeonLevel);
                if (dungeon) {
                    areaNameElement.textContent = '😈' + dungeon.name;
                    areaLevelElement.textContent = `Lv.${dungeon.level}`;
                }
            } else {
                console.error('HELL_DUNGEONS 未定义或为空');
            }
        }
    } else {
        const areaIndex = GameState.currentArea;
        const baseLevel = areaIndex * 5 + 1;
        if (AREA_NAMES && AREA_NAMES[areaIndex]) {
            areaNameElement.textContent = AREA_NAMES[areaIndex];
            areaLevelElement.textContent = `Lv.${baseLevel}-${baseLevel + 4}`;
        }
    }
}

// 检查升级
function checkLevelUp() {
    const expCap = getExpCap(GameState.player.level);
    if (GameState.player.exp >= expCap) {
        GameState.player.level++;
        GameState.player.exp -= expCap;
        // 只增加基础属性（攻击、防御、血量）
        const classConfig = CLASSES[GameState.player.class];
        if (classConfig) {
            const growth = classConfig.growthStats;
            GameState.player.maxHp += growth.hp;
            GameState.player.hp = GameState.player.maxHp;
            GameState.player.atk += growth.atk;
            GameState.player.def += growth.def;
            // 不增加攻速、暴击、爆伤等百分比属性
        }
        addBattleLog(`升级! 等级提升至${GameState.player.level}`, 'success');

        // 检查是否触发5级奇遇BOSS
        if (GameState.player.level === 5) {
            addBattleLog('🎉 恭喜升到5级！触发奇遇BOSS！', 'event');
            triggerEventBoss();
        }

        checkLevelUp(); // 连续升级检查
    }
}

// 触发奇遇BOSS
function triggerEventBoss() {
    if (GameState.player.class === null) return; // 还没选职业
    if (GameState.battle.currentEnemy && GameState.battle.currentEnemy.type === 'eventBoss') return; // 已经有奇遇BOSS
    if (GameState.battle.isPaused) return; // 战斗已暂停

    const currentEnemy = GameState.battle.currentEnemy;
    if (currentEnemy && currentEnemy.type !== 'eventBoss') {
        // 保存当前怪物状态
        window._savedEnemyBeforeEvent = { ...currentEnemy };
    }

    // 生成奇遇BOSS
    const eventBoss = generateEnemy(GameState.currentArea, 'eventBoss');
    GameState.battle.currentEnemy = eventBoss;

    // 更新UI
    updateBattleStatus();
    addBattleLog('💀 奇遇BOSS降临！', 'event');
    triggerEventBossAnimation();
}

// 获取经验上限
// 1-24级使用原公式，25级之后每级需要上一级的1.3倍经验
function getExpCap(level) {
    if (level <= 24) {
        return Math.floor(100 * Math.pow(level, 1.5));
    } else {
        // 25级之后：24级经验 × 1.3^(level-24)
        const expAt24 = Math.floor(100 * Math.pow(24, 1.5));
        return Math.floor(expAt24 * Math.pow(1.3, level - 24));
    }
}

// 掉落物品（旧版本，保留兼容）
function rollDropsV1() {
    const enemy = GameState.battle.currentEnemy;

    // 奇遇BOSS特殊掉落
    if (enemy && enemy.type === 'eventBoss') {
        rollEventBossDrop();
        return;
    }

    let dropRates;
    let dropBonus = getDropBonus();

    if (GameState.battle.inDungeon) {
        if (GameState.battle.dungeonType === 'hell') {
            dropRates = DROP_RATES_HELL;
        } else {
            dropRates = DROP_RATES_ELITE;
        }
    } else {
        dropRates = DROP_RATES_NORMAL;
    }

    // 装备掉落
    if (Math.random() < dropRates.equip.base) {
        const quality = rollQuality(dropRates.equip.quality, dropBonus);

        // 计算装备等级：当前区域上下五级，但不能超过角色等级
        let equipLevel;
        if (GameState.battle.inDungeon) {
            // 副本中的装备等级：副本等级上下五级，但不能超过角色等级
            const dungeonLevel = GameState.battle.dungeonLevel;
            const minLevel = Math.max(1, dungeonLevel - 5);
            const maxLevel = Math.min(GameState.player.level, dungeonLevel + 4);
            equipLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
        } else {
            // 挂机区域的装备等级：当前区域上下五级，但不能超过角色等级
            const areaIndex = GameState.currentArea;
            const baseLevel = areaIndex * 5 + 1; // 当前区域起始等级
            const minLevel = Math.max(1, baseLevel - 5);
            const maxLevel = Math.min(GameState.player.level, baseLevel + 4);
            equipLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
        }

        const equip = generateEquipment(quality, equipLevel);
        addInventoryItem(equip);
        GameState.stats.itemsDropped++;
        addBattleLog(`获得装备: ${equip.qualityName} (${EQUIPMENT_SLOTS[equip.slot].name}) (Lv.${equipLevel})`, 'success');
    }

    // 技能掉落
    if (Math.random() < dropRates.skill.base) {
        const quality = rollQuality(dropRates.skill.quality, dropBonus);
        const skillBook = generateSkillBook(quality, GameState.player.class);
        addInventoryItem(skillBook);
        addBattleLog(`获得技能书: ${skillBook.name}`, 'success');
    }

    // 宝石掉落
    if (Math.random() < dropRates.gem.base) {
        const quality = rollQuality(dropRates.gem.quality, dropBonus);
        const gem = generateGem(quality);
        GameState.gemPool.push(gem);
        addBattleLog(`获得宝石: ${gem.name}`, 'success');
    }
}

// 随机品质
function rollQuality(qualityRates, dropBonus = 0) {
    for (let i = 0; i < qualityRates.length; i++) {
        let rate = qualityRates[i];
        if (i >= 3 && dropBonus > 1) {
            rate *= dropBonus;
        }
        if (Math.random() < rate) {
            return i;
        }
    }
    return 0;
}

// 独立随机
function rollDropsIndependent(rateList, bonusMul = 1, dropBonus = 0) {
    for (let i = 0; i < rateList.length; i++) {
        let rate = rateList[i];
        if (i >= 3) {
            rate *= bonusMul * dropBonus;
        }
        if (Math.random() < rate) {
            return i;
        }
    }
    return -1;
}

// 加权随机
function rollDropWeighted(rateList, dropBonus = 0) {
    const total = rateList.reduce((sum, rate, idx) => {
        let adjustedRate = rate;
        if (idx >= 3) {
            adjustedRate *= dropBonus;
        }
        return sum + adjustedRate;
    }, 0);

    let random = Math.random() * total;
    for (let i = 0; i < rateList.length; i++) {
        let rate = rateList[i];
        if (i >= 3) {
            rate *= dropBonus;
        }
        random -= rate;
        if (random <= 0) {
            return i;
        }
    }
    return 0;
}

// 奇遇BOSS掉落
function rollEventBossDrop() {
    // 使用奇遇BOSS专属爆率配置
    const equipQuality = rollDropsIndependent(
        EVENT_BOSS_CONFIG.dropRates,
        1.0,
        getDropBonus()
    );

    if (equipQuality >= 0) {
        // 计算装备等级：当前区域等级范围，不能超过角色等级
        const areaIndex = GameState.currentArea;
        const baseLevel = areaIndex * 5 + 1; // 当前区域起始等级，如：第0区Lv.1
        const areaMinLevel = baseLevel;
        const areaMaxLevel = baseLevel + 5; // 每个区域6级

        // 装备等级不能超过玩家等级
        const minLevel = Math.max(1, areaMinLevel);
        const maxLevel = Math.min(areaMaxLevel, GameState.player.level);

        // 随机选择等级
        const equipLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;

        const equip = generateEquipment(equipQuality, equipLevel);
        addInventoryItem(equip);
        addBattleLog(`奇遇BOSS掉落: ${equip.name} (Lv.${equipLevel})`, 'success');
    }
}

// ========== 装备系统 ==========

// 生成装备词缀
function generateAffixes(quality) {
    const config = QUALITY_AFFIX_CONFIG[quality];
    if (!config) return [];

    const affixKeys = Object.keys(AFFIXES);
    const affixCount = config.count;
    const selectedAffixes = [];
    const usedAffixKeys = new Set();

    // 随机选择词缀（不重复）
    let attempts = 0;
    while (selectedAffixes.length < affixCount && attempts < affixCount * 10) {
        attempts++;
        const affixKey = affixKeys[Math.floor(Math.random() * affixKeys.length)];
        const range = config[affixKey];

        // 跳过已使用的词缀和没有范围配置的词缀
        if (usedAffixKeys.has(affixKey) || !range) continue;

        const value = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        selectedAffixes.push({
            type: affixKey,
            value: value,
            name: AFFIXES[affixKey].name,
            icon: AFFIXES[affixKey].icon,
            isPercentage: AFFIXES[affixKey].type === 'percentage'
        });

        usedAffixKeys.add(affixKey);
    }

    return selectedAffixes;
}

// 生成装备
function generateEquipment(quality, customLevel = null) {
    const qualityConfig = EQUIPMENT_QUALITIES[quality];
    if (!qualityConfig) return null;

    const slotKeys = Object.keys(EQUIPMENT_SLOTS);
    const slotKey = slotKeys[Math.floor(Math.random() * slotKeys.length)];
    const slotConfig = EQUIPMENT_SLOTS[slotKey];

    // 装备名称直接使用品质名称
    const nameSuffix = qualityConfig.name;

    const affixes = generateAffixes(quality);

    // 计算基础属性
    const base = slotConfig.base;
    const growth = slotConfig.growth;
    const multiplier = qualityConfig.base;

    // 使用自定义等级或品质默认等级
    const itemLevel = customLevel !== null ? customLevel : qualityConfig.maxLevel;

    const item = {
        id: Date.now() + Math.random(),
        name: nameSuffix,
        slot: slotKey,
        quality: quality,
        qualityName: qualityConfig.name,
        color: qualityConfig.color,
        icon: slotConfig.icon,
        level: itemLevel,
        enhanceLevel: 0, // 强化等级，默认为0
        maxLevel: qualityConfig.maxLevel,
        locked: false,
        affixes: affixes,
        gems: (() => {
            // 宝石孔位：90%=1孔, 5%=2孔, 4%=3孔, 1%=4孔
            // 湮灭(12)和终焉(13)品质必定4孔
            let holeCount;
            if (quality >= 12) {
                holeCount = 4; // 无双/至臻必定4孔
            } else {
                const roll = Math.random() * 100;
                if (roll < 90) holeCount = 1;
                else if (roll < 95) holeCount = 2;
                else if (roll < 99) holeCount = 3;
                else holeCount = 4;
            }
            return new Array(holeCount).fill(null);
        })(),
        initialGems: undefined // 将在下方赋值
    };

    // 记录初始孔数（用于开孔上限判断：初始1/2/3孔最多开到4孔；初始4孔最多开到5孔）
    item.initialGems = item.gems.length;

    // 计算属性
    recalculateEquipmentStats(item);
    return item;
}

// 计算装备属性
function recalculateEquipmentStats(item) {
    const qualityConfig = EQUIPMENT_QUALITIES[item.quality];
    const slotConfig = EQUIPMENT_SLOTS[item.slot];
    const multiplier = qualityConfig.base;
    const levelBonus = 1 + (item.level * 0.05); // 装备等级每级+5%

    // 强化加成：每强化一级增加50%的基础属性（基于原始基础属性）
    const enhanceBonus = 1 + (item.enhanceLevel || 0) * 0.5; // 每强化一级+50%

    // 基础属性（数值属性）- 强化只增加基础属性（攻击、生命、防御）
    item.stats = {};
    for (const [key, value] of Object.entries(slotConfig.base)) {
        item.stats[key] = Math.floor(value * multiplier * levelBonus * enhanceBonus);
    }

    // 成长属性（数值属性）- 不受强化影响，但受品质倍率影响
    if (slotConfig.growth) {
        for (const [key, value] of Object.entries(slotConfig.growth)) {
            if (!item.stats[key]) item.stats[key] = 0;
            item.stats[key] += Math.floor(value * multiplier * item.level);
        }
    }

    // 词缀属性 - 百分比属性和数值属性分开处理
    // 百分比属性：atkSpd, crit, critDmg, vamp, penetrate, antiCrit, antiCritDmg, expBonus, goldBonus, maxAtk
    // 词缀属性不受强化影响
    const percentageAffixes = ['atkSpd', 'crit', 'critDmg', 'vamp', 'penetrate', 'antiCrit', 'antiCritDmg', 'expBonus', 'goldBonus', 'maxAtk'];
    for (const affix of item.affixes) {
        const key = affix.type;
        if (!item.stats[key]) item.stats[key] = 0;

        if (percentageAffixes.includes(key)) {
            // 百分比属性：直接添加百分比数值（如12%就是12）
            item.stats[key] += affix.value;
        } else {
            // 数值属性：需要乘以等级加成
            item.stats[key] += Math.floor(affix.value * levelBonus);
        }
    }

    // 宝石属性（宝石属性都是数值属性，直接加到对应属性）
    // 宝石属性不受强化影响
    if (item.gems) {
        for (const gem of item.gems) {
            if (gem) {
                recalculateGemStats(gem);
                for (const [key, value] of Object.entries(gem.stats || {})) {
                    if (!item.stats[key]) item.stats[key] = 0;
                    item.stats[key] += value;
                }
            }
        }
    }
}

// 计算装备评分
function calculateEquipmentScore(item) {
    if (!item || !item.stats) return 0;

    // 基础属性评分（占比40%）
    let baseScore = 0;
    // 攻击力权重最高
    if (item.stats.atk) baseScore += item.stats.atk * 3;
    // 生命值次之
    if (item.stats.hp) baseScore += item.stats.hp * 0.5;
    // 防御力
    if (item.stats.def) baseScore += item.stats.def * 1.5;
    // 攻速
    if (item.stats.atkSpd) baseScore += item.stats.atkSpd * 10;

    // 词缀属性评分（占比60%，大幅提高）
    let affixScore = 0;
    for (const affix of item.affixes) {
        // 暴击 - 高权重
        if (affix.type === 'crit') {
            affixScore += affix.value * 15;
        }
        // 爆伤 - 极高权重
        else if (affix.type === 'critDmg') {
            affixScore += affix.value * 5;
        }
        // 攻速 - 高权重
        else if (affix.type === 'atkSpd') {
            affixScore += affix.value * 20;
        }
        // 吸血 - 高权重
        else if (affix.type === 'vamp') {
            affixScore += affix.value * 100;
        }
        // 穿透 - 高权重
        else if (affix.type === 'penetrate') {
            affixScore += affix.value * 8;
        }
        // 抗暴 - 中等权重
        else if (affix.type === 'antiCrit') {
            affixScore += affix.value * 10;
        }
        // 抗爆伤 - 中等权重
        else if (affix.type === 'antiCritDmg') {
            affixScore += affix.value * 2;
        }
        // 经验加成 - 低权重
        else if (affix.type === 'expBonus') {
            affixScore += affix.value * 5;
        }
        // 金币加成 - 低权重
        else if (affix.type === 'goldBonus') {
            affixScore += affix.value * 5;
        }
        // 最大攻击力 - 高权重
        else if (affix.type === 'maxAtk') {
            affixScore += affix.value * 3;
        }
    }

    // 宝石评分（额外加成）
    let gemScore = 0;
    if (item.gems) {
        for (const gem of item.gems) {
            if (gem) {
                gemScore += gem.quality * 20; // 每个品质+20分
            }
        }
    }

    // 品质加成
    const qualityBonus = item.quality * 50;

    // 等级加成
    const levelBonus = item.level * 10;

    // 最终评分：基础40% + 词缀60% + 宝石 + 品质 + 等级
    const finalScore = Math.floor(baseScore * 0.4 + affixScore * 0.6 + gemScore + qualityBonus + levelBonus);

    return finalScore > 0 ? finalScore : 1;
}

// 添加背包物品
function addInventoryItem(item) {
    // 检查是否需要自动分解
    if (GameState.autoDismantle.equipment && (!item.type || item.type === 'equipment')) {
        const settings = GameState.dismantleSettings;
        if (settings.equipment[item.quality]) {
            // 跳过带锁装备，不自动分解
            if (item.locked) {
                // 带锁装备直接加入背包，不分解
            } else {
                // 检查是否比身上同槽位装备评分更高，更高则不分解
                const equippedItem = item.slot ? GameState.equipment[item.slot] : null;
                const itemScore = calculateEquipmentScore(item);
                const equippedScore = equippedItem ? calculateEquipmentScore(equippedItem) : 0;

                if (equippedItem && itemScore > equippedScore) {
                    // 比身上更强，不自动分解，加入背包
                } else {
                    // 自动分解，不加入背包
                    // 先把镶嵌的宝石归还到宝石背包
                    if (item.gems && item.gems.length > 0) {
                        for (let i = 0; i < item.gems.length; i++) {
                            const gem = item.gems[i];
                            if (gem) {
                                addGemToPool(gem);
                            }
                        }
                    }
                    const qualityName = item.qualityName || EQUIPMENT_QUALITIES[item.quality]?.name;
                    addBattleLog(`自动分解: ${item.name} (${qualityName})`, 'info');
                    GameState.stats.shards++;
                    // 按品质分类统计碎片
                    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
                    GameState.stats.qualityShards[item.quality] = (GameState.stats.qualityShards[item.quality] || 0) + 1;
                    GameState.stats.dismantleCount++;
                    refreshCurrentPage();
                    return;
                }
            }
        }
    } else if (GameState.autoDismantle.skill && item.type === 'skill') {
        const settings = GameState.dismantleSettings;
        if (settings.skill[item.quality]) {
            // 自动分解技能
            const qualityName = item.qualityName || SKILL_QUALITIES[item.quality]?.name;
            addBattleLog(`自动分解: ${item.name} (${qualityName})`, 'info');
            GameState.stats.shards++;
            // 技能碎片使用负数key，避免与装备碎片冲突
            const shardKey = -100 - item.quality;
            if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
            GameState.stats.qualityShards[shardKey] = (GameState.stats.qualityShards[shardKey] || 0) + 1;
            GameState.stats.dismantleCount++;
            refreshCurrentPage();
            return;
        }
    }

    // 不需要自动分解，加入背包
    // 检查背包装备上限（100）
    if (item.type === 'equipment' || !item.type) {
        const equipCount = GameState.inventory.filter(i => !i.type || i.type === 'equipment').length;
        if (equipCount >= 100) {
            showToast('背包装备已满（上限100件）');
            return;
        }
    }
    // 检查技能背包上限（50）
    if (item.type === 'skill') {
        const skillCount = GameState.inventory.filter(i => i.type === 'skill').length;
        if (skillCount >= 50) {
            showToast('技能背包已满（上限50个）');
            return;
        }
    }
    GameState.inventory.push(item);
    // 实时刷新当前页面（若正在查看背包/宝石/技能页则立即显示新物品）
    refreshCurrentPage();
}

// 装备物品
function equipItem(index) {
    const item = GameState.inventory[index];
    if (!item || item.type !== 'equipment') return;

    const slot = item.slot;
    const oldEquip = GameState.equipment[slot];

    if (oldEquip) {
        GameState.inventory.push(oldEquip);
    }

    GameState.equipment[slot] = item;
    GameState.inventory.splice(index, 1);

    // 刷新背包显示
    const currentFilter = document.querySelector('.filter-btn.active');
    const filterType = currentFilter ? currentFilter.dataset.type : 'all';
    renderInventory(filterType);

    // 刷新装备槽位显示
    updateEquippedSlotsDisplay();
    updateCharacterStats();
    refreshCurrentPage();

    showToast(`已装备 ${item.name}`);
}

// 刷新装备槽位显示
function updateEquippedSlotsDisplay() {
    const slots = ['weapon', 'helmet', 'armor', 'boots', 'ring', 'necklace'];
    slots.forEach(slot => {
        const equip = GameState.equipment[slot];
        const infoElement = document.getElementById(`${slot}Info`);
        if (infoElement) {
            if (equip) {
                // 生成属性列表
                let statsHtml = '';
                if (equip.stats) {
                    const statMap = {
                        atk: { name: '攻击', unit: '' },
                        hp: { name: '生命', unit: '' },
                        def: { name: '防御', unit: '' },
                        crit: { name: '暴击', unit: '%' },
                        critDmg: { name: '爆伤', unit: '%' },
                        atkSpd: { name: '攻速', unit: '%' },
                        vamp: { name: '吸血', unit: '%' },
                        penetrate: { name: '穿透', unit: '%' },
                        antiCrit: { name: '抗暴', unit: '%' },
                        antiCritDmg: { name: '抗爆伤', unit: '%' },
                        expBonus: { name: '经验加成', unit: '%' },
                        goldBonus: { name: '金币加成', unit: '%' }
                    };

                    // 显示前6个主要属性
                    let count = 0;
                    for (const [key, value] of Object.entries(equip.stats)) {
                        if (count >= 6) break;
                        if (value !== 0 && value !== null && statMap[key]) {
                            const statInfo = statMap[key];
                            statsHtml += `<div class="equipped-item-stat">${statInfo.name}: ${value}${statInfo.unit}</div>`;
                            count++;
                        }
                    }
                }

                // 生成词缀列表
                let affixHtml = '';
                if (equip.affixes && equip.affixes.length > 0) {
                    affixHtml = equip.affixes.map(affix =>
                        `<div class="equipped-item-affix">${affix.icon} ${affix.name}: ${affix.value}${affix.isPercentage ? '%' : ''}</div>`
                    ).join('');
                }

                infoElement.innerHTML = `
                    <div class="equipped-item-name" style="color: ${equip.color}">
                        ${equip.qualityName} ${(equip.enhanceLevel || 0) > 0 ? '+' + equip.enhanceLevel + ' ' : ''}${equip.name}
                    </div>
                    <div class="equipped-item-level">Lv.${equip.level} · ★${Math.floor(calculateEquipmentScore(equip))}</div>
                    <div class="equipped-item-stats">${statsHtml}</div>
                    ${affixHtml ? `<div class="equipped-item-affixes">${affixHtml}</div>` : ''}
                `;
            } else {
                infoElement.innerHTML = '';
            }
        }
    });
}

// 卸下装备
function unequipItem(slot) {
    const item = GameState.equipment[slot];
    if (!item) return;

    GameState.inventory.push(item);
    GameState.equipment[slot] = null;

    // 关闭装备详情弹窗
    closeModal('itemDetailModal');

    // 刷新背包显示
    const currentFilter = document.querySelector('.filter-btn.active');
    const filterType = currentFilter ? currentFilter.dataset.type : 'all';
    renderInventory(filterType);

    // 刷新装备槽位显示
    updateEquippedSlotsDisplay();
    updateCharacterStats();
    refreshCurrentPage();

    showToast(`已卸下 ${item.name}`);
}

// ========== 掉落系统 ==========

// 掉落逻辑（按品质独立爆率）
function rollDrops() {
    const enemy = GameState.battle.currentEnemy;
    if (!enemy) return;

    // 确定怪物类型
    let monsterType = 'normal';
    if (enemy.type === 'boss' || enemy.type === 'eventBoss') {
        monsterType = enemy.type;
    } else if (GameState.battle.inDungeon) {
        if (GameState.battle.dungeonType === 'elite') {
            monsterType = 'elite';
        } else if (GameState.battle.dungeonType === 'hell') {
            monsterType = 'hell';
        }
    }

    const dropBonus = 1 + getDropBonus();
    let droppedItems = [];

    // 装备掉落（保持原逻辑，百分百掉落）
    const equipChance = DROP_CONFIG.equipmentChance[monsterType] || DROP_CONFIG.equipmentChance.normal;
    if (Math.random() < equipChance) {
        // 根据怪物类型选择品质权重
        let qualityWeights;
        if (monsterType === 'eventBoss') {
            // 奇遇BOSS：使用EVENT_BOSS_CONFIG.dropRates（辉煌90%/神圣5%/永恒3%/深渊1.5%/混沌0.5%）
            qualityWeights = EVENT_BOSS_CONFIG.dropRates;
        } else if (monsterType === 'elite') {
            qualityWeights = QUALITY_DROP_WEIGHTS.elite;
        } else if (monsterType === 'hell') {
            qualityWeights = QUALITY_DROP_WEIGHTS.hell;
        } else {
            // 挂机区域的小怪和头目使用相同的权重
            qualityWeights = QUALITY_DROP_WEIGHTS.normal;
        }

        const quality = rollQualityByWeight(qualityWeights);

        // 计算装备等级
        let minLevel, maxLevel;
        if (GameState.battle.inDungeon) {
            // 副本：装备等级为当前副本等级上下5级，但不能超过玩家等级
            const dungeonLevel = GameState.battle.dungeonLevel;
            minLevel = Math.max(1, dungeonLevel - 5);
            maxLevel = Math.min(dungeonLevel + 5, GameState.player.level);
        } else {
            // 挂机区域：装备等级为当前区域等级范围（如新手平原1-6级），不能超过玩家等级
            const areaIndex = GameState.currentArea;
            const areaBaseLevel = areaIndex * 5 + 1; // 区域起始等级，如：第0区Lv.1，第1区Lv.6
            const areaMinLevel = areaBaseLevel;
            const areaMaxLevel = areaBaseLevel + 5; // 每个区域6级

            // 装备等级不能超过玩家等级
            minLevel = Math.max(areaMinLevel, 1);
            maxLevel = Math.min(areaMaxLevel, GameState.player.level);
        }

        // 确保minLevel <= maxLevel
        if (minLevel > maxLevel) {
            minLevel = Math.max(1, GameState.player.level - 5);
            maxLevel = GameState.player.level;
        }

        // 随机装备等级
        const equipLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;

        const equip = generateEquipment(quality, equipLevel);
        equip.type = 'equipment';
        droppedItems.push(equip);
        addInventoryItem(equip);
        addBattleLog(`获得装备: ${equip.qualityName} (${EQUIPMENT_SLOTS[equip.slot].name}) (Lv.${equipLevel})`, 'success');
    }

    // 宝石掉落（按品质独立爆率）
    const gemChanceList = DROP_CONFIG.gemChanceByQuality[monsterType] || DROP_CONFIG.gemChanceByQuality.normal;
    const QUALITY_NAMES = ['', '灰', '绿', '蓝', '紫', '橙'];
    for (let q = 0; q < gemChanceList.length; q++) {
        const chance = gemChanceList[q] * dropBonus;
        if (chance > 0 && Math.random() < chance) {
            const gem = generateGem(q);
            gem.type = 'gem';
            droppedItems.push(gem);
            addGemToPool(gem);
            addBattleLog(`获得宝石: ${gem.qualityName} ${gem.affixName}`, 'success');
            refreshCurrentPage();
            break; // 每种品质只掉一个
        }
    }

    // 技能书掉落（按品质独立爆率）
    const skillChanceList = DROP_CONFIG.skillChanceByQuality[monsterType] || DROP_CONFIG.skillChanceByQuality.normal;
    for (let q = 0; q < skillChanceList.length; q++) {
        const chance = skillChanceList[q] * dropBonus;
        if (chance > 0 && Math.random() < chance) {
            const classType = GameState.player.class;
            const skillBook = generateSkillBook(q, classType);
            skillBook.type = 'skill';
            droppedItems.push(skillBook);
            addInventoryItem(skillBook);
            addBattleLog(`获得技能书: ${skillBook.qualityName} ${skillBook.name}`, 'success');
            break; // 每种品质只掉一个
        }
    }

    // 挂机区域额外掉落：精英门票（7%基础概率，受爆率加成影响）
    if (monsterType === 'normal') {
        const ticketBaseChance = 0.07; // 7%基础概率
        if (Math.random() < ticketBaseChance * dropBonus) {
            GameState.player.tickets.elite += 1;
            addBattleLog(`🎟️ 掉落 1 张精英门票！`, 'success');
        }
    }

    // 精英副本额外掉落：地狱门票（10%基础概率，受爆率加成影响）
    if (monsterType === 'elite') {
        const hellTicketChance = 0.10; // 10%基础概率
        if (Math.random() < hellTicketChance * dropBonus) {
            let ticketCount = 1;
            const dungeonLevel = GameState.battle.dungeonLevel;
            
            if (dungeonLevel >= 25 && dungeonLevel <= 95) {
                // 25-95级：最多1张
                ticketCount = 1;
            } else if (dungeonLevel >= 105 && dungeonLevel <= 145) {
                // 105-145级：随机1-2张
                ticketCount = Math.floor(Math.random() * 2) + 1;
            } else if (dungeonLevel >= 155) {
                // 155级以上：随机2-3张
                ticketCount = Math.floor(Math.random() * 2) + 2;
            }
            
            GameState.player.tickets.hell += ticketCount;
            addBattleLog(`😈 掉落 ${ticketCount} 张地狱门票！`, 'success');
        }
    }

    return droppedItems;
}

// 计算装备评分（简化版，仅用于快速比较）
function calculateEquipmentScoreSimple(equip) {
    if (!equip || !equip.stats) return 0;

    let score = 0;
    const weights = {
        atk: 3,
        def: 2,
        hp: 1,
        atkSpd: 5,
        crit: 3,
        critDmg: 2,
        vamp: 3,
        penetrate: 4
    };

    for (const [key, value] of Object.entries(equip.stats)) {
        if (weights[key]) {
            score += value * weights[key];
        }
    }

    return score;
}

// 比较装备优劣
function isBetterEquipment(newEquip, oldEquip) {
    const newScore = calculateEquipmentScore(newEquip);
    const oldScore = calculateEquipmentScore(oldEquip);
    return newScore > oldScore;
}

// 增加装备孔位（50钻石/看广告）
function addEquipmentHole(index, useAds = false) {
    const item = GameState.inventory[index];
    if (!item || !item.gems) {
        showToast('装备不存在');
        return;
    }

    // 开孔上限：初始4孔（无双/至臻）可开至5孔；其他初始孔数最多开至4孔
    const initialGems = item.initialGems !== undefined ? item.initialGems : item.gems.length;
    const maxHoles = initialGems >= 4 ? 5 : 4;

    if (item.gems.length >= maxHoles) {
        showToast(`已达到最大孔位（${maxHoles}孔）`);
        return;
    }

    const DIAMOND_COST = 50;

    if (useAds) {
        // 通过统一广告接口观看广告
        AdSystem.watch(AdSystem.AD_TYPES.OPEN_HOLE, () => {
            item.gems.push(null);
            updateTopBar();
            renderInventory();
            showItemDetail(index);
            showToast('✅ 观看广告成功，孔位+1！');
        }, () => {
            showToast('广告未完成，开孔取消');
        });
        return;
    }

    // 消耗钻石
    if ((GameState.player.diamonds || 0) < DIAMOND_COST) {
        // 钻石不足，提示可以看广告
        showOpenHoleConfirm(index, true);
        return;
    }

    GameState.player.diamonds -= DIAMOND_COST;
    item.gems.push(null);
    updateTopBar();
    renderInventory();
    showItemDetail(index);
    showToast(`✅ 开孔成功！消耗${DIAMOND_COST}💎钻石`);
}

// 显示开孔确认弹窗
function showOpenHoleConfirm(index, diamondInsufficient = false) {
    const item = GameState.inventory[index];
    if (!item) return;
    const initialGems = item.initialGems !== undefined ? item.initialGems : item.gems.length;
    const maxHoles = initialGems >= 4 ? 5 : 4;
    if (item.gems.length >= maxHoles) {
        showToast(`已达到最大孔位（${maxHoles}孔）`);
        return;
    }
    const DIAMOND_COST = 50;
    const currentDiamond = GameState.player.diamonds || 0;
    const canAfford = currentDiamond >= DIAMOND_COST;

    // 有钻石：只提示花费钻石；钻石不足：才提示可看广告
    const msg = canAfford
        ? `花费 ${DIAMOND_COST}💎 钻石开孔？（100%成功）\n当前钻石: ${currentDiamond}`
        : `💎 钻石不足（当前: ${currentDiamond} / 需要: ${DIAMOND_COST}）\n可以观看广告免费开孔！`;

    const existingModal = document.getElementById('openHoleConfirmModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'openHoleConfirmModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:300px;text-align:center;">
            <div class="modal-header">
                <h2>开孔</h2>
                <button class="modal-close" onclick="document.getElementById('openHoleConfirmModal').remove()">✕</button>
            </div>
            <div class="modal-body">
                <p style="margin:12px 0;white-space:pre-line;font-size:14px;">${msg}</p>
                <div class="modal-actions" style="flex-direction:column;gap:8px;">
                    ${canAfford
                        ? `<button class="btn-action btn-enhance" style="width:100%" onclick="addEquipmentHole(${index},false);document.getElementById('openHoleConfirmModal').remove()">💎 花费${DIAMOND_COST}钻石开孔</button>`
                        : `<button class="btn-action btn-equip" style="width:100%;background:#e67e22" onclick="addEquipmentHole(${index},true);document.getElementById('openHoleConfirmModal').remove()">📺 看广告免费开孔</button>`
                    }
                    <button class="btn-action btn-dismantle" style="width:100%" onclick="document.getElementById('openHoleConfirmModal').remove()">取消</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 身上装备开孔（消耗钻石或看广告）
function addEquippedHole(slot, useAds = false) {
    const item = GameState.equipment[slot];
    if (!item || !item.gems) { showToast('装备不存在'); return; }

    const initialGems = item.initialGems !== undefined ? item.initialGems : item.gems.length;
    const maxHoles = initialGems >= 4 ? 5 : 4;
    if (item.gems.length >= maxHoles) { showToast(`已达到最大孔位（${maxHoles}孔）`); return; }

    const DIAMOND_COST = 50;

    if (useAds) {
        // 通过统一广告接口观看广告
        AdSystem.watch(AdSystem.AD_TYPES.OPEN_HOLE, () => {
            item.gems.push(null);
            updateCharacterStats();
            updateEquipmentSlots();
            showEquippedItemDetail(slot);
            showToast('✅ 观看广告成功，孔位+1！');
        }, () => {
            showToast('广告未完成，开孔取消');
        });
        return;
    }

    if ((GameState.player.diamonds || 0) < DIAMOND_COST) {
        showOpenHoleConfirmEquipped(slot, true);
        return;
    }

    GameState.player.diamonds -= DIAMOND_COST;
    item.gems.push(null);
    updateTopBar();
    updateCharacterStats();
    updateEquipmentSlots();
    showEquippedItemDetail(slot);
    showToast(`✅ 开孔成功！消耗${DIAMOND_COST}💎钻石`);
}

// 显示身上装备开孔确认弹窗
function showOpenHoleConfirmEquipped(slot, diamondInsufficient = false) {
    const item = GameState.equipment[slot];
    if (!item) return;
    const initialGems = item.initialGems !== undefined ? item.initialGems : item.gems.length;
    const maxHoles = initialGems >= 4 ? 5 : 4;
    if (item.gems.length >= maxHoles) { showToast(`已达到最大孔位（${maxHoles}孔）`); return; }

    const DIAMOND_COST = 50;
    const currentDiamond = GameState.player.diamonds || 0;
    const canAfford = currentDiamond >= DIAMOND_COST;

    // 有钻石：只提示花费钻石；钻石不足：才提示可看广告
    const msg = canAfford
        ? `花费 ${DIAMOND_COST}💎 钻石开孔？（100%成功）\n当前钻石: ${currentDiamond}`
        : `💎 钻石不足（当前: ${currentDiamond} / 需要: ${DIAMOND_COST}）\n可以观看广告免费开孔！`;

    const existingModal = document.getElementById('openHoleConfirmModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'openHoleConfirmModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:300px;text-align:center;">
            <div class="modal-header">
                <h2>开孔</h2>
                <button class="modal-close" onclick="document.getElementById('openHoleConfirmModal').remove()">✕</button>
            </div>
            <div class="modal-body">
                <p style="margin:12px 0;white-space:pre-line;font-size:14px;">${msg}</p>
                <div class="modal-actions" style="flex-direction:column;gap:8px;">
                    ${canAfford
                        ? `<button class="btn-action btn-enhance" style="width:100%" onclick="addEquippedHole('${slot}',false);document.getElementById('openHoleConfirmModal').remove()">💎 花费${DIAMOND_COST}钻石开孔</button>`
                        : `<button class="btn-action btn-equip" style="width:100%;background:#e67e22" onclick="addEquippedHole('${slot}',true);document.getElementById('openHoleConfirmModal').remove()">📺 看广告免费开孔</button>`
                    }
                    <button class="btn-action btn-dismantle" style="width:100%" onclick="document.getElementById('openHoleConfirmModal').remove()">取消</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 镶嵌宝石
function embedGem(equipIndex, slotIndex, gemPoolIndex) {
    const equip = GameState.inventory[equipIndex];
    if (!equip || !equip.gems) return;

    const gem = GameState.gemPool[gemPoolIndex];
    if (!gem) return;

    equip.gems[slotIndex] = gem;
    GameState.gemPool.splice(gemPoolIndex, 1);
    recalculateEquipmentStats(equip);
    renderInventory();
    renderGemList();
    showToast('镶嵌成功');
}

// 卸下宝石
function unequipGem(equipIndex, slotIndex, isEquipped) {
    let equip, gem;
    if (isEquipped) {
        equip = GameState.equipment[equipIndex];
        if (equip && equip.gems) {
            gem = equip.gems[slotIndex];
            equip.gems[slotIndex] = null;
        }
    } else {
        equip = GameState.inventory[equipIndex];
        if (equip && equip.gems) {
            gem = equip.gems[slotIndex];
            equip.gems[slotIndex] = null;
        }
    }

    if (gem) {
        addGemToPool(gem);
        recalculateEquipmentStats(equip);
        renderInventory();
        renderGemList();
        refreshCurrentPage();
        showToast('卸下成功');
    }
}

// 增加已装备物品孔位


// ========== 宝石系统 ==========

// 生成宝石（每个宝石必定含3个不重复词缀）
function generateGem(quality) {
    const qualityConfig = GEM_QUALITIES[quality];
    if (!qualityConfig) return null;

    const affixKeys = Object.keys(GEM_AFFIXES);
    const range = GEM_AFFIX_RANGES[quality];

    // 随机打乱词缀列表，取前3个（不重复）
    const shuffled = affixKeys.slice().sort(() => Math.random() - 0.5);
    const selectedKeys = shuffled.slice(0, 3);

    const affixes = selectedKeys.map(key => {
        const affixConfig = GEM_AFFIXES[key];
        const value = parseFloat(
            (Math.random() * (range[key][1] - range[key][0]) + range[key][0]).toFixed(
                affixConfig.type === 'percentage' ? 1 : 0
            )
        );
        return { key, name: affixConfig.name, icon: affixConfig.icon, type: affixConfig.type, value };
    });

    // 主词缀取第一个（用于命名）
    const mainAffix = affixes[0];

    return {
        id: Date.now() + Math.random(),
        name: `${mainAffix.name}宝石`,
        quality: quality,
        qualityName: qualityConfig.name,
        color: qualityConfig.color,
        // 兼容旧字段：保留主词缀信息
        affixType: mainAffix.key,
        affixName: mainAffix.name,
        affixIcon: mainAffix.icon,
        value: mainAffix.value,
        // 新字段：完整3词缀列表
        affixes: affixes,
        level: 0,
        maxLevel: 15,
        locked: false
    };
}

// 生成宝石到仓库
function generateGemForPool() {
    // 随机品质
    const quality = getRandomQualityByProbability();

    const gem = generateGem(quality);
    addGemToPool(gem);
    return gem;
}

// 计算宝石属性（支持3词缀）
function recalculateGemStats(gem) {
    const levelBonus = 1 + gem.level * 0.1;
    gem.stats = {};

    // 新格式：affixes 数组
    if (gem.affixes && gem.affixes.length > 0) {
        gem.affixes.forEach(affix => {
            const boostedValue = affix.value * levelBonus;
            gem.stats[affix.key] = affix.type === 'percentage'
                ? parseFloat(boostedValue.toFixed(1))
                : Math.floor(boostedValue);
        });
    } else {
        // 兼容旧格式（单词缀）
        const affixConfig = GEM_AFFIXES[gem.affixType];
        let value = gem.value * levelBonus;
        gem.stats[gem.affixType] = (affixConfig && affixConfig.type === 'percentage')
            ? parseFloat(value.toFixed(1))
            : Math.floor(value);
    }
}

// 普通宝石掉落
function rollGemNormal(dropBonus = 0) {
    const quality = rollQuality([0.6, 0.2, 0.15, 0.05, 0], dropBonus);
    return generateGem(quality);
}

// 添加宝石到仓库（检查上限50）
function addGemToPool(gem) {
    // 检查是否需要自动分解
    if (GameState.autoDismantle.gem) {
        const settings = GameState.dismantleSettings;
        if (settings.gem[gem.quality]) {
            // 自动分解宝石
            const gemQualityName = gem.qualityName || GEM_QUALITIES[gem.quality]?.name;
            addBattleLog(`自动分解: ${gem.name} (${gemQualityName})`, 'info');
            GameState.stats.shards++;
            // 宝石碎片使用负数key，避免与装备碎片冲突
            const shardKey = -200 - gem.quality;
            if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
            GameState.stats.qualityShards[shardKey] = (GameState.stats.qualityShards[shardKey] || 0) + 1;
            GameState.stats.dismantleCount++;
            refreshCurrentPage();
            return false;
        }
    }
    
    if (GameState.gemPool.length >= 50) {
        showToast('宝石仓库已满（上限50颗）');
        return false;
    }
    GameState.gemPool.push(gem);
    return true;
}

// ========== 技能系统 ==========

// 生成技能书
function generateSkillBook(quality, classType) {
    const qualityConfig = SKILL_QUALITIES[quality];
    if (!qualityConfig) return null;

    let pool;
    if (classType && SKILL_POOL[classType]) {
        pool = SKILL_POOL[classType];
    } else {
        pool = SKILL_POOL.common;
    }

    const skillTemplate = pool[Math.floor(Math.random() * pool.length)];

    return {
        id: Date.now() + Math.random(),
        type: 'skill',
        name: skillTemplate.name,
        quality: quality,
        qualityName: qualityConfig.name,
        color: qualityConfig.color,
        icon: skillTemplate.icon,
        skillName: skillTemplate.name,
        cooldown: skillTemplate.cooldown,
        damage: skillTemplate.damage,
        multiplier: qualityConfig.multiplier,
        level: 0,
        maxLevel: 15,
        locked: false
    };
}

// 装备技能
function equipSkill(index) {
    const skill = GameState.inventory[index];
    if (!skill || skill.type !== 'skill') return;

    // 检查技能是否与当前职业匹配
    if (skill.class && skill.class !== GameState.player.class) {
        showToast('无法装备非本职业技能');
        return;
    }

    // 检查是否已装备同名技能
    const existingSlot = GameState.skills.findIndex(s => s && s.skillName === skill.skillName);
    if (existingSlot !== -1) {
        const existingSkill = GameState.skills[existingSlot];
        if (existingSkill.quality >= skill.quality) {
            showToast('已有更高或相同品质的该技能');
            return;
        }
        // 自动替换
        GameState.inventory.push(existingSkill);
        GameState.skills[existingSlot] = skill;
        GameState.inventory.splice(index, 1);
        renderSkillSlots();
        renderSkillPool();
        refreshCurrentPage();
        showToast(`已替换为更高品质的 ${skill.name}`);
        return;
    }

    // 找空槽位
    const emptySlot = GameState.skills.findIndex(s => s === null);
    if (emptySlot === -1) {
        showToast('技能槽已满');
        return;
    }

    GameState.skills[emptySlot] = skill;
    GameState.inventory.splice(index, 1);

    renderSkillSlots();
    renderSkillPool();
    refreshCurrentPage();
    showToast(`已学习 ${skill.name}`);
}

// 使用技能书
function useSkillBook(index) {
    const skillBook = GameState.inventory[index];
    if (!skillBook || skillBook.type !== 'skill') return;

    // 检查技能是否与当前职业匹配
    if (skillBook.class && skillBook.class !== GameState.player.class) {
        showToast('无法使用非本职业技能书');
        return;
    }

    // 检查是否已装备同名技能
    const existingSlot = GameState.skills.findIndex(s => s && s.skillName === skillBook.skillName);
    if (existingSlot !== -1) {
        const existingSkill = GameState.skills[existingSlot];
        if (existingSkill.quality >= skillBook.quality) {
            showToast('已有更高或相同品质的该技能');
            return;
        }
        // 自动替换
        GameState.inventory.push(existingSkill);
        GameState.skills[existingSlot] = skillBook;
        GameState.inventory.splice(index, 1);
        renderSkillSlots();
        renderSkillPool();
        showToast(`已替换为更高品质的${skillBook.name}`);
        return;
    }

    equipSkill(index);
}

// 卸下技能
function unequipSkill(slotIndex) {
    const skill = GameState.skills[slotIndex];
    if (!skill) return;

    GameState.inventory.push(skill);
    GameState.skills[slotIndex] = null;

    renderSkillSlots();
    renderSkillPool();
    refreshCurrentPage();
    showToast(`已卸下 ${skill.name}`);
}

// 强化技能
function enhanceSkill(index) {
    const skill = GameState.inventory[index];
    if (!skill || skill.type !== 'skill') return;

    if (skill.level >= skill.maxLevel) {
        showToast('已达到最大等级');
        return;
    }

    // 计算强化所需材料（碎片+金币×10）
    const requiredShards = getRequiredShardsForEnhance(skill.level);
    const cost = (skill.level * 100 + 100) * 10; // 金币消耗×10
    const qualityName = SKILL_QUALITIES[skill.quality]?.name || '技能';

    // 检查技能碎片是否足够（使用对应品质的碎片）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const skillQualityKey = -100 - skill.quality;
    const skillShards = GameState.stats.qualityShards[skillQualityKey] || 0;
    if (skillShards < requiredShards) {
        showToast(`${qualityName}碎片不足！需要${requiredShards}个，当前${skillShards}个`);
        return;
    }

    // 检查金币是否足够
    if (GameState.player.gold < cost) {
        showToast('金币不足');
        return;
    }

    // 扣除对应品质的技能碎片和金币
    GameState.stats.qualityShards[skillQualityKey] -= requiredShards;
    GameState.player.gold -= cost;

    // 计算强化成功率（基础成功率 + 称号加成）
    const titleBonus = getTitleBonus();
    const baseSuccessRate = ENHANCE_SUCCESS_RATE[Math.min(skill.level, ENHANCE_SUCCESS_RATE.length - 1)];
    const successRate = Math.min(100, baseSuccessRate + titleBonus.enhanceBonus * 100);

    if (Math.random() * 100 < successRate) {
        skill.level++;
        showToast(`${qualityName}强化成功! 等级: ${skill.level} (消耗${requiredShards}${qualityName}碎片)`);
    } else {
        // 强化失败：检查是否有技能保护卷
        if (GameState.consumables && GameState.consumables.skillProtect > 0) {
            GameState.consumables.skillProtect--;
            if (skill.level > 0) skill.level--;
            showToast('强化失败！保护卷生效，等级-1');
        } else {
            // 无保护卷：技能消失
            const skillName = skill.name;
            const skillIdx = GameState.skillPool.indexOf(skill);
            if (skillIdx !== -1) GameState.skillPool.splice(skillIdx, 1);
            showToast(`强化失败！${skillName}消失了`);
        }
    }

    renderSkillPool();
    updateTopBar();
    refreshCurrentPage();
}

// 强化已装备技能
function enhanceEquippedSkill(slotIndex) {
    const skill = GameState.skills[slotIndex];
    if (!skill) return;

    if (skill.level >= skill.maxLevel) {
        showToast('已达到最大等级');
        return;
    }

    // 计算强化所需材料（碎片+金币×10）
    const requiredShards = getRequiredShardsForEnhance(skill.level);
    const cost = (skill.level * 100 + 100) * 10; // 金币消耗×10
    const qualityName = SKILL_QUALITIES[skill.quality]?.name || '技能';

    // 检查技能碎片是否足够（使用对应品质的碎片）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const skillQualityKey = -100 - skill.quality;
    const skillShards = GameState.stats.qualityShards[skillQualityKey] || 0;
    if (skillShards < requiredShards) {
        showToast(`${qualityName}碎片不足！需要${requiredShards}个，当前${skillShards}个`);
        return;
    }

    // 检查金币是否足够
    if (GameState.player.gold < cost) {
        showToast('金币不足');
        return;
    }

    // 扣除对应品质的技能碎片和金币
    GameState.stats.qualityShards[skillQualityKey] -= requiredShards;
    GameState.player.gold -= cost;

    // 计算强化成功率（基础成功率 + 称号加成）
    const titleBonus = getTitleBonus();
    const baseSuccessRate = ENHANCE_SUCCESS_RATE[Math.min(skill.level, ENHANCE_SUCCESS_RATE.length - 1)];
    const successRate = Math.min(100, baseSuccessRate + titleBonus.enhanceBonus * 100);

    if (Math.random() * 100 < successRate) {
        skill.level++;
        showToast(`${qualityName}强化成功! 等级: ${skill.level} (消耗${requiredShards}${qualityName}碎片)`);
    } else {
        // 强化失败：检查是否有技能保护卷
        if (GameState.consumables && GameState.consumables.skillProtect > 0) {
            GameState.consumables.skillProtect--;
            if (skill.level > 0) skill.level--;
            showToast('强化失败！保护卷生效，等级-1');
        } else {
            // 无保护卷：已装备技能清空
            const skillName = skill.name;
            GameState.skills[slotIndex] = null;
            showToast(`强化失败！${skillName}消失了`);
        }
    }

    renderSkillSlots();
    updateTopBar();
    refreshCurrentPage();
}

// 获取技能模板
function getSkillTemplate(skillName) {
    for (const classType of ['warrior', 'mage', 'assassin']) {
        const pool = SKILL_POOL[classType];
        const skill = pool.find(s => s.name === skillName);
        if (skill) return skill;
    }
    const skill = SKILL_POOL.common.find(s => s.name === skillName);
    return skill;
}

// ========== VIP系统 ==========

// 生成玩家ID


// 解析玩家ID
function parsePlayerId(playerId) {
    const digits = parseInt(playerId.substring(0, 5));
    const letters = playerId.substring(5, 10);
    return { digits, letters };
}

// 激活VIP特权
function activateVipPrivilege(level) {
    if (GameState.player.vipLevel >= level) {
        showToast('已激活该VIP等级');
        return;
    }
    GameState.player.vipLevel = level;
    if (!GameState.player.privileges) {
        GameState.player.privileges = { ticketPriv: false, rareEquipPriv: false };
    }
    saveGame();
    showToast(`🌟 VIP${level} 特权已激活！`);
    updateTopBar();
}

// 激活特殊特权（门票/稀有装备）
function activateSpecialPrivilege(type) {
    if (!GameState.player.privileges) {
        GameState.player.privileges = { ticketPriv: false, rareEquipPriv: false };
    }
    GameState.player.privileges[type] = true;
    saveGame();
}

// -------- VIP加成查询 --------

// VIP经验/金币/爆率加成倍率
function getVipExpBonus() {
    const v = GameState.player.vipLevel;
    if (v >= 3) return 1.5;
    if (v === 2) return 1.3;
    if (v === 1) return 1.1;
    return 1.0;
}

// VIP金币加成（与经验相同）
function getVipGoldBonus() { return getVipExpBonus(); }

// VIP奇遇BOSS概率加成倍率
function getVipEncounterBonus() {
    const v = GameState.player.vipLevel;
    if (v >= 3) return 5.0;
    if (v === 2) return 2.0;
    return 1.0;
}

// VIP爆率加成（同经验）
function getVipDropBonus() { return getVipExpBonus(); }

// 获取门票副本爆率倍率（门票特权激活后翻倍）
function getTicketDropBonus() {
    if (GameState.player.privileges && GameState.player.privileges.ticketPriv) return 2.0;
    return 1.0;
}

// 获取稀有装备掉落加成（稀有装备特权激活后永恒及以上×3）
function getRareEquipDropBonus() {
    if (GameState.player.privileges && GameState.player.privileges.rareEquipPriv) return 3.0;
    return 1.0;
}

// 经验上限倍率
function getExpCapMultiplier() {
    const v = GameState.player.vipLevel;
    if (v >= 3) return 2.5;
    if (v === 2) return 2.0;
    return 1.5;
}

// VIP每日免费钻石数量
function getVipDailyDiamonds() {
    const v = GameState.player.vipLevel;
    if (v >= 3) return 2000;
    if (v === 2) return 500;
    return 0;
}

// VIP免广告次数加成
function getVipAdFreeBonus() {
    return 0; // 所有VIP等级都遵循每日广告次数限制
}

// 获取有效广告次数限制
function getEffectiveAdLimit(baseLimit) {
    return baseLimit + getVipAdFreeBonus();
}

// 检查广告次数是否耗尽
function checkAdLimit(baseLimit, currentCount) {
    return currentCount >= getEffectiveAdLimit(baseLimit);
}

// -------- 广告累计计数 → 自动升VIP --------
function checkAutoVipUpgrade() {
    const total = GameState.player.totalAdsWatched || 0;
    const v = GameState.player.vipLevel;
    if (v < 1 && total >= 10) {
        GameState.player.vipLevel = 1;
        if (!GameState.player.privileges) GameState.player.privileges = { ticketPriv: false, rareEquipPriv: false };
        saveGame(); updateTopBar();
        showToast('🎉 恭喜！累计看广告10次，自动升级 VIP1！');
    } else if (v < 2 && total >= 200) {
        GameState.player.vipLevel = 2;
        saveGame(); updateTopBar();
        showToast('🎉 恭喜！累计看广告200次，自动升级 VIP2！');
    } else if (v < 3 && total >= 1000) {
        GameState.player.vipLevel = 3;
        saveGame(); updateTopBar();
        showToast('🎉 恭喜！累计看广告1000次，自动升级 VIP3！');
    }
}

// VIP每日自动发放钻石（每次进入游戏时调用）
function claimVipDailyDiamonds() {
    const reward = getVipDailyDiamonds();
    if (reward <= 0) return;
    const n = new Date();
    const todayKey = `${n.getFullYear()}-${n.getMonth()+1}-${n.getDate()}`;
    if (GameState.player.vipDailyDiamondClaimed === todayKey) return;
    GameState.player.vipDailyDiamondClaimed = todayKey;
    GameState.player.diamonds += reward;
    saveGame(); updateTopBar();
    showToast(`💎 VIP${GameState.player.vipLevel} 每日钻石 +${reward} 已自动发放`);
}



// ========== 辅助函数 ==========

// 获取经验加成
function getExpBonusExtra() {
    let bonus = getVipExpBonus();

    // 检查经验药水
    if (GameState.player.expPotionEndTime > Date.now()) {
        bonus *= 1.5; // 经验药水+50%
    }

    return bonus;
}

// 检查经验药水状态
function checkExpPotionStatus() {
    if (GameState.player.expPotionEndTime > 0 && GameState.player.expPotionEndTime <= Date.now()) {
        GameState.player.expPotionEndTime = 0;
        showToast('经验药水效果已结束');
    }
}

// 获取爆率加成（乘数，用于宝石/技能掉落概率）
// 稀有装备特权在 rollQualityByWeight 中单独生效
function getDropBonus() {
    let bonus = 1.0;

    // VIP爆率加成（+10%/+30%/+50%）
    bonus *= getVipDropBonus();

    // 称号爆率加成
    const titleBonus = getTitleBonus();
    bonus += titleBonus.dropBonus;

    // 门票特权：副本内爆率翻倍
    if (GameState.battle.inDungeon) {
        bonus *= getTicketDropBonus();
    }

    // 爆率药水（翻倍）
    if (GameState.player.dropPotionEndTime > Date.now()) {
        bonus *= 2.0;
    }

    return bonus;
}


// 检查爆率药水状态
function checkDropPotionStatus() {
    if (GameState.player.dropPotionEndTime > 0 && GameState.player.dropPotionEndTime <= Date.now()) {
        GameState.player.dropPotionEndTime = 0;
        showToast('爆率药水效果已结束');
    }
}

// 格式化数字
function formatNumber(num) {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(2) + '亿';
    }
    if (num >= 10000) {
        return (num / 10000).toFixed(2) + '万';
    }
    return num.toString();
}

// 格式化游戏时长
function formatPlayTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}小时${m}分`;
    if (m > 0) return `${m}分${s}秒`;
    return `${s}秒`;
}

// ============================================================
// 通用广告确认弹窗
// title    - 商品名称
// message  - 提示文字（如"钻石不足，是否看广告免费获得？"）
// adType   - AdSystem 广告位标识
// onReward - 广告看完后的回调（发放奖励）
// ============================================================
function showAdConfirm(title, message, adType, onReward) {
    // 移除已有弹窗
    const existing = document.getElementById('adConfirmModal');
    if (existing) existing.remove();

    const isVip3 = GameState.player.vipLevel >= 3;
    const remaining = AdSystem.getRemainingCount(adType);
    const adDisabled = remaining <= 0;

    const modal = document.createElement('div');
    modal.id = 'adConfirmModal';
    modal.className = 'ad-confirm-overlay';
    modal.innerHTML = `
        <div class="ad-confirm-box">
            <div class="ad-confirm-title">📺 ${title}</div>
            <div class="ad-confirm-msg">${message}</div>
            ${adDisabled
                ? `<div class="ad-confirm-limit">今日广告次数已达上限</div>`
                : `<div class="ad-confirm-remain">今日剩余次数：${remaining} 次</div>`
            }
            <div class="ad-confirm-btns">
                ${adDisabled
                    ? `<button class="ad-confirm-btn ad-confirm-btn-disabled" disabled>今日已达上限</button>`
                    : `<button class="ad-confirm-btn ad-confirm-btn-watch" id="adConfirmWatchBtn">📺 看广告</button>`
                }
                <button class="ad-confirm-btn ad-confirm-btn-cancel" id="adConfirmCancelBtn">取消</button>
            </div>
        </div>`;

    document.body.appendChild(modal);

    // 使用事件委托处理点击事件，避免内存泄漏
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // 点击遮罩关闭
            modal.remove();
        } else if (e.target.id === 'adConfirmCancelBtn') {
            // 取消按钮
            modal.remove();
        } else if (e.target.id === 'adConfirmWatchBtn' && !adDisabled) {
            // 看广告按钮
            modal.remove();
            AdSystem.watch(adType, onReward);
        }
    });
}

// 显示Toast提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 添加奇遇BOSS动画样式
function initEventBossAnimationStyles() {
    // 检查是否已经添加过样式
    if (document.getElementById('eventBossStyles')) return;

    const style = document.createElement('style');
    style.id = 'eventBossStyles';
    style.textContent = `
        /* 全屏闪光动画 */
        @keyframes eventBossFlash {
            0% {
                opacity: 0;
                background: rgba(255, 215, 0, 0);
            }
            20% {
                opacity: 1;
                background: radial-gradient(circle at center, rgba(255, 215, 0, 0.8), rgba(255, 165, 0, 0.4));
            }
            40% {
                opacity: 1;
                background: radial-gradient(circle at center, rgba(255, 215, 0, 0.6), rgba(255, 165, 0, 0.3));
            }
            60% {
                opacity: 1;
                background: radial-gradient(circle at center, rgba(255, 215, 0, 0.4), rgba(255, 165, 0, 0.2));
            }
            80% {
                opacity: 0.5;
                background: radial-gradient(circle at center, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
            }
            100% {
                opacity: 0;
                background: rgba(255, 215, 0, 0);
            }
        }

        .event-boss-flash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            animation: eventBossFlash 5s ease-in-out forwards;
        }

        /* 飘落物品动画 */
        @keyframes fallDown {
            0% {
                transform: translateY(-50px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(110vh) rotate(360deg);
                opacity: 0.7;
            }
        }

        .falling-item {
            position: fixed;
            top: -50px;
            pointer-events: none;
            z-index: 9998;
            font-size: 32px;
            animation: fallDown 5s linear forwards;
        }

        .falling-gold {
            color: #FFD700;
            text-shadow: 0 0 10px #FFA500;
        }

        .falling-redpacket {
            color: #DC143C;
            text-shadow: 0 0 10px #FF6347;
        }

        /* 奇遇BOSS提示文字 */
        .event-boss-text {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 0 0 20px #FFA500, 0 0 40px #FF6347;
            pointer-events: none;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out forwards;
        }

        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
    `;

    document.head.appendChild(style);
}

// 摸鱼模式切换
function toggleFishMode() {
    GameState.fishMode = !GameState.fishMode;
    
    if (GameState.fishMode) {
        document.body.classList.add('fish-mode');
        showToast('🐟 摸鱼模式已开启 - 所有画面已切换为黑白主调');
    } else {
        document.body.classList.remove('fish-mode');
        showToast('🌈 摸鱼模式已关闭 - 画面已恢复彩色');
    }
    
    saveGame();
}

// 初始化游戏
function initGame() {
    // 初始化游戏状态
    loadGame();
    
    // 初始化奇遇BOSS动画样式
    initEventBossAnimationStyles();
    
    // 其他初始化逻辑...
}

// 触发奇遇BOSS动画
function triggerEventBossAnimation() {
    // 初始化样式
    initEventBossAnimationStyles();

    // 创建全屏闪光
    const flash = document.createElement('div');
    flash.className = 'event-boss-flash';
    document.body.appendChild(flash);

    // 创建奇遇BOSS提示文字
    const text = document.createElement('div');
    text.className = 'event-boss-text';
    text.textContent = '奇遇BOSS降临！';
    document.body.appendChild(text);

    // 生成飘落的金元宝和红包
    const items = ['💰', '🧧'];
    const totalItems = 50; // 总共生成50个物品

    for (let i = 0; i < totalItems; i++) {
        setTimeout(() => {
            const item = document.createElement('div');
            const itemType = items[Math.floor(Math.random() * items.length)];
            const isGold = itemType === '💰';
            
            item.className = `falling-item ${isGold ? 'falling-gold' : 'falling-redpacket'}`;
            item.textContent = itemType;
            
            // 随机水平位置
            item.style.left = `${Math.random() * 100}vw`;
            
            // 随机动画持续时间（4-6秒之间）
            const duration = 4 + Math.random() * 2;
            item.style.animationDuration = `${duration}s`;
            
            // 随机大小（24-40px之间）
            const size = 24 + Math.random() * 16;
            item.style.fontSize = `${size}px`;
            
            document.body.appendChild(item);

            // 动画结束后移除元素
            setTimeout(() => {
                if (item.parentNode) {
                    item.parentNode.removeChild(item);
                }
            }, duration * 1000);
        }, i * 100); // 每100ms生成一个物品
    }

    // 5秒后移除闪光和文字
    setTimeout(() => {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
        if (text.parentNode) text.parentNode.removeChild(text);
    }, 5000);
}

// 添加战斗日志
// 添加战斗日志
function addBattleLog(message, type = 'normal') {
    const battleLog = document.getElementById('battleLog');
    if (!battleLog) return;

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = message;

    battleLog.appendChild(logEntry);

    // 只保留最近50条日志
    while (battleLog.children.length > 50) {
        battleLog.removeChild(battleLog.firstChild);
    }

    // 滚动到底部
    battleLog.scrollTop = battleLog.scrollHeight;
}

// 渲染商店
function renderShop() {
    renderShopGoldTab();
    renderShopItemTab();
}

// ============================================================
// 渲染金币商店（Tab: goldShopTab）
// 始终只显示"购买"按钮，点击后材料不足才弹出广告购买
// ============================================================
function renderShopGoldTab() {
    const container = document.getElementById('goldShopTab');
    if (!container) return;

    const COST = 1000000;

    function shopItemHtml(icon, title, desc, buyFn) {
        return `
        <div class="shop-item">
            <div class="item-info">
                <h3>${icon} ${title}</h3>
                <p>${desc}</p>
            </div>
            <button class="btn-buy" onclick="${buyFn}">
                购买<div class="price">${(COST/10000).toFixed(0)}万 💰</div>
            </button>
        </div>`;
    }

    // 广告领金币：专属显示，展示今日剩余次数（VIP3无限免广告）
    const isVip3 = GameState.player.vipLevel >= 3;
    const goldAdRemaining = AdSystem.getRemainingCount(AdSystem.AD_TYPES.SHOP_GOLD);
    const goldAdDisabled  = goldAdRemaining <= 0;
    const goldAdHtml = `
        <div class="shop-item">
            <div class="item-info">
                <h3>💰 免费金币</h3>
                <p>看广告免费获得 <strong>100万金币</strong>，每日最多10次</p>
            </div>
            <button class="btn-buy btn-buy-ad${goldAdDisabled ? ' btn-buy-ad-limit' : ''}"
                onclick="${goldAdDisabled ? '' : 'buyGoldByAd()'}"
                ${goldAdDisabled ? 'disabled' : ''}>
                📺 看广告<div class="price ad-remain">${goldAdDisabled ? '今日已达上限' : (isVip3 ? '无限 ♾️' : `剩余${goldAdRemaining}次`)}</div>
            </button>
        </div>`;

    container.innerHTML =
        goldAdHtml +
        shopItemHtml('🎲', '随机技能', '花费100万金币随机获得一本技能书', 'buyRandomSkill()') +
        shopItemHtml('💎', '随机宝石', '花费100万金币随机获得一颗宝石', 'buyRandomGem()') +
        `
        <div class="shop-item">
            <div class="item-info">
                <h3>📺 转换职业</h3>
                <p>看广告免费转换职业，非本职业技能将自动卸下</p>
            </div>
            <button class="btn-buy btn-buy-ad" onclick="changeClassByAd()">
                📺 看广告<div class="price">免费</div>
            </button>
        </div>`;
}

// ============================================================
// 渲染道具商店（Tab: itemShopTab）
// 始终只显示"购买"按钮，点击后材料不足才弹出广告购买
// ============================================================
function renderShopItemTab() {
    const container = document.getElementById('itemShopTab');
    if (!container) return;

    const items = [
        { icon:'🛡️', title:'装备保护卷', desc:'强化失败时等级-1（不消失），对所有强化等级生效', cost:100, fn:'buyConsumable(\'equipProtect\')', key:'equipProtect' },
        { icon:'💎', title:'宝石保护卷', desc:'宝石合成失败时等级-1（不消失），不提高成功率', cost:100, fn:'buyConsumable(\'gemProtect\')', key:'gemProtect' },
        { icon:'📜', title:'技能保护卷', desc:'技能升级失败时等级-1（不消失），不提高成功率', cost:100, fn:'buyConsumable(\'skillProtect\')', key:'skillProtect' },
        { icon:'⚗️', title:'经验药水', desc:'2小时内经验+50%，可突破人物经验上限50%', cost:100, fn:'buyConsumable(\'expPotion\')' },
        { icon:'🍀', title:'爆率药水', desc:'5分钟内增加人物爆率50%', cost:150, fn:'buyConsumable(\'dropPotion\')' },
        { icon:'🎟️', title:'精英门票', desc:'进入精英副本的门票，一次购买300张', cost:100, fn:'buyConsumable(\'eliteTicket\')' },
    ];

    let html = '';
    for (const item of items) {
        // 保护卷显示拥有数量
        let ownedText = '';
        if (item.key && GameState.consumables && GameState.consumables[item.key] !== undefined) {
            ownedText = ` <span style="color:#4CAF50">(${GameState.consumables[item.key]}张)</span>`;
        }
        html += `
        <div class="shop-item">
            <div class="item-info">
                <h3>${item.icon} ${item.title}${ownedText}</h3>
                <p>${item.desc}</p>
            </div>
            <button class="btn-buy" onclick="${item.fn}">
                购买<div class="price">${item.cost} 💎</div>
            </button>
        </div>`;
    }
    container.innerHTML = html;
}

// 渲染更多页面
function renderMorePage() {
    // 更多页面内容
}

// 显示浮动伤害数字
function showFloatingText(damage, isCrit) {
    const container = document.getElementById('battleArea');
    if (!container) return;

    const text = document.createElement('div');
    text.className = 'floating-damage' + (isCrit ? ' crit' : '');
    text.textContent = damage;

    // 固定在怪物血条中间位置（居中）
    text.style.left = '50%';
    text.style.top = '50%';
    text.style.transform = 'translateX(-50%) translateY(-50%)';

    container.appendChild(text);

    setTimeout(() => {
        text.style.opacity = '1';
        text.style.transform = 'translateX(-50%) translateY(-80px)';
    }, 10);

    setTimeout(() => {
        text.style.opacity = '0';
        setTimeout(() => {
            if (container.contains(text)) {
                container.removeChild(text);
            }
        }, 300);
    }, 1000);
}

// ============================================================
// 广告系统接口层（AdSystem）
// 所有需要看广告的功能都必须通过 AdSystem.watch() 调用
// 接入真实广告 SDK 时，只需修改 AdSystem._showRealAd 即可
// ============================================================
const AdSystem = {
    // ---------------------------------------------------------
    // 广告位标识（新增广告功能时在此注册）
    // ---------------------------------------------------------
    AD_TYPES: {
        OPEN_HOLE:         'open_hole',         // 装备开孔（钻石不足时）
        SHOP_SKILL:        'shop_skill',         // 金币商店-随机技能（金币不足时）
        SHOP_GEM:          'shop_gem',           // 金币商店-随机宝石（金币不足时）
        SHOP_EQUIP_PROTECT:'shop_equip_protect', // 道具商店-装备保护卷（钻石不足时）
        SHOP_GEM_PROTECT:  'shop_gem_protect',   // 道具商店-宝石保护卷（钻石不足时）
        SHOP_SKILL_PROTECT:'shop_skill_protect', // 道具商店-技能保护卷（钻石不足时）
        SHOP_EXP_POTION:   'shop_exp_potion',    // 道具商店-经验药水（钻石不足时）
        SHOP_DROP_POTION:  'shop_drop_potion',   // 道具商店-爆率药水（钻石不足时）
        SHOP_ELITE_TICKET: 'shop_elite_ticket',  // 道具商店-精英门票（钻石不足时）
        SHOP_GOLD:         'shop_gold',           // 金币商店-直接领取100万金币（仅广告）
        ENHANCE_FREE_SHARD:'enhance_free_shard',  // 装备强化-碎片不足时看广告免材料（辉煌+）
        // 预留：后续广告功能在这里添加
        // REVIVE:          'revive',            // 复活
        // DOUBLE_DROP:     'double_drop',        // 双倍掉落
        // EXTRA_CHEST:     'extra_chest',        // 额外宝箱
    },

    // ---------------------------------------------------------
    // 每日广告次数上限（每个广告位独立计数，每天0点重置）
    // ---------------------------------------------------------
    DAILY_LIMIT: 10,

    // ---------------------------------------------------------
    // 是否使用模拟广告（true=模拟/开发环境，false=真实SDK）
    // 上线时改为 false，并实现 _showRealAd
    // ---------------------------------------------------------
    USE_SIMULATE: true,

    // ---------------------------------------------------------
    // 获取今天的日期字符串（用于每日重置判断）
    // ---------------------------------------------------------
    _getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    },

    // ---------------------------------------------------------
    // 获取某广告位今日已观看次数
    // ---------------------------------------------------------
    getTodayCount(adType) {
        const key = `ad_count_${adType}_${this._getTodayKey()}`;
        return parseInt(localStorage.getItem(key) || '0', 10);
    },

    // ---------------------------------------------------------
    // 某广告位今日剩余次数（根据VIP等级调整）
    // ---------------------------------------------------------
    getRemainingCount(adType) {
        const vipLevel = GameState && GameState.player ? GameState.player.vipLevel || 0 : 0;
        let dailyLimit = 1; // VIP0默认1次
        if (vipLevel >= 3) {
            dailyLimit = 10;
        } else if (vipLevel >= 2) {
            dailyLimit = 5;
        } else if (vipLevel >= 1) {
            dailyLimit = 1;
        }
        return Math.max(0, dailyLimit - this.getTodayCount(adType));
    },

    // ---------------------------------------------------------
    // 某广告位今日是否还有次数
    // ---------------------------------------------------------
    canWatch(adType) {
        const vipLevel = GameState && GameState.player ? GameState.player.vipLevel || 0 : 0;
        let dailyLimit = 1; // VIP0默认1次
        if (vipLevel >= 3) {
            dailyLimit = 10;
        } else if (vipLevel >= 2) {
            dailyLimit = 5;
        } else if (vipLevel >= 1) {
            dailyLimit = 1;
        }
        return this.getTodayCount(adType) < dailyLimit;
    },

    // ---------------------------------------------------------
    // 增加某广告位今日计数（同时累加每日任务"看广告"进度 + 总广告次数 + 检查自动升VIP）
    // ---------------------------------------------------------
    _incrementCount(adType) {
        const key = `ad_count_${adType}_${this._getTodayKey()}`;
        const cur = parseInt(localStorage.getItem(key) || '0', 10);
        localStorage.setItem(key, String(cur + 1));
        // 累计总广告次数 + 检查自动升VIP
        if (GameState && GameState.player) {
            GameState.player.totalAdsWatched = (GameState.player.totalAdsWatched || 0) + 1;
            setTimeout(() => {
                checkAutoVipUpgrade();
                if (typeof DailyTaskSystem !== 'undefined') {
                    DailyTaskSystem.addProgress('watch_ad', 1);
                }
            }, 0);
        }
    },

    // ---------------------------------------------------------
    // 核心入口：观看广告
    //   adType   - AD_TYPES 中的广告位标识
    //   onSuccess - 广告看完后的回调（发放奖励）
    //   onFail    - 广告失败/取消的回调（可选）
    // ---------------------------------------------------------
    watch(adType, onSuccess, onFail) {
        if (!this.canWatch(adType)) {
            showToast(`📺 今日该广告已达${this.DAILY_LIMIT}次上限，明天再来吧`);
            if (onFail) onFail('limit');
            return;
        }
        console.log(`[AdSystem] 请求广告位: ${adType}，今日第${this.getTodayCount(adType)+1}次`);
        if (this.USE_SIMULATE) {
            this._simulateAd(adType, onSuccess, onFail);
        } else {
            this._showRealAd(adType, onSuccess, onFail);
        }
    },

    // ---------------------------------------------------------
    // 模拟广告（开发/测试用，延迟2秒后直接成功）
    // ---------------------------------------------------------
    _simulateAd(adType, onSuccess, onFail) {
        showToast('📺 广告播放中...', 2000);
        setTimeout(() => {
            console.log(`[AdSystem] 模拟广告完成: ${adType}`);
            this._incrementCount(adType);
            if (onSuccess) onSuccess();
        }, 2000);
    },

    // ---------------------------------------------------------
    // 真实广告接口（接入SDK时在此实现）
    // 示例：微信小游戏、Unity Ads、AdMob 等
    // ---------------------------------------------------------
    _showRealAd(adType, onSuccess, onFail) {
        // TODO: 接入真实广告 SDK
        // 示例（微信小游戏）:
        // const ad = wx.createRewardedVideoAd({ adUnitId: AD_UNIT_IDS[adType] });
        // ad.onClose(res => {
        //     if (res.isEnded) { AdSystem._incrementCount(adType); onSuccess(); }
        //     else if (onFail) onFail();
        // });
        // ad.show().catch(() => { if (onFail) onFail(); });
        console.warn(`[AdSystem] 真实广告未实现，广告位: ${adType}`);
        if (onFail) onFail();
    },
};

// ========== UI渲染函数 ==========

// 更新顶部栏
function updateTopBar() {
    const player = GameState.player;

    // 更新玩家名称
    const charName = document.getElementById('charName');
    if (charName) charName.textContent = player.name;

    const charLevel = document.getElementById('charLevel');
    if (charLevel) charLevel.textContent = player.level;

    const charExp = document.getElementById('charExp');
    if (charExp) charExp.textContent = player.exp;

    const charMaxExp = document.getElementById('charMaxExp');
    if (charMaxExp) charMaxExp.textContent = getExpCap(player.level);

    const goldAmount = document.getElementById('goldAmount');
    if (goldAmount) goldAmount.textContent = formatNumber(player.gold);

    const diamondAmount = document.getElementById('diamondAmount');
    if (diamondAmount) diamondAmount.textContent = formatNumber(player.diamonds);

    // 更新门票数量
    const eliteTicketAmount = document.getElementById('eliteTicketAmount');
    if (eliteTicketAmount) eliteTicketAmount.textContent = formatNumber(player.tickets?.elite || 0);

    const hellTicketAmount = document.getElementById('hellTicketAmount');
    if (hellTicketAmount) hellTicketAmount.textContent = formatNumber(player.tickets?.hell || 0);
}

// 更新角色属性面板
  function updateCharacterStats() {
      const player = GameState.player;

      // 从职业基础属性开始计算（避免重复累加装备属性）
      let totalAtk, totalDef, totalHp, totalCrit, totalCritDmg, totalAtkSpd;

      if (player.class && CLASSES[player.class]) {
          const classConfig = CLASSES[player.class];
          // 基础属性 = 职业基础 + 升级加成
          const level = player.level - 1; // 1级不加成长属性
          const growth = classConfig.growthStats;

          totalAtk = classConfig.baseStats.atk + (growth.atk * level);
          totalDef = classConfig.baseStats.def + (growth.def * level);
          totalHp = classConfig.baseStats.hp + (growth.hp * level);
          totalCrit = classConfig.baseStats.crit + (growth.crit * level);
          totalCritDmg = classConfig.baseStats.critDmg + (growth.critDmg * level);
          totalAtkSpd = classConfig.baseStats.atkSpd + (growth.atkSpd * level);
      } else {
          // 未选择职业时的默认值
          totalAtk = 10;
          totalDef = 5;
          totalHp = 100;
          totalCrit = 5;
          totalCritDmg = 150;
          totalAtkSpd = 1.0;
      }

      let totalVamp = 0;
      let totalPenetrate = 0;
      let totalAntiCrit = 0;
      let totalAntiCritDmg = 0;
      let totalExpBonus = 0;
      let totalGoldBonus = 0;
      let totalMaxAtk = 0;
      let totalDropBonus = 0;

      // 称号属性加成
      const titleBonus = getTitleBonus();
      totalAtk += titleBonus.atk;
      totalDef += titleBonus.def;
      totalCrit += titleBonus.crit;
      totalDropBonus += titleBonus.dropBonus * 100;

      // 累加装备属性（正确区分数值和百分比属性）
      const equippedItems = Object.values(GameState.equipment).filter(item => item !== null);
      equippedItems.forEach(item => {
          if (item.stats) {
              // 数值属性（攻击、防御、血量、最大攻击力）
              if (item.stats.atk) totalAtk += item.stats.atk;
              if (item.stats.def) totalDef += item.stats.def;
              if (item.stats.hp) totalHp += item.stats.hp;
              if (item.stats.maxAtk) totalMaxAtk += item.stats.maxAtk;

              // 百分比属性（攻速、暴击、爆伤、吸血、穿透、抗暴、抗爆伤）
              // 注意：这些属性在词缀配置中已经是百分比数值（如12%就是12），需要正确累加
              // 攻速特殊处理：基础值是次/秒倍率（如1.2），词缀是百分比整数（如10代表+10%），需除以100再加
              if (item.stats.atkSpd) totalAtkSpd += item.stats.atkSpd / 100;
              if (item.stats.crit) totalCrit += item.stats.crit;
              if (item.stats.critDmg) totalCritDmg += item.stats.critDmg;
              if (item.stats.vamp) totalVamp += item.stats.vamp;
              if (item.stats.penetrate) totalPenetrate += item.stats.penetrate;
              if (item.stats.antiCrit) totalAntiCrit += item.stats.antiCrit;
              if (item.stats.antiCritDmg) totalAntiCritDmg += item.stats.antiCritDmg;
              if (item.stats.expBonus) totalExpBonus += item.stats.expBonus;
              if (item.stats.goldBonus) totalGoldBonus += item.stats.goldBonus;
              if (item.stats.dropBonus) totalDropBonus += item.stats.dropBonus;
          }
      });

      // 应用攻速上限（根据职业）
      const classConfig = CLASSES[player.class];
      if (classConfig && classConfig.maxAtkSpd) {
          totalAtkSpd = Math.min(totalAtkSpd, classConfig.maxAtkSpd);
      }

      // 添加VIP加成（加法计算）
      const vipExpBonus = (getVipExpBonus() - 1) * 100; // 转换为百分比
      const vipDropBonus = (getVipDropBonus() - 1) * 100; // 转换为百分比
      totalExpBonus += vipExpBonus;
      totalGoldBonus += vipExpBonus; // 金币加成同经验
      totalDropBonus += vipDropBonus;

      // 添加药水效果
      if (GameState.player.expPotionEndTime > Date.now()) {
          totalExpBonus += 50; // 经验药水+50%
      }
      if (GameState.player.dropPotionEndTime > Date.now()) {
          totalDropBonus += 50; // 爆率药水+50%
      }

      // 应用最大攻击力百分比加成（maxAtk是百分比，如15代表+15%攻击力）
      if (totalMaxAtk > 0) {
          totalAtk = totalAtk * (1 + totalMaxAtk / 100);
      }

      // 更新玩家对象实际属性（不仅仅是显示）
      player.atk = Math.round(totalAtk);
      player.def = Math.round(totalDef);
      player.maxHp = Math.round(totalHp);
      if (player.hp > totalHp) player.hp = totalHp; // 如果当前HP超过最大HP，调整到最大HP
      player.crit = parseFloat(totalCrit.toFixed(1));
      player.critDmg = parseFloat(totalCritDmg.toFixed(1));
      player.atkSpd = parseFloat(totalAtkSpd.toFixed(1));
      player.vamp = parseFloat(totalVamp.toFixed(1));
      player.penetrate = parseFloat(totalPenetrate.toFixed(1));
      player.antiCrit = parseFloat(totalAntiCrit.toFixed(1));
      player.antiCritDmg = parseFloat(totalAntiCritDmg.toFixed(1));
      player.expBonus = totalExpBonus;
      player.goldBonus = totalGoldBonus;
      player.dropBonus = totalDropBonus;

      // 更新显示
      const statHp = document.getElementById('statHp');
      const statMaxHp = document.getElementById('statMaxHp');
      const statAtk = document.getElementById('statAtk');
      const statDef = document.getElementById('statDef');
      const statAtkSpd = document.getElementById('statAtkSpd');
      const statCrit = document.getElementById('statCrit');
      const statCritDmg = document.getElementById('statCritDmg');
      const statVamp = document.getElementById('statVamp');
      const statPenetrate = document.getElementById('statPenetrate');
      const statAntiCrit = document.getElementById('statAntiCrit');
      const statAntiCritDmg = document.getElementById('statAntiCritDmg');
      const statExpBonus = document.getElementById('statExpBonus');
      const statGoldBonus = document.getElementById('statGoldBonus');

      if (statHp) statHp.textContent = player.hp;
      if (statMaxHp) statMaxHp.textContent = Math.round(totalHp);
      if (statAtk) statAtk.textContent = Math.round(totalAtk) + (totalMaxAtk > 0 ? ` (+${Math.round(totalMaxAtk)}最大)` : '');
      if (statDef) statDef.textContent = Math.round(totalDef);
      if (statAtkSpd) statAtkSpd.textContent = totalAtkSpd.toFixed(1);
      if (statCrit) statCrit.textContent = totalCrit.toFixed(1) + '%';
      if (statCritDmg) statCritDmg.textContent = totalCritDmg.toFixed(1) + '%';
      if (statVamp) statVamp.textContent = totalVamp.toFixed(1) + '%';
      if (statPenetrate) statPenetrate.textContent = totalPenetrate.toFixed(1) + '%';
      if (statAntiCrit) statAntiCrit.textContent = totalAntiCrit.toFixed(1) + '%';
      if (statAntiCritDmg) statAntiCritDmg.textContent = totalAntiCritDmg.toFixed(1) + '%';
      if (statExpBonus) statExpBonus.textContent = totalExpBonus.toFixed(0) + '%';
      if (statGoldBonus) statGoldBonus.textContent = totalGoldBonus.toFixed(0) + '%';
      const statDropBonus = document.getElementById('statDropBonus');
      if (statDropBonus) statDropBonus.textContent = totalDropBonus.toFixed(0) + '%';

      // 渲染称号
      renderTitles();
  }

// 渲染已获得的称号
function renderTitles() {
    const titlesList = document.getElementById('titlesList');
    if (!titlesList) return;

    if (GameState.titles.length === 0) {
        titlesList.innerHTML = `<span class="title-badge no-titles">暂无称号</span>`;
        return;
    }

    let html = '';
    for (const titleId of GameState.titles) {
        const title = TITLE_CONFIG.find(t => t.id === titleId);
        if (title) {
            html += `<span class="title-badge">${title.icon} ${title.name}</span>`;
        }
    }
    titlesList.innerHTML = html;
}

// 更新装备槽位
function updateEquipmentSlots() {
    for (const [slot, item] of Object.entries(GameState.equipment)) {
        const slotElement = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
        if (!slotElement) continue;

        const infoElement = document.getElementById(`${slot}Info`);
        if (!infoElement) continue;

        if (item) {
            infoElement.innerHTML = `
                <div class="equipment-quality" style="color: ${EQUIPMENT_QUALITIES[item.quality].color}">
                    ${EQUIPMENT_QUALITIES[item.quality].name}
                </div>
                <div class="equipment-level">Lv.${item.level}</div>
            `;
        } else {
            infoElement.innerHTML = '';
        }
    }
}

// 更新战斗状态
function updateBattleStatus() {
    const enemy = GameState.battle.currentEnemy;

    // 更新敌人名称和图标
    const enemyName = document.getElementById('enemyName');
    if (enemyName) {
        if (enemy) {
            // 根据类型加专属样式
            enemyName.className = '';
            if (enemy.type === 'elite') {
                enemyName.classList.add('enemy-name-elite');
                enemyName.innerHTML = `<span class="boss-icon boss-icon-elite">${enemy.icon}</span> ${enemy.name}`;
            } else if (enemy.type === 'hell') {
                enemyName.classList.add('enemy-name-hell');
                enemyName.innerHTML = `<span class="boss-icon boss-icon-hell">${enemy.icon}</span> ${enemy.name}`;
            } else {
                enemyName.innerHTML = `${enemy.icon} ${enemy.name}`;
            }
        } else {
            enemyName.className = '';
            enemyName.textContent = '--';
        }
    }

    // 更新敌人等级
    const enemyAtk = document.getElementById('enemyAtk');
    const enemyDef = document.getElementById('enemyDef');
    const enemyCrit = document.getElementById('enemyCrit');
    const enemyAntiCrit = document.getElementById('enemyAntiCrit');
    const enemyCritDmg = document.getElementById('enemyCritDmg');

    if (enemy) {
        if (enemyAtk) enemyAtk.textContent = `攻击: ${formatNumber(enemy.atk)}`;
        if (enemyDef) enemyDef.textContent = `防御: ${formatNumber(enemy.def)}`;
        if (enemyCrit) enemyCrit.textContent = `暴击: ${enemy.crit || 0}%`;
        if (enemyAntiCrit) enemyAntiCrit.textContent = `抗暴: ${enemy.antiCrit || 0}%`;
        if (enemyCritDmg) enemyCritDmg.textContent = `爆伤: ${enemy.critDmg || 0}%`;

        // 更新血量
        const enemyCurrentHp = document.getElementById('enemyCurrentHp');
        const enemyMaxHp = document.getElementById('enemyMaxHp');
        const enemyHpBar = document.getElementById('enemyHpBar');

        if (enemyCurrentHp) enemyCurrentHp.textContent = formatNumber(Math.floor(enemy.hp));
        if (enemyMaxHp) enemyMaxHp.textContent = formatNumber(enemy.maxHp);
        if (enemyHpBar) enemyHpBar.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
    } else {
        if (enemyAtk) enemyAtk.textContent = '--';
        if (enemyDef) enemyDef.textContent = '--';
        if (enemyCrit) enemyCrit.textContent = '暴击: --';
        if (enemyAntiCrit) enemyAntiCrit.textContent = '抗暴: --';
        if (enemyCritDmg) enemyCritDmg.textContent = '爆伤: --';

        const enemyCurrentHp = document.getElementById('enemyCurrentHp');
        const enemyMaxHp = document.getElementById('enemyMaxHp');
        const enemyHpBar = document.getElementById('enemyHpBar');

        if (enemyCurrentHp) enemyCurrentHp.textContent = '0';
        if (enemyMaxHp) enemyMaxHp.textContent = '0';
        if (enemyHpBar) enemyHpBar.style.width = '0%';
    }

    // 更新玩家血量
    const player = GameState.player;
    const playerCurrentHp = document.getElementById('playerCurrentHp');
    const playerMaxHp = document.getElementById('playerMaxHp');
    const playerHpBar = document.getElementById('playerHpBar');

    if (playerCurrentHp) playerCurrentHp.textContent = formatNumber(Math.floor(player.hp));
    if (playerMaxHp) playerMaxHp.textContent = formatNumber(player.maxHp);
    if (playerHpBar) playerHpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
}

// 更新Buff状态
function updateBuffStatus() {
    // HTML 中 id 为 buffStatus，使用正确 ID
    const buffPanel = document.getElementById('buffStatus');
    if (!buffPanel) return;

    let html = '';
    const now = Date.now();
    if (GameState.player.expPotionEndTime > now) {
        const remaining = Math.ceil((GameState.player.expPotionEndTime - now) / 1000);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        html += `<div class="buff-item" style="color: #4caf50;" title="经验+50%">⚗️ ${mins > 0 ? mins + 'm' : ''}${secs}s</div>`;
    }
    if (GameState.player.dropPotionEndTime > now) {
        const remaining = Math.ceil((GameState.player.dropPotionEndTime - now) / 1000);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        html += `<div class="buff-item" style="color: #ff9800;" title="爆率+50%">🍀 ${mins > 0 ? mins + 'm' : ''}${secs}s</div>`;
    }

    buffPanel.innerHTML = html;
}

  // 渲染背包 - 新样式（根据截图）
  function renderInventory(filterType = 'all') {
      const inventoryGrid = document.getElementById('inventoryGrid');
      if (!inventoryGrid) return;

      // 绑定筛选按钮事件
      document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.onclick = () => {
              document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              renderInventory(btn.dataset.type);
          };
      });

      inventoryGrid.innerHTML = '';

      // 只显示装备，不显示技能书（技能书在技能页面）
      let items = GameState.inventory.filter(item => !item.type || item.type === 'equipment' || item.slot);

      if (filterType !== 'all') {
          items = items.filter(item => {
              if (filterType === 'weapon') return item.slot === 'weapon';
              if (filterType === 'armor') return item.slot === 'armor';
              if (filterType === 'helmet') return item.slot === 'helmet';
              if (filterType === 'boots') return item.slot === 'boots';
              if (filterType === 'ring') return item.slot === 'ring';
              if (filterType === 'necklace') return item.slot === 'necklace';
              return true;
          });
      }

      // 渲染物品列表
      items.forEach((item, originalIndex) => {
          const itemElement = document.createElement('div');
          itemElement.className = 'inventory-item';

          // 获取品质配置
          const qualityConfig = EQUIPMENT_QUALITIES[item.quality] || EQUIPMENT_QUALITIES[0];
          const slotConfig = EQUIPMENT_SLOTS[item.slot] || { name: '未知', icon: '?' };

          // 检查是否是更好的装备
          const equipSlot = item.slot;
          const equippedItem = GameState.equipment[equipSlot];
          const isBetter = equippedItem && calculateEquipmentScore(item) > calculateEquipmentScore(equippedItem);

          if (isBetter) {
              itemElement.classList.add('better-equipment');
          }

          // 计算装备评分
          const score = Math.floor(calculateEquipmentScore(item));

          // 生成属性列表（按截图顺序）
          const statMap = {
              atk: { name: '攻击', unit: '' },
              hp: { name: '生命', unit: '' },
              goldBonus: { name: '金币加成', unit: '%' },
              critDmg: { name: '爆伤', unit: '%' },
              atkSpd: { name: '攻速', unit: '%' },
              antiCritDmg: { name: '抗爆伤', unit: '%' },
              vamp: { name: '吸血', unit: '%' },
              expBonus: { name: '经验加成', unit: '%' },
              crit: { name: '暴击', unit: '%' },
              antiCrit: { name: '抗暴击', unit: '%' },
              penetrate: { name: '穿透', unit: '%' },
              def: { name: '防御', unit: '' }
          };

          let statsLines = [];
          if (item.stats) {
              for (const [key, value] of Object.entries(item.stats)) {
                  if (value !== 0 && value !== null && statMap[key]) {
                      const statInfo = statMap[key];
                      statsLines.push(`${statInfo.name}: +${value}${statInfo.unit}`);
                  }
              }
          }

        // 生成宝石孔位显示（紧凑模式：显示孔数+已镶数）
        let gemSlotsHtml = '';
        if (item.gems && item.gems.length > 0) {
            const totalHoles = item.gems.length;
            const filledGems = item.gems.filter(g => g !== null && g !== undefined);
            const filledCount = filledGems.length;
            const emptyCount = totalHoles - filledCount;
            // 已镶嵌宝石用彩色图标紧凑展示，空孔用孔数标签
            let gemIconsHtml = filledGems.map(g => {
                const icon = (g.affixes && g.affixes.length > 0 ? g.affixes[0].icon : null) || g.affixIcon || '💎';
                return `<span class="gem-slot-filled" style="color:${g.color||'#f1c40f'}">${icon}</span>`;
            }).join('');
            const emptyHtml = emptyCount > 0
                ? `<span class="gem-slot-empty">+${emptyCount}空</span>`
                : '';
            gemSlotsHtml = `<div class="equip-gem-slots"><span class="gem-hole-count">⬡${totalHoles}孔</span>${gemIconsHtml}${emptyHtml}</div>`;
        }

          const realIndex = GameState.inventory.indexOf(item);
          const enhanceLevel = item.enhanceLevel || 0;
          const successRate = enhanceLevel < item.maxLevel ? ENHANCE_SUCCESS_RATE[Math.min(enhanceLevel, ENHANCE_SUCCESS_RATE.length - 1)] : 100;
          const requiredShards = getRequiredShardsForEnhance(enhanceLevel);
          itemElement.innerHTML = `
              <div class="equip-card-header">
                  <span class="quality-icon">${qualityConfig.icon}</span>
                  <div class="equip-name-group">
                      <span class="equip-name" style="color:${qualityConfig.color || '#fff'}">${item.name}${(item.enhanceLevel || 0) > 0 ? ` <span style="color:#f39c12;font-size:12px">+${item.enhanceLevel}</span>` : ''}</span>
                      <span class="equip-meta">${slotConfig.name} · Lv.${item.level}${enhanceLevel < item.maxLevel ? ` · <span style="color:#e74c3c">成功率${successRate}%</span>` : ''}</span>
                  </div>
                  <div class="equip-score-block">
                      <span class="equip-score">★${score}</span>
                      ${isBetter ? '<span class="better-tag">↑强</span>' : ''}
                  </div>
              </div>
              <div class="equip-card-actions">
                  <button class="action-btn equip-btn" onclick="event.stopPropagation(); equipItem(${realIndex})">[装备]</button>
                  <button class="action-btn enhance-btn" onclick="event.stopPropagation(); enhanceItem(${realIndex}, false); renderInventory('${filterType}')">[强化${enhanceLevel < item.maxLevel ? `(${requiredShards}碎片)` : ''}]</button>
                  <button class="action-btn lock-btn" onclick="event.stopPropagation(); toggleLockItem(${realIndex})">${item.locked ? '🔒' : '🔓'}</button>
                  <button class="action-btn dismantle-btn" onclick="event.stopPropagation(); dismantleItem(${realIndex})">[分解]</button>
              </div>
              <div class="equip-card-stats-grid">
                  ${statsLines.map(s => `<span class="stat-chip">${s}</span>`).join('')}
              </div>
              ${gemSlotsHtml}
          `;

          // 点击卡片主体打开详情弹窗
          itemElement.onclick = () => showItemDetail(realIndex);

          inventoryGrid.appendChild(itemElement);
      });

      if (items.length === 0) {
          inventoryGrid.innerHTML = '<div class="empty-tip">背包空空如也</div>';
      }

      // 更新背包容量显示
      const countEl = document.getElementById('inventoryCount');
      if (countEl) {
          // 只计算装备数量，技能不占用背包空间
          const equipCount = GameState.inventory.filter(item => !item.type || item.type === 'equipment' || item.slot).length;
          countEl.textContent = equipCount;
      }
      const maxEl = document.getElementById('inventoryMax');
      if (maxEl) maxEl.textContent = GameState.maxInventory || 100;

      // 渲染背包页面的自动分解选项
      renderInventoryDismantleOptions();

      // 渲染装备碎片到碎片仓库区域
      const shardGrid = document.getElementById('shardGrid');
      if (shardGrid) {
          const qualityShards = GameState.stats.qualityShards || {};
          const equipQualityNames = ['残破', '锈蚀', '凡铁', '精良', '卓越', '传说', '辉煌', '神圣', '永恒', '深渊', '混沌', '虚空', '湮灭', '终焉'];
          const equipQualityColors = ['#9e9e9e', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#ffd700', '#e5e4e2', '#00bcd4', '#795548', '#e91e63', '#ff5722', '#607d8b', '#3f51b5'];

          let shardHtml = '<div class="shard-quality-grid">';
          for (let i = 0; i < equipQualityNames.length; i++) {
              const count = qualityShards[i] || 0;
              const hasShards = count > 0;
              shardHtml += `<div class="shard-quality-chip ${hasShards ? 'has-shards' : ''}"
                               style="border-color: ${equipQualityColors[i]}; ${hasShards ? `background: ${equipQualityColors[i]}22;` : ''}">
                  <span class="shard-chip-name" style="color:${equipQualityColors[i]}">${equipQualityNames[i]}</span>
                  <span class="shard-chip-count" style="color:${hasShards ? '#ffd700' : '#666'}">${count}</span>
              </div>`;
          }
          shardHtml += '</div>';
          shardGrid.innerHTML = shardHtml;
      }
  }

// 渲染宝石列表
function renderGemList() {
    // HTML 中 id 为 gemList（非 gemGrid）
    const gemGrid = document.getElementById('gemList');
    if (!gemGrid) return;

    // 先渲染宝石碎片（顶部）
    const qualityShards = GameState.stats.qualityShards || {};
    const gemQualityNames = ['灰', '绿', '蓝', '紫', '橙'];
    const gemQualityColors = ['rgb(160,160,160)', 'rgb(76,175,80)', 'rgb(33,150,243)', 'rgb(156,39,176)', 'rgb(255,152,0)'];

    let shardHtml = '<div class="shard-quality-grid" style="margin-bottom:12px;">';
    for (let i = 0; i < gemQualityNames.length; i++) {
        const key = -i - 1;
        const count = qualityShards[key] || 0;
        const hasShards = count > 0;
        shardHtml += `<div class="shard-quality-chip ${hasShards ? 'has-shards' : ''}"
                         style="border-color: ${gemQualityColors[i]}; ${hasShards ? `background: ${gemQualityColors[i]}22;` : ''}">
            <span class="shard-chip-name" style="color:${gemQualityColors[i]}">${gemQualityNames[i]}</span>
            <span class="shard-chip-count" style="color:${hasShards ? '#ffd700' : '#666'}">${count}</span>
        </div>`;
    }
    shardHtml += '</div>';

    gemGrid.innerHTML = shardHtml;

    GameState.gemPool.forEach((gem, index) => {
        recalculateGemStats(gem);

        // 生成词缀摘要（纯文本，使用中文名称）
        let affixSummary = '';
        if (gem.affixes && gem.affixes.length > 0) {
            gem.affixes.forEach(affix => {
                const suffix = affix.type === 'percentage' ? '%' : '';
                const val = gem.stats[affix.key];
                affixSummary += `${affix.name}+${val}${suffix} `;
            });
        } else {
            const affixConfig = GEM_AFFIXES[gem.affixType];
            const suffix = affixConfig.type === 'percentage' ? '%' : '';
            affixSummary = `${affixConfig.name}+${gem.stats[gem.affixType]}${suffix}`;
        }

        const gemLevel = gem.level || 0;

        const gemElement = document.createElement('div');
        gemElement.className = 'gem-line';
        gemElement.innerHTML = `
            <span class="gem-line-name" style="color:${gem.color}">💎${gem.name}Lv.${gemLevel}</span>
            <span class="gem-line-stats">${affixSummary}</span>
            <span class="gem-line-actions">
                <button class="gem-line-btn" onclick="event.stopPropagation(); equipGem(${index})">镶</button>
                <button class="gem-line-btn" onclick="event.stopPropagation(); enhanceGem(${index})">强</button>
                <button class="gem-line-btn" onclick="event.stopPropagation(); toggleGemLock(${index})">${gem.locked ? '🔒' : '🔓'}</button>
                <button class="gem-line-btn" onclick="event.stopPropagation(); dismantleGem(${index})">分</button>
            </span>
        `;
        gemElement.onclick = () => showGemDetail(index);
        gemGrid.appendChild(gemElement);
    });
}

// 渲染技能槽位
function renderSkillSlots() {
    // HTML中技能槽位是静态的 .skill-slot 元素（data-slot="1..4"），无动态容器
    for (let i = 0; i < 4; i++) {
        const skill = GameState.skills[i];
        const slotElement = document.querySelector(`.skill-slot[data-slot="${i + 1}"]`);
        if (!slotElement) continue;

        if (skill) {
            slotElement.innerHTML = `
                <div class="skill-icon" style="color: ${skill.color}">${skill.icon}</div>
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level">Lv.${skill.level || 1}</div>
            `;
            slotElement.onclick = () => showSkillModal(i + 1);
        } else {
            slotElement.innerHTML = `
                <div class="skill-icon">➕</div>
                <div class="skill-name">技能${i + 1}</div>
            `;
            slotElement.onclick = () => showSkillModal(i + 1);
        }
    }
}

// 渲染技能池（按品质分组）
function renderSkillPool() {
    const skillListContainer = document.getElementById('skillList');
    if (!skillListContainer) return;

    // 先渲染技能碎片（顶部）
    const qualityShards = GameState.stats.qualityShards || {};
    const skillQualityNames = ['灰', '绿', '蓝', '紫', '橙'];
    const skillQualityColors = ['rgb(160,160,160)', 'rgb(76,175,80)', 'rgb(33,150,243)', 'rgb(156,39,176)', 'rgb(255,152,0)'];

    let shardHtml = '<div class="shard-quality-grid" style="margin-bottom:12px;">';
    for (let i = 0; i < skillQualityNames.length; i++) {
        const key = -100 - i;
        const count = qualityShards[key] || 0;
        const hasShards = count > 0;
        shardHtml += `<div class="shard-quality-chip ${hasShards ? 'has-shards' : ''}"
                         style="border-color: ${skillQualityColors[i]}; ${hasShards ? `background: ${skillQualityColors[i]}22;` : ''}">
            <span class="shard-chip-name" style="color:${skillQualityColors[i]}">${skillQualityNames[i]}</span>
            <span class="shard-chip-count" style="color:${hasShards ? '#ffd700' : '#666'}">${count}</span>
        </div>`;
    }
    shardHtml += '</div>';

    const skills = GameState.inventory.filter(item => item.type === 'skill');
    if (skills.length === 0) {
        skillListContainer.innerHTML = shardHtml + '<div class="empty-tip">技能池空空如也</div>';
        return;
    }

    // 按品质分组（从高到低）
    const QUALITY_ORDER = [4, 3, 2, 1, 0]; // 橙、紫、蓝、绿、灰
    const QUALITY_NAMES = ['灰', '绿', '蓝', '紫', '橙'];
    const QUALITY_COLORS = ['#9e9e9e', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'];

    skillListContainer.innerHTML = shardHtml;

    // 所有技能横向紧凑显示
    skills.forEach((skill) => {
        const originalIndex = GameState.inventory.indexOf(skill);
        const skillLevel = skill.level || 0;
        const successRate = skillLevel < skill.maxLevel ? ENHANCE_SUCCESS_RATE[Math.min(skillLevel, ENHANCE_SUCCESS_RATE.length - 1)] : 100;
        const requiredShards = getRequiredShardsForEnhance(skillLevel);
        const qualityName = QUALITY_NAMES[skill.quality] || '灰';
        const qualityColor = QUALITY_COLORS[skill.quality] || '#9e9e9e';

        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item-compact';
        skillElement.innerHTML = `
            <div class="skill-icon-compact" style="color: ${skill.color}">${skill.icon}</div>
            <div class="skill-info-compact">
                <div class="skill-name-compact" style="color: ${qualityColor}">${skill.name} <span class="skill-level-compact">Lv.${skillLevel}</span></div>
            </div>
            <div class="skill-actions-compact">
                <button class="skill-btn-compact" onclick="event.stopPropagation(); equipSkill(${originalIndex})">装</button>
                <button class="skill-btn-compact" onclick="event.stopPropagation(); enhanceSkill(${originalIndex})">强</button>
            </div>
        `;
        skillElement.onclick = () => showSkillDetail(originalIndex);
        skillListContainer.appendChild(skillElement);
    });
}

// 渲染区域列表
function renderAreaList() {
    const areaListContainer = document.getElementById('areaList');
    if (!areaListContainer) return;

    areaListContainer.innerHTML = '';

    AREA_NAMES.forEach((name, index) => {
        const areaElement = document.createElement('div');
        areaElement.className = `area-item ${GameState.currentArea === index ? 'active' : ''}`;
        areaElement.textContent = name;
        areaElement.onclick = () => selectArea(index);
        areaListContainer.appendChild(areaElement);
    });
}

// 渲染背包页面的自动分解选项
function renderInventoryDismantleOptions() {
    const qualityList = document.getElementById('dismantleQualityList');
    if (!qualityList) return;

    const settings = GameState.dismantleSettings.equipment;
    const auto = GameState.autoDismantle.equipment;

    const qualityNames = ['残破', '锈蚀', '凡铁', '精良', '卓越', '传说', '辉煌', '神圣', '永恒', '深渊', '混沌', '虚空', '湮灭', '终焉'];

    let html = '';
    for (let i = 0; i < qualityNames.length; i++) {
        html += `<div class="dismantle-quality-item">
            <input type="checkbox" id="dismantleEquip${i}" ${settings[i] ? 'checked' : ''} ${!auto ? 'disabled' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'equipment')">
            <label for="dismantleEquip${i}" style="color: ${EQUIPMENT_QUALITIES[i].color}">${qualityNames[i]}</label>
        </div>`;
    }

    qualityList.innerHTML = html;
}

// 渲染宝石仓库页面的自动分解品质选项
function renderGemDismantleOptions() {
    const qualityList = document.getElementById('dismantleQualityListGem');
    if (!qualityList) return;

    const settings = GameState.dismantleSettings.gem;
    const auto = GameState.autoDismantle.gem;

    let html = '';
    for (let i = 0; i < GEM_QUALITIES.length; i++) {
        html += `<div class="dismantle-quality-item">
            <input type="checkbox" id="dismantleGem2_${i}" ${settings[i] ? 'checked' : ''} ${!auto ? 'disabled' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'gem')">
            <label for="dismantleGem2_${i}" style="color: ${GEM_QUALITIES[i].color}">${GEM_QUALITIES[i].name}</label>
        </div>`;
    }

    qualityList.innerHTML = html;
}

// 渲染技能页面的自动分解品质选项
function renderSkillDismantleOptions() {
    const qualityList = document.getElementById('dismantleQualityListSkill');
    if (!qualityList) return;

    const settings = GameState.dismantleSettings.skill;
    const auto = GameState.autoDismantle.skill;

    let html = '';
    for (let i = 0; i < SKILL_QUALITIES.length; i++) {
        html += `<div class="dismantle-quality-item">
            <input type="checkbox" id="dismantleSkill2_${i}" ${settings[i] ? 'checked' : ''} ${!auto ? 'disabled' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'skill')">
            <label for="dismantleSkill2_${i}" style="color: ${SKILL_QUALITIES[i].color}">${SKILL_QUALITIES[i].name}</label>
        </div>`;
    }

    qualityList.innerHTML = html;
}

// 渲染分解栏
function renderDismantleBar() {
    const dismantleBar = document.getElementById('dismantleBar');
    if (!dismantleBar) return;

    const settings = GameState.dismantleSettings;
    const auto = GameState.autoDismantle;

    let html = '<div class="dismantle-section">';

    // 装备分解设置
    html += '<div class="dismantle-category">';
    html += '<div class="dismantle-category-header">';
    html += `<input type="checkbox" id="autoDismantleEquip" ${auto.equipment ? 'checked' : ''} onchange="toggleAutoDismantle(this.checked, 'equipment')">`;
    html += '<label for="autoDismantleEquip">自动分解装备</label>';
    html += '</div>';
    html += '<div class="dismantle-quality-grid">';

    const qualityNames = ['残破', '锈蚀', '凡铁', '精良', '卓越', '传说', '辉煌', '神圣', '永恒', '深渊', '混沌', '虚空', '湮灭', '终焉'];
    for (let i = 0; i <= 13; i++) {
        if (i < 3) continue; // 0-2品质不显示
        html += `<div class="dismantle-quality-item">
            <input type="checkbox" id="dismantleEquip${i}" ${settings.equipment[i] ? 'checked' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'equipment')">
            <label for="dismantleEquip${i}" style="color: ${EQUIPMENT_QUALITIES[i].color}">${qualityNames[i]}</label>
        </div>`;
    }

    html += '</div></div>';

    // 技能分解设置
    html += '<div class="dismantle-category">';
    html += '<div class="dismantle-category-header">';
    html += `<input type="checkbox" id="autoDismantleSkill" ${auto.skill ? 'checked' : ''} onchange="toggleAutoDismantle(this.checked, 'skill')">`;
    html += '<label for="autoDismantleSkill">自动分解技能</label>';
    html += '</div>';
    html += '<div class="dismantle-quality-grid">';

    const skillQualityNames = ['灰', '绿', '蓝', '紫', '橙'];
    for (let i = 0; i <= 4; i++) {
        html += `<div class="dismantle-quality-item">
            <input type="checkbox" id="dismantleSkill${i}" ${settings.skill[i] ? 'checked' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'skill')">
            <label for="dismantleSkill${i}" style="color: ${SKILL_QUALITIES[i].color}">${skillQualityNames[i]}</label>
        </div>`;
    }

    html += '</div></div>';

    // 宝石分解设置
    html += '<div class="dismantle-category">';
    html += '<div class="dismantle-category-header">';
    html += `<input type="checkbox" id="autoDismantleGem" ${auto.gem ? 'checked' : ''} onchange="toggleAutoDismantle(this.checked, 'gem')">`;
    html += '<label for="autoDismantleGem">自动分解宝石</label>';
    html += '</div>';
    html += '<div class="dismantle-quality-grid">';

    for (let i = 0; i <= 4; i++) {
        html += `<div class="dismantle-quality-item">
            <input type="checkbox" id="dismantleGem${i}" ${settings.gem[i] ? 'checked' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'gem')">
            <label for="dismantleGem${i}" style="color: ${GEM_QUALITIES[i].color}">${skillQualityNames[i]}</label>
        </div>`;
    }

    html += '</div></div>';
    html += '</div>';

    dismantleBar.innerHTML = html;
}

// ========== 模态框函数 ==========

// 显示模态框
function showModal(modalId) {
    try {
        console.log('[showModal] 打开模态框:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.classList.add('active');
            console.log('[showModal] 模态框已显示');
            console.log('[showModal] 模态框类名:', modal.className);
            console.log('[showModal] 模态框样式:', window.getComputedStyle(modal).display);
        } else {
            console.error('[showModal] 模态框元素不存在:', modalId);
        }
    } catch (err) {
        console.error('[showModal] 显示模态框时出错:', err);
        alert('显示模态框时出错: ' + err.message);
    }
}

// 关闭模态框
function closeModal(modalId, force = false) {
    try {
        console.log('[closeModal] 关闭模态框:', modalId, 'force:', force);
        const modal = document.getElementById(modalId);
        if (modal) {
            // 检查是否是初始职业选择模态框（不可关闭，除非强制）
            if (!force && modalId === 'classModal' && GameState.isInitialClassSelection) {
                console.log('[closeModal] 初始职业选择模态框不可关闭:', modalId);
                return; // 不允许关闭
            }

            modal.classList.remove('show');
            modal.classList.remove('active');
            console.log('[closeModal] 模态框已关闭');
        } else {
            console.error('[closeModal] 模态框元素不存在:', modalId);
        }
    } catch (err) {
        console.error('[closeModal] 关闭模态框时出错:', err);
        alert('关闭模态框时出错: ' + err.message);
    }
}

// 显示职业选择模态框
function showClassModal() {
    showModal('classModal');
}

// 显示区域选择模态框
function showAreaModal() {
    console.log('[showAreaModal] 函数被调用');
    renderAreaList();
    showModal('areaModal');
}

// 测试函数
function testModal() {
    console.log('[testModal] 函数被调用');
    alert('测试按钮点击成功！模态框功能正常！');
}

// 渲染区域列表
function renderAreaList() {
    try {
        console.log('[renderAreaList] 开始渲染区域列表');
        const areaList = document.getElementById('areaList');
        if (!areaList) {
            console.error('[renderAreaList] areaList 元素不存在');
            return;
        }

        console.log('[renderAreaList] areaList 元素存在');

        // 检查常量是否存在
        if (typeof AREA_NAMES === 'undefined' || !AREA_NAMES || AREA_NAMES.length === 0) {
            console.error('[renderAreaList] AREA_NAMES 未定义或为空');
            areaList.innerHTML = '<div class="error">区域数据加载失败</div>';
            return;
        }

        console.log('[renderAreaList] AREA_NAMES 长度:', AREA_NAMES.length);

        let html = '';
        for (let i = 0; i < AREA_NAMES.length; i++) {
            const baseLevel = i * 5 + 1;
            const isCurrentArea = i === GameState.currentArea;
            const isUnlocked = GameState.player.level >= baseLevel;

            html += `<div class="area-item ${isCurrentArea ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}" onclick="${isUnlocked ? `selectArea(${i})` : ''}">
            <div class="area-name">${AREA_NAMES[i]}</div>
            <div class="area-level">Lv.${baseLevel}-${baseLevel + 4}</div>
            ${isCurrentArea ? '<div class="area-tag">当前</div>' : ''}
            ${!isUnlocked ? '<div class="dungeon-lock">🔒</div>' : ''}
        </div>`;
        }

        areaList.innerHTML = html;
        console.log('[renderAreaList] 区域列表渲染完成，HTML长度:', html.length);
    } catch (err) {
        console.error('[renderAreaList] 渲染区域列表时出错:', err);
        alert('渲染区域列表时出错: ' + err.message);
    }
}

// 选择区域
function selectArea(areaIndex) {
    const baseLevel = areaIndex * 5 + 1;

    // 检查等级限制
    if (GameState.player.level < baseLevel) {
        showToast(`需要达到 Lv.${baseLevel} 才能进入该区域！`);
        return;
    }

    // 如果在副本中，先退出副本
    if (GameState.battle.inDungeon) {
        exitDungeon();
    }

    GameState.currentArea = areaIndex;
    closeModal('areaModal');
    updateAreaDisplay();
    showToast(`已切换到 ${AREA_NAMES[areaIndex]}`);
    
    // 生成新的普通怪物
    spawnNextEnemy();
}

// 显示精英副本模态框
function showEliteDungeonModal() {
    renderEliteDungeonList();
    document.getElementById('eliteTicketCount').textContent = GameState.player.tickets.elite || 0;

    // 检查解锁等级
    const lockTip = document.getElementById('eliteLockTip');
    if (GameState.player.level < 25) {
        lockTip.style.display = 'block';
    } else {
        lockTip.style.display = 'none';
    }

    showModal('eliteDungeonModal');
}

// 渲染精英副本列表
function renderEliteDungeonList() {
    const dungeonList = document.getElementById('eliteDungeonList');
    if (!dungeonList) return;

    // 检查常量是否存在
    if (typeof ELITE_DUNGEONS === 'undefined' || !ELITE_DUNGEONS || ELITE_DUNGEONS.length === 0) {
        console.error('ELITE_DUNGEONS 未定义或为空');
        dungeonList.innerHTML = '<div class="error">精英副本数据加载失败</div>';
        return;
    }

    let html = '';
    for (const dungeon of ELITE_DUNGEONS) {
        const isUnlocked = GameState.player.level >= dungeon.level;
        // 计算门票消耗：25级7张，每10级+1张，105-195级固定15张
        let ticketCost;
        if (dungeon.level >= 105 && dungeon.level <= 195) {
            ticketCost = 15;
        } else {
            ticketCost = 7 + Math.floor((dungeon.level - 25) / 10);
        }
        // 预览该副本的暴击属性
        const tier = (dungeon.level - 25) / 10;
        const scaleFactor = Math.pow(1.2, tier);
        const previewCrit = Math.min(600, Math.round(70 * scaleFactor));
        const previewAnti = Math.min(600, Math.round(70 * scaleFactor));
        const previewCritDmg = Math.round(500 * scaleFactor);
        html += `<div class="dungeon-item ${!isUnlocked ? 'locked' : ''}" onclick="${isUnlocked ? `enterEliteDungeon(${dungeon.level})` : ''}">
            <div class="dungeon-name">${dungeon.name}</div>
            <div class="dungeon-level">Lv.${dungeon.level} <span style="color:#4CAF50;font-size:10px">🎟️${ticketCost}张</span></div>
            ${isUnlocked ? `<div class="dungeon-stats" style="font-size:11px;color:#f39c12;">暴${previewCrit} 抗${previewAnti} 爆${previewCritDmg}%</div>` : '<div class="dungeon-lock">🔒</div>'}
        </div>`;
    }

    dungeonList.innerHTML = html;
}

// 进入精英副本
function enterEliteDungeon(level) {
    if (GameState.player.level < 25) {
        showToast('需要达到 Lv.25 才能进入精英副本', 'error');
        return;
    }

    if (GameState.player.level < level) {
        showToast(`需要达到 Lv.${level} 才能进入此精英副本`, 'error');
        return;
    }

    // 计算门票消耗：25级7张，每10级+1张，105-195级固定15张
    let ticketCost;
    if (level >= 105 && level <= 195) {
        ticketCost = 15;
    } else {
        ticketCost = 7 + Math.floor((level - 25) / 10);
    }
    if (!GameState.player.tickets || GameState.player.tickets.elite < ticketCost) {
        showToast(`精英门票不足（需要${ticketCost}张）`, 'error');
        return;
    }

    // 如果在副本中，先退出副本
    if (GameState.battle.inDungeon) {
        exitDungeon();
    }

    GameState.battle.inDungeon = true;
    GameState.battle.dungeonType = 'elite';
    GameState.battle.dungeonLevel = level;

    closeModal('eliteDungeonModal');
    updateAreaDisplay();

    // 生成精英怪物（通过 spawnNextEnemy 走精英副本专属逻辑，门票在生成时扣除）
    spawnNextEnemy();
    startAutoBattle();
    showToast(`已进入精英副本 ${ELITE_DUNGEONS.find(d => d.level === level)?.name || ''}！`);
}

// 显示地狱副本模态框
function showHellDungeonModal() {
    renderHellDungeonList();
    document.getElementById('hellTicketCount').textContent = GameState.player.tickets.hell || 0;

    // 检查解锁等级
    const lockTip = document.getElementById('hellLockTip');
    if (GameState.player.level < 50) {
        lockTip.style.display = 'block';
    } else {
        lockTip.style.display = 'none';
    }

    showModal('hellDungeonModal');
}

// 渲染地狱副本列表
function renderHellDungeonList() {
    const dungeonList = document.getElementById('hellDungeonList');
    if (!dungeonList) return;

    // 检查常量是否存在
    if (typeof HELL_DUNGEONS === 'undefined' || !HELL_DUNGEONS || HELL_DUNGEONS.length === 0) {
        console.error('HELL_DUNGEONS 未定义或为空');
        dungeonList.innerHTML = '<div class="error">地狱副本数据加载失败</div>';
        return;
    }

    let html = '';
    for (const dungeon of HELL_DUNGEONS) {
        const isUnlocked = GameState.player.level >= dungeon.level;
        // 计算门票消耗：50-100级1张，110-150级2张，160-200级3张
        let ticketCost = 1;
        if (dungeon.level >= 160) ticketCost = 3;
        else if (dungeon.level >= 110) ticketCost = 2;
        // 预览该副本的地狱怪暴击/抗暴/爆伤数值
        const tier = Math.max(0, (dungeon.level - 50) / 10);
        const scaleFactor = Math.pow(1.2, tier);
        const crit    = Math.min(700, Math.round(150 * scaleFactor));
        const antiCrit = Math.min(700, Math.round(150 * scaleFactor));
        const critDmg = Math.round(500 * scaleFactor);

        html += `<div class="dungeon-item ${!isUnlocked ? 'locked' : ''}" onclick="${isUnlocked ? `enterHellDungeon(${dungeon.level})` : ''}">
            <div class="dungeon-name" style="color:#ff4444">😈 ${dungeon.name}</div>
            <div class="dungeon-level">Lv.${dungeon.level} <span style="color:#ff4444;font-size:10px">🎟️${ticketCost}张</span></div>
            <div class="dungeon-stats" style="font-size:11px;color:#aaa;margin-top:2px">
                暴击:${crit}% &nbsp; 抗暴:${antiCrit}% &nbsp; 爆伤:${critDmg}%
            </div>
            ${!isUnlocked ? '<div class="dungeon-lock">🔒</div>' : ''}
        </div>`;
    }

    dungeonList.innerHTML = html;
}

// 进入地狱副本
function enterHellDungeon(level) {
    if (GameState.player.level < 50) {
        showToast('需要达到 Lv.50 才能进入地狱副本', 'error');
        return;
    }

    if (GameState.player.level < level) {
        showToast(`需要达到 Lv.${level} 才能进入此地狱副本`, 'error');
        return;
    }

    // 计算门票消耗：50-100级1张，110-150级2张，160-200级3张
    let ticketCost = 1;
    if (level >= 160) ticketCost = 3;
    else if (level >= 110) ticketCost = 2;

    if (!GameState.player.tickets || GameState.player.tickets.hell < ticketCost) {
        showToast(`地狱门票不足（需要${ticketCost}张）`, 'error');
        return;
    }

    // 如果在副本中，先退出副本
    if (GameState.battle.inDungeon) {
        exitDungeon();
    }

    GameState.battle.inDungeon = true;
    GameState.battle.dungeonType = 'hell';
    GameState.battle.dungeonLevel = level;

    closeModal('hellDungeonModal');
    updateAreaDisplay();

    // 生成地狱怪物（通过 spawnNextEnemy 走地狱副本专属逻辑，门票在生成时扣除）
    spawnNextEnemy();
    startAutoBattle();
    showToast(`已进入地狱副本 ${HELL_DUNGEONS.find(d => d.level === level)?.name || ''}！`);
}

// ========== 全局函数挂载 ==========
// 立即将模态框相关函数挂载到 window 对象（不依赖 window.onload）
window.closeModal = closeModal;
window.showModal = showModal;
window.showAreaModal = showAreaModal;
window.showEliteDungeonModal = showEliteDungeonModal;
window.showHellDungeonModal = showHellDungeonModal;
  window.showClassModal = showClassModal;
  window.selectArea = selectArea;
window.calculateEquipmentScore = calculateEquipmentScore;

  // 显示身上装备详情
  function showEquippedItemDetail(slot) {
    const item = GameState.equipment[slot];
    if (!item) {
      showToast('该槽位未装备物品');
      return;
    }

    // 使用原有的showItemDetail函数逻辑，但传入装备槽位的物品
    const detailModal = document.getElementById('itemDetailModal');
    if (!detailModal) return;

    // 获取槽位配置
    const slotConfig = EQUIPMENT_SLOTS[item.slot] || {name: '未知', icon: '?'};
    // 获取品质配置
    const qualityConfig = EQUIPMENT_QUALITIES[item.quality] || EQUIPMENT_QUALITIES[0];

    // 计算装备评分
    const score = Math.floor(calculateEquipmentScore(item));

    let html = `
        <div class="item-detail-header" style="color: ${qualityConfig.color}">
                <span class="item-detail-icon">${slotConfig.icon}</span>
                <div class="item-detail-name-group">
                    <span class="item-detail-name">${item.name}</span>
                    <span class="item-detail-quality">${item.qualityName}</span>
                </div>
            </div>
            <div class="item-detail-meta">
                <div class="item-detail-meta-item">
                    <span class="meta-label">槽位:</span>
                    <span class="meta-value">${slotConfig.name}</span>
                </div>
                <div class="item-detail-meta-item">
                    <span class="meta-label">强化等级:</span>
                    <span class="meta-value" style="color: #f39c12">Lv.${item.level}/${item.maxLevel}</span>
                </div>
                <div class="item-detail-meta-item">
                    <span class="meta-label">装备评分:</span>
                    <span class="meta-value" style="color: #ffd700; font-weight: bold">${score}</span>
                </div>
            </div>
            <div class="item-detail-stats-section">
                <div class="section-title">基础属性</div>
                <div class="item-detail-stats">
        `;

    // 显示基础属性
    if (item.stats) {
      const statMap = {
        atk: {name: '攻击力', unit: ''},
        def: {name: '防御力', unit: ''},
        hp: {name: '生命值', unit: ''},
        crit: {name: '暴击率', unit: '%'},
        critDmg: {name: '暴击伤害', unit: '%'},
        antiCrit: {name: '抗暴', unit: '%'},
        antiCritDmg: {name: '抗暴伤害', unit: '%'},
        atkSpd: {name: '攻击速度', unit: '%'},
        vamp: {name: '吸血', unit: '%'},
        penetrate: {name: '穿透', unit: '%'},
        expBonus: {name: '经验加成', unit: '%'},
        goldBonus: {name: '金币加成', unit: '%'},
        dropBonus: {name: '爆率加成', unit: '%'},
        maxAtk: {name: '最大攻击力', unit: '%'}
      };

      for (const [key, value] of Object.entries(item.stats)) {
        const statInfo = statMap[key];
        if (statInfo && value !== 0 && value !== null) {
                  // 格式化属性值，只保留一位小数
                  let formattedValue;
                  if (typeof value === 'number') {
                      if (value % 1 === 0) {
                          // 整数显示
                          formattedValue = value;
                      } else {
                          // 小数显示一位
                          formattedValue = parseFloat(value.toFixed(1));
                      }
                  } else {
                      formattedValue = value;
                  }
          html += `<div class="stat-row">
                        <span class="stat-name">${statInfo.name}:</span>
                        <span class="stat-value" style="color: #2ecc71">+${formattedValue}${statInfo.unit}</span>
                    </div>`;
        }
      }
    }

    html += '</div></div>';

    // 显示词缀属性（如果有）
    if (item.affixes && item.affixes.length > 0) {
      html += '<div class="item-detail-stats-section"><div class="section-title">词缀属性</div><div class="item-detail-affixes">';
      const affixMap = AFFIXES || {};
      item.affixes.forEach(affix => {
        const affixInfo = affixMap[affix.type] || {name: affix.type, icon: '?'};
        const unit = affixInfo.type === 'number' ? '' : '%';
                  // 格式化词缀值，只保留一位小数
                  let formattedValue;
                  if (typeof affix.value === 'number') {
                      if (affix.value % 1 === 0) {
                          // 整数显示
                          formattedValue = affix.value;
                      } else {
                          // 小数显示一位
                          formattedValue = parseFloat(affix.value.toFixed(1));
                      }
                  } else {
                      formattedValue = affix.value;
                  }
        html += `<div class="affix-row">
                    <span class="affix-icon">${affixInfo.icon}</span>
                    <span class="affix-name">${affixInfo.name}:</span>
                    <span class="affix-value" style="color: #f39c12">+${formattedValue}${unit}</span>
                </div>`;
      });
      html += '</div></div>';
    }

    // 显示宝石镶嵌状态（如果有）
    if (item.gems && item.gems.length > 0) {
      html += '<div class="item-detail-stats-section"><div class="section-title">宝石镶嵌 <span style="font-size:11px;color:#888">（点击宝石可查看详情/拆卸）</span></div><div class="item-detail-gems">';
      item.gems.forEach((gem, idx) => {
        if (gem) {
          const gemInfo = GEM_QUALITIES[gem.quality] || {name: '未知', color: '#808080'};
          const gemIcon = gem.affixes && gem.affixes.length > 0 ? gem.affixes[0].icon : (gem.affixIcon || '💎');
          html += `<div class="gem-slot filled" style="border-color: ${gemInfo.color};cursor:pointer;" onclick="showInlaidGemDetail('${slot}',${idx},true);" title="点击查看">
                        <span class="gem-icon">${gemIcon}</span>
                    </div>`;
        } else {
          html += `<div class="gem-slot empty" title="空孔位"><span class="gem-icon" style="color:#555">○</span></div>`;
        }
      });
      html += '</div></div>';
    }

    // 操作按钮
    html += '<div class="item-detail-actions">';
    html += `<button class="btn-equip-action btn-unequip" onclick="unequipItem('${slot}')">卸下</button>`;
    html += `<button class="btn-equip-action btn-enhance" onclick="enhanceEquippedItem('${slot}')">强化</button>`;
    html += '</div>';

    detailModal.querySelector('.modal-body').innerHTML = html;
    showModal('itemDetailModal');
  }

  // 强化身上装备
  function enhanceEquippedItem(slot) {
    const item = GameState.equipment[slot];
    if (!item) {
      showToast('该槽位无装备');
      return;
    }
    // 直接通过槽位名调用 enhanceItem（isEquipped=true 时 index 为槽位名）
    closeModal('itemDetailModal');
    enhanceItem(slot, true);
  }

  window.showEquippedItemDetail = showEquippedItemDetail;
  window.enhanceEquippedItem = enhanceEquippedItem;
  window.showInlaidGemDetail = showInlaidGemDetail;
  window.enhanceInlaidGem = enhanceInlaidGem;
  window.showOpenHoleConfirm = showOpenHoleConfirm;
  window.showOpenHoleConfirmEquipped = showOpenHoleConfirmEquipped;
  window.addEquipmentHole = addEquipmentHole;
  window.addEquippedHole = addEquippedHole;
  window.showSkillModal = showSkillModal;
  window.showSkillDetail = showSkillDetail;
  window.unequipSkill = unequipSkill;
  window.useSkillBook = useSkillBook;
  window.enhanceSkill = enhanceSkill;
  window.dismantleSkill = dismantleSkill;
  window.switchSkillTab = switchSkillTab;
  window.showGemDetail = showGemDetail;
  window.dismantleGem = dismantleGem;

  console.log('[Global Setup] 模态框函数已挂载到 window 对象');
console.log('[Global Setup] closeModal:', typeof window.closeModal);
console.log('[Global Setup] showModal:', typeof window.showModal);

// ========== 全局函数挂载 ==========

  // 显示物品详情 - 只显示装备
  function showItemDetail(index) {
      const item = GameState.inventory[index];
      if (!item) return;

      // 如果是技能书，直接跳转到技能学习
      if (item.type === 'skill') {
          useSkillBook(index);
          return;
      }

      const detailModal = document.getElementById('itemDetailModal');
      if (!detailModal) return;

      // 获取槽位配置
      const slotConfig = EQUIPMENT_SLOTS[item.slot] || {name: '未知', icon: '?'};
      // 获取品质配置
      const qualityConfig = EQUIPMENT_QUALITIES[item.quality] || EQUIPMENT_QUALITIES[0];

      // 计算装备评分
      const score = Math.floor(calculateEquipmentScore(item));

      // 检查是否比当前装备更好
      const equippedItem = GameState.equipment[item.slot];
      const isBetter = equippedItem && score > Math.floor(calculateEquipmentScore(equippedItem));

      // 简化头部：图标+名称+品质 一行，元数据紧凑排列
      // 计算孔数信息
      const filledGems = item.gems ? item.gems.filter(g => g !== null).length : 0;
      const totalGems = item.gems ? item.gems.length : 0;
      const maxHoles = item.initialGems >= 4 ? 5 : 4;
      const hasMaxHoles = totalGems >= maxHoles;
      const gemInfo = totalGems > 0 ? `<span style="color:#9b59b6">⬡${filledGems}/${totalGems}孔</span>` : '';
      
      let html = `
          <div class="item-detail-header-compact" style="color: ${qualityConfig.color}">
              <span class="item-icon-compact">${slotConfig.icon}</span>
              <div class="item-info-compact">
                  <div class="item-name-compact">${item.name} <span class="item-quality-tag" style="background:${qualityConfig.color}20;color:${qualityConfig.color}">${item.qualityName}</span></div>
                  <div class="item-meta-compact">
                      <span>${slotConfig.name}</span> | 
                      <span style="color:#f39c12">+${item.enhanceLevel}</span> | 
                      ${gemInfo}
                      <span style="color:#ffd700">评分:${score}${isBetter?'↑':''}</span>
                  </div>
              </div>
          </div>
          <div class="item-stats-compact">
      `;

      // 基础属性 - 紧凑网格布局
      if (item.stats) {
          const statMap = {
              atk: {name: '攻击', unit: ''},
              def: {name: '防御', unit: ''},
              hp: {name: '生命', unit: ''},
              crit: {name: '暴击', unit: '%'},
              critDmg: {name: '暴伤', unit: '%'},
              antiCrit: {name: '抗暴', unit: '%'},
              antiCritDmg: {name: '抗暴伤', unit: '%'},
              atkSpd: {name: '攻速', unit: '%'},
              vamp: {name: '吸血', unit: '%'},
              penetrate: {name: '穿透', unit: '%'},
              expBonus: {name: '经验', unit: '%'},
              goldBonus: {name: '金币', unit: '%'},
              dropBonus: {name: '爆率', unit: '%'}
          };

          html += '<div class="stats-grid-compact">';
          for (const [key, value] of Object.entries(item.stats)) {
              const statInfo = statMap[key];
              if (statInfo && value !== 0 && value !== null) {
                  // 格式化属性值，只保留一位小数
                  let formattedValue;
                  if (typeof value === 'number') {
                      if (value % 1 === 0) {
                          // 整数显示
                          formattedValue = value;
                      } else {
                          // 小数显示一位
                          formattedValue = parseFloat(value.toFixed(1));
                      }
                  } else {
                      formattedValue = value;
                  }
                  html += `<div class="stat-cell"><span class="stat-name-compact">${statInfo.name}</span><span class="stat-value-compact">+${formattedValue}${statInfo.unit}</span></div>`;
              }
          }
          html += '</div>';
      }

      // 词缀标签已去除（简化界面）

      // 宝石孔位显示：点击已镶嵌宝石弹出详情/拆卸；点击空孔位提示镶嵌
      if (item.gems && item.gems.length > 0) {
          html += '<div class="gems-row-compact">';
          item.gems.forEach((gem, i) => {
              if (gem) {
                  const gemIcon = gem.affixes && gem.affixes.length > 0 ? gem.affixes[0].icon : (gem.affixIcon || '💎');
                  html += `<span class="gem-icon-compact gem-filled" style="color:${gem.color};border-color:${gem.color}" title="点击查看宝石" onclick="showInlaidGemDetail(window._currentItemIndex,${i},false)">${gemIcon}</span>`;
              } else {
                  html += `<span class="gem-empty-compact" title="点击镶嵌宝石" onclick="showGemSelectionForEquip(window._currentItemIndex)">⬡</span>`;
              }
          });
          html += '</div>';
      }

      html += '</div>';

      document.getElementById('itemDetailContent').innerHTML = html;

      // 保存当前装备索引，供镶嵌功能使用
      window._currentItemIndex = index;

      // 强化费用和成功率显示
      const enhanceLevel = item.enhanceLevel || 0;
      const enhanceCost = (enhanceLevel * 100 + 100) * 10; // 金币消耗×10
      const successRate = ENHANCE_SUCCESS_RATE[Math.min(enhanceLevel, ENHANCE_SUCCESS_RATE.length - 1)];
      const requiredShards = getRequiredShardsForEnhance(enhanceLevel);
      const enhanceSection = document.getElementById('enhanceSection');
      if (enhanceLevel < item.maxLevel) {
          enhanceSection.innerHTML = `
              <div class="enhance-cost-row">
                  <span>强化材料: <span class="enhance-cost-value">${requiredShards}碎片</span></span>
                  <span>金币: <span class="enhance-cost-value">${enhanceCost}</span></span>
              </div>
              <div class="enhance-cost-row" style="margin-top:4px;">
                  <span class="enhance-success-rate">成功率: ${successRate}%</span>
              </div>
              <div style="font-size:12px;color:#888;text-align:center;">有保护卷：失败等级-1；无保护卷：失败装备消失</div>
          `;
      } else {
          enhanceSection.innerHTML = `<div style="text-align:center;color:#f39c12;font-size:14px;">已达到最大强化等级</div>`;
      }

      // 设置操作按钮
      const equipBtn = document.getElementById('btnEquipItem');
      const enhanceBtn = document.getElementById('btnEnhanceItem');
      const dismantleBtn = document.getElementById('btnDismantleItem');
      const inlayBtn = document.getElementById('btnInlayGem');

      // 检查是否有空槽位可以镶嵌（基于initialGems判断最大孔数）
      const initialGems = item.initialGems !== undefined ? item.initialGems : (item.gems ? item.gems.length : 0);
      const filledCount = item.gems ? item.gems.filter(g => g !== null).length : 0;
      const hasEmptySlot = item.gems && item.gems.some(g => g === null) || (item.gems && item.gems.length < maxHoles);
      inlayBtn.disabled = !hasEmptySlot;
      inlayBtn.style.opacity = hasEmptySlot ? '1' : '0.5';
      inlayBtn.style.cursor = hasEmptySlot ? 'pointer' : 'not-allowed';

      equipBtn.textContent = '装备';
      equipBtn.onclick = () => { equipItem(index); closeModal('itemDetailModal'); };
      enhanceBtn.onclick = () => { enhanceItem(index, false); showItemDetail(index); };
      inlayBtn.onclick = () => { showGemSelectionForEquip(index); };
      dismantleBtn.onclick = () => { dismantleItem(index, true); closeModal('itemDetailModal'); };

      showModal('itemDetailModal');
  }

// 从宝石仓库选择宝石镶嵌到装备
function showGemSelectionForEquip(equipIndex) {
    const item = GameState.inventory[equipIndex];
    if (!item || item.type !== 'equipment') {
        showToast('请选择装备');
        return;
    }

    // 找出空槽位（基于实际孔数，不写死6）
    if (!item.gems) {
        item.gems = [];
    }
    const emptySlots = [];
    for (let i = 0; i < item.gems.length; i++) {
        if (item.gems[i] === null) {
            emptySlots.push(i);
        }
    }

    if (emptySlots.length === 0) {
        showToast('该装备没有空余孔位');
        return;
    }


    // 获取宝石仓库
    const gemPool = GameState.gemPool;
    if (gemPool.length === 0) {
        showToast('宝石仓库为空，请先获取宝石');
        return;
    }

    // 创建宝石选择界面
    let html = `
        <div style="padding:10px;">
            <div style="margin-bottom:15px;color:#f39c12;font-size:14px;font-weight:bold;">
                选择宝石镶嵌到 ${item.name}（${emptySlots.length}个空位）
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-height:300px;overflow-y:auto;">
    `;

    gemPool.forEach((gem, gemIdx) => {
        recalculateGemStats(gem);
        const gemIcon = gem.affixes && gem.affixes.length > 0 ? gem.affixes[0].icon : (gem.affixIcon || '💎');
        
        // 生成详细属性信息
        let attrInfo = '';
        if (gem.affixes && gem.affixes.length > 0) {
            gem.affixes.forEach(affix => {
                const suffix = affix.type === 'percentage' ? '%' : '';
                const val = gem.stats[affix.key];
                attrInfo += `${affix.name}+${val}${suffix}<br>`;
            });
        } else {
            const affixConfig = GEM_AFFIXES[gem.affixType];
            const suffix = affixConfig.type === 'percentage' ? '%' : '';
            attrInfo = `${affixConfig.name}+${gem.stats[gem.affixType]}${suffix}`;
        }
        
        html += `
            <div class="gem-select-item" onclick="confirmGemInlay(${equipIndex}, ${gemIdx}, ${emptySlots[0]})"
                 style="cursor:pointer;padding:10px;background:rgba(155,89,182,0.15);border:1px solid rgba(155,89,182,0.3);border-radius:8px;text-align:center;">
                <div style="font-size:24px;">${gemIcon}</div>
                <div style="color:${gem.color};font-size:11px;font-weight:bold;">${gem.name}</div>
                <div style="color:#f39c12;font-size:10px;margin:4px 0;">${attrInfo}</div>
                <div style="color:#888;font-size:11px;">Lv.${gem.level}</div>
            </div>
        `;
    });

    html += `
            </div>
            <button onclick="closeModal('gemSelectionModal')" style="margin-top:15px;width:100%;padding:12px;background:#333;border:none;border-radius:8px;color:#fff;cursor:pointer;">取消</button>
        </div>
    `;

    // 检查模态框是否存在，不存在则创建
    let gemSelectionModal = document.getElementById('gemSelectionModal');
    if (!gemSelectionModal) {
        gemSelectionModal = document.createElement('div');
        gemSelectionModal.id = 'gemSelectionModal';
        gemSelectionModal.className = 'modal';
        gemSelectionModal.innerHTML = '<div class="modal-content" style="max-width:400px;background:#1a1a2e;border:1px solid #3a3a5c;border-radius:12px;"><div class="modal-body" id="gemSelectionContent"></div></div>';
        document.body.appendChild(gemSelectionModal);
    }

    document.getElementById('gemSelectionContent').innerHTML = html;
    showModal('gemSelectionModal');
}

// 确认镶嵌宝石
function confirmGemInlay(equipIndex, gemIndex, slotIndex) {
    const item = GameState.inventory[equipIndex];
    const gem = GameState.gemPool[gemIndex];

    if (!item || !gem) {
        showToast('装备或宝石不存在');
        return;
    }

    // 镶嵌宝石
    if (!item.gems) {
        item.gems = [];
    }
    // 确保槽位存在
    while (item.gems.length <= slotIndex) {
        item.gems.push(null);
    }
    item.gems[slotIndex] = gem;

    // 从宝石仓库移除
    GameState.gemPool.splice(gemIndex, 1);

    // 重新计算装备属性
    recalculateEquipmentStats(item);

    // 关闭宝石选择模态框
    closeModal('gemSelectionModal');

    // 刷新宝石仓库列表（关键！否则宝石不会实时消失）
    renderGemList();

    // 刷新装备详情
    showItemDetail(equipIndex);
    showToast(`成功镶嵌 ${gem.affixName}`);
}

// 已装备物品选择宝石镶嵌
function showEquippedGemSelection(slot) {
    const item = GameState.equipment[slot];
    if (!item) {
        showToast('该槽位未装备物品');
        return;
    }

    // 找出空槽位（基于实际孔数，不写死6）
    if (!item.gems) {
        item.gems = [];
    }
    const emptySlots = [];
    for (let i = 0; i < item.gems.length; i++) {
        if (item.gems[i] === null) {
            emptySlots.push(i);
        }
    }

    if (emptySlots.length === 0) {
        showToast('该装备没有空余孔位');
        return;
    }

    const gemPool = GameState.gemPool;
    if (gemPool.length === 0) {
        showToast('宝石仓库为空，请先获取宝石');
        return;
    }

    let html = `
        <div style="padding:10px;">
            <div style="margin-bottom:15px;color:#f39c12;font-size:14px;font-weight:bold;">
                选择宝石镶嵌到 ${item.name}（${emptySlots.length}个空位）
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-height:300px;overflow-y:auto;">
    `;

    gemPool.forEach((gem, gemIdx) => {
        recalculateGemStats(gem);
        const gemIcon = gem.affixes && gem.affixes.length > 0 ? gem.affixes[0].icon : (gem.affixIcon || '💎');
        
        // 生成详细属性信息
        let attrInfo = '';
        if (gem.affixes && gem.affixes.length > 0) {
            gem.affixes.forEach(affix => {
                const suffix = affix.type === 'percentage' ? '%' : '';
                const val = gem.stats[affix.key];
                attrInfo += `${affix.name}+${val}${suffix}<br>`;
            });
        } else {
            const affixConfig = GEM_AFFIXES[gem.affixType];
            const suffix = affixConfig.type === 'percentage' ? '%' : '';
            attrInfo = `${affixConfig.name}+${gem.stats[gem.affixType]}${suffix}`;
        }
        
        html += `
            <div class="gem-select-item" onclick="confirmEquippedGemInlay('${slot}', ${gemIdx}, ${emptySlots[0]})"
                 style="cursor:pointer;padding:10px;background:rgba(155,89,182,0.15);border:1px solid rgba(155,89,182,0.3);border-radius:8px;text-align:center;">
                <div style="font-size:24px;">${gemIcon}</div>
                <div style="color:${gem.color};font-size:11px;font-weight:bold;">${gem.name}</div>
                <div style="color:#f39c12;font-size:10px;margin:4px 0;">${attrInfo}</div>
                <div style="color:#888;font-size:11px;">Lv.${gem.level}</div>
            </div>
        `;
    });

    html += `
            </div>
            <button onclick="closeModal('gemSelectionModal')" style="margin-top:15px;width:100%;padding:12px;background:#333;border:none;border-radius:8px;color:#fff;cursor:pointer;">取消</button>
        </div>
    `;

    let gemSelectionModal = document.getElementById('gemSelectionModal');
    if (!gemSelectionModal) {
        gemSelectionModal = document.createElement('div');
        gemSelectionModal.id = 'gemSelectionModal';
        gemSelectionModal.className = 'modal';
        gemSelectionModal.innerHTML = '<div class="modal-content" style="max-width:400px;background:#1a1a2e;border:1px solid #3a3a5c;border-radius:12px;"><div class="modal-body" id="gemSelectionContent"></div></div>';
        document.body.appendChild(gemSelectionModal);
    }

    document.getElementById('gemSelectionContent').innerHTML = html;
    showModal('gemSelectionModal');
}

// 确认已装备物品镶嵌宝石
function confirmEquippedGemInlay(slot, gemIndex, slotIndex) {
    const item = GameState.equipment[slot];
    const gem = GameState.gemPool[gemIndex];

    if (!item || !gem) {
        showToast('装备或宝石不存在');
        return;
    }

    if (!item.gems) {
        item.gems = [];
    }
    while (item.gems.length <= slotIndex) {
        item.gems.push(null);
    }
    item.gems[slotIndex] = gem;

    GameState.gemPool.splice(gemIndex, 1);
    recalculateEquipmentStats(item);
    updateCharacterStats();
    updateEquipmentSlots();

    // 刷新宝石仓库列表（关键！否则宝石不会实时消失）
    renderGemList();

    closeModal('gemSelectionModal');
    showEquippedItemDetail(slot);
    showToast(`成功镶嵌 ${gem.affixName}`);
}

// 显示已装备物品详情
function showEquippedItemDetail(slot) {
    const item = GameState.equipment[slot];
    if (!item) {
        showToast('该槽位未装备物品');
        return;
    }

    // 使用物品详情模态框显示装备详情
    const detailModal = document.getElementById('itemDetailModal');
    if (!detailModal) return;

    // 获取槽位配置
    const slotConfig = EQUIPMENT_SLOTS[item.slot] || {name: '未知', icon: '?'};
    // 获取品质配置
    const qualityConfig = EQUIPMENT_QUALITIES[item.quality] || EQUIPMENT_QUALITIES[0];

    // 计算装备评分
    const score = Math.floor(calculateEquipmentScore(item));

    // 计算孔数信息
    const filledGems = item.gems ? item.gems.filter(g => g !== null).length : 0;
    const totalGems = item.gems ? item.gems.length : 0;
    const gemInfo = totalGems > 0 ? `<span style="color:#9b59b6">⬡${filledGems}/${totalGems}孔</span>` : '';

    // 紧凑头部
    let html = `
        <div class="item-detail-header-compact" style="color: ${qualityConfig.color}">
            <span class="item-icon-compact">${slotConfig.icon}</span>
            <div class="item-info-compact">
                <div class="item-name-compact">${item.name} <span class="item-quality-tag" style="background:${qualityConfig.color}20;color:${qualityConfig.color}">${item.qualityName}</span></div>
                <div class="item-meta-compact">
                    <span>${slotConfig.name}</span> | 
                    <span style="color:#f39c12">+${item.enhanceLevel}</span> | 
                    ${gemInfo}
                    <span style="color:#ffd700">评分:${score}</span>
                </div>
            </div>
        </div>
        <div class="item-stats-compact">
    `;

    // 紧凑网格属性
    if (item.stats) {
        const statMap = {
            atk: {name: '攻击', unit: ''},
            def: {name: '防御', unit: ''},
            hp: {name: '生命', unit: ''},
            crit: {name: '暴击', unit: '%'},
            critDmg: {name: '暴伤', unit: '%'},
            antiCrit: {name: '抗暴', unit: '%'},
            antiCritDmg: {name: '抗暴伤', unit: '%'},
            atkSpd: {name: '攻速', unit: '%'},
            vamp: {name: '吸血', unit: '%'},
            penetrate: {name: '穿透', unit: '%'},
            expBonus: {name: '经验', unit: '%'},
            goldBonus: {name: '金币', unit: '%'},
            dropBonus: {name: '爆率', unit: '%'},
            maxAtk: {name: '最大攻', unit: '%'}
        };

        html += '<div class="stats-grid-compact">';
        for (const [key, value] of Object.entries(item.stats)) {
            const statInfo = statMap[key];
            if (statInfo && value !== 0 && value !== null) {
                html += `<div class="stat-cell"><span class="stat-name-compact">${statInfo.name}</span><span class="stat-value-compact">+${value}${statInfo.unit}</span></div>`;
            }
        }
        html += '</div>';
    }

    // 词缀标签已去除（简化界面）

    // 宝石孔位：点击已镶嵌宝石弹出详情/拆卸；点击空孔位可镶嵌
    if (item.gems && item.gems.length > 0) {
        html += '<div class="gems-row-compact">';
        item.gems.forEach((gem, idx) => {
            if (gem) {
                const gemIcon = gem.affixes && gem.affixes.length > 0 ? gem.affixes[0].icon : (gem.affixIcon || '💎');
                html += `<span class="gem-icon-compact gem-filled" style="color:${gem.color};border-color:${gem.color}" title="点击查看宝石" onclick="showInlaidGemDetail('${slot}',${idx},true)">${gemIcon}</span>`;
            } else {
                html += `<span class="gem-empty-compact" title="点击镶嵌宝石" onclick="showEquippedGemSelection('${slot}')">⬡</span>`;
            }
        });
        html += '</div>';
    }

    // 强化费用显示
    const enhanceLevel = item.enhanceLevel || 0;
    const enhanceCost = (enhanceLevel * 100 + 100) * 10; // 金币消耗×10
    const successRate = ENHANCE_SUCCESS_RATE[Math.min(enhanceLevel, ENHANCE_SUCCESS_RATE.length - 1)];
    const requiredShards = getRequiredShardsForEnhance(enhanceLevel);
    html += `
        <div class="item-detail-enhance-section">
            <div class="enhance-cost-row">
                <span>材料: <span class="enhance-cost-value">${requiredShards}碎片</span></span>
                <span>金币: <span class="enhance-cost-value">${enhanceCost}</span></span>
            </div>
            <div class="enhance-cost-row">
                <span class="enhance-success-rate">成功率: ${successRate}%</span>
            </div>
        </div>
    `;

    // 检查是否有空槽位可以镶嵌
    const hasEmptySlot = item.gems && item.gems.some(g => g === null || g === undefined);
    const canAddHole = item.gems && item.gems.length < (item.initialGems >= 4 ? 5 : 4);

    // 操作按钮
    html += '<div class="item-detail-actions" style="display:flex;gap:8px;padding:14px 16px;background:rgba(0,0,0,0.2);border-radius:0 0 12px 12px;flex-wrap:wrap;">';
    html += `<button class="btn-action btn-equip" style="flex:1;min-width:60px;padding:10px 6px;background:linear-gradient(135deg,#e74c3c,#c0392b);border:none;border-radius:10px;color:#fff;cursor:pointer;font-size:13px;" onclick="unequipItem('${slot}')">卸下</button>`;
    html += `<button class="btn-action btn-enhance" style="flex:1;min-width:60px;padding:10px 6px;background:linear-gradient(135deg,#f39c12,#e67e22);border:none;border-radius:10px;color:#fff;cursor:pointer;font-size:13px;" onclick="enhanceEquippedItem('${slot}'); showEquippedItemDetail('${slot}')">强化</button>`;
    html += `<button class="btn-action btn-inlay" style="flex:1;min-width:60px;padding:10px 6px;background:linear-gradient(135deg,#9b59b6,#8e44ad);border:none;border-radius:10px;color:#fff;cursor:pointer;font-size:13px;opacity:${hasEmptySlot?1:0.5};" onclick="showEquippedGemSelection('${slot}')">${hasEmptySlot?'镶嵌':'宝石已满'}</button>`;
    if (canAddHole) {
        html += `<button class="btn-action btn-open-hole" style="flex:1;min-width:60px;padding:10px 6px;background:linear-gradient(135deg,#16a085,#1abc9c);border:none;border-radius:10px;color:#fff;cursor:pointer;font-size:13px;" onclick="showOpenHoleConfirmEquipped('${slot}')">开孔</button>`;
    }
    html += '</div>';

    // 找到模态框body元素
    const modalBody = detailModal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = html;
        showModal('itemDetailModal');
    } else {
        // 如果找不到body，直接设置innerHTML
        detailModal.innerHTML = html;
        showModal('itemDetailModal');
    }
}

// 显示技能详情
function showSkillDetail(index) {
    const skill = GameState.inventory[index];
    if (!skill || skill.type !== 'skill') return;

    const detailModal = document.getElementById('skillDetailModal');
    if (!detailModal) return;

    window._currentSkillIndex = index; // 保存索引供按钮使用

    const template = getSkillTemplate(skill.skillName);
    const totalDamage = Math.floor(skill.damage * skill.multiplier * (1 + skill.level * 0.1));

    document.getElementById('skillDetailContent').innerHTML = `
        <div class="skill-detail-header" style="color: ${skill.color}">
            <span class="skill-detail-icon">${skill.icon}</span>
            <span class="skill-detail-name">${skill.name}</span>
            <span class="skill-detail-quality">${skill.qualityName}</span>
        </div>
        <div class="skill-detail-stats">
            <div>冷却: ${skill.cooldown}秒</div>
            <div>伤害: ${skill.damage}% × ${skill.multiplier} × (1 + 等级×0.1)</div>
            <div>当前伤害: ${totalDamage}%</div>
            <div>等级: ${skill.level}/${skill.maxLevel}</div>
        </div>
    `;

    showModal('skillDetailModal');
}

// 更新已镶嵌宝石的详情内容（不重新打开模态框）
// equipRef: 装备的index(背包)或slot(身上)，slotIdx: 孔位下标，isEquipped: 是否身上装备
function updateGemDetailContent(equipRef, slotIdx, isEquipped) {
    console.log('updateGemDetailContent called with:', equipRef, slotIdx, isEquipped);
    let equip;
    if (isEquipped) {
        equip = GameState.equipment[equipRef];
    } else {
        equip = GameState.inventory[equipRef];
    }
    console.log('Equip found:', equip ? equip.name : 'not found');
    if (!equip || !equip.gems) {
        console.log('No equip or gems');
        return;
    }
    const gem = equip.gems[slotIdx];
    console.log('Gem found:', gem ? gem.name : 'not found');
    if (!gem) {
        console.log('No gem');
        return;
    }
    console.log('Gem level before recalculate:', gem.level);
    console.log('Gem stats before recalculate:', gem.stats);

    recalculateGemStats(gem);
    console.log('Gem level after recalculate:', gem.level);
    console.log('Gem stats after recalculate:', gem.stats);

    // 生成词缀列表
    let affixHtml = '';
    if (gem.affixes && gem.affixes.length > 0) {
        gem.affixes.forEach(affix => {
            const suffix = affix.type === 'percentage' ? '%' : '';
            const statVal = gem.stats[affix.key] !== undefined ? gem.stats[affix.key] : affix.value;
            affixHtml += `<div class="inlaid-gem-affix-row">${affix.icon} <span>${affix.name}</span><span style="color:#f39c12;margin-left:auto">+${statVal}${suffix}</span></div>`;
        });
    } else {
        const ac = GEM_AFFIXES[gem.affixType] || {};
        const suffix = ac.type === 'percentage' ? '%' : '';
        affixHtml = `<div class="inlaid-gem-affix-row">${gem.affixIcon || '💎'} <span>${ac.name || gem.affixName}</span><span style="color:#f39c12;margin-left:auto">+${gem.stats[gem.affixType] || gem.value}${suffix}</span></div>`;
    }

    const detailModal = document.getElementById('gemDetailModal');
    if (!detailModal) return;

    console.log('Generating affixHtml:', affixHtml);
    console.log('Gem level for display:', gem.level);
    
    document.getElementById('gemDetailContent').innerHTML = `
        <div class="gem-detail-header" style="color: ${gem.color}">
            <span class="gem-detail-icon">💎</span>
            <span class="gem-detail-name">${gem.name}</span>
            <span class="gem-detail-quality">${gem.qualityName}</span>
        </div>
        <div class="inlaid-gem-affixes">${affixHtml}</div>
        <div style="color:#888;font-size:12px;text-align:center;margin-top:8px">等级: ${gem.level}/${gem.maxLevel}</div>
    `;
    
    console.log('DOM updated successfully');

    // 保存参数供按钮使用
    window._gemDetailEquipRef = equipRef;
    window._gemDetailSlotIdx = slotIdx;
    window._gemDetailIsEquipped = isEquipped;

    // 覆盖弹窗按钮
    const actions = detailModal.querySelector('.modal-body .modal-actions');
    actions.innerHTML = `
        <button class="btn-action btn-dismantle" onclick="enhanceInlaidGem()">强化</button>
        <button class="btn-action btn-dismantle" onclick="unequipAndCloseInlaidGem()">拆卸</button>
        <button class="btn-action btn-enhance" onclick="closeModal('gemDetailModal')">关闭</button>
    `;
}

// 显示已镶嵌宝石的详情弹窗（支持预览属性和拆卸）
// equipRef: 装备的index(背包)或slot(身上)，slotIdx: 孔位下标，isEquipped: 是否身上装备
function showInlaidGemDetail(equipRef, slotIdx, isEquipped) {
    // 首先更新宝石详情内容
    updateGemDetailContent(equipRef, slotIdx, isEquipped);
    // 然后显示模态框
    showModal('gemDetailModal');
}

// 强化已镶嵌的宝石（供按钮调用）
function enhanceInlaidGem() {
    const equipRef = window._gemDetailEquipRef;
    const slotIdx = window._gemDetailSlotIdx;
    const isEquipped = window._gemDetailIsEquipped;

    if (equipRef === undefined || slotIdx === undefined || isEquipped === undefined) {
        showToast('参数错误');
        return;
    }

    let equip;
    if (isEquipped) {
        equip = GameState.equipment[equipRef];
    } else {
        equip = GameState.inventory[equipRef];
    }
    if (!equip || !equip.gems) {
        showToast('装备不存在');
        return;
    }

    const gem = equip.gems[slotIdx];
    if (!gem) {
        showToast('宝石不存在');
        return;
    }

    if (gem.level >= gem.maxLevel) {
        showToast('已达到最大等级');
        return;
    }

    // 计算强化所需材料（碎片+金币×10）
    const requiredShards = getRequiredShardsForEnhance(gem.level);
    const cost = (gem.level * 50 + 50) * 10; // 金币消耗×10
    const qualityName = GEM_QUALITIES[gem.quality]?.name || '宝石';

    // 检查宝石碎片是否足够（使用对应品质的碎片）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const gemQualityKey = -gem.quality - 1;
    const gemShards = GameState.stats.qualityShards[gemQualityKey] || 0;
    if (gemShards < requiredShards) {
        showToast(`${qualityName}碎片不足！需要${requiredShards}个，当前${gemShards}个`);
        return;
    }

    // 检查金币是否足够
    if (GameState.player.gold < cost) {
        showToast('金币不足');
        return;
    }

    // 扣除对应品质的宝石碎片和金币
    GameState.stats.qualityShards[gemQualityKey] -= requiredShards;
    GameState.player.gold -= cost;

    const titleBonus = getTitleBonus();
    const baseSuccessRate = ENHANCE_SUCCESS_RATE[Math.min(gem.level, ENHANCE_SUCCESS_RATE.length - 1)];
    const successRate = Math.min(100, baseSuccessRate + titleBonus.enhanceBonus * 100);
    if (Math.random() * 100 < successRate) {
        gem.level++;
        recalculateGemStats(gem);
        showToast(`${qualityName}强化成功! 等级: ${gem.level} (消耗${requiredShards}${qualityName}碎片)`);
    } else {
        // 强化失败：检查是否有宝石保护卷
        if (GameState.consumables && GameState.consumables.gemProtect > 0) {
            GameState.consumables.gemProtect--;
            if (gem.level > 0) {
                gem.level--;
                recalculateGemStats(gem); // 重新计算宝石属性
            }
            showToast('强化失败！保护卷生效，等级-1');
        } else {
            // 无保护卷：宝石消失
            const gemName = gem.name;
            equip.gems[slotIdx] = null;
            showToast(`强化失败！${gemName}消失了`);
        }
    }

    // 重新计算装备属性
    recalculateEquipmentStats(equip);
    
    console.log('After enhancement - Gem level:', gem.level);
    console.log('After enhancement - Gem exists:', !!equip.gems[slotIdx]);
    
    // 直接更新宝石详情内容，不重新打开模态框
    if (equip.gems[slotIdx]) {
        // 宝石还存在，更新详情
        console.log('Calling updateGemDetailContent...');
        updateGemDetailContent(equipRef, slotIdx, isEquipped);
    } else {
        // 宝石消失，关闭详情弹窗
        console.log('Gem disappeared, closing modal...');
        closeModal('gemDetailModal');
    }
    
    // 刷新界面
    if (isEquipped) {
        renderCharacterPanel();
    } else {
        renderInventory();
    }
    
    // 如果宝石消失，刷新装备详情
    if (!equip.gems[slotIdx]) {
        if (isEquipped) {
            showEquippedItemDetail(equipRef);
        } else {
            showItemDetail(equipRef);
        }
    }
}

// 拆卸镶嵌宝石并关闭弹窗（供按钮调用）
function unequipAndCloseInlaidGem() {
    const equipRef = window._gemDetailEquipRef;
    const slotIdx = window._gemDetailSlotIdx;
    const isEquipped = window._gemDetailIsEquipped;

    if (equipRef === undefined || slotIdx === undefined || isEquipped === undefined) {
        showToast('参数错误');
        return;
    }

    unequipGem(equipRef, slotIdx, isEquipped);
    closeModal('gemDetailModal');

    // 刷新对应装备的详情弹窗
    if (isEquipped) {
        showEquippedItemDetail(equipRef);
    } else {
        showItemDetail(equipRef);
    }
}

// 显示宝石详情
function showGemDetail(gemIndex) {
    const gem = GameState.gemPool[gemIndex];
    if (!gem) return;

    const detailModal = document.getElementById('gemDetailModal');
    if (!detailModal) return;

    window._currentGemIndex = gemIndex; // 保存索引供按钮使用

    recalculateGemStats(gem);

    // 生成3词缀显示
    let affixHtml = '';
    if (gem.affixes && gem.affixes.length > 0) {
        gem.affixes.forEach(affix => {
            const suffix = affix.type === 'percentage' ? '%' : '';
            const statVal = gem.stats[affix.key];
            affixHtml += `<div>${affix.icon} ${affix.name}: +${statVal}${suffix}</div>`;
        });
    } else {
        // 兼容旧格式
        const affixConfig = GEM_AFFIXES[gem.affixType];
        const suffix = affixConfig.type === 'percentage' ? '%' : '';
        affixHtml = `<div>${gem.affixIcon} ${affixConfig.name}: +${gem.stats[gem.affixType]}${suffix}</div>`;
    }

    document.getElementById('gemDetailContent').innerHTML = `
        <div class="gem-detail-header" style="color: ${gem.color}">
            <span class="gem-detail-icon">💎</span>
            <span class="gem-detail-name">${gem.name}</span>
            <span class="gem-detail-quality">${gem.qualityName}</span>
        </div>
        <div class="gem-detail-stats">
            ${affixHtml}
            <div>等级: ${gem.level}/${gem.maxLevel}</div>
        </div>
    `;

    showModal('gemDetailModal');
}

// 显示技能模态框
function showSkillModal(slot) {
    // slot 为 1-4（data-slot 属性），转为 0-3 索引
    const slotIndex = slot - 1;
    const skill = GameState.skills[slotIndex];

    window._currentEquippedSkillSlot = slotIndex;

    if (!skill) {
        // 槽位为空，不弹模态框（可以扩展为选择技能界面）
        showToast(`技能槽 ${slot} 为空，请从技能池装备技能`);
        return;
    }

    const totalDamage = Math.floor(skill.damage * skill.multiplier * (1 + skill.level * 0.1));

    document.getElementById('equippedSkillDetailContent').innerHTML = `
        <div class="skill-detail-header" style="color: ${skill.color}">
            <span class="skill-detail-icon">${skill.icon}</span>
            <span class="skill-detail-name">${skill.name}</span>
            <span class="skill-detail-quality">${skill.qualityName}</span>
        </div>
        <div class="skill-detail-stats">
            <div>冷却: ${skill.cooldown}秒</div>
            <div>伤害: ${skill.damage}% × ${skill.multiplier} × (1 + 等级×0.1)</div>
            <div>当前伤害: ${totalDamage}%</div>
            <div>等级: ${skill.level}/${skill.maxLevel}</div>
        </div>
    `;

    showModal('equippedSkillDetailModal');
}



// 进入副本
function enterDungeon(type, level) {
    const requiredTickets = type === 'elite' ? 1 : 2;
    const ticketType = type === 'elite' ? 'elite' : 'hell';

    if (GameState.player.tickets[ticketType] < requiredTickets) {
        showToast(`${ticketType === 'elite' ? '精英' : '地狱'}门票不足`);
        return;
    }

    GameState.player.tickets[ticketType] -= requiredTickets;
    GameState.battle.inDungeon = true;
    GameState.battle.dungeonType = type;
    GameState.battle.dungeonLevel = level;

    closeModal(type === 'elite' ? 'eliteDungeonModal' : 'hellDungeonModal');
    updateTopBar();
    updateAreaDisplay();
    showToast(`进入${type === 'elite' ? '精英' : '地狱'}副本`);
}

// 退出副本
function exitDungeon() {
    GameState.battle.inDungeon = false;
    GameState.battle.dungeonType = null;
    GameState.battle.dungeonLevel = 0;
    showToast('已退出副本');
}

// 自动副本
function autoDungeon(type, level) {
    enterDungeon(type, level);
    if (!GameState.battle.isAuto) {
        startAutoBattle();
    }
}

// 显示设置
function showSettings() {
    showModal('settingsModal');
    document.getElementById('settingsPlayerId').value = GameState.player.playerId || '';
    document.getElementById('settingsPlayerName').value = GameState.player.name || '';
    document.getElementById('settingsPlayerPassword').value = GameState.player.password || '';
}

// ============================================================
// 每日任务系统
// 重置时间：每天早上6点
// 进度存储：localStorage（key: daily_tasks_YYYY-MM-DD）
// ============================================================

// 每日任务配置
// rewardType: 'tickets' = 精英门票（默认）
const DAILY_TASKS = [
    {
        id: 'kill_normal',
        icon: '⚔️',
        name: '区域扫荡',
        desc: '击杀区域内普通怪物',
        target: 10000,
        reward: 1000,
        rewardType: 'tickets',
    },
    {
        id: 'kill_elite',
        icon: '👹',
        name: '精英猎杀',
        desc: '击杀精英副本怪物',
        target: 5000,
        reward: 1000,
        rewardType: 'tickets',
    },
    {
        id: 'kill_hell',
        icon: '💀',
        name: '地狱征伐',
        desc: '击杀地狱BOSS',
        target: 500,
        reward: 1000,
        rewardType: 'tickets',
    },
    {
        id: 'buy_gem',
        icon: '💎',
        name: '宝石收集',
        desc: '在黑市购买宝石',
        target: 2,
        reward: 1000,
        rewardType: 'tickets',
    },
    {
        id: 'buy_skill',
        icon: '📚',
        name: '技能研习',
        desc: '在黑市购买技能',
        target: 4,
        reward: 1000,
        rewardType: 'tickets',
    },
    {
        id: 'watch_ad',
        icon: '📺',
        name: '每日看广告',
        desc: '每日观看广告10次',
        target: 10,
        reward: 1000,
        rewardType: 'tickets',
    },
];

// 每日任务系统对象
const DailyTaskSystem = {
    // 获取今日的日期key（以早上6点为分界）
    getTodayKey() {
        const now = new Date();
        // 如果当前时间小于6点，则算昨天的任务周期
        if (now.getHours() < 6) {
            now.setDate(now.getDate() - 1);
        }
        return `daily_tasks_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    },

    // 读取今日任务数据（进度+领取状态）
    getData() {
        const key = this.getTodayKey();
        const raw = localStorage.getItem(key);
        if (raw) {
            try { return JSON.parse(raw); } catch(e) {}
        }
        // 初始化：所有任务进度为0，未领取
        const data = {};
        for (const task of DAILY_TASKS) {
            data[task.id] = { progress: 0, claimed: false };
        }
        return data;
    },

    // 保存今日任务数据
    saveData(data) {
        localStorage.setItem(this.getTodayKey(), JSON.stringify(data));
    },

    // 增加某任务的进度
    addProgress(taskId, amount = 1) {
        const data = this.getData();
        if (!data[taskId]) data[taskId] = { progress: 0, claimed: false };
        if (data[taskId].claimed) return; // 已领取不再累加
        const task = DAILY_TASKS.find(t => t.id === taskId);
        if (!task) return;
        data[taskId].progress = Math.min(task.target, (data[taskId].progress || 0) + amount);
        this.saveData(data);
    },

    // 领取某任务奖励
    claimReward(taskId) {
        const data = this.getData();
        if (!data[taskId]) return;
        if (data[taskId].claimed) {
            showToast('奖励已领取过了');
            return;
        }
        const task = DAILY_TASKS.find(t => t.id === taskId);
        if (!task) return;
        if ((data[taskId].progress || 0) < task.target) {
            showToast('任务尚未完成！');
            return;
        }
        data[taskId].claimed = true;
        this.saveData(data);
        // 根据奖励类型发放
        if (task.rewardType === 'tickets') {
            if (!GameState.player.tickets) GameState.player.tickets = {};
            GameState.player.tickets.elite = (GameState.player.tickets.elite || 0) + task.reward;
            showToast(`🎉 领取成功！获得 ${task.reward} 🎟️ 精英门票`);
        } else {
            GameState.player.diamonds = (GameState.player.diamonds || 0) + task.reward;
            showToast(`🎉 领取成功！获得 ${task.reward} 💎 钻石`);
        }
        saveGame();
        updateTopBar();
        renderDailyTasks(); // 刷新任务面板
    },

    // 获取指定任务的进度（用于外部查询）
    getProgress(taskId) {
        const data = this.getData();
        return data[taskId] ? (data[taskId].progress || 0) : 0;
    },

    isClaimed(taskId) {
        const data = this.getData();
        return data[taskId] ? !!data[taskId].claimed : false;
    },
};

// 渲染每日任务列表（动态生成到 questsModal 的 .quest-list）
function renderDailyTasks() {
    const container = document.getElementById('dailyTaskList');
    if (!container) return;

    const now = new Date();
    // 计算下次6点重置的倒计时
    let next6 = new Date(now);
    if (now.getHours() >= 6) {
        next6.setDate(next6.getDate() + 1);
    }
    next6.setHours(6, 0, 0, 0);
    const diffMs  = next6 - now;
    const diffH   = Math.floor(diffMs / 3600000);
    const diffM   = Math.floor((diffMs % 3600000) / 60000);
    const resetStr = `${diffH}小时${diffM}分后重置`;

    let html = `<div class="daily-reset-tip">🕕 每日任务 · ${resetStr}</div>`;

    for (const task of DAILY_TASKS) {
        const progress = DailyTaskSystem.getProgress(task.id);
        const claimed  = DailyTaskSystem.isClaimed(task.id);
        const done     = progress >= task.target;
        const pct      = Math.min(100, Math.floor(progress / task.target * 100));

        let btnHtml = '';
        if (claimed) {
            btnHtml = `<button class="daily-btn daily-btn-claimed" disabled>已领取</button>`;
        } else if (done) {
            btnHtml = `<button class="daily-btn daily-btn-claim" onclick="DailyTaskSystem.claimReward('${task.id}')">领取</button>`;
        } else {
            btnHtml = `<button class="daily-btn daily-btn-locked" disabled>未完成</button>`;
        }

        html += `
        <div class="daily-task-item ${claimed ? 'claimed' : done ? 'done' : ''}">
            <div class="daily-task-left">
                <span class="daily-task-icon">${task.icon}</span>
                <div class="daily-task-info">
                    <div class="daily-task-name">${task.name}</div>
                    <div class="daily-task-desc">${task.desc}</div>
                    <div class="daily-task-bar-wrap">
                        <div class="daily-task-bar" style="width:${pct}%"></div>
                    </div>
                    <div class="daily-task-progress">${progress.toLocaleString()} / ${task.target.toLocaleString()}</div>
                </div>
            </div>
            <div class="daily-task-right">
                <div class="daily-task-reward">+${task.reward} ${task.rewardType === 'tickets' ? '🎟️' : '💎'}</div>
                ${btnHtml}
            </div>
        </div>`;
    }

    container.innerHTML = html;
}

// 显示任务
function showQuests() {
    renderDailyTasks();
    showModal('questsModal');
}


// 显示关于
function showAbout() {
    showModal('aboutModal');
}

// 显示游戏指南
function showGuide() {
    showModal('guideModal');
}

// 显示数据统计
function showStatistics() {
    const stats = GameState.stats;
    const el = document.getElementById('statisticsContent');
    if (el) {
        el.innerHTML = `
            <div class="stat-row"><span>💀 击杀怪物</span><span>${formatNumber(stats.monstersKilled || 0)} 只</span></div>
            <div class="stat-row"><span>🎮 游戏时长</span><span>${formatPlayTime(stats.totalPlayTime || 0)}</span></div>
        `;
    }
    showModal('statisticsModal');
}

// ========== 兑换码系统 ==========
// 兑换码格式说明：
// - 固定码: PINGJIAVIP → VIP1 + 300钻
// - 专属码: 前5位数字×乘数 + ID最后2位
//   - ×123 + 最后2位 → VIP2 + 500钻 + 2000精英票 + 200地狱票
//   - ×1234 + 最后2位 → VIP3 + 2000钻 + 5000精英票 + 1000地狱票
//   - ×4321 + 最后2位 → 门票特权 + 2000钻 + 10000精英票 + 2000地狱票
//   - ×789 + 最后2位 → 稀有装备特权 + 2000钻 + 10000精英票 + 2000地狱票

// 兑换码使用记录（防重复）
function _getRedeemedSet() {
    try { return new Set(JSON.parse(localStorage.getItem('_rds') || '[]')); }
    catch(e) { return new Set(); }
}
function _markRedeemed(code) {
    const s = _getRedeemedSet(); s.add(code);
    localStorage.setItem('_rds', JSON.stringify([...s]));
}
function _isRedeemed(code) { return _getRedeemedSet().has(code); }

// 显示兑换码界面
function showRedeemCode() {
    renderRedeemModal();
    showModal('redeemCodeModal');
}

// 渲染兑换码弹窗内容
function renderRedeemModal() {
    // 只有在有玩家ID时才显示兑换码
    if (!GameState.player.playerId) {
        showToast('请先登录！');
        closeModal('redeemCodeModal');
        return;
    }
    const pid = GameState.player.playerId;
    const vipLevel = GameState.player.vipLevel;
    const privs = GameState.player.privileges || {};
    const totalAds = GameState.player.totalAdsWatched || 0;

    // VIP特权详情HTML
    const vipPrivilegeHtml = `
        <div class="vip-privilege-box">
            <div class="vip-privilege-title">🌟 VIP特权详情</div>
            <div class="vip-priv-grid">
                <div class="vip-priv-card ${vipLevel >= 1 ? 'vip-priv-active' : ''}">
                    <div class="vip-priv-name">VIP1</div>
                    <div class="vip-priv-threshold">📺 10次广告解锁</div>
                    <div class="vip-priv-item">✨ 经验/金币/爆率 +10%</div>
                    <div class="vip-priv-item">🎯 奇遇BOSS 1倍</div>
                    <div class="vip-priv-item">💎 每日免费 0钻</div>
                    <div class="vip-priv-item">📊 经验上限 1.5倍</div>
                    <div class="vip-priv-item">🎁 广告道具 1次/天</div>
                    <div class="vip-priv-item">🚫 免广告特权 无</div>
                </div>
                <div class="vip-priv-card ${vipLevel >= 2 ? 'vip-priv-active' : ''}">
                    <div class="vip-priv-name">VIP2</div>
                    <div class="vip-priv-threshold">📺 200次广告解锁</div>
                    <div class="vip-priv-item">✨ 经验/金币/爆率 +30%</div>
                    <div class="vip-priv-item">🎯 奇遇BOSS 2倍</div>
                    <div class="vip-priv-item">💎 每日免费 500钻</div>
                    <div class="vip-priv-item">📊 经验上限 2倍</div>
                    <div class="vip-priv-item">🎁 广告道具 5次/天</div>
                    <div class="vip-priv-item">🚫 免广告特权 无</div>
                </div>
                <div class="vip-priv-card ${vipLevel >= 3 ? 'vip-priv-active' : ''}">
                    <div class="vip-priv-name">VIP3</div>
                    <div class="vip-priv-threshold">📺 1000次广告解锁</div>
                    <div class="vip-priv-item">✨ 经验/金币/爆率 +50%</div>
                    <div class="vip-priv-item">🎯 奇遇BOSS 5倍</div>
                    <div class="vip-priv-item">💎 每日免费 2000钻</div>
                    <div class="vip-priv-item">📊 经验上限 2.5倍</div>
                    <div class="vip-priv-item">🎁 广告道具 10次/天</div>
                    <div class="vip-priv-item">🚫 免广告特权 无限 ♾️</div>
                </div>
            </div>
        </div>`;

    // VIP进度条数据
    const vipThresholds = [0, 10, 200, 1000];
    const vipColors = ['#888', '#4CAF50', '#2196F3', '#ff9800'];
    const vipNames = ['无VIP', 'VIP1', 'VIP2', 'VIP3'];
    let vipBarHtml = '';
    for (let i = 1; i <= 3; i++) {
        const from = vipThresholds[i-1], to = vipThresholds[i];
        const already = vipLevel >= i;
        const pct = already ? 100 : Math.min(100, Math.floor((totalAds - from) / (to - from) * 100));
        const label = already ? '✅ 已激活' : `${Math.max(0,totalAds-from)}/${to-from}`;
        vipBarHtml += `
        <div class="vip-bar-row">
            <span class="vip-bar-label" style="color:${vipColors[i]}">${vipNames[i]}</span>
            <div class="vip-bar-wrap">
                <div class="vip-bar-fill" style="width:${pct}%;background:${vipColors[i]}"></div>
            </div>
            <span class="vip-bar-val">${label}</span>
        </div>`;
    }

    // 当前特权状态（隐藏门票特权和稀有装备特权，不显示给玩家）
    const privStatus = `
        <div class="priv-status-row">
            <span>🎟️ 门票特权</span>
            <span class="${privs.ticketPriv ? 'priv-on' : 'priv-off'}">${privs.ticketPriv ? '✅ 已激活' : '未激活'}</span>
        </div>
        <div class="priv-status-row">
            <span>💠 稀有装备特权</span>
            <span class="${privs.rareEquipPriv ? 'priv-on' : 'priv-off'}">${privs.rareEquipPriv ? '✅ 已激活' : '未激活'}</span>
        </div>`;
    // 特权状态区域隐藏（不渲染给玩家看）
    const privStatusHidden = ''; // 不显示特权状态

    const container = document.getElementById('redeemModalBody');
    if (!container) return;
    container.innerHTML = `
        <div class="redeem-id-box">
            <div class="redeem-id-label">🆔 我的专属ID</div>
            <div class="redeem-id-value">${pid}</div>
            <div class="redeem-id-tip">评价后找群管理领取VIP1和300钻石</div>
            <div class="redeem-id-tip">💬 Q群：1087031624</div>
        </div>

        ${vipPrivilegeHtml}

        <div class="vip-progress-box">
            <div class="vip-progress-title">📺 广告累计升VIP进度（累计 ${totalAds} 次）</div>
            ${vipBarHtml}
        </div>

        <div class="redeem-input-box">
            <input type="text" id="redeemCodeInput" class="redeem-input" placeholder="请输入兑换码" maxlength="40" />
            <button class="btn-redeem-submit" onclick="submitRedeemCode()">兑 换</button>
        </div>`;
}

// 关闭兑换码界面
function closeRedeemCodeModal() {
    closeModal('redeemCodeModal');
}

// 显示兑换奖励弹窗
function showRedeemReward(rewards) {
    const container = document.getElementById('redeemRewardContent');
    if (!container) return;
    
    let html = '<div class="redeem-reward-title">🎁 恭喜获得</div>';
    html += '<div class="redeem-reward-list">';
    
    if (rewards.vip) {
        html += `<div class="redeem-reward-item vip">🌟 ${rewards.vip}</div>`;
    }
    if (rewards.diamonds) {
        html += `<div class="redeem-reward-item">💎 ${rewards.diamonds} 钻石</div>`;
    }
    if (rewards.eliteTickets) {
        html += `<div class="redeem-reward-item">🎟️ ${rewards.eliteTickets} 精英门票</div>`;
    }
    if (rewards.hellTickets) {
        html += `<div class="redeem-reward-item">😈 ${rewards.hellTickets} 地狱门票</div>`;
    }
    if (rewards.privilege) {
        html += `<div class="redeem-reward-item special">🏆 ${rewards.privilege}</div>`;
    }
    
    html += '</div>';
    html += '<div class="redeem-reward-btn"><button class="btn-action" onclick="closeModal(\'redeemRewardModal\')">确 定</button></div>';
    
    container.innerHTML = html;
    showModal('redeemRewardModal');
}

// 提交兑换码
function submitRedeemCode() {
    const inputEl = document.getElementById('redeemCodeInput');
    if (!inputEl) return;
    const code = inputEl.value.trim().toUpperCase();
    if (!code) { showToast('请输入兑换码'); return; }

    const pid = GameState.player.playerId || '';

    // --- 固定码 PINGJIAVIP（限领一次）---
    if (code === 'PINGJIAVIP') {
        const rkey = 'rd_pjv';
        if (localStorage.getItem(rkey)) { showToast('该兑换码已使用过！'); return; }
        localStorage.setItem(rkey, '1');
        GameState.player.diamonds += 300;
        if (GameState.player.vipLevel < 1) activateVipPrivilege(1);
        saveGame(); updateTopBar();
        renderRedeemModal();
        showRedeemReward({ vip: 'VIP1 特权', diamonds: '300' });
        return;
    }

    // --- 专属码验证 ---
    if (!pid || pid.length < 10) { showToast('专属ID尚未生成，请重新进入游戏'); return; }

    // 提取ID的前5位数字和最后2位字母
    const idNum = pid.substring(0, 5); // 前5位数字
    const last2 = pid.slice(-2).toUpperCase(); // 最后2位字母

    // 计算各兑换码：数字结果 + 最后2位字母
    const vip2Code = (parseInt(idNum) * 123) + last2;
    const vip3Code = (parseInt(idNum) * 1234) + last2;
    const ticketCode = (parseInt(idNum) * 4321) + last2;
    const rareCode = (parseInt(idNum) * 789) + last2;
    const achievementCode = (parseInt(idNum) * 321) + last2;

    // VIP2兑换码
    if (code === vip2Code.toString()) {
        if (_isRedeemed('vip2_' + pid)) { showToast('该兑换码已使用过！'); return; }
        _markRedeemed('vip2_' + pid);
        GameState.player.diamonds += 500;
        GameState.player.tickets.elite += 2000;
        GameState.player.tickets.hell += 200;
        if (GameState.player.vipLevel < 2) activateVipPrivilege(2);
        else { saveGame(); updateTopBar(); }
        renderRedeemModal();
        showRedeemReward({ vip: 'VIP2 特权', diamonds: '500', eliteTickets: '2000', hellTickets: '200' });
        return;
    }

    // VIP3兑换码
    if (code === vip3Code.toString()) {
        if (_isRedeemed('vip3_' + pid)) { showToast('该兑换码已使用过！'); return; }
        _markRedeemed('vip3_' + pid);
        GameState.player.diamonds += 2000;
        GameState.player.tickets.elite += 5000;
        GameState.player.tickets.hell += 1000;
        if (GameState.player.vipLevel < 3) activateVipPrivilege(3);
        else { saveGame(); updateTopBar(); }
        renderRedeemModal();
        showRedeemReward({ vip: 'VIP3 特权', diamonds: '2000', eliteTickets: '5000', hellTickets: '1000' });
        return;
    }

    // 门票特权兑换码
    if (code === ticketCode.toString()) {
        if (_isRedeemed('ticket_' + pid)) { showToast('该兑换码已使用过！'); return; }
        _markRedeemed('ticket_' + pid);
        GameState.player.diamonds += 2000;
        GameState.player.tickets.elite += 10000;
        GameState.player.tickets.hell += 2000;
        activateSpecialPrivilege('ticketPriv');
        renderRedeemModal();
        showRedeemReward({ privilege: '门票特权', diamonds: '2000', eliteTickets: '10000', hellTickets: '2000' });
        return;
    }

    // 稀有装备特权兑换码
    if (code === rareCode.toString()) {
        if (_isRedeemed('rare_' + pid)) { showToast('该兑换码已使用过！'); return; }
        _markRedeemed('rare_' + pid);
        GameState.player.diamonds += 2000;
        GameState.player.tickets.elite += 10000;
        GameState.player.tickets.hell += 2000;
        activateSpecialPrivilege('rareEquipPriv');
        renderRedeemModal();
        showRedeemReward({ privilege: '稀有装备特权', diamonds: '2000', eliteTickets: '10000', hellTickets: '2000' });
        return;
    }

    // 全成就特权兑换码
    if (code === achievementCode.toString()) {
        if (_isRedeemed('achievement_' + pid)) { showToast('该兑换码已使用过！'); return; }
        _markRedeemed('achievement_' + pid);
        // 解锁所有成就
        for (const title of TITLE_CONFIG) {
            if (!GameState.titles.includes(title.id)) {
                GameState.titles.push(title.id);
            }
        }
        showToast('🎉 所有成就已解锁！');
        renderRedeemModal();
        showRedeemReward({ privilege: '全成就特权', diamonds: '0' });
        saveGame();
        updateTopBar();
        return;
    }

    showToast('❌ 无效的兑换码，请检查后重试');
}


// ========== 道具系统 ==========

// 使用道具
function useConsumable(type) {
    if (type === 'expPotion') {
        GameState.player.expPotionEndTime = Date.now() + 2 * 60 * 60 * 1000; // 2小时
        showToast('经验药水已使用，效果持续2小时');
    } else if (type === 'dropPotion') {
        GameState.player.dropPotionEndTime = Date.now() + 5 * 60 * 1000; // 5分钟
        showToast('爆率药水已使用，效果持续5分钟');
    }

    updateBuffStatus();
}


// 看广告领取100万金币（金币商店专属，每日最多10次）
function buyGoldByAd() {
    AdSystem.watch(AdSystem.AD_TYPES.SHOP_GOLD, () => {
        GameState.player.gold += 1000000;
        updateTopBar();
        saveGame();
        showToast('📺 广告奖励！获得 100万 💰 金币');
        renderShopGoldTab();
    });
}

// 看广告转换职业
function changeClassByAd() {
    // 使用技能相关的广告类型，避免占用免费金币的广告次数
    AdSystem.watch(AdSystem.AD_TYPES.SHOP_SKILL, () => {
        showClassModal();
    });
}

// 根据概率生成品质（灰：66%，绿：22%，蓝：7%，紫：4%，橙：1%）
function getRandomQualityByProbability() {
    const rand = Math.random();
    if (rand < 0.66) return 0;     // 灰：66%
    if (rand < 0.88) return 1;     // 绿：22%
    if (rand < 0.95) return 2;     // 蓝：7%
    if (rand < 0.99) return 3;     // 紫：4%
    return 4;                     // 橙：1%
}

// 购买随机技能
function buyRandomSkill() {
    const cost = 1000000;
    if (GameState.player.gold < cost) {
        // 金币不足：弹出广告购买确认
        showAdConfirm('随机技能', '金币不足100万，是否看广告免费获得？', AdSystem.AD_TYPES.SHOP_SKILL, () => {
            const quality = getRandomQualityByProbability();
            const skillBook = generateSkillBook(quality, GameState.player.class);
            addInventoryItem(skillBook);
            updateTopBar();
            showToast(`📺 广告奖励！获得技能: ${skillBook.name}`);
            DailyTaskSystem.addProgress('buy_skill', 1);
        });
        return;
    }

    GameState.player.gold -= cost;
    const quality = getRandomQualityByProbability();
    const skillBook = generateSkillBook(quality, GameState.player.class);
    addInventoryItem(skillBook);
    updateTopBar();
    showToast(`获得技能: ${skillBook.name}`);
    DailyTaskSystem.addProgress('buy_skill', 1); // 每日任务：技能研习
    renderShopGoldTab();
}

// 购买随机宝石
function buyRandomGem() {
    const cost = 1000000;
    if (GameState.player.gold < cost) {
        // 金币不足：弹出广告购买确认
        showAdConfirm('随机宝石', '金币不足100万，是否看广告免费获得？', AdSystem.AD_TYPES.SHOP_GEM, () => {
            const gem = generateGemForPool();
            renderGemList();
            updateTopBar();
            refreshCurrentPage();
            showToast(`📺 广告奖励！获得宝石: ${gem ? gem.name : '未知宝石'}`);
            DailyTaskSystem.addProgress('buy_gem', 1);
        });
        return;
    }

    GameState.player.gold -= cost;
    const gem = generateGemForPool();
    renderGemList();
    updateTopBar();
    refreshCurrentPage();
    showToast(`获得宝石: ${gem ? gem.name : '未知宝石'}`);
    DailyTaskSystem.addProgress('buy_gem', 1); // 每日任务：宝石收集
    renderShopGoldTab();
}


// 购买道具（黑市道具商店）
function buyConsumable(type) {
    const player = GameState.player;

    const consumables = {
        equipProtect: {
            name: '装备保护卷',
            cost: 100,
            currency: 'diamonds',
            key: 'equipProtect',
            desc: '强化失败时等级-1（不消失）'
        },
        gemProtect: {
            name: '宝石保护卷',
            cost: 100,
            currency: 'diamonds',
            key: 'gemProtect',
            desc: '宝石合成失败时等级-1（不消失）'
        },
        skillProtect: {
            name: '技能保护卷',
            cost: 100,
            currency: 'diamonds',
            key: 'skillProtect',
            desc: '技能升级失败时等级-1（不消失）'
        },
        expPotion: {
            name: '经验药水',
            cost: 100,
            currency: 'diamonds',
            action: () => {
                const duration = 2 * 60 * 60 * 1000; // 2小时
                if (player.expPotionEndTime > Date.now()) {
                    // 经验药水可以叠加时间
                    player.expPotionEndTime += duration;
                    showToast('经验药水时间已叠加！现在总持续时间为' + Math.floor((player.expPotionEndTime - Date.now()) / (60 * 60 * 1000)) + '小时');
                } else {
                    player.expPotionEndTime = Date.now() + duration;
                    showToast('经验药水已激活！2小时内经验+50%');
                }
                updateBuffStatus();
            }
        },
        dropPotion: {
            name: '爆率药水',
            cost: 150,
            currency: 'diamonds',
            action: () => {
                const duration = 5 * 60 * 1000; // 5分钟
                if (player.dropPotionEndTime > Date.now()) {
                    // 爆率药水不可叠加
                    showToast('爆率药水效果已存在，不可叠加！');
                    return;
                }
                player.dropPotionEndTime = Date.now() + duration;
                updateBuffStatus();
                showToast('爆率药水已激活！5分钟内爆率+50%');
            }
        },
        eliteTicket: {
            name: '精英门票',
            cost: 100,
            currency: 'diamonds',
            action: () => {
                player.tickets.elite += 300;
                showToast('获得300张精英门票！');
            }
        }
    };

    const item = consumables[type];
    if (!item) {
        showToast('未知道具类型');
        return;
    }

    // 检查货币，不足时弹出广告确认
    if (item.currency === 'diamonds') {
        if (player.diamonds < item.cost) {
            const adType = CONSUMABLE_AD_TYPE_MAP[type];
            showAdConfirm(item.name, `钻石不足 ${item.cost} 💎，是否看广告免费获得？`, adType, () => {
                // 广告奖励：直接给予道具（不扣费）
                if (item.action) {
                    item.action();
                } else if (item.key) {
                    if (!GameState.consumables) GameState.consumables = {};
                    if (!GameState.consumables[item.key]) GameState.consumables[item.key] = 0;
                    GameState.consumables[item.key]++;
                    showToast(`📺 广告奖励！获得1个${item.name}`);
                }
                updateTopBar();
                saveGame();
            });
            return;
        }
        player.diamonds -= item.cost;
    } else {
        if (player.gold < item.cost) {
            const adType = CONSUMABLE_AD_TYPE_MAP[type];
            showAdConfirm(item.name, `金币不足 ${item.cost} 💰，是否看广告免费获得？`, adType, () => {
                if (item.action) {
                    item.action();
                } else if (item.key) {
                    if (!GameState.consumables) GameState.consumables = {};
                    if (!GameState.consumables[item.key]) GameState.consumables[item.key] = 0;
                    GameState.consumables[item.key]++;
                    showToast(`📺 广告奖励！获得1个${item.name}`);
                }
                updateTopBar();
                saveGame();
            });
            return;
        }
        player.gold -= item.cost;
    }

    // 执行道具效果
    if (item.action) {
        item.action();
    } else if (item.key) {
        // 添加到背包
        if (!GameState.consumables) GameState.consumables = {};
        if (!GameState.consumables[item.key]) GameState.consumables[item.key] = 0;
        GameState.consumables[item.key]++;
        showToast(`购买成功！获得1个${item.name}`);
    }

    updateTopBar();
    saveGame();
    renderShopItemTab();
}

// ============================================================
// 广告购买道具（钻石不足时，通过看广告免费获得）
// adType 映射表与 consumables 的 type 一一对应
// ============================================================
const CONSUMABLE_AD_TYPE_MAP = {
    equipProtect:  AdSystem.AD_TYPES ? AdSystem.AD_TYPES.SHOP_EQUIP_PROTECT  : 'shop_equip_protect',
    gemProtect:    AdSystem.AD_TYPES ? AdSystem.AD_TYPES.SHOP_GEM_PROTECT    : 'shop_gem_protect',
    skillProtect:  AdSystem.AD_TYPES ? AdSystem.AD_TYPES.SHOP_SKILL_PROTECT  : 'shop_skill_protect',
    expPotion:     AdSystem.AD_TYPES ? AdSystem.AD_TYPES.SHOP_EXP_POTION     : 'shop_exp_potion',
    dropPotion:    AdSystem.AD_TYPES ? AdSystem.AD_TYPES.SHOP_DROP_POTION    : 'shop_drop_potion',
    eliteTicket:   AdSystem.AD_TYPES ? AdSystem.AD_TYPES.SHOP_ELITE_TICKET   : 'shop_elite_ticket',
};

function buyConsumableByAd(type) {
    const adType = CONSUMABLE_AD_TYPE_MAP[type];
    if (!adType) { showToast('未知道具类型'); return; }

    // 道具效果执行（复用 consumables 配置，不扣除货币）
    const player = GameState.player;
    const consumables = {
        equipProtect: { name:'装备保护卷', key:'equipProtect' },
        gemProtect:   { name:'宝石保护卷', key:'gemProtect' },
        skillProtect: { name:'技能保护卷', key:'skillProtect' },
        expPotion: { name:'经验药水', action: () => {
            const duration = 2 * 60 * 60 * 1000;
            if (player.expPotionEndTime > Date.now()) {
                // 经验药水可以叠加时间
                player.expPotionEndTime += duration;
                showToast('经验药水时间已叠加！现在总持续时间为' + Math.floor((player.expPotionEndTime - Date.now()) / (60 * 60 * 1000)) + '小时');
            } else {
                player.expPotionEndTime = Date.now() + duration;
                showToast('经验药水已激活！2小时内经验+50%');
            }
            updateBuffStatus();
        }},
        dropPotion: { name:'爆率药水', action: () => {
            const duration = 5 * 60 * 1000;
            if (player.dropPotionEndTime > Date.now()) {
                // 爆率药水不可叠加
                showToast('爆率药水效果已存在，不可叠加！');
                return;
            }
            player.dropPotionEndTime = Date.now() + duration;
            updateBuffStatus();
            showToast('爆率药水已激活！5分钟内爆率+50%');
        }},
        eliteTicket: { name:'精英门票', action: () => { player.tickets.elite += 300; }},
    };

    const item = consumables[type];
    if (!item) { showToast('未知道具类型'); return; }

    AdSystem.watch(adType, () => {
        if (item.action) {
            item.action();
            showToast(`📺 广告奖励！${item.name}已生效`);
        } else if (item.key) {
            if (!GameState.consumables) GameState.consumables = {};
            if (!GameState.consumables[item.key]) GameState.consumables[item.key] = 0;
            GameState.consumables[item.key]++;
            showToast(`📺 广告奖励！获得1个${item.name}`);
        }
        updateTopBar();
        saveGame();
        renderShopItemTab();
    });
}

// ========== 分解系统 ==========

// 分解物品
function dismantleItem(index, silent = false) {
    const item = GameState.inventory[index];
    if (!item) return;

    // 检查装备是否锁定
    if (item.locked) {
        showToast('装备已锁定，无法分解');
        return;
    }

    // 如果是装备且有宝石，先取下宝石归还宝石仓库
    if (item.gems && item.gems.length > 0) {
        for (let i = 0; i < item.gems.length; i++) {
            const gem = item.gems[i];
            if (gem) {
                addGemToPool(gem);
                item.gems[i] = null;
            }
        }
        if (!silent) {
            console.log(`装备 ${item.name} 的宝石已归还宝石仓库`);
        }
    }

    // 分解获得对应品质的碎片数量
    const shardCount = item.type === 'skill' 
        ? (DISMANTLE_SHARD_CONFIG.skill[item.quality] || 1)
        : (DISMANTLE_SHARD_CONFIG.equipment[item.quality] || 1);
    GameState.stats.shards += shardCount;
    // 按品质分类统计碎片
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    // 技能碎片使用负数key，避免与装备碎片冲突
    const shardKey = item.type === 'skill' ? -100 - item.quality : item.quality;
    GameState.stats.qualityShards[shardKey] = (GameState.stats.qualityShards[shardKey] || 0) + shardCount;

    GameState.inventory.splice(index, 1);
    if (!silent) {
        showToast(`分解成功，获得${shardCount}个${item.qualityName}碎片 💎${shardCount}`);
    }
    renderInventory();
    renderGemList(); // 更新宝石仓库显示
    refreshCurrentPage();
}

  // 锁定物品
  function toggleLock(index) {
      const item = GameState.inventory[index];
      if (!item) return;

      item.locked = !item.locked;
      renderInventory();
      showToast(item.locked ? '已锁定' : '已解锁');
  }

  // 锁定物品（别名函数，用于renderInventory调用）
  function toggleLockItem(index) {
      toggleLock(index);
  }

  // 锁定宝石
function toggleGemLock(gemIndex) {
    const gem = GameState.gemPool[gemIndex];
    if (!gem) return;

    gem.locked = !gem.locked;
    renderGemList();
    showToast(gem.locked ? '已锁定' : '已解锁');
}

// 锁定技能
function toggleSkillLock(skillIndex) {
    const skill = GameState.inventory[skillIndex];
    if (!skill || skill.type !== 'skill') return;

    skill.locked = !skill.locked;
    renderSkillPool();
    showToast(skill.locked ? '已锁定' : '已解锁');
}

// 自动分解
function autoDismantle() {
    // 实现自动分解逻辑
    const settings = GameState.dismantleSettings;
    const itemsToDismantle = [];
    const gemsToDismantle = [];

    // 先收集需要分解的物品（倒序遍历，避免索引问题）
    for (let i = GameState.inventory.length - 1; i >= 0; i--) {
        const item = GameState.inventory[i];

        // 跳过带锁装备
        if (item.locked) continue;

        let shouldDismantle = false;
        if (!item.type || item.type === 'equipment') {
            if (GameState.autoDismantle.equipment && settings.equipment[item.quality]) {
                // 检查是否比身上同槽位装备评分更高，更高则不分解
                const equippedItem = item.slot ? GameState.equipment[item.slot] : null;
                if (equippedItem && calculateEquipmentScore(item) > calculateEquipmentScore(equippedItem)) {
                    // 比身上更强，不分解
                } else {
                    shouldDismantle = true;
                }
            }
        } else if (item.type === 'skill') {
            if (GameState.autoDismantle.skill && settings.skill[item.quality]) {
                shouldDismantle = true;
            }
        }

        if (shouldDismantle) {
            itemsToDismantle.push({ index: i, item: item });
        }
    }

    // 收集需要分解的宝石（倒序遍历，避免索引问题）
    for (let i = GameState.gemPool.length - 1; i >= 0; i--) {
        const gem = GameState.gemPool[i];

        // 跳过带锁宝石
        if (gem.locked) continue;

        if (GameState.autoDismantle.gem && settings.gem[gem.quality]) {
            gemsToDismantle.push({ index: i, gem: gem });
        }
    }

    // 执行分解并显示实时反馈
    itemsToDismantle.forEach(({ index, item }) => {
        // 获取分解获得的碎片数量
        const shardCount = item.type === 'skill'
            ? (DISMANTLE_SHARD_CONFIG.skill[item.quality] || 1)
            : (DISMANTLE_SHARD_CONFIG.equipment[item.quality] || 1);

        dismantleItem(index, true);
        const qualityName = item.qualityName || EQUIPMENT_QUALITIES[item.quality]?.name;
        addBattleLog(`自动分解: ${item.name} (${qualityName}) +${shardCount}碎片`, 'info');
    });

    // 执行宝石分解并显示实时反馈
    gemsToDismantle.forEach(({ index, gem }) => {
        // 获取分解获得的碎片数量
        const shardCount = DISMANTLE_SHARD_CONFIG.gem[gem.quality] || 1;

        // 执行宝石分解
        const gemQualityName = GEM_QUALITIES[gem.quality]?.name || '宝石';
        const gemName = gem.name || '未知宝石';
        
        // 从宝石仓库中移除
        GameState.gemPool.splice(index, 1);
        
        // 增加碎片
        if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
        const gemShardKey = -gem.quality - 1; // 宝石碎片使用负数key
        GameState.stats.qualityShards[gemShardKey] = (GameState.stats.qualityShards[gemShardKey] || 0) + shardCount;
        
        // 增加分解次数
        GameState.stats.dismantleCount++;
        
        addBattleLog(`自动分解: ${gemName} (${gemQualityName}) +${shardCount}碎片`, 'info');
    });

    // 实时刷新界面
    renderInventory();
    renderSkillPool();
    renderGemList();
    updateTopBar();
    saveGame();
}

// 切换分解品质
function toggleDismantleQuality(qualityIdx, enabled, type) {
    if (type === 'equipment') {
        GameState.dismantleSettings.equipment[qualityIdx] = enabled;
        renderInventoryDismantleOptions();
        renderDismantleBar();
        // 勾选品质且自动分解已开启时，立即扫描背包
        if (enabled && GameState.autoDismantle.equipment) autoDismantle();
    } else if (type === 'skill') {
        GameState.dismantleSettings.skill[qualityIdx] = enabled;
        renderSkillDismantleOptions();
        renderDismantleBar();
        if (enabled && GameState.autoDismantle.skill) autoDismantle();
    } else if (type === 'gem') {
        GameState.dismantleSettings.gem[qualityIdx] = enabled;
        renderGemDismantleOptions();
        renderDismantleBar();
        if (enabled && GameState.autoDismantle.gem) autoDismantle();
    }
}

// 切换分解品质类型（toggleDismantleQuality 的别名，保持兼容）
function toggleDismantleQualityType(qualityIdx, enabled, type) {
    toggleDismantleQuality(qualityIdx, enabled, type);
}

// 切换自动分解
function toggleAutoDismantle(enabled, type = 'equipment') {
    if (type === 'equipment') {
        GameState.autoDismantle.equipment = enabled;
        renderInventoryDismantleOptions();
        renderDismantleBar();
        // 开启时立即扫描背包里已有的符合条件装备
        if (enabled) autoDismantle();
    } else if (type === 'skill') {
        GameState.autoDismantle.skill = enabled;
        renderSkillDismantleOptions();
        renderDismantleBar();
        if (enabled) autoDismantle();
    } else if (type === 'gem') {
        GameState.autoDismantle.gem = enabled;
        renderGemDismantleOptions();
        renderDismantleBar();
        if (enabled) autoDismantle();
    }
}

// 切换简化模式
function toggleSimplifiedMode() {
    GameState.isSimplifiedMode = !GameState.isSimplifiedMode;
    renderInventory();
}

// 渲染背包 - 新样式（根据截图）
function renderInventory(filterType = 'all') {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;

    // 绑定筛选按钮事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderInventory(btn.dataset.type);
        };
    });

    inventoryGrid.innerHTML = '';

    // 只显示装备，不显示技能书（技能书在技能页面）
    let items = GameState.inventory.filter(item => !item.type || item.type === 'equipment' || item.slot);

    if (filterType !== 'all') {
        items = items.filter(item => {
            if (filterType === 'weapon') return item.slot === 'weapon';
            if (filterType === 'armor') return item.slot === 'armor';
            if (filterType === 'helmet') return item.slot === 'helmet';
            if (filterType === 'boots') return item.slot === 'boots';
            if (filterType === 'ring') return item.slot === 'ring';
            if (filterType === 'necklace') return item.slot === 'necklace';
            return true;
        });
    }

    // 渲染物品列表
    items.forEach((item, originalIndex) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';

        // 获取品质配置
        const qualityConfig = EQUIPMENT_QUALITIES[item.quality] || EQUIPMENT_QUALITIES[0];
        const slotConfig = EQUIPMENT_SLOTS[item.slot] || { name: '未知', icon: '?' };

        // 检查是否是更好的装备
        const equipSlot = item.slot;
        const equippedItem = GameState.equipment[equipSlot];
        const isBetter = equippedItem && calculateEquipmentScore(item) > calculateEquipmentScore(equippedItem);

        if (isBetter) {
            itemElement.classList.add('better-equipment');
        }

        // 计算装备评分
        const score = Math.floor(calculateEquipmentScore(item));

        // 生成属性列表（按截图顺序）
        const statMap = {
            atk: { name: '攻击', unit: '' },
            hp: { name: '生命', unit: '' },
            goldBonus: { name: '金币加成', unit: '%' },
            critDmg: { name: '爆伤', unit: '%' },
            atkSpd: { name: '攻速', unit: '%' },
            antiCritDmg: { name: '抗爆伤', unit: '%' },
            vamp: { name: '吸血', unit: '%' },
            expBonus: { name: '经验加成', unit: '%' },
            crit: { name: '暴击', unit: '%' },
            antiCrit: { name: '抗暴击', unit: '%' },
            penetrate: { name: '穿透', unit: '%' },
            def: { name: '防御', unit: '' }
        };

        let statsLines = [];
        if (item.stats) {
            for (const [key, value] of Object.entries(item.stats)) {
                if (value !== 0 && value !== null && statMap[key]) {
                    const statInfo = statMap[key];
                    statsLines.push(`${statInfo.name}: +${value}${statInfo.unit}`);
                }
            }
        }

    // 生成宝石孔位显示（紧凑模式：显示孔数+已镶数）
    let gemSlotsHtml = '';
    if (item.gems && item.gems.length > 0) {
        const totalHoles = item.gems.length;
        const filledGems = item.gems.filter(g => g !== null && g !== undefined);
        const filledCount = filledGems.length;
        const emptyCount = totalHoles - filledCount;
        // 已镶嵌宝石用彩色图标紧凑展示，空孔用孔数标签
        let gemIconsHtml = filledGems.map(g => {
            const icon = (g.affixes && g.affixes.length > 0 ? g.affixes[0].icon : null) || g.affixIcon || '💎';
            return `<span class="gem-slot-filled" style="color:${g.color||'#f1c40f'}">${icon}</span>`;
        }).join('');
        const emptyHtml = emptyCount > 0
            ? `<span class="gem-slot-empty">+${emptyCount}空</span>`
            : '';
        gemSlotsHtml = `<div class="equip-gem-slots"><span class="gem-hole-count">⬡${totalHoles}孔</span>${gemIconsHtml}${emptyHtml}</div>`;
    }

        const realIndex = GameState.inventory.indexOf(item);
        const enhanceLevel = item.enhanceLevel || 0;
        const successRate = enhanceLevel < item.maxLevel ? ENHANCE_SUCCESS_RATE[Math.min(enhanceLevel, ENHANCE_SUCCESS_RATE.length - 1)] : 100;
        const requiredShards = getRequiredShardsForEnhance(enhanceLevel);
        itemElement.innerHTML = `
            <div class="equip-card-header">
                <span class="quality-icon">${qualityConfig.icon}</span>
                <div class="equip-name-group">
                    <span class="equip-name" style="color:${qualityConfig.color || '#fff'}">${item.name}${(item.enhanceLevel || 0) > 0 ? ` <span style="color:#f39c12;font-size:12px">+${item.enhanceLevel}</span>` : ''}${enhanceLevel < item.maxLevel ? ` <span style="color:#e74c3c;font-size:12px">成功率${successRate}%</span>` : ''}</span>
                    <span class="equip-meta">${slotConfig.name} · Lv.${item.level}</span>
                </div>
                <div class="equip-score-block">
                    <span class="equip-score">★${score}</span>
                    ${isBetter ? '<span class="better-tag">↑强</span>' : ''}
                </div>
            </div>
            <div class="equip-card-actions">
                <button class="action-btn equip-btn" onclick="event.stopPropagation(); equipItem(${realIndex})">[装备]</button>
                <button class="action-btn enhance-btn" onclick="event.stopPropagation(); enhanceItem(${realIndex}, false); renderInventory('${filterType}')">[强化${enhanceLevel < item.maxLevel ? `(${requiredShards}碎片)` : ''}]</button>
                <button class="action-btn lock-btn" onclick="event.stopPropagation(); toggleLockItem(${realIndex})"><${item.locked ? '🔒' : '🔓'}</button>
                <button class="action-btn dismantle-btn" onclick="event.stopPropagation(); dismantleItem(${realIndex})">[分解]</button>
            </div>
            <div class="equip-card-stats-grid">
                ${statsLines.map(s => `<span class="stat-chip">${s}</span>`).join('')}
            </div>
            ${gemSlotsHtml}
        `;

        // 点击卡片主体打开详情弹窗
        itemElement.onclick = () => showItemDetail(realIndex);

        inventoryGrid.appendChild(itemElement);
    });

    if (items.length === 0) {
        inventoryGrid.innerHTML = '<div class="empty-tip">背包空空如也</div>';
    }

    // 更新背包容量显示
    const countEl = document.getElementById('inventoryCount');
    if (countEl) {
        // 只计算装备数量，技能不占用背包空间
        const equipCount = GameState.inventory.filter(item => !item.type || item.type === 'equipment' || item.slot).length;
        countEl.textContent = equipCount;
    }
    const maxEl = document.getElementById('inventoryMax');
    if (maxEl) maxEl.textContent = GameState.maxInventory || 100;

    // 渲染背包页面的自动分解选项
    renderInventoryDismantleOptions();

    // 渲染装备碎片到碎片仓库区域
    const shardGrid = document.getElementById('shardGrid');
    if (shardGrid) {
        if (GameState.isSimplifiedMode) {
            shardGrid.innerHTML = '';
        } else {
            const qualityShards = GameState.stats.qualityShards || {};
            const equipQualityNames = ['残破', '锈蚀', '凡铁', '精良', '卓越', '传说', '辉煌', '神圣', '永恒', '深渊', '混沌', '虚空', '湮灭', '终焉'];
            const equipQualityColors = ['#9e9e9e', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#ffd700', '#e5e4e2', '#00bcd4', '#795548', '#e91e63', '#ff5722', '#607d8b', '#3f51b5'];

            let shardHtml = '<div class="shard-quality-grid">';
            for (let i = 0; i < equipQualityNames.length; i++) {
                const count = qualityShards[i] || 0;
                const hasShards = count > 0;
                shardHtml += `<div class="shard-quality-chip ${hasShards ? 'has-shards' : ''}"
                               style="border-color: ${equipQualityColors[i]}; ${hasShards ? `background: ${equipQualityColors[i]}22;` : ''}">
                    <span class="shard-chip-name" style="color:${equipQualityColors[i]}">${equipQualityNames[i]}</span>
                    <span class="shard-chip-count" style="color:${hasShards ? '#ffd700' : '#666'}">${count}</span>
                </div>`;
            }
            shardHtml += '</div>';
            shardGrid.innerHTML = shardHtml;
        }
    }
}

// 渲染背包页面的自动分解选项
function renderInventoryDismantleOptions() {
    const qualityList = document.getElementById('dismantleQualityList');
    if (!qualityList) return;

    const settings = GameState.dismantleSettings.equipment;
    const auto = GameState.autoDismantle.equipment;

    const qualityNames = ['残破', '锈蚀', '凡铁', '精良', '卓越', '传说', '辉煌', '神圣', '永恒', '深渊', '混沌', '虚空', '湮灭', '终焉'];

    let html = '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">';
    html += `<input type="checkbox" id="autoDismantleEquip" ${auto ? 'checked' : ''} onchange="toggleAutoDismantle(this.checked, 'equipment')">`;
    html += '<label for="autoDismantleEquip">自动分解装备</label>';
    html += `<button class="btn-simplify" onclick="toggleSimplifiedMode()">${GameState.isSimplifiedMode ? '🔍 展开' : '📋 简化'}</button>`;
    html += '</div>';

    if (!GameState.isSimplifiedMode) {
        for (let i = 0; i < qualityNames.length; i++) {
            html += `<div class="dismantle-quality-item">
                <input type="checkbox" id="dismantleEquip${i}" ${settings[i] ? 'checked' : ''} ${!auto ? 'disabled' : ''} onchange="toggleDismantleQuality(${i}, this.checked, 'equipment')">
                <label for="dismantleEquip${i}" style="color: ${EQUIPMENT_QUALITIES[i].color}">${qualityNames[i]}</label>
            </div>`;
        }
    }

    qualityList.innerHTML = html;
}

// 增强物品（装备强化）
function enhanceItem(index, isEquipped) {
    let item;
    if (isEquipped) {
        // 增强已装备物品：index 此时为装备槽位名称（如 'weapon'）
        item = GameState.equipment[index];
        if (!item) {
            showToast('该槽位无装备');
            return;
        }
    } else {
        item = GameState.inventory[index];
    }

    if (!item) return;

    if (item.enhanceLevel >= item.maxLevel) {
        showToast('已达到最大强化等级');
        return;
    }

    // 计算强化所需材料（碎片+金币×10）
    const requiredShards = getRequiredShardsForEnhance(item.enhanceLevel);
    const cost = (item.enhanceLevel * 100 + 100) * 10; // 金币消耗×10
    const qualityName = EQUIPMENT_QUALITIES[item.quality]?.name || '装备';

    // 检查装备碎片是否足够（使用对应品质的碎片）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const equipShards = GameState.stats.qualityShards[item.quality] || 0;
    const shardInsufficient = equipShards < requiredShards;

    // 辉煌(6)以上装备碎片不足时，弹出看广告免材料选项
    if (shardInsufficient) {
        if (item.quality >= 6) {
            const adType = AdSystem.AD_TYPES ? AdSystem.AD_TYPES.ENHANCE_FREE_SHARD : 'enhance_free_shard';
            showAdConfirm(
                '碎片不足',
                `${qualityName}碎片不足！需要 ${requiredShards} 个，当前 ${equipShards} 个。\n是否看广告免费强化一次（免除碎片消耗）？`,
                adType,
                () => {
                    // 广告奖励：只检查并扣除金币，跳过碎片消耗，直接执行强化
                    if (GameState.player.gold < cost) {
                        showToast('金币不足');
                        return;
                    }

                    // 辉煌及以上装备强化+2及以上时，无保护卷的情况下提示风险
                    const hasProtect = GameState.consumables && GameState.consumables.equipProtect > 0;
                    if (item.quality >= 6 && item.enhanceLevel >= 2 && !hasProtect) {
                        // 显示风险提示确认弹窗
                        const confirmModal = document.createElement('div');
                        confirmModal.id = 'enhanceRiskModal';
                        confirmModal.className = 'ad-confirm-overlay';
                        confirmModal.innerHTML = `
                            <div class="ad-confirm-box">
                                <div class="ad-confirm-title">⚠️ 强化风险提示</div>
                                <div class="ad-confirm-msg">当前装备为辉煌及以上品质，强化等级+2及以上，且无装备保护卷。<br><br>强化失败将导致装备消失，是否继续？</div>
                                <div class="ad-confirm-btns">
                                    <button class="ad-confirm-btn ad-confirm-btn-watch" id="enhanceConfirmBtn">继续强化</button>
                                    <button class="ad-confirm-btn ad-confirm-btn-cancel" id="enhanceCancelBtn">取消</button>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(confirmModal);

                        // 绑定事件
                        confirmModal.addEventListener('click', (e) => {
                            if (e.target === confirmModal) {
                                confirmModal.remove();
                            } else if (e.target.id === 'enhanceCancelBtn') {
                                confirmModal.remove();
                            } else if (e.target.id === 'enhanceConfirmBtn') {
                                confirmModal.remove();
                                GameState.player.gold -= cost;
                                _doEnhanceItem(item, index, isEquipped);
                            }
                        });
                        return;
                    }

                    GameState.player.gold -= cost;
                    _doEnhanceItem(item, index, isEquipped);
                }
            );
            return;
        }
        showToast(`${qualityName}碎片不足！需要${requiredShards}个，当前${equipShards}个`);
        return;
    }

    // 检查金币是否足够
    if (GameState.player.gold < cost) {
        showToast('金币不足');
        return;
    }

    // 辉煌及以上装备强化+2及以上时，无保护卷的情况下提示风险
    const hasProtect = GameState.consumables && GameState.consumables.equipProtect > 0;
    if (item.quality >= 6 && item.enhanceLevel >= 2 && !hasProtect) {
        // 显示风险提示确认弹窗
        const confirmModal = document.createElement('div');
        confirmModal.id = 'enhanceRiskModal';
        confirmModal.className = 'ad-confirm-overlay';
        confirmModal.innerHTML = `
            <div class="ad-confirm-box">
                <div class="ad-confirm-title">⚠️ 强化风险提示</div>
                <div class="ad-confirm-msg">当前装备为辉煌及以上品质，强化等级+2及以上，且无装备保护卷。<br><br>强化失败将导致装备消失，是否继续？</div>
                <div class="ad-confirm-btns">
                    <button class="ad-confirm-btn ad-confirm-btn-watch" id="enhanceConfirmBtn">继续强化</button>
                    <button class="ad-confirm-btn ad-confirm-btn-cancel" id="enhanceCancelBtn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmModal);

        // 绑定事件
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                confirmModal.remove();
            } else if (e.target.id === 'enhanceCancelBtn') {
                confirmModal.remove();
            } else if (e.target.id === 'enhanceConfirmBtn') {
                confirmModal.remove();
                // 扣除对应品质的装备碎片和金币
                GameState.stats.qualityShards[item.quality] -= requiredShards;
                GameState.player.gold -= cost;
                // 执行强化（含成功/失败判定）
                _doEnhanceItem(item, index, isEquipped);
            }
        });
        return;
    }

    // 扣除对应品质的装备碎片和金币
    GameState.stats.qualityShards[item.quality] -= requiredShards;
    GameState.player.gold -= cost;

    // 执行强化（含成功/失败判定）
    _doEnhanceItem(item, index, isEquipped);

    // ---- 核心强化逻辑（可被广告回调复用）----
    function _doEnhanceItem(item, index, isEquipped) {
        const qualityName = EQUIPMENT_QUALITIES[item.quality]?.name || '装备';
        const requiredShards = getRequiredShardsForEnhance(item.enhanceLevel);

        // 计算强化成功率（基础成功率 + 称号加成）
        const titleBonus = getTitleBonus();
        const baseSuccessRate = ENHANCE_SUCCESS_RATE[Math.min(item.enhanceLevel, ENHANCE_SUCCESS_RATE.length - 1)];
        const successRate = Math.min(100, baseSuccessRate + titleBonus.enhanceBonus * 100);

        if (Math.random() * 100 < successRate) {
            item.enhanceLevel++;
            recalculateEquipmentStats(item);
            // 称号进度：单件装备连续强化成功次数
            GameState.stats.enhanceConsecutiveSuccess++;
            GameState.stats.enhanceConsecutiveFails = 0;
            // 锻造之神：武器强化等级
            if (item.slot === 'weapon') {
                GameState.stats.weaponEnhanceLevel = item.enhanceLevel;
            }
            if (isEquipped) {
                updateEquipmentSlots();
                updateCharacterStats();
            }
            // 检查称号
            checkTitles();
            showToast(`${qualityName}强化成功! +${item.enhanceLevel} (消耗${requiredShards}${qualityName}碎片)`);
        } else {
            // 称号进度：强化连续失败
            GameState.stats.enhanceConsecutiveFails++;
            GameState.stats.enhanceConsecutiveSuccess = 0;
            // 强化失败：检查是否有装备保护卷
            if (GameState.consumables && GameState.consumables.equipProtect > 0) {
                GameState.consumables.equipProtect--;
                if (item.enhanceLevel > 0) item.enhanceLevel--;
                recalculateEquipmentStats(item);
                showToast('强化失败！保护卷生效，等级-1');
            } else {
                // 无保护卷：装备消失
                const itemName = item.name;
                if (isEquipped) {
                    // 已装备的物品卸下后消失
                    GameState.equipment[item.slot] = null;
                    updateEquipmentSlots();
                    updateCharacterStats();
                } else {
                    // 背包中的物品直接消失
                    const invIdx = GameState.inventory.indexOf(item);
                    if (invIdx !== -1) GameState.inventory.splice(invIdx, 1);
                }
                showToast(`强化失败！${itemName}消失了`);
            }
            // 检查称号
            checkTitles();
        }

        if (!isEquipped) {
            renderInventory();
            // 更新背包中装备的详情界面
            showItemDetail(index);
        } else {
            // 更新已装备装备的详情界面
            showEquippedItemDetail(index);
        }
        updateTopBar();
        refreshCurrentPage();
        saveGame();
    }
}

// 增强宝石
function enhanceGem(gemIndex) {
    const gem = GameState.gemPool[gemIndex];
    if (!gem) return;

    if (gem.level >= gem.maxLevel) {
        showToast('已达到最大等级');
        return;
    }

    // 计算强化所需材料（碎片+金币×10）
    const requiredShards = getRequiredShardsForEnhance(gem.level);
    const cost = (gem.level * 50 + 50) * 10; // 金币消耗×10
    const qualityName = GEM_QUALITIES[gem.quality]?.name || '宝石';

    // 检查宝石碎片是否足够（使用对应品质的碎片）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const gemQualityKey = -gem.quality - 1;
    const gemShards = GameState.stats.qualityShards[gemQualityKey] || 0;
    if (gemShards < requiredShards) {
        showToast(`${qualityName}碎片不足！需要${requiredShards}个，当前${gemShards}个`);
        return;
    }

    // 检查金币是否足够
    if (GameState.player.gold < cost) {
        showToast('金币不足');
        return;
    }

    // 扣除对应品质的宝石碎片和金币
    GameState.stats.qualityShards[gemQualityKey] -= requiredShards;
    GameState.player.gold -= cost;

    const titleBonus = getTitleBonus();
    const baseSuccessRate = ENHANCE_SUCCESS_RATE[Math.min(gem.level, ENHANCE_SUCCESS_RATE.length - 1)];
    const successRate = Math.min(100, baseSuccessRate + titleBonus.enhanceBonus * 100);
    if (Math.random() * 100 < successRate) {
        gem.level++;
        recalculateGemStats(gem);
        showToast(`${qualityName}强化成功! 等级: ${gem.level} (消耗${requiredShards}${qualityName}碎片)`);
    } else {
        // 强化失败：检查是否有宝石保护卷
        if (GameState.consumables && GameState.consumables.gemProtect > 0) {
            GameState.consumables.gemProtect--;
            if (gem.level > 0) gem.level--;
            showToast('强化失败！保护卷生效，等级-1');
        } else {
            // 无保护卷：宝石消失
            const gemName = gem.name;
            GameState.gemPool.splice(gemIndex, 1);
            showToast(`强化失败！${gemName}消失了`);
        }
    }

    renderGemList();
    updateTopBar();
    refreshCurrentPage();
}

// 装备宝石（从宝石仓库镶嵌到已装备的物品）
function equipGem(gemIndex) {
    const gem = GameState.gemPool[gemIndex];
    if (!gem) return;

    // 找出所有已装备且有空槽的装备
    const equippedSlots = [];
    for (const [slot, item] of Object.entries(GameState.equipment)) {
        if (item && item.gems) {
            const emptySlot = item.gems.findIndex(g => g === null);
            if (emptySlot !== -1) {
                equippedSlots.push({ slot, item, emptySlot });
            }
        }
    }

    if (equippedSlots.length === 0) {
        showToast('没有可镶嵌的装备（需要先给装备开孔）');
        return;
    }

    // 如果只有一个选项，直接镶嵌
    if (equippedSlots.length === 1) {
        const { slot, item, emptySlot } = equippedSlots[0];
        item.gems[emptySlot] = gem;
        GameState.gemPool.splice(gemIndex, 1);
        recalculateEquipmentStats(item);
        updateEquipmentSlots();
        updateCharacterStats();
        renderGemList();
        refreshCurrentPage();
        showToast(`已将 ${gem.name} 镶嵌到 ${EQUIPMENT_SLOTS[slot]?.name || slot}`);
        return;
    }

    // 多个选项时，弹出简易提示让玩家选择
    const options = equippedSlots.map(({ slot, item }) =>
        `${EQUIPMENT_SLOTS[slot]?.name || slot}(${item.name})`
    ).join('\n');

    const choice = equippedSlots.findIndex(({ slot }) => {
        // 优先镶嵌到同类型有空槽的装备（简单策略：第一个空槽）
        return true;
    });

    if (choice !== -1) {
        const { slot, item, emptySlot } = equippedSlots[choice];
        item.gems[emptySlot] = gem;
        GameState.gemPool.splice(gemIndex, 1);
        recalculateEquipmentStats(item);
        updateEquipmentSlots();
        updateCharacterStats();
        renderGemList();
        refreshCurrentPage();
        showToast(`已将 ${gem.name} 镶嵌到 ${EQUIPMENT_SLOTS[slot]?.name || slot}`);
    }
}

// 分解宝石
function dismantleGem(gemIndex) {
    const gem = GameState.gemPool[gemIndex];
    if (!gem || gem.locked) return;

    // 分解获得对应品质的碎片数量
    const shardCount = DISMANTLE_SHARD_CONFIG.gem[gem.quality] || 1;
    GameState.stats.shards += shardCount;
    // 按品质分类统计碎片（宝石品质用负数区分）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const gemQualityKey = -gem.quality - 1; // 宝石品质用负数key（如绿色=0，蓝色=-1，紫色=-2，橙色=-3）
    GameState.stats.qualityShards[gemQualityKey] = (GameState.stats.qualityShards[gemQualityKey] || 0) + shardCount;

    GameState.gemPool.splice(gemIndex, 1);
    showToast(`分解成功，获得${shardCount}个${gem.qualityName}碎片 💎${shardCount}`);
    renderGemList();
    refreshCurrentPage();
}

// 分解技能
function dismantleSkill(skillIndex) {
    const skill = GameState.inventory[skillIndex];
    if (!skill || skill.locked || skill.type !== 'skill') return;

    // 分解获得对应品质的碎片数量
    const shardCount = DISMANTLE_SHARD_CONFIG.skill[skill.quality] || 1;
    GameState.stats.shards += shardCount;
    // 按品质分类统计碎片（技能品质用负数key区分）
    if (!GameState.stats.qualityShards) GameState.stats.qualityShards = {};
    const skillQualityKey = -100 - skill.quality; // 技能品质用特殊负数key
    GameState.stats.qualityShards[skillQualityKey] = (GameState.stats.qualityShards[skillQualityKey] || 0) + shardCount;

    GameState.inventory.splice(skillIndex, 1);
    showToast(`分解成功，获得${shardCount}个${skill.qualityName}碎片 💎${shardCount}`);
    renderSkillPool();
    renderInventory();
    refreshCurrentPage();
}

// ========== 页面切换和初始化 ==========

// 切换页面
function switchPage(pageName) {
    console.log('switchPage 被调用，页面名称:', pageName);

    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    console.log('找到的页面数量:', pages.length);

    pages.forEach((page, index) => {
        console.log(`隐藏页面 ${index}: ${page.id}`);
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(pageName + 'Page');
    console.log('目标页面:', targetPage ? targetPage.id : '未找到');

    if (targetPage) {
        targetPage.classList.add('active');
        console.log('已添加 active 类');
    }

    // 更新页面数据
    updatePageData(pageName);

    // 更新底部导航按钮
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
}

// 更新页面数据
function updatePageData(pageName) {
    switch (pageName) {
        case 'battle':
            updateCharacterStats();
            updateBattleStatus();
            break;
        case 'character':
            updateCharacterStats();
            updateEquipmentSlots();
            break;
        case 'inventory':
            const currentFilter = document.querySelector('.filter-btn.active');
            const filterType = currentFilter ? currentFilter.dataset.type : 'all';
            renderInventory(filterType);
            break;
        case 'skill':
            renderSkillSlots();
            renderSkillPool();
            renderSkillDismantleOptions();
            break;
        case 'gem':
            renderGemList();
            renderGemDismantleOptions();
            break;
        case 'shop':
            renderShop();
            break;
        case 'more':
            renderMorePage();
            break;
    }
}

// 实时刷新当前激活页面
// 任何数据变动（掉落/分解/强化/装备）后调用此函数，自动更新当前可见内容
function refreshCurrentPage() {
    // 找到当前激活的页面
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    const pageId = activePage.id; // 格式如 "inventoryPage"
    const pageName = pageId.replace('Page', '');
    updatePageData(pageName);
}

// 切换技能标签（只操作 skillPage 内部，避免影响其他页面的 tab-content）
// auto-dismantle-bar 已移入对应 tab-content，跟随 tab 自动显隐，无需手动控制
function switchSkillTab(tabName) {
    const skillPage = document.getElementById('skillPage');
    if (!skillPage) return;

    // 激活对应按钮
    skillPage.querySelectorAll('.skill-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // 激活对应内容区（bar 已在 tab-content 内，自动跟随隐显）
    skillPage.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = skillPage.querySelector('#' + tabName + 'Tab');
    if (targetContent) targetContent.classList.add('active');

    // 切换时渲染对应数据
    if (tabName === 'gems') {
        renderGemList();
        renderGemDismantleOptions();
    } else {
        renderSkillSlots();
        renderSkillPool();
        renderSkillDismantleOptions();
    }
}

// 初始化技能页Tab点击监听（在页面初始化时调用）
function initSkillTabListeners() {
    const skillPage = document.getElementById('skillPage');
    if (!skillPage) return;
    skillPage.querySelectorAll('.skill-tab').forEach(tab => {
        tab.onclick = () => switchSkillTab(tab.dataset.tab);
    });
}

// 切换商店标签（只操作 shopPage 内部，避免影响其他页面的 tab-content）
function switchShopTab(tabName) {
    const shopPage = document.getElementById('shopPage');
    if (!shopPage) return;

    // 激活对应按钮
    shopPage.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // 激活对应内容区
    shopPage.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = shopPage.querySelector('#' + tabName + 'Tab');
    if (targetContent) targetContent.classList.add('active');

    // 切换时重渲染对应 Tab（确保按钮状态最新）
    if (tabName === 'goldShop') renderShopGoldTab();
    else if (tabName === 'itemShop') renderShopItemTab();
}

// 初始化商店页Tab点击监听
function initShopTabListeners() {
    const shopPage = document.getElementById('shopPage');
    if (!shopPage) return;
    shopPage.querySelectorAll('.shop-tab').forEach(tab => {
        tab.onclick = () => switchShopTab(tab.dataset.tab);
    });
}

// 切换角色标签
function switchCharacterTab(tabName) {
    document.querySelectorAll('.character-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const targetTab = document.querySelector(`.character-tab[onclick="switchCharacterTab('${tabName}')"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(tabName + 'Tab');
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 显示职业选择模态框


// 选择职业
function selectClass(classType) {
    console.log('selectClass 被调用，职业类型:', classType);
    const classConfig = CLASSES[classType];
    console.log('职业配置:', classConfig);

    // 检查是否是转换职业
    const isClassChange = GameState.player.class !== null && GameState.player.class !== undefined && GameState.player.class !== classType;

    // 保存玩家数据
    const oldPlayerData = {
        level: GameState.player.level,
        exp: GameState.player.exp,
        gold: GameState.player.gold,
        diamonds: GameState.player.diamonds,
        playerId: GameState.player.playerId,
        vipLevel: GameState.player.vipLevel,
        privileges: GameState.player.privileges,
        totalAdsWatched: GameState.player.totalAdsWatched,
        vipDailyDiamondClaimed: GameState.player.vipDailyDiamondClaimed,
        tickets: GameState.player.tickets,
        adFreeCount: GameState.player.adFreeCount,
        expPotionEndTime: GameState.player.expPotionEndTime,
        dropPotionEndTime: GameState.player.dropPotionEndTime
    };

    // 设置玩家名称
    GameState.player.name = classConfig.name;
    console.log('设置玩家名称:', GameState.player.name);

    // 设置职业
    GameState.player.class = classType;
    console.log('设置职业:', GameState.player.class);

    // 设置属性（转换职业时保留等级相关的成长）
    if (isClassChange) {
        // 转换职业：基于等级计算新职业的属性
        const level = GameState.player.level;
        GameState.player.hp = Math.floor(classConfig.baseStats.hp + classConfig.growthStats.hp * (level - 1));
        GameState.player.maxHp = GameState.player.hp;
        GameState.player.atk = Math.floor(classConfig.baseStats.atk + classConfig.growthStats.atk * (level - 1));
        GameState.player.def = Math.floor(classConfig.baseStats.def + classConfig.growthStats.def * (level - 1));
        GameState.player.atkSpd = Math.min(classConfig.baseStats.atkSpd + classConfig.growthStats.atkSpd * (level - 1), classConfig.maxAtkSpd);
        GameState.player.crit = Math.floor(classConfig.baseStats.crit + classConfig.growthStats.crit * (level - 1));
        GameState.player.critDmg = Math.floor(classConfig.baseStats.critDmg + classConfig.growthStats.critDmg * (level - 1));
    } else {
        // 初始选择职业：使用基础属性
        GameState.player.hp = classConfig.baseStats.hp;
        GameState.player.maxHp = classConfig.baseStats.hp;
        GameState.player.atk = classConfig.baseStats.atk;
        GameState.player.def = classConfig.baseStats.def;
        GameState.player.atkSpd = classConfig.baseStats.atkSpd;
        GameState.player.crit = classConfig.baseStats.crit;
        GameState.player.critDmg = classConfig.baseStats.critDmg;
    }

    console.log('设置后的玩家属性:', {
        name: GameState.player.name,
        class: GameState.player.class,
        hp: GameState.player.hp,
        atk: GameState.player.atk,
        def: GameState.player.def
    });

    // 恢复玩家数据（如果是转换职业）
    if (isClassChange) {
        GameState.player.level = oldPlayerData.level;
        GameState.player.exp = oldPlayerData.exp;
        GameState.player.gold = oldPlayerData.gold;
        GameState.player.diamonds = oldPlayerData.diamonds;
        // 保留原有的玩家ID，确保ID一旦生成就不可更改
        if (!GameState.player.playerId) {
            GameState.player.playerId = oldPlayerData.playerId;
        }
        GameState.player.vipLevel = oldPlayerData.vipLevel;
        GameState.player.privileges = oldPlayerData.privileges;
        GameState.player.totalAdsWatched = oldPlayerData.totalAdsWatched;
        GameState.player.vipDailyDiamondClaimed = oldPlayerData.vipDailyDiamondClaimed;
        GameState.player.tickets = oldPlayerData.tickets;
        GameState.player.adFreeCount = oldPlayerData.adFreeCount;
        GameState.player.expPotionEndTime = oldPlayerData.expPotionEndTime;
        GameState.player.dropPotionEndTime = oldPlayerData.dropPotionEndTime;

        // 自动卸下非本职业的技能
        for (let i = 0; i < GameState.skills.length; i++) {
            const skill = GameState.skills[i];
            if (skill && skill.class && skill.class !== classType) {
                GameState.skills[i] = null;
            }
        }


    } else {
        // 只有在没有玩家ID时才生成
        if (!GameState.player.playerId) {
            GameState.player.playerId = generatePlayerId();
        }

        // 标记初始职业选择已完成
        GameState.isInitialClassSelection = false;
    }

    // 关闭职业选择模态框（强制关闭）
    closeModal('classModal', true);

    // 刷新界面
    updateTopBar();
    updateCharacterStats();
    renderSkillSlots();
    renderSkillPool();
    saveGame();

    // 切换到战斗页面
    switchPage('battle');

    // 生成第一个敌人
    spawnEnemy();

    // 更新UI
    updateTopBar();
    updateCharacterStats();
    updateBuffStatus();

    // 添加日志
    addBattleLog(`你选择了${classConfig.name}，冒险开始了！`, 'system');

    // 开始自动战斗
    startAutoBattle();
}

// 绑定事件
function bindEvents() {
    // 战斗按钮
    const btnAutoBattle = document.getElementById('btnAutoBattle');
    if (btnAutoBattle) {
        btnAutoBattle.onclick = () => {
            if (GameState.battle.isAuto) {
                stopAutoBattle();
                document.getElementById('btnAutoBattle').textContent = '自动战斗';
                document.getElementById('btnAutoBattle').classList.remove('active');
            } else {
                startAutoBattle();
                document.getElementById('btnAutoBattle').textContent = '停止战斗';
                document.getElementById('btnAutoBattle').classList.add('active');
            }
        };
    }

    const btnAttack = document.getElementById('btnAttack');
    if (btnAttack) {
        btnAttack.onclick = () => {
            playerAttack();
        };
    }

    // 底部导航按钮
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => {
            const page = btn.dataset.page;
            if (page) {
                switchPage(page);
            }
        };
    });

    // 职业选择
    document.querySelectorAll('.class-card').forEach(card => {
        const selectBtn = card.querySelector('.btn-select-class');
        if (selectBtn) {
            selectBtn.onclick = () => {
                const classType = card.dataset.class;
                selectClass(classType);
            };
        }
    });

    // 角色页面标签切换
    document.querySelectorAll('.char-tab').forEach(tab => {
        tab.onclick = () => {
            // 移除所有active类
            document.querySelectorAll('.char-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.char-tab-content').forEach(c => c.classList.remove('active'));

            // 添加active类到当前标签
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            const tabContent = document.getElementById(tabName + 'Tab');
            if (tabContent) {
                tabContent.classList.add('active');
            }
        };
    });

    // 模态框关闭按钮
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = () => {
            const modal = btn.closest('.modal');
            if (modal && modal.id) {
                closeModal(modal.id);
            }
        };
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = () => {
            const modal = btn.closest('.modal');
            if (modal && modal.id) {
                closeModal(modal.id);
            }
        };
    });

    // 模态框背景点击关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        };
    });

    // 兑换码
    const btnSubmitCode = document.getElementById('btnSubmitCode');
    if (btnSubmitCode) {
        btnSubmitCode.onclick = submitRedeemCode;
    }

    // 注意：挂机区域、精英副本、地狱副本按钮已经在HTML中使用onclick属性绑定，无需在bindEvents中重复绑定

    // 菜单按钮
    const btnSettings = document.getElementById('btnSettings');
    if (btnSettings) btnSettings.onclick = showSettings;

    const btnQuests = document.getElementById('btnQuests');
    if (btnQuests) btnQuests.onclick = showQuests;

    const btnAbout = document.getElementById('btnAbout');
    if (btnAbout) btnAbout.onclick = showAbout;

    const btnRedeemCode = document.getElementById('btnRedeemCode');
    if (btnRedeemCode) btnRedeemCode.onclick = showRedeemCode;
}

// 初始化游戏
function initGame() {
    console.log('初始化游戏...');
    
    // 不清空localStorage，保留登录信息
    // 只重置游戏状态
    resetGameState();

    // 检查药水状态
    checkExpPotionStatus();
    checkDropPotionStatus();

    // VIP每日钻石（每天自动发放）
    setTimeout(() => {
        if (!GameState.player.privileges) {
            GameState.player.privileges = { ticketPriv: false, rareEquipPriv: false };
        }
        claimVipDailyDiamonds();
        checkAutoVipUpgrade();
    }, 500);

    // 绑定事件
    bindEvents();

    // 启用自动保存
    setInterval(saveGame, 300000); // 每5分钟保存一次

    // 移除自动更新排行榜，只在玩家查看排行榜时更新
    console.log('排行榜自动更新已禁用，仅在查看时更新');

    // 初始化后不再自动更新排行榜，只在玩家查看时更新

    console.log('游戏初始化完成，准备选择职业');
}

// 简单的XOR加密函数
function encryptData(data, key = 'diablo_warcraft') {
    const jsonString = JSON.stringify(data);
    let encrypted = '';
    for (let i = 0; i < jsonString.length; i++) {
        encrypted += String.fromCharCode(jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    // 使用 encodeURIComponent 和 btoa 组合处理非 Latin1 字符
    return btoa(unescape(encodeURIComponent(encrypted)));
}

// 简单的XOR解密函数
function decryptData(encryptedData, key = 'diablo_warcraft') {
    try {
        // 使用 decodeURIComponent 和 atob 组合处理非 Latin1 字符
        const decoded = decodeURIComponent(escape(atob(encryptedData)));
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return JSON.parse(decrypted);
    } catch (e) {
        console.error('解密失败:', e);
        return null;
    }
}

// 保存游戏
function saveGame() {
    try {
        const encryptedData = encryptData(GameState);
        localStorage.setItem('gameSave', encryptedData);
    } catch (e) {
        console.error('保存游戏失败:', e);
    }
}

// 删除存档
function deleteSave() {
    if (confirm('确定要删除存档吗？这将清除所有游戏进度，包括职业、装备、技能等！\n\n删除后游戏将重新开始，需要重新选择职业。')) {
        // 清除存档
        localStorage.removeItem('gameSave');
        localStorage.removeItem('gameVersion');

        // 重置GameState
        resetGameState();

        // 显示提示
        alert('存档已删除！游戏将重新开始。');

        // 刷新页面
        location.reload();
    }
}

// 重置游戏状态
function resetGameState() {
    // 重置玩家状态
    GameState.player = {
        name: '无名战士',
        class: null,
        level: 1,
        exp: 0,
        hp: 100,
        maxHp: 100,
        atk: 10,
        def: 5,
        atkSpd: 1.0,
        crit: 5,
        critDmg: 150,
        antiCrit: 0,
        antiCritDmg: 0,
        vamp: 0,
        penetrate: 0,
        gold: 0,
        diamonds: 0,
        inventory: [],
        equipment: {
            weapon: null,
            helmet: null,
            armor: null,
            boots: null,
            ring: null,
            necklace: null
        },
        gemPool: [],
        skills: [],
        playerId: '',
        vipLevel: 0,
        privileges: {
            ticketPriv:    false,
            rareEquipPriv: false,
        },
        totalAdsWatched: 0,
        vipDailyDiamondClaimed: '',
        adFreeCount: 5,
        tickets: {
            elite: 0,
            hell: 0
        },
        expPotionEndTime: 0,
        dropPotionEndTime: 0
    };

    // 重置战斗状态
    GameState.battle = {
        isAuto: false,
        isPaused: false,
        currentEnemy: null,
        inDungeon: false,
        dungeonType: null,
        dungeonLevel: 0,
        minionsKilled: 0
    };

    // 重置初始职业选择标记
    GameState.isInitialClassSelection = true;



}

// 页面加载完成后初始化（注意：initGame 已由 index.html 的 DOMContentLoaded 调用，此处不重复调用）
window.onload = function() {
    // initGame 已在 DOMContentLoaded 中调用，此处仅做额外的全局函数挂载

    // 确保函数可以被全局访问
    window.showAreaModal = showAreaModal;
    window.showEliteDungeonModal = showEliteDungeonModal;
    window.showHellDungeonModal = showHellDungeonModal;
    window.testModal = testModal;

    // 初始化技能页Tab点击监听
    initSkillTabListeners();
    // 初始化商店页Tab点击监听
    initShopTabListeners();

    console.log('模态框函数已挂载到 window 对象');
    console.log('showAreaModal:', typeof window.showAreaModal);
    console.log('testModal:', typeof window.testModal);

    // 使用 addEventListener 绑定事件
    const areaBtn = document.querySelector('.btn-select-area');
    const eliteBtn = document.querySelector('.btn-elite-dungeon');
    const hellBtn = document.querySelector('.btn-hell-dungeon');
    const testBtn = document.querySelector('.btn-test');

    if (areaBtn) {
        areaBtn.addEventListener('click', function(e) {
            console.log('addEventListener: 挂机区域按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            try {
                console.log('准备调用 showAreaModal...');
                showAreaModal();
                console.log('showAreaModal 调用完成');
            } catch (err) {
                console.error('showAreaModal 调用出错:', err);
                alert('错误: ' + err.message);
            }
        });
        console.log('挂机区域按钮事件绑定成功');
    } else {
        console.error('挂机区域按钮未找到');
    }

    if (eliteBtn) {
        eliteBtn.addEventListener('click', function(e) {
            console.log('addEventListener: 精英副本按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            try {
                console.log('准备调用 showEliteDungeonModal...');
                showEliteDungeonModal();
                console.log('showEliteDungeonModal 调用完成');
            } catch (err) {
                console.error('showEliteDungeonModal 调用出错:', err);
                alert('错误: ' + err.message);
            }
        });
        console.log('精英副本按钮事件绑定成功');
    }

    if (hellBtn) {
        hellBtn.addEventListener('click', function(e) {
            console.log('addEventListener: 地狱副本按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            try {
                console.log('准备调用 showHellDungeonModal...');
                showHellDungeonModal();
                console.log('showHellDungeonModal 调用完成');
            } catch (err) {
                console.error('showHellDungeonModal 调用出错:', err);
                alert('错误: ' + err.message);
            }
        });
        console.log('地狱副本按钮事件绑定成功');
    }

    if (testBtn) {
        testBtn.addEventListener('click', function(e) {
            console.log('addEventListener: 测试按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            try {
                console.log('准备调用 testModal...');
                testModal();
                console.log('testModal 调用完成');
            } catch (err) {
                console.error('testModal 调用出错:', err);
                alert('错误: ' + err.message);
            }
        });
        console.log('测试按钮事件绑定成功');
    }
};

// 页面关闭前保存
window.onbeforeunload = function() {
    saveGame();
};

// 云存档功能
function saveCloudGame() {
    const userId = GameState.player.playerId;
    if (!userId) {
        showToast('请先登录！');
        return;
    }
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.saveGameState) {
        showToast('正在保存云存档...');
        console.log('保存云存档 userId:', userId);
        window.cloudbaseUtils.saveGameState(userId, GameState)
            .then(() => {
                showToast('云存档保存成功');
                // 同时更新排行榜分数（包含详细数据）
                if (window.cloudbaseUtils.updateLeaderboardScore) {
                    const score = calculateLeaderboardScore();
                    const level = GameState.player.level;
                    const equipmentScore = calculateTotalEquipmentScore();
                    const kills = GameState.stats.monstersKilled;
                    const playerName = GameState.player.name || '无名战士';
                    console.log('保存云存档时更新排行榜:', {
                        userId: userId,
                        score: score,
                        level: level,
                        equipmentScore: equipmentScore,
                        kills: kills,
                        playerName: playerName
                    });
                    window.cloudbaseUtils.updateLeaderboardScore(userId, {
                        score: score,
                        level: level || 0,
                        equipmentScore: equipmentScore || 0,
                        kills: kills || 0,
                        playerName: playerName
                    })
                        .then(() => {
                            console.log('排行榜更新成功');
                        })
                        .catch(error => {
                            console.error('排行榜更新失败:', error);
                        });
                } else {
                    console.log('排行榜更新方法不可用');
                }
            })
            .catch(error => {
                showToast('云存档保存失败: ' + error.message);
                console.error('云存档保存错误:', error);
            });
    } else {
        showToast('云功能未初始化，请检查网络连接或浏览器设置');
    }
}

function loadCloudGame() {
    const userId = GameState.player.playerId || localStorage.getItem('playerId');
    const inputPassword = document.getElementById('settingsPlayerPassword').value.trim();
    
    if (!userId) {
        showToast('请先在登录界面登录！');
        return;
    }
    
    if (!inputPassword) {
        showToast('请在玩家信息里输入密码！');
        return;
    }
    
    console.log('加载云存档 userId:', userId);
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.loadGameState) {
        showToast('正在加载云存档...');
        window.cloudbaseUtils.loadGameState(userId)
            .then(gameState => {
                console.log('从云端获取到的 gameState:', gameState);
                if (gameState) {
                    if (gameState.player && gameState.player.password === inputPassword) {
                        Object.assign(GameState, gameState);
                        updateTopBar();
                        updateCharacterStats();
                        updateBattleStatus();
                        updateEquipmentSlots();
                        updateEquippedSlotsDisplay();
                        renderInventory();
                        renderSkillSlots();
                        renderSkillPool();
                        showToast('云存档加载成功');
                    } else {
                        showToast('密码错误！');
                    }
                } else {
                    showToast('没有找到云存档');
                }
            })
            .catch(error => {
                showToast('云存档加载失败: ' + error.message);
                console.error('云存档加载错误:', error);
            });
    } else {
        showToast('云功能未初始化，请检查网络连接或浏览器设置');
    }
}

// 计算排行榜分数
function calculateLeaderboardScore() {
    // 综合考虑等级、装备评分和击杀数
    const level = GameState.player.level;
    const kills = GameState.stats.monstersKilled;
    const equipmentScore = calculateTotalEquipmentScore();
    return Math.floor(level * 100 + kills * 0.1 + equipmentScore);
}

// 计算装备总评分
function calculateTotalEquipmentScore() {
    let score = 0;
    console.log('=== 计算装备总评分 ===');
    console.log('GameState.equipment:', GameState.equipment);
    for (const slot in GameState.equipment) {
        const item = GameState.equipment[slot];
        if (item) {
            const itemScore = item.score || calculateEquipmentScore(item);
            console.log(`槽位 ${slot} 装备评分:`, itemScore);
            score += itemScore;
        }
    }
    console.log('装备总评分:', score);
    return score;
}

let currentLeaderboardType = 'level';

// 排行榜功能
function showLeaderboard() {
    showModal('leaderboardModal');
    const content = document.getElementById('leaderboardContent');
    
    content.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button class="btn-action" onclick="switchLeaderboard('level')" style="flex: 1; ${currentLeaderboardType === 'level' ? 'background: var(--primary-color);' : ''}">等级榜</button>
            <button class="btn-action" onclick="switchLeaderboard('equipment')" style="flex: 1; ${currentLeaderboardType === 'equipment' ? 'background: var(--primary-color);' : ''}">装备榜</button>
        </div>
        <div id="leaderboardList" style="text-align: center; padding: 20px; color: var(--text-secondary);">加载中...</div>
    `;
    
    // 先更新自己的排行榜数据，然后再加载排行榜
    const userId = GameState.player.playerId;
    if (userId && window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.updateLeaderboardScore) {
        const score = calculateLeaderboardScore();
        const level = GameState.player.level;
        const equipmentScore = calculateTotalEquipmentScore();
        const kills = GameState.stats.monstersKilled;
        const playerName = GameState.player.name || '无名战士';
        
        window.cloudbaseUtils.updateLeaderboardScore(userId, {
            score: score,
            level: level,
            equipmentScore: equipmentScore,
            kills: kills,
            playerName: playerName
        })
            .then(() => {
                console.log('排行榜数据更新成功');
                loadLeaderboardData();
            })
            .catch(error => {
                console.error('排行榜数据更新失败:', error);
                loadLeaderboardData();
            });
    } else {
        loadLeaderboardData();
    }
}

function switchLeaderboard(type) {
    currentLeaderboardType = type;
    showLeaderboard();
}

function refreshMyLeaderboardData() {
    const userId = GameState.player.playerId;
    if (!userId) {
        showToast('请先登录！');
        return;
    }
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.updateLeaderboardScore) {
        showToast('正在更新数据...');
        const score = calculateLeaderboardScore();
        const level = GameState.player.level;
        const equipmentScore = calculateTotalEquipmentScore();
        const kills = GameState.stats.monstersKilled;
        const playerName = GameState.player.name || '无名战士';
        
        console.log('=== 调试排行榜数据 ===');
        console.log('GameState.player:', GameState.player);
        console.log('GameState.equipment:', GameState.equipment);
        console.log('GameState.stats:', GameState.stats);
        console.log('计算值:', { userId, score, level, equipmentScore, kills, playerName });
        
        window.cloudbaseUtils.updateLeaderboardScore(userId, {
            score: score,
            level: level || 0,
            equipmentScore: equipmentScore || 0,
            kills: kills || 0,
            playerName: playerName
        })
            .then(() => {
                showToast('数据更新成功！');
                setTimeout(() => {
                    loadLeaderboardData();
                }, 500);
            })
            .catch(error => {
                showToast('数据更新失败: ' + error.message);
                console.error('手动更新排行榜失败:', error);
            });
    } else {
        showToast('云功能未初始化');
    }
}

function loadLeaderboardData() {
    const content = document.getElementById('leaderboardContent');
    if (!content) return;
    
    console.log('开始显示排行榜...');
    console.log('当前排行榜类型:', currentLeaderboardType);
    
    // 清除旧的缓存，确保获取最新数据
    localStorage.removeItem('cachedLeaderboard');
    localStorage.removeItem('leaderboardLastUpdate');
    console.log('已清除旧的排行榜缓存');
    
    // 直接从服务器获取最新数据，不使用缓存
    
    // 无缓存或缓存过期，从服务器获取
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.getLeaderboard) {
        console.log('开始调用 getLeaderboard...');
        window.cloudbaseUtils.getLeaderboard()
            .then(leaderboard => {
                console.log('收到排行榜数据:', leaderboard);
                // 更新缓存
                localStorage.setItem('cachedLeaderboard', JSON.stringify(leaderboard));
                localStorage.setItem('leaderboardLastUpdate', Date.now().toString());
                renderLeaderboardData(leaderboard);
            })
            .catch(error => {
                console.error('加载排行榜失败:', error);
                content.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">加载排行榜失败</div>';
            });
    } else {
        console.error('云功能未初始化，无法加载排行榜');
        content.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">云功能未初始化</div>';
    }
    
    // 渲染排行榜数据
    function renderLeaderboardData(leaderboard) {
        content.innerHTML = '';
        const currentUserId = GameState.player.playerId;
        console.log('当前用户ID:', currentUserId);
        
        let sortedData = [];
        
        // 适配腾讯云CloudBase的数据格式
        if (Array.isArray(leaderboard)) {
            console.log('排行榜数据是数组格式，长度:', leaderboard.length);
            
            sortedData = [...leaderboard].sort((a, b) => {
                if (currentLeaderboardType === 'level') {
                    return (b.level || 0) - (a.level || 0);
                } else if (currentLeaderboardType === 'equipment') {
                    return (b.equipmentScore || 0) - (a.equipmentScore || 0);
                } else {
                    return (b.score || 0) - (a.score || 0);
                }
            });
            
            sortedData.forEach((item, index) => {
                console.log(`排行榜第${index + 1}名:`, item);
                const leaderboardItem = document.createElement('div');
                const isSelf = item._id === currentUserId;
                leaderboardItem.className = `leaderboard-item ${isSelf ? 'self' : ''}`;
                
                let rankClass = 'other';
                if (index === 0) rankClass = 'top1';
                else if (index === 1) rankClass = 'top2';
                else if (index === 2) rankClass = 'top3';
                
                const level = item.level || 0;
                const equipmentScore = item.equipmentScore || 0;
                const kills = item.kills || 0;
                
                let mainValue = item.score || 0;
                let mainLabel = '综合';
                if (currentLeaderboardType === 'level') {
                    mainValue = level;
                    mainLabel = '等级';
                } else if (currentLeaderboardType === 'equipment') {
                    mainValue = equipmentScore;
                    mainLabel = '装备';
                }
                
                // 生成特殊奖章
                let rankBadge = '';
                if (index === 0) rankBadge = '🏆';
                else if (index === 1) rankBadge = '🥈';
                else if (index === 2) rankBadge = '🥉';
                
                // 生成等级奖章
                let levelBadge = '⭐';
                
                leaderboardItem.innerHTML = `
                    <div class="leaderboard-item-header">
                        <span class="leaderboard-rank ${rankClass}">${index + 1}</span>
                        <span class="leaderboard-username ${rankClass}">${item.playerName || item._id}</span>
                        <span class="level-info">Lv.${level}</span>
                        ${rankBadge ? `<span class="rank-badge">${rankBadge}</span>` : ''}
                    </div>
                    <div class="leaderboard-item-stats">
                        <span class="kills-info">击杀:${kills}</span>
                        <span class="equipment-info">装备:${equipmentScore}</span>
                    </div>
                `;
                content.appendChild(leaderboardItem);
            });
            
            // 在控制台输出所有用户ID，方便封号
            console.log('========== 排行榜用户ID列表（用于封号）==========');
            sortedData.forEach((item, index) => {
                console.log(`第${index + 1}名 - 名字: ${item.playerName || '未知'}, ID: ${item._id}`);
            });
            console.log('========== 用户ID列表结束 ==========');
            console.log('所有用户ID数组:', sortedData.map(item => item._id));
        } else {
            // 兼容旧数据格式
            console.log('排行榜数据不是数组格式，尝试旧格式...');
            const sortedScores = Object.entries(leaderboard || {}).sort((a, b) => b[1] - a[1]);
            sortedScores.forEach(([userId, score], index) => {
                const leaderboardItem = document.createElement('div');
                const isSelf = userId === currentUserId;
                leaderboardItem.className = `leaderboard-item ${isSelf ? 'self' : ''}`;
                
                let rankClass = 'other';
                if (index === 0) rankClass = 'top1';
                else if (index === 1) rankClass = 'top2';
                else if (index === 2) rankClass = 'top3';
                
                leaderboardItem.innerHTML = `
                    <span class="leaderboard-rank ${rankClass}">${index + 1}</span>
                    <span class="leaderboard-username">${userId}</span>
                    <span class="leaderboard-score">${score}</span>
                `;
                content.appendChild(leaderboardItem);
            });
            
            // 在控制台输出所有用户ID，方便封号
            console.log('========== 排行榜用户ID列表（用于封号）==========');
            sortedScores.forEach(([userId, score], index) => {
                console.log(`第${index + 1}名 - ID: ${userId}`);
            });
            console.log('========== 用户ID列表结束 ==========');
            console.log('所有用户ID数组:', sortedScores.map(([userId]) => userId));
        }
        
        // 如果没有排行榜数据
        if (content.children.length === 0) {
            content.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">暂无排行数据，请稍后再试</div>';
        }
    }
}

// 聊天功能
let chatRefreshInterval = null;
let chatAutoScrollEnabled = true;

function showChat() {
    showModal('chatModal');
    const messagesContainer = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.querySelector('#chatModal .btn-send');
    
    messagesContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">加载中...</div>';
    
    console.log('打开聊天窗口，检查云功能状态:', {
        cloudbaseUtils: !!window.cloudbaseUtils,
        initialized: window.cloudbaseUtils ? window.cloudbaseUtils.initialized : false,
        getChatMessages: window.cloudbaseUtils ? !!window.cloudbaseUtils.getChatMessages : false,
        sendMessage: window.cloudbaseUtils ? !!window.cloudbaseUtils.sendMessage : false,
        listenForMessages: window.cloudbaseUtils ? !!window.cloudbaseUtils.listenForMessages : false
    });
    
    // 清除之前的定时器
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }
    
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized) {
        // 先清空消息
        messagesContainer.innerHTML = '';
        
        // 启用输入和发送按钮
        chatInput.disabled = false;
        if (sendButton) sendButton.disabled = false;
        
        // 加载历史消息
        if (window.cloudbaseUtils.getChatMessages) {
            console.log('加载历史聊天消息');
            window.cloudbaseUtils.getChatMessages('global', 50)
                .then(messages => {
                    console.log('加载历史消息成功:', messages.length);
                    // 反转消息顺序，使最早的消息显示在最上面，最新的消息显示在最下面
                    messages.reverse().forEach(message => {
                        addChatMessage(message);
                    });
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                })
                .catch(error => {
                    console.error('加载历史消息失败:', error);
                    messagesContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">加载历史消息失败</div>';
                });
        }
        
        // 监听新消息
        let chatWatcherCleanup = null;
        if (window.cloudbaseUtils.listenForMessages) {
            try {
                console.log('开始监听新消息');
                chatWatcherCleanup = window.cloudbaseUtils.listenForMessages('global', message => {
                    console.log('收到新消息:', message);
                    addChatMessage(message);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                });
            } catch (e) {
                console.error('监听消息失败:', e);
                showToast('实时消息监听失败，将使用定期刷新');
            }
        }
        
        // 无论实时监听是否成功，都设置定期刷新作为备份
        chatRefreshInterval = setInterval(() => {
            if (document.getElementById('chatModal') && document.getElementById('chatModal').style.display !== 'none') {
                if (window.cloudbaseUtils && window.cloudbaseUtils.getChatMessages) {
                    console.log('定期刷新聊天消息');
                    const oldScrollHeight = messagesContainer.scrollHeight;
                    window.cloudbaseUtils.getChatMessages('global', 50)
                        .then(messages => {
                            console.log('获取到聊天消息:', messages.length);
                            // 清空现有消息，重新添加所有消息
                            messagesContainer.innerHTML = '';
                            // 反转消息顺序，使最早的消息显示在最上面，最新的消息显示在最下面
                            messages.reverse().forEach(message => {
                                addChatMessage(message);
                            });
                            if (messagesContainer.scrollTop >= oldScrollHeight - 100) {
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            }
                        })
                        .catch(error => {
                            console.error('定期刷新聊天失败:', error);
                        });
                }
            } else {
                if (chatRefreshInterval) {
                    clearInterval(chatRefreshInterval);
                    chatRefreshInterval = null;
                }
            }
        }, 10000); // 从3秒改为10秒
        
        // 为聊天模态框添加关闭事件监听器，确保清理资源
        const chatModal = document.getElementById('chatModal');
        const originalCloseModal = window.closeModal;
        window.closeModal = function(modalId) {
            if (modalId === 'chatModal') {
                // 清理聊天监听器
                if (chatWatcherCleanup) {
                    chatWatcherCleanup();
                    chatWatcherCleanup = null;
                }
                // 清理定期刷新
                if (chatRefreshInterval) {
                    clearInterval(chatRefreshInterval);
                    chatRefreshInterval = null;
                }
                console.log('聊天资源已清理');
            }
            // 调用原始的closeModal函数
            originalCloseModal(modalId);
        };
    } else {
        // 云功能未初始化，禁用输入和发送按钮
        chatInput.disabled = true;
        if (sendButton) sendButton.disabled = true;
        
        showToast('云功能未初始化，请检查网络连接或浏览器设置');
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
                <h3>聊天功能暂时不可用</h3>
                <p style="margin: 10px 0;">云功能未初始化，可能的原因：</p>
                <ul style="text-align: left; max-width: 300px; margin: 0 auto;">
                    <li>网络连接不稳定</li>
                    <li>浏览器跟踪预防功能阻止了连接</li>
                    <li>腾讯云服务暂时不可用</li>
                </ul>
                <p style="margin-top: 20px;">请检查网络连接后重试</p>
            </div>
        `;
    }
}

// 添加聊天消息
function addChatMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    const currentUserId = GameState.player.playerId || '匿名用户';
    
    // 处理腾讯云CloudBase的数据格式
    const userId = message.userId || message._id || message.user_id || '匿名用户';
    const messageText = message.message || message.content || '';
    const timestamp = message.timestamp || message.create_time || Date.now();
    
    const isSelf = userId === currentUserId;
    
    messageElement.className = `chat-message ${isSelf ? 'self' : 'other'}`;
    
    const timeString = new Date(timestamp).toLocaleTimeString();
    
    // 创建用户名
    const usernameDiv = document.createElement('span');
    usernameDiv.className = 'chat-username';
    usernameDiv.textContent = userId;
    
    // 创建气泡
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-message-bubble';
    
    // 创建文本内容，处理装备和宝石链接
    const textDiv = document.createElement('div');
    textDiv.className = 'chat-text';
    
    const equipPattern = /\[([^\]]+)\]([^{]+)\{EQUIP:([^}]+)\}/g;
    const gemPattern = /\[([^\]]+)\]([^{]+)\{GEM:([^}]+)\}/g;
    const matches = [];
    let match;
    
    while ((match = equipPattern.exec(messageText)) !== null) {
        matches.push({
            index: match.index,
            length: match[0].length,
            type: 'equip',
            quality: match[1],
            name: match[2],
            data: match[3]
        });
    }
    
    while ((match = gemPattern.exec(messageText)) !== null) {
        matches.push({
            index: match.index,
            length: match[0].length,
            type: 'gem',
            quality: match[1],
            name: match[2],
            data: match[3]
        });
    }
    
    matches.sort((a, b) => a.index - b.index);
    
    let lastIndex = 0;
    matches.forEach(m => {
        if (m.index > lastIndex) {
            textDiv.appendChild(document.createTextNode(messageText.substring(lastIndex, m.index)));
        }
        
        const link = document.createElement('span');
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';
        link.textContent = `[${m.quality}]${m.name}`;
        
        if (m.type === 'equip') {
            try {
                const equipDataDecoded = decodeURIComponent(escape(atob(m.data)));
                const item = JSON.parse(equipDataDecoded);
                link.style.color = item.color || '#3498db';
            } catch (e) {
                link.style.color = '#3498db';
            }
            link.onclick = function() {
                if (window.showChatEquipDetail) {
                    window.showChatEquipDetail(m.data);
                }
            };
        } else {
            link.style.color = '#e74c3c';
            link.onclick = function() {
                if (window.showChatGemDetail) {
                    window.showChatGemDetail(m.data);
                }
            };
        }
        
        textDiv.appendChild(link);
        lastIndex = m.index + m.length;
    });
    
    if (lastIndex < messageText.length) {
        textDiv.appendChild(document.createTextNode(messageText.substring(lastIndex)));
    }
    
    bubbleDiv.appendChild(textDiv);
    
    // 创建时间
    const timeDiv = document.createElement('span');
    timeDiv.className = 'chat-time';
    timeDiv.textContent = timeString;
    
    // 组装
    messageElement.appendChild(usernameDiv);
    messageElement.appendChild(bubbleDiv);
    messageElement.appendChild(timeDiv);
    
    messagesContainer.appendChild(messageElement);
    
    if (chatAutoScrollEnabled) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// 切换聊天自动滚动
function toggleChatAutoScroll() {
    chatAutoScrollEnabled = !chatAutoScrollEnabled;
    const btn = document.getElementById('chatAutoScrollBtn');
    if (chatAutoScrollEnabled) {
        btn.textContent = '🔓 自动滚动';
        btn.style.background = '#27ae60';
    } else {
        btn.textContent = '🔒 锁定滚动';
        btn.style.background = '#e74c3c';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message) {
        const userId = GameState.player.playerId || '匿名用户';
        console.log('尝试发送消息:', {
            message: message,
            userId: userId,
            cloudbaseUtils: !!window.cloudbaseUtils,
            initialized: window.cloudbaseUtils ? window.cloudbaseUtils.initialized : false,
            sendMessage: window.cloudbaseUtils ? !!window.cloudbaseUtils.sendMessage : false
        });
        if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.sendMessage) {
            window.cloudbaseUtils.sendMessage('global', userId, message)
                .then(() => {
                    console.log('消息发送成功');
                    input.value = '';
                    showToast('消息发送成功');
                })
                .catch(error => {
                    console.error('消息发送错误:', error);
                    showToast('消息发送失败: ' + error.message);
                });
        } else {
            console.error('云功能未初始化，无法发送消息');
            showToast('云功能未初始化，请检查网络连接或浏览器设置');
        }
    } else {
        showToast('消息不能为空');
    }
}

// 生成玩家ID
function generatePlayerId() {
    const numbers = Math.floor(Math.random() * 90000 + 10000).toString(); // 5位数字（10000-99999）
    let letters = '';
    for (let i = 0; i < 5; i++) {
        letters += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 5位大写字母
    }
    const playerId = numbers + letters;
    GameState.player.playerId = playerId;
    return playerId;
}

// 显示提示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 生成8位字母数字混合密码
function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// 验证密码格式（任意字符，至少包含一个字母或数字，不超过15位）
function validatePassword(password) {
    // 检查长度不超过15位
    if (password.length > 15) {
        return false;
    }
    // 检查是否包含至少一个字母或数字
    const hasLetterOrNumber = /[a-zA-Z0-9]/.test(password);
    return hasLetterOrNumber;
}

// 一键开始新游戏
function startNewGame() {
    const newPlayerId = generatePlayerId();
    const newPassword = generatePassword();
    
    GameState.player.password = newPassword;
    GameState.player.name = '无名战士';
    
    localStorage.setItem('playerId', newPlayerId);
    localStorage.setItem('playerPassword', newPassword);
    
    document.getElementById('newPlayerId').textContent = newPlayerId;
    document.getElementById('newPlayerPassword').textContent = newPassword;
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('gameInfo').style.display = 'block';
    document.getElementById('newPlayerInfo').style.display = 'block';
    
    // 更新UI
    updateTopBar();
    updateCharacterStats();
    updateBattleStatus();
    updateEquipmentSlots();
    updateEquippedSlotsDisplay();
    renderInventory();
    renderSkillSlots();
    renderSkillPool();
    
    // 生成第一个怪物
    spawnNextEnemy();
    
    // 显示职业选择
    setTimeout(() => {
        showClassModal();
    }, 100);
    
    saveGame();
    // 立即保存云存档
    saveCloudGame();
}

// 登录游戏
function loginGame() {
    const loginId = document.getElementById('loginId').value.trim();
    const loginPassword = document.getElementById('loginPassword').value.trim();
    
    if (!loginId || !loginPassword) {
        showToast('请输入玩家ID和密码');
        return;
    }
    
    showToast('正在登录...');
    
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.loadGameState) {
        window.cloudbaseUtils.loadGameState(loginId)
            .then(gameState => {
                if (gameState) {
                    if (gameState.player && gameState.player.password === loginPassword) {
                        Object.assign(GameState, gameState);
                        localStorage.setItem('playerId', loginId);
                        localStorage.setItem('playerPassword', loginPassword);
                        
                        document.getElementById('loginForm').style.display = 'none';
                        document.getElementById('gameInfo').style.display = 'block';
                        document.getElementById('newPlayerInfo').style.display = 'none';
                        
                        // 更新UI
                        updateTopBar();
                        updateCharacterStats();
                        updateBattleStatus();
                        updateEquipmentSlots();
                        updateEquippedSlotsDisplay();
                        renderInventory();
                        renderSkillSlots();
                        renderSkillPool();
                        
                        // 切换到战斗页面
                        switchPage('battle');
                        
                        // 生成第一个怪物
                        spawnNextEnemy();
                        
                        // 启动自动战斗
                        startAutoBattle();
                        
                        showToast('登录成功！');
                    } else {
                        showToast('密码错误！');
                    }
                } else {
                    showToast('未找到该玩家ID的存档');
                }
            })
            .catch(error => {
                showToast('登录失败: ' + error.message);
                console.error('登录错误:', error);
            });
    } else {
        showToast('云功能未初始化');
    }
}

// 进入游戏
function enterGame() {
    document.getElementById('loginModal').style.display = 'none';
    
    // 更新UI
    updateTopBar();
    updateCharacterStats();
    updateBattleStatus();
    updateEquipmentSlots();
    updateEquippedSlotsDisplay();
    renderInventory();
    renderSkillSlots();
    renderSkillPool();
    
    // 生成第一个怪物
    spawnNextEnemy();
    
    // 只有在玩家没有职业时才显示职业选择模态框
    if (!GameState.player.class) {
        setTimeout(() => {
            showClassModal();
        }, 100);
    } else {
        // 标记初始职业选择已完成
        GameState.isInitialClassSelection = false;
        
        // 切换到战斗页面
        switchPage('battle');
        
        // 开始自动战斗
        startAutoBattle();
    }
}

// 检查本地是否有保存的登录信息（同一设备自动登录）
function checkLocalLogin() {
    const savedPlayerId = localStorage.getItem('playerId');
    const savedPassword = localStorage.getItem('playerPassword');
    
    if (savedPlayerId && savedPassword) {
        console.log('检测到本地登录信息，尝试自动登录...');
        document.getElementById('loginId').value = savedPlayerId;
        document.getElementById('loginPassword').value = savedPassword;
        
        if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.loadGameState) {
            showToast('正在自动登录...');
            window.cloudbaseUtils.loadGameState(savedPlayerId)
                .then(gameState => {
                    if (gameState && gameState.player && gameState.player.password === savedPassword) {
                        Object.assign(GameState, gameState);
                        document.getElementById('loginModal').style.display = 'none';
                        document.getElementById('gameInfo').style.display = 'block';
                        document.getElementById('newPlayerInfo').style.display = 'none';
                        
                        // 更新UI
                        updateTopBar();
                        updateCharacterStats();
                        updateBattleStatus();
                        updateEquipmentSlots();
                        updateEquippedSlotsDisplay();
                        renderInventory();
                        renderSkillSlots();
                        renderSkillPool();
                        
                        // 切换到战斗页面
                        switchPage('battle');
                        
                        // 生成第一个怪物
                        spawnNextEnemy();
                        
                        // 启动自动战斗
                        startAutoBattle();
                        
                        showToast('自动登录成功！');
                    } else {
                        console.log('密码不匹配，需要手动登录');
                    }
                })
                .catch(error => {
                    console.error('自动登录失败:', error);
                    showToast('登录失败: ' + error.message);
                    // 清除本地存储的登录信息，防止下次自动登录
                    localStorage.removeItem('playerId');
                    localStorage.removeItem('playerPassword');
                });
        }
    } else {
        console.log('没有检测到本地登录信息，显示登录界面');
    }
}

// 挂载 checkLocalLogin 到 window 对象，让云初始化后可以调用
window.checkLocalLogin = checkLocalLogin;

// 初始化时不自动检查登录，等云初始化后再调用

// 打开设置界面时填充玩家信息
function openSettingsModal() {
    showModal('settingsModal');
    document.getElementById('settingsPlayerId').value = GameState.player.playerId || '';
    document.getElementById('settingsPlayerName').value = GameState.player.name || '';
    document.getElementById('settingsPlayerPassword').value = GameState.player.password || '';
}

// 切换账号
function switchAccount() {
    stopAutoBattle();
    closeModal('settingsModal');
    document.getElementById('gameInfo').style.display = 'none';
    document.getElementById('newPlayerInfo').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('loginId').value = '';
    document.getElementById('loginPassword').value = '';
}

window.switchAccount = switchAccount;

// 修改玩家名称
function updatePlayerName() {
    const newName = document.getElementById('settingsPlayerName').value.trim();
    if (!newName) {
        showToast('请输入玩家名称');
        return;
    }
    GameState.player.name = newName;
    saveGame();
    saveCloudGame();
    showToast('玩家名称修改成功！');
}

// 切换密码显示/隐藏
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('settingsPlayerPassword');
    const toggleBtn = event.target;
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '隐藏';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '显示';
    }
}

// 修改玩家密码
function updatePlayerPassword() {
    const newPassword = document.getElementById('settingsNewPassword').value.trim();
    if (!newPassword) {
        showToast('请输入新密码');
        return;
    }
    if (!validatePassword(newPassword)) {
        showToast('密码必须包含至少一个字母或数字，且不超过15位！');
        return;
    }
    GameState.player.password = newPassword;
    localStorage.setItem('playerPassword', newPassword);
    document.getElementById('settingsPlayerPassword').value = newPassword;
    document.getElementById('settingsNewPassword').value = '';
    saveGame();
    saveCloudGame();
    showToast('密码修改成功！');
}

// 替换原有的打开设置模态框函数
const originalShowSettingsModal = window.showSettingsModal;
window.showSettingsModal = openSettingsModal;

// 自动上传云存档功能
let autoSaveTimer = null;
let debounceTimer = null;
let isUploading = false;
let lastUploadTime = 0;

// 防抖函数：操作后2秒自动上传
function debouncedCloudSave() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
        autoSaveCloudGame();
    }, 2000);
}

// 自动保存云存档（避免重复上传）
function autoSaveCloudGame() {
    const now = Date.now();
    if (isUploading || (now - lastUploadTime < 5000)) {
        return;
    }
    
    const userId = GameState.player.playerId;
    if (!userId) {
        return;
    }
    
    isUploading = true;
    
    if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.saveGameState) {
        window.cloudbaseUtils.saveGameState(userId, GameState)
            .then(() => {
                lastUploadTime = Date.now();
                console.log('云存档自动保存成功');
            })
            .catch(error => {
                console.error('云存档自动保存失败:', error);
            })
            .finally(() => {
                isUploading = false;
            });
    } else {
        isUploading = false;
    }
}

// 监听游戏内的操作
function setupGameActionListeners() {
    const gameActions = [
        'attackEnemy', 'equipItem', 'useItem', 'buyItem', 
        'sellItem', 'dismantleItem', 'enhanceItem', 
        'upgradeSkill', 'enterDungeon', 'claimReward',
        'updatePlayerName', 'updatePlayerPassword'
    ];
    
    gameActions.forEach(actionName => {
        const originalFunction = window[actionName];
        if (originalFunction && typeof originalFunction === 'function') {
            window[actionName] = function(...args) {
                const result = originalFunction.apply(this, args);
                debouncedCloudSave();
                return result;
            };
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            debouncedCloudSave();
        }
    });
}

// 启动自动保存（每10秒）
function startAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    autoSaveTimer = setInterval(() => {
        autoSaveCloudGame();
    }, 10000);
    console.log('自动云存档已启动（每10秒）');
}

// 启动排行榜整点更新
function startLeaderboardUpdate() {
    function updateLeaderboardAtHour() {
        if (window.cloudbaseUtils && window.cloudbaseUtils.initialized && window.cloudbaseUtils.updateLeaderboardScore) {
            const userId = GameState.player.playerId;
            if (userId) {
                const score = calculateLeaderboardScore();
                const level = GameState.player.level;
                const equipmentScore = calculateTotalEquipmentScore();
                const kills = GameState.stats.monstersKilled;
                const playerName = GameState.player.name || '无名战士';
                window.cloudbaseUtils.updateLeaderboardScore(userId, {
                    score: score,
                    level: level || 0,
                    equipmentScore: equipmentScore || 0,
                    kills: kills || 0,
                    playerName: playerName
                }).then(() => {
                    console.log('排行榜整点更新成功');
                }).catch(() => {
                    console.log('排行榜整点更新失败');
                });
            }
        }
    }
    
    function scheduleNextUpdate() {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + 1);
        nextHour.setMinutes(0, 0, 0);
        const delay = nextHour.getTime() - now.getTime();
        
        setTimeout(() => {
            updateLeaderboardAtHour();
            scheduleNextUpdate();
        }, delay);
        
        console.log(`排行榜将在 ${nextHour.toLocaleString()} 自动更新`);
    }
    
    // 立即执行一次，然后定时执行
    updateLeaderboardAtHour();
    scheduleNextUpdate();
}

// 页面加载完成后启动自动保存和排行榜更新
setTimeout(() => {
    setupGameActionListeners();
    startAutoSave();
    startLeaderboardUpdate();
}, 2000);

// 暴露函数到全局作用域
window.loginGame = loginGame;
window.startNewGame = startNewGame;
