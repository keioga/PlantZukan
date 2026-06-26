const video = document.getElementById('video');
const statusDiv = document.getElementById('status');
let model;

// MobileNetが認識できる動物を網羅（日本語名・絵文字つき）
const animalMap = {
  // 犬（120種以上から主要なものを掲載）
  'chihuahua':           { ja: 'チワワ',           emoji: '🐕' },
  'toy poodle':          { ja: 'トイプードル',      emoji: '🐩' },
  'shih-tzu':            { ja: 'シーズー',          emoji: '🐕' },
  'pomeranian':          { ja: 'ポメラニアン',      emoji: '🐕' },
  'golden retriever':    { ja: 'ゴールデンレトリバー', emoji: '🐕' },
  'labrador retriever':  { ja: 'ラブラドール',      emoji: '🐕' },
  'siberian husky':      { ja: 'シベリアンハスキー', emoji: '🐕' },
  'maltese':             { ja: 'マルチーズ',        emoji: '🐩' },
  'pug':                 { ja: 'パグ',              emoji: '🐕' },
  'beagle':              { ja: 'ビーグル',          emoji: '🐕' },
  'dachshund':           { ja: 'ダックスフンド',    emoji: '🐕' },
  'corgi':               { ja: 'コーギー',          emoji: '🐕' },
  'dalmatian':           { ja: 'ダルメシアン',      emoji: '🐕' },
  'bulldog':             { ja: 'ブルドッグ',        emoji: '🐕' },
  'german shepherd':     { ja: 'ジャーマンシェパード', emoji: '🐕' },
  'yorkshire terrier':   { ja: 'ヨークシャーテリア', emoji: '🐕' },
  'boxer':               { ja: 'ボクサー',          emoji: '🐕' },
  'border collie':       { ja: 'ボーダーコリー',    emoji: '🐕' },
  'samoyed':             { ja: 'サモエド',          emoji: '🐕' },
  'chow':                { ja: 'チャウチャウ',      emoji: '🐕' },
  // 猫
  'tabby':               { ja: 'トラ猫',            emoji: '🐈' },
  'persian cat':         { ja: 'ペルシャ猫',        emoji: '🐈' },
  'siamese cat':         { ja: 'シャム猫',          emoji: '🐈' },
  'egyptian cat':        { ja: 'エジプシャン猫',    emoji: '🐈' },
  'tiger cat':           { ja: 'トラ猫',            emoji: '🐈' },
  // 鳥
  'macaw':               { ja: 'コンゴウインコ',    emoji: '🦜' },
  'cockatoo':            { ja: 'オウム',            emoji: '🦜' },
  'lorikeet':            { ja: 'ロリキート',        emoji: '🦜' },
  'flamingo':            { ja: 'フラミンゴ',        emoji: '🦩' },
  'pelican':             { ja: 'ペリカン',          emoji: '🐦' },
  'peacock':             { ja: 'クジャク',          emoji: '🦚' },
  'robin':               { ja: 'コマドリ',          emoji: '🐦' },
  'penguin':             { ja: 'ペンギン',          emoji: '🐧' },
  'toucan':              { ja: 'オオハシ',          emoji: '🦜' },
  'hummingbird':         { ja: 'ハチドリ',          emoji: '🐦' },
  'ostrich':             { ja: 'ダチョウ',          emoji: '🐦' },
  'eagle':               { ja: 'ワシ',              emoji: '🦅' },
  'owl':                 { ja: 'フクロウ',          emoji: '🦉' },
  // 哺乳類
  'cat':                 { ja: 'ネコ',              emoji: '🐱' },
  'dog':                 { ja: 'イヌ',              emoji: '🐶' },
  'rabbit':              { ja: 'ウサギ',            emoji: '🐰' },
  'hamster':             { ja: 'ハムスター',        emoji: '🐹' },
  'elephant':            { ja: 'ゾウ',              emoji: '🐘' },
  'giraffe':             { ja: 'キリン',            emoji: '🦒' },
  'zebra':               { ja: 'シマウマ',          emoji: '🦓' },
  'lion':                { ja: 'ライオン',          emoji: '🦁' },
  'tiger':               { ja: 'トラ',              emoji: '🐯' },
  'bear':                { ja: 'クマ',              emoji: '🐻' },
  'panda':               { ja: 'パンダ',            emoji: '🐼' },
  'koala':               { ja: 'コアラ',            emoji: '🐨' },
  'kangaroo':            { ja: 'カンガルー',        emoji: '🦘' },
  'fox':                 { ja: 'キツネ',            emoji: '🦊' },
  'wolf':                { ja: 'オオカミ',          emoji: '🐺' },
  'monkey':              { ja: 'サル',              emoji: '🐒' },
  'gorilla':             { ja: 'ゴリラ',            emoji: '🦍' },
  'horse':               { ja: 'ウマ',              emoji: '🐴' },
  'cow':                 { ja: 'ウシ',              emoji: '🐄' },
  'pig':                 { ja: 'ブタ',              emoji: '🐷' },
  'sheep':               { ja: 'ヒツジ',            emoji: '🐑' },
  'goat':                { ja: 'ヤギ',              emoji: '🐐' },
  'deer':                { ja: 'シカ',              emoji: '🦌' },
  'camel':               { ja: 'ラクダ',            emoji: '🐪' },
  'hippopotamus':        { ja: 'カバ',              emoji: '🦛' },
  'rhinoceros':          { ja: 'サイ',              emoji: '🦏' },
  'squirrel':            { ja: 'リス',              emoji: '🐿️' },
  'otter':               { ja: 'カワウソ',          emoji: '🦦' },
  'raccoon':             { ja: 'アライグマ',        emoji: '🦝' },
  // 海の生き物
  'goldfish':            { ja: '金魚',              emoji: '🐟' },
  'shark':               { ja: 'サメ',              emoji: '🦈' },
  'whale':               { ja: 'クジラ',            emoji: '🐋' },
  'dolphin':             { ja: 'イルカ',            emoji: '🐬' },
  'jellyfish':           { ja: 'クラゲ',            emoji: '🪼' },
  'starfish':            { ja: 'ヒトデ',            emoji: '⭐' },
  'crab':                { ja: 'カニ',              emoji: '🦀' },
  'lobster':             { ja: 'ロブスター',        emoji: '🦞' },
  // 爬虫類・両生類
  'turtle':              { ja: 'カメ',              emoji: '🐢' },
  'lizard':              { ja: 'トカゲ',            emoji: '🦎' },
  'snake':               { ja: 'ヘビ',              emoji: '🐍' },
  'frog':                { ja: 'カエル',            emoji: '🐸' },
  'crocodile':           { ja: 'ワニ',              emoji: '🐊' },
  // 虫
  'butterfly':           { ja: 'チョウ',            emoji: '🦋' },
  'bee':                 { ja: 'ハチ',              emoji: '🐝' },
  'ladybug':             { ja: 'テントウムシ',      emoji: '🐞' },
  'dragonfly':           { ja: 'トンボ',            emoji: '🪳' },
  'ant':                 { ja: 'アリ',              emoji: '🐜' },
  'snail':               { ja: 'カタツムリ',        emoji: '🐌' },
  'spider':              { ja: 'クモ',              emoji: '🕷️' },
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
    statusDiv.innerText = 'カメラの起動に失敗: ' + e.message;
  }
}

