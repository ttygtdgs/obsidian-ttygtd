const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NTT DXパートナー";
pres.title = "自治体生成AI入札案件分析";

// NTT DXパートナー ブランドカラー
const colors = {
  mainText: "595959",      // ダークグレー
  accent: "297593",        // ティール
  subText: "7F7F7F",       // ミディアムグレー
  background: "FFFFFF",    // 白
  white: "FFFFFF"
};

const font = "Meiryo UI";
const logoPath = path.join(process.env.HOME, ".claude/skills/nttdx-presentation-template/ntt-dxpartner-pptx/assets/logo.png");

// 共通ヘッダー関数
function addHeader(slide, title) {
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 8, h: 0.6,
    fontSize: 28, bold: true, color: colors.mainText, fontFace: font
  });
  slide.addShape(pres.ShapeType.rect, { x: 0.5, y: 0.9, w: 9, h: 0.03, fill: { color: colors.accent } });
  // ロゴ（右上）
  slide.addImage({ path: logoPath, x: 8.5, y: 0.2, w: 1.3, h: 0.5 });
}

// スライド1: タイトル
let slide1 = pres.addSlide();
slide1.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.accent } });
slide1.addText("自治体生成AI入札案件分析レポート", {
  x: 0.5, y: 2.3, w: 9, h: 1,
  fontSize: 36, bold: true, color: colors.white, fontFace: font
});
slide1.addText("入札キングデータに基づく市場分析とNTTDX戦略提案", {
  x: 0.5, y: 3.4, w: 9, h: 0.5,
  fontSize: 18, color: colors.white, fontFace: font
});
slide1.addText("2026年1月13日", {
  x: 0.5, y: 4.3, w: 9, h: 0.5,
  fontSize: 14, color: colors.white, fontFace: font
});
slide1.addImage({ path: logoPath, x: 8.2, y: 4.5, w: 1.5, h: 0.6 });

// スライド2: エグゼクティブサマリー
let slide2 = pres.addSlide();
addHeader(slide2, "エグゼクティブサマリー");

const summaryData = [
  ["項目", "値"],
  ["総案件数", "234件（2023年6月〜2026年2月）"],
  ["市場トレンド", "2024-2025年で急増、月平均10件超"],
  ["主要地域", "兵庫(18件)、東京(16件)、愛知・大阪(各13件)"],
  ["案件タイプ", "導入38件、研修22件、構築16件"]
];
slide2.addTable(summaryData, {
  x: 0.5, y: 1.2, w: 9, h: 2,
  fontFace: font, fontSize: 14,
  color: colors.mainText,
  border: { pt: 1, color: colors.accent },
  colW: [2, 7],
  fill: { color: colors.background }
});

slide2.addText("NTTDXにとっての機会", {
  x: 0.5, y: 3.4, w: 9, h: 0.4,
  fontSize: 16, bold: true, color: colors.accent, fontFace: font
});
slide2.addText("1. 研修需要の高まり → 研修パッケージA/B/Cの提案チャンス\n2. RAG/Dify案件の増加 → 技術的優位性を活かした提案\n3. LGWAN対応ニーズ → セキュアな環境構築の強み", {
  x: 0.5, y: 3.85, w: 9, h: 1.3,
  fontSize: 13, color: colors.mainText, fontFace: font
});

// スライド3: 地域分布
let slide3 = pres.addSlide();
addHeader(slide3, "地域別分析");

const regionData = [
  ["順位", "地域", "件数", "特徴"],
  ["1", "兵庫県", "18件", "神戸市Dify、姫路市LGWAN案件"],
  ["2", "東京都", "16件", "TAIMS、警視庁案件など大規模"],
  ["3", "愛知県", "13件", "中小企業DX研修、病院AI"],
  ["4", "大阪府", "13件", "大阪市RAG、堺市研修"],
  ["5", "茨城県", "12件", "RAG継続案件（随意契約）"],
  ["6", "三重県", "12件", "市町村案件中心"],
  ["7", "岡山県", "11件", "プロンプト研修継続"]
];
slide3.addTable(regionData, {
  x: 0.5, y: 1.15, w: 9, h: 3,
  fontFace: font, fontSize: 12,
  color: colors.mainText,
  border: { pt: 1, color: colors.accent },
  colW: [0.7, 1.3, 1, 6],
  rowH: 0.38,
  fill: { color: colors.background }
});
slide3.addText("地域により「先進」「成長」「新規参入」のステージが異なる", {
  x: 0.5, y: 4.3, w: 9, h: 0.4,
  fontSize: 12, italic: true, color: colors.subText, fontFace: font
});

