const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "公募案件分析レポートv3";
pres.author = "NTT DXパートナー";

// カラーパレット
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
s1.addText("NTTDX顧客接点拡大ミッション", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("公募案件分析レポート", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("入札王データに基づく市場動向分析＆協業相談", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== 2. エグゼクティブサマリー ==========
let s2 = pres.addSlide();
addHeader(s2, "エグゼクティブサマリー");

// 概要カード
const summaryData = [
  { label: "総案件数", value: "911件", sub: "過去3年間" },
  { label: "落札データあり", value: "390件", sub: "金額分析可能" },
  { label: "応札可能案件", value: "7件", sub: "入札日1/20以降" }
];

summaryData.forEach((item, i) => {
  const x = 0.5 + i * 3.1;
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.1, w: 2.9, h: 1.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.1, w: 2.9, h: 0.08, fill: { color: C.main }
  });
  s2.addText(item.label, {
    x: x + 0.15, y: 1.3, w: 2.6, h: 0.35,
    fontSize: 12, color: C.sub, fontFace: F
  });
  s2.addText(item.value, {
    x: x + 0.15, y: 1.65, w: 2.6, h: 0.5,
    fontSize: 28, bold: true, color: C.main, fontFace: F
  });
  s2.addText(item.sub, {
    x: x + 0.15, y: 2.2, w: 2.6, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// キーインサイト
s2.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 2.8, w: 9, h: 2.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s2.addText("Key Insights", {
  x: 0.7, y: 2.95, w: 5, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});
s2.addText(
  "✓  生成AI案件が2024年に爆発的成長（前年比+812%）、2025年も継続成長\n" +
  "✓  RAG関連案件が2024年から登場し急増（2024→2025で+167%）→ 注目領域\n" +
  "✓  構築・運用フェーズが83%を占める → 実装力が勝負の鍵\n" +
  "✓  富士通Japanが大型案件を独占（総額6.8億円）、NTT東日本は11件で1.2億円",
  {
    x: 0.7, y: 3.4, w: 8.5, h: 1.5,
    fontSize: 12, color: C.text, fontFace: F, lineSpacing: 24
  }
);

// ========== 3. 業務カット（フェーズ）別案件分析 ==========
let s3 = pres.addSlide();
addHeader(s3, "業務カット（フェーズ）別案件分析");

// 現状認識ボックス
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 0.95, w: 9.2, h: 0.7,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s3.addText("データソース", {
  x: 0.55, y: 1.0, w: 2, h: 0.25,
  fontSize: 11, bold: true, color: C.orange, fontFace: F
});
s3.addText("入札王 2026年1月20日DL（総案件911件、落札金額データあり390件）", {
  x: 0.55, y: 1.28, w: 8.8, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});

// フェーズ別カードを配置
const phases = [
  { num: "①", name: "理解\n（研修）", count: "34件", pct: "7%", color: C.main },
  { num: "②", name: "設計", count: "1件", pct: "0%", color: C.sub },
  { num: "③", name: "検証\n（PoC/RFI）", count: "46件", pct: "10%", color: C.main },
  { num: "④", name: "実装\n（構築）", count: "337件", pct: "70%", color: C.orange },
  { num: "⑤", name: "定着\n（運用）", count: "63件", pct: "13%", color: C.main }
];

phases.forEach((p, i) => {
  const x = 0.4 + i * 1.88;
  // カード背景
  s3.addShape(pres.ShapeType.rect, {
    x: x, y: 1.85, w: 1.75, h: 1.85,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  // 上部カラーバー
  s3.addShape(pres.ShapeType.rect, {
    x: x, y: 1.85, w: 1.75, h: 0.08, fill: { color: p.color }
  });
  // フェーズ番号
  s3.addText(p.num, {
    x: x + 0.1, y: 2.0, w: 0.5, h: 0.35,
    fontSize: 14, bold: true, color: p.color, fontFace: F
  });
  // フェーズ名
  s3.addText(p.name, {
    x: x + 0.1, y: 2.35, w: 1.55, h: 0.55,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  // 区切り線
  s3.addShape(pres.ShapeType.rect, {
    x: x + 0.1, y: 2.9, w: 1.55, h: 0.015, fill: { color: C.border }
  });
  // 件数（大きく）
  s3.addText(p.count, {
    x: x + 0.1, y: 3.0, w: 1.55, h: 0.4,
    fontSize: 18, bold: true, color: p.color, fontFace: F, align: "center"
  });
  // 割合
  s3.addText(p.pct, {
    x: x + 0.1, y: 3.4, w: 1.55, h: 0.25,
    fontSize: 12, color: C.sub, fontFace: F, align: "center"
  });
});

// 示唆ボックス
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.9, w: 9.2, h: 1.15,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s3.addText("示唆", {
  x: 0.55, y: 3.98, w: 2, h: 0.3,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s3.addText("✓  構築・運用フェーズが83%を占める → 実装力が勝負の鍵\n✓  研修・設計は「入口」として有効だが案件数は少ない → パイプラインの起点\n✓  検証（PoC/RFI）は10% → ここを押さえれば実装に繋がりやすい", {
  x: 0.55, y: 4.32, w: 8.9, h: 0.7,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
});

// ========== 4. キーワード別ヒット数 ==========
let s4 = pres.addSlide();
addHeader(s4, "キーワード別ヒット数");

const keywordRows = [
  [
    { text: "キーワード", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "備考", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "チャットボット", options: { bold: true, align: "left" } },
    { text: "374件", options: { align: "center" } },
    { text: "住民向けサービス含む", options: { align: "left" } }
  ],
  [
    { text: "生成AI", options: { bold: true, color: C.main, fill: "EDF7FA", align: "left" } },
    { text: "339件", options: { fill: "EDF7FA", align: "center", color: C.main, bold: true } },
    { text: "コアターゲット", options: { fill: "EDF7FA", align: "left", color: C.main } }
  ],
  [
    { text: "RAG", options: { bold: true, align: "left" } },
    { text: "17件", options: { align: "center" } },
    { text: "構築案件、増加傾向", options: { align: "left" } }
  ],
  [
    { text: "ChatGPT", options: { align: "left" } },
    { text: "13件", options: { align: "center" } },
    { text: "製品名指定案件", options: { align: "left" } }
  ],
  [
    { text: "プロンプト", options: { align: "left" } },
    { text: "8件", options: { align: "center" } },
    { text: "研修系", options: { align: "left" } }
  ],
  [
    { text: "Dify", options: { bold: true, color: C.orange, fill: "FFF8E1", align: "left" } },
    { text: "2件", options: { fill: "FFF8E1", align: "center", color: C.orange, bold: true } },
    { text: "新興OSSツール、要ウォッチ", options: { fill: "FFF8E1", align: "left", color: C.orange } }
  ]
];

s4.addTable(keywordRows, {
  x: 0.5, y: 1.1, w: 9, h: 2.6,
  fontFace: F, fontSize: 12, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [3, 2, 4]
});

// 推奨検索キーワード
s4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.9, w: 9, h: 1.1,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s4.addText("推奨検索キーワード", {
  x: 0.7, y: 4.0, w: 3, h: 0.3,
  fontSize: 12, bold: true, color: C.orange, fontFace: F
});
s4.addText("Tier1（必須）: 生成AI, RAG, チャットボット\nTier2（補足）: ChatGPT, Dify, プロンプト", {
  x: 0.7, y: 4.35, w: 8.5, h: 0.55,
  fontSize: 11, color: C.text, fontFace: F, lineSpacing: 20
});

// ========== 5. 年次推移・トレンド ==========
let s5 = pres.addSlide();
addHeader(s5, "キーワード別 年次推移");

const yearRows = [
  [
    { text: "年", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "生成AI", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "RAG", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "チャットボット", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "ChatGPT", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "Dify", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "2023", options: { bold: true, align: "center" } },
    { text: "8", options: { align: "center" } },
    { text: "0", options: { align: "center" } },
    { text: "45", options: { align: "center" } },
    { text: "0", options: { align: "center" } },
    { text: "0", options: { align: "center" } }
  ],
  [
    { text: "2024", options: { bold: true, align: "center" } },
    { text: "73", options: { align: "center", bold: true, color: C.main } },
    { text: "3", options: { align: "center" } },
    { text: "48", options: { align: "center" } },
    { text: "2", options: { align: "center" } },
    { text: "0", options: { align: "center" } }
  ],
  [
    { text: "2025", options: { bold: true, align: "center" } },
    { text: "98", options: { align: "center", bold: true, color: C.main } },
    { text: "8", options: { align: "center", bold: true, color: C.main } },
    { text: "43", options: { align: "center" } },
    { text: "1", options: { align: "center" } },
    { text: "2", options: { align: "center" } }
  ],
  [
    { text: "2026", options: { bold: true, align: "center", fill: C.light } },
    { text: "4", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } }
  ]
];

s5.addTable(yearRows, {
  x: 0.5, y: 1.1, w: 9, h: 2.0,
  fontFace: F, fontSize: 12, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle"
});

s5.addText("※2026年は1月20日時点", {
  x: 0.5, y: 3.15, w: 4, h: 0.3,
  fontSize: 10, color: C.sub, fontFace: F
});

// 成長率カード
const growthData = [
  { kw: "生成AI", g1: "+812%", g2: "+34%", highlight: true },
  { kw: "RAG", g1: "-", g2: "+167%", highlight: true },
  { kw: "チャットボット", g1: "+7%", g2: "-10%", highlight: false }
];

s5.addText("前年比成長率", {
  x: 0.5, y: 3.5, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.text, fontFace: F
});

growthData.forEach((item, i) => {
  const x = 0.5 + i * 3.1;
  const bgColor = item.highlight ? "E8F5E9" : C.light;
  const textColor = item.highlight ? "2E7D32" : C.sub;

  s5.addShape(pres.ShapeType.rect, {
    x: x, y: 3.9, w: 2.9, h: 1.1,
    fill: { color: bgColor }
  });
  s5.addText(item.kw, {
    x: x + 0.1, y: 4.0, w: 2.7, h: 0.3,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  s5.addText(`2023→2024: ${item.g1}`, {
    x: x + 0.1, y: 4.3, w: 2.7, h: 0.25,
    fontSize: 10, color: textColor, fontFace: F
  });
  s5.addText(`2024→2025: ${item.g2}`, {
    x: x + 0.1, y: 4.55, w: 2.7, h: 0.25,
    fontSize: 10, bold: item.highlight, color: textColor, fontFace: F
  });
});

// ========== 6. 落札企業ランキング ==========
let s6 = pres.addSlide();
addHeader(s6, "落札企業ランキング");

// 件数ランキング
s6.addText("件数ランキング TOP5", {
  x: 0.5, y: 1.0, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.text, fontFace: F
});

const countRows = [
  [
    { text: "#", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "企業名", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "総額", options: { fill: C.main, color: C.white, bold: true, align: "right" } }
  ],
  [
    { text: "1", options: { align: "center" } },
    { text: "サイネックス", options: { align: "left" } },
    { text: "19件", options: { align: "center", bold: true } },
    { text: "3,155万円", options: { align: "right" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "ビースポーク", options: { align: "left" } },
    { text: "18件", options: { align: "center", bold: true } },
    { text: "8,558万円", options: { align: "right" } }
  ],
  [
    { text: "3", options: { align: "center", fill: "EDF7FA" } },
    { text: "富士通Japan", options: { align: "left", bold: true, color: C.main, fill: "EDF7FA" } },
    { text: "13件", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "6.8億円", options: { align: "right", bold: true, color: C.main, fill: "EDF7FA" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "NTT東日本", options: { align: "left" } },
    { text: "11件", options: { align: "center", bold: true } },
    { text: "1.2億円", options: { align: "right" } }
  ],
  [
    { text: "5", options: { align: "center" } },
    { text: "エクサウィザーズ", options: { align: "left" } },
    { text: "10件", options: { align: "center", bold: true } },
    { text: "6,836万円", options: { align: "right" } }
  ]
];

s6.addTable(countRows, {
  x: 0.5, y: 1.35, w: 4.3, h: 2.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.5, 1.8, 0.8, 1.2]
});

// 総額ランキング
s6.addText("総額ランキング TOP5", {
  x: 5.1, y: 1.0, w: 3, h: 0.35,
  fontSize: 12, bold: true, color: C.text, fontFace: F
});

const totalRows = [
  [
    { text: "#", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "企業名", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "総額", options: { fill: C.main, color: C.white, bold: true, align: "right" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "1", options: { align: "center", fill: "EDF7FA" } },
    { text: "富士通Japan", options: { align: "left", bold: true, color: C.main, fill: "EDF7FA" } },
    { text: "6.8億円", options: { align: "right", bold: true, color: C.main, fill: "EDF7FA" } },
    { text: "13件", options: { align: "center", fill: "EDF7FA" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "大塚商会", options: { align: "left", bold: true } },
    { text: "5.2億円", options: { align: "right", bold: true } },
    { text: "2件", options: { align: "center" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "コニカミノルタ", options: { align: "left", bold: true } },
    { text: "5.1億円", options: { align: "right", bold: true } },
    { text: "2件", options: { align: "center" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "扶桑電通", options: { align: "left" } },
    { text: "2.2億円", options: { align: "right" } },
    { text: "1件", options: { align: "center" } }
  ],
  [
    { text: "5", options: { align: "center" } },
    { text: "NTT東日本", options: { align: "left" } },
    { text: "1.2億円", options: { align: "right" } },
    { text: "11件", options: { align: "center" } }
  ]
];

s6.addTable(totalRows, {
  x: 5.1, y: 1.35, w: 4.3, h: 2.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.5, 1.8, 1.2, 0.8]
});

// 市場セグメント
s6.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.5, w: 9, h: 1.6,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s6.addText("市場セグメント分析", {
  x: 0.7, y: 3.6, w: 5, h: 0.35,
  fontSize: 12, bold: true, color: C.main, fontFace: F
});
s6.addText(
  "• チャットボット市場: サイネックス・ビースポークが件数で圧倒（中小規模SaaS）\n" +
  "• 生成AIサービス市場: エクサウィザーズ・シフトプラス・イマクリエが台頭\n" +
  "• 大型SI案件: 富士通Japanが都道府県レベルを独占",
  {
    x: 0.7, y: 4.0, w: 8.5, h: 1.0,
    fontSize: 11, color: C.text, fontFace: F, lineSpacing: 22
  }
);

// ========== 7. 応札可能案件 ==========
let s7 = pres.addSlide();
addHeader(s7, "応札可能案件（2026/1/20時点）");

const bidRows = [
  [
    { text: "入札日", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "フェーズ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "発注機関", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "件名", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "1/29", options: { align: "center", bold: true } },
    { text: "①研修", options: { align: "center" } },
    { text: "佐賀県", options: { align: "center" } },
    { text: "令和7年度生成AI利活用研修委託業務", options: { align: "left" } }
  ],
  [
    { text: "2/05", options: { align: "center", bold: true } },
    { text: "④実装", options: { align: "center" } },
    { text: "群馬県", options: { align: "center" } },
    { text: "生成AIサービス導入・提供業務（公募型プロポーザル）", options: { align: "left" } }
  ],
  [
    { text: "2/05", options: { align: "center", bold: true } },
    { text: "④実装", options: { align: "center" } },
    { text: "三重県", options: { align: "center" } },
    { text: "令和７年度生成AI利用ローカル環境構築業務", options: { align: "left" } }
  ],
  [
    { text: "2/06", options: { align: "center", bold: true } },
    { text: "④実装", options: { align: "center" } },
    { text: "明日香村", options: { align: "center" } },
    { text: "生成AI英会話システム導入事業（聖徳中学校）", options: { align: "left" } }
  ],
  [
    { text: "2/09", options: { align: "center", bold: true } },
    { text: "④実装", options: { align: "center" } },
    { text: "八尾市", options: { align: "center" } },
    { text: "八尾市生成AI導入運用業務", options: { align: "left" } }
  ],
  [
    { text: "2/13", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "④実装", options: { align: "center", fill: "EDF7FA" } },
    { text: "武蔵野市", options: { align: "center", bold: true, fill: "EDF7FA" } },
    { text: "FAQ・RAG検索システム提供役務", options: { align: "left", fill: "EDF7FA" } }
  ],
  [
    { text: "2/18", options: { align: "center", bold: true, fill: "FFF8E1" } },
    { text: "②設計", options: { align: "center", fill: "FFF8E1" } },
    { text: "大阪市", options: { align: "center", bold: true, fill: "FFF8E1" } },
    { text: "令和8年度大阪市における生成AI活用ロードマップ作成等支援", options: { align: "left", fill: "FFF8E1" } }
  ]
];

s7.addTable(bidRows, {
  x: 0.5, y: 1.1, w: 9, h: 2.9,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.9, 1.0, 1.3, 5.8]
});

// 注目案件
s7.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 9, h: 0.9,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s7.addText("注目案件", {
  x: 0.7, y: 4.28, w: 2, h: 0.3,
  fontSize: 11, bold: true, color: C.orange, fontFace: F
});
s7.addText("• 武蔵野市（2/13）: RAG案件 → 技術力アピールのチャンス\n• 大阪市（2/18）: ロードマップ作成支援 → 設計フェーズからの入口案件", {
  x: 0.7, y: 4.58, w: 8.5, h: 0.5,
  fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18
});

// ========== 8. SD事業部の取り組み ==========
let s8 = pres.addSlide();
addHeader(s8, "SD事業部の取り組み：公募案件キャッチアップの仕組み");

// 検討中バッジ
s8.addShape(pres.ShapeType.rect, {
  x: 8.35, y: 0.25, w: 1.2, h: 0.35,
  fill: { color: C.orange }
});
s8.addText("検討中", {
  x: 8.35, y: 0.27, w: 1.2, h: 0.32,
  fontSize: 10, bold: true, color: C.white, fontFace: F, align: "center"
});

// 目指す姿ボックス
s8.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 1.1, w: 9.2, h: 1.8,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1.5 }
});
s8.addText("目指す姿：まずは公募案件に「気づく」仕組みを作る", {
  x: 0.55, y: 1.25, w: 8, h: 0.4,
  fontSize: 16, bold: true, color: C.main, fontFace: F
});

// フロー（シンプル版）
const flowSteps = [
  { label: "入札王データ" },
  { label: "Slack自動通知" },
  { label: "判断・対応" }
];

flowSteps.forEach((step, i) => {
  const x = 1.2 + i * 2.8;
  s8.addShape(pres.ShapeType.roundRect, {
    x: x, y: 1.85, w: 2.2, h: 0.7,
    fill: { color: i === 1 ? C.main : C.white },
    rectRadius: 0.08,
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });
  s8.addText(step.label, {
    x: x, y: 1.95, w: 2.2, h: 0.5,
    fontSize: 12, bold: true, color: i === 1 ? C.white : C.text, fontFace: F, align: "center", valign: "middle"
  });
  if (i < flowSteps.length - 1) {
    s8.addText("→", {
      x: x + 2.1, y: 1.95, w: 0.7, h: 0.5,
      fontSize: 18, color: C.main, fontFace: F, align: "center"
    });
  }
});

// 将来の発展カード
s8.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.2, w: 9.2, h: 1.7,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s8.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.2, w: 0.08, h: 1.7, fill: { color: C.main }
});
s8.addText("将来的には判断の自動化も検討", {
  x: 0.6, y: 3.35, w: 8, h: 0.4,
  fontSize: 14, bold: true, color: C.main, fontFace: F
});
s8.addText("• 金額規模や案件の領域によって、自動で判断または\n  マネージャーにエスカレーションする仕組みの構築も視野に入れている", {
  x: 0.6, y: 3.85, w: 8.5, h: 0.9,
  fontSize: 12, color: C.text, fontFace: F, lineSpacing: 22
});

// ========== 9. 相談事項 ==========
let s9 = pres.addSlide();
addHeader(s9, "相談事項");

// 議論したい観点カード
s9.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 1.1, w: 9.2, h: 3.8,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s9.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 1.1, w: 0.08, h: 3.8, fill: { color: C.main }
});
s9.addText("議論したい観点", {
  x: 0.6, y: 1.3, w: 8, h: 0.45,
  fontSize: 16, bold: true, color: C.main, fontFace: F
});
s9.addText("• 案件情報の共有範囲・頻度\n\n• 共同提案の進め方・役割分担\n\n• リソース配分の考え方", {
  x: 0.6, y: 1.9, w: 8.5, h: 2.8,
  fontSize: 16, color: C.text, fontFace: F, lineSpacing: 32
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

// ========== 出力 ==========
const outputPath = path.join(__dirname, "公募案件分析レポートv3_NTTDXPN.pptx");
pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`Created: ${outputPath}`))
  .catch(err => console.error(err));
