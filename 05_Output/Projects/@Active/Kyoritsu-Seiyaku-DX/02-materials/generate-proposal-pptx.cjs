const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NTT DXパートナー";
pres.title = "共立製薬様 提案骨子";

// NTT DXパートナー ブランドカラー
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
  slide.background = { path: `${assets}/bg-content.png` };
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
s1.background = { path: `${assets}/bg-title.png` };
s1.addText("共立製薬様", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: "333333", fontFace: F
});
s1.addText("スコアシートDX ご提案", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: "333333", fontFace: F
});
s1.addText("実施イメージ・進め方・スケジュールのご説明", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: "333333", fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: "333333", fontFace: F
});
// ロゴはbg-title.pngに含まれているため追加不要

// ========================================
// スライド2: アジェンダ
// ========================================
let s2 = pres.addSlide();
addHeader(s2, "本日のアジェンダ");

const agenda = [
  { no: "1", title: "提案1: スコアシートDX化", desc: "実施イメージ、進め方、スケジュール" },
  { no: "2", title: "提案2: データ基盤構築", desc: "概要、活用イメージのすりあわせ" },
  { no: "3", title: "次のステップ", desc: "合意事項、アクション" }
];

agenda.forEach((item, i) => {
  const y = 1.1 + i * 1.3;
  // カード背景
  s2.addShape(pres.ShapeType.rect, {
    x: 0.5, y: y, w: 9, h: 1.1,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 左辺アクセントバー
  s2.addShape(pres.ShapeType.rect, {
    x: 0.5, y: y, w: 0.08, h: 1.1, fill: { color: C.main }
  });
  // 番号
  s2.addText(item.no, {
    x: 0.75, y: y + 0.2, w: 0.5, h: 0.5,
    fontSize: 28, bold: true, color: C.main, fontFace: F
  });
  // タイトル
  s2.addText(item.title, {
    x: 1.5, y: y + 0.2, w: 7, h: 0.45,
    fontSize: 18, bold: true, color: C.text, fontFace: F
  });
  // 説明
  s2.addText(item.desc, {
    x: 1.5, y: y + 0.6, w: 7, h: 0.35,
    fontSize: 12, color: C.sub, fontFace: F
  });
});

// ========================================
// スライド3: 提案1 - 実施イメージ
// ========================================
let s3 = pres.addSlide();
addHeader(s3, "提案1: スコアシートDX化 - 実施イメージ");

// 現状ボックス
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 4.3, h: 1.8,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s3.addText("現状", {
  x: 0.7, y: 1.15, w: 2, h: 0.3,
  fontSize: 12, bold: true, color: C.orange, fontFace: F
});
s3.addText("紙スコアシート\n    ↓\n手作業でExcel転記", {
  x: 0.7, y: 1.5, w: 3.9, h: 1.2,
  fontSize: 14, color: C.text, fontFace: F, align: "center"
});

// 矢印
s3.addText("→", {
  x: 4.7, y: 1.7, w: 0.6, h: 0.5,
  fontSize: 32, color: C.main, fontFace: F, align: "center"
});

// 提案ボックス
s3.addShape(pres.ShapeType.rect, {
  x: 5.2, y: 1.05, w: 4.3, h: 1.8,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s3.addText("提案", {
  x: 5.4, y: 1.15, w: 2, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s3.addText("紙スコアシート\n    ↓\nAI-OCR自動読取\n    ↓\n確認・修正 → Excel出力", {
  x: 5.4, y: 1.45, w: 3.9, h: 1.3,
  fontSize: 13, color: C.text, fontFace: F, align: "center"
});

// ポイント
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.1, w: 9, h: 1.5,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s3.addText("ポイント", {
  x: 0.7, y: 3.25, w: 3, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s3.addText("✓  AI-OCR/LLMで自動読取、低信頼度の項目のみ人が確認\n✓  転記作業80%削減を目指す\n✓  既存のExcelフォーマットをそのまま出力", {
  x: 0.7, y: 3.65, w: 8.5, h: 0.9,
  fontSize: 12, color: C.text, fontFace: F, lineSpacing: 24
});

// ========================================
// スライド4: 提案1 - 進め方
// ========================================
let s4 = pres.addSlide();
addHeader(s4, "提案1: スコアシートDX化 - 進め方");

// 2段階アプローチ
s4.addText("2段階アプローチ", {
  x: 0.5, y: 1.0, w: 3, h: 0.4,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});

// Phase 1 カード
s4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.45, w: 4.3, h: 2.4,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.45, w: 4.3, h: 0.08, fill: { color: C.main }
});
s4.addText("Phase 1: PoC", {
  x: 0.7, y: 1.65, w: 3.8, h: 0.4,
  fontSize: 16, bold: true, color: C.main, fontFace: F
});
s4.addText("Xヶ月", {
  x: 3.5, y: 1.65, w: 1, h: 0.4,
  fontSize: 14, color: C.sub, fontFace: F, align: "right"
});
s4.addShape(pres.ShapeType.rect, {
  x: 0.7, y: 2.1, w: 3.9, h: 0.015, fill: { color: C.border }
});
s4.addText("• AI-OCR/LLM精度検証\n• デモシステム構築\n• Go/No-Go判断", {
  x: 0.7, y: 2.2, w: 3.8, h: 1.4,
  fontSize: 12, color: C.text, fontFace: F, lineSpacing: 24
});

// 矢印
s4.addText("→", {
  x: 4.7, y: 2.4, w: 0.6, h: 0.5,
  fontSize: 28, color: C.main, fontFace: F, align: "center"
});
s4.addText("精度基準\n達成でGo", {
  x: 4.55, y: 2.9, w: 0.9, h: 0.6,
  fontSize: 9, color: C.sub, fontFace: F, align: "center"
});

// Phase 2 カード
s4.addShape(pres.ShapeType.rect, {
  x: 5.2, y: 1.45, w: 4.3, h: 2.4,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s4.addShape(pres.ShapeType.rect, {
  x: 5.2, y: 1.45, w: 4.3, h: 0.08, fill: { color: C.main }
});
s4.addText("Phase 2: 本開発", {
  x: 5.4, y: 1.65, w: 3.8, h: 0.4,
  fontSize: 16, bold: true, color: C.main, fontFace: F
});
s4.addText("Xヶ月", {
  x: 8.2, y: 1.65, w: 1, h: 0.4,
  fontSize: 14, color: C.sub, fontFace: F, align: "right"
});
s4.addShape(pres.ShapeType.rect, {
  x: 5.4, y: 2.1, w: 3.9, h: 0.015, fill: { color: C.border }
});
s4.addText("• 本番システム構築\n• 運用機能追加\n• 運用移行", {
  x: 5.4, y: 2.2, w: 3.8, h: 1.4,
  fontSize: 12, color: C.text, fontFace: F, lineSpacing: 24
});

// Go/No-Go基準
s4.addText("Go/No-Go判断基準", {
  x: 0.5, y: 4.0, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.text, fontFace: F
});
s4.addText("• 認識精度: 基準値以上    • 人手確認対象: 一定割合以下", {
  x: 0.5, y: 4.35, w: 9, h: 0.3,
  fontSize: 11, color: C.sub, fontFace: F
});

// ========================================
// スライド5: 提案1 - スケジュール
// ========================================
let s5 = pres.addSlide();
addHeader(s5, "提案1: スコアシートDX化 - スケジュール");

// スケジュールテーブル
const scheduleRows = [
  [
    { text: "フェーズ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "PoC", options: { bold: true, align: "center" } },
    { text: "Xヶ月", options: { align: "center" } },
    { text: "精度検証、デモ構築", options: { align: "left" } }
  ],
  [
    { text: "判断", options: { bold: true, align: "center" } },
    { text: "-", options: { align: "center" } },
    { text: "Go/No-Go判断", options: { align: "left" } }
  ],
  [
    { text: "本開発", options: { bold: true, align: "center" } },
    { text: "Xヶ月", options: { align: "center" } },
    { text: "本番システム構築", options: { align: "left" } }
  ]
];
s5.addTable(scheduleRows, {
  x: 0.5, y: 1.05, w: 9, h: 1.8,
  fontFace: F, fontSize: 14, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle"
});

// 合意事項
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.2, w: 9, h: 0.7,
  fill: { color: "EDF7FA" }
});
s5.addText("合意いただきたいこと", {
  x: 0.7, y: 3.3, w: 4, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s5.addText("• PoC実施の承認    • サンプルPDF提供    • 開始時期", {
  x: 0.7, y: 3.6, w: 8.5, h: 0.25,
  fontSize: 11, color: C.text, fontFace: F
});

// ========================================
// スライド6: 提案2 - 概要
// ========================================
let s6 = pres.addSlide();
addHeader(s6, "提案2: データ基盤構築 - 概要");

// 目的
s6.addText("目的", {
  x: 0.5, y: 1.0, w: 2, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s6.addText("• Excelデータを構造化データとして格納\n• 検索・分析可能なデータ基盤を構築", {
  x: 0.5, y: 1.35, w: 9, h: 0.6,
  fontSize: 12, color: C.text, fontFace: F, lineSpacing: 22
});

// システム構成
s6.addText("システム構成イメージ", {
  x: 0.5, y: 2.1, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});

// フロー
const flowSteps = [
  { label: "Dropbox\n(Excel)", color: C.light, textColor: C.sub },
  { label: "インポート\nスクリプト", color: C.main, textColor: C.white },
  { label: "Snowflake\n(構造化データ)", color: C.main, textColor: C.white },
  { label: "BIツール/\n検索UI", color: C.main, textColor: C.white }
];
flowSteps.forEach((step, i) => {
  const x = 0.5 + i * 2.4;
  s6.addShape(pres.ShapeType.roundRect, {
    x: x, y: 2.5, w: 2.1, h: 1.0,
    fill: { color: step.color },
    rectRadius: 0.05,
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });
  s6.addText(step.label, {
    x: x, y: 2.65, w: 2.1, h: 0.7,
    fontSize: 11, bold: true, color: step.textColor, fontFace: F, align: "center", valign: "middle"
  });
  if (i < flowSteps.length - 1) {
    s6.addText("→", {
      x: x + 2.0, y: 2.75, w: 0.5, h: 0.5,
      fontSize: 18, color: C.main, fontFace: F, align: "center"
    });
  }
});

// 補足
s6.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.75, w: 9, h: 0.9,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s6.addText("ポイント: 貴社既存のAWS + Snowflake環境を活用 → 新規契約不要", {
  x: 0.7, y: 3.9, w: 8.5, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s6.addText("構築後は検索・分析・レポート作成が可能に", {
  x: 0.7, y: 4.25, w: 8.5, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});

// ========================================
// スライド7: 提案2 - 活用イメージ
// ========================================
let s7 = pres.addSlide();
addHeader(s7, "提案2: データ基盤構築 - 活用イメージ");

// 活用イメージカード
const useCases = [
  { title: "データ検索", desc: "• 動物ID、期間で検索\n• 過去データの参照\n• Excel出力" },
  { title: "ダッシュボード", desc: "• 登録件数の推移\n• ステータス別集計\n• 傾向の可視化" },
  { title: "レポート作成", desc: "• 定期レポート\n• 分析資料の作成\n• データ出力" }
];

useCases.forEach((item, i) => {
  const x = 0.5 + i * 3.1;
  // カード
  s7.addShape(pres.ShapeType.rect, {
    x: x, y: 1.05, w: 2.9, h: 2.0,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s7.addShape(pres.ShapeType.rect, {
    x: x, y: 1.05, w: 2.9, h: 0.08, fill: { color: C.main }
  });
  // タイトル
  s7.addText(item.title, {
    x: x + 0.15, y: 1.25, w: 2.6, h: 0.4,
    fontSize: 14, bold: true, color: C.main, fontFace: F
  });
  // 区切り線
  s7.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 1.7, w: 2.6, h: 0.015, fill: { color: C.border }
  });
  // 説明
  s7.addText(item.desc, {
    x: x + 0.15, y: 1.8, w: 2.6, h: 1.1,
    fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
  });
});

// ディスカッションポイント
s7.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.3, w: 9, h: 1.2,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s7.addText("本日お聞きしたいこと", {
  x: 0.7, y: 3.45, w: 4, h: 0.35,
  fontSize: 12, bold: true, color: C.orange, fontFace: F
});
s7.addText("• どのようなデータ活用をイメージされていますか？\n• 現状、データを使って困っていることは？\n• 「こんなことができたら」というご要望は？", {
  x: 0.7, y: 3.85, w: 8.5, h: 0.6,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
});

// ========================================
// スライド8: 次のステップ
// ========================================
let s8 = pres.addSlide();
addHeader(s8, "次のステップ");

// テーブル
const nextStepRows = [
  [
    { text: "施策", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "今回のゴール", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "次のアクション", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "提案1\nスコアシートDX化", options: { bold: true, align: "center" } },
    { text: "PoC実施の合意", options: { align: "center", color: C.main, bold: true } },
    { text: "契約締結、サンプルPDF提供", options: { align: "left" } }
  ],
  [
    { text: "提案2\nデータ基盤構築", options: { bold: true, align: "center" } },
    { text: "方向性合意", options: { align: "center" } },
    { text: "情シス顔合わせ日程調整", options: { align: "left" } }
  ]
];
s8.addTable(nextStepRows, {
  x: 0.5, y: 1.05, w: 9, h: 1.8,
  fontFace: F, fontSize: 12, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  rowH: [0.5, 0.65, 0.65]
});

// 今後の流れ
s8.addText("今後の流れ", {
  x: 0.5, y: 3.1, w: 3, h: 0.4,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});

// フロー
const flowItems = [
  { label: "今回MTG", sub: "合意" },
  { label: "提案1: 契約", sub: "PoC開始" },
  { label: "提案2: 情シス", sub: "顔合わせ" },
  { label: "次回MTG", sub: "進捗確認" }
];
flowItems.forEach((item, i) => {
  const x = 0.5 + i * 2.4;
  s8.addShape(pres.ShapeType.roundRect, {
    x: x, y: 3.55, w: 2.1, h: 0.9,
    fill: { color: i === 0 ? C.main : C.light },
    rectRadius: 0.05
  });
  s8.addText(item.label, {
    x: x, y: 3.6, w: 2.1, h: 0.45,
    fontSize: 11, bold: true, color: i === 0 ? C.white : C.text, fontFace: F, align: "center"
  });
  s8.addText(item.sub, {
    x: x, y: 4.0, w: 2.1, h: 0.35,
    fontSize: 10, color: i === 0 ? C.accent : C.sub, fontFace: F, align: "center"
  });
  if (i < flowItems.length - 1) {
    s8.addText("→", {
      x: x + 2.0, y: 3.8, w: 0.5, h: 0.4,
      fontSize: 16, color: C.main, fontFace: F, align: "center"
    });
  }
});

// ========================================
// スライド9: 最終スライド
// ========================================
let s9 = pres.addSlide();
s9.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s9.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s9.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// ========================================
// 保存
// ========================================
const outputDir = path.join(process.env.HOME, "Desktop/obsidian-ttygtd/05_Output/Projects/@Active/Kyoritsu-Seiyaku-DX/02-materials");
const outputPath = path.join(outputDir, "共立製薬様_提案骨子_NTTDXPN.pptx");

pres.writeFile({ fileName: outputPath })
  .then(() => console.log("PowerPoint created: " + outputPath))
  .catch(err => console.error(err));
