const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = "AIサービスパッケージのご紹介";
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
s1.addText("AIサービスパッケージのご紹介", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("お客様のニーズに応じた4つのパッケージ", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== 2. パッケージ全体像 ==========
let s2 = pres.addSlide();
addHeader(s2, "サービスパッケージ全体像");

// 4パッケージ情報
const packages = [
  { num: "01", name: "AI研修（仮）", target: "AIリテラシーを\n高めたい", price: "20〜80万円", color: C.accent },
  { num: "02", name: "PoCプラン（仮）", target: "まずAIを\n試したい", price: "50〜500万円", color: C.main },
  { num: "03", name: "本番実装プラン（仮）", target: "本格導入・\n運用したい", price: "500万円〜", color: C.gold },
  { num: "04", name: "開発伴走サービス（仮）", target: "継続的に\n伴走してほしい", price: "個別相談", color: C.orange }
];

packages.forEach((pkg, i) => {
  const x = 0.5 + i * 2.35;
  // カード背景
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.0, w: 2.2, h: 3.6,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.0, w: 2.2, h: 0.1, fill: { color: pkg.color }
  });
  // 番号
  s2.addText(pkg.num, {
    x: x + 0.15, y: 1.2, w: 0.6, h: 0.4,
    fontSize: 18, bold: true, color: pkg.color, fontFace: F
  });
  // パッケージ名
  s2.addText(pkg.name, {
    x: x + 0.15, y: 1.6, w: 1.9, h: 0.6,
    fontSize: 12, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s2.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 2.25, w: 1.9, h: 0.015, fill: { color: C.border }
  });
  // 対象
  s2.addText(pkg.target, {
    x: x + 0.15, y: 2.35, w: 1.9, h: 0.8,
    fontSize: 10, color: C.sub, fontFace: F
  });
  // 価格
  s2.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 3.25, w: 1.9, h: 0.5,
    fill: { color: C.light }
  });
  s2.addText(pkg.price, {
    x: x + 0.15, y: 3.35, w: 1.9, h: 0.35,
    fontSize: 10, bold: true, color: C.main, fontFace: F, align: "center"
  });
});

// フロー矢印
s2.addText("研修で学ぶ → PoCで検証 → 本番実装・運用", {
  x: 0.4, y: 4.8, w: 9.2, h: 0.4,
  fontSize: 11, color: C.sub, fontFace: F, align: "center"
});

// ========== 3. AI研修 ==========
let s3 = pres.addSlide();
addHeader(s3, "AI研修（仮）");

s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "E0F7FA" },
  line: { color: C.accent, pt: 1 }
});
s3.addText("対象: AIリテラシーを高めたい企業（まずはAIを理解したい / 社員の意識を変えたい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

const training_rows = [
  [
    { text: "研修名", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "対象者", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "生成AI基礎研修", options: { bold: true, align: "left" } },
    { text: "ChatGPT/Claude等の基本操作・活用法", options: { align: "left" } },
    { text: "全社員向け", options: { align: "center" } },
    { text: "半日〜1日", options: { align: "center" } },
    { text: "30〜50万円", options: { align: "center" } }
  ],
  [
    { text: "経営層向けAI戦略セミナー", options: { bold: true, align: "left" } },
    { text: "AI活用による経営インパクト解説", options: { align: "left" } },
    { text: "経営層・管理職", options: { align: "center" } },
    { text: "2〜3時間", options: { align: "center" } },
    { text: "20〜30万円", options: { align: "center" } }
  ],
  [
    { text: "業種別AI活用ワークショップ", options: { bold: true, align: "left" } },
    { text: "業界特化の活用事例紹介・体験", options: { align: "left" } },
    { text: "現場担当者", options: { align: "center" } },
    { text: "1日", options: { align: "center" } },
    { text: "40〜60万円", options: { align: "center" } }
  ],
  [
    { text: "プロンプトエンジニアリング研修", options: { bold: true, align: "left" } },
    { text: "効果的なAI活用のためのスキル習得", options: { align: "left" } },
    { text: "推進担当者", options: { align: "center" } },
    { text: "1〜2日", options: { align: "center" } },
    { text: "50〜80万円", options: { align: "center" } }
  ],
  [
    { text: "Cursor/AI Coding研修", options: { bold: true, align: "left" } },
    { text: "AIコーディングツール活用研修", options: { align: "left" } },
    { text: "エンジニア", options: { align: "center" } },
    { text: "1日", options: { align: "center" } },
    { text: "50〜80万円", options: { align: "center" } }
  ]
];

s3.addTable(training_rows, {
  x: 0.4, y: 1.55, w: 9.2, h: 2.8,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.4, 3.0, 1.4, 1.2, 1.2]
});

