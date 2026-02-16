const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = "チャネル戦略：施策1（NTT東連携）& 施策2（Web強化）深堀り";
pres.author = "NTT DXパートナー";

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

// ========== 1. 表紙 ==========
let s1 = pres.addSlide();
s1.background = { path: `${assets}/bg-title.png` };
s1.addText("NTTDXパートナー AIチーム", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("チャネル戦略", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("施策1（NTT東連携）& 施策2（Web強化）深堀り", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年2月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== 2. 背景・目的 ==========
let s2 = pres.addSlide();
addHeader(s2, "背景・目的");

// 現状課題ボックス
s2.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 9.2, h: 1.6,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s2.addText("現状の課題", {
  x: 0.6, y: 1.05, w: 3, h: 0.3,
  fontSize: 13, bold: true, color: C.orange, fontFace: F
});
s2.addText(
  "•  チャネル管理が属人的: 紹介経路が個人の関係性に依存し、再現性がない\n" +
  "•  Web不在: AIチーム独自のWebページがなく、オーガニックな問い合わせ導線がゼロ\n" +
  "•  リード育成パイプラインなし: 見込み顧客の管理・ナーチャリングの仕組みがない\n" +
  "•  コンテンツ資産の不足: 事例紹介や技術発信が体系化されていない", {
  x: 0.6, y: 1.4, w: 8.8, h: 1.0,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
});

// 目的ボックス
s2.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 2.75, w: 9.2, h: 0.8,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s2.addText("チャネル戦略の目的", {
  x: 0.6, y: 2.85, w: 3, h: 0.3,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s2.addText("属人的な紹介を、管理可能・測定可能・スケーラブルなインバウンドエンジンに変える", {
  x: 0.6, y: 3.15, w: 8.8, h: 0.3,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});

// インバウンド主軸の理由テーブル
const reasonRows = [
  [
    { text: "観点", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "インバウンドが適する理由", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "NTTブランド", options: { bold: true, align: "center" } },
    { text: "親会社NTT東の信頼・知名度を活用でき、コールドアプローチが不要", options: { align: "left" } }
  ],
  [
    { text: "案件の性質", options: { bold: true, align: "center" } },
    { text: "生成AI導入は信頼ベースの意思決定。紹介経由の方が成約率が高い", options: { align: "left" } }
  ],
  [
    { text: "チーム規模", options: { bold: true, align: "center" } },
    { text: "少人数のため大量アウトバウンドは非効率。質の高いリードに集中すべき", options: { align: "left" } }
  ],
  [
    { text: "既存NW", options: { bold: true, align: "center" } },
    { text: "NTT東の支店網・事業部ネットワークが既に存在する", options: { align: "left" } }
  ]
];

s2.addTable(reasonRows, {
  x: 0.4, y: 3.75, w: 9.2, h: 1.7,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.8, 7.4]
});

// ========== 3. チャネル全体マップ ==========
let s3 = pres.addSlide();
addHeader(s3, "チャネル全体マップ");

// 施策1ブロック
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 4.35, h: 3.2,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 4.35, h: 0.08, fill: { color: C.main }
});
s3.addText("A. NTT東連携チャネル（施策1）", {
  x: 0.6, y: 1.1, w: 4.0, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});

const chA = [
  { id: "A1", name: "BI本部VP", desc: "面的展開・マーケット横展開型" },
  { id: "A2", name: "産業基盤ビジネス部", desc: "ロイヤルカスタマー経由（自治体/民需）" },
  { id: "A3", name: "支店ネットワーク", desc: "地域展開・研修→紹介" },
  { id: "A4", name: "社内他事業部", desc: "DXパートナー内他チーム・NTTグループ" }
];

chA.forEach((ch, i) => {
  const y = 1.55 + i * 0.6;
  s3.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: y, w: 3.95, h: 0.5,
    fill: { color: i < 2 ? "EDF7FA" : C.light },
    rectRadius: 0.05
  });
  s3.addText(ch.id, {
    x: 0.7, y: y + 0.05, w: 0.5, h: 0.35,
    fontSize: 11, bold: true, color: C.main, fontFace: F
  });
  s3.addText(ch.name, {
    x: 1.2, y: y + 0.05, w: 1.5, h: 0.35,
    fontSize: 10, bold: true, color: C.text, fontFace: F
  });
  s3.addText(ch.desc, {
    x: 2.7, y: y + 0.05, w: 1.8, h: 0.35,
    fontSize: 8, color: C.sub, fontFace: F
  });
});

// 施策2ブロック
s3.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 0.95, w: 4.35, h: 3.2,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s3.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 0.95, w: 4.35, h: 0.08, fill: { color: C.accent }
});
s3.addText("B. Webチャネル（施策2）", {
  x: 5.45, y: 1.1, w: 4.0, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});

