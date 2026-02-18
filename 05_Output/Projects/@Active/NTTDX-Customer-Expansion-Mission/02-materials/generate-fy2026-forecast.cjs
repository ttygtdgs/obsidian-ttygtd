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
s1.addText("公共セクター生成AI案件\nFY2026 フェーズ別見通し", {
  x: 0.6, y: 2.0, w: 8, h: 1.0, fontSize: 34, bold: true, color: C.white, fontFace: F, lineSpacing: 45
});
s1.addText("入札キング2,500件分析 + 個別案件調査に基づく市場見通し", {
  x: 0.6, y: 3.1, w: 8, h: 0.4, fontSize: 16, color: C.white, fontFace: F
});
s1.addText("2026年2月18日", {
  x: 0.6, y: 4.9, w: 2, h: 0.3, fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ==============================
// Slide 2: 市場全体像 — 年度成長と発注機関タイプ
// ==============================
let s2 = pres.addSlide();
addHeader(s2, "市場全体像 — 年度成長と発注機関タイプ");

// Big numbers: 3 year trend
const years = [
  { fy: "FY2023", count: "231件", amt: "46.9億円", growth: "" },
  { fy: "FY2024", count: "457件", amt: "102.8億円", growth: "+98%" },
  { fy: "FY2025", count: "495件", amt: "225.1億円*", growth: "+8%" },
];
years.forEach((y, i) => {
  const x = 0.5 + i * 3.1;
  s2.addShape(pres.ShapeType.rect, {
    x, y: 1.0, w: 2.9, h: 1.4,
    fill: { color: i === 2 ? "EDF7FA" : C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s2.addShape(pres.ShapeType.rect, { x, y: 1.0, w: 2.9, h: 0.06, fill: { color: C.main } });
  s2.addText(y.fy, { x: x + 0.15, y: 1.1, w: 1.5, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });
  if (y.growth) {
    s2.addText(y.growth, { x: x + 1.8, y: 1.1, w: 0.9, h: 0.3, fontSize: 12, bold: true, color: "2E7D32", fontFace: F, align: "right" });
  }
  s2.addText(y.count, { x: x + 0.15, y: 1.45, w: 2.6, h: 0.4, fontSize: 28, bold: true, color: C.text, fontFace: F });
  s2.addText(y.amt, { x: x + 0.15, y: 1.9, w: 2.6, h: 0.3, fontSize: 14, color: C.sub, fontFace: F });
  if (i < 2) {
    s2.addText("→", { x: x + 2.85, y: 1.4, w: 0.3, h: 0.5, fontSize: 20, color: C.main, fontFace: F, align: "center" });
  }
});
s2.addText("*FY2025は11ヶ月分（2026年2月時点）。金額にはNEDO等の大型R&D案件を含む", {
  x: 0.5, y: 2.45, w: 8, h: 0.2, fontSize: 8, color: C.sub, fontFace: F
});

// Agency type breakdown table
s2.addText("発注機関タイプ別 内訳", {
  x: 0.4, y: 2.75, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.text, fontFace: F
});

const agencyRows = [
  [hdr("機関タイプ"), hdr("FY2023"), hdr("FY2024"), hdr("FY2025"), hdr("合計"), hdr("構成比")],
  [cellL("都道府県",{bold:true}), cell("43"), cell("80"), highlight("106"), cell("229"), cell("19%")],
  [cellL("市区町村",{bold:true}), cell("67"), cell("143"), highlight("149"), cell("359"), cell("30%")],
  [cellL("国",{bold:true}), cell("28"), cell("73"), highlight("85"), cell("186"), cell("16%")],
  [cellL("独法",{bold:true}), cell("61"), cell("117"), highlight("108"), cell("286"), cell("24%")],
  [cellL("その他",{bold:true}), cell("32"), cell("44"), highlight("47"), cell("123"), cell("10%")],
  [highlightL("合計"), highlight("231"), highlight("457"), highlight("495"), highlight("1,183"), highlight("100%")],
];

s2.addTable(agencyRows, {
  x: 0.4, y: 3.1, w: 5.5, h: 2.1,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.1, 0.8, 0.8, 0.8, 0.8, 0.8]
});

// Pie-chart-like summary cards (right side)
const segments = [
  { label: "自治体", pct: "50%", count: "588件", color: C.main, note: "NTT東支店連携\nの主戦場" },
  { label: "国+独法", pct: "40%", count: "472件", color: C.accent, note: "NTTデータ連携\nで狙える領域" },
  { label: "その他", pct: "10%", count: "123件", color: C.gold, note: "" },
];
segments.forEach((seg, i) => {
  const y = 3.1 + i * 0.7;
  s2.addShape(pres.ShapeType.rect, { x: 6.2, y, w: 0.35, h: 0.55, fill: { color: seg.color } });
  s2.addText(seg.label, { x: 6.65, y, w: 1.0, h: 0.3, fontSize: 11, bold: true, color: C.text, fontFace: F });
  s2.addText(seg.pct, { x: 7.65, y, w: 0.6, h: 0.3, fontSize: 14, bold: true, color: C.text, fontFace: F, align: "center" });
  s2.addText(seg.count, { x: 8.25, y, w: 0.8, h: 0.3, fontSize: 10, color: C.sub, fontFace: F, align: "center" });
  if (seg.note) {
    s2.addText(seg.note, { x: 6.65, y: y + 0.28, w: 2.5, h: 0.3, fontSize: 8, color: C.sub, fontFace: F, lineSpacing: 12 });
  }
});

// ==============================
// Slide 3: フェーズ別 年度推移
// ==============================
let s3 = pres.addSlide();
addHeader(s3, "フェーズ別 — 年度推移と成長率");

const phaseRows = [
  [hdr("フェーズ"), hdr("FY2023"), hdr("FY2024"), hdr("FY2025\n(11ヶ月)"), hdr("FY23→24"), hdr("FY24→25"), hdr("特徴")],
  [cellL("①研修",{bold:true, color: C.main}), cell("5"), cell("17"), highlight("23"), cell("+240%",{color:"2E7D32",bold:true}), cell("+35%"), cellL("AI法施行で需要増",{fontSize:9})],
  [cellL("②設計(RFI)",{bold:true, color: C.main}), cell("6"), cell("9"), highlight("9"), cell("+50%"), cell("±0%"), cellL("翌年構築の先行指標",{fontSize:9})],
  [cellL("③PoC",{bold:true, color: C.main}), cell("20"), cell("53"), highlight("33"), cell("+165%",{color:"2E7D32",bold:true}), cell("-38%",{color:"C62828"}), cellL("国R&D実証が多い",{fontSize:9})],
  [cellL("④構築",{bold:true, color: C.main}), cell("148"), cell("291"), highlight("315"), cell("+97%",{color:"2E7D32",bold:true}), cell("+8%"), cellL("最大ボリュームゾーン",{fontSize:9})],
  [cellL("⑤運用",{bold:true, color: C.main}), cell("52"), cell("87"), highlight("115"), cell("+67%",{color:"2E7D32",bold:true}), cell("+32%",{color:"2E7D32",bold:true}), cellL("ストック型。加速中",{fontSize:9})],
  [highlightL("合計"), highlight("231"), highlight("457"), highlight("495"), highlight("+98%"), highlight("+8%"), highlightL("")],
];

s3.addTable(phaseRows, {
  x: 0.4, y: 1.0, w: 9.2, h: 2.8,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.4, 0.9, 0.9, 0.9, 1.0, 1.0, 3.1]
});

// Amount table
s3.addText("落札金額 合計（カッコ内は金額判明件数 / 全件数）", {
  x: 0.4, y: 3.9, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.text, fontFace: F
});

const amtRows = [
  [hdr("年度"), hdr("①研修"), hdr("②設計"), hdr("③PoC"), hdr("④構築"), hdr("⑤運用"), hdr("合計")],
  [cellL("FY2023",{bold:true}), cell("146万\n(3/5件)",{fontSize:9}), cell("-\n(0/6件)",{fontSize:9}), cell("8.6億\n(18/20件)",{fontSize:9}), cell("36.5億\n(86/148件)",{fontSize:9}), cell("1.7億\n(29/52件)",{fontSize:9}), highlight("46.9億\n(136/231件)",{fontSize:9})],
  [cellL("FY2024",{bold:true}), cell("2,787万\n(9/17件)",{fontSize:9}), cell("-\n(0/9件)",{fontSize:9}), cell("17.8億\n(34/53件)",{fontSize:9}), cell("68.2億\n(147/291件)",{fontSize:9}), cell("16.4億\n(59/87件)",{fontSize:9}), highlight("102.8億\n(249/457件)",{fontSize:9})],
  [highlightL("FY2025"), highlight("8,880万\n(14/23件)",{fontSize:9}), highlight("-\n(0/9件)",{fontSize:9}), highlight("4.5億\n(17/33件)",{fontSize:9}), highlight("188.6億*\n(147/315件)",{fontSize:9}), highlight("31.2億\n(77/115件)",{fontSize:9}), highlight("225.1億\n(255/495件)",{fontSize:9})],
];

s3.addTable(amtRows, {
  x: 0.4, y: 4.2, w: 9.2, h: 1.1,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle"
});

s3.addText("*FY2025④構築にはNEDO大型R&D案件（149.7億等）を含む。中央値: ④構築376万 / ⑤運用341万 / ③PoC1,723万（平均は大型案件で大幅上振れ）", {
  x: 0.4, y: 5.35, w: 9.2, h: 0.2, fontSize: 8, color: C.sub, fontFace: F
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
  ["ガバメントAI「源内」", "2026年度自治体展開＋国機関実証"],
  ["市区町村の70%が未導入", "巨大な潜在需要"],
  ["国機関のAI本格導入", "デジタル庁・財務省等で実証→本番"],
];
drivers.forEach((d, i) => {
  const y = 1.2 + i * 0.26;
  s4.addText(`✓  ${d[0]}`, { x: 0.5, y, w: 3.5, h: 0.23, fontSize: 10, bold: true, color: C.text, fontFace: F });
  s4.addText(d[1], { x: 4.0, y, w: 5, h: 0.23, fontSize: 10, color: C.sub, fontFace: F });
});

// 3 scenario cards
const scenarios = [
  { label: "保守的", growth: "+10%", cases: "~594件", sub1: "自治体~300件", sub2: "国独法~240件", bg: C.light },
  { label: "基本", growth: "+20%", cases: "~648件", sub1: "自治体~330件", sub2: "国独法~260件", bg: "EDF7FA" },
  { label: "楽観的", growth: "+35%", cases: "~729件", sub1: "自治体~370件", sub2: "国独法~290件", bg: C.light },
];
scenarios.forEach((sc, i) => {
  const x = 0.5 + i * 3.1;
  s4.addShape(pres.ShapeType.rect, {
    x, y: 2.55, w: 2.9, h: 1.5,
    fill: { color: sc.bg },
    line: { color: i === 1 ? C.main : C.border, pt: i === 1 ? 2 : 0.5 }
  });
  if (i === 1) {
    s4.addShape(pres.ShapeType.rect, { x: x + 1.9, y: 2.55, w: 0.95, h: 0.3, fill: { color: C.orange } });
    s4.addText("推奨", { x: x + 1.9, y: 2.57, w: 0.95, h: 0.27, fontSize: 10, bold: true, color: C.white, fontFace: F, align: "center" });
  }
  s4.addText(sc.label, { x: x + 0.15, y: 2.6, w: 1.5, h: 0.3, fontSize: 14, bold: true, color: i === 1 ? C.main : C.sub, fontFace: F });
  s4.addText(sc.growth, { x: x + 0.15, y: 2.9, w: 1.5, h: 0.25, fontSize: 11, color: C.sub, fontFace: F });
  s4.addText(sc.cases, { x: x + 0.15, y: 3.2, w: 2.6, h: 0.35, fontSize: 22, bold: true, color: C.text, fontFace: F });
  s4.addText(sc.sub1, { x: x + 0.15, y: 3.55, w: 2.6, h: 0.22, fontSize: 10, color: C.sub, fontFace: F });
  s4.addText(sc.sub2, { x: x + 0.15, y: 3.75, w: 2.6, h: 0.22, fontSize: 10, color: C.sub, fontFace: F });
});

s4.addText("※FY2025推計12ヶ月（~540件）を基準に算出", {
  x: 0.5, y: 4.1, w: 5, h: 0.2, fontSize: 8, color: C.sub, fontFace: F
});

// Phase breakdown (basic scenario)
const fy26Rows = [
  [hdr("フェーズ"), hdr("FY2025\n(推計12ヶ月)"), hdr("FY2026\n推計"), hdr("成長率"), hdr("成長ドライバー")],
  [cellL("①研修",{bold:true}), cell("~25件"), highlight("~40件"), cell("+60%",{bold:true,color:"2E7D32"}), cellL("AI法施行→全職員研修需要",{fontSize:9})],
  [cellL("②設計",{bold:true}), cell("~10件"), highlight("~15件"), cell("+50%"), cellL("ロードマップ策定・RFI発出増",{fontSize:9})],
  [cellL("③PoC",{bold:true}), cell("~36件"), highlight("~52件"), cell("+44%"), cellL("源内実証、市区町村の入口",{fontSize:9})],
  [cellL("④構築",{bold:true}), cell("~344件"), highlight("~410件"), cell("+19%"), cellL("RAG・全庁導入+国機関基盤構築",{fontSize:9})],
  [cellL("⑤運用",{bold:true}), cell("~125件"), highlight("~165件"), cell("+32%",{bold:true,color:"2E7D32"}), cellL("FY24-25構築案件の運用移行",{fontSize:9})],
  [highlightL("合計"), highlight("~540件"), highlight("~682件"), highlight("+26%"), highlightL("")],
];

s4.addTable(fy26Rows, {
  x: 0.3, y: 4.35, w: 9.4, h: 1.2,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.1, 1.1, 1.0, 0.8, 5.4]
});

// ==============================
// Slide 5: ④構築 サブカテゴリ分析
// ==============================
let s5 = pres.addSlide();
addHeader(s5, "④構築 サブカテゴリ別分析");

s5.addText("全公共セクターの構築案件754件の内訳 — 年度推移と単価（中央値/平均）", {
  x: 0.4, y: 0.85, w: 8, h: 0.25, fontSize: 11, color: C.sub, fontFace: F
});

const subRows = [
  [hdr("サブカテゴリ",{fontSize:9}), hdr("FY23",{fontSize:9}), hdr("FY24",{fontSize:9}), hdr("FY25",{fontSize:9}), hdr("合計",{fontSize:9}), hdr("中央値",{fontSize:9}), hdr("平均",{fontSize:9}), hdr("トレンド",{fontSize:9})],
  [cellL("AI（その他）",{bold:true}), cell("46"), cell("88"), highlight("93"), cell("227"), cell("215万"), cell("1,188万",{color:C.sub,fontSize:9}), cellL("平均は大型R&Dで上振れ",{fontSize:9})],
  [cellL("チャットボット",{bold:true}), cell("58"), cell("61"), highlight("51"), cell("170"), cell("336万"), cell("3,259万",{color:C.sub,fontSize:9}), cellL("減少傾向。市場飽和",{fontSize:9})],
  [cellL("生成AI（その他）",{bold:true}), cell("16"), cell("60"), highlight("62"), cell("138"), cell("772万",{bold:true,color:C.main}), cell("1.4億",{color:C.sub,fontSize:9}), cellL("NEDO等で平均大幅上振れ",{fontSize:9})],
  [cellL("生成AIサービス導入",{bold:true}), cell("10"), cell("46"), highlight("58"), cell("114"), cell("428万"), cell("4,905万",{color:C.sub,fontSize:9}), cellL("急成長。SaaS型主流化",{fontSize:9,color:"2E7D32",bold:true})],
  [cellL("RAG構築",{bold:true}), cell("11"), cell("16"), highlight("24"), cell("51"), cell("182万"), cell("427万",{color:C.sub,fontSize:9}), cellL("着実増加。技術差別化",{fontSize:9,color:"2E7D32",bold:true})],
  [cellL("庁内生成AI環境",{bold:true}), cell("4"), cell("9"), highlight("10"), cell("23"), cell("-"), cell("-",{fontSize:9}), cellL("安定推移",{fontSize:9})],
  [cellL("教育・学校AI",{bold:true}), cell("3"), cell("7"), highlight("7"), cell("17"), cell("3,960万",{bold:true,color:C.main}), cell("3,758万",{color:C.sub,fontSize:9}), cellL("高単価。N=3",{fontSize:9})],
  [cellL("活用支援・コンサル",{bold:true}), cell("0"), cell("2"), highlight("8"), cell("10"), cell("254万"), cell("527万",{color:C.sub,fontSize:9}), cellL("急拡大中",{fontSize:9,color:"2E7D32",bold:true})],
  [highlightL("合計"), highlight("148"), highlight("291"), highlight("315"), highlight("754"), highlight("376万"), highlight("6,388万"), highlightL("")],
];

s5.addTable(subRows, {
  x: 0.3, y: 1.15, w: 9.4, h: 3.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.7, 0.5, 0.5, 0.5, 0.55, 0.85, 0.85, 3.95]
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
  "✓  ④構築全体の中央値は376万円（平均6,388万はNEDO等の大型R&Dで上振れ）。NTTDXPNの主戦場はMedium帯\n" +
  "✓  生成AIサービス導入が最大成長カテゴリ（10→46→58件）。中央値428万でSaaS型が主流\n" +
  "✓  教育・学校AI は中央値3,960万の高単価領域。RAG構築は技術差別化で勝負",
  { x: 0.6, y: 4.62, w: 8.8, h: 0.65, fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18 }
);

// ==============================
// Slide 6: 発注機関 × フェーズ マトリクス
// ==============================
let s6 = pres.addSlide();
addHeader(s6, "発注機関タイプ × フェーズ — 攻め筋の見極め");

s6.addText("FY2025実績ベース — セクターごとに狙うフェーズが異なる", {
  x: 0.4, y: 0.85, w: 8, h: 0.25, fontSize: 11, color: C.sub, fontFace: F
});

// Matrix table
const matrixRows = [
  [hdr("フェーズ"), hdr("自治体\n(都道府県+市区町村)"), hdr("国・独法"), hdr("合計"), hdr("自治体\n比率"), hdr("ポイント")],
  [cellL("①研修",{bold:true,color:C.main}), cell("16件",{bold:true}), cell("7件"), highlight("23件"), cell("70%",{bold:true,color:C.main}), cellL("自治体中心。NTT東支店のネタ",{fontSize:9})],
  [cellL("②設計",{bold:true,color:C.main}), cell("7件",{bold:true}), cell("2件"), highlight("9件"), cell("78%",{bold:true,color:C.main}), cellL("ほぼ自治体。翌年案件の予兆",{fontSize:9})],
  [cellL("③PoC",{bold:true,color:C.main}), cell("7件"), cell("26件",{bold:true}), highlight("33件"), cell("21%",{color:"C62828"}), cellL("国R&Dが8割。大型実証案件",{fontSize:9})],
  [cellL("④構築",{bold:true,color:C.main}), cell("151件"), cell("164件",{bold:true}), highlight("315件"), cell("48%"), cellL("自治体・国ほぼ半々",{fontSize:9})],
  [cellL("⑤運用",{bold:true,color:C.main}), cell("73件",{bold:true}), cell("42件"), highlight("115件"), cell("63%",{bold:true,color:C.main}), cellL("自治体ストック収益の柱",{fontSize:9})],
  [highlightL("合計"), highlight("254件"), highlight("241件"), highlight("495件"), highlight("51%"), highlightL("")],
];

s6.addTable(matrixRows, {
  x: 0.3, y: 1.15, w: 9.4, h: 2.2,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border }, valign: "middle",
  colW: [1.0, 1.5, 1.1, 0.8, 0.8, 4.2]
});

// Two insight cards
// Card 1: 自治体
s6.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.55, w: 4.3, h: 1.9,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s6.addShape(pres.ShapeType.rect, { x: 0.5, y: 3.55, w: 0.08, h: 1.9, fill: { color: C.main } });
s6.addText("自治体の攻め方", { x: 0.75, y: 3.65, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });
s6.addText(
  "①研修・②設計が入口（自治体比率70-78%）\n" +
  "→ ④構築へアップセル\n" +
  "→ ⑤運用でストック収益化（63%が自治体）\n\n" +
  "NTT東 支店ロビー活動がキーチャネル\n" +
  "Medium帯（500万〜3,000万）が主戦場",
  { x: 0.75, y: 4.0, w: 3.9, h: 1.3, fontSize: 10, color: C.text, fontFace: F, lineSpacing: 16, valign: "top" }
);

// Card 2: 国・独法
s6.addShape(pres.ShapeType.rect, {
  x: 5.1, y: 3.55, w: 4.3, h: 1.9,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s6.addShape(pres.ShapeType.rect, { x: 5.1, y: 3.55, w: 0.08, h: 1.9, fill: { color: C.accent } });
s6.addText("国・独法の攻め方", { x: 5.35, y: 3.65, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });
s6.addText(
  "③PoCが入口（国比率79%）\n" +
  "→ R&D実証（数億〜数十億円規模）\n" +
  "→ ④構築で半数の164件が国・独法\n\n" +
  "NTTデータ（17件/8.9億）連携がカギ\n" +
  "源内関連案件（デジ庁・財務省）に注目",
  { x: 5.35, y: 4.0, w: 3.9, h: 1.3, fontSize: 10, color: C.text, fontFace: F, lineSpacing: 16, valign: "top" }
);

// ==============================
// Slide 7: 競争環境とNTTグループ実績
// ==============================
let s7 = pres.addSlide();
addHeader(s7, "競争環境と NTTグループ実績");

// Competition stats
s7.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.0, w: 4.2, h: 2.2, fill: { color: C.white }, shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 } });
s7.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.0, w: 0.08, h: 2.2, fill: { color: C.main } });
s7.addText("応札競争環境", { x: 0.75, y: 1.1, w: 3, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });

