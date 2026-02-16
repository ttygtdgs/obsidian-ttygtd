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
s1.addText("お客様の成熟度に応じた3つのパッケージ", {
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

// 3カラムカード
const packages = [
  {
    num: "01",
    name: "AI活用診断",
    target: "AI活用を始めたい企業",
    services: ["生成AI活用研修", "ユースケース設計", "業務棚卸し・ROI分析"],
    price: "30〜200万円",
    period: "数日〜1ヶ月",
    color: C.accent
  },
  {
    num: "02",
    name: "AI導入支援",
    target: "本格導入を目指す企業",
    services: ["PoC開発支援", "本番システム開発", "セキュリティ対応"],
    price: "150〜2000万円",
    period: "1〜6ヶ月",
    color: C.main
  },
  {
    num: "03",
    name: "AI内製化支援",
    target: "運用・自走を目指す企業",
    services: ["SaaS提供（Dify/n8n）", "運用保守・定着支援", "技術移転・研修"],
    price: "月額10〜80万円",
    period: "継続契約",
    color: C.gold
  }
];

packages.forEach((pkg, i) => {
  const x = 0.4 + i * 3.15;
  // カード背景
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.0, w: 3.0, h: 3.8,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.0, w: 3.0, h: 0.1, fill: { color: pkg.color }
  });
  // 番号
  s2.addText(pkg.num, {
    x: x + 0.15, y: 1.2, w: 0.6, h: 0.4,
    fontSize: 20, bold: true, color: pkg.color, fontFace: F
  });
  // パッケージ名
  s2.addText(pkg.name, {
    x: x + 0.15, y: 1.6, w: 2.7, h: 0.45,
    fontSize: 16, bold: true, color: C.text, fontFace: F
  });
  // 対象
  s2.addText(pkg.target, {
    x: x + 0.15, y: 2.05, w: 2.7, h: 0.35,
    fontSize: 10, color: C.sub, fontFace: F
  });
  // 区切り線
  s2.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 2.45, w: 2.7, h: 0.015, fill: { color: C.border }
  });
  // サービス一覧
  const serviceText = pkg.services.map(s => `• ${s}`).join("\n");
  s2.addText(serviceText, {
    x: x + 0.15, y: 2.55, w: 2.7, h: 1.1,
    fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
  });
  // 価格・期間
  s2.addShape(pres.ShapeType.rect, {
    x: x + 0.15, y: 3.75, w: 2.7, h: 0.9,
    fill: { color: C.light }
  });
  s2.addText(pkg.price, {
    x: x + 0.15, y: 3.85, w: 2.7, h: 0.35,
    fontSize: 12, bold: true, color: C.main, fontFace: F, align: "center"
  });
  s2.addText(pkg.period, {
    x: x + 0.15, y: 4.2, w: 2.7, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F, align: "center"
  });
});

// オプション表示
s2.addText("＋ オプション：開発伴走サービス（全パッケージ横断）", {
  x: 0.4, y: 5.0, w: 9.2, h: 0.35,
  fontSize: 11, color: C.sub, fontFace: F
});

// ========== 3. AI活用診断 ==========
let s3 = pres.addSlide();
addHeader(s3, "AI活用診断");

// ターゲット
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.6,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s3.addText("対象: AI活用を始めたい企業（何ができるか分からない / 使い道を探している）", {
  x: 0.6, y: 1.0, w: 8.8, h: 0.4,
  fontSize: 12, color: C.main, fontFace: F
});

// サービス一覧
const diag_rows = [
  [
    { text: "サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "期間", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "価格帯", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "生成AI活用研修", options: { bold: true, align: "left" } },
    { text: "基礎研修、経営層セミナー、ワークショップ", options: { align: "left" } },
    { text: "半日〜2日", options: { align: "center" } },
    { text: "20〜80万円", options: { align: "center" } }
  ],
  [
    { text: "ユースケース設計", options: { bold: true, align: "left" } },
    { text: "業務棚卸し、AI適用領域特定、アイデア発散", options: { align: "left" } },
    { text: "1〜4週間", options: { align: "center" } },
    { text: "50〜200万円", options: { align: "center" } }
  ],
  [
    { text: "効果試算・ロードマップ", options: { bold: true, align: "left" } },
    { text: "ROI分析、段階的導入計画の立案", options: { align: "left" } },
    { text: "1〜3週間", options: { align: "center" } },
    { text: "80〜200万円", options: { align: "center" } }
  ]
];

s3.addTable(diag_rows, {
  x: 0.4, y: 1.65, w: 9.2, h: 1.8,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 4.0, 1.5, 1.5]
});

