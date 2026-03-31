// 腾讯云 CloudBase 配置信息（请替换为您自己的项目配置）
const tencentCloudConfig = {
    env: "mygame-7g6rhhskc1d3d365", // 环境ID
    region: "ap-shanghai", // 地域，上海
    // 增加超时配置
    timeout: 10000
};

// 全局变量
let app = null;
let db = null;

// 等待 CloudBase SDK 加载完成后初始化
function initCloudBase() {
    if (typeof cloudbase !== 'undefined') {
        console.log('CloudBase SDK 加载完成，开始初始化');
        try {
            // 初始化腾讯云 CloudBase
            app = cloudbase.init(tencentCloudConfig);
            db = app.database();
            // 保存 app 实例到全局
            window.cloudbase = app;

            console.log('CloudBase 初始化成功');

            // 登录匿名用户
            app.auth().signInAnonymously()
                .then(() => {
                    console.log('匿名登录成功');
                    // 初始化完成后通知游戏
                    setupCloudbaseUtils(true);
                })
                .catch(error => {
                    console.error('匿名登录失败:', error);
                    // 即使登录失败，也设置 cloudbaseUtils，但标记为未初始化
                    setupCloudbaseUtils(false);
                });
        } catch (error) {
            console.error('CloudBase 初始化失败:', error);
            // 即使初始化失败，也设置 cloudbaseUtils，但标记为未初始化
            setupCloudbaseUtils(false);
        }
    } else {
        // 检查是否已经尝试过加载
        if (!window.cloudbaseInitAttempts) {
            window.cloudbaseInitAttempts = 0;
        }
        window.cloudbaseInitAttempts++;
        
        if (window.cloudbaseInitAttempts <= 5) {
            console.log('等待 CloudBase SDK 加载... (尝试 ' + window.cloudbaseInitAttempts + '/5)');
            // 增加超时时间，避免过于频繁的尝试
            setTimeout(initCloudBase, 2000);
        } else {
            console.log('CloudBase SDK 加载失败，可能被浏览器跟踪预防阻止或网络问题');
            console.log('云功能将无法使用，请检查网络连接或浏览器设置');
            console.log('建议：1. 检查网络连接 2. 尝试使用其他浏览器 3. 暂时关闭浏览器的跟踪预防功能');
            // 停止尝试，直接设置 cloudbaseUtils，但标记为未初始化
            setupCloudbaseUtils(false);
        }
    }
}

// 设置 cloudbaseUtils
function setupCloudbaseUtils(initialized) {
    window.cloudbaseUtils = {
        initialized: initialized || false,
        saveGameState,
        loadGameState,
        getLeaderboard,
        sendMessage,
        listenForMessages,
        getChatMessages,
        updateLeaderboardScore,
        calculatePlayerScore
    };
    console.log('cloudbaseUtils已导出:', window.cloudbaseUtils);
    console.log('云功能初始化状态:', initialized ? '成功' : '失败');
    
    if (!initialized) {
        console.error('云功能未初始化，所有云操作将失败');
    } else {
        console.log('云功能初始化成功，检查是否有本地登录信息...');
        // 云初始化成功后，检查本地是否有登录信息
        setTimeout(() => {
            if (typeof window.checkLocalLogin === 'function') {
                window.checkLocalLogin();
            }
        }, 500);
    }
}

// 云存档功能
function saveGameState(userId, gameState) {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
                reject(new Error('云功能未初始化，请检查网络连接或浏览器设置'));
                return;
            }
            if (!db) {
                reject(new Error('CloudBase 数据库未初始化'));
                return;
            }
            const score = calculatePlayerScore(gameState);
            
            db.collection('game_states').doc(userId).set({
                gameState: gameState,
                score: score,
                lastUpdated: Date.now()
            })
            .then(() => {
                return db.collection('leaderboard').doc(userId).set({ score: score });
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                console.error('保存游戏状态失败:', error);
                reject(new Error('保存游戏状态失败: ' + error.message));
            });
        } catch (error) {
            console.error('保存游戏状态异常:', error);
            reject(new Error('保存游戏状态异常: ' + error.message));
        }
    });
}

