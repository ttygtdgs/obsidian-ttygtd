const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";

const C = {
  main: "156082", accent: "6CE6E8", gold: "F3C551", orange: "E67E22",
  text: "333333", sub: "666666", light: "F8F9FA", white: "FFFFFF", border: "E0E0E0"
};
const F = "Meiryo UI";
const assets = path.join(process.env.HOME, ".claude/skills/ntt-dxpartner-pptx/assets");

function addHeader(slide, title) {
  slide.background = { path: `${assets}/bg-content.png` };
  slide.addText(title, { x: 0.4, y: 0.25, w: 8, h: 0.5, fontSize: 24, bold: true, color: C.text, fontFace: F });
  slide.addShape(pres.ShapeType.rect, { x: 0.4, y: 0.75, w: 9.2, h: 0.025, fill: { color: C.main } });
}

// Helper: header row style
function hdr(text, opts = {}) {
  return { text, options: { fill: C.main, color: C.white, bold: true, align: "center", fontSize: 10, ...opts } };
}
function cell(text, opts = {}) {
  return { text, options: { align: "center", fontSize: 10, ...opts } };
}
function cellL(text, opts = {}) {
  return { text, options: { align: "left", fontSize: 10, ...opts } };
}
function highlight(text, opts = {}) {
  return { text, options: { fill: "EDF7FA", color: C.main, bold: true, align: "center", fontSize: 10, ...opts } };
}
function highlightL(text, opts = {}) {
  return { text, options: { fill: "EDF7FA", color: C.main, bold: true, align: "left", fontSize: 10, ...opts } };
}