// スライド4: 案件タイプ別分析
let slide4 = pres.addSlide();
addHeader(slide4, "案件タイプ別分析");

const typeChartData = [
  { name: "案件数", labels: ["導入", "研修", "構築", "RFI", "RAG", "Bot"], values: [38, 22, 16, 10, 10, 5] }
];
slide4.addChart(pres.ChartType.bar, typeChartData, {
  x: 0.5, y: 1.2, w: 5, h: 3,
  chartColors: [colors.accent],
  showValue: true,
  dataLabelFontSize: 10,
  dataLabelColor: colors.mainText
});

slide4.addText("フェーズ別対応", {
  x: 6, y: 1.2, w: 3.5, h: 0.4,
  fontSize: 14, bold: true, color: colors.accent, fontFace: font
});
slide4.addText("①理解: 研修 22件\n②設計: RFI/RFC 11件\n③検証: PoC 5件\n④実装: 構築/導入 54件\n⑤定着: 運用 8件", {
  x: 6, y: 1.7, w: 3.5, h: 2.5,
  fontSize: 12, fontFace: font, color: colors.mainText
});

// スライド5: 時系列トレンド
let slide5 = pres.addSlide();
addHeader(slide5, "時系列トレンド分析");

const trendData = [
  { name: "案件数", labels: ["2023", "2024", "2025", "2026(1-2月)"], values: [12, 97, 121, 4] }
];
slide5.addChart(pres.ChartType.bar, trendData, {
  x: 0.5, y: 1.2, w: 5, h: 3,
  chartColors: [colors.accent],
  showValue: true,
  dataLabelFontSize: 12,
  dataLabelColor: colors.mainText
});

slide5.addText("ポイント", {
  x: 6, y: 1.2, w: 3.5, h: 0.4,
  fontSize: 14, bold: true, color: colors.accent, fontFace: font
});
slide5.addText("• 2024年: 導入本格化\n  7月(16件)がピーク\n\n• 2025年: さらに加速\n  5月(20件)、3月(18件)\n\n• 季節性: 年度末・新年度に集中", {
  x: 6, y: 1.7, w: 3.5, h: 2.5,
  fontSize: 12, fontFace: font, color: colors.mainText
});

// スライド6: 注目案件（今後アクション可能な案件に修正）
let slide6 = pres.addSlide();
addHeader(slide6, "アクション対象案件");

const highlightData = [
  ["案件名", "発注機関", "入札日", "注目点"],
  ["課題解決ワークショップ実施委託", "東京都", "2026/01/19", "研修案件、あと6日"],
  ["令和7年度生成AI利活用研修", "佐賀県", "2026/01/29", "研修パッケージB向け"],
  ["生成AI英会話システム導入(聖徳中)", "明日香村", "2026/02/06", "教育分野への導入"],
  ["[参考]Dify構築(終了)", "神戸市", "2025/12/10", "落札結果要確認"],
  ["[参考]LGWAN対応(終了)", "姫路市", "2025/12/08", "落札結果要確認"]
];
slide6.addTable(highlightData, {
  x: 0.5, y: 1.1, w: 9, h: 2.6,
  fontFace: font, fontSize: 11,
  color: colors.mainText,
  border: { pt: 1, color: colors.accent },
  colW: [3.5, 1.2, 1.3, 3],
  rowH: 0.42,
  fill: { color: colors.background }
});

slide6.addText("※ 2026年1月13日現在、入札日が今後の案件のみをアクション対象として記載", {
  x: 0.5, y: 3.9, w: 9, h: 0.4,
  fontSize: 11, italic: true, color: colors.subText, fontFace: font
});

// スライド7: NTTDXサービスとのフィット
let slide7 = pres.addSlide();
addHeader(slide7, "NTTDXサービスとのフィット");

const fitData = [
  ["NTTDXメニュー", "対象案件", "件数", "提案優位性"],
  ["研修パッケージA（経営層）", "経営層研修", "5件", "短期導入、横展開可能"],
  ["研修パッケージB（現場）", "プロンプト研修", "15件", "実績豊富、定型化済み"],
  ["研修パッケージC（推進者）", "DX人材育成", "7件", "PoC設計へ接続"],
  ["PoCスターター", "RFI/試行", "15件", "評価設計から伴走"],
  ["本実装プラン", "構築/導入", "54件", "RAG/Dify実装力"]
];
slide7.addTable(fitData, {
  x: 0.5, y: 1.1, w: 9, h: 2.6,
  fontFace: font, fontSize: 11,
  color: colors.mainText,
  border: { pt: 1, color: colors.accent },
  colW: [2.5, 1.8, 1, 3.7],
  rowH: 0.42,
  fill: { color: colors.background }
});