function loadGameState(userId) {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
                reject(new Error('云功能未初始化，请检查网络连接或浏览器设置'));
                return;
            }
            if (!db) {
                reject(new Error('CloudBase 数据库未初始化'));
                return;
            }
            console.log('开始加载云存档，userId:', userId);
            db.collection('game_states').doc(userId).get()
            .then(res => {
                console.log('云存档查询结果:', res);
                let gameState = null;
                
                // 尝试多种方式获取数据
                if (res.data) {
                    if (typeof res.data === 'function') {
                        const data = res.data();
                        console.log('通过 data() 方法获取:', data);
                        if (data) {
                            if (Array.isArray(data) && data.length > 0) {
                                gameState = data[0].gameState;
                            } else if (data.gameState) {
                                gameState = data.gameState;
                            }
                        }
                    } else {
                        console.log('通过 data 属性获取:', res.data);
                        if (Array.isArray(res.data) && res.data.length > 0) {
                            gameState = res.data[0].gameState;
                        } else if (res.data.gameState) {
                            gameState = res.data.gameState;
                        }
                    }
                } else if (res.docs && res.docs.length > 0) {
                    console.log('通过 docs 属性获取:', res.docs[0]);
                    const data = res.docs[0].data();
                    if (data && data.gameState) {
                        gameState = data.gameState;
                    }
                } else if (res.exists) {
                    console.log('文档存在，尝试获取数据');
                    const data = res.data ? (typeof res.data === 'function' ? res.data() : res.data) : null;
                    if (data) {
                        if (Array.isArray(data) && data.length > 0) {
                            gameState = data[0].gameState;
                        } else if (data.gameState) {
                            gameState = data.gameState;
                        }
                    }
                }
                
                console.log('最终获取的 gameState:', gameState);
                resolve(gameState);
            })
            .catch(error => {
                console.error('加载游戏状态失败:', error);
                reject(new Error('加载游戏状态失败: ' + error.message));
            });
        } catch (error) {
            console.error('加载游戏状态异常:', error);
            reject(new Error('加载游戏状态异常: ' + error.message));
        }
    });
}

// 排行榜功能
function getLeaderboard() {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
                reject(new Error('云功能未初始化，请检查网络连接或浏览器设置'));
                return;
            }
            if (!db) {
                reject(new Error('CloudBase 数据库未初始化'));
                return;
            }
            console.log('开始获取排行榜数据...');
            db.collection('leaderboard')
                .orderBy('score', 'desc')
                .limit(10)
                .get()
            .then(res => {
                console.log('排行榜查询结果:', res);
                // 适配 CloudBase SDK 返回格式
                const leaderboard = [];
                if (res.data) {
                    // 新格式：res.data 是属性
                    if (Array.isArray(res.data)) {
                        leaderboard.push(...res.data.map(item => ({
                            _id: item._id,
                            score: item.score,
                            level: item.level,
                            equipmentScore: item.equipmentScore,
                            kills: item.kills,
                            playerName: item.playerName
                        })));
                    } else if (typeof res.data === 'function') {
                        // 旧格式：res.data() 是方法
                        leaderboard.push(...res.data().map(item => ({
                            _id: item._id,
                            score: item.score,
                            level: item.level,
                            equipmentScore: item.equipmentScore,
                            kills: item.kills,
                            playerName: item.playerName
                        })));
                    }
                } else if (res.docs) {
                    // 另一种格式：res.docs 包含文档列表
                    leaderboard.push(...res.docs.map(doc => {
                        const data = doc.data();
                        return {
                            _id: doc.id,
                            score: data.score,
                            level: data.level,
                            equipmentScore: data.equipmentScore,
                            kills: data.kills,
                            playerName: data.playerName
                        };
                    }));
                }
                console.log('处理后的排行榜数据:', leaderboard);
                resolve(leaderboard);
            })
            .catch(error => {
                console.error('获取排行榜失败:', error);
                reject(new Error('获取排行榜失败: ' + error.message));
            });
        } catch (error) {
            console.error('获取排行榜异常:', error);
            reject(new Error('获取排行榜异常: ' + error.message));
        }
    });
}

function updateLeaderboardScore(userId, data) {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
                reject(new Error('云功能未初始化，请检查网络连接或浏览器设置'));
                return;
            }
            if (!db) {
                reject(new Error('CloudBase 数据库未初始化'));
                return;
            }
            console.log('开始更新排行榜数据:', { userId, data });
            db.collection('leaderboard').doc(userId).set(data)
                .then(res => {
                    console.log('排行榜数据更新成功:', res);
                    resolve();
                })
                .catch(error => {
                    console.error('更新排行榜数据失败:', error);
                    reject(new Error('更新排行榜数据失败: ' + error.message));
                });
        } catch (error) {
            console.error('更新排行榜数据异常:', error);
            reject(new Error('更新排行榜数据异常: ' + error.message));
        }
    });
}