// AIモデル読み込み
async function initAI() {
  statusDiv.innerHTML = '<span style="color:#aaa;">🔄 動物図鑑AIを準備中...</span>';
  await setupCamera();
  try {
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    statusDiv.innerHTML = '<span style="color:#00df89;">✅ 準備完了！カメラに動物を映してください 🐾</span>';
    predictLoop();
  } catch (e) {
    statusDiv.innerText = 'AIの読み込みに失敗: ' + e.message;
  }
}

// メインループ
async function predictLoop() {
  if (video.readyState >= 2) {
    try {
      const predictions = await model.classify(video, 5);

      if (predictions && predictions.length > 0) {
        let found = null;
        let foundData = null;

        for (let pred of predictions) {
          const lowerName = pred.className.toLowerCase();
          const matchedKey = Object.keys(animalMap).find(key => lowerName.includes(key));
          if (matchedKey && pred.probability >= 0.10) {
            found = { name: matchedKey, probability: pred.probability };
            foundData = animalMap[matchedKey];
            break;
          }
        }

        if (found && foundData) {
          const score = Math.round(found.probability * 100);
          // 確信度によって色を変える
          const scoreColor = score >= 70 ? '#00df89' : score >= 40 ? '#f0c040' : '#ff8c69';

          statusDiv.innerHTML = `
            <div style="
              display: inline-block;
              background: #1a1a2e;
              border: 2px solid #00df89;
              border-radius: 16px;
              padding: 16px 24px;
              text-align: center;
              min-width: 220px;
              box-shadow: 0 0 20px rgba(0,223,137,0.3);
            ">
              <div style="font-size: 3rem; margin-bottom: 8px;">${foundData.emoji}</div>
              <div style="color: #aaa; font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 4px;">
                📖 動物図鑑
              </div>
              <div style="color: #ffffff; font-size: 1.8rem; font-weight: bold; margin-bottom: 4px;">
                ${foundData.ja}
              </div>
              <div style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">
                ${found.name}
              </div>
              <div style="
                display: inline-block;
                background: ${scoreColor};
                color: #000;
                font-weight: bold;
                font-size: 0.9rem;
                padding: 3px 12px;
                border-radius: 20px;
              ">確信度 ${score}%</div>
            </div>
          `;
        } else {
          const hint = predictions[0].className.split(',')[0];
          statusDiv.innerHTML = `
            <span style="color:#888; font-size:1.2rem;">
              🔍 探索中... (予測: ${hint})
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