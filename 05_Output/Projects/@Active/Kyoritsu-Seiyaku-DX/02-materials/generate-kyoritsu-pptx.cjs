const PptxGenJS = require("pptxgenjs");
const path = require("path");

// ブランドカラー
const C = {
  main: "156082",
  accent: "6CE6E8",
  gold: "F3C551",
  orange: "E67E22",
  text: "333333",
  sub: "666666",
  light: "F8F9FA",
  white: "FFFFFF",
  border: "E0E0E0"
};

const F = "Meiryo UI";
const assets = path.join(process.env.HOME, ".claude/skills/ntt-dxpartner-pptx/assets");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = "【社内議論用】共立製薬 スコアシートDX提案";
pres.author = "NTT DXパートナー";

// 共通ヘッダー関数
function addHeader(slide, title) {
  slide.addImage({ path: `${assets}/bg-content.png`, x: 0, y: 0, w: 10, h: 5.625 });
  slide.addText(title, {
    x: 0.4, y: 0.25, w: 8, h: 0.5,
    fontSize: 24, bold: true, color: C.text, fontFace: F
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 0.75, w: 9.2, h: 0.025, fill: { color: C.main }
  });
}

// ========== スライド1: 表紙 ==========
let s1 = pres.addSlide();
s1.addImage({ path: `${assets}/bg-title.png`, x: 0, y: 0, w: 10, h: 5.625 });
s1.addText("共立製薬株式会社 様", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("スコアシートDX提案", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("【社内議論用】", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== スライド2: 背景 ==========
let s2 = pres.addSlide();
addHeader(s2, "背景");

// 背景説明カード
s2.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 9, h: 1.8,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s2.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 0.08, h: 1.8, fill: { color: C.main }
});
s2.addText("案件の経緯", {
  x: 0.75, y: 1.25, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s2.addText("• 当初は映像データの異常検知から始まった案件\n\n• クライアント都合等により、現在はスコアシートDXに落ち着いた", {
  x: 0.75, y: 1.7, w: 8.5, h: 1.0,
  fontSize: 14, color: C.text, fontFace: F, lineSpacing: 24
});

// フロー図
s2.addText("案件の変遷", {
  x: 0.5, y: 3.2, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.sub, fontFace: F
});

const steps = ["映像データ\n異常検知", "→", "スコアシート\nDX"];
const xPositions = [1.5, 4.0, 5.5];
steps.forEach((step, i) => {
  if (step === "→") {
    s2.addText("→", {
      x: xPositions[i], y: 3.7, w: 1, h: 0.6,
      fontSize: 28, color: C.main, fontFace: F, align: "center"
    });
  } else {
    const isLast = i === steps.length - 1;
    s2.addShape(pres.ShapeType.roundRect, {
      x: xPositions[i], y: 3.6, w: 2.2, h: 0.9,
      fill: { color: isLast ? C.main : C.light },
      rectRadius: 0.05
    });
    s2.addText(step, {
      x: xPositions[i], y: 3.7, w: 2.2, h: 0.7,
      fontSize: 12, bold: true, color: isLast ? C.white : C.sub, fontFace: F, align: "center"
    });
  }
});

s2.addText("クライアント都合等", {
  x: 3.5, y: 4.6, w: 3, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F, align: "center"
});

// ========== スライド3: 今回の相談 ==========
let s3 = pres.addSlide();
addHeader(s3, "今回の相談");

// 導入テキスト
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 9, h: 0.7,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s3.addText("現状、先方との会話を踏まえて 2つの提案 を検討中。その内容や進め方について相談したい。", {
  x: 0.7, y: 1.2, w: 8.5, h: 0.4,
  fontSize: 13, color: C.text, fontFace: F
});

// 施策カード①
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 2.0, w: 4.4, h: 2.5,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 2.0, w: 4.4, h: 0.08, fill: { color: C.main }
});
s3.addText("①", {
  x: 0.7, y: 2.2, w: 0.5, h: 0.4,
  fontSize: 20, bold: true, color: C.main, fontFace: F
});
s3.addText("スコアシートDX化（OCR）", {
  x: 1.2, y: 2.25, w: 3.5, h: 0.4,
  fontSize: 16, bold: true, color: C.text, fontFace: F
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.7, y: 2.75, w: 4.0, h: 0.015, fill: { color: C.border }
});
s3.addText("紙のスコアシート → Excel転記の自動化", {
  x: 0.7, y: 2.95, w: 4.0, h: 0.5,
  fontSize: 12, color: C.sub, fontFace: F
});
s3.addText("【相談事項】\n• スコープの切り方\n• 環境（AWS vs GCP）\n• OCRエンジンの選定\n• 精度の合格基準", {
  x: 0.7, y: 3.5, w: 4.0, h: 1.0,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 施策カード②
s3.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 2.0, w: 4.4, h: 2.5,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s3.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 2.0, w: 4.4, h: 0.08, fill: { color: C.gold }
});
s3.addText("②", {
  x: 5.3, y: 2.2, w: 0.5, h: 0.4,
  fontSize: 20, bold: true, color: C.gold, fontFace: F
});
s3.addText("データ基盤構築", {
  x: 5.8, y: 2.25, w: 3.5, h: 0.4,
  fontSize: 16, bold: true, color: C.text, fontFace: F
});
s3.addShape(pres.ShapeType.rect, {
  x: 5.3, y: 2.75, w: 4.0, h: 0.015, fill: { color: C.border }
});
s3.addText("ExcelデータをSnowflakeへ格納し\n利活用基盤を構築", {
  x: 5.3, y: 2.95, w: 4.0, h: 0.6,
  fontSize: 12, color: C.sub, fontFace: F
});
s3.addText("【相談事項】\n• 方向性の確認\n• 社内知見の共有依頼", {
  x: 5.3, y: 3.6, w: 4.0, h: 0.8,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// ========== スライド4: 相談① 運用フロー・スコープ ==========
let s4 = pres.addSlide();
addHeader(s4, "相談①：本番運用フロー・スコープ");

// 現状 vs 本番フロー
s4.addText("現状", {
  x: 0.5, y: 1.05, w: 1, h: 0.3,
  fontSize: 11, bold: true, color: C.sub, fontFace: F
});
s4.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 1.35, w: 1.5, h: 0.5,
  fill: { color: C.light }, rectRadius: 0.03
});
s4.addText("紙に記入", {
  x: 0.5, y: 1.4, w: 1.5, h: 0.4,
  fontSize: 10, color: C.text, fontFace: F, align: "center"
});
s4.addText("→", {
  x: 2.05, y: 1.4, w: 0.3, h: 0.4,
  fontSize: 14, color: C.sub, fontFace: F, align: "center"
});
s4.addShape(pres.ShapeType.roundRect, {
  x: 2.4, y: 1.35, w: 1.5, h: 0.5,
  fill: { color: "FFEBEE" }, rectRadius: 0.03
});
s4.addText("Excel転記\n(手作業)", {
  x: 2.4, y: 1.35, w: 1.5, h: 0.5,
  fontSize: 9, color: "C62828", fontFace: F, align: "center", bold: true
});

// 本番運用フロー
s4.addText("本番運用フロー（想定）", {
  x: 5.0, y: 1.05, w: 3, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});

const flowSteps = ["紙", "スキャン", "OCR", "確認UI", "Excel"];
const flowX = [5.0, 5.9, 6.8, 7.7, 8.7];
flowSteps.forEach((step, i) => {
  s4.addShape(pres.ShapeType.roundRect, {
    x: flowX[i], y: 1.35, w: 0.8, h: 0.5,
    fill: { color: i === 2 ? C.main : (i === 3 ? C.accent : C.light) },
    rectRadius: 0.03
  });
  s4.addText(step, {
    x: flowX[i], y: 1.4, w: 0.8, h: 0.4,
    fontSize: 9, color: i === 2 ? C.white : C.text, fontFace: F, align: "center", bold: i === 2 || i === 3
  });
  if (i < flowSteps.length - 1) {
    s4.addText("→", {
      x: flowX[i] + 0.75, y: 1.4, w: 0.2, h: 0.4,
      fontSize: 10, color: C.main, fontFace: F, align: "center"
    });
  }
});

// PoC / 本番のスコープ（表形式）
s4.addText("PoC / 本番のスコープ", {
  x: 0.5, y: 2.0, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const scopeRows = [
  [
    { text: "機能", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "PoC", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "本番", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "OCR精度評価", options: { align: "left" } },
    { text: "○", options: { align: "center", color: C.main, bold: true } },
    { text: "-", options: { align: "center", color: C.sub } }
  ],
  [
    { text: "精度レポート・Go/No-Go判断", options: { align: "left" } },
    { text: "○", options: { align: "center", color: C.main, bold: true } },
    { text: "-", options: { align: "center", color: C.sub } }
  ],
  [
    { text: "PDFアップロード機能", options: { align: "left" } },
    { text: "-", options: { align: "center", color: C.sub } },
    { text: "○", options: { align: "center", color: C.main, bold: true } }
  ],
  [
    { text: "OCR処理（Document AI）", options: { align: "left" } },
    { text: "○", options: { align: "center", color: C.main, bold: true } },
    { text: "○", options: { align: "center", color: C.main, bold: true } }
  ],
  [
    { text: "確認UI（低信頼度ハイライト・手動補正）", options: { align: "left" } },
    { text: "○", options: { align: "center", color: C.main, bold: true } },
    { text: "○", options: { align: "center", color: C.main, bold: true } }
  ],
  [
    { text: "Excel出力（既存フォーマット準拠）", options: { align: "left" } },
    { text: "-", options: { align: "center", color: C.sub } },
    { text: "○", options: { align: "center", color: C.main, bold: true } }
  ]
];

s4.addTable(scopeRows, {
  x: 0.5, y: 2.35, w: 9, h: 2.1,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [5.5, 1.75, 1.75]
});

// 相談ボックス
s4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.6, w: 9, h: 0.8,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s4.addText("【相談】PoCで確認UIまで含める形で進めたいが、問題ないか？", {
  x: 0.7, y: 4.75, w: 8.5, h: 0.5,
  fontSize: 12, color: C.text, fontFace: F
});

// ========== スライド4b: PoCスケジュール ==========
let s4b = pres.addSlide();
addHeader(s4b, "相談①：PoCスケジュール（1ヶ月）");

const scheduleRows = [
  [
    { text: "Week", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "タスク", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "担当", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "Week 1", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "キックオフMTG（スコープ確認）", options: { align: "left", fill: "EDF7FA" } },
    { text: "両社", options: { align: "center", fill: "EDF7FA" } }
  ],
  [
    { text: "", options: { align: "center" } },
    { text: "サンプルPDF提供（10-20件）", options: { align: "left" } },
    { text: "顧客", options: { align: "center", color: C.orange } }
  ],
  [
    { text: "", options: { align: "center" } },
    { text: "GCP環境構築、Document AI設定", options: { align: "left" } },
    { text: "弊社", options: { align: "center", color: C.main } }
  ],
  [
    { text: "Week 2", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "OCR処理パイプライン実装", options: { align: "left", fill: "EDF7FA" } },
    { text: "弊社", options: { align: "center", color: C.main, fill: "EDF7FA" } }
  ],
  [
    { text: "", options: { align: "center" } },
    { text: "精度評価（項目抽出精度の測定）", options: { align: "left" } },
    { text: "弊社", options: { align: "center", color: C.main } }
  ],
  [
    { text: "", options: { align: "center" } },
    { text: "中間報告MTG（精度状況共有）", options: { align: "left" } },
    { text: "両社", options: { align: "center" } }
  ],
  [
    { text: "Week 3", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "簡易確認UI開発", options: { align: "left", fill: "EDF7FA" } },
    { text: "弊社", options: { align: "center", color: C.main, fill: "EDF7FA" } }
  ],
  [
    { text: "", options: { align: "center" } },
    { text: "OCR結果の表示・補正機能", options: { align: "left" } },
    { text: "弊社", options: { align: "center", color: C.main } }
  ],
  [
    { text: "Week 4", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "精度レポート作成", options: { align: "left", fill: "EDF7FA" } },
    { text: "弊社", options: { align: "center", color: C.main, fill: "EDF7FA" } }
  ],
  [
    { text: "", options: { align: "center" } },
    { text: "最終報告MTG（Go/No-Go判断）", options: { align: "left" } },
    { text: "両社", options: { align: "center" } }
  ]
];

s4b.addTable(scheduleRows, {
  x: 0.5, y: 1.1, w: 9, h: 3.5,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.2, 6.0, 1.8]
});

s4b.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.75, w: 9, h: 0.65,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s4b.addText("MTG: 計3回（キックオフ、中間報告、最終報告）", {
  x: 0.7, y: 4.85, w: 8.5, h: 0.4,
  fontSize: 12, color: C.main, fontFace: F, bold: true
});

// ========== スライド5: 相談① 環境・精度 ==========
let s5 = pres.addSlide();
addHeader(s5, "相談①：環境・精度基準について");

// 環境について
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 9, h: 2.0,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 0.08, h: 2.0, fill: { color: C.main }
});
s5.addText("【相談】環境について", {
  x: 0.75, y: 1.15, w: 4, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s5.addText("• クライアントはAWSを利用中\n• ただし、OCR精度が高いと思われる GCP（Document AI） で検証を進めたい\n• PoCの評価が良ければ、弊社GCP環境で納品しランニング費用をいただく形でよいか？", {
  x: 0.75, y: 1.55, w: 8.5, h: 1.3,
  fontSize: 12, color: C.text, fontFace: F, lineSpacing: 22
});

// OCRエンジン確認
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.2, w: 4.4, h: 1.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("【確認】OCRエンジン", {
  x: 0.7, y: 3.3, w: 4, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s5.addText("OCR精度が高いのはGoogle\n（Document AI）という認識で\n合っているか？\n→ 特に手書き認識において優位と想定", {
  x: 0.7, y: 3.65, w: 4.0, h: 0.7,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 16
});

// 精度の合格基準
s5.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 3.2, w: 4.4, h: 1.2,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s5.addText("【相談】精度の合格基準", {
  x: 5.3, y: 3.3, w: 4, h: 0.3,
  fontSize: 12, bold: true, color: C.orange, fontFace: F
});
s5.addText("PoCで「精度X%以上なら本開発に\n進む」という基準を事前に\n定めておくか？\n→ 定める場合、どのレベルが妥当か？", {
  x: 5.3, y: 3.65, w: 4.0, h: 0.7,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 16
});

// ========== スライド6: 相談② ==========
let s6 = pres.addSlide();
addHeader(s6, "相談②：データ基盤構築");

// 先方の環境
s6.addText("先方の環境", {
  x: 0.5, y: 1.05, w: 3, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s6.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.45, w: 9, h: 0.6,
  fill: { color: C.light }
});
s6.addText("AWS・Snowflake を利用中", {
  x: 0.7, y: 1.55, w: 8.5, h: 0.4,
  fontSize: 13, color: C.text, fontFace: F
});

// 本番運用フロー（想定）
s6.addText("本番運用フロー（想定）", {
  x: 0.5, y: 2.2, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

s6.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 2.6, w: 1.8, h: 0.7,
  fill: { color: C.light }, rectRadius: 0.05
});
s6.addText("Excel", {
  x: 0.5, y: 2.75, w: 1.8, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F, align: "center"
});

s6.addText("→", {
  x: 2.4, y: 2.75, w: 0.4, h: 0.4,
  fontSize: 18, color: C.main, fontFace: F, align: "center"
});

s6.addShape(pres.ShapeType.roundRect, {
  x: 2.9, y: 2.6, w: 1.8, h: 0.7,
  fill: { color: C.main }, rectRadius: 0.05
});
s6.addText("格納\nスクリプト", {
  x: 2.9, y: 2.65, w: 1.8, h: 0.6,
  fontSize: 10, color: C.white, fontFace: F, align: "center"
});

s6.addText("→", {
  x: 4.8, y: 2.75, w: 0.4, h: 0.4,
  fontSize: 18, color: C.main, fontFace: F, align: "center"
});

s6.addShape(pres.ShapeType.roundRect, {
  x: 5.3, y: 2.6, w: 1.8, h: 0.7,
  fill: { color: "E8F5E9" }, rectRadius: 0.05
});
s6.addText("Snowflake", {
  x: 5.3, y: 2.75, w: 1.8, h: 0.4,
  fontSize: 11, color: "2E7D32", fontFace: F, align: "center", bold: true
});

s6.addText("→", {
  x: 7.2, y: 2.75, w: 0.4, h: 0.4,
  fontSize: 18, color: C.main, fontFace: F, align: "center"
});

s6.addShape(pres.ShapeType.roundRect, {
  x: 7.7, y: 2.6, w: 1.8, h: 0.7,
  fill: { color: C.accent }, rectRadius: 0.05
});
s6.addText("自然言語\n検索UI", {
  x: 7.7, y: 2.65, w: 1.8, h: 0.6,
  fontSize: 10, color: C.text, fontFace: F, align: "center", bold: true
});

// 補足
s6.addText("※ ITリテラシーが低めの部署でも使える形でデータを引き出せるようにする", {
  x: 0.5, y: 3.4, w: 9, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F
});

s6.addText("※ PoC/本番の詳細スコープは今後検討（今回は方向性の相談）", {
  x: 0.5, y: 3.65, w: 9, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F
});

// 相談事項
s6.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.0, w: 9, h: 1.4,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1.5 }
});
s6.addText("【相談】", {
  x: 0.7, y: 4.1, w: 2, h: 0.3,
  fontSize: 12, bold: true, color: C.orange, fontFace: F
});
s6.addText("• この方向性で問題ないか？\n• 費用・ビジネスモデル：先方の社内環境に構築（権限をもらい先方内で構築）\n　情シスとの議論は手弁当、構築部分から費用を取る形でよいか？\n• 社内でSnowflakeなどデータ基盤構築の経験・実績はあるか？", {
  x: 0.7, y: 4.35, w: 8.5, h: 1.0,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 14
});

// ========== スライド7: 次のアクション ==========
let s7 = pres.addSlide();
addHeader(s7, "次のアクション");

const actions = [
  { no: "1", text: "相談①の方針決定（スコープ・環境）", status: "□" },
  { no: "2", text: "相談②の方針決定・社内知見確認", status: "□" },
  { no: "3", text: "クライアントへ提案", status: "□" }
];

const rows = [
  [
    { text: "#", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "アクション", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "担当", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "状態", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ]
];

actions.forEach(a => {
  rows.push([
    { text: a.no, options: { align: "center" } },
    { text: a.text, options: { align: "left" } },
    { text: "", options: { align: "center" } },
    { text: a.status, options: { align: "center" } }
  ]);
});

s7.addTable(rows, {
  x: 0.5, y: 1.2, w: 9, h: 2.0,
  fontFace: F, fontSize: 13, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.6, 6.0, 1.2, 1.2]
});

// ========== スライド8: 最終スライド ==========
let s8 = pres.addSlide();
s8.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s8.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s8.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// 出力
const outputPath = path.join(__dirname, "社内議論用-共立製薬提案.pptx");
pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`Created: ${outputPath}`))
  .catch(err => console.error(err));