s7.addText("~49%", { x: 0.75, y: 1.5, w: 1.5, h: 0.5, fontSize: 36, bold: true, color: C.main, fontFace: F });
s7.addText("が1社応札", { x: 2.2, y: 1.65, w: 2, h: 0.3, fontSize: 14, color: C.text, fontFace: F });
s7.addText("参入するだけで落札できる案件が約半数。\n特に地方案件・Medium帯で競争が少ない。", {
  x: 0.75, y: 2.1, w: 3.8, h: 0.5, fontSize: 10, color: C.sub, fontFace: F, lineSpacing: 18
});
s7.addText("全1,207件中、金額判明は約50%（~640件）。\n随意契約・少額案件を含めると市場は2-3倍。", {
  x: 0.75, y: 2.6, w: 3.8, h: 0.4, fontSize: 9, color: C.sub, fontFace: F, lineSpacing: 16
});

// NTT Group stats
s7.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.0, w: 4.3, h: 2.2, fill: { color: C.white }, shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 } });
s7.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.0, w: 0.08, h: 2.2, fill: { color: C.accent } });
s7.addText("NTTグループ実績", { x: 5.45, y: 1.1, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F });

s7.addText("66件 / 14.3億円", { x: 5.45, y: 1.5, w: 3.5, h: 0.4, fontSize: 22, bold: true, color: C.main, fontFace: F });
s7.addText("（シェア5.5%）", { x: 5.45, y: 1.9, w: 2, h: 0.25, fontSize: 11, color: C.sub, fontFace: F });

