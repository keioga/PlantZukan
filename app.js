const video = document.getElementById('video');
const statusDiv = document.getElementById('status');
let model;

// ★ MobileNetの1000クラスから植物・花・自然物を網羅したキーワード
const plantKeywords = [
    // 花
    'daisy', 'tulip', 'rose', 'orchid', 'lily', 'sunflower', 'marigold',
    'hyacinth', 'lotus', 'carnation', 'poppy', 'lavender', 'dandelion',
    'chrysanthemum', 'azalea', 'begonia', 'dahlia', 'hibiscus', 'jasmine',
    'magnolia', 'pansy', 'peony', 'primrose', 'violet', 'zinnia',
    // 木・植物
    'fern', 'clover', 'ginkgo', 'buckeye', 'chestnut', 'fig', 'palm',
    'bamboo', 'cactus', 'bonsai', 'vine', 'moss', 'algae', 'seaweed',
    'willow', 'oak', 'maple', 'pine', 'cedar', 'spruce', 'birch',
    // 野菜・果物（植物として映ることがある）
    'pineapple', 'banana', 'corn', 'acorn', 'mushroom', 'artichoke',
    'cardoon', 'broccoli', 'cauliflower', 'cucumber', 'zucchini',
    // MobileNetがよく返す植物関連の複合語
    'pot', 'greenhouse', 'garden', 'flower', 'plant', 'leaf', 'tree',
    'bush', 'herb', 'blossom', 'bloom', 'petal', 'stem', 'root', 'seed'
];

// 表示名の日本語変換マップ（英語キーワード → 表示名）
const nameMap = {
    'daisy':        '🌼 Daisy（ヒナギク）',
    'tulip':        '🌷 Tulip（チューリップ）',
    'rose':         '🌹 Rose（バラ）',
    'sunflower':    '🌻 Sunflower（ヒマワリ）',
    'orchid':       '🌸 Orchid（ラン）',
    'lily':         '🌸 Lily（ユリ）',
    'marigold':     '🌼 Marigold（マリーゴールド）',
    'hyacinth':     '💐 Hyacinth（ヒヤシンス）',
    'lotus':        '🪷 Lotus（ハス）',
    'carnation':    '💐 Carnation（カーネーション）',
    'poppy':        '🌺 Poppy（ポピー）',
    'lavender':     '💜 Lavender（ラベンダー）',
    'dandelion':    '🌼 Dandelion（タンポポ）',
    'fern':         '🌿 Fern（シダ）',
    'cactus':       '🌵 Cactus（サボテン）',
    'bamboo':       '🎋 Bamboo（タケ）',
    'palm':         '🌴 Palm（ヤシ）',
    'mushroom':     '🍄 Mushroom（キノコ）',
    'pineapple':    '🍍 Pineapple（パイナップル）',
    'banana':       '🍌 Banana（バナナ）',
    'corn':         '🌽 Corn（トウモロコシ）',
    'ginkgo':       '🍂 Ginkgo（イチョウ）',
    'maple':        '🍁 Maple（カエデ）',
    'pot':          '🪴 Potted Plant（鉢植え）',
    'flower':       '🌸 Flower（花）',
    'plant':        '🌱 Plant（植物）',
    'leaf':         '🍃 Leaf（葉）',
    'tree':         '🌳 Tree（木）',
    'blossom':      '🌸 Blossom（花）',
    'garden':       '🌿 Garden Plant（庭の植物）',
};

// カメラ起動
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });
        video.srcObject = stream;
        return new Promise((resolve) => video.onloadedmetadata = () => resolve(video));
    } catch (e) {
        statusDiv.innerText = "カメラの起動に失敗: " + e.message;
    }
}

// AIモデル読み込み
async function initAI() {
    statusDiv.innerText = "カメラと植物図鑑AIを準備中...";
    await setupCamera();

    try {
        model = await mobilenet.load({ version: 2, alpha: 1.0 });
        statusDiv.innerText = "植物図鑑 準備完了！モニターに花や植物を映してください 🌿";
        predictLoop();
    } catch (e) {
        statusDiv.innerText = "AIの読み込みに失敗しました: " + e.message;
        console.error(e);
    }
}

// メインループ
async function predictLoop() {
    if (video.readyState >= 2) {
        try {
            // 上位5候補に増やす（植物が下位に来ることがあるため）
            const predictions = await model.classify(video, 5);

            if (predictions && predictions.length > 0) {
                let foundPlant = null;
                let matchedKeyword = null;

                for (let pred of predictions) {
                    const lowerName = pred.className.toLowerCase();
                    const matched = plantKeywords.find(keyword => lowerName.includes(keyword));
                    // ★ 閾値を10%に下げる（モニター画像は本物より認識しにくいため）
                    if (matched && pred.probability >= 0.10) {
                        foundPlant = pred;
                        matchedKeyword = matched;
                        break;
                    }
                }

                if (foundPlant && matchedKeyword) {
                    // nameMapから日本語名を取得、なければ英語のまま
                    const displayName = nameMap[matchedKeyword]
                        || `🌿 ${foundPlant.className.split(',')[0]}`;
                    const score = Math.round(foundPlant.probability * 100);

                    statusDiv.innerHTML = `
                        <div style="color:#00df89; font-size:1.2rem; font-weight:bold; margin-bottom:5px;">
                            📖 植物図鑑に登録するよ！
                        </div>
                        <span style="font-size:1.8rem; font-weight:bold; color:#ffffff;
                                     background-color:#2e7d32; padding:4px 12px; border-radius:8px;">
                            ${displayName}
                        </span>
                        <span style="font-size:1.1rem; color:#aaa; margin-left:8px;">
                            確信度 ${score}%
                        </span>
                    `;
                } else {
                    const hint = predictions[0].className.split(',')[0];
                    const hintScore = Math.round(predictions[0].probability * 100);
                    statusDiv.innerHTML = `
                        <span style="color:#888; font-size:1.2rem;">
                            🔍 植物を探索中...なにかななにかな (予測: ${hint} / ${hintScore}%)
                        </span>
                    `;
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
    window.requestAnimationFrame(predictLoop);
}

window.addEventListener('load', initAI);