// ゴール
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.6, w: 9.2, h: 1.5,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.6, w: 0.08, h: 1.5, fill: { color: C.accent }
});
s3.addText("このパッケージのゴール", {
  x: 0.65, y: 3.7, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s3.addText("✓  生成AIへの理解向上・組織の意識改革\n✓  自社に適したAI活用方針の明確化\n✓  経営層への説明材料・投資判断の根拠獲得", {
  x: 0.65, y: 4.1, w: 8.7, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 4. AI導入支援 ==========
let s4 = pres.addSlide();
addHeader(s4, "AI導入支援");

// ターゲット
s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.6,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s4.addText("対象: 本格導入を目指す企業（PoCを試したい / 本番導入したい）", {
  x: 0.6, y: 1.0, w: 8.8, h: 0.4,
  fontSize: 12, color: C.main, fontFace: F
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
    { text: "RAGチャットボット、業務自動化、AIエージェント等", options: { align: "left" } },
    { text: "4〜10週間", options: { align: "center" } },
    { text: "150〜500万円", options: { align: "center" } }
  ],
  [
    { text: "本番システム開発", options: { bold: true, align: "left" } },
    { text: "PoC→本番移行、既存システム連携", options: { align: "left" } },
    { text: "2〜6ヶ月", options: { align: "center" } },
    { text: "500〜2000万円", options: { align: "center" } }
  ],
  [
    { text: "セキュリティ対応", options: { bold: true, align: "left" } },
    { text: "プライベートLLM環境構築、データ保護対策", options: { align: "left" } },
    { text: "2〜4週間", options: { align: "center" } },
    { text: "150〜300万円", options: { align: "center" } }
  ]
];

s4.addTable(impl_rows, {
  x: 0.4, y: 1.65, w: 9.2, h: 1.8,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 4.0, 1.5, 1.5]
});

// ゴール
s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.6, w: 9.2, h: 1.5,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s4.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.6, w: 0.08, h: 1.5, fill: { color: C.main }
});
s4.addText("このパッケージのゴール", {
  x: 0.65, y: 3.7, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s4.addText("✓  実現性・効果の検証（PoC）\n✓  本番稼働するAIシステムの構築\n✓  課題・リスクの早期発見と対応", {
  x: 0.65, y: 4.1, w: 8.7, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 5. AI内製化支援 ==========
let s5 = pres.addSlide();
addHeader(s5, "AI内製化支援");

// ターゲット
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.9, w: 9.2, h: 0.6,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("対象: 運用・自走を目指す企業（継続運用したい / 自社でも運用できるようにしたい）", {
  x: 0.6, y: 1.0, w: 8.8, h: 0.4,
  fontSize: 12, color: C.main, fontFace: F
});

// サービス一覧
const scale_rows = [
  [
    { text: "サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "提供形態", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "月額", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "SaaS提供", options: { bold: true, align: "left" } },
    { text: "Dify/n8nマネージド環境（IT導入補助金対応）", options: { align: "left" } },
    { text: "サブスクリプション", options: { align: "center" } },
    { text: "5〜30万円/月", options: { align: "center" } }
  ],
  [
    { text: "運用保守・定着支援", options: { bold: true, align: "left" } },
    { text: "監視、障害対応、定期レビュー、改善提案", options: { align: "left" } },
    { text: "保守・顧問契約", options: { align: "center" } },
    { text: "20〜80万円/月", options: { align: "center" } }
  ],
  [
    { text: "内製化支援・技術移転", options: { bold: true, align: "left" } },
    { text: "ハンズオン研修、技術ドキュメント整備", options: { align: "left" } },
    { text: "プロジェクト型", options: { align: "center" } },
    { text: "300〜600万円", options: { align: "center" } }
  ]
];

s5.addTable(scale_rows, {
  x: 0.4, y: 1.65, w: 9.2, h: 1.8,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 4.0, 1.7, 1.3]
});

// ゴール
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.6, w: 9.2, h: 1.5,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.6, w: 0.08, h: 1.5, fill: { color: C.gold }
});
s5.addText("このパッケージのゴール", {
  x: 0.65, y: 3.7, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s5.addText("✓  安定稼働・運用負荷の軽減\n✓  自社運用体制の構築・自走化\n✓  継続的な改善・進化", {
  x: 0.65, y: 4.1, w: 8.7, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 6. 開発伴走サービス ==========
let s6 = pres.addSlide();
addHeader(s6, "オプション：開発伴走サービス");

s6.addText("全パッケージを通じて、プロダクト・サービス開発を継続的に支援する伴走型サービス", {
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
  s6.addShape(pres.ShapeType.rect, {
    x: x, y: 1.4, w: 4.4, h: 2.2,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s6.addShape(pres.ShapeType.rect, {
    x: x, y: 1.4, w: 4.4, h: 0.08, fill: { color: C.orange }
  });
  // 番号
  s6.addText(`0${i + 1}`, {
    x: x + 0.2, y: 1.6, w: 0.6, h: 0.4,
    fontSize: 22, bold: true, color: C.orange, fontFace: F
  });
  // タイトル
  s6.addText(svc.title, {
    x: x + 0.2, y: 2.0, w: 4.0, h: 0.7,
    fontSize: 13, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s6.addShape(pres.ShapeType.rect, {
    x: x + 0.2, y: 2.7, w: 4.0, h: 0.015, fill: { color: C.border }
  });
  // 説明
  s6.addText(svc.desc, {
    x: x + 0.2, y: 2.8, w: 4.0, h: 0.7,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// 提供価値ボックス
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

// ========== 7. IT導入補助金 ==========
let s7 = pres.addSlide();
addHeader(s7, "IT導入補助金活用メリット");

const subsidyRows = [
  [
    { text: "パッケージ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助金活用可能サービス", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助対象", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "補助率", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "AI導入支援", options: { bold: true, align: "center" } },
    { text: "Dify/n8nを活用したPoC・本番開発", options: { align: "left" } },
    { text: "ツール利用料、導入費用", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "AI内製化支援", options: { bold: true, align: "center" } },
    { text: "SaaS月額利用（Dify/n8n）", options: { align: "left" } },
    { text: "月額利用料（初年度）", options: { align: "center" } },
    { text: "1/2〜2/3", options: { align: "center", bold: true, color: C.main } }
  ]
];

s7.addTable(subsidyRows, {
  x: 0.4, y: 1.0, w: 9.2, h: 1.5,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.8, 3.2, 2.5, 1.7]
});

// メリットボックス
s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 2.7, w: 9.2, h: 2.4,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1.5 }
});
s7.addText("お客様メリット", {
  x: 0.6, y: 2.85, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.orange, fontFace: F
});
s7.addText("導入コストの 1/2〜2/3 を補助金でカバー可能", {
  x: 0.6, y: 3.3, w: 8.8, h: 0.5,
  fontSize: 20, bold: true, color: C.text, fontFace: F
});

// 具体例
s7.addText("例1: 300万円のPoC費用 → 実質負担 100〜150万円", {
  x: 0.6, y: 4.0, w: 8.8, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});
s7.addText("例2: 月額20万円のSaaS利用 → 実質負担 7〜10万円/月（初年度）", {
  x: 0.6, y: 4.4, w: 8.8, h: 0.35,
  fontSize: 12, color: C.sub, fontFace: F
});

// 登録済み表示
s7.addText("※ Dify, n8n は IT導入補助金登録済ツール", {
  x: 0.4, y: 5.2, w: 9.2, h: 0.3,
  fontSize: 10, color: C.main, fontFace: F
});

// ========== 8. 最終スライド ==========
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
const outDir = path.dirname(__filename);
const outPath = path.join(outDir, "AIサービスパッケージ_NTTDXPN.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => console.error(err));