const nttDetail = [
  [hdr("企業",{fontSize:9}), hdr("件数",{fontSize:9}), hdr("金額",{fontSize:9}), hdr("得意領域",{fontSize:9})],
  [cellL("NTTデータ",{fontSize:9,bold:true}), cell("17件",{fontSize:9}), cell("8.9億",{fontSize:9}), cellL("国機関の大型案件",{fontSize:9})],
  [cellL("NTT東日本",{fontSize:9,bold:true}), cell("11件",{fontSize:9}), cell("1.7億",{fontSize:9}), cellL("自治体④構築",{fontSize:9})],
  [cellL("NTTコム東海",{fontSize:9,bold:true}), cell("7件",{fontSize:9}), cell("3,011万",{fontSize:9}), cellL("愛知・三重自治体",{fontSize:9})],
  [cellL("その他NTT",{fontSize:9}), cell("31件",{fontSize:9}), cell("3.7億",{fontSize:9}), cellL("各種",{fontSize:9})],
];
s7.addTable(nttDetail, {
  x: 5.45, y: 2.15, w: 3.8, h: 1.0,
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
// Slide 8: 攻め方整理
// ==============================
let s8 = pres.addSlide();
addHeader(s8, "案件獲得 — 攻め方整理");

// 全体像: 3つのチャネル
s8.addText("獲得チャネル", {
  x: 0.4, y: 0.9, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.main, fontFace: F
});

// Channel 1: 入札キング
const chX1 = 0.5;
s8.addShape(pres.ShapeType.rect, {
  x: chX1, y: 1.25, w: 2.9, h: 2.2,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s8.addShape(pres.ShapeType.rect, { x: chX1, y: 1.25, w: 2.9, h: 0.06, fill: { color: C.main } });
s8.addText("① 入札キング", {
  x: chX1 + 0.15, y: 1.4, w: 2.6, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F
});
s8.addText("モニタリング", {
  x: chX1 + 0.15, y: 1.65, w: 2.6, h: 0.25, fontSize: 11, color: C.sub, fontFace: F
});
s8.addShape(pres.ShapeType.rect, { x: chX1 + 0.15, y: 1.95, w: 2.6, h: 0.015, fill: { color: C.border } });
s8.addText(
  "• 公募案件の週次モニタリング\n" +
  "• 全公共セクター対象\n  （自治体+国+独法 33件が応札可能）\n" +
  "• ~49%が1社応札\n  → 応札するだけで勝てる\n" +
  "• 対象: ④構築・⑤運用",
  { x: chX1 + 0.15, y: 2.0, w: 2.6, h: 1.3, fontSize: 9, color: C.text, fontFace: F, lineSpacing: 14, valign: "top" }
);

// Channel 2: 支店ロビー活動
const chX2 = 3.55;
s8.addShape(pres.ShapeType.rect, {
  x: chX2, y: 1.25, w: 2.9, h: 2.2,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 2 }
});
s8.addShape(pres.ShapeType.rect, { x: chX2, y: 1.25, w: 2.9, h: 0.06, fill: { color: C.main } });
// 推奨バッジ
s8.addShape(pres.ShapeType.rect, { x: chX2 + 1.9, y: 1.25, w: 0.95, h: 0.3, fill: { color: C.orange } });
s8.addText("メイン", { x: chX2 + 1.9, y: 1.27, w: 0.95, h: 0.27, fontSize: 10, bold: true, color: C.white, fontFace: F, align: "center" });
s8.addText("② NTT東 支店ロビー", {
  x: chX2 + 0.15, y: 1.4, w: 2.6, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F
});
s8.addText("BI本部経由", {
  x: chX2 + 0.15, y: 1.65, w: 2.6, h: 0.25, fontSize: 11, color: C.sub, fontFace: F
});
s8.addShape(pres.ShapeType.rect, { x: chX2 + 0.15, y: 1.95, w: 2.6, h: 0.015, fill: { color: C.border } });
s8.addText(
  "• BI本部にAI商材を打ち込み\n" +
  "• 支店長勉強会でネタ提供\n  （井上さん主幹・ネタ募集中）\n" +
  "• 支店営業から案件紹介を獲得\n" +
  "• 対象: ①研修・③PoC → アップセル",
  { x: chX2 + 0.15, y: 2.0, w: 2.6, h: 1.3, fontSize: 9, color: C.text, fontFace: F, lineSpacing: 14, valign: "top" }
);

// Channel 3: 直接アプローチ
const chX3 = 6.6;
s8.addShape(pres.ShapeType.rect, {
  x: chX3, y: 1.25, w: 2.9, h: 2.2,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s8.addShape(pres.ShapeType.rect, { x: chX3, y: 1.25, w: 2.9, h: 0.06, fill: { color: C.main } });
s8.addText("③ 直接アプローチ", {
  x: chX3 + 0.15, y: 1.4, w: 2.6, h: 0.3, fontSize: 13, bold: true, color: C.main, fontFace: F
});
s8.addText("不調案件・既存顧客", {
  x: chX3 + 0.15, y: 1.65, w: 2.6, h: 0.25, fontSize: 11, color: C.sub, fontFace: F
});
s8.addShape(pres.ShapeType.rect, { x: chX3 + 0.15, y: 1.95, w: 2.6, h: 0.015, fill: { color: C.border } });
s8.addText(
  "• 入札不調案件の再公募対応\n  （例: 岡山市）\n" +
  "• NTT東既存自治体顧客への\n  直接提案（千葉県・北海道型）\n" +
  "• 対象: ④構築・⑤運用",
  { x: chX3 + 0.15, y: 2.0, w: 2.6, h: 1.3, fontSize: 9, color: C.text, fontFace: F, lineSpacing: 14, valign: "top" }
);

// Timeline
s8.addText("支店ロビー活動 タイムライン", {
  x: 0.4, y: 3.6, w: 5, h: 0.3, fontSize: 12, bold: true, color: C.text, fontFace: F
});

// Timeline flow
const tlSteps = [
  { label: "3月", sub: "ロビー活動開始", detail: "BI本部へ商材打ち込み\n井上さんへコンタクト", active: false },
  { label: "4月（メイン）", sub: "支店展開", detail: "支店長勉強会で発表\n案件発見チェックリスト配布", active: true },
  { label: "5月〜", sub: "案件紹介開始", detail: "支店営業から案件紹介\n自治体新年度予算執行", active: false },
];
tlSteps.forEach((t, i) => {
  const x = 0.5 + i * 3.1;
  s8.addShape(pres.ShapeType.roundRect, {
    x, y: 3.95, w: 2.9, h: 1.35,
    fill: { color: t.active ? "EDF7FA" : C.light },
    line: { color: t.active ? C.main : C.border, pt: t.active ? 1.5 : 0.5 },
    rectRadius: 0.05
  });
  s8.addText(t.label, {
    x: x + 0.1, y: 4.0, w: 2.7, h: 0.3,
    fontSize: 13, bold: true, color: t.active ? C.main : C.text, fontFace: F
  });
  s8.addText(t.sub, {
    x: x + 0.1, y: 4.3, w: 2.7, h: 0.25,
    fontSize: 10, bold: true, color: C.sub, fontFace: F
  });
  s8.addShape(pres.ShapeType.rect, { x: x + 0.1, y: 4.58, w: 2.7, h: 0.012, fill: { color: C.border } });
  s8.addText(t.detail, {
    x: x + 0.1, y: 4.62, w: 2.7, h: 0.6,
    fontSize: 9, color: C.text, fontFace: F, lineSpacing: 15, valign: "top"
  });
  if (i < tlSteps.length - 1) {
    s8.addText("→", { x: x + 2.85, y: 4.3, w: 0.3, h: 0.4, fontSize: 18, color: C.main, fontFace: F, align: "center" });
  }
});

// ==============================
// Slide 9: End
// ==============================
let s9 = pres.addSlide();
s9.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s9.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s9.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// Save
const outDir = path.join(process.env.HOME, "Desktop/obsidian-ttygtd/05_Output/Projects/@Active/NTTDX-Customer-Expansion-Mission/02-materials");
const outPath = path.join(outDir, "FY2026-公共セクター生成AI案件-フェーズ別見通し.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Generated: ${outPath}`);
});