// ==============================
// Slide 1: Title
// ==============================
let s1 = pres.addSlide();
s1.background = { path: `${assets}/bg-title.png` };
s1.addText("NTT DXパートナー", {
  x: 0.6, y: 1.6, w: 8, h: 0.5, fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("自治体生成AI案件\nFY2026 フェーズ別見通し", {
  x: 0.6, y: 2.0, w: 8, h: 1.0, fontSize: 34, bold: true, color: C.white, fontFace: F, lineSpacing: 45
});
s1.addText("入札キング962件分析 + 個別案件調査に基づく市場見通し", {
  x: 0.6, y: 3.1, w: 8, h: 0.4, fontSize: 16, color: C.white, fontFace: F
});
s1.addText("2026年2月17日", {
  x: 0.6, y: 4.9, w: 2, h: 0.3, fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ==============================
// Slide 2: 市場全体像 — 月別案件数推移
// ==============================
let s2 = pres.addSlide();
addHeader(s2, "市場全体像 — 月別案件数推移");

// Monthly data table
const monthRows = [
  [hdr("年度", {fontSize: 9}), hdr("4月",{fontSize: 9}), hdr("5月",{fontSize: 9}), hdr("6月",{fontSize: 9}),
   hdr("7月",{fontSize: 9}), hdr("8月",{fontSize: 9}), hdr("9月",{fontSize: 9}),
   hdr("10月",{fontSize: 9}), hdr("11月",{fontSize: 9}), hdr("12月",{fontSize: 9}),
   hdr("1月",{fontSize: 9}), hdr("2月",{fontSize: 9}), hdr("3月",{fontSize: 9}), hdr("年計",{fontSize: 9})],
  [cellL("FY2023",{bold:true}), cell("19"), cell("11"), cell("11"), cell("14"), cell("11"), cell("7"), cell("4"), cell("13"), cell("3"), cell("11"), cell("10"), cell("17"), highlight("131")],
  [cellL("FY2024",{bold:true}), cell("32"), cell("27"), cell("25"), cell("24"), cell("20"), cell("11"), cell("11"), cell("15"), cell("12"), cell("5"), cell("18"), cell("33"), highlight("233")],
  [highlightL("FY2025*"), highlight("45"), highlight("27"), highlight("27"), highlight("27"), highlight("22"), highlight("16"), highlight("14"), highlight("11"), highlight("14"), highlight("11"), highlight("11"), highlight("-"), highlight("225")],
];

s2.addTable(monthRows, {
  x: 0.3, y: 1.0, w: 9.4, h: 1.6,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [0.7, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.7]
});

s2.addText("*FY2025は11ヶ月分（2026年2月時点）。3月データ未取得", {
  x: 0.4, y: 2.65, w: 6, h: 0.25, fontSize: 9, color: C.sub, fontFace: F
});

// Quarter summary table
const qRows = [
  [hdr("年度"), hdr("Q1 (4-6月)"), hdr("Q2 (7-9月)"), hdr("Q3 (10-12月)"), hdr("Q4 (1-3月)"), hdr("年計")],
  [cellL("FY2023",{bold:true}), cell("41 (31%)"), cell("31 (24%)"), cell("20 (15%)"), cell("38 (29%)"), highlight("131")],
  [cellL("FY2024",{bold:true}), cell("84 (36%)"), cell("55 (24%)"), cell("37 (16%)"), cell("56 (24%)"), highlight("233")],
  [highlightL("FY2025*"), highlight("99 (44%)"), highlight("65 (29%)"), highlight("39 (17%)"), highlight("22* (10%)"), highlight("225")],
];

s2.addTable(qRows, {
  x: 0.5, y: 3.1, w: 9.0, h: 1.4,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle"
});

// Key insight box
s2.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.65, w: 9.0, h: 0.65,
  fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 1 }
});
s2.addText("ポイント", {
  x: 0.7, y: 4.68, w: 1.2, h: 0.25, fontSize: 10, bold: true, color: C.orange, fontFace: F
});
s2.addText("Q1（4-6月）に全体の35-44%が集中。年度開始の運用更新+構築案件が重なる。営業の仕込みは3月末までが勝負。", {
  x: 0.7, y: 4.92, w: 8.5, h: 0.3, fontSize: 10, color: C.text, fontFace: F
});

// ==============================
// Slide 3: フェーズ別 年度推移
// ==============================
let s3 = pres.addSlide();
addHeader(s3, "フェーズ別 — 年度推移と成長率");

const phaseRows = [
  [hdr("フェーズ"), hdr("FY2023"), hdr("FY2024"), hdr("FY2025\n(推計)"), hdr("FY23→24"), hdr("FY24→25"), hdr("特徴")],
  [cellL("①研修",{bold:true, color: C.main}), cell("4"), cell("15"), highlight("20"), cell("+275%",{color:"2E7D32",bold:true}), cell("+33%"), cellL("AI法施行で需要増",{fontSize:9})],
  [cellL("②設計(RFI)",{bold:true, color: C.main}), cell("6"), cell("6"), highlight("9"), cell("±0%"), cell("+50%"), cellL("翌年構築の先行指標",{fontSize:9})],
  [cellL("③PoC",{bold:true, color: C.main}), cell("6"), cell("12"), highlight("8"), cell("+100%",{color:"2E7D32",bold:true}), cell("-33%",{color:"C62828"}), cellL("未導入自治体の入口",{fontSize:9})],
  [cellL("④構築",{bold:true, color: C.main}), cell("73"), cell("133"), highlight("142"), cell("+82%",{color:"2E7D32",bold:true}), cell("+7%"), cellL("最大ボリュームゾーン",{fontSize:9})],
  [cellL("⑤運用",{bold:true, color: C.main}), cell("42"), cell("67"), highlight("68"), cell("+60%",{color:"2E7D32",bold:true}), cell("+1%"), cellL("ストック型。毎年積み上げ",{fontSize:9})],
  [highlightL("合計"), highlight("131"), highlight("233"), highlight("247"), highlight("+78%"), highlight("+6%"), highlightL("")],
];

s3.addTable(phaseRows, {
  x: 0.4, y: 1.0, w: 9.2, h: 2.8,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.4, 0.9, 0.9, 0.9, 1.0, 1.0, 3.1]
});

// Amount table
s3.addText("落札金額（金額判明分のみ）", {
  x: 0.4, y: 3.9, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.text, fontFace: F
});

