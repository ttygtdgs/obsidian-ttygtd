const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = "公募案件分析レポート";
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

// ========== 表紙 ==========
let s1 = pres.addSlide();
s1.background = { path: `${assets}/bg-title.png` };
s1.addText("顧客接点拡大ミッション", {
  x: 0.6, y: 1.6, w: 8, h: 0.5,
  fontSize: 20, color: C.accent, fontFace: F
});
s1.addText("公募案件分析レポート", {
  x: 0.6, y: 2.0, w: 8, h: 0.7,
  fontSize: 36, bold: true, color: C.white, fontFace: F
});
s1.addText("入札王データに基づく市場動向分析", {
  x: 0.6, y: 2.7, w: 8, h: 0.4,
  fontSize: 18, color: C.white, fontFace: F
});
s1.addText("2026年1月", {
  x: 0.6, y: 4.9, w: 2, h: 0.3,
  fontSize: 12, color: C.white, fontFace: F
});
s1.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });

// ========== 概要 ==========
let s2 = pres.addSlide();
addHeader(s2, "分析概要");

// サマリーカード
const summaryData = [
  { label: "総案件数", value: "849件", sub: "ノイズ除去済み" },
  { label: "落札データあり", value: "341件", sub: "金額分析可能" },
  { label: "応札可能", value: "6件", sub: "入札日1/16以降" }
];

summaryData.forEach((item, i) => {
  const x = 0.5 + i * 3.1;
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.1, w: 2.9, h: 1.8,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s2.addShape(pres.ShapeType.rect, {
    x: x, y: 1.1, w: 2.9, h: 0.08, fill: { color: C.main }
  });
  s2.addText(item.label, {
    x: x + 0.15, y: 1.3, w: 2.6, h: 0.4,
    fontSize: 12, color: C.sub, fontFace: F
  });
  s2.addText(item.value, {
    x: x + 0.15, y: 1.7, w: 2.6, h: 0.6,
    fontSize: 32, bold: true, color: C.main, fontFace: F
  });
  s2.addText(item.sub, {
    x: x + 0.15, y: 2.35, w: 2.6, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F
  });
});

// データソース
s2.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.1, w: 9, h: 0.6,
  fill: { color: "EDF7FA" },
  line: { color: C.main, pt: 1 }
});
s2.addText("データソース: 入札王 2026年1月16日ダウンロード（落札データ含む・ノイズ除去済み）", {
  x: 0.7, y: 3.2, w: 8.6, h: 0.4,
  fontSize: 11, color: C.text, fontFace: F
});

// 推奨検索キーワード
s2.addText("推奨検索キーワード", {
  x: 0.5, y: 3.9, w: 3, h: 0.35,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});
s2.addText("Tier1（必須）: 生成AI, RAG, チャットボット\nTier2（補足）: ChatGPT, Dify, プロンプト", {
  x: 0.5, y: 4.25, w: 9, h: 0.6,
  fontSize: 11, color: C.sub, fontFace: F, lineSpacing: 20
});

// ========== キーワード別ヒット数 ==========
let s3 = pres.addSlide();
addHeader(s3, "キーワード別ヒット数");

const keywordRows = [
  [
    { text: "キーワード", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "備考", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "チャットボット", options: { bold: true, align: "left" } },
    { text: "366件", options: { align: "center" } },
    { text: "住民向けサービス含む", options: { align: "left" } }
  ],
  [
    { text: "生成AI", options: { bold: true, color: C.main, fill: "EDF7FA", align: "left" } },
    { text: "333件", options: { fill: "EDF7FA", align: "center", color: C.main, bold: true } },
    { text: "コアターゲット", options: { fill: "EDF7FA", align: "left", color: C.main } }
  ],
  [
    { text: "RAG", options: { bold: true, align: "left" } },
    { text: "16件", options: { align: "center" } },
    { text: "構築案件、増加傾向", options: { align: "left" } }
  ],
  [
    { text: "ChatGPT", options: { bold: true, align: "left" } },
    { text: "9件", options: { align: "center" } },
    { text: "製品名指定案件", options: { align: "left" } }
  ],
  [
    { text: "プロンプト", options: { bold: true, align: "left" } },
    { text: "7件", options: { align: "center" } },
    { text: "研修系", options: { align: "left" } }
  ],
  [
    { text: "Dify", options: { bold: true, align: "left" } },
    { text: "2件", options: { align: "center" } },
    { text: "新興、注目", options: { align: "left" } }
  ]
];

