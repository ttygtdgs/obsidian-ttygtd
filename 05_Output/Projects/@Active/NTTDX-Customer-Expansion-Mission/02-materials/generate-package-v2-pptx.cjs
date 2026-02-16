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
s1.addText("お客様のニーズに応じた5つのパッケージ", {
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

// 5パッケージ情報
const packages = [
  { num: "01", name: "AI研修（仮）", target: "AIリテラシーを\n高めたい", price: "20〜80万円", color: C.accent },
  { num: "02", name: "AI活用診断（仮）", target: "活用の方向性を\n探りたい", price: "50〜200万円", color: "4ECDC4" },
  { num: "03", name: "AI導入支援（仮）", target: "システムを\n構築したい", price: "150〜2000万円", color: C.main },
  { num: "04", name: "AI内製化支援（仮）", target: "自社で運用・\n自走したい", price: "月額10〜80万円", color: C.gold },
  { num: "05", name: "開発伴走サービス（仮）", target: "全パッケージ\n横断", price: "個別相談", color: C.orange }
];

packages.forEach((pkg, i) => {
  const x = 0.3 + i * 1.9;
  // カード背景
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.0, w: 1.8, h: 3.6,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.0, w: 1.8, h: 0.1, fill: { color: pkg.color }
  });
  // 番号
  s2.addText(pkg.num, {
    x: x + 0.1, y: 1.15, w: 0.5, h: 0.35,
    fontSize: 16, bold: true, color: pkg.color, fontFace: F
  });
  // パッケージ名
  s2.addText(pkg.name, {
    x: x + 0.1, y: 1.5, w: 1.6, h: 0.6,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s2.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 2.15, w: 1.6, h: 0.015, fill: { color: C.border }
  });
  // 対象
  s2.addText(pkg.target, {
    x: x + 0.1, y: 2.25, w: 1.6, h: 0.8,
    fontSize: 9, color: C.sub, fontFace: F
  });
  // 価格
  s2.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 3.15, w: 1.6, h: 0.5,
    fill: { color: C.light }
  });
  s2.addText(pkg.price, {
    x: x + 0.1, y: 3.25, w: 1.6, h: 0.35,
    fontSize: 9, bold: true, color: C.main, fontFace: F, align: "center"
  });
});

// フロー矢印
s2.addText("研修で学ぶ → 方向性を探る → システム構築 → 自走化", {
  x: 0.4, y: 4.8, w: 9.2, h: 0.4,
  fontSize: 11, color: C.sub, fontFace: F, align: "center"
});

// ========== 2.5 提供形態オプション ==========
let s2b = pres.addSlide();
addHeader(s2b, "提供形態オプション");