const amtRows = [
  [hdr("年度"), hdr("①研修"), hdr("②設計"), hdr("③PoC"), hdr("④構築"), hdr("⑤運用"), hdr("合計")],
  [cellL("FY2023",{bold:true}), cell("10万"), cell("-"), cell("3,173万"), cell("3.7億"), cell("2.4億"), highlight("6.4億")],
  [cellL("FY2024",{bold:true}), cell("6,050万"), cell("-"), cell("4,274万"), cell("4.5億"), cell("4.6億"), highlight("10.1億")],
  [highlightL("FY2025"), highlight("8,834万"), highlight("-"), highlight("1,400万"), highlight("2.0億"), highlight("11.6億"), highlight("14.6億")],
];

s3.addTable(amtRows, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.2,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle"
});

// ==============================
// Slide 4: FY2026 見通し — 3シナリオ
// ==============================
let s4 = pres.addSlide();
addHeader(s4, "FY2026 見通し — フェーズ別推計");

// Drivers
s4.addText("成長ドライバー", {
  x: 0.4, y: 0.9, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.main, fontFace: F
});

const drivers = [
  ["AI法施行(2025/9)", "自治体のAI活用が「責務」に"],
  ["第2世代交付金 2,000億円", "前年比倍増、予算の裏付け"],
  ["ガバメントAI「源内」", "2026年度自治体展開予定"],
  ["市区町村の70%が未導入", "巨大な潜在需要"],
];
drivers.forEach((d, i) => {
  const y = 1.2 + i * 0.28;
  s4.addText(`✓  ${d[0]}`, { x: 0.5, y, w: 3.5, h: 0.25, fontSize: 10, bold: true, color: C.text, fontFace: F });
  s4.addText(d[1], { x: 4.0, y, w: 5, h: 0.25, fontSize: 10, color: C.sub, fontFace: F });
});

// 3 scenario cards
const scenarios = [
  { label: "保守的", growth: "+10%", cases: "~292件", market: "~22億円", bg: C.light },
  { label: "基本", growth: "+25%", cases: "~322件", market: "~24億円", bg: "EDF7FA" },
  { label: "楽観的", growth: "+40%", cases: "~352件", market: "~27億円", bg: C.light },
];
scenarios.forEach((sc, i) => {
  const x = 0.5 + i * 3.1;
  s4.addShape(pres.ShapeType.rect, {
    x, y: 2.45, w: 2.9, h: 1.3,
    fill: { color: sc.bg },
    line: { color: i === 1 ? C.main : C.border, pt: i === 1 ? 2 : 0.5 }
  });
  if (i === 1) {
    s4.addShape(pres.ShapeType.rect, { x: x + 1.9, y: 2.45, w: 0.95, h: 0.3, fill: { color: C.orange } });
    s4.addText("推奨", { x: x + 1.9, y: 2.47, w: 0.95, h: 0.27, fontSize: 10, bold: true, color: C.white, fontFace: F, align: "center" });
  }
  s4.addText(sc.label, { x: x + 0.15, y: 2.5, w: 1.5, h: 0.3, fontSize: 14, bold: true, color: i === 1 ? C.main : C.sub, fontFace: F });
  s4.addText(sc.growth, { x: x + 0.15, y: 2.8, w: 1.5, h: 0.25, fontSize: 11, color: C.sub, fontFace: F });
  s4.addText(sc.cases, { x: x + 0.15, y: 3.1, w: 2.6, h: 0.3, fontSize: 20, bold: true, color: C.text, fontFace: F });
  s4.addText(sc.market, { x: x + 0.15, y: 3.4, w: 2.6, h: 0.25, fontSize: 13, color: C.sub, fontFace: F });
});

// Phase breakdown (basic scenario)
const fy26Rows = [
  [hdr("フェーズ"), hdr("FY2025\n実績"), hdr("FY2026\n推計"), hdr("想定単価"), hdr("推計金額"), hdr("成長ドライバー")],
  [cellL("①研修",{bold:true}), cell("20件"), highlight("~36件"), cell("550万"), cell("~2.0億"), cellL("AI法→全職員研修",{fontSize:9})],
  [cellL("②設計",{bold:true}), cell("9件"), highlight("~14件"), cell("-"), cell("-"), cellL("RFI発出増→翌年構築化",{fontSize:9})],
  [cellL("③PoC",{bold:true}), cell("8件"), highlight("~14件"), cell("450万"), cell("~0.6億"), cellL("未導入自治体の入口",{fontSize:9})],
  [cellL("④構築",{bold:true}), cell("142件"), highlight("~170件"), cell("650万"), cell("~11.1億"), cellL("RAG・全庁導入が本格化",{fontSize:9})],
  [cellL("⑤運用",{bold:true}), cell("68件"), highlight("~88件"), cell("1,200万"), cell("~10.6億"), cellL("FY24-25構築→運用移行",{fontSize:9})],
  [highlightL("合計"), highlight("247件"), highlight("~322件"), highlight(""), highlight("~24億円"), highlightL("")],
];