s3.addTable(keywordRows, {
  x: 0.5, y: 1.05, w: 9, h: 2.8,
  fontFace: F, fontSize: 12, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [2.5, 1.5, 5]
});

// 注釈
s3.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 4.1, w: 9, h: 0.7,
  fill: { color: "FFF8E1" },
  line: { color: C.gold, pt: 1 }
});
s3.addText("💡 ポイント", {
  x: 0.7, y: 4.2, w: 2, h: 0.25,
  fontSize: 11, bold: true, color: C.orange, fontFace: F
});
s3.addText("「生成AI」「チャットボット」が主要キーワード。RAGは件数少ないが増加傾向にあり注目", {
  x: 0.7, y: 4.45, w: 8.5, h: 0.3,
  fontSize: 11, color: C.text, fontFace: F
});

// ========== 年次推移 ==========
let s4 = pres.addSlide();
addHeader(s4, "キーワード別 年次推移");

const trendRows = [
  [
    { text: "年", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "生成AI", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "RAG", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "チャットボット", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "ChatGPT", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "Dify", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "2023", options: { align: "center" } },
    { text: "8", options: { align: "center" } },
    { text: "0", options: { align: "center" } },
    { text: "45", options: { align: "center" } },
    { text: "0", options: { align: "center" } },
    { text: "0", options: { align: "center" } }
  ],
  [
    { text: "2024", options: { align: "center", fill: "EDF7FA" } },
    { text: "73", options: { align: "center", fill: "EDF7FA", bold: true, color: C.main } },
    { text: "3", options: { align: "center", fill: "EDF7FA" } },
    { text: "48", options: { align: "center", fill: "EDF7FA" } },
    { text: "2", options: { align: "center", fill: "EDF7FA" } },
    { text: "0", options: { align: "center", fill: "EDF7FA" } }
  ],
  [
    { text: "2025", options: { align: "center" } },
    { text: "98", options: { align: "center", bold: true, color: C.main } },
    { text: "8", options: { align: "center", bold: true, color: C.main } },
    { text: "43", options: { align: "center" } },
    { text: "1", options: { align: "center" } },
    { text: "2", options: { align: "center" } }
  ],
  [
    { text: "2026", options: { align: "center", fill: C.light } },
    { text: "2", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } },
    { text: "0", options: { align: "center", fill: C.light } }
  ]
];

s4.addTable(trendRows, {
  x: 0.5, y: 1.05, w: 9, h: 2.0,
  fontFace: F, fontSize: 12, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle"
});

// トレンド分析
s4.addText("トレンド分析", {
  x: 0.5, y: 3.2, w: 3, h: 0.35,
  fontSize: 14, bold: true, color: C.text, fontFace: F
});

const trends = [
  { kw: "生成AI", desc: "2024年に爆発的成長（8→73件、+812%）、2025年も継続成長" },
  { kw: "RAG", desc: "2024年から登場、2025年に3倍増 → 今後の注目領域" },
  { kw: "チャットボット", desc: "横ばい〜微減 → 成熟市場、差別化が必要" },
  { kw: "Dify", desc: "2025年10月から登場 → 新興、要ウォッチ" }
];

trends.forEach((t, i) => {
  s4.addText(`• ${t.kw}: `, {
    x: 0.5, y: 3.55 + i * 0.35, w: 1.5, h: 0.3,
    fontSize: 11, bold: true, color: C.main, fontFace: F
  });
  s4.addText(t.desc, {
    x: 1.8, y: 3.55 + i * 0.35, w: 7.5, h: 0.3,
    fontSize: 11, color: C.text, fontFace: F
  });
});

// ========== 落札金額分析 ==========
let s5 = pres.addSlide();
addHeader(s5, "落札金額分析");

// 全体統計
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 4.3, h: 1.6,
  fill: { color: C.white },
  shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
});
s5.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 1.05, w: 0.08, h: 1.6, fill: { color: C.main }
});
s5.addText("全体統計（n=341）", {
  x: 0.75, y: 1.15, w: 3.8, h: 0.35,
  fontSize: 13, bold: true, color: C.main, fontFace: F
});