s2b.addText("AI導入支援・AI内製化支援パッケージでは、以下の2つの提供形態から選択可能", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

// 2カラムカード - 提供型
const optionX1 = 0.5;
s2b.addShape(pres.ShapeType.rect, {
  x: optionX1, y: 1.4, w: 4.4, h: 2.8,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s2b.addShape(pres.ShapeType.rect, {
  x: optionX1, y: 1.4, w: 4.4, h: 0.08, fill: { color: C.main }
});
s2b.addText("提供型", {
  x: optionX1 + 0.2, y: 1.6, w: 4.0, h: 0.45,
  fontSize: 18, bold: true, color: C.main, fontFace: F
});
s2b.addText("我々が開発・提供", {
  x: optionX1 + 0.2, y: 2.05, w: 4.0, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});
s2b.addShape(pres.ShapeType.rect, {
  x: optionX1 + 0.2, y: 2.45, w: 4.0, h: 0.015, fill: { color: C.border }
});
s2b.addText("• Dify/n8n SaaS提供\n• PoC・本番システム開発\n• 運用保守サービス", {
  x: optionX1 + 0.2, y: 2.55, w: 4.0, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
});
s2b.addShape(pres.ShapeType.rect, {
  x: optionX1 + 0.2, y: 3.5, w: 4.0, h: 0.55,
  fill: { color: "EDF7FA" }
});
s2b.addText("早く導入したい / 運用も任せたい", {
  x: optionX1 + 0.3, y: 3.6, w: 3.8, h: 0.4,
  fontSize: 10, color: C.main, fontFace: F
});

// 2カラムカード - 内製化型
const optionX2 = 5.1;
s2b.addShape(pres.ShapeType.rect, {
  x: optionX2, y: 1.4, w: 4.4, h: 2.8,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s2b.addShape(pres.ShapeType.rect, {
  x: optionX2, y: 1.4, w: 4.4, h: 0.08, fill: { color: C.gold }
});
s2b.addText("内製化型", {
  x: optionX2 + 0.2, y: 1.6, w: 4.0, h: 0.45,
  fontSize: 18, bold: true, color: C.gold, fontFace: F
});
s2b.addText("顧客環境で開発支援", {
  x: optionX2 + 0.2, y: 2.05, w: 4.0, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});
s2b.addShape(pres.ShapeType.rect, {
  x: optionX2 + 0.2, y: 2.45, w: 4.0, h: 0.015, fill: { color: C.border }
});
s2b.addText("• Copilot等を活用した開発支援\n• 技術移転・ハンズオン研修\n• 内製化プログラム", {
  x: optionX2 + 0.2, y: 2.55, w: 4.0, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
});
s2b.addShape(pres.ShapeType.rect, {
  x: optionX2 + 0.2, y: 3.5, w: 4.0, h: 0.55,
  fill: { color: "FFF8E1" }
});
s2b.addText("自社で管理したい / ノウハウを蓄積したい", {
  x: optionX2 + 0.3, y: 3.6, w: 3.8, h: 0.4,
  fontSize: 10, color: C.orange, fontFace: F
});

// 注釈
s2b.addText("※ お客様の状況・ご要望に応じて最適な形態をご提案します", {
  x: 0.4, y: 4.5, w: 9.2, h: 0.35,
  fontSize: 10, color: C.sub, fontFace: F
});

// ========== 3. AI研修 ==========
let s3 = pres.addSlide();
addHeader(s3, "AI研修（仮）");

// ターゲット
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "E0F7FA" },
  line: { color: C.accent, pt: 1 }
});
s3.addText("対象: AIリテラシーを高めたい企業（まずはAIを理解したい / 社員の意識を変えたい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// サービス一覧
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

// ゴール
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.45, w: 9.2, h: 0.85,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s3.addText("ゴール: 生成AIへの理解向上 / 組織の意識改革 / 活用アイデア創出", {
  x: 0.6, y: 4.6, w: 8.8, h: 0.5,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 4. ディスカバリー ==========
let s4 = pres.addSlide();
addHeader(s4, "AI活用診断（仮）");

// ターゲット
s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "E0F7F4" },
  line: { color: "4ECDC4", pt: 1 }
});
s4.addText("対象: AI活用の方向性を探りたい企業（使い道を整理したい / 投資判断の材料が欲しい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// サービス一覧
const discovery_rows = [
  [
    { text: "サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "成果物", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "業務棚卸しコンサルティング", options: { bold: true, align: "left" } },
    { text: "現行業務の可視化・AI適用領域特定", options: { align: "left" } },
    { text: "業務フロー図、AI適用候補リスト", options: { align: "left", fontSize: 9 } },
    { text: "2〜4週間", options: { align: "center" } },
    { text: "100〜200万円", options: { align: "center" } }
  ],
  [
    { text: "ユースケース設計WS", options: { bold: true, align: "left" } },
    { text: "アイデア発散・優先順位付け", options: { align: "left" } },
    { text: "ユースケース一覧、優先度マトリクス", options: { align: "left", fontSize: 9 } },
    { text: "1〜2日", options: { align: "center" } },
    { text: "50〜80万円", options: { align: "center" } }
  ],
  [
    { text: "効果試算・ROI分析", options: { bold: true, align: "left" } },
    { text: "導入効果の定量化", options: { align: "left" } },
    { text: "効果試算シート、投資対効果レポート", options: { align: "left", fontSize: 9 } },
    { text: "1〜2週間", options: { align: "center" } },
    { text: "80〜150万円", options: { align: "center" } }
  ],
  [
    { text: "AI活用ロードマップ策定", options: { bold: true, align: "left" } },
    { text: "段階的導入計画の立案", options: { align: "left" } },
    { text: "ロードマップ資料、実行計画書", options: { align: "left", fontSize: 9 } },
    { text: "2〜3週間", options: { align: "center" } },
    { text: "100〜200万円", options: { align: "center" } }
  ]
];

s4.addTable(discovery_rows, {
  x: 0.4, y: 1.55, w: 9.2, h: 2.3,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 2.3, 2.5, 1.1, 1.1]
});

// ゴール
s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.0, w: 9.2, h: 1.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s4.addText("ゴール", {
  x: 0.6, y: 4.1, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s4.addText("✓  自社に適したAI活用方針の明確化　　✓  経営層への説明材料　　✓  投資判断の根拠獲得", {
  x: 0.6, y: 4.45, w: 8.8, h: 0.5,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 5. AI導入支援 ==========
let s5 = pres.addSlide();
addHeader(s5, "AI導入支援（仮）");

// ターゲット
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("対象: AIシステムを構築したい企業（PoCを試したい / 本番導入したい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// サービス一覧
const impl_rows = [
  [
    { text: "サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "PoC開発支援", options: { bold: true, align: "left" } },
    { text: "RAGチャットボット、業務自動化（n8n）、AIエージェント等", options: { align: "left" } },
    { text: "4〜10週間", options: { align: "center" } },
    { text: "150〜500万円", options: { align: "center" } }
  ],
  [
    { text: "本番システム開発", options: { bold: true, align: "left" } },
    { text: "PoC→本番環境への移行・開発、既存システム連携", options: { align: "left" } },
    { text: "2〜6ヶ月", options: { align: "center" } },
    { text: "500〜2000万円", options: { align: "center" } }
  ],
  [
    { text: "セキュリティ対応", options: { bold: true, align: "left" } },
    { text: "プライベートLLM環境構築、データ保護対策", options: { align: "left" } },
    { text: "2〜4週間", options: { align: "center" } },
    { text: "150〜300万円", options: { align: "center" } }
  ],
  [
    { text: "既存システム連携開発", options: { bold: true, align: "left" } },
    { text: "基幹システム等とのAPI連携開発", options: { align: "left" } },
    { text: "1〜3ヶ月", options: { align: "center" } },
    { text: "300〜800万円", options: { align: "center" } }
  ]
];

s5.addTable(impl_rows, {
  x: 0.4, y: 1.55, w: 9.2, h: 2.3,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 4.5, 1.3, 1.2]
});

// ゴール
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.0, w: 9.2, h: 1.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("ゴール", {
  x: 0.6, y: 4.1, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s5.addText("✓  実現性・効果の検証（PoC）　　✓  本番稼働するAIシステムの構築　　✓  課題の早期発見", {
  x: 0.6, y: 4.45, w: 8.8, h: 0.5,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 6. AI内製化支援 ==========
let s6 = pres.addSlide();
addHeader(s6, "AI内製化支援（仮）");

// ターゲット
s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.55,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s6.addText("対象: 自社で運用・自走したい企業（継続運用したい / 自社チームで回せるようにしたい）", {
  x: 0.6, y: 0.98, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// サービス一覧
const enable_rows = [
  [
    { text: "サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "提供形態", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "SaaS提供（Dify/n8n）", options: { bold: true, align: "left" } },
    { text: "マネージド環境の月額提供（IT導入補助金対応）", options: { align: "left" } },
    { text: "サブスクリプション", options: { align: "center" } },
    { text: "5〜30万円/月", options: { align: "center" } }
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
    { text: "顧問契約", options: { align: "center" } },
    { text: "30〜80万円/月", options: { align: "center" } }
  ],
  [
    { text: "内製化支援プログラム", options: { bold: true, align: "left" } },
    { text: "技術移転・ハンズオン研修・ナレッジ移転", options: { align: "left" } },
    { text: "プロジェクト型", options: { align: "center" } },
    { text: "300〜600万円", options: { align: "center" } }
  ]
];

s6.addTable(enable_rows, {
  x: 0.4, y: 1.55, w: 9.2, h: 2.3,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 3.5, 1.8, 1.7]
});

// ゴール
s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.0, w: 9.2, h: 1.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s6.addText("ゴール", {
  x: 0.6, y: 4.1, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s6.addText("✓  安定稼働・運用負荷の軽減　　✓  自社運用体制の構築・自走化　　✓  継続的な改善・進化", {
  x: 0.6, y: 4.45, w: 8.8, h: 0.5,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 7. 開発伴走サービス ==========
let s7 = pres.addSlide();
addHeader(s7, "開発伴走サービス（仮）");

s7.addText("全パッケージを通じて、プロダクト・サービス開発を継続的に支援する伴走型サービス", {
  x: 0.4, y: 0.9, w: 9.2, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

// 2カラムカード
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
  // カード背景
  s7.addShape(pres.ShapeType.rect, {
    x: x, y: 1.4, w: 4.4, h: 2.2,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s7.addShape(pres.ShapeType.rect, {
    x: x, y: 1.4, w: 4.4, h: 0.08, fill: { color: C.orange }
  });
  // 番号
  s7.addText(`0${i + 1}`, {
    x: x + 0.2, y: 1.6, w: 0.6, h: 0.4,
    fontSize: 22, bold: true, color: C.orange, fontFace: F
  });
  // タイトル
  s7.addText(svc.title, {
    x: x + 0.2, y: 2.0, w: 4.0, h: 0.7,
    fontSize: 13, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s7.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 2.7, w: 4.0, h: 0.015, fill: { color: C.border }
  });
  // 説明
  s7.addText(svc.desc, {
    x: x + 0.2, y: 2.8, w: 4.0, h: 0.7,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// 提供価値ボックス
s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.8, w: 9.2, h: 1.4,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s7.addText("提供価値", {
  x: 0.6, y: 3.9, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.orange, fontFace: F
});
s7.addText("✓  継続的な伴走による品質担保　　✓  顧客視点での開発推進　　✓  自走化に向けたナレッジ移転", {
  x: 0.6, y: 4.25, w: 8.8, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});
s7.addText("※ 詳細な支援体制・期間・費用は案件に応じて個別相談", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F
});

// ========== 8. IT導入補助金 ==========
let s8 = pres.addSlide();
addHeader(s8, "IT導入補助金活用メリット");

const subsidyRows = [
  [
    { text: "パッケージ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助金活用可能サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助対象", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助率", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "AI導入支援（仮）", options: { bold: true, align: "center" } },
    { text: "Dify/n8nを活用したPoC・本番開発", options: { align: "left" } },
    { text: "ツール利用料、導入費用", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "AI内製化支援（仮）", options: { bold: true, align: "center" } },
    { text: "SaaS月額利用（Dify/n8n）", options: { align: "left" } },
    { text: "月額利用料（初年度）", options: { align: "center" } },
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

// メリットボックス
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

// 具体例
s8.addText("例1: 300万円のPoC費用 → 実質負担 100〜150万円", {
  x: 0.6, y: 4.0, w: 8.8, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});
s8.addText("例2: 月額20万円のSaaS利用 → 実質負担 7〜10万円/月（初年度）", {
  x: 0.6, y: 4.4, w: 8.8, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

// 登録済み表示
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
const outPath = path.join(outDir, "AIサービスパッケージv2_NTTDXPN.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => console.error(err));