const chB = [
  { id: "B1", name: "サービスページ", desc: "AIチーム紹介・問い合わせ導線" },
  { id: "B2", name: "コンテンツMK", desc: "事例・技術記事・ホワイトペーパー" },
  { id: "B3", name: "セミナー", desc: "ウェビナー・ワークショップ" },
  { id: "B4", name: "SNS・外部メディア", desc: "LinkedIn・note・Qiita" }
];

chB.forEach((ch, i) => {
  const y = 1.55 + i * 0.6;
  s3.addShape(pres.ShapeType.roundRect, {
    x: 5.45, y: y, w: 3.95, h: 0.5,
    fill: { color: i < 2 ? "E0F7FA" : C.light },
    rectRadius: 0.05
  });
  s3.addText(ch.id, {
    x: 5.55, y: y + 0.05, w: 0.5, h: 0.35,
    fontSize: 11, bold: true, color: C.main, fontFace: F
  });
  s3.addText(ch.name, {
    x: 6.05, y: y + 0.05, w: 1.5, h: 0.35,
    fontSize: 10, bold: true, color: C.text, fontFace: F
  });
  s3.addText(ch.desc, {
    x: 7.55, y: y + 0.05, w: 1.8, h: 0.35,
    fontSize: 8, color: C.sub, fontFace: F
  });
});

// チャネル間連携ボックス
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.35, w: 9.2, h: 1.0,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s3.addText("C. チャネル間連携（A+B連動）", {
  x: 0.6, y: 4.4, w: 4, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s3.addText(
  "C1. Webリード→NTT東コセル　　C2. NTT東紹介→Webコンテンツ活用　　C3. セミナー→支店横展開　　C4. 事例フライホイール", {
  x: 0.6, y: 4.75, w: 8.8, h: 0.4,
  fontSize: 10, color: C.text, fontFace: F
});

// ========== 4. 施策1概要（A1〜A4） ==========
let s4 = pres.addSlide();
addHeader(s4, "施策1: NTT東連携チャネル概要");

const channels = [
  {
    id: "A1", name: "BI本部VP",
    approach: "面的展開",
    items: ["共同サービスメニュー作成", "定期パイプラインレビュー", "成功事例共有", "1枚サマリー資料"],
    volume: "中", quality: "高", priority: "★★★",
    color: C.main
  },
  {
    id: "A2", name: "産業基盤\nビジネス部",
    approach: "アカウントベースド",
    items: ["ターゲット10-20社特定", "自治体/民需別切り口", "同行商談", "横展開プレイブック"],
    volume: "低", quality: "非常に高", priority: "★★★",
    color: C.main
  },
  {
    id: "A3", name: "支店\nネットワーク",
    approach: "Train the Trainer",
    items: ["AI案件発見チェックリスト", "支店向け勉強会(30分)", "紹介フォーム整備", "パイロット3支店"],
    volume: "高", quality: "中", priority: "★★",
    color: C.gold
  },
  {
    id: "A4", name: "社内\n他事業部",
    approach: "社内認知向上",
    items: ["社内Slack/Teams告知", "ランチ＆ラーン", "クロスセルテンプレート"],
    volume: "低", quality: "中〜高", priority: "★★",
    color: C.gold
  }
];

channels.forEach((ch, i) => {
  const x = 0.4 + i * 2.35;
  // カード背景
  s4.addShape(pres.ShapeType.rect, {
    x: x, y: 0.95, w: 2.2, h: 4.3,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s4.addShape(pres.ShapeType.rect, {
    x: x, y: 0.95, w: 2.2, h: 0.08, fill: { color: ch.color }
  });
  // ID
  s4.addText(ch.id, {
    x: x + 0.1, y: 1.1, w: 0.5, h: 0.35,
    fontSize: 16, bold: true, color: ch.color, fontFace: F
  });
  // 名前
  s4.addText(ch.name, {
    x: x + 0.1, y: 1.45, w: 2.0, h: 0.55,
    fontSize: 12, bold: true, color: C.text, fontFace: F
  });
  // アプローチ
  s4.addShape(pres.ShapeType.roundRect, {
    x: x + 0.1, y: 2.05, w: 2.0, h: 0.3,
    fill: { color: "EDF7FA" }, rectRadius: 0.03
  });
  s4.addText(ch.approach, {
    x: x + 0.1, y: 2.07, w: 2.0, h: 0.28,
    fontSize: 9, bold: true, color: C.main, fontFace: F, align: "center"
  });
  // 区切り線
  s4.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 2.45, w: 2.0, h: 0.015, fill: { color: C.border }
  });
  // 施策リスト
  const itemText = ch.items.map(item => `• ${item}`).join("\n");
  s4.addText(itemText, {
    x: x + 0.1, y: 2.55, w: 2.0, h: 1.5,
    fontSize: 9, color: C.text, fontFace: F, lineSpacing: 16
  });
  // 特性
  s4.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 4.1, w: 2.0, h: 0.95,
    fill: { color: C.light }
  });
  s4.addText(`量: ${ch.volume}`, {
    x: x + 0.15, y: 4.15, w: 1.9, h: 0.25,
    fontSize: 9, color: C.sub, fontFace: F
  });
  s4.addText(`質: ${ch.quality}`, {
    x: x + 0.15, y: 4.4, w: 1.9, h: 0.25,
    fontSize: 9, color: C.sub, fontFace: F
  });
  s4.addText(ch.priority, {
    x: x + 0.15, y: 4.65, w: 1.9, h: 0.3,
    fontSize: 14, color: C.orange, fontFace: F, align: "center"
  });
});

