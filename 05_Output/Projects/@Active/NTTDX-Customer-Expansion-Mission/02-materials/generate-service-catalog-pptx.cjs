const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = "フェーズ別サービス・ソリューション整理";
pres.author = "NTT DXパートナー";

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

// 共通ヘッダー
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

// ========== 1. 表紙 ==========
let s1 = pres.addSlide();
s1.addImage({ path: `${assets}/bg-title.png`, x: 0, y: 0, w: 10, h: 5.625 });
s1.addText("NTT東日本 各部門・支店向け", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("フェーズ別サービス・ソリューション整理", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("AIチーム提供サービスカタログ", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== 2. サマリー ==========
let s2 = pres.addSlide();
addHeader(s2, "サービス全体像");

const summaryRows = [
  [
    { text: "フェーズ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "顧客の状態", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "提供サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "主な提供価値", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "① 理解", options: { bold: true, align: "center" } },
    { text: "何ができるか分からない", options: { align: "left" } },
    { text: "生成AI活用研修", options: { align: "left" } },
    { text: "知識習得・意識改革", options: { align: "left" } }
  ],
  [
    { text: "② 設計", options: { bold: true, align: "center" } },
    { text: "使い道を探している", options: { align: "left" } },
    { text: "ユースケース設計／業務整理", options: { align: "left" } },
    { text: "活用方針の明確化", options: { align: "left" } }
  ],
  [
    { text: "③ 検証", options: { bold: true, align: "center" } },
    { text: "PoCを試したい", options: { align: "left" } },
    { text: "PoC開発支援", options: { align: "left" } },
    { text: "実現性・効果の検証", options: { align: "left" } }
  ],
  [
    { text: "④ 実装", options: { bold: true, align: "center" } },
    { text: "本番導入したい", options: { align: "left" } },
    { text: "本実装・内製化支援", options: { align: "left" } },
    { text: "本番システム構築", options: { align: "left" } }
  ],
  [
    { text: "⑤ 定着", options: { bold: true, align: "center" } },
    { text: "継続運用したい", options: { align: "left" } },
    { text: "SaaS提供・運用支援", options: { align: "left" } },
    { text: "継続的な価値創出", options: { align: "left" } }
  ],
  [
    { text: "横断", options: { bold: true, align: "center", fill: "EDF7FA", color: C.main } },
    { text: "フェーズを問わず", options: { align: "left", fill: "EDF7FA", color: C.main } },
    { text: "開発伴走サービス", options: { align: "left", fill: "EDF7FA", color: C.main } },
    { text: "継続的な伴走支援", options: { align: "left", fill: "EDF7FA", color: C.main } }
  ]
];

s2.addTable(summaryRows, {
  x: 0.4, y: 1.0, w: 9.2, h: 3.5,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.0, 2.2, 3.0, 3.0]
});

// フロー図
const phases = ["理解", "設計", "検証", "実装", "定着"];
phases.forEach((phase, i) => {
  const x = 0.5 + i * 1.85;
  s2.addShape(pres.ShapeType.roundRect, {
    x: x, y: 4.6, w: 1.6, h: 0.6,
    fill: { color: C.main },
    rectRadius: 0.05
  });
  s2.addText(`${["①","②","③","④","⑤"][i]} ${phase}`, {
    x: x, y: 4.7, w: 1.6, h: 0.4,
    fontSize: 11, bold: true, color: C.white, fontFace: F, align: "center"
  });
  if (i < phases.length - 1) {
    s2.addText("→", {
      x: x + 1.55, y: 4.7, w: 0.35, h: 0.4,
      fontSize: 14, color: C.main, fontFace: F, align: "center"
    });
  }
});

// ========== 3. 理解フェーズ ==========
let s3 = pres.addSlide();
addHeader(s3, "① 理解フェーズ：生成AI活用研修");

s3.addText("顧客の状態: 何ができるか分からない / AIに興味はあるが活用イメージがない", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 11, color: C.sub, fontFace: F
});

const phase1Rows = [
  [
    { text: "サービス名", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "想定期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "対象者", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "生成AI基礎研修", options: { bold: true, align: "left" } },
    { text: "ChatGPT/Claude等の基本操作・活用法", options: { align: "left" } },
    { text: "半日〜1日", options: { align: "center" } },
    { text: "全社員向け", options: { align: "center" } },
    { text: "30〜50万円", options: { align: "center" } }
  ],
  [
    { text: "経営層向けAI戦略セミナー", options: { bold: true, align: "left" } },
    { text: "AI活用による経営インパクト解説", options: { align: "left" } },
    { text: "2〜3時間", options: { align: "center" } },
    { text: "経営層・管理職", options: { align: "center" } },
    { text: "20〜30万円", options: { align: "center" } }
  ],
  [
    { text: "業種別AI活用ワークショップ", options: { bold: true, align: "left" } },
    { text: "業界特化の活用事例紹介・体験", options: { align: "left" } },
    { text: "1日", options: { align: "center" } },
    { text: "現場担当者", options: { align: "center" } },
    { text: "40〜60万円", options: { align: "center" } }
  ],
  [
    { text: "プロンプトエンジニアリング研修", options: { bold: true, align: "left" } },
    { text: "効果的なAI活用のためのスキル習得", options: { align: "left" } },
    { text: "1〜2日", options: { align: "center" } },
    { text: "推進担当者", options: { align: "center" } },
    { text: "50〜80万円", options: { align: "center" } }
  ],
  [
    { text: "Cursor/AI Coding研修", options: { bold: true, align: "left" } },
    { text: "AIコーディングツール活用研修", options: { align: "left" } },
    { text: "1日", options: { align: "center" } },
    { text: "エンジニア・DX担当", options: { align: "center" } },
    { text: "50〜80万円", options: { align: "center" } }
  ]
];

s3.addTable(phase1Rows, {
  x: 0.4, y: 1.3, w: 9.2, h: 2.8,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.5, 3.0, 1.2, 1.5, 1.0]
});

// 提供価値ボックス
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.0,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s3.addText("提供価値", {
  x: 0.6, y: 4.3, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s3.addText("✓  生成AIへの理解向上　　✓  組織の意識改革　　✓  活用アイデア創出", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 4. 設計フェーズ ==========
let s4 = pres.addSlide();
addHeader(s4, "② 設計フェーズ：ユースケース設計／業務整理");

s4.addText("顧客の状態: 使い道を探している / 何に使えるか整理したい", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 11, color: C.sub, fontFace: F
});

const phase2Rows = [
  [
    { text: "サービス名", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "想定期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "成果物", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "業務棚卸しコンサルティング", options: { bold: true, align: "left" } },
    { text: "現行業務の可視化・AI適用領域特定", options: { align: "left" } },
    { text: "2〜4週間", options: { align: "center" } },
    { text: "業務フロー図、AI適用候補リスト", options: { align: "left", fontSize: 9 } },
    { text: "100〜200万円", options: { align: "center" } }
  ],
  [
    { text: "ユースケース設計WS", options: { bold: true, align: "left" } },
    { text: "アイデア発散・優先順位付け", options: { align: "left" } },
    { text: "1〜2日", options: { align: "center" } },
    { text: "ユースケース一覧、優先度マトリクス", options: { align: "left", fontSize: 9 } },
    { text: "50〜80万円", options: { align: "center" } }
  ],
  [
    { text: "効果試算・ROI分析", options: { bold: true, align: "left" } },
    { text: "導入効果の定量化", options: { align: "left" } },
    { text: "1〜2週間", options: { align: "center" } },
    { text: "効果試算シート、投資対効果レポート", options: { align: "left", fontSize: 9 } },
    { text: "80〜150万円", options: { align: "center" } }
  ],
  [
    { text: "AI活用ロードマップ策定", options: { bold: true, align: "left" } },
    { text: "段階的導入計画の立案", options: { align: "left" } },
    { text: "2〜3週間", options: { align: "center" } },
    { text: "ロードマップ資料、実行計画書", options: { align: "left", fontSize: 9 } },
    { text: "100〜200万円", options: { align: "center" } }
  ]
];

s4.addTable(phase2Rows, {
  x: 0.4, y: 1.3, w: 9.2, h: 2.4,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.3, 2.5, 1.2, 2.2, 1.0]
});

s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.85, w: 9.2, h: 1.0,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s4.addText("提供価値", {
  x: 0.6, y: 3.95, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s4.addText("✓  活用方針の明確化　　✓  経営層への説明材料　　✓  投資判断の根拠", {
  x: 0.6, y: 4.3, w: 8.8, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 5. 検証フェーズ ==========
let s5 = pres.addSlide();
addHeader(s5, "③ 検証フェーズ：PoC開発支援");

s5.addText("顧客の状態: PoCを試したい / 実際に動くものを見たい", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 11, color: C.sub, fontFace: F
});

const phase3Rows = [
  [
    { text: "サービス名", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "想定期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "成果物", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "RAGチャットボットPoC", options: { bold: true, align: "left" } },
    { text: "社内文書検索・問い合わせ対応Bot", options: { align: "left" } },
    { text: "4〜8週間", options: { align: "center" } },
    { text: "動作するBot、評価レポート", options: { align: "left", fontSize: 9 } },
    { text: "200〜400万円", options: { align: "center" } }
  ],
  [
    { text: "業務自動化PoC（n8n）", options: { bold: true, align: "left" } },
    { text: "定型作業のAI自動化検証", options: { align: "left" } },
    { text: "4〜6週間", options: { align: "center" } },
    { text: "自動化ワークフロー、効果測定結果", options: { align: "left", fontSize: 9 } },
    { text: "150〜300万円", options: { align: "center" } }
  ],
  [
    { text: "AIエージェントPoC", options: { bold: true, align: "left" } },
    { text: "複雑なタスクの自律実行検証", options: { align: "left" } },
    { text: "6〜10週間", options: { align: "center" } },
    { text: "エージェントシステム、検証結果", options: { align: "left", fontSize: 9 } },
    { text: "300〜500万円", options: { align: "center" } }
  ],
  [
    { text: "画像・動画AI活用PoC", options: { bold: true, align: "left" } },
    { text: "画像認識・生成系AI活用検証", options: { align: "left" } },
    { text: "4〜8週間", options: { align: "center" } },
    { text: "動作システム、精度評価", options: { align: "left", fontSize: 9 } },
    { text: "200〜400万円", options: { align: "center" } }
  ],
  [
    { text: "カスタマーサポートAI PoC", options: { bold: true, align: "left" } },
    { text: "問い合わせ対応AI構築検証", options: { align: "left" } },
    { text: "6〜10週間", options: { align: "center" } },
    { text: "AIチャットシステム、対応精度評価", options: { align: "left", fontSize: 9 } },
    { text: "250〜450万円", options: { align: "center" } }
  ]
];

s5.addTable(phase3Rows, {
  x: 0.4, y: 1.3, w: 9.2, h: 2.8,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.3, 2.5, 1.2, 2.2, 1.0]
});

s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.0,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("提供価値", {
  x: 0.6, y: 4.3, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s5.addText("✓  実現性の検証　　✓  本番導入判断材料　　✓  課題・リスクの早期発見", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 6. 実装フェーズ ==========
let s6 = pres.addSlide();
addHeader(s6, "④ 実装フェーズ：本実装・内製化支援");

s6.addText("顧客の状態: 本番導入したい / 自社でも運用できるようにしたい", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 11, color: C.sub, fontFace: F
});

const phase4Rows = [
  [
    { text: "サービス名", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "想定期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "成果物", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "本番システム開発", options: { bold: true, align: "left" } },
    { text: "PoC→本番環境への移行・開発", options: { align: "left" } },
    { text: "2〜6ヶ月", options: { align: "center" } },
    { text: "本番稼働システム", options: { align: "left" } },
    { text: "500〜2000万円", options: { align: "center" } }
  ],
  [
    { text: "内製化支援プログラム", options: { bold: true, align: "left" } },
    { text: "顧客チームへの技術移転・ハンズオン", options: { align: "left" } },
    { text: "1〜3ヶ月", options: { align: "center" } },
    { text: "技術ドキュメント、研修完了", options: { align: "left" } },
    { text: "300〜600万円", options: { align: "center" } }
  ],
  [
    { text: "AI開発環境構築支援", options: { bold: true, align: "left" } },
    { text: "Dify/n8n等の環境構築・運用設計", options: { align: "left" } },
    { text: "2〜4週間", options: { align: "center" } },
    { text: "構築済み環境、運用手順書", options: { align: "left" } },
    { text: "100〜200万円", options: { align: "center" } }
  ],
  [
    { text: "セキュリティ対応支援", options: { bold: true, align: "left" } },
    { text: "プライベートLLM環境構築等", options: { align: "left" } },
    { text: "2〜4週間", options: { align: "center" } },
    { text: "セキュアな実行環境", options: { align: "left" } },
    { text: "150〜300万円", options: { align: "center" } }
  ],
  [
    { text: "既存システム連携開発", options: { bold: true, align: "left" } },
    { text: "基幹システム等との連携開発", options: { align: "left" } },
    { text: "1〜3ヶ月", options: { align: "center" } },
    { text: "連携済みシステム", options: { align: "left" } },
    { text: "300〜800万円", options: { align: "center" } }
  ]
];

s6.addTable(phase4Rows, {
  x: 0.4, y: 1.3, w: 9.2, h: 2.8,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.3, 2.5, 1.2, 2.2, 1.0]
});

s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.0,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s6.addText("提供価値", {
  x: 0.6, y: 4.3, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s6.addText("✓  本番レベルの品質保証　　✓  自社運用体制の構築　　✓  持続可能なAI活用基盤", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 7. 定着フェーズ ==========
let s7 = pres.addSlide();
addHeader(s7, "⑤ 定着フェーズ：SaaS提供・運用支援");

s7.addText("顧客の状態: 継続運用したい / 安定稼働させたい", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 11, color: C.sub, fontFace: F
});

const phase5Rows = [
  [
    { text: "サービス名", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "提供形態", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯（月額）", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "Dify SaaS提供", options: { bold: true, align: "left" } },
    { text: "マネージドDify環境の月額提供", options: { align: "left" } },
    { text: "月額サブスクリプション", options: { align: "center" } },
    { text: "10〜30万円/月", options: { align: "center" } }
  ],
  [
    { text: "n8n SaaS提供", options: { bold: true, align: "left" } },
    { text: "マネージドn8n環境の月額提供", options: { align: "left" } },
    { text: "月額サブスクリプション", options: { align: "center" } },
    { text: "5〜20万円/月", options: { align: "center" } }
  ],
  [
    { text: "運用保守サービス", options: { bold: true, align: "left" } },
    { text: "監視・障害対応・アップデート対応", options: { align: "left" } },
    { text: "月額保守契約", options: { align: "center" } },
    { text: "20〜50万円/月", options: { align: "center" } }
  ],
  [
    { text: "AI活用定着支援", options: { bold: true, align: "left" } },
    { text: "定期レビュー・改善提案・追加開発", options: { align: "left" } },
    { text: "顧問契約（四半期等）", options: { align: "center" } },
    { text: "30〜80万円/月", options: { align: "center" } }
  ],
  [
    { text: "ユーザーサポート代行", options: { bold: true, align: "left" } },
    { text: "社内問い合わせ対応のアウトソース", options: { align: "left" } },
    { text: "月額サポート契約", options: { align: "center" } },
    { text: "10〜30万円/月", options: { align: "center" } }
  ]
];

s7.addTable(phase5Rows, {
  x: 0.4, y: 1.3, w: 9.2, h: 2.6,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.3, 3.0, 2.2, 1.7]
});

s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.0, w: 9.2, h: 1.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s7.addText("提供価値", {
  x: 0.6, y: 4.1, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s7.addText("✓  安定稼働・運用負荷軽減　　✓  継続的な改善・進化　　✓  ストック型収益", {
  x: 0.6, y: 4.45, w: 8.8, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});
s7.addText("※ Dify, n8n は IT導入補助金登録済", {
  x: 0.6, y: 4.8, w: 8.8, h: 0.3,
  fontSize: 10, color: C.orange, bold: true, fontFace: F
});

// ========== 8. フェーズ横断オプション ==========
let s8 = pres.addSlide();
addHeader(s8, "フェーズ横断オプション：開発伴走サービス");

s8.addText("各フェーズを通じて、プロダクト・サービス開発を継続的に支援する伴走型サービス", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

// 2カラムカード
const companionServices = [
  {
    title: "CX起点でのプロダクト・サービス開発伴走",
    desc: "顧客体験（CX）を起点に、プロダクト・サービスの企画から開発までを伴走支援"
  },
  {
    title: "サービス開発伴走",
    desc: "新規サービス・プロダクトの開発プロセス全体を伴走支援"
  }
];

companionServices.forEach((svc, i) => {
  const x = 0.5 + i * 4.6;
  // カード背景
  s8.addShape(pres.ShapeType.rect, {
    x: x, y: 1.5, w: 4.4, h: 2.0,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s8.addShape(pres.ShapeType.rect, {
    x: x, y: 1.5, w: 4.4, h: 0.08, fill: { color: C.main }
  });
  // 番号
  s8.addText(`0${i + 1}`, {
    x: x + 0.2, y: 1.7, w: 0.6, h: 0.4,
    fontSize: 22, bold: true, color: C.main, fontFace: F
  });
  // タイトル
  s8.addText(svc.title, {
    x: x + 0.2, y: 2.15, w: 4.0, h: 0.6,
    fontSize: 13, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s8.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 2.75, w: 4.0, h: 0.015, fill: { color: C.border }
  });
  // 説明
  s8.addText(svc.desc, {
    x: x + 0.2, y: 2.85, w: 4.0, h: 0.55,
    fontSize: 11, color: C.sub, fontFace: F
  });
});

// 提供価値ボックス
s8.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.7, w: 9.2, h: 1.1,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s8.addText("提供価値", {
  x: 0.6, y: 3.8, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s8.addText("✓  継続的な伴走による品質担保　　✓  顧客視点での開発推進　　✓  自走化に向けたナレッジ移転", {
  x: 0.6, y: 4.15, w: 8.8, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});
s8.addText("※ 詳細な支援体制・期間・費用は案件に応じて個別相談", {
  x: 0.6, y: 4.5, w: 8.8, h: 0.25,
  fontSize: 10, color: C.sub, fontFace: F
});

// ========== 9. IT導入補助金 ==========
let s9 = pres.addSlide();
addHeader(s9, "IT導入補助金活用時のメリット");

const subsidyRows = [
  [
    { text: "フェーズ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助金活用可能サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助対象", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助率目安", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "③ 検証", options: { bold: true, align: "center" } },
    { text: "Dify/n8nを活用したPoC", options: { align: "left" } },
    { text: "ツール利用料", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "④ 実装", options: { bold: true, align: "center" } },
    { text: "本番環境構築・導入", options: { align: "left" } },
    { text: "導入費用、カスタマイズ費", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "⑤ 定着", options: { bold: true, align: "center" } },
    { text: "SaaS月額利用", options: { align: "left" } },
    { text: "月額利用料（初年度）", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ]
];

s9.addTable(subsidyRows, {
  x: 0.4, y: 1.1, w: 9.2, h: 2.0,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.2, 3.0, 2.5, 2.5]
});

// メリットボックス
s9.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.3, w: 9.2, h: 1.8,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1.5 }
});
s9.addText("お客様メリット", {
  x: 0.6, y: 3.45, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.orange, fontFace: F
});
s9.addText("導入コストの 1/2〜2/3 を補助金でカバー可能", {
  x: 0.6, y: 3.9, w: 8.8, h: 0.5,
  fontSize: 18, bold: true, color: C.text, fontFace: F
});
s9.addText("例: 300万円のPoC費用 → 実質負担 100〜150万円", {
  x: 0.6, y: 4.5, w: 8.8, h: 0.4,
  fontSize: 12, color: C.sub, fontFace: F
});

// ========== 10. 最終スライド ==========
let s10 = pres.addSlide();
s10.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s10.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s10.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// 出力
const outDir = path.dirname(__filename);
const outPath = path.join(outDir, "フェーズ別サービスソリューション整理_NTTDXPN.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => console.error(err));
