/**
 * 共立製薬 スコアシートDX提案 社内議論用資料
 * NTT DXパートナー フォーマット - 洗練版
 */
const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NTT DXパートナー";
pres.title = "共立製薬 スコアシートDX提案 社内議論用";

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

// ========================================
// スライド1: 表紙
// ========================================
let s1 = pres.addSlide();
s1.addImage({ path: `${assets}/bg-title.png`, x: 0, y: 0, w: 10, h: 5.625 });
s1.addText("共立製薬", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("スコアシートDX提案", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("社内議論用資料", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========================================
// スライド2: 目次
// ========================================
let s2 = pres.addSlide();
addHeader(s2, "目次");

const toc = [
  "今回の議論フォーカス",
  "提案する2つの施策",
  "議論①  進め方のパターン",
  "議論②  OCRのデリバリー方法",
  "OCRの段階的提案",
  "Phase 0  精度検証について",
  "議論③  データ基盤の進め方",
  "次のアクション"
];
toc.forEach((item, i) => {
  const y = 1.1 + i * 0.45;
  s2.addText(`0${i + 1}`, {
    x: 0.6, y: y, w: 0.5, h: 0.4,
    fontSize: 16, bold: true, color: C.main, fontFace: F
  });
  s2.addText(item, {
    x: 1.2, y: y, w: 7, h: 0.4,
    fontSize: 16, color: C.text, fontFace: F
  });
});

// ========================================
// スライド3: 今回の議論フォーカス
// ========================================
let s3 = pres.addSlide();
addHeader(s3, "今回の議論フォーカス");

const focus = [
  { num: "01", title: "OCRのデリバリー方法", items: ["先方環境（AWS）で構築するか", "弊社環境（GCP）で構築するか"] },
  { num: "02", title: "OCRのスコープ", items: ["どこまでの機能を含めるか", "段階的な提案の検討"] },
  { num: "03", title: "データ基盤の進め方", items: ["OCRと並行したいが", "今年度契約は時期的に厳しい？"] }
];

focus.forEach((f, i) => {
  const x = 0.5 + i * 3.1;
  // カード背景
  s3.addShape(pres.ShapeType.rect, {
    x: x, y: 1.1, w: 2.9, h: 3.2,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s3.addShape(pres.ShapeType.rect, {
    x: x, y: 1.1, w: 2.9, h: 0.08, fill: { color: C.main }
  });
  // 番号
  s3.addText(f.num, {
    x: x + 0.15, y: 1.35, w: 0.6, h: 0.4,
    fontSize: 22, bold: true, color: C.main, fontFace: F
  });
  // タイトル
  s3.addText(f.title, {
    x: x + 0.15, y: 1.85, w: 2.6, h: 0.5,
    fontSize: 14, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s3.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 2.4, w: 2.6, h: 0.015, fill: { color: C.border }
  });
  // 内容
  f.items.forEach((item, j) => {
    s3.addText("・" + item, {
      x: x + 0.15, y: 2.55 + j * 0.5, w: 2.6, h: 0.45,
      fontSize: 11, color: C.sub, fontFace: F
    });
  });
});

// ========================================
// スライド4: 提案する2つの施策
// ========================================
let s4 = pres.addSlide();
addHeader(s4, "提案する2つの施策");

// 施策1
s4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.4, h: 2.4,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 0.08, h: 2.4, fill: { color: C.main }
});
s4.addText("施策①", {
  x: 0.75, y: 1.25, w: 1, h: 0.35,
  fontSize: 11, color: C.main, fontFace: F
});
s4.addText("OCR自動化", {
  x: 0.75, y: 1.55, w: 3.8, h: 0.4,
  fontSize: 18, bold: true, color: C.text, fontFace: F
});
s4.addText("紙のスコアシート → PDF → Excel への\n転記作業を半自動化", {
  x: 0.75, y: 2.05, w: 3.8, h: 0.7,
  fontSize: 12, color: C.sub, fontFace: F
});
s4.addText("期間：PoC 2ヶ月 + 本開発 3-4ヶ月\n費用：XXX万円", {
  x: 0.75, y: 2.85, w: 3.8, h: 0.5,
  fontSize: 11, color: C.sub, fontFace: F
});

// 施策2
s4.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 1.1, w: 4.4, h: 2.4,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s4.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 1.1, w: 0.08, h: 2.4, fill: { color: C.gold }
});
s4.addText("施策②", {
  x: 5.35, y: 1.25, w: 1, h: 0.35,
  fontSize: 11, color: C.gold, fontFace: F
});
s4.addText("データ基盤構築", {
  x: 5.35, y: 1.55, w: 3.8, h: 0.4,
  fontSize: 18, bold: true, color: C.text, fontFace: F
});
s4.addText("Excelデータをインポートし\n可視化・分析できる基盤を構築", {
  x: 5.35, y: 2.05, w: 3.8, h: 0.7,
  fontSize: 12, color: C.sub, fontFace: F
});
s4.addText("期間：2ヶ月\n費用：XX万円", {
  x: 5.35, y: 2.85, w: 3.8, h: 0.5,
  fontSize: 11, color: C.sub, fontFace: F
});

// 注釈
s4.addText("※ OCRは完全自動化ではなく、confidence（信頼度）を活用した半自動化システム", {
  x: 0.5, y: 3.7, w: 9, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F
});

// ========================================
// スライド5: 議論① 進め方のパターン
// ========================================
let s5 = pres.addSlide();
addHeader(s5, "議論①  進め方のパターン");

// テーブル
const rows5 = [
  [
    { text: "パターン", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "今期（〜3月）", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "来年度", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "今期費用", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "特徴", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "A  OCR先行", options: { bold: true, align: "left" } },
    { text: "PoC + 本開発", options: { align: "center" } },
    { text: "データ基盤", options: { align: "center" } },
    { text: "XXX万円", options: { align: "center" } },
    { text: "転記削減を早期実現", options: { align: "left" } }
  ],
  [
    { text: "B  データ基盤先行", options: { bold: true, align: "left" } },
    { text: "データ基盤のみ", options: { align: "center" } },
    { text: "OCR", options: { align: "center" } },
    { text: "XX万円", options: { align: "center" } },
    { text: "技術リスク低", options: { align: "left" } }
  ],
  [
    { text: "C  両方今期", options: { bold: true, align: "left" } },
    { text: "OCR + データ基盤", options: { align: "center" } },
    { text: "—", options: { align: "center" } },
    { text: "XXX万円", options: { align: "center" } },
    { text: "一括導入", options: { align: "left" } }
  ],
  [
    { text: "D  段階的", options: { bold: true, color: C.main, align: "left" } },
    { text: "PoCのみ", options: { align: "center", color: C.main } },
    { text: "本開発+基盤", options: { align: "center", color: C.main } },
    { text: "X万円", options: { align: "center", color: C.main, bold: true } },
    { text: "契約手続き容易", options: { align: "left", color: C.main } }
  ]
];
s5.addTable(rows5, {
  x: 0.5, y: 1.05, w: 9, h: 2.0,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle"
});

// パターンD強調
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.2, w: 9, h: 1.5,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s5.addText("パターンD（段階的）のメリット", {
  x: 0.7, y: 3.35, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s5.addText("✓  今年度の契約手続き（〜3月）に時間的制約がある場合に対応\n✓  PoCで精度検証してから本開発に進める（リスク低減）\n✓  今期費用を抑え、来年度に本格予算を確保", {
  x: 0.7, y: 3.75, w: 8.5, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========================================
// スライド6: 議論② OCRのデリバリー方法
// ========================================
let s6 = pres.addSlide();
addHeader(s6, "議論②  OCRのデリバリー方法");

// 3つのパターン
const patterns = [
  { id: "A", title: "弊社GCP", ocr: "Document AI", type: "SaaS型", note: "月額利用料" },
  { id: "B", title: "先方AWS\n+ GCP API", ocr: "Document AI", type: "納品型", note: "2クラウド構成" },
  { id: "C", title: "先方AWS\n完全構築", ocr: "Textract", type: "納品型", note: "単一クラウド" }
];

patterns.forEach((p, i) => {
  const x = 0.5 + i * 3.1;
  s6.addShape(pres.ShapeType.rect, {
    x: x, y: 1.05, w: 2.9, h: 2.3,
    fill: { color: C.white },
    line: { color: C.border, pt: 1 }
  });
  s6.addShape(pres.ShapeType.rect, {
    x: x, y: 1.05, w: 2.9, h: 0.5,
    fill: { color: C.main }
  });
  s6.addText(`パターン${p.id}`, {
    x: x, y: 1.1, w: 2.9, h: 0.4,
    fontSize: 14, bold: true, color: C.white, fontFace: F, align: "center"
  });
  s6.addText(p.title, {
    x: x + 0.1, y: 1.6, w: 2.7, h: 0.6,
    fontSize: 13, bold: true, color: C.text, fontFace: F, align: "center"
  });
  s6.addText(`OCR: ${p.ocr}`, {
    x: x + 0.1, y: 2.25, w: 2.7, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F, align: "center"
  });
  s6.addText(`${p.type}`, {
    x: x + 0.1, y: 2.55, w: 2.7, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F, align: "center"
  });
  s6.addText(p.note, {
    x: x + 0.1, y: 2.85, w: 2.7, h: 0.3,
    fontSize: 9, color: C.sub, fontFace: F, align: "center"
  });
});

// 判断ポイント
s6.addText("判断のポイント", {
  x: 0.5, y: 3.5, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.text, fontFace: F
});
s6.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.9, w: 9, h: 0.02, fill: { color: C.border }
});

const points = [
  ["先方のクラウド環境", "AWS利用中か？ → 要確認"],
  ["手書き認識精度", "Document AI > Textract（要検証）"],
  ["弊社ノウハウ", "Textract経験者 → 社内確認必要"]
];
points.forEach((pt, i) => {
  s6.addText(pt[0], {
    x: 0.5 + i * 3.1, y: 4.0, w: 2.9, h: 0.3,
    fontSize: 11, bold: true, color: C.main, fontFace: F
  });
  s6.addText(pt[1], {
    x: 0.5 + i * 3.1, y: 4.3, w: 2.9, h: 0.4,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// ========================================
// スライド7: OCRの段階的提案
// ========================================
let s7 = pres.addSlide();
addHeader(s7, "OCRの段階的提案");

// フローチャート
const steps = ["スキャン", "アップロード", "OCR処理", "マージ", "確認UI", "Excel出力"];
steps.forEach((step, i) => {
  const x = 0.35 + i * 1.55;
  s7.addShape(pres.ShapeType.roundRect, {
    x: x, y: 1.1, w: 1.35, h: 0.7,
    fill: { color: i === 0 ? C.light : C.main },
    rectRadius: 0.05
  });
  s7.addText(step, {
    x: x, y: 1.2, w: 1.35, h: 0.5,
    fontSize: 10, bold: true, color: i === 0 ? C.sub : C.white, fontFace: F, align: "center"
  });
  if (i < steps.length - 1) {
    s7.addText("→", {
      x: x + 1.3, y: 1.25, w: 0.3, h: 0.4,
      fontSize: 14, color: C.main, fontFace: F, align: "center"
    });
  }
});
s7.addText("※スキャンは複合機を使用（システム外）", {
  x: 0.5, y: 1.85, w: 5, h: 0.25,
  fontSize: 9, color: C.sub, fontFace: F
});

// Phaseテーブル
const rows7 = [
  [
    { text: "Phase", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "費用", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "含まれる機能", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "0", options: { bold: true, color: C.main, fill: "EDF7FA", align: "center" } },
    { text: "精度検証", options: { bold: true, fill: "EDF7FA", align: "center" } },
    { text: "2-4週間", options: { fill: "EDF7FA", align: "center" } },
    { text: "X万円", options: { fill: "EDF7FA", align: "center" } },
    { text: "サンプルPDFでOCR精度を検証、Go/No-Go判断", options: { fill: "EDF7FA", align: "left" } }
  ],
  [
    { text: "1", options: { bold: true, align: "center" } },
    { text: "基本OCR", options: { align: "center" } },
    { text: "1-2ヶ月", options: { align: "center" } },
    { text: "XX万円", options: { align: "center" } },
    { text: "OCR + 確認UI + Excel出力（マージなし）", options: { align: "left" } }
  ],
  [
    { text: "2", options: { bold: true, align: "center" } },
    { text: "マージ追加", options: { align: "center" } },
    { text: "+1ヶ月", options: { align: "center" } },
    { text: "+X万円", options: { align: "center" } },
    { text: "動物IDごとのマージ・シート分け機能", options: { align: "left" } }
  ],
  [
    { text: "3", options: { bold: true, align: "center" } },
    { text: "フル機能", options: { align: "center" } },
    { text: "+1-2ヶ月", options: { align: "center" } },
    { text: "+XX万円", options: { align: "center" } },
    { text: "バッチ処理、Dropbox連携、ユーザー認証等", options: { align: "left" } }
  ]
];
s7.addTable(rows7, {
  x: 0.5, y: 2.2, w: 9, h: 2.4,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.6, 1.2, 1.0, 0.9, 5.3]
});

// ========================================
// スライド8: Phase 0 精度検証
// ========================================
let s8 = pres.addSlide();
addHeader(s8, "Phase 0  精度検証について");

// 推奨バッジ
s8.addShape(pres.ShapeType.rect, {
  x: 8.4, y: 0.3, w: 1.0, h: 0.35,
  fill: { color: C.orange }
});
s8.addText("推奨", {
  x: 8.4, y: 0.32, w: 1.0, h: 0.32,
  fontSize: 12, bold: true, color: C.white, fontFace: F, align: "center"
});

// 左カラム：概要
s8.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 4.4, h: 3.2,
  fill: { color: C.white },
  line: { color: C.border, pt: 1 }
});
s8.addText("概要", {
  x: 0.65, y: 1.15, w: 4.1, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s8.addShape(pres.ShapeType.rect, {
  x: 0.65, y: 1.5, w: 4.1, h: 0.015, fill: { color: C.border }
});

const specs = [
  ["目的", "OCR精度が実用レベルか検証し\n本開発に進むかを判断"],
  ["インプット", "サンプルPDF 10-20件"],
  ["アウトプット", "精度レポート、Go/No-Go判断\n本開発見積もり"],
  ["期間", "2〜4週間"],
  ["費用", "X万円（検証作業費用のみ）"]
];
specs.forEach((s, i) => {
  s8.addText(s[0], {
    x: 0.65, y: 1.6 + i * 0.5, w: 1.1, h: 0.45,
    fontSize: 10, bold: true, color: C.text, fontFace: F
  });
  s8.addText(s[1], {
    x: 1.75, y: 1.6 + i * 0.5, w: 3.0, h: 0.45,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// 右カラム：判断基準
s8.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 1.05, w: 4.4, h: 3.2,
  fill: { color: C.light },
  line: { color: C.border, pt: 1 }
});
s8.addText("判断基準", {
  x: 5.25, y: 1.15, w: 4.1, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s8.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 1.5, w: 4.1, h: 0.015, fill: { color: C.border }
});

// 80%以上
s8.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 1.65, w: 4.1, h: 0.7,
  fill: { color: "E8F5E9" }
});
s8.addText("80%以上", {
  x: 5.35, y: 1.75, w: 1.2, h: 0.3,
  fontSize: 12, bold: true, color: "2E7D32", fontFace: F
});
s8.addText("→ Phase 1へ進む", {
  x: 6.5, y: 1.75, w: 2.7, h: 0.3,
  fontSize: 11, color: "2E7D32", fontFace: F
});

// 60-80%
s8.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 2.45, w: 4.1, h: 0.7,
  fill: { color: "FFF8E1" }
});
s8.addText("60-80%", {
  x: 5.35, y: 2.55, w: 1.2, h: 0.3,
  fontSize: 12, bold: true, color: "F57F17", fontFace: F
});
s8.addText("→ 帳票改善・追加学習で\n   改善見込みあれば継続", {
  x: 6.5, y: 2.5, w: 2.7, h: 0.55,
  fontSize: 10, color: "F57F17", fontFace: F
});

// 60%未満
s8.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 3.25, w: 4.1, h: 0.7,
  fill: { color: "FFEBEE" }
});
s8.addText("60%未満", {
  x: 5.35, y: 3.35, w: 1.2, h: 0.3,
  fontSize: 12, bold: true, color: "C62828", fontFace: F
});
s8.addText("→ 手書きOCR適用は困難\n   別アプローチ検討", {
  x: 6.5, y: 3.3, w: 2.7, h: 0.55,
  fontSize: 10, color: "C62828", fontFace: F
});

// 補足
s8.addText("※ 項目抽出精度（フィールド単位での正解率）を基準とする", {
  x: 0.5, y: 4.4, w: 9, h: 0.25,
  fontSize: 9, color: C.sub, fontFace: F
});

// ========================================
// スライド9: 議論③ データ基盤の進め方
// ========================================
let s9 = pres.addSlide();
addHeader(s9, "議論③  データ基盤の進め方");

// 現状認識
s9.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 9, h: 0.9,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s9.addText("現状認識", {
  x: 0.7, y: 1.15, w: 2, h: 0.3,
  fontSize: 12, bold: true, color: C.orange, fontFace: F
});
s9.addText("OCRと並行してデータ基盤も進めたい意向あり。ただし、今年度契約（〜3月）はスピード感的に厳しい可能性。", {
  x: 0.7, y: 1.45, w: 8.5, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F
});

// 選択肢
const opts = [
  { id: "①", title: "今期にデータ基盤も契約", today: "OCR PoC + データ基盤", next: "OCR本開発", merit: "データ管理を早期に改善" },
  { id: "②", title: "来年度に一括", today: "OCR PoCのみ", next: "本開発 + データ基盤", merit: "契約手続きがシンプル" },
  { id: "③", title: "クライアントに確認", today: "要相談", next: "要相談", merit: "先方の意向を優先" }
];

opts.forEach((o, i) => {
  const y = 2.15 + i * 0.9;
  s9.addShape(pres.ShapeType.rect, {
    x: 0.5, y: y, w: 9, h: 0.8,
    fill: { color: i === 1 ? "EDF7FA" : C.white },
    line: { color: i === 1 ? C.main : C.border, pt: i === 1 ? 1.5 : 0.5 }
  });
  s9.addText(o.id, {
    x: 0.6, y: y + 0.15, w: 0.4, h: 0.5,
    fontSize: 14, bold: true, color: C.main, fontFace: F
  });
  s9.addText(o.title, {
    x: 1.0, y: y + 0.15, w: 2.0, h: 0.5,
    fontSize: 12, bold: true, color: C.text, fontFace: F
  });
  s9.addText(`今期: ${o.today}`, {
    x: 3.1, y: y + 0.1, w: 2.5, h: 0.35,
    fontSize: 10, color: C.sub, fontFace: F
  });
  s9.addText(`来年度: ${o.next}`, {
    x: 3.1, y: y + 0.4, w: 2.5, h: 0.35,
    fontSize: 10, color: C.sub, fontFace: F
  });
  s9.addText(o.merit, {
    x: 5.8, y: y + 0.2, w: 3.5, h: 0.4,
    fontSize: 10, color: C.text, fontFace: F
  });
});

// 確認事項
s9.addText("クライアントへの確認事項：データ基盤の優先度、今期予算の余裕", {
  x: 0.5, y: 4.95, w: 9, h: 0.25,
  fontSize: 9, color: C.sub, fontFace: F
});

// ========================================
// スライド10: 次のアクション
// ========================================
let s10 = pres.addSlide();
addHeader(s10, "次のアクション");

// 今回決めたいこと
s10.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 9, h: 2.0,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s10.addText("今回の議論で決めたいこと", {
  x: 0.7, y: 1.15, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const actions = [
  "推奨パターンの決定（A / B / C / D / 選択を委ねる）",
  "OCRデリバリー方法の方針（弊社GCP / 先方AWS+GCP / 先方AWS完全）",
  "OCRスコープの方針（Phase 0から始めるか）",
  "データ基盤の進め方（今期並行 or 来年度）"
];
actions.forEach((a, i) => {
  s10.addText(`${i + 1}.`, {
    x: 0.7, y: 1.55 + i * 0.35, w: 0.3, h: 0.3,
    fontSize: 11, bold: true, color: C.main, fontFace: F
  });
  s10.addText(a, {
    x: 1.0, y: 1.55 + i * 0.35, w: 8, h: 0.3,
    fontSize: 11, color: C.text, fontFace: F
  });
});

// その後のアクション
s10.addText("その後のアクション", {
  x: 0.5, y: 3.2, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});
s10.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.55, w: 9, h: 0.015, fill: { color: C.border }
});

const nextActions = [
  ["社内確認", "Textractノウハウ（経験者の有無）"],
  ["見積作成", "各パターン別に費用算出"],
  ["体制確定", "担当PMのアサイン"],
  ["顧客対応", "MTG日程打診、クラウド環境確認"]
];
nextActions.forEach((na, i) => {
  const x = 0.5 + (i % 2) * 4.6;
  const y = 3.7 + Math.floor(i / 2) * 0.6;
  s10.addText("●", {
    x: x, y: y, w: 0.3, h: 0.3,
    fontSize: 8, color: C.main, fontFace: F
  });
  s10.addText(na[0], {
    x: x + 0.25, y: y, w: 1.2, h: 0.3,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  s10.addText(na[1], {
    x: x + 1.4, y: y, w: 3.0, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// ========================================
// スライド11: 最終ページ
// ========================================
let s11 = pres.addSlide();
s11.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: C.main }
});
s11.addText("ご意見をお願いします", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s11.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// ========================================
// 出力
// ========================================
const out = path.join(__dirname, "共立製薬-スコアシートDX-社内議論用_NTTDXPN.pptx");
pres.writeFile({ fileName: out })
  .then(() => console.log(`Generated: ${out}`))
  .catch(err => console.error(err));
