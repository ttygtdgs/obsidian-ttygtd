const PptxGenJS = require("pptxgenjs");
const path = require("path");

// ブランドカラー
const C = {
  main: "156082",
  accent: "6CE6E8",
  gold: "F3C551",
  orange: "E67E22",
  green: "2E7D32",
  red: "C62828",
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
pres.title = "共立製薬様 スコアシートDX提案（2026年2月版）";
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

// 共通カード関数
function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 },
    ...(opts.line ? { line: { color: opts.line, pt: 1 } } : {})
  });
  if (opts.accentColor) {
    slide.addShape(pres.ShapeType.rect, {
      x, y, w: 0.08, h, fill: { color: opts.accentColor }
    });
  }
  if (opts.topBar) {
    slide.addShape(pres.ShapeType.rect, {
      x, y, w, h: 0.08, fill: { color: opts.topBar }
    });
  }
}

// ========== スライド1: 表紙 ==========
let s1 = pres.addSlide();
s1.addImage({ path: `${assets}/bg-title.png`, x: 0, y: 0, w: 10, h: 5.625 });
s1.addText("共立製薬株式会社 様", {
  x: 0.6, y: 1.5, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("スコアシートDX提案", {
  x: 0.6, y: 1.95, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("スマートデバイス入力 + データ基盤構築", {
  x: 0.6, y: 2.65, w: 8, h: 0.4,
  fontSize: 18, color: C.accent, fontFace: F
});
s1.addText("2026年2月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== スライド2: 前提（合意事項） ==========
let s2 = pres.addSlide();
addHeader(s2, "前提（先方との合意事項）");

// 合意事項テーブル
const premiseRows = [
  [
    { text: "項目", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "経営層への稟議", options: { align: "center", bold: true } },
    { text: "佐々木様を中心に現場で解像度を上げ、経営層へ稟議を出す方向で合意", options: { align: "left" } }
  ],
  [
    { text: "紙へのこだわり", options: { align: "center", bold: true } },
    { text: "なし（デジタル入力への移行に前向き）", options: { align: "left" } }
  ],
  [
    { text: "ローデータ", options: { align: "center", bold: true } },
    { text: "紙でもデータでも、ローデータの保管が必須（厚労省GCP準拠）", options: { align: "left" } }
  ]
];

s2.addTable(premiseRows, {
  x: 0.5, y: 1.1, w: 9, h: 2.0,
  fontFace: F, fontSize: 13, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.5, 6.5]
});

// ポイント強調ボックス
addCard(s2, 0.5, 3.3, 9, 1.4, { fill: "EDF7FA", line: C.main });
s2.addText("ポイント", {
  x: 0.7, y: 3.4, w: 2, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s2.addText([
  { text: "紙にこだわりがないため、スマートデバイスでの直接入力が可能\n", options: { fontSize: 12, color: C.text } },
  { text: "ローデータの保管が最重要 → 電子データを原本とする仕組みが必要\n", options: { fontSize: 12, color: C.text } },
  { text: "→ 厚労省GCPガイドラインに準拠した監査証跡・セキュリティを実装", options: { fontSize: 12, color: C.main, bold: true } }
], {
  x: 0.7, y: 3.8, w: 8.5, h: 0.8,
  fontFace: F, lineSpacing: 20
});

// ========== スライド3: 全体像 ==========
let s3 = pres.addSlide();
addHeader(s3, "本提案の全体像");

// 提案1カード
addCard(s3, 0.5, 1.1, 4.2, 2.8, { topBar: C.main });
s3.addText("①", {
  x: 0.7, y: 1.3, w: 0.5, h: 0.4,
  fontSize: 20, bold: true, color: C.main, fontFace: F
});
s3.addText("スコアシートDX化", {
  x: 1.2, y: 1.35, w: 3.3, h: 0.4,
  fontSize: 16, bold: true, color: C.text, fontFace: F
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.7, y: 1.85, w: 3.8, h: 0.015, fill: { color: C.border }
});
s3.addText("スマートデバイスでの直接入力に移行", {
  x: 0.7, y: 2.0, w: 3.8, h: 0.4,
  fontSize: 12, color: C.sub, fontFace: F
});
s3.addText("・紙の記入・スキャン工程をなくす\n・入力時バリデーション\n・ローデータの電子保管\n・リアルタイムデータ反映", {
  x: 0.7, y: 2.4, w: 3.8, h: 1.2,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 提案2カード
addCard(s3, 5.3, 1.1, 4.2, 2.8, { topBar: C.gold });
s3.addText("②", {
  x: 5.5, y: 1.3, w: 0.5, h: 0.4,
  fontSize: 20, bold: true, color: C.gold, fontFace: F
});
s3.addText("データ基盤構築", {
  x: 6.0, y: 1.35, w: 3.3, h: 0.4,
  fontSize: 16, bold: true, color: C.text, fontFace: F
});
s3.addShape(pres.ShapeType.rect, {
  x: 5.5, y: 1.85, w: 3.8, h: 0.015, fill: { color: C.border }
});
s3.addText("Excelデータの一元管理\nAWS + Snowflake活用", {
  x: 5.5, y: 2.0, w: 3.8, h: 0.5,
  fontSize: 12, color: C.sub, fontFace: F
});
s3.addText("・散在データの一元管理\n・検索・分析可能なデータ基盤\n・BIダッシュボード\n・将来のAI分析基盤", {
  x: 5.5, y: 2.5, w: 3.8, h: 1.2,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 連携矢印
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 9, h: 0.6,
  fill: { color: "E8F5E9" },
  line: { color: C.green, pt: 1 }
});
s3.addText("連携: スマートデバイス入力データ → データ基盤に直接投入（将来）", {
  x: 0.7, y: 4.3, w: 8.5, h: 0.4,
  fontSize: 12, bold: true, color: C.green, fontFace: F, align: "center"
});

// ========== スライド4: 提案① 課題認識 ==========
let s4 = pres.addSlide();
addHeader(s4, "提案①：課題認識");

// 現状の業務フロー
s4.addText("現状の業務フロー", {
  x: 0.5, y: 1.05, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const flowItems = [
  { label: "巡回", fill: C.light, color: C.text },
  { label: "紙に記入", fill: C.light, color: C.text },
  { label: "PDFスキャン", fill: C.light, color: C.text },
  { label: "Excel転記\n（手作業）", fill: "FFEBEE", color: C.red, bold: true },
  { label: "Dropbox\n保存", fill: C.light, color: C.text }
];

flowItems.forEach((item, i) => {
  const xPos = 0.5 + i * 1.9;
  s4.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 1.5, w: 1.6, h: 0.7,
    fill: { color: item.fill }, rectRadius: 0.05
  });
  s4.addText(item.label, {
    x: xPos, y: 1.5, w: 1.6, h: 0.7,
    fontSize: 10, color: item.color, fontFace: F, align: "center", bold: item.bold || false, valign: "middle"
  });
  if (i < flowItems.length - 1) {
    s4.addText("\u2192", {
      x: xPos + 1.55, y: 1.6, w: 0.4, h: 0.5,
      fontSize: 14, color: C.sub, fontFace: F, align: "center"
    });
  }
});

// 課題矢印
s4.addText("\u2191 ここが課題", {
  x: 6.0, y: 2.3, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.red, fontFace: F, align: "center"
});

// 課題テーブル
s4.addText("課題と影響", {
  x: 0.5, y: 2.8, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const issueRows = [
  [
    { text: "課題", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "影響", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "転記作業の工数負担", options: { align: "left" } },
    { text: "担当者の業務時間を圧迫", options: { align: "left" } }
  ],
  [
    { text: "転記ミスのリスク", options: { align: "left" } },
    { text: "データ品質の低下、ローデータの信頼性に影響", options: { align: "left" } }
  ],
  [
    { text: "属人化", options: { align: "left" } },
    { text: "特定担当者への依存、業務継続リスク", options: { align: "left" } }
  ],
  [
    { text: "紙の保管管理", options: { align: "left" } },
    { text: "保管スペース、紛失・劣化リスク", options: { align: "left" } }
  ]
];

s4.addTable(issueRows, {
  x: 0.5, y: 3.15, w: 9, h: 2.0,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [3.5, 5.5]
});

// ========== スライド5: 方向転換 ==========
let s5 = pres.addSlide();
addHeader(s5, "提案①：アプローチの方向転換");

// OCR → スマートデバイス
s5.addText("検討経緯", {
  x: 0.5, y: 1.05, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

addCard(s5, 0.5, 1.5, 9, 0.7, { fill: "EDF7FA" });
s5.addText("当初はOCR（紙\u2192スキャン\u2192自動読取）を検討 \u2192 先方との議論を経てスマートデバイスでの直接入力に方向転換", {
  x: 0.7, y: 1.6, w: 8.5, h: 0.5,
  fontSize: 12, color: C.text, fontFace: F
});

// 比較表
s5.addText("OCR方式 vs スマートデバイス入力", {
  x: 0.5, y: 2.4, w: 6, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const compRows = [
  [
    { text: "観点", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "OCR方式", options: { fill: "E0E0E0", color: C.text, bold: true, align: "center" } },
    { text: "スマートデバイス入力", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "紙の工程", options: { align: "center" } },
    { text: "残る（紙\u2192スキャン\u2192OCR）", options: { align: "left", color: C.red } },
    { text: "なくなる", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "転記作業", options: { align: "center" } },
    { text: "自動化（確認作業は残る）", options: { align: "left" } },
    { text: "そもそも不要", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "データ精度", options: { align: "center" } },
    { text: "OCR精度に依存（85%目標）", options: { align: "left" } },
    { text: "入力時バリデーション可能", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "リアルタイム性", options: { align: "center" } },
    { text: "バッチ処理", options: { align: "left" } },
    { text: "即時反映", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "ローデータ", options: { align: "center" } },
    { text: "紙が原本、電子は複製", options: { align: "left" } },
    { text: "電子データが原本になる", options: { align: "left", bold: true, color: C.green } }
  ]
];

s5.addTable(compRows, {
  x: 0.5, y: 2.75, w: 9, h: 2.5,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.0, 3.5, 3.5]
});

// ========== スライド6: 新業務フロー ==========
let s6 = pres.addSlide();
addHeader(s6, "提案①：新しい業務フロー");

// 新フロー
s6.addText("提案する業務フロー", {
  x: 0.5, y: 1.05, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const newFlowItems = [
  { label: "巡回", fill: C.light, textColor: C.text },
  { label: "スマート\nデバイスで\n直接入力", fill: C.main, textColor: C.white },
  { label: "データ保存\n（クラウド）", fill: C.accent, textColor: C.text },
  { label: "Excel出力 /\nダッシュ\nボード", fill: C.light, textColor: C.text }
];

newFlowItems.forEach((item, i) => {
  const xPos = 0.5 + i * 2.4;
  s6.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 1.5, w: 2.0, h: 1.0,
    fill: { color: item.fill }, rectRadius: 0.05
  });
  s6.addText(item.label, {
    x: xPos, y: 1.5, w: 2.0, h: 1.0,
    fontSize: 11, color: item.textColor, fontFace: F, align: "center", valign: "middle",
    bold: i === 1
  });
  if (i < newFlowItems.length - 1) {
    s6.addText("\u2192", {
      x: xPos + 1.95, y: 1.7, w: 0.5, h: 0.6,
      fontSize: 20, color: C.main, fontFace: F, align: "center"
    });
  }
});

// デバイス入力のポイント
s6.addText("\u2191 ここをデジタル化", {
  x: 2.5, y: 2.6, w: 2.5, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F, align: "center"
});

s6.addText("\u2191 ローデータとして電子保管（GCP準拠）", {
  x: 4.7, y: 2.6, w: 3.5, h: 0.3,
  fontSize: 11, bold: true, color: C.green, fontFace: F, align: "center"
});

// 期待効果
s6.addText("期待効果", {
  x: 0.5, y: 3.1, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const effectRows = [
  [
    { text: "指標", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "現状", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "導入後", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "転記作業", options: { align: "center" } },
    { text: "手作業でExcel転記", options: { align: "left" } },
    { text: "完全不要", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "データ精度", options: { align: "center" } },
    { text: "転記ミスあり", options: { align: "left" } },
    { text: "入力時バリデーションで担保", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "データ反映", options: { align: "center" } },
    { text: "バッチ（転記後）", options: { align: "left" } },
    { text: "リアルタイム", options: { align: "left", bold: true, color: C.green } }
  ],
  [
    { text: "ローデータ保管", options: { align: "center" } },
    { text: "紙保管", options: { align: "left" } },
    { text: "電子保管（監査証跡付き）", options: { align: "left", bold: true, color: C.green } }
  ]
];

s6.addTable(effectRows, {
  x: 0.5, y: 3.45, w: 9, h: 2.0,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.0, 3.5, 3.5]
});

// ========== スライド7: ローデータ保管要件 ==========
let s7 = pres.addSlide();
addHeader(s7, "提案①：ローデータ保管要件（厚労省GCP準拠）");

s7.addText("電子データを原資料（ローデータ）とするための要件", {
  x: 0.5, y: 1.05, w: 9, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const gcpRows = [
  [
    { text: "#", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "要件", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "対応方針", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "1", options: { align: "center" } },
    { text: "システム完全性の保証", options: { align: "left", bold: true } },
    { text: "クラウド基盤による可用性・信頼性の確保", options: { align: "left" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "データ修正履歴の記録", options: { align: "left", bold: true } },
    { text: "全操作の監査証跡（Audit Trail）を自動記録", options: { align: "left" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "セキュリティシステム", options: { align: "left", bold: true } },
    { text: "ユーザー認証、権限管理、アクセスログ", options: { align: "left" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "バックアップ体制", options: { align: "left", bold: true } },
    { text: "自動バックアップ、災害復旧計画", options: { align: "left" } }
  ],
  [
    { text: "5", options: { align: "center" } },
    { text: "データ修正者名簿", options: { align: "left", bold: true } },
    { text: "操作者の特定・管理（ユーザーアカウント管理）", options: { align: "left" } }
  ]
];

s7.addTable(gcpRows, {
  x: 0.5, y: 1.4, w: 9, h: 2.4,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.6, 3.0, 5.4]
});

// メリットカード
addCard(s7, 0.5, 4.0, 9, 1.4, { fill: "E8F5E9", line: C.green });
s7.addText("スマートデバイス入力のメリット（ローデータ観点）", {
  x: 0.7, y: 4.1, w: 8, h: 0.3,
  fontSize: 12, bold: true, color: C.green, fontFace: F
});
s7.addText("・監査証跡が自動記録: 誰が・いつ・何を入力/修正したか全て記録\n・改ざん防止: 修正履歴が残るため、紙よりもデータの信頼性が高い\n・保管の確実性: クラウド保管により紛失・劣化リスクを排除\n・検索性: 必要なデータを即座に検索・抽出可能", {
  x: 0.7, y: 4.4, w: 8.5, h: 0.9,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 16
});

// ========== スライド8: 進め方・論点 ==========
let s8 = pres.addSlide();
addHeader(s8, "提案①：進め方（案）");

// PoC → 本開発
s8.addText("PoC \u2192 本開発の2段階アプローチ", {
  x: 0.5, y: 1.05, w: 6, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

// Phase 1
s8.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 1.5, w: 4.2, h: 2.2,
  fill: { color: "EDF7FA" }, rectRadius: 0.05,
  line: { color: C.main, pt: 1 }
});
s8.addText("Phase 1: PoC", {
  x: 0.7, y: 1.6, w: 3.8, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s8.addText("・入力フォーム試作\n・主要項目の入力検証\n・オフライン対応検証\n・現場フィードバック", {
  x: 0.7, y: 2.0, w: 3.8, h: 1.2,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 矢印
s8.addText("\u2192", {
  x: 4.7, y: 2.2, w: 0.6, h: 0.6,
  fontSize: 28, color: C.main, fontFace: F, align: "center"
});
s8.addText("現場評価\nGo/No-Go", {
  x: 4.6, y: 2.8, w: 0.8, h: 0.5,
  fontSize: 8, color: C.main, fontFace: F, align: "center"
});

// Phase 2
s8.addShape(pres.ShapeType.roundRect, {
  x: 5.3, y: 1.5, w: 4.2, h: 2.2,
  fill: { color: C.light }, rectRadius: 0.05,
  line: { color: C.border, pt: 1 }
});
s8.addText("Phase 2: 本開発", {
  x: 5.5, y: 1.6, w: 3.8, h: 0.35,
  fontSize: 14, bold: true, color: C.text, fontFace: F
});
s8.addText("・本番UI/UX\n・全スコアシート対応\n・ローデータ保管機能\n・Excel出力 / 監査証跡\n・データ基盤連携", {
  x: 5.5, y: 2.0, w: 3.8, h: 1.4,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 今後の論点
s8.addText("今後検討が必要な事項", {
  x: 0.5, y: 3.9, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.orange, fontFace: F
});

const topicRows = [
  [
    { text: "#", options: { fill: C.orange, color: C.white, bold: true, align: "center" } },
    { text: "論点", options: { fill: C.orange, color: C.white, bold: true, align: "left" } },
    { text: "検討内容", options: { fill: C.orange, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "1", options: { align: "center" } },
    { text: "デバイス選定", options: { align: "left", bold: true } },
    { text: "タブレット or スマートフォン / 機種 / 配備台数", options: { align: "left" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "入力フォーム設計", options: { align: "left", bold: true } },
    { text: "既存スコアシートの項目をどう電子フォーム化するか", options: { align: "left" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "オフライン対応", options: { align: "left", bold: true } },
    { text: "圏外での入力 \u2192 復帰時の同期方式", options: { align: "left" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "技術基盤", options: { align: "left", bold: true } },
    { text: "Webアプリ / ネイティブアプリ / PWA", options: { align: "left" } }
  ]
];

s8.addTable(topicRows, {
  x: 0.5, y: 4.25, w: 9, h: 1.2,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.5, 2.5, 6.0]
});

// ========== スライド9: データ基盤構築 ==========
let s9 = pres.addSlide();
addHeader(s9, "提案②：データ基盤構築");

// 現状 → 目指す姿
s9.addText("現状", {
  x: 0.5, y: 1.05, w: 2, h: 0.35,
  fontSize: 12, bold: true, color: C.red, fontFace: F
});
addCard(s9, 0.5, 1.4, 3.5, 1.5, { fill: "FFEBEE" });
s9.addText("Dropbox上にExcelが散在\n\n・データ散逸\n・検索困難\n・活用困難", {
  x: 0.7, y: 1.5, w: 3.0, h: 1.3,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 16
});

s9.addText("\u2192", {
  x: 4.1, y: 1.9, w: 0.6, h: 0.6,
  fontSize: 28, color: C.main, fontFace: F, align: "center"
});

s9.addText("目指す姿", {
  x: 4.8, y: 1.05, w: 2, h: 0.35,
  fontSize: 12, bold: true, color: C.green, fontFace: F
});
addCard(s9, 4.8, 1.4, 4.7, 1.5, { fill: "E8F5E9" });
s9.addText("Snowflakeで一元管理\n\n・構造化データ\n・検索・分析可能\n・BIダッシュボード", {
  x: 5.0, y: 1.5, w: 4.2, h: 1.3,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 16
});

// システム構成フロー
s9.addText("システム構成（AWS + Snowflake）", {
  x: 0.5, y: 3.1, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const sysFlowItems = [
  { label: "Dropbox\n(Excel)", fill: C.light, textColor: C.text },
  { label: "インポート\nスクリプト", fill: C.main, textColor: C.white },
  { label: "Snowflake\n(DWH)", fill: "E8F5E9", textColor: C.green },
  { label: "BIツール /\n検索UI", fill: C.accent, textColor: C.text }
];

sysFlowItems.forEach((item, i) => {
  const xPos = 0.5 + i * 2.4;
  s9.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 3.55, w: 2.0, h: 0.9,
    fill: { color: item.fill }, rectRadius: 0.05
  });
  s9.addText(item.label, {
    x: xPos, y: 3.55, w: 2.0, h: 0.9,
    fontSize: 11, color: item.textColor, fontFace: F, align: "center", valign: "middle", bold: true
  });
  if (i < sysFlowItems.length - 1) {
    s9.addText("\u2192", {
      x: xPos + 1.95, y: 3.7, w: 0.5, h: 0.6,
      fontSize: 20, color: C.main, fontFace: F, align: "center"
    });
  }
});

// 技術選定理由
const techRows = [
  [
    { text: "コンポーネント", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "選定", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "理由", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "データ基盤", options: { align: "center", bold: true } },
    { text: "Snowflake", options: { align: "center" } },
    { text: "貴社で既に利用中、スケーラビリティ、SQL対応", options: { align: "left" } }
  ],
  [
    { text: "環境", options: { align: "center", bold: true } },
    { text: "AWS", options: { align: "center" } },
    { text: "貴社既存環境を活用、セキュリティポリシー適合", options: { align: "left" } }
  ]
];

s9.addTable(techRows, {
  x: 0.5, y: 4.65, w: 9, h: 0.8,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.0, 1.5, 5.5]
});

// ========== スライド10: 情シス連携 ==========
let s10 = pres.addSlide();
addHeader(s10, "提案②：情シス連携の進め方");

const stepsData = [
  { step: "Step 1", title: "初回顔合わせ", desc: "プロジェクト概要説明、協力体制構築", who: "情シス + 現場 + 弊社", color: C.main },
  { step: "Step 2", title: "技術要件すり合わせ", desc: "AWS環境確認、Snowflake設定、セキュリティ要件", who: "情シス + 弊社", color: C.main },
  { step: "Step 3", title: "環境準備", desc: "権限付与、環境セットアップ", who: "情シス（弊社サポート）", color: C.gold },
  { step: "Step 4", title: "開発・テスト", desc: "インポートスクリプト開発、テスト", who: "弊社（情シスレビュー）", color: C.gold }
];

stepsData.forEach((item, i) => {
  const yPos = 1.1 + i * 1.05;
  s10.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: yPos, w: 1.5, h: 0.8,
    fill: { color: item.color }, rectRadius: 0.05
  });
  s10.addText(item.step, {
    x: 0.5, y: yPos, w: 1.5, h: 0.8,
    fontSize: 12, bold: true, color: C.white, fontFace: F, align: "center", valign: "middle"
  });

  addCard(s10, 2.2, yPos, 7.3, 0.8, { accentColor: item.color });
  s10.addText(item.title, {
    x: 2.5, y: yPos + 0.05, w: 3.5, h: 0.35,
    fontSize: 13, bold: true, color: C.text, fontFace: F
  });
  s10.addText(item.desc, {
    x: 2.5, y: yPos + 0.4, w: 4.5, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F
  });
  s10.addText(item.who, {
    x: 7.2, y: yPos + 0.15, w: 2.1, h: 0.5,
    fontSize: 9, color: C.main, fontFace: F, align: "right"
  });

  if (i < stepsData.length - 1) {
    s10.addText("\u2193", {
      x: 1.0, y: yPos + 0.75, w: 0.5, h: 0.35,
      fontSize: 14, color: C.sub, fontFace: F, align: "center"
    });
  }
});

// 議論ポイント
s10.addText("情シスとの議論ポイント", {
  x: 0.5, y: 5.1, w: 4, h: 0.3,
  fontSize: 11, bold: true, color: C.orange, fontFace: F
});
s10.addText("権限範囲 \u2502 データ格納ポリシー \u2502 セキュリティルール \u2502 対応可能時期", {
  x: 0.5, y: 5.35, w: 9, h: 0.2,
  fontSize: 10, color: C.sub, fontFace: F
});

// ========== スライド11: 連携イメージ ==========
let s11 = pres.addSlide();
addHeader(s11, "提案①②の連携イメージ");

// 提案①ボックス
addCard(s11, 0.5, 1.1, 3.8, 2.5, { topBar: C.main });
s11.addText("提案① スコアシートDX化", {
  x: 0.7, y: 1.3, w: 3.4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s11.addShape(pres.ShapeType.rect, {
  x: 0.7, y: 1.75, w: 3.4, h: 0.015, fill: { color: C.border }
});
s11.addText("・スマートデバイス入力\n・入力時バリデーション\n・ローデータ電子保管\n・監査証跡", {
  x: 0.7, y: 1.9, w: 3.4, h: 1.2,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 矢印（直接投入）
s11.addShape(pres.ShapeType.rect, {
  x: 4.4, y: 2.1, w: 1.2, h: 0.5,
  fill: { color: C.green }
});
s11.addText("直接投入", {
  x: 4.4, y: 2.15, w: 1.2, h: 0.4,
  fontSize: 10, bold: true, color: C.white, fontFace: F, align: "center"
});

// 提案②ボックス
addCard(s11, 5.7, 1.1, 3.8, 2.5, { topBar: C.gold });
s11.addText("提案② データ基盤構築", {
  x: 5.9, y: 1.3, w: 3.4, h: 0.35,
  fontSize: 13, bold: true, color: C.gold, fontFace: F
});
s11.addShape(pres.ShapeType.rect, {
  x: 5.9, y: 1.75, w: 3.4, h: 0.015, fill: { color: C.border }
});
s11.addText("・Snowflake一元管理\n・検索・分析\n・BIダッシュボード\n・将来のAI分析基盤", {
  x: 5.9, y: 1.9, w: 3.4, h: 1.2,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 18
});

// 連携メリット
s11.addText("連携メリット", {
  x: 0.5, y: 3.9, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.green, fontFace: F
});

const linkRows = [
  [
    { text: "メリット", options: { fill: C.green, color: C.white, bold: true, align: "left" } },
    { text: "内容", options: { fill: C.green, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "転記工程の完全排除", options: { align: "left", bold: true } },
    { text: "デバイス入力 \u2192 データ基盤に直接格納（Excelを経由しない）", options: { align: "left" } }
  ],
  [
    { text: "リアルタイム分析", options: { align: "left", bold: true } },
    { text: "入力と同時にダッシュボードに反映", options: { align: "left" } }
  ],
  [
    { text: "ローデータの一元管理", options: { align: "left", bold: true } },
    { text: "入力データ＝ローデータとしてSnowflakeで保管", options: { align: "left" } }
  ]
];

s11.addTable(linkRows, {
  x: 0.5, y: 4.25, w: 9, h: 1.2,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [3.0, 6.0]
});

// ========== スライド12: 次のアクション ==========
let s12 = pres.addSlide();
addHeader(s12, "次のアクション");

// 稟議に向けた流れ
s12.addText("稟議に向けた進め方", {
  x: 0.5, y: 1.05, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const phaseLabels = [
  { label: "現場で解像度UP", sub: "佐々木様と詳細化", fill: C.main },
  { label: "提案資料作成", sub: "経営層向け整理", fill: C.gold },
  { label: "経営層への稟議", sub: "予算承認", fill: C.green }
];

phaseLabels.forEach((item, i) => {
  const xPos = 0.5 + i * 3.2;
  s12.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 1.5, w: 2.8, h: 1.0,
    fill: { color: item.fill }, rectRadius: 0.05
  });
  s12.addText(item.label, {
    x: xPos, y: 1.55, w: 2.8, h: 0.5,
    fontSize: 13, bold: true, color: C.white, fontFace: F, align: "center"
  });
  s12.addText(item.sub, {
    x: xPos, y: 2.0, w: 2.8, h: 0.4,
    fontSize: 10, color: C.white, fontFace: F, align: "center"
  });
  if (i < phaseLabels.length - 1) {
    s12.addText("\u2192", {
      x: xPos + 2.75, y: 1.7, w: 0.5, h: 0.6,
      fontSize: 20, color: C.sub, fontFace: F, align: "center"
    });
  }
});

// アクション一覧
s12.addText("アクション一覧", {
  x: 0.5, y: 2.8, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const actionRows = [
  [
    { text: "#", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "アクション", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "担当", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "状態", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "1", options: { align: "center" } },
    { text: "提案\u2460の具体化（デバイス・フォーム設計等）", options: { align: "left" } },
    { text: "弊社+NTT東", options: { align: "center", fontSize: 10 } },
    { text: "\u25A1", options: { align: "center" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "ローデータ保管要件の詳細整理（GCP準拠）", options: { align: "left" } },
    { text: "弊社", options: { align: "center", fontSize: 10 } },
    { text: "\u25A1", options: { align: "center" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "提案\u2461の情シス連携開始（顔合わせ日程調整）", options: { align: "left" } },
    { text: "先方", options: { align: "center", fontSize: 10 } },
    { text: "\u25A1", options: { align: "center" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "経営層向け提案資料作成", options: { align: "left" } },
    { text: "弊社+NTT東", options: { align: "center", fontSize: 10 } },
    { text: "\u25A1", options: { align: "center" } }
  ],
  [
    { text: "5", options: { align: "center" } },
    { text: "佐々木様と合意形成、稟議準備", options: { align: "left" } },
    { text: "先方+弊社", options: { align: "center", fontSize: 10 } },
    { text: "\u25A1", options: { align: "center" } }
  ]
];

s12.addTable(actionRows, {
  x: 0.5, y: 3.15, w: 9, h: 2.2,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.6, 5.2, 1.7, 1.5]
});

// ========== スライド13: 最終スライド ==========
let s13 = pres.addSlide();
s13.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s13.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s13.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// 出力
const outputPath = path.join(__dirname, "共立製薬-スコアシートDX提案-2026-02.pptx");
pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`Created: ${outputPath}`))
  .catch(err => console.error(err));