// 聊天功能
function sendMessage(channel, userId, message) {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
                reject(new Error('云功能未初始化，请检查网络连接或浏览器设置'));
                return;
            }
            if (!db) {
                reject(new Error('CloudBase 数据库未初始化'));
                return;
            }
            db.collection('chat').add({
                roomId: channel,
                userId: userId,
                message: message,
                timestamp: Date.now()
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                console.error('发送消息失败:', error);
                reject(new Error('发送消息失败: ' + error.message));
            });
        } catch (error) {
            console.error('发送消息异常:', error);
            reject(new Error('发送消息异常: ' + error.message));
        }
    });
}

function listenForMessages(channel, callback) {
    try {
        if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
            console.error('云功能未初始化，无法监听消息');
            return;
        }
        if (!db) {
            console.error('CloudBase 数据库未初始化');
            return;
        }
        db.collection('chat')
            .where({ roomId: channel })
            .orderBy('timestamp', 'asc')
            .watch({
                onChange: snapshot => {
                    snapshot.docChanges.forEach(change => {
                        if (change.type === 'add') {
                            callback(change.doc.data());
                        }
                    });
                },
                onError: error => {
                    console.error('监听消息失败:', error);
                }
            });
    } catch (error) {
        console.error('监听消息异常:', error);
    }
}

function getChatMessages(channel, limit) {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudbaseUtils || !window.cloudbaseUtils.initialized) {
                reject(new Error('云功能未初始化，请检查网络连接或浏览器设置'));
                return;
            }
            if (!db) {
                reject(new Error('CloudBase 数据库未初始化'));
                return;
            }
            db.collection('chat')
                .where({ roomId: channel })
                .orderBy('timestamp', 'asc')
                .limit(limit || 50)
                .get()
            .then(res => {
                const messages = [];
                if (res.data) {
                    if (Array.isArray(res.data)) {
                        // 新格式：res.data 是属性
                        messages.push(...res.data);
                    } else if (typeof res.data === 'function') {
                        // 旧格式：res.data() 是方法
                        messages.push(...res.data());
                    }
                } else if (res.docs) {
                    // 另一种格式：res.docs 包含文档列表
                    messages.push(...res.docs.map(doc => doc.data()));
                }
                resolve(messages);
            })
            .catch(error => {
                console.error('获取聊天消息失败:', error);
                reject(new Error('获取聊天消息失败: ' + error.message));
            });
        } catch (error) {
            console.error('获取聊天消息异常:', error);
            reject(new Error('获取聊天消息异常: ' + error.message));
        }
    });
}

// 计算玩家评分（用于排行榜）
function calculatePlayerScore(gameState) {
    if (!gameState || !gameState.player) {
        return 0;
    }
    
    const player = gameState.player;
    let score = 0;
    
    // 基础评分
    score += player.level * 100;
    score += player.gold / 10000;
    score += player.diamonds * 10;
    
    // 装备评分
    if (gameState.equipment) {
        for (const slot in gameState.equipment) {
            const item = gameState.equipment[slot];
            if (item) {
                score += item.quality * 50;
                score += (item.enhanceLevel || 0) * 10;
            }
        }
    }
    
    // 技能评分
    if (gameState.skills) {
        gameState.skills.forEach(skill => {
            if (skill) {
                score += skill.quality * 30;
                score += (skill.level || 0) * 5;
            }
        });
    }
    
    // 统计数据评分
    if (gameState.stats) {
        score += (gameState.stats.battlesWon || 0) * 2;
        score += (gameState.stats.monstersKilled || 0) * 0.1;
    }
    
    return Math.floor(score);
}

// 立即设置基础 cloudbaseUtils，避免游戏显示未初始化
if (!window.cloudbaseUtils) {
    setupCloudbaseUtils(false);
}

// 开始初始化
initCloudBase();

// 初始化完成后通知游戏
console.log('腾讯云CloudBase初始化流程已启动');
console.log('请检查控制台日志查看初始化状态');
console.log('如果SDK加载失败，请尝试：');
console.log('1. 检查网络连接');
console.log('2. 尝试使用其他浏览器');
console.log('3. 暂时关闭浏览器的跟踪预防功能');
console.log('4. 确保腾讯云环境配置正确');
console.log('环境ID:', tencentCloudConfig.env);
console.log('地域:', tencentCloudConfig.region);