slide7.addText("研修 → PoC → 本実装 のパイプラインで継続受注", {
  x: 0.5, y: 3.9, w: 9, h: 0.4,
  fontSize: 14, bold: true, color: colors.accent, fontFace: font
});

// スライド8: 狙い目・アクション提案
let slide8 = pres.addSlide();
addHeader(slide8, "狙い目地域とアクション提案");

// 優先度A
slide8.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.1, w: 4.3, h: 0.35, fill: { color: colors.accent } });
slide8.addText("優先度A: 即アプローチ", {
  x: 0.6, y: 1.12, w: 4, h: 0.32,
  fontSize: 13, bold: true, color: colors.white, fontFace: font
});
slide8.addText("• 兵庫県: Dify/LGWAN高度案件\n• 茨城県: RAG継続案件のアップセル\n• 岡山県: 研修→導入パイプライン確立", {
  x: 0.5, y: 1.55, w: 4.3, h: 1.2,
  fontSize: 11, fontFace: font, color: colors.mainText
});

// 優先度B
slide8.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.1, w: 4.3, h: 0.35, fill: { color: colors.subText } });
slide8.addText("優先度B: 中期アプローチ", {
  x: 5.3, y: 1.12, w: 4, h: 0.32,
  fontSize: 13, bold: true, color: colors.white, fontFace: font
});
slide8.addText("• 愛知県: 企業DX+自治体両面\n• 長野県: RFI段階から参画\n• 石川県: 復興DX文脈で展開", {
  x: 5.2, y: 1.55, w: 4.3, h: 1.2,
  fontSize: 11, fontFace: font, color: colors.mainText
});

// 即時アクション
slide8.addShape(pres.ShapeType.rect, { x: 0.5, y: 2.9, w: 9, h: 0.35, fill: { color: colors.accent } });
slide8.addText("即時アクション（入札日迫る案件）", {
  x: 0.6, y: 2.92, w: 8.8, h: 0.32,
  fontSize: 13, bold: true, color: colors.white, fontFace: font
});
slide8.addText("1. 東京都ワークショップ: 入札日1/19（あと6日）、研修パッケージB/C\n2. 佐賀県研修案件: 入札日1/29（あと16日）、研修パッケージB\n3. 明日香村英会話システム: 入札日2/6（あと24日）、教育分野導入", {
  x: 0.5, y: 3.35, w: 9, h: 1.1,
  fontSize: 11, fontFace: font, color: colors.mainText
});

// スライド9: まとめ
let slide9 = pres.addSlide();
addHeader(slide9, "まとめ");

slide9.addText("市場機会", {
  x: 0.5, y: 1.15, w: 9, h: 0.35,
  fontSize: 16, bold: true, color: colors.accent, fontFace: font
});
slide9.addText("• 自治体生成AI市場は2024-2025年で急成長、今後も継続見込み\n• 「研修→PoC→本実装→運用」のパイプライン確立\n• RAG、Dify、LGWAN対応が技術キーワード", {
  x: 0.5, y: 1.55, w: 9, h: 1.1,
  fontSize: 13, fontFace: font, color: colors.mainText
});

slide9.addText("NTTDXの強み活用", {
  x: 0.5, y: 2.75, w: 9, h: 0.35,
  fontSize: 16, bold: true, color: colors.accent, fontFace: font
});
slide9.addText("• 研修実績 → 入口案件として獲得し継続案件へ\n• 技術力（RAG/Dify） → 高度案件での差別化\n• NTT東連携 → 地域密着の営業力と組み合わせ", {
  x: 0.5, y: 3.15, w: 9, h: 1.1,
  fontSize: 13, fontFace: font, color: colors.mainText
});

slide9.addShape(pres.ShapeType.rect, { x: 0.5, y: 4.35, w: 9, h: 0.45, fill: { color: colors.accent } });
slide9.addText("Next: 東京都(1/19)・佐賀県(1/29)案件への提案準備", {
  x: 0.6, y: 4.4, w: 8.8, h: 0.4,
  fontSize: 13, bold: true, color: colors.white, fontFace: font
});

// 保存
const outputPath = process.env.HOME + "/Desktop/入札キング分析_NTTDX顧客接点拡大.pptx";
pres.writeFile({ fileName: outputPath })
  .then(() => console.log("PowerPoint created: " + outputPath))
  .catch(err => console.error(err));