s4.addTable(fy26Rows, {
  x: 0.3, y: 3.95, w: 9.4, h: 1.55,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.1, 0.9, 0.9, 1.0, 1.0, 4.5]
});

// ==============================
// Slide 5: ④構築 サブカテゴリ分析
// ==============================
let s5 = pres.addSlide();
addHeader(s5, "④構築 サブカテゴリ別分析");

s5.addText("構築案件342件の内訳 — 年度推移と平均単価", {
  x: 0.4, y: 0.85, w: 8, h: 0.25, fontSize: 11, color: C.sub, fontFace: F
});

const subRows = [
  [hdr("サブカテゴリ",{fontSize:9}), hdr("FY23",{fontSize:9}), hdr("FY24",{fontSize:9}), hdr("FY25\n推計",{fontSize:9}), hdr("FY26\n推計",{fontSize:9}), hdr("平均単価",{fontSize:9}), hdr("トレンド",{fontSize:9})],
  [cellL("チャットボット",{bold:true}), cell("49"), cell("39"), cell("35"), highlight("~38"), cell("696万"), cellL("減少傾向。市場飽和",{fontSize:9})],
  [cellL("生成AIサービス導入",{bold:true}), cell("6"), cell("26"), cell("38"), highlight("~51"), cell("422万"), cellL("毎年急増。SaaS型主流化",{fontSize:9,color:"2E7D32",bold:true})],
  [cellL("庁内生成AI環境",{bold:true}), cell("7"), cell("30"), cell("25"), highlight("~28"), cell("505万"), cellL("FY24爆発→安定",{fontSize:9})],
  [cellL("RAG構築",{bold:true}), cell("1"), cell("8"), cell("8"), highlight("~9"), cell("632万"), cellL("FY24急増→定着",{fontSize:9,color:"2E7D32",bold:true})],
  [cellL("活用支援・コンサル",{bold:true}), cell("1"), cell("8"), cell("8"), highlight("~9"), cell("2,065万",{bold:true,color:C.main}), cellL("高単価。推進事業",{fontSize:9})],
  [cellL("教育・学校AI",{bold:true}), cell("1"), cell("5"), cell("7"), highlight("~9"), cell("2,169万",{bold:true,color:C.main}), cellL("高単価。英語AI急増",{fontSize:9,color:"2E7D32",bold:true})],
  [cellL("Dify環境構築",{bold:true}), cell("-"), cell("-"), cell("2"), highlight("~3"), cell("697万"), cellL("新興。神戸市が先行",{fontSize:9})],
  [cellL("生成AI（その他）",{bold:true}), cell("7"), cell("13"), cell("14"), highlight("~16"), cell("278万"), cellL("微増",{fontSize:9})],
  [highlightL("合計"), highlight("72"), highlight("132"), highlight("142"), highlight("~170"), highlight(""), highlightL("")],
];

s5.addTable(subRows, {
  x: 0.3, y: 1.15, w: 9.4, h: 3.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.8, 0.6, 0.6, 0.6, 0.7, 0.9, 4.2]
});

// Key insight
s5.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.3, w: 9.2, h: 1.0,
  fill: { color: "EDF7FA" }, line: { color: C.main, pt: 1.5 }
});
s5.addText("注目ポイント", {
  x: 0.6, y: 4.35, w: 2, h: 0.25, fontSize: 11, bold: true, color: C.main, fontFace: F
});
s5.addText(
  "✓  生成AIサービス導入が最大カテゴリに成長（6→26→38件）。SaaS型の導入が主流化\n" +
  "✓  活用支援・コンサル / 教育・学校AI は件数少ないが平均単価2,000万超の高単価領域\n" +
  "✓  RAG構築（~9件）+ Dify環境構築（~3件）は技術力が差別化要因。NTTグループの強み活用可能",
  { x: 0.6, y: 4.62, w: 8.8, h: 0.65, fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18 }
);