s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.45, w: 9.2, h: 0.85,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s3.addText("ゴール: 生成AIへの理解向上 / 組織の意識改革 / 活用アイデア創出", {
  x: 0.6, y: 4.6, w: 8.8, h: 0.5,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 4. PoCプラン ==========
let s4 = pres.addSlide();
addHeader(s4, "PoCプラン（仮）");

s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s4.addText("対象: まずAIを試したい企業（何に使えるか整理したい / 実際に動くもので検証したい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// 2メニューカード（横に広く）
const pocMenus = [
  {
    num: "①",
    name: "活用設計",
    type: "コンサルティング",
    items: ["業務棚卸し・可視化", "ユースケース設計", "ROI分析・効果試算", "ロードマップ策定"],
    price: "50〜200万円",
    period: "1〜4週間"
  },
  {
    num: "②",
    name: "PoC開発",
    type: "エンジニアリング",
    items: ["RAGチャットボット", "業務自動化（n8n）", "AIエージェント", "カスタマーサポートAI"],
    price: "150〜500万円",
    period: "4〜10週間"
  }
];

pocMenus.forEach((menu, i) => {
  const x = 0.4 + i * 4.6;
  // カード背景
  s4.addShape(pres.ShapeType.rect, {
    x: x, y: 1.55, w: 4.4, h: 2.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s4.addShape(pres.ShapeType.rect, {
    x: x, y: 1.55, w: 4.4, h: 0.08, fill: { color: C.main }
  });
  // サービス種別ラベル
  s4.addText(menu.type, {
    x: x + 0.2, y: 1.65, w: 2.0, h: 0.25,
    fontSize: 9, color: C.sub, fontFace: F
  });
  // メニュー番号・名前
  s4.addText(`${menu.num} ${menu.name}`, {
    x: x + 0.2, y: 1.85, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: C.main, fontFace: F
  });
  // 区切り線
  s4.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 2.3, w: 4.0, h: 0.015, fill: { color: C.border }
  });
  // 内容リスト
  const itemText = menu.items.map(item => `• ${item}`).join("\n");
  s4.addText(itemText, {
    x: x + 0.2, y: 2.4, w: 4.0, h: 1.0,
    fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
  });
  // 価格・期間
  s4.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 3.45, w: 4.0, h: 0.5,
    fill: { color: C.light }
  });
  s4.addText(`${menu.price}　/　${menu.period}`, {
    x: x + 0.2, y: 3.52, w: 4.0, h: 0.4,
    fontSize: 12, bold: true, color: C.main, fontFace: F, align: "center"
  });
});

// ゴール
s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.1,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s4.addText("ゴール", {
  x: 0.6, y: 4.3, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s4.addText("✓  活用方針の明確化・経営層への説明材料　　✓  実現性・効果の検証　　✓  本番導入の判断材料", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.45,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 5. 本番実装プラン ==========
let s5 = pres.addSlide();
addHeader(s5, "本番実装プラン（仮）");

s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s5.addText("対象: 本格導入・運用したい企業（本番システムを構築したい / 継続運用したい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// 2メニューカード（横に広く）
const prodMenus = [
  {
    num: "①",
    name: "本番システム開発",
    type: "エンジニアリング",
    items: ["PoC→本番環境への移行", "セキュリティ対応", "既存システム連携", "運用設計・構築"],
    price: "500〜2000万円",
    period: "2〜6ヶ月"
  },
  {
    num: "②",
    name: "運用・SaaS提供",
    type: "マネージドサービス",
    items: ["マネージド環境提供（Dify/n8n）", "運用保守・監視", "定着支援・改善提案", "技術移転・内製化支援"],
    price: "月額10〜80万円",
    period: "継続契約"
  }
];

prodMenus.forEach((menu, i) => {
  const x = 0.4 + i * 4.6;
  // カード背景
  s5.addShape(pres.ShapeType.rect, {
    x: x, y: 1.55, w: 4.4, h: 2.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s5.addShape(pres.ShapeType.rect, {
    x: x, y: 1.55, w: 4.4, h: 0.08, fill: { color: C.gold }
  });
  // サービス種別ラベル
  s5.addText(menu.type, {
    x: x + 0.2, y: 1.65, w: 2.0, h: 0.25,
    fontSize: 9, color: C.sub, fontFace: F
  });
  // メニュー番号・名前
  s5.addText(`${menu.num} ${menu.name}`, {
    x: x + 0.2, y: 1.85, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: C.main, fontFace: F
  });
  // 区切り線
  s5.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 2.3, w: 4.0, h: 0.015, fill: { color: C.border }
  });
  // 内容リスト
  const itemText = menu.items.map(item => `• ${item}`).join("\n");
  s5.addText(itemText, {
    x: x + 0.2, y: 2.4, w: 4.0, h: 1.0,
    fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
  });
  // 価格・期間
  s5.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 3.45, w: 4.0, h: 0.5,
    fill: { color: C.light }
  });
  s5.addText(`${menu.price}　/　${menu.period}`, {
    x: x + 0.2, y: 3.52, w: 4.0, h: 0.4,
    fontSize: 12, bold: true, color: C.main, fontFace: F, align: "center"
  });
});

// ゴール
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.1,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("ゴール", {
  x: 0.6, y: 4.3, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s5.addText("✓  本番稼働するAIシステムの構築　　✓  安定稼働・運用負荷の軽減　　✓  継続的な改善・進化", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.45,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 6. 開発伴走サービス ==========
let s6 = pres.addSlide();
addHeader(s6, "開発伴走サービス（仮）");

s6.addText("全パッケージを通じて、プロダクト・サービス開発を継続的に支援する伴走型サービス", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

const companionServices = [
  {
    title: "CX起点でのプロダクト・\nサービス開発伴走",
    desc: "顧客体験（CX）を起点に、プロダクト・サービスの企画から開発までを伴走支援。ユーザー視点でのサービス設計を重視。"
  },
  {
    title: "サービス開発伴走",
    desc: "新規サービス・プロダクトの開発プロセス全体を伴走支援。要件定義から実装、リリースまで一貫してサポート。"
  }
];

companionServices.forEach((svc, i) => {
  const x = 0.5 + i * 4.6;
  s6.addShape(pres.ShapeType.rect, {
    x: x, y: 1.4, w: 4.4, h: 2.2,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s6.addShape(pres.ShapeType.rect, {
    x: x, y: 1.4, w: 4.4, h: 0.08, fill: { color: C.orange }
  });
  s6.addText(`0${i + 1}`, {
    x: x + 0.2, y: 1.6, w: 0.6, h: 0.4,
    fontSize: 22, bold: true, color: C.orange, fontFace: F
  });
  s6.addText(svc.title, {
    x: x + 0.2, y: 2.0, w: 4.0, h: 0.7,
    fontSize: 13, bold: true, color: C.text, fontFace: F
  });
  s6.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 2.7, w: 4.0, h: 0.015, fill: { color: C.border }
  });
  s6.addText(svc.desc, {
    x: x + 0.2, y: 2.8, w: 4.0, h: 0.7,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.8, w: 9.2, h: 1.4,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s6.addText("提供価値", {
  x: 0.6, y: 3.9, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.orange, fontFace: F
});
s6.addText("✓  継続的な伴走による品質担保　　✓  顧客視点での開発推進　　✓  自走化に向けたナレッジ移転", {
  x: 0.6, y: 4.25, w: 8.8, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});
s6.addText("※ 詳細な支援体制・期間・費用は案件に応じて個別相談", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F
});

// ========== 7. 活用ツール・技術 ==========
let s7 = pres.addSlide();
addHeader(s7, "活用ツール・技術");

s7.addText("お客様の要件に応じて最適なAIツールを選定・組み合わせ。スクラッチ開発からツール活用まで柔軟に対応。", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

// 活用ツール例ラベル
s7.addText("※ 以下は活用ツールの一例です", {
  x: 0.4, y: 1.25, w: 9.2, h: 0.3,
  fontSize: 14, bold: true, color: C.main, fontFace: F, align: "center"
});

// 3カラムカード - ツール紹介
const tools = [
  {
    name: "Dify",
    desc: "ノーコードAIアプリ\n開発プラットフォーム",
    features: ["RAGチャットボット構築", "AIワークフロー設計", "プロンプト管理"]
  },
  {
    name: "n8n",
    desc: "AIワークフロー自動化",
    features: ["業務プロセス自動化", "外部システム連携", "AIエージェント実行"]
  },
  {
    name: "Copilot Studio",
    desc: "Microsoft環境での\nAIエージェント開発",
    features: ["Teams/M365連携", "社内データ活用", "ローコード開発"]
  }
];

tools.forEach((tool, i) => {
  const x = 0.4 + i * 3.1;
  // カード背景
  s7.addShape(pres.ShapeType.rect, {
    x: x, y: 1.55, w: 2.95, h: 2.4,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s7.addShape(pres.ShapeType.rect, {
    x: x, y: 1.55, w: 2.95, h: 0.08, fill: { color: C.main }
  });
  // ツール名
  s7.addText(tool.name, {
    x: x + 0.15, y: 1.7, w: 2.65, h: 0.4,
    fontSize: 16, bold: true, color: C.main, fontFace: F
  });
  // 説明
  s7.addText(tool.desc, {
    x: x + 0.15, y: 2.1, w: 2.65, h: 0.55,
    fontSize: 10, color: C.sub, fontFace: F
  });
  // 区切り線
  s7.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 2.65, w: 2.65, h: 0.015, fill: { color: C.border }
  });
  // 特徴リスト
  const featureText = tool.features.map(f => `• ${f}`).join("\n");
  s7.addText(featureText, {
    x: x + 0.15, y: 2.75, w: 2.65, h: 1.0,
    fontSize: 9, color: C.text, fontFace: F, lineSpacing: 16
  });
});

// 補足ボックス
s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.15, w: 9.2, h: 1.1,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s7.addText("柔軟な開発・提供形態", {
  x: 0.6, y: 4.25, w: 3, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s7.addText("✓  紹介ツール以外にも、お客様環境・要件に最適な最新AIツールを選定・組み合わせ\n✓  スクラッチ開発、ツール活用、SaaS提供など柔軟な提供形態に対応", {
  x: 0.6, y: 4.55, w: 8.8, h: 0.6,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
});

// ========== 8. IT導入補助金 ==========
let s8 = pres.addSlide();
addHeader(s8, "IT導入補助金活用（検討中）");

const subsidyRows = [
  [
    { text: "パッケージ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助金活用可能サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助対象", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助率", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "PoCプラン（仮）", options: { bold: true, align: "center" } },
    { text: "Dify/n8nを活用したPoC開発", options: { align: "left" } },
    { text: "ツール利用料、導入費用", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "本番実装プラン（仮）", options: { bold: true, align: "center" } },
    { text: "本番開発、SaaS月額利用（Dify/n8n）", options: { align: "left" } },
    { text: "導入費用、月額利用料", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ]
];

s8.addTable(subsidyRows, {
  x: 0.4, y: 1.0, w: 9.2, h: 1.5,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 3.2, 2.3, 1.5]
});

s8.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 2.7, w: 9.2, h: 2.4,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1.5 }
});
s8.addText("お客様メリット", {
  x: 0.6, y: 2.85, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.orange, fontFace: F
});
s8.addText("導入コストの 1/2〜2/3 を補助金でカバー可能", {
  x: 0.6, y: 3.3, w: 8.8, h: 0.5,
  fontSize: 20, bold: true, color: C.text, fontFace: F
});
s8.addText("例1: 300万円のPoC費用 → 実質負担 100〜150万円", {
  x: 0.6, y: 4.0, w: 8.8, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});
s8.addText("例2: 月額20万円のSaaS利用 → 実質負担 7〜10万円/月（初年度）", {
  x: 0.6, y: 4.4, w: 8.8, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});
s8.addText("※ Dify, n8n は IT導入補助金登録済ツール", {
  x: 0.4, y: 5.2, w: 9.2, h: 0.3,
  fontSize: 10, color: C.main, fontFace: F
});

// ========== 9. 最終スライド ==========
let s9 = pres.addSlide();
s9.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s9.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s9.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// 出力
const outDir = path.dirname(__filename);
const outPath = path.join(outDir, "AIサービスパッケージv3_NTTDXPN.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => console.error(err));