// ========== 5. A1: BI本部VP戦略 ==========
let s5 = pres.addSlide();
addHeader(s5, "A1: BI本部VP戦略");

s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 9.2, h: 0.55,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("NTT東のBI本部VP（ビジネスイノベーション本部）と連携し、AIサービスをNTT東の商材ラインナップに組み込む", {
  x: 0.6, y: 1.03, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

const a1Rows = [
  [
    { text: "#", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "施策", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "1", options: { align: "center" } },
    { text: "共同サービスメニュー作成", options: { bold: true, align: "left" } },
    { text: "NTT東の既存サービスとAIサービスのセット提案を設計", options: { align: "left" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "定期パイプラインレビュー", options: { bold: true, align: "left" } },
    { text: "四半期ごとにVP本部とパイプライン共有会議を実施", options: { align: "left" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "成功事例の共有", options: { bold: true, align: "left" } },
    { text: "VP経由の案件成果を共有し、追加紹介を促進", options: { align: "left" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "紹介資料の最適化", options: { bold: true, align: "left" } },
    { text: "VP担当者が顧客に説明しやすい1枚サマリーを用意", options: { align: "left" } }
  ]
];

s5.addTable(a1Rows, {
  x: 0.4, y: 1.65, w: 9.2, h: 2.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.5, 2.5, 6.2]
});

// KPIボックス
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.85, w: 9.2, h: 1.5,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s5.addText("KPI", {
  x: 0.6, y: 3.95, w: 2, h: 0.3,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s5.addText(
  "✓  VP経由の紹介件数: 月2件以上\n" +
  "✓  紹介→初回面談の転換率: 70%以上\n" +
  "✓  VP経由案件の受注金額: 四半期1,000万円以上", {
  x: 0.6, y: 4.3, w: 8.8, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 6. A2: 産業基盤ビジネス部戦略 ==========
let s6 = pres.addSlide();
addHeader(s6, "A2: 産業基盤ビジネス部戦略");

s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 9.2, h: 0.55,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s6.addText("ロイヤルカスタマーに対して、AIサービスをアドオン提案。自治体・民需で切り口を分ける", {
  x: 0.6, y: 1.03, w: 8.8, h: 0.4,
  fontSize: 11, color: C.main, fontFace: F
});

// 自治体カード
s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 1.65, w: 4.35, h: 2.0,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 1.65, w: 0.08, h: 2.0, fill: { color: C.main }
});
s6.addText("自治体向け", {
  x: 0.65, y: 1.75, w: 2, h: 0.3,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s6.addText(
  "•  自治体向けAI活用事例集作成\n" +
  "   （住民サービス、内部業務効率化、データ活用）\n" +
  "•  公募連動提案（施策3と連携）\n" +
  "•  自治体DX研修パッケージ\n" +
  "   （首長・幹部向け＋職員向け）", {
  x: 0.65, y: 2.1, w: 3.9, h: 1.4,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 17
});

// 民需カード
s6.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 1.65, w: 4.35, h: 2.0,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s6.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 1.65, w: 0.08, h: 2.0, fill: { color: C.gold }
});
s6.addText("民需向け", {
  x: 5.5, y: 1.75, w: 2, h: 0.3,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s6.addText(
  "•  業種別AI活用仮説シート\n" +
  "   （製造・医療・農業・教育等）\n" +
  "•  顧客課題ヒアリング同行\n" +
  "•  PoC成功→横展開プレイブック\n" +
  "   （同業種他社への水平展開）", {
  x: 5.5, y: 2.1, w: 3.9, h: 1.4,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 17
});

// KPIボックス
s6.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.85, w: 9.2, h: 1.5,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s6.addText("KPI", {
  x: 0.6, y: 3.95, w: 2, h: 0.3,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s6.addText(
  "✓  ターゲットアカウント接触数: 月3社以上\n" +
  "✓  同行商談→案件化率: 30%以上\n" +
  "✓  自治体/民需の案件バランス: 目標比率を設定", {
  x: 0.6, y: 4.3, w: 8.8, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 7. A3-A4: 支店・社内横連携 ==========
let s7 = pres.addSlide();
addHeader(s7, "A3-A4: 支店ネットワーク & 社内横連携");

// A3カード
s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 4.35, h: 3.1,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 4.35, h: 0.08, fill: { color: C.main }
});
s7.addText("A3: 支店ネットワーク", {
  x: 0.6, y: 1.1, w: 4.0, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s7.addText("「Train the Trainer」モデル", {
  x: 0.6, y: 1.45, w: 4.0, h: 0.25,
  fontSize: 10, color: C.sub, fontFace: F
});
s7.addText(
  "1. AI案件発見チェックリスト配布\n" +
  "   「こんな相談が来たら紹介して」\n" +
  "2. 支店向け勉強会（30分・デモ込み）\n" +
  "3. 簡単紹介フォーム整備\n" +
  "4. 紹介実績のフィードバック\n" +
  "5. パイロット3支店で検証→全支店展開", {
  x: 0.6, y: 1.8, w: 4.0, h: 1.8,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
});

// A4カード
s7.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 0.95, w: 4.35, h: 3.1,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s7.addShape(pres.ShapeType.rect, {
  x: 5.25, y: 0.95, w: 4.35, h: 0.08, fill: { color: C.gold }
});
s7.addText("A4: 社内他事業部", {
  x: 5.45, y: 1.1, w: 4.0, h: 0.35,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s7.addText("社内認知向上→クロスセル", {
  x: 5.45, y: 1.45, w: 4.0, h: 0.25,
  fontSize: 10, color: C.sub, fontFace: F
});
s7.addText(
  "1. 社内Slack/Teams告知（月1回）\n" +
  "   最新事例・成果を社内チャネルで発信\n" +
  "2. ランチ＆ラーンセッション（隔月）\n" +
  "   カジュアルな社内勉強会\n" +
  "3. クロスセル案件テンプレート\n" +
  "   他チーム提案にAIをアドオン", {
  x: 5.45, y: 1.8, w: 4.0, h: 1.8,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
});

// チェックリスト例
s7.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.25, w: 9.2, h: 1.1,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s7.addText("A3: AI案件発見チェックリスト（例）", {
  x: 0.6, y: 4.3, w: 4, h: 0.25,
  fontSize: 10, bold: true, color: C.orange, fontFace: F
});
s7.addText(
  "「ChatGPTを業務で使いたい」「社内の文書検索を楽にしたい」「データは溜まっているが活用できていない」→ AIチームに紹介", {
  x: 0.6, y: 4.6, w: 8.8, h: 0.6,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
});

// ========== 8. 施策2概要（B1〜B4） ==========
let s8 = pres.addSlide();
addHeader(s8, "施策2: Webチャネル概要");

const webChannels = [
  {
    id: "B1", name: "サービスページ",
    desc: "AIチームのホームベース",
    items: ["サービス概要", "導入事例2-3件", "チーム紹介", "問い合わせCTA"],
    priority: "★★★",
    color: C.main
  },
  {
    id: "B2", name: "コンテンツMK",
    desc: "SEO・コンテンツ蓄積",
    items: ["事例コンテンツ 月1", "技術記事 月2", "ビジネス記事 月1", "トレンド 四半期1"],
    priority: "★★",
    color: C.main
  },
  {
    id: "B3", name: "セミナー",
    desc: "リード獲得エンジン",
    items: ["月次ウェビナー", "業種別セミナー", "ハンズオンWS", "NTT東共催"],
    priority: "★★",
    color: C.gold
  },
  {
    id: "B4", name: "SNS・外部",
    desc: "長期ブランド構築",
    items: ["LinkedIn 週1", "note/Qiita 月1", "NTTグループ内メディア"],
    priority: "★",
    color: C.gold
  }
];

webChannels.forEach((ch, i) => {
  const x = 0.4 + i * 2.35;
  s8.addShape(pres.ShapeType.rect, {
    x: x, y: 0.95, w: 2.2, h: 3.7,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s8.addShape(pres.ShapeType.rect, {
    x: x, y: 0.95, w: 2.2, h: 0.08, fill: { color: ch.color }
  });
  s8.addText(ch.id, {
    x: x + 0.1, y: 1.1, w: 0.5, h: 0.35,
    fontSize: 16, bold: true, color: ch.color, fontFace: F
  });
  s8.addText(ch.name, {
    x: x + 0.1, y: 1.45, w: 2.0, h: 0.35,
    fontSize: 12, bold: true, color: C.text, fontFace: F
  });
  // 説明
  s8.addShape(pres.ShapeType.roundRect, {
    x: x + 0.1, y: 1.85, w: 2.0, h: 0.3,
    fill: { color: "E0F7FA" }, rectRadius: 0.03
  });
  s8.addText(ch.desc, {
    x: x + 0.1, y: 1.87, w: 2.0, h: 0.28,
    fontSize: 9, bold: true, color: C.main, fontFace: F, align: "center"
  });
  // 区切り線
  s8.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 2.25, w: 2.0, h: 0.015, fill: { color: C.border }
  });
  // 施策
  const itemText = ch.items.map(item => `• ${item}`).join("\n");
  s8.addText(itemText, {
    x: x + 0.1, y: 2.35, w: 2.0, h: 1.5,
    fontSize: 9, color: C.text, fontFace: F, lineSpacing: 16
  });
  // 優先度
  s8.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 3.9, w: 2.0, h: 0.5,
    fill: { color: C.light }
  });
  s8.addText(ch.priority, {
    x: x + 0.1, y: 3.95, w: 2.0, h: 0.4,
    fontSize: 14, color: C.orange, fontFace: F, align: "center"
  });
});

// フライホイール説明
s8.addText("Attract（集客）→ Convert（転換）→ Close（成約）→ Delight（満足）→ 事例化 → さらなる集客", {
  x: 0.4, y: 4.85, w: 9.2, h: 0.4,
  fontSize: 11, color: C.sub, fontFace: F, align: "center"
});

// ========== 9. サービスページ設計 ==========
let s9 = pres.addSlide();
addHeader(s9, "B1: サービスページ設計");

// ページ構成
const pageSections = [
  { name: "ヒーロー", desc: "キャッチコピー＋\n提供価値" },
  { name: "サービス概要", desc: "4パッケージを\n視覚的に紹介" },
  { name: "導入事例", desc: "2〜3件の事例\nカード形式" },
  { name: "チーム紹介", desc: "メンバーの\n専門性・実績" },
  { name: "お問い合わせ", desc: "CTA\nフォーム" }
];

s9.addText("ページ構成", {
  x: 0.4, y: 0.9, w: 3, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});

pageSections.forEach((sec, i) => {
  const x = 0.4 + i * 1.88;
  s9.addShape(pres.ShapeType.roundRect, {
    x: x, y: 1.25, w: 1.75, h: 1.1,
    fill: { color: i === 4 ? C.main : "EDF7FA" },
    rectRadius: 0.05
  });
  s9.addText(sec.name, {
    x: x, y: 1.3, w: 1.75, h: 0.35,
    fontSize: 11, bold: true, color: i === 4 ? C.white : C.main, fontFace: F, align: "center"
  });
  s9.addText(sec.desc, {
    x: x, y: 1.65, w: 1.75, h: 0.6,
    fontSize: 9, color: i === 4 ? C.white : C.text, fontFace: F, align: "center"
  });
  if (i < 4) {
    s9.addText("→", {
      x: x + 1.65, y: 1.45, w: 0.3, h: 0.4,
      fontSize: 16, color: C.main, fontFace: F, align: "center"
    });
  }
});

// 問い合わせフロー
s9.addText("問い合わせ対応フロー", {
  x: 0.4, y: 2.55, w: 3, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});

const flowSteps = [
  "フォーム送信",
  "自動返信メール\n（受付確認）",
  "Slack通知\n（チーム内）",
  "1営業日以内\n担当アサイン",
  "3営業日以内\n初回コール"
];

flowSteps.forEach((step, i) => {
  const x = 0.4 + i * 1.88;
  s9.addShape(pres.ShapeType.roundRect, {
    x: x, y: 2.9, w: 1.75, h: 0.7,
    fill: { color: i === 0 ? C.main : C.light },
    rectRadius: 0.05
  });
  s9.addText(step, {
    x: x, y: 2.95, w: 1.75, h: 0.6,
    fontSize: 9, bold: i === 0, color: i === 0 ? C.white : C.text, fontFace: F, align: "center"
  });
  if (i < 4) {
    s9.addText("→", {
      x: x + 1.65, y: 3.0, w: 0.3, h: 0.4,
      fontSize: 14, color: C.main, fontFace: F, align: "center"
    });
  }
});

// KPI
s9.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.85, w: 9.2, h: 1.5,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s9.addText("KPI", {
  x: 0.6, y: 3.95, w: 2, h: 0.3,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s9.addText(
  "✓  ページ訪問数: 月500PV以上（公開6ヶ月後）\n" +
  "✓  問い合わせフォーム送信数: 月3件以上\n" +
  "✓  問い合わせ→面談設定率: 80%以上", {
  x: 0.6, y: 4.3, w: 8.8, h: 0.9,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 10. コンテンツマーケティング戦略 ==========
let s10 = pres.addSlide();
addHeader(s10, "B2: コンテンツマーケティング戦略");

// 4本柱テーブル
const contentRows = [
  [
    { text: "ピラー", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "内容例", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "ターゲット", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "頻度", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "事例コンテンツ", options: { bold: true, fill: "EDF7FA", color: C.main } },
    { text: "「○○業でRAGチャットボット導入、対応時間50%削減」", options: { align: "left" } },
    { text: "検討中の顧客", options: { align: "center" } },
    { text: "月1本", options: { align: "center", bold: true } }
  ],
  [
    { text: "技術コンテンツ", options: { bold: true, fill: "EDF7FA", color: C.main } },
    { text: "「Difyで社内FAQボットを作る方法」「RAG精度改善の5つのコツ」", options: { align: "left" } },
    { text: "技術担当者", options: { align: "center" } },
    { text: "月2本", options: { align: "center", bold: true } }
  ],
  [
    { text: "ビジネス", options: { bold: true, fill: "EDF7FA", color: C.main } },
    { text: "「生成AI導入のROI算出方法」「AI活用ロードマップの作り方」", options: { align: "left" } },
    { text: "経営層・推進", options: { align: "center" } },
    { text: "月1本", options: { align: "center", bold: true } }
  ],
  [
    { text: "トレンド", options: { bold: true, fill: "EDF7FA", color: C.main } },
    { text: "「2026年の生成AIトレンド」「AI導入補助金の活用法」", options: { align: "left" } },
    { text: "幅広い層", options: { align: "center" } },
    { text: "四半期1本", options: { align: "center", bold: true } }
  ]
];

s10.addTable(contentRows, {
  x: 0.4, y: 0.95, w: 9.2, h: 2.3,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.5, 4.2, 1.5, 2.0]
});

// SEOキーワード
s10.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.45, w: 9.2, h: 0.9,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s10.addText("SEOターゲットキーワード（例）", {
  x: 0.6, y: 3.5, w: 4, h: 0.3,
  fontSize: 10, bold: true, color: C.orange, fontFace: F
});
s10.addText(
  "「生成AI 導入 支援」「RAG 構築 企業」「AI PoC 開発」「業務自動化 AI」「Dify 導入」「AI 研修 法人」", {
  x: 0.6, y: 3.8, w: 8.8, h: 0.4,
  fontSize: 10, color: C.text, fontFace: F
});

// 制作体制
s10.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.55, w: 9.2, h: 0.8,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s10.addText("制作体制", {
  x: 0.6, y: 4.6, w: 2, h: 0.25,
  fontSize: 10, bold: true, color: C.main, fontFace: F
});
s10.addText(
  "事例: PM＋マーケ担当（案件完了後）　　技術記事: エンジニア月1本ローテ　　ビジネス: リーダーまたは外部委託", {
  x: 0.6, y: 4.9, w: 8.8, h: 0.35,
  fontSize: 10, color: C.text, fontFace: F
});

// ========== 11. リードナーチャリング設計 ==========
let s11 = pres.addSlide();
addHeader(s11, "リード管理・ナーチャリング設計");

// ステージフロー
const stages = [
  { name: "認知", desc: "サイト訪問\nコンテンツ閲覧", color: C.light, textColor: C.text },
  { name: "MQL", desc: "資料DL\nセミナー参加", color: "E0F7FA", textColor: C.main },
  { name: "SQL", desc: "初回面談完了\n予算・時期明確", color: "EDF7FA", textColor: C.main },
  { name: "Opportunity", desc: "提案書提出\nクロージング", color: C.main, textColor: C.white },
  { name: "Won", desc: "契約締結\n→事例化", color: "2E7D32", textColor: C.white }
];

stages.forEach((stage, i) => {
  const x = 0.4 + i * 1.88;
  s11.addShape(pres.ShapeType.roundRect, {
    x: x, y: 1.0, w: 1.75, h: 1.2,
    fill: { color: stage.color },
    rectRadius: 0.05,
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });
  s11.addText(stage.name, {
    x: x, y: 1.05, w: 1.75, h: 0.4,
    fontSize: 13, bold: true, color: stage.textColor, fontFace: F, align: "center"
  });
  s11.addText(stage.desc, {
    x: x, y: 1.45, w: 1.75, h: 0.65,
    fontSize: 9, color: stage.textColor, fontFace: F, align: "center"
  });
  if (i < 4) {
    s11.addText("→", {
      x: x + 1.65, y: 1.3, w: 0.3, h: 0.4,
      fontSize: 16, color: C.main, fontFace: F, align: "center"
    });
  }
});

// ナーチャリング施策テーブル
const nurturingRows = [
  [
    { text: "ステージ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "施策", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "アクション", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "MQL", options: { bold: true, align: "center", color: C.main } },
    { text: "メールマガジン", options: { align: "left" } },
    { text: "月1回（事例・セミナー案内）/ 1週間以内にフォローコール", options: { align: "left" } }
  ],
  [
    { text: "SQL未満（滞留）", options: { bold: true, align: "center", color: C.main } },
    { text: "ドリップメール", options: { align: "left" } },
    { text: "3ヶ月間、段階的にサービス理解を深めるコンテンツ配信", options: { align: "left" } }
  ],
  [
    { text: "失注顧客", options: { bold: true, align: "center", color: C.orange } },
    { text: "フォローアップ", options: { align: "left" } },
    { text: "半年後に状況変化を確認。再検討のきっかけ提供", options: { align: "left" } }
  ]
];

s11.addTable(nurturingRows, {
  x: 0.4, y: 2.45, w: 9.2, h: 1.6,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.8, 1.8, 5.6]
});

// 管理ツール
s11.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.25, w: 9.2, h: 1.1,
  fill: { color: C.light }
});
s11.addText("管理ツール（最小構成）", {
  x: 0.6, y: 4.3, w: 3, h: 0.3,
  fontSize: 11, bold: true, color: C.main, fontFace: F
});
s11.addText(
  "✓  Googleスプレッドシート（リード管理台帳）　　" +
  "✓  Slack通知（新規リード・ステージ変更時）　　" +
  "✓  将来的にCRM導入検討", {
  x: 0.6, y: 4.65, w: 8.8, h: 0.5,
  fontSize: 10, color: C.text, fontFace: F
});

// ========== 12. チャネル間連携フライホイール ==========
let s12 = pres.addSlide();
addHeader(s12, "チャネル間連携（フライホイール）");

// フライホイール中央
s12.addShape(pres.ShapeType.ellipse, {
  x: 3.5, y: 1.4, w: 3.0, h: 1.4,
  fill: { color: C.main }
});
s12.addText("事例\nフライホイール", {
  x: 3.5, y: 1.65, w: 3.0, h: 0.9,
  fontSize: 14, bold: true, color: C.white, fontFace: F, align: "center"
});

// 周囲の4つの連携パターン
const patterns = [
  { x: 0.4, y: 1.0, label: "C1", title: "Web→NTT東コセル", desc: "Web問い合わせ顧客を\nNTT東営業と共同対応\n→ 成約率UP" },
  { x: 7.0, y: 1.0, label: "C2", title: "NTT東→Web活用", desc: "紹介案件に関連\nWebコンテンツを事前共有\n→ 商談の質向上" },
  { x: 0.4, y: 3.3, label: "C3", title: "セミナー→支店展開", desc: "ウェビナー録画を\n支店勉強会素材に再利用\n→ 一石二鳥" },
  { x: 7.0, y: 3.3, label: "C4", title: "事例循環", desc: "全チャネルの成功案件\n→ 事例化\n→ 全チャネルの燃料に" }
];

patterns.forEach((p) => {
  s12.addShape(pres.ShapeType.rect, {
    x: p.x, y: p.y, w: 2.8, h: 1.9,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s12.addShape(pres.ShapeType.rect, {
    x: p.x, y: p.y, w: 0.08, h: 1.9, fill: { color: C.accent }
  });
  s12.addText(p.label, {
    x: p.x + 0.2, y: p.y + 0.1, w: 0.5, h: 0.3,
    fontSize: 12, bold: true, color: C.main, fontFace: F
  });
  s12.addText(p.title, {
    x: p.x + 0.7, y: p.y + 0.1, w: 1.9, h: 0.3,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  s12.addShape(pres.ShapeType.rect, {
    x: p.x + 0.2, y: p.y + 0.5, w: 2.4, h: 0.015, fill: { color: C.border }
  });
  s12.addText(p.desc, {
    x: p.x + 0.2, y: p.y + 0.6, w: 2.4, h: 1.1,
    fontSize: 9, color: C.sub, fontFace: F, lineSpacing: 16
  });
});

// 矢印テキスト
s12.addText("↗", { x: 3.1, y: 1.4, w: 0.5, h: 0.4, fontSize: 18, color: C.accent, fontFace: F, align: "center" });
s12.addText("↘", { x: 6.4, y: 1.4, w: 0.5, h: 0.4, fontSize: 18, color: C.accent, fontFace: F, align: "center" });
s12.addText("↙", { x: 3.1, y: 2.6, w: 0.5, h: 0.4, fontSize: 18, color: C.accent, fontFace: F, align: "center" });
s12.addText("↖", { x: 6.4, y: 2.6, w: 0.5, h: 0.4, fontSize: 18, color: C.accent, fontFace: F, align: "center" });

// ========== 13. KPI体系 ==========
let s13 = pres.addSlide();
addHeader(s13, "KPI体系");

// 北極星
s13.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 9.2, h: 0.55,
  fill: { color: C.main }
});
s13.addText("北極星指標:  新規顧客からの四半期売上（案件獲得チャネル経由）", {
  x: 0.6, y: 1.0, w: 8.8, h: 0.45,
  fontSize: 13, bold: true, color: C.white, fontFace: F
});

// チャネル別KPI
const kpiRows = [
  [
    { text: "チャネル", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "リード数/月", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "面談設定率", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "案件化率", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "平均単価", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "A1. BI本部VP", options: { bold: true } },
    { text: "2件", options: { align: "center" } },
    { text: "70%", options: { align: "center", color: "2E7D32", bold: true } },
    { text: "40%", options: { align: "center" } },
    { text: "500万円", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "A2. 産業基盤", options: { bold: true } },
    { text: "3件", options: { align: "center" } },
    { text: "60%", options: { align: "center" } },
    { text: "30%", options: { align: "center" } },
    { text: "300万円", options: { align: "center", bold: true, color: C.main } }
  ],
  [
    { text: "A3. 支店", options: { bold: true } },
    { text: "5件", options: { align: "center" } },
    { text: "50%", options: { align: "center" } },
    { text: "20%", options: { align: "center" } },
    { text: "100万円", options: { align: "center", bold: true } }
  ],
  [
    { text: "A4. 社内横連携", options: { bold: true } },
    { text: "1件", options: { align: "center" } },
    { text: "80%", options: { align: "center", color: "2E7D32", bold: true } },
    { text: "50%", options: { align: "center", color: "2E7D32", bold: true } },
    { text: "200万円", options: { align: "center", bold: true } }
  ],
  [
    { text: "B1. サービスページ", options: { bold: true } },
    { text: "3件", options: { align: "center" } },
    { text: "80%", options: { align: "center", color: "2E7D32", bold: true } },
    { text: "25%", options: { align: "center" } },
    { text: "200万円", options: { align: "center", bold: true } }
  ],
  [
    { text: "B2. コンテンツ", options: { bold: true } },
    { text: "2件", options: { align: "center" } },
    { text: "60%", options: { align: "center" } },
    { text: "20%", options: { align: "center" } },
    { text: "150万円", options: { align: "center", bold: true } }
  ],
  [
    { text: "B3. セミナー", options: { bold: true } },
    { text: "5件", options: { align: "center" } },
    { text: "40%", options: { align: "center" } },
    { text: "15%", options: { align: "center" } },
    { text: "100万円", options: { align: "center", bold: true } }
  ]
];

s13.addTable(kpiRows, {
  x: 0.4, y: 1.65, w: 9.2, h: 3.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.2, 1.5, 1.5, 1.5, 2.5]
});

s13.addText("※ 立ち上げ期（6ヶ月後）の目標値。実績に基づいて四半期ごとに見直し", {
  x: 0.4, y: 4.75, w: 9.2, h: 0.3,
  fontSize: 9, color: C.sub, fontFace: F
});

// ========== 14. 統合ロードマップ ==========
let s14 = pres.addSlide();
addHeader(s14, "統合ロードマップ");

const roadmapRows = [
  [
    { text: "時期", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "施策1（NTT東連携）", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "施策2（Web強化）", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "チャネル間連携", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "Month 1", options: { bold: true, align: "center", fill: "EDF7FA", color: C.main } },
    { text: "サービスメニュー最終化\nVP本部・産業基盤と初回すり合わせ", options: { align: "left" } },
    { text: "サービスページ\n要件定義・コンテンツ準備", options: { align: "left" } },
    { text: "—", options: { align: "center", color: C.sub } }
  ],
  [
    { text: "Month 2", options: { bold: true, align: "center", fill: "EDF7FA", color: C.main } },
    { text: "VP本部プレゼン\nターゲットアカウント選定", options: { align: "left" } },
    { text: "サービスページ公開\n問い合わせフロー稼働", options: { align: "left" } },
    { text: "サービスページURL\n→紹介資料に記載", options: { align: "left" } }
  ],
  [
    { text: "Month 3", options: { bold: true, align: "center", fill: "EDF7FA", color: C.main } },
    { text: "パイロット支店3拠点で勉強会", options: { align: "left" } },
    { text: "事例2本公開\n初回ウェビナー", options: { align: "left" } },
    { text: "ウェビナー録画\n→支店勉強会素材", options: { align: "left" } }
  ],
  [
    { text: "Month 4-6", options: { bold: true, align: "center", fill: "EDF7FA", color: C.main } },
    { text: "支店展開拡大\n四半期レビュー", options: { align: "left" } },
    { text: "月次コンテンツ\nリード管理本格稼働", options: { align: "left" } },
    { text: "フライホイール\n本格稼働", options: { align: "left", bold: true, color: C.main } }
  ]
];

s14.addTable(roadmapRows, {
  x: 0.4, y: 0.95, w: 9.2, h: 4.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.2, 2.8, 2.6, 2.6]
});

// ========== 15. Thank you ==========
let s15 = pres.addSlide();
s15.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s15.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s15.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// 出力
const outDir = path.dirname(__filename);
const outPath = path.join(outDir, "チャネル戦略-施策1&2_NTTDXPN.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => console.error(err));