// ==============================
// Slide 6: ④構築 四半期パターン
// ==============================
let s6 = pres.addSlide();
addHeader(s6, "④構築 サブカテゴリ — 四半期パターン（FY2025）");

const q25Rows = [
  [hdr("サブカテゴリ",{fontSize:9}), hdr("Q1\n4-6月",{fontSize:9}), hdr("Q2\n7-9月",{fontSize:9}), hdr("Q3\n10-12月",{fontSize:9}), hdr("Q4\n1-2月*",{fontSize:9}), hdr("年計",{fontSize:9}), hdr("Q1比率",{fontSize:9})],
  [cellL("チャットボット",{bold:true}), cell("11"), cell("12"), cell("5"), cell("4"), highlight("32"), cell("34%")],
  [cellL("生成AIサービス導入",{bold:true}), cell("18"), cell("6"), cell("9"), cell("2"), highlight("35"), cell("51%",{bold:true,color:C.orange})],
  [cellL("庁内生成AI環境",{bold:true}), cell("6"), cell("8"), cell("3"), cell("6"), highlight("23"), cell("26%")],
  [cellL("RAG構築",{bold:true}), cell("-"), cell("2"), cell("4"), cell("1"), highlight("7"), cell("-")],
  [cellL("活用支援・コンサル",{bold:true}), cell("3"), cell("3"), cell("-"), cell("1"), highlight("7"), cell("43%")],
  [cellL("教育・学校AI",{bold:true}), cell("3"), cell("1"), cell("1"), cell("1"), highlight("6"), cell("50%")],
  [cellL("その他",{bold:true}), cell("8"), cell("8"), cell("4"), cell("0"), highlight("20"), cell("40%")],
  [highlightL("合計"), highlight("49"), highlight("40"), highlight("26"), highlight("15"), highlight("130"), highlight("38%")],
];

s6.addTable(q25Rows, {
  x: 0.3, y: 1.0, w: 9.4, h: 2.6,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.8, 1.1, 1.1, 1.1, 1.1, 0.8, 0.8]
});

// Seasonal pattern summary
s6.addText("FY2026 想定スケジュール", {
  x: 0.4, y: 3.8, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.text, fontFace: F
});

const timeline = [
  { q: "Q1 (4-6月)", pct: "~38%", cases: "~65件", note: "年度開始。サービス導入・チャットボットが集中" },
  { q: "Q2 (7-9月)", pct: "~31%", cases: "~53件", note: "AI法施行後の需要。庁内環境構築が増加" },
  { q: "Q3 (10-12月)", pct: "~20%", cases: "~34件", note: "下期予算案件。RAG構築が集中傾向" },
  { q: "Q4 (1-3月)", pct: "~12%", cases: "~18件", note: "来期案件の公示。種まき期" },
];

timeline.forEach((t, i) => {
  const y = 4.15 + i * 0.35;
  const colors = [C.main, "2E7D32", C.gold, C.sub];
  s6.addShape(pres.ShapeType.rect, { x: 0.5, y, w: 0.08, h: 0.3, fill: { color: colors[i] } });
  s6.addText(t.q, { x: 0.7, y, w: 1.5, h: 0.3, fontSize: 10, bold: true, color: C.text, fontFace: F });
  s6.addText(t.pct, { x: 2.2, y, w: 0.7, h: 0.3, fontSize: 10, bold: true, color: colors[i], fontFace: F, align: "center" });
  s6.addText(t.cases, { x: 2.9, y, w: 0.9, h: 0.3, fontSize: 10, color: C.text, fontFace: F, align: "center" });
  s6.addText(t.note, { x: 3.9, y, w: 5.5, h: 0.3, fontSize: 10, color: C.sub, fontFace: F });
});

// ==============================
// Slide 7: 競争環境とNTTグループ実績
// ==============================
let s7 = pres.addSlide();
addHeader(s7, "競争環境と NTTグループ実績");