const stats = [
  { label: "最高", value: "5.09億円" },
  { label: "平均", value: "967万円" },
  { label: "中央値", value: "238万円" }
];
stats.forEach((st, i) => {
  s5.addText(`${st.label}: `, {
    x: 0.75, y: 1.55 + i * 0.35, w: 1.2, h: 0.3,
    fontSize: 11, color: C.sub, fontFace: F
  });
  s5.addText(st.value, {
    x: 1.8, y: 1.55 + i * 0.35, w: 2, h: 0.3,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
});

// 案件タイプ別
const priceRows = [
  [
    { text: "案件タイプ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "平均", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "中央値", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "チャットボット", options: { bold: true, align: "left" } },
    { text: "185", options: { align: "center" } },
    { text: "617万円", options: { align: "right" } },
    { text: "218万円", options: { align: "right", bold: true, color: C.main } }
  ],
  [
    { text: "生成AI導入・構築", options: { bold: true, align: "left" } },
    { text: "123", options: { align: "center" } },
    { text: "1,620万円", options: { align: "right" } },
    { text: "270万円", options: { align: "right", bold: true, color: C.main } }
  ],
  [
    { text: "研修・人材育成", options: { bold: true, align: "left" } },
    { text: "14", options: { align: "center" } },
    { text: "676万円", options: { align: "right" } },
    { text: "371万円", options: { align: "right", bold: true, color: C.main } }
  ],
  [
    { text: "RAG関連", options: { bold: true, align: "left" } },
    { text: "5", options: { align: "center" } },
    { text: "229万円", options: { align: "right" } },
    { text: "127万円", options: { align: "right", bold: true, color: C.main } }
  ]
];

s5.addTable(priceRows, {
  x: 5.0, y: 1.05, w: 4.5, h: 1.8,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle"
});

// 高額案件TOP5
s5.addText("高額案件 TOP5", {
  x: 0.5, y: 2.85, w: 3, h: 0.35,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});

const topDeals = [
  { rank: "1", price: "5.09億円", org: "東京都", name: "ＴＡＩＭＳ用生成ＡＩツールライセンス", company: "大塚商会" },
  { rank: "2", price: "3.27億円", org: "東京都", name: "都立学校向け生成ＡＩ利用サービス構築", company: "コニカミノルタ" },
  { rank: "3", price: "1.81億円", org: "東京都", name: "都立学校向け生成AI機能改修・運用", company: "コニカミノルタ" },
  { rank: "4", price: "1.71億円", org: "東京都", name: "チャットボット拡張及び運用保守", company: "富士通Japan" },
  { rank: "5", price: "1.53億円", org: "東京都", name: "チャットボット拡張及び運用保守", company: "富士通Japan" }
];

topDeals.forEach((deal, i) => {
  const y = 3.2 + i * 0.4;
  s5.addText(deal.rank, {
    x: 0.5, y: y, w: 0.4, h: 0.35,
    fontSize: 12, bold: true, color: C.main, fontFace: F, align: "center"
  });
  s5.addText(deal.price, {
    x: 0.9, y: y, w: 1.1, h: 0.35,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  s5.addText(deal.company, {
    x: 2.0, y: y, w: 1.8, h: 0.35,
    fontSize: 10, bold: true, color: C.main, fontFace: F
  });
  s5.addText(deal.name, {
    x: 3.8, y: y, w: 5.7, h: 0.35,
    fontSize: 10, color: C.text, fontFace: F
  });
});

// ========== 落札企業ランキング ==========
let s5b = pres.addSlide();
addHeader(s5b, "落札企業ランキング");

// 件数ランキング
s5b.addText("件数ランキング TOP5", {
  x: 0.5, y: 1.05, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});

const countRankRows = [
  [
    { text: "順位", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "企業名", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "平均", options: { fill: C.main, color: C.white, bold: true, align: "right" } }
  ],
  [
    { text: "1", options: { align: "center" } },
    { text: "サイネックス", options: { bold: true, align: "left" } },
    { text: "30件", options: { align: "center" } },
    { text: "120万円", options: { align: "right" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "ビースポーク", options: { bold: true, align: "left" } },
    { text: "27件", options: { align: "center" } },
    { text: "360万円", options: { align: "right" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "シフトプラス", options: { bold: true, align: "left" } },
    { text: "18件", options: { align: "center" } },
    { text: "137万円", options: { align: "right" } }
  ],
  [
    { text: "4", options: { align: "center", fill: "EDF7FA" } },
    { text: "富士通Japan", options: { bold: true, align: "left", fill: "EDF7FA", color: C.main } },
    { text: "17件", options: { align: "center", fill: "EDF7FA" } },
    { text: "5,027万円", options: { align: "right", fill: "EDF7FA", bold: true, color: C.main } }
  ],
  [
    { text: "5", options: { align: "center" } },
    { text: "イマクリエ", options: { bold: true, align: "left" } },
    { text: "17件", options: { align: "center" } },
    { text: "84万円", options: { align: "right" } }
  ]
];

s5b.addTable(countRankRows, {
  x: 0.5, y: 1.4, w: 4.3, h: 2.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.5, 1.8, 0.8, 1.2]
});

// 総額ランキング
s5b.addText("総額ランキング TOP5", {
  x: 5.1, y: 1.05, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});

const amountRankRows = [
  [
    { text: "順位", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "企業名", options: { fill: C.main, color: C.white, bold: true, align: "left" } },
    { text: "総額", options: { fill: C.main, color: C.white, bold: true, align: "right" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } }
  ],
  [
    { text: "1", options: { align: "center", fill: "EDF7FA" } },
    { text: "富士通Japan", options: { bold: true, align: "left", fill: "EDF7FA", color: C.main } },
    { text: "8.5億円", options: { align: "right", fill: "EDF7FA", bold: true, color: C.main } },
    { text: "17件", options: { align: "center", fill: "EDF7FA" } }
  ],
  [
    { text: "2", options: { align: "center" } },
    { text: "大塚商会", options: { bold: true, align: "left" } },
    { text: "5.2億円", options: { align: "right", bold: true } },
    { text: "2件", options: { align: "center" } }
  ],
  [
    { text: "3", options: { align: "center" } },
    { text: "コニカミノルタ", options: { bold: true, align: "left" } },
    { text: "5.1億円", options: { align: "right", bold: true } },
    { text: "3件", options: { align: "center" } }
  ],
  [
    { text: "4", options: { align: "center" } },
    { text: "NTT東日本", options: { bold: true, align: "left" } },
    { text: "1.2億円", options: { align: "right" } },
    { text: "11件", options: { align: "center" } }
  ],
  [
    { text: "5", options: { align: "center" } },
    { text: "ビースポーク", options: { bold: true, align: "left" } },
    { text: "9,725万円", options: { align: "right" } },
    { text: "27件", options: { align: "center" } }
  ]
];

s5b.addTable(amountRankRows, {
  x: 5.1, y: 1.4, w: 4.4, h: 2.0,
  fontFace: F, fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.5, 1.8, 1.3, 0.8]
});

// ========== 競合企業の案件傾向 ==========
let s5c = pres.addSlide();
addHeader(s5c, "競合企業の案件傾向（件数TOP5）");

// 案件傾向テーブル
const companyTrendRows = [
  [
    { text: "企業", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "件数", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "案件タイプ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "主要顧客・特徴", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "サイネックス", options: { bold: true, align: "left" } },
    { text: "30件", options: { align: "center" } },
    { text: "AIチャットボット", options: { align: "center" } },
    { text: "市区町村向け小規模案件（100〜400万円）", options: { align: "left" } }
  ],
  [
    { text: "ビースポーク", options: { bold: true, align: "left" } },
    { text: "27件", options: { align: "center" } },
    { text: "AIチャットボット", options: { align: "center" } },
    { text: "観光・子育て・福祉など特化型", options: { align: "left" } }
  ],
  [
    { text: "シフトプラス", options: { bold: true, align: "left" } },
    { text: "18件", options: { align: "center" } },
    { text: "生成AIサービス", options: { align: "center", color: C.main } },
    { text: "「自治体AI zevo」SaaS展開", options: { align: "left" } }
  ],
  [
    { text: "イマクリエ", options: { bold: true, align: "left" } },
    { text: "17件", options: { align: "center" } },
    { text: "生成AIサービス", options: { align: "center", color: C.main } },
    { text: "LGWAN対応の生成AIライセンス", options: { align: "left" } }
  ],
  [
    { text: "富士通Japan", options: { bold: true, align: "left", fill: "EDF7FA", color: C.main } },
    { text: "17件", options: { align: "center", fill: "EDF7FA" } },
    { text: "大型SI案件", options: { align: "center", fill: "EDF7FA", bold: true } },
    { text: "東京都・大阪府の億単位案件を独占", options: { align: "left", fill: "EDF7FA" } }
  ]
];

s5c.addTable(companyTrendRows, {
  x: 0.5, y: 1.05, w: 9, h: 2.2,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [1.8, 0.8, 1.8, 4.6]
});

// 市場セグメント分析
s5c.addText("市場セグメント分析", {
  x: 0.5, y: 3.4, w: 4, h: 0.35,
  fontSize: 13, bold: true, color: C.text, fontFace: F
});

// 3カラムで市場セグメント
const segments = [
  { title: "チャットボット市場", color: C.accent, companies: "サイネックス\nビースポーク", desc: "中小規模SaaS\n市区町村が中心" },
  { title: "生成AIサービス市場", color: C.gold, companies: "シフトプラス\nイマクリエ", desc: "自治体向けSaaS\nLGWAN対応" },
  { title: "大型SI案件", color: C.main, companies: "富士通Japan", desc: "都道府県レベル\n億単位の案件" }
];

segments.forEach((seg, i) => {
  const x = 0.5 + i * 3.1;
  s5c.addShape(pres.ShapeType.rect, {
    x: x, y: 3.8, w: 2.9, h: 1.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 }
  });
  s5c.addShape(pres.ShapeType.rect, {
    x: x, y: 3.8, w: 2.9, h: 0.06, fill: { color: seg.color }
  });
  s5c.addText(seg.title, {
    x: x + 0.1, y: 3.9, w: 2.7, h: 0.35,
    fontSize: 11, bold: true, color: C.text, fontFace: F
  });
  s5c.addText(seg.companies, {
    x: x + 0.1, y: 4.25, w: 2.7, h: 0.5,
    fontSize: 10, bold: true, color: C.main, fontFace: F, lineSpacing: 14
  });
  s5c.addText(seg.desc, {
    x: x + 0.1, y: 4.75, w: 2.7, h: 0.5,
    fontSize: 9, color: C.sub, fontFace: F, lineSpacing: 14
  });
});

// ========== 応札可能案件 ==========
let s6 = pres.addSlide();
addHeader(s6, "応札可能案件（2026/1/16時点）");

const availableRows = [
  [
    { text: "入札日", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "フェーズ", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "発注機関", options: { fill: C.main, color: C.white, bold: true, align: "center" } },
    { text: "件名", options: { fill: C.main, color: C.white, bold: true, align: "left" } }
  ],
  [
    { text: "1/19", options: { align: "center" } },
    { text: "①研修", options: { align: "center", color: C.main } },
    { text: "東京都", options: { align: "center" } },
    { text: "生成AIを活用した課題解決ワークショップ実施委託", options: { align: "left" } }
  ],
  [
    { text: "1/29", options: { align: "center" } },
    { text: "①研修", options: { align: "center", color: C.main } },
    { text: "佐賀県", options: { align: "center" } },
    { text: "令和7年度生成AI利活用研修委託業務", options: { align: "left" } }
  ],
  [
    { text: "2/06", options: { align: "center" } },
    { text: "④実装", options: { align: "center", color: C.orange } },
    { text: "明日香村", options: { align: "center" } },
    { text: "生成AI英会話システム導入事業（聖徳中学校）", options: { align: "left" } }
  ],
  [
    { text: "2/09", options: { align: "center" } },
    { text: "④実装", options: { align: "center", color: C.orange } },
    { text: "八尾市", options: { align: "center" } },
    { text: "八尾市生成AI導入運用業務", options: { align: "left" } }
  ],
  [
    { text: "2/13", options: { align: "center" } },
    { text: "④実装", options: { align: "center", color: C.orange } },
    { text: "武蔵野市", options: { align: "center" } },
    { text: "FAQ・RAG検索システム提供役務", options: { align: "left" } }
  ],
  [
    { text: "2/18", options: { align: "center", fill: "EDF7FA" } },
    { text: "②設計", options: { align: "center", color: C.main, fill: "EDF7FA", bold: true } },
    { text: "大阪市", options: { align: "center", fill: "EDF7FA" } },
    { text: "令和8年度大阪市における生成AI活用ロードマップ作成支援", options: { align: "left", fill: "EDF7FA" } }
  ]
];

s6.addTable(availableRows, {
  x: 0.5, y: 1.05, w: 9, h: 2.8,
  fontFace: F, fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.border },
  valign: "middle",
  colW: [0.8, 0.9, 1.3, 6]
});

// ========== 最終スライド ==========
let s7 = pres.addSlide();
s7.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main }
});
s7.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.2, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center"
});
s7.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });

// 出力
const outPath = path.join(__dirname, "公募案件分析レポート_NTTDXPN.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => console.error(err));