// Competition stats
s7.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.0, w: 4.2, h: 2.2, fill: { color: C.white }, shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 } });
s7.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.0, w: 0.08, h: 2.2, fill: { color: C.main } });
s7.addText("応札競争環境", { x: 0.75, y: 1.1, w: 3, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });

s7.addText("44%", { x: 0.75, y: 1.5, w: 1.5, h: 0.5, fontSize: 36, bold: true, color: C.main, fontFace: F });
s7.addText("が1社応札", { x: 2.2, y: 1.65, w: 2, h: 0.3, fontSize: 14, color: C.text, fontFace: F });
s7.addText("応札社数データ115件中51件が単独応札。\n参入するだけで落札できる案件が約半数。", {
  x: 0.75, y: 2.1, w: 3.8, h: 0.5, fontSize: 10, color: C.sub, fontFace: F, lineSpacing: 18
});
s7.addText("全606件中、金額判明は290件。\n随意契約・少額案件を含めると市場は2-3倍。", {
  x: 0.75, y: 2.6, w: 3.8, h: 0.4, fontSize: 9, color: C.sub, fontFace: F, lineSpacing: 16
});

// NTT Group stats
s7.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.0, w: 4.3, h: 2.2, fill: { color: C.white }, shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 } });
s7.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.0, w: 0.08, h: 2.2, fill: { color: C.accent } });
s7.addText("NTTグループ実績", { x: 5.45, y: 1.1, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });

s7.addText("24件 / 1.19億円", { x: 5.45, y: 1.5, w: 3.5, h: 0.4, fontSize: 22, bold: true, color: C.main, fontFace: F });
s7.addText("（シェア4.0%）", { x: 5.45, y: 1.9, w: 2, h: 0.25, fontSize: 11, color: C.sub, fontFace: F });

const nttDetail = [
  [hdr("フェーズ",{fontSize:9}), hdr("件数",{fontSize:9}), hdr("金額",{fontSize:9})],
  [cellL("④構築",{fontSize:9}), cell("15件",{fontSize:9}), cell("7,492万",{fontSize:9})],
  [cellL("⑤運用",{fontSize:9}), cell("8件",{fontSize:9}), cell("4,286万",{fontSize:9})],
  [cellL("①研修",{fontSize:9}), cell("1件",{fontSize:9}), cell("161万",{fontSize:9})],
];
s7.addTable(nttDetail, {
  x: 5.45, y: 2.2, w: 3.8, h: 0.9,
  fontFace: F, fontSize: 9, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle"
});

// Strength cards
s7.addText("NTTDXPNの差別化ポイント", {
  x: 0.4, y: 3.4, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.text, fontFace: F
});

const strengths = [
  { title: "閉域網+LGWAN一体提案", detail: "葛飾区: SD-WAN+Cloud Gateway+RAG\n2,530万円落札" },
  { title: "RAG構築力", detail: "北海道: 30種RAG+100GB対応\n2,178万円落札" },
  { title: "ミンクスプラス生成AI", detail: "千葉県: 自社プロダクト+福祉チャットボット\n3,722万円落札" },
];

strengths.forEach((st, i) => {
  const x = 0.5 + i * 3.1;
  s7.addShape(pres.ShapeType.rect, {
    x, y: 3.8, w: 2.9, h: 1.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s7.addShape(pres.ShapeType.rect, { x, y: 3.8, w: 2.9, h: 0.06, fill: { color: C.main } });
  s7.addText(st.title, { x: x + 0.15, y: 3.95, w: 2.6, h: 0.35, fontSize: 12, bold: true, color: C.main, fontFace: F });
  s7.addText(st.detail, { x: x + 0.15, y: 4.35, w: 2.6, h: 0.8, fontSize: 10, color: C.sub, fontFace: F, lineSpacing: 18 });
});

// ==============================
// Slide 8: End
// ==============================
let s8 = pres.addSlide();
s8.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s8.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s8.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// Save
const outDir = path.join(process.env.HOME, "Desktop/obsidian-ttygtd/05_Output/Projects/@Active/NTTDX-Customer-Expansion-Mission/02-materials");
const outPath = path.join(outDir, "FY2026-自治体生成AI案件-フェーズ別見通し.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Generated: ${outPath}`);
});
