const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ============================================================
// データ利活用のススメ - NTTDXPN フォーマット
// SAPPORO DATA IDEATHON 2026
// ============================================================

// --- 環境チェック ---
if (!process.env.HOME) {
  console.error("Error: HOME environment variable is not defined.");
  process.exit(1);
}

const assetsPath = path.join(process.env.HOME, ".claude/skills/ntt-dxpartner-pptx/assets");

// --- アセット存在チェック ---
const requiredAssets = ["bg-title.png", "bg-content.png"];
for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(assetsPath, asset))) {
    console.error(`Error: Required asset not found: ${path.join(assetsPath, asset)}`);
    process.exit(1);
  }
}

// ============================================================
// ブランド定義（2026年1月版 当日資料フォーマット準拠）
// ============================================================

const Brand = {
  colors: {
    main: "297593",        // ティール（アクセントカラー）
    accent1: "6CE6E8",
    accent2: "48FAF6",
    accent3: "C1E4F5",
    gold: "F3C551",
    orange: "FCAE3B",
    text: "595959",        // メインテキスト（65%グレー）
    subText: "7F7F7F",     // サブテキスト
    lineGray: "808080",    // 装飾線（グレー）
    white: "FFFFFF",
    copyright: "898989"    // コピーライト文字色
  },
  font: "Meiryo UI"
};

const Layout = {
  slide: { width: 10, height: 5.625 },
  header: {
    // 新フォーマット: タイトルは左上（ロゴなし）
    title: { x: 0.43, y: 0.07, w: 9.0, h: 0.4, fontSize: 24.0 },
    // 装飾線（左上の3本の縦線）
    decorLines: {
      line1: { x: 0.36, y: 0.3, h: 0.28 },
      line2: { x: 0.40, y: 0.32, h: 0.28 },
      line3: { x: 0.44, y: 0.35, h: 0.28 }
    },
    // タイトル下の横線
    underline1: { x: 0.12, y: 0.4, w: 2.9 },
    underline2: { x: 0.22, y: 0.44, w: 2.2 },
    underline3: { x: 0.18, y: 0.48, w: 2.55 }
  },
  content: { startY: 0.7, margin: 0.5 },
  title: {
    mainTitle: { x: 0.55, y: 1.25, w: 9, h: 0.9, fontSize: 40 },
    subTitle: { x: 0.55, y: 2.2, w: 9, h: 0.6, fontSize: 20 },
    event: { x: 0.41, y: 3.95, w: 9, h: 0.5, fontSize: 20 },
    date: { x: 0.41, y: 4.4, w: 9, h: 0.4, fontSize: 20 },
    logo: { x: 7.3, y: 4.6 }
  },
  footer: {
    copyright: { x: -0.02, y: 5.45, w: 9.3, h: 0.17, fontSize: 8 }
  }
};

// ============================================================
// 共通関数
// ============================================================

function addContentSlide(pres, title, contentFn) {
  const slide = pres.addSlide();
  // 背景は白（新テンプレートは背景画像なし）
  slide.background = { color: Brand.colors.white };

  // 装飾線（左上の3本のティール縦線）
  const lineWidth = 0.005;
  [Layout.header.decorLines.line1, Layout.header.decorLines.line2, Layout.header.decorLines.line3].forEach(line => {
    slide.addShape(pres.ShapeType.line, {
      x: line.x, y: line.y, w: lineWidth, h: line.h,
      line: { color: Brand.colors.main, width: 0.5 }
    });
  });

  // タイトル下の横線（グレー）
  [Layout.header.underline1, Layout.header.underline2, Layout.header.underline3].forEach(ul => {
    slide.addShape(pres.ShapeType.line, {
      x: ul.x, y: ul.y, w: ul.w, h: 0,
      line: { color: Brand.colors.lineGray, width: 0.5 }
    });
  });

  // タイトル
  slide.addText(title, {
    x: Layout.header.title.x, y: Layout.header.title.y,
    w: Layout.header.title.w, h: Layout.header.title.h,
    fontSize: Layout.header.title.fontSize,
    bold: true, color: Brand.colors.text, fontFace: Brand.font
  });

  // コピーライト（下部）
  slide.addText("Copyright © 2026, NTT DXPartner Co.,Ltd , All rights reserved.", {
    x: Layout.footer.copyright.x, y: Layout.footer.copyright.y,
    w: Layout.footer.copyright.w, h: Layout.footer.copyright.h,
    fontSize: Layout.footer.copyright.fontSize,
    color: Brand.colors.copyright, fontFace: Brand.font
  });

  if (contentFn) contentFn(slide);
  return slide;
}

function addSectionSlide(pres, sectionTitle, subText) {
  const slide = pres.addSlide();
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: Brand.colors.main }
  });
  slide.addText(sectionTitle, {
    x: 0.5, y: 2.0, w: 9, h: 1,
    fontSize: 36, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center"
  });
  if (subText) {
    slide.addText(subText, {
      x: 0.5, y: 3.2, w: 9, h: 0.6,
      fontSize: 20, color: Brand.colors.accent1, fontFace: Brand.font, align: "center"
    });
  }
  return slide;
}

function tableHeader(cols) {
  return cols.map(text => ({
    text,
    options: { bold: true, fill: { color: Brand.colors.main }, color: Brand.colors.white }
  }));
}

// ペルソナスライド追加関数
function addPersonaSlide(pres, personaData) {
  const slide = pres.addSlide();
  slide.background = { path: path.join(assetsPath, "bg-content.png") };

  // ヘッダー: タイトル
  slide.addText(personaData.title, {
    x: 0.4, y: 0.25, w: 7, h: 0.5,
    fontSize: 24, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 0.75, w: 9.2, h: 0.025, fill: { color: Brand.colors.main }
  });

  // 左側: 丸型写真プレースホルダー
  slide.addShape(pres.ShapeType.ellipse, {
    x: 0.6, y: 1.1, w: 1.6, h: 1.6,
    fill: { color: "D0D0D0" },
    line: { color: Brand.colors.main, pt: 2 }
  });
  slide.addText("写真", {
    x: 0.6, y: 1.7, w: 1.6, h: 0.4,
    fontSize: 12, color: "888888", fontFace: Brand.font, align: "center"
  });

  // 左側: 基本情報テーブル
  const basicInfoRows = personaData.basicInfo.map(row => [
    { text: row[0], options: { bold: true, fill: { color: "FFFFFF" }, color: Brand.colors.text } },
    { text: row[1], options: { fill: { color: "FFFFFF" }, color: Brand.colors.text } }
  ]);
  slide.addTable(basicInfoRows, {
    x: 0.4, y: 2.85, w: 4.0, h: 2.4,
    fontFace: Brand.font, fontSize: 7, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main },
    colW: [1.2, 2.8], valign: "middle",
    fill: { color: "FFFFFF" }
  });

  // 右側: 詳細情報テーブル
  const detailRows = personaData.detailInfo.map(row => [
    { text: row[0], options: { bold: true, fill: { color: "FFFFFF" }, color: Brand.colors.text, valign: "top" } },
    { text: row[1], options: { fill: { color: "FFFFFF" }, color: Brand.colors.text, valign: "top" } }
  ]);
  slide.addTable(detailRows, {
    x: 4.5, y: 1.0, w: 5.0, h: 4.2,
    fontFace: Brand.font, fontSize: 7, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main },
    colW: [1.3, 3.7], valign: "top",
    fill: { color: "FFFFFF" }
  });

  return slide;
}

// ============================================================
// プレゼンテーション生成
// ============================================================

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NTT DXパートナー";
pres.title = "データ利活用のススメ";

// ===== スライド1: タイトル =====
const titleSlide = pres.addSlide();
// 新フォーマット: 白背景
titleSlide.background = { color: Brand.colors.white };

// メインタイトル（太字）
titleSlide.addText("データ利活用のススメ", {
  x: Layout.title.mainTitle.x, y: Layout.title.mainTitle.y,
  w: Layout.title.mainTitle.w, h: Layout.title.mainTitle.h,
  fontSize: Layout.title.mainTitle.fontSize,
  bold: true, color: Brand.colors.text, fontFace: Brand.font
});

// サブタイトル
titleSlide.addText("データで新しい価値を創る", {
  x: Layout.title.subTitle.x, y: Layout.title.subTitle.y,
  w: Layout.title.subTitle.w, h: Layout.title.subTitle.h,
  fontSize: Layout.title.subTitle.fontSize,
  color: Brand.colors.subText, fontFace: Brand.font
});

// 日付と会社名（左下）
titleSlide.addText("2026年2月3日", {
  x: Layout.title.event.x, y: Layout.title.event.y,
  w: Layout.title.event.w, h: Layout.title.event.h,
  fontSize: Layout.title.event.fontSize,
  color: Brand.colors.subText, fontFace: Brand.font
});
titleSlide.addText("株式会社NTT DXパートナー", {
  x: Layout.title.date.x, y: Layout.title.date.y,
  w: Layout.title.date.w, h: Layout.title.date.h,
  fontSize: Layout.title.date.fontSize,
  color: Brand.colors.subText, fontFace: Brand.font
});

// ===== スライド2: 自己紹介 =====
addContentSlide(pres, "自己紹介", slide => {
  slide.addText("後藤田 達哉", {
    x: 0.5, y: 1.3, w: 9, h: 0.6,
    fontSize: 32, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const profileData = [
    tableHeader(["項目", "内容"]),
    ["所属", "株式会社NTT DXパートナー"],
    ["専門", "アプリ開発、生成AI利活用"],
    ["経歴", "通信会社の営業/事業推進 → スタートアップ等でエンジニア、PM"]
  ];
  slide.addTable(profileData, {
    x: 0.5, y: 2.0, w: 9, h: 1.8,
    fontFace: Brand.font, fontSize: 14, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [2, 7]
  });
  slide.addText("→ 今日はデータ分析の楽しさをお伝えします！", {
    x: 0.5, y: 4.0, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド3: アジェンダ =====
addContentSlide(pres, "今日のアジェンダ", slide => {
  slide.addText("80分の流れ", {
    x: 0.5, y: 1.2, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const agenda = [
    { num: "1", title: "身近なデータ活用", time: "15分", detail: "YouTube, TikTok, Amazon の裏側" },
    { num: "2", title: "データセットの理解", time: "10分", detail: "今日使うデータの中身" },
    { num: "3", title: "BIツールの紹介", time: "5分", detail: "Looker Studioでデータを可視化" },
    { num: "4", title: "ハンズオン", time: "10分", detail: "グラフ作成・フィルター・ソートを体験" },
    { num: "5", title: "ワーク", time: "40分", detail: "チームでデータ分析・アイデア検討" }
  ];
  agenda.forEach((item, idx) => {
    const y = 1.8 + idx * 0.65;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fill: { color: Brand.colors.main }
    });
    slide.addText(item.num, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fontSize: 18, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(item.title, {
      x: 1.1, y: y, w: 3, h: 0.5,
      fontSize: 16, bold: true, color: Brand.colors.text, fontFace: Brand.font, valign: "middle"
    });
    slide.addText(`（${item.time}）`, {
      x: 4.1, y: y, w: 1, h: 0.5,
      fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font, valign: "middle"
    });
    slide.addText(item.detail, {
      x: 5.2, y: y, w: 4.3, h: 0.5,
      fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font, valign: "middle"
    });
  });
});

// ===== セクション: 身近なデータ活用 =====
addSectionSlide(pres, "1. 身近なデータ活用", "YouTube, TikTok, Amazon の裏側");

// ===== スライド5: 皆さんのデータ、使われてます =====
addContentSlide(pres, "皆さんのデータ、使われてます", slide => {
  slide.addText("YouTubeのおすすめ動画、なぜ自分好みがわかる？", {
    x: 0.5, y: 1.4, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 2.2, w: 9, h: 1.2,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("答えは簡単：皆さんの行動データを分析しているから", {
    x: 0.7, y: 2.4, w: 8.6, h: 0.8,
    fontSize: 20, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center", valign: "middle"
  });
  slide.addText("普段何気なく使っているサービスの裏側では、\n皆さんのデータが収集・分析されています。", {
    x: 0.5, y: 3.6, w: 9, h: 0.8,
    fontSize: 16, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("→ 今日は、その「データ分析」を皆さんが体験します", {
    x: 0.5, y: 4.5, w: 9, h: 0.5,
    fontSize: 16, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド5-2: いつ同意した？ =====
addContentSlide(pres, "いつ同意した？", slide => {
  slide.addText("実は皆さん、データ収集に「同意」しています", {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const consentTable = [
    tableHeader(["タイミング", "何に同意している？"]),
    ["アプリ初回起動時", "「利用規約に同意」→ データ収集・分析の許可"],
    ["Webサイト訪問時", "「Cookieを許可」→ 閲覧履歴の追跡"],
    ["アカウント作成時", "「プライバシーポリシーに同意」→ 個人情報の利用"],
    ["通知・位置情報の許可", "「許可する」→ リアルタイムデータの取得"]
  ];
  slide.addTable(consentTable, {
    x: 0.5, y: 1.7, w: 9, h: 2.0,
    fontFace: Brand.font, fontSize: 12, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [3, 6]
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.9, w: 9, h: 0.7,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("💡 ほとんどの人は読まずに「同意」している（平均読了時間：数秒）", {
    x: 0.6, y: 4.0, w: 8.8, h: 0.5,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
  slide.addText("→ 便利さと引き換えに、データを提供している", {
    x: 0.5, y: 4.7, w: 9, h: 0.4,
    fontSize: 14, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド5-3: データ分析のサイクル =====
addContentSlide(pres, "データ分析のサイクル", slide => {
  slide.addText("データ活用は「1回きり」ではない", {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  // サイクル図（6ステップ）
  const cycleSteps = [
    { num: "1", label: "データ収集", x: 0.8, y: 1.8 },
    { num: "2", label: "分析", x: 3.3, y: 1.8 },
    { num: "3", label: "課題発見", x: 5.8, y: 1.8 },
    { num: "4", label: "仮説", x: 5.8, y: 3.0 },
    { num: "5", label: "アプローチ", x: 3.3, y: 3.0 },
    { num: "6", label: "検証・改善", x: 0.8, y: 3.0 }
  ];
  cycleSteps.forEach((step, idx) => {
    slide.addShape(pres.ShapeType.roundRect, {
      x: step.x, y: step.y, w: 2.0, h: 0.7,
      fill: { color: Brand.colors.main }, rectRadius: 0.1
    });
    slide.addText(`${step.num}. ${step.label}`, {
      x: step.x, y: step.y, w: 2.0, h: 0.7,
      fontSize: 12, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
  });
  // 矢印（→）
  slide.addText("→", { x: 2.8, y: 1.9, w: 0.5, h: 0.5, fontSize: 20, color: Brand.colors.text, fontFace: Brand.font, align: "center" });
  slide.addText("→", { x: 5.3, y: 1.9, w: 0.5, h: 0.5, fontSize: 20, color: Brand.colors.text, fontFace: Brand.font, align: "center" });
  slide.addText("↓", { x: 7.3, y: 2.5, w: 0.5, h: 0.5, fontSize: 20, color: Brand.colors.text, fontFace: Brand.font, align: "center" });
  slide.addText("←", { x: 5.3, y: 3.1, w: 0.5, h: 0.5, fontSize: 20, color: Brand.colors.text, fontFace: Brand.font, align: "center" });
  slide.addText("←", { x: 2.8, y: 3.1, w: 0.5, h: 0.5, fontSize: 20, color: Brand.colors.text, fontFace: Brand.font, align: "center" });
  slide.addText("↑", { x: 1.3, y: 2.5, w: 0.5, h: 0.5, fontSize: 20, color: Brand.colors.text, fontFace: Brand.font, align: "center" });
  // 説明
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.0, w: 9, h: 1.0,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("このサイクルを高速で回すことで、サービスが進化する\n→ YouTube、TikTok、Amazon も毎日このサイクルを回している", {
    x: 0.6, y: 4.1, w: 8.8, h: 0.8,
    fontSize: 14, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });
});

// ===== スライド6: 事例1 - YouTube =====
addContentSlide(pres, "事例1: YouTube", slide => {
  slide.addText("ペルソナ → 課題 → データ → アプローチ", {
    x: 0.5, y: 1.2, w: 9, h: 0.4,
    fontSize: 14, color: Brand.colors.subText, fontFace: Brand.font
  });
  const ytData = [
    tableHeader(["👤 ペルソナ", "❓ 課題"]),
    ["新しい動画を発見したいユーザー", "見たい動画を探す手間がかかる"]
  ];
  slide.addTable(ytData, {
    x: 0.5, y: 1.7, w: 9, h: 0.8,
    fontFace: Brand.font, fontSize: 13, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  const ytData2 = [
    tableHeader(["📊 データ", "💡 アプローチ"]),
    ["視聴履歴・視聴時間・スキップ位置・いいね/低評価・検索キーワード", "好みに合った動画を自動おすすめ / 興味を引く広告を表示"]
  ];
  slide.addTable(ytData2, {
    x: 0.5, y: 2.7, w: 9, h: 0.9,
    fontFace: Brand.font, fontSize: 12, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.9, w: 9, h: 0.6,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("✓ 結果: 平均視聴時間が大幅向上（気づいたら1時間...）", {
    x: 0.6, y: 4.0, w: 8.8, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド7: YouTube 深掘り =====
addContentSlide(pres, "YouTube 深掘り - データ分析サイクルの実例", slide => {
  slide.addText("YouTubeが実際に回しているサイクル", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  const cycle = [
    { num: "①", title: "データ収集", text: "視聴履歴、視聴時間、スキップ位置、離脱タイミング" },
    { num: "②", title: "分析", text: "「クリックされるけど最後まで見られない動画」が多い" },
    { num: "③", title: "課題発見", text: "クリック数を追うと「釣りタイトル」が増えてしまう" },
    { num: "④", title: "仮説", text: "「視聴時間」を重視すれば良質なコンテンツが増えるのでは？" },
    { num: "⑤", title: "アプローチ", text: "おすすめアルゴリズムを「視聴時間」重視に変更" },
    { num: "⑥", title: "検証", text: "A/Bテストで効果測定 → 平均視聴時間10%向上" }
  ];
  cycle.forEach((item, idx) => {
    const y = 1.45 + idx * 0.48;
    slide.addText(item.num, {
      x: 0.5, y: y, w: 0.4, h: 0.45,
      fontSize: 12, bold: true, color: Brand.colors.main, fontFace: Brand.font, valign: "middle"
    });
    slide.addText(item.title, {
      x: 0.9, y: y, w: 1.5, h: 0.45,
      fontSize: 11, bold: true, color: Brand.colors.text, fontFace: Brand.font, valign: "middle"
    });
    slide.addText(item.text, {
      x: 2.5, y: y, w: 7, h: 0.45,
      fontSize: 11, color: Brand.colors.subText, fontFace: Brand.font, valign: "middle"
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.4, w: 9, h: 0.7,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("→ このサイクルを毎日・毎週回し続けている", {
    x: 0.6, y: 4.5, w: 8.8, h: 0.5,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド8: 事例2 - TikTok =====
addContentSlide(pres, "事例2: TikTok", slide => {
  const ttData = [
    tableHeader(["👤 ペルソナ", "❓ 課題"]),
    ["スキマ時間を楽しみたいZ世代", "短時間で楽しめるコンテンツがほしい"]
  ];
  slide.addTable(ttData, {
    x: 0.5, y: 1.4, w: 9, h: 0.8,
    fontFace: Brand.font, fontSize: 13, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  const ttData2 = [
    tableHeader(["📊 データ", "💡 アプローチ"]),
    ["スワイプ速度・視聴完了率・繰り返し視聴・いいね/コメント/シェア", "For Youページを即座にパーソナライズ / 最初の3秒で興味判定"]
  ];
  slide.addTable(ttData2, {
    x: 0.5, y: 2.4, w: 9, h: 0.9,
    fontFace: Brand.font, fontSize: 12, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.5, w: 9, h: 0.6,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("✓ 結果: 新規ユーザーでも数十分で好みを学習", {
    x: 0.6, y: 3.6, w: 8.8, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("💡 学び: ユーザーは「好き」と言わない。行動データから本音を読み取る設計が重要", {
    x: 0.5, y: 4.3, w: 9, h: 0.5,
    fontSize: 13, italic: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド8-2: 事例3 - Instagram =====
addContentSlide(pres, "事例3: Instagram", slide => {
  const igData = [
    tableHeader(["👤 ペルソナ", "❓ 課題"]),
    ["友達の投稿をチェックしたいユーザー", "見たい投稿を見逃してしまう"]
  ];
  slide.addTable(igData, {
    x: 0.5, y: 1.2, w: 9, h: 0.8,
    fontFace: Brand.font, fontSize: 13, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  const igData2 = [
    tableHeader(["📊 データ", "💡 アプローチ"]),
    ["いいね・コメント・保存・滞在時間・プロフィール訪問・ストーリーズ視聴順", "フィードの表示順を最適化 / 「おすすめ」タブでパーソナライズ / 広告も興味に合わせて表示"]
  ];
  slide.addTable(igData2, {
    x: 0.5, y: 2.2, w: 9, h: 0.9,
    fontFace: Brand.font, fontSize: 11, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.3, w: 9, h: 0.6,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("✓ 結果: 1日の平均利用時間30分以上", {
    x: 0.6, y: 3.4, w: 8.8, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("💡 学び: 「時系列順」ではなく「興味順」で表示することで、見逃しを防ぐ", {
    x: 0.5, y: 4.1, w: 9, h: 0.5,
    fontSize: 13, italic: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド8-3: Instagram 深掘り =====
addContentSlide(pres, "Instagram 深掘り - 「見ただけ」で分かること", slide => {
  slide.addText("Instagramは「いいね」しなくても分析している", {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("あなたの行動データ:", {
    x: 0.5, y: 1.7, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  const behaviors = [
    "投稿を何秒見ていたか（滞在時間）",
    "スクロール速度が遅くなった投稿",
    "拡大した写真・動画",
    "保存したけど「いいね」しなかった投稿",
    "プロフィールを何回訪問したか"
  ];
  behaviors.forEach((b, idx) => {
    slide.addText(`• ${b}`, {
      x: 0.7, y: 2.1 + idx * 0.4, w: 8.8, h: 0.4,
      fontSize: 13, color: Brand.colors.text, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.2, w: 9, h: 0.9,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("→ 「本当に興味があるもの」を行動から推測\n💡 学び: ユーザーの「本音」は言葉ではなく行動に現れる", {
    x: 0.6, y: 4.3, w: 8.8, h: 0.7,
    fontSize: 13, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド9: 事例4 - Amazon =====
addContentSlide(pres, "事例4: Amazon", slide => {
  const amData = [
    tableHeader(["👤 ペルソナ", "❓ 課題"]),
    ["買い物に迷っているユーザー", "何を買えばいいかわからない"]
  ];
  slide.addTable(amData, {
    x: 0.5, y: 1.4, w: 9, h: 0.8,
    fontFace: Brand.font, fontSize: 13, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  const amData2 = [
    tableHeader(["📊 データ", "💡 アプローチ"]),
    ["閲覧履歴・購入履歴・カート放棄・レビュー閲覧時間", "「この商品を買った人は」レコメンド / パーソナライズされたトップページ"]
  ];
  slide.addTable(amData2, {
    x: 0.5, y: 2.4, w: 9, h: 0.9,
    fontFace: Brand.font, fontSize: 12, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [4.5, 4.5]
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.5, w: 9, h: 0.6,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("✓ 結果: 売上の35%がレコメンド経由", {
    x: 0.6, y: 3.6, w: 8.8, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("💡 学び: 「買わなかった」データこそ宝。失敗・離脱のデータから改善のヒントが見つかる", {
    x: 0.5, y: 4.3, w: 9, h: 0.5,
    fontSize: 13, italic: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド9-2: 4つの事例に共通すること =====
addContentSlide(pres, "4つの事例に共通すること", slide => {
  slide.addText("YouTube、TikTok、Instagram、Amazon に共通するポイント", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  const points = [
    { num: "1", title: "データを「集める」だけでなく「回す」", details: "1回分析して終わりではない / 仮説→検証→改善のサイクル" },
    { num: "2", title: "「言葉」より「行動」を見る", details: "アンケートより実際の行動データ / 「見た時間」「スキップ速度」が本音" },
    { num: "3", title: "小さく試して、効果があれば広げる", details: "A/Bテストで比較検証 / 失敗してもデータが残る" }
  ];
  points.forEach((p, idx) => {
    const y = 1.5 + idx * 0.95;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fill: { color: Brand.colors.main }
    });
    slide.addText(p.num, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fontSize: 18, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(p.title, {
      x: 1.1, y: y, w: 8.4, h: 0.4,
      fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(p.details, {
      x: 1.1, y: y + 0.4, w: 8.4, h: 0.45,
      fontSize: 11, color: Brand.colors.subText, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.4, w: 9, h: 0.7,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("→ 今日のアイデアソンでも、この考え方を使おう！", {
    x: 0.6, y: 4.5, w: 8.8, h: 0.5,
    fontSize: 16, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド10: 今日は皆さんがデータを使う側に =====
addContentSlide(pres, "今日は皆さんがデータを使う側に", slide => {
  slide.addText("YouTube/TikTok/Amazon と同じ流れで考える", {
    x: 0.5, y: 1.3, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  // フロー図
  const flowItems = [
    { label: "ペルソナ", sub: "誰に届ける？", color: Brand.colors.main },
    { label: "課題", sub: "何を解決？", color: Brand.colors.accent2 },
    { label: "データ", sub: "何を使う？", color: Brand.colors.gold },
    { label: "アプローチ", sub: "どうやって？", color: Brand.colors.orange }
  ];
  flowItems.forEach((item, idx) => {
    const x = 0.8 + idx * 2.3;
    slide.addShape(pres.ShapeType.rect, {
      x: x, y: 1.9, w: 2, h: 0.8,
      fill: { color: item.color }
    });
    slide.addText(item.label, {
      x: x, y: 1.95, w: 2, h: 0.5,
      fontSize: 14, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center"
    });
    slide.addText(item.sub, {
      x: x, y: 2.4, w: 2, h: 0.3,
      fontSize: 10, color: Brand.colors.white, fontFace: Brand.font, align: "center"
    });
    if (idx < flowItems.length - 1) {
      slide.addText("→", {
        x: x + 2, y: 2.0, w: 0.3, h: 0.6,
        fontSize: 24, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
      });
    }
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.2, w: 9, h: 1,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("今日のアイデアソンでは:\n皆さんはデータを理解し、アプローチを考える", {
    x: 0.7, y: 3.3, w: 8.6, h: 0.8,
    fontSize: 16, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });
  slide.addText("→ この講義では「ペルソナ」と「データ」を理解 → 課題解決のヒントを見つける", {
    x: 0.5, y: 4.4, w: 9, h: 0.5,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== セクション: データセットの理解 =====
addSectionSlide(pres, "2. データセットの理解", "今日使うデータの中身を知る");

// ===== スライド11-2: さっぽろ圏データ取引市場とは？ =====
addContentSlide(pres, "さっぽろ圏データ取引市場とは？", slide => {
  // 説明文
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 1.0, w: 9, h: 0.8,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("さっぽろ圏データ取引市場は、2018年1月に発足した「DATA-SMART CITY SAPPORO」から生まれたプラットフォームです。", {
    x: 0.6, y: 1.1, w: 8.8, h: 0.6,
    fontSize: 14, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });
  // DATA-SMART CITY SAPPORO 画像
  slide.addImage({
    path: path.join(__dirname, "データ取引市場②.png"),
    x: 1.5, y: 2.0, w: 3.5, h: 2.4
  });
  // さっぽろ圏データ取引市場サイト 画像
  slide.addImage({
    path: path.join(__dirname, "データ取引市場③.png"),
    x: 5.2, y: 2.0, w: 4.0, h: 2.4
  });
  // 今日のデータ
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.6, w: 9, h: 0.5,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("今日使うデータも、このプラットフォームから提供されています", {
    x: 0.6, y: 4.65, w: 8.8, h: 0.4,
    fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド12: 今日使うデータセット =====
addContentSlide(pres, "今日使うデータセット", slide => {
  slide.addText("どちらかを選んで取り組みます", {
    x: 0.5, y: 0.9, w: 9, h: 0.3,
    fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font
  });
  slide.addText("A. スポーツデータ（データスタジアム株式会社様 提供）", {
    x: 0.5, y: 1.25, w: 9, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const sportsData = [
    tableHeader(["競技", "データ内容"]),
    ["プロ野球", "選手プロフィール、チーム成績、選手成績、試合情報"],
    ["Jリーグサッカー", "選手プロフィール、チーム成績、選手成績、試合情報、プレー情報（パス・シュート等）"],
    ["Bリーグバスケ", "選手成績、チーム成績、試合情報、選手プロフィール"]
  ];
  slide.addTable(sportsData, {
    x: 0.5, y: 1.65, w: 9, h: 1.4,
    fontFace: Brand.font, fontSize: 11, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [2.5, 6.5]
  });
  slide.addText("B. 地域・事業所データ（タウンページ株式会社様 提供）", {
    x: 0.5, y: 3.25, w: 9, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const townData = [
    tableHeader(["データ", "データ内容"]),
    ["統計情報データ", "地域×業種の集計データ"]
  ];
  slide.addTable(townData, {
    x: 0.5, y: 3.65, w: 9, h: 0.65,
    fontFace: Brand.font, fontSize: 11, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [2.5, 6.5]
  });
});

// ===== セクション: BIツールの紹介 =====
addSectionSlide(pres, "3. BIツールの紹介", "Looker Studioでデータを可視化する");

// ===== スライド13: BIツールとは =====
addContentSlide(pres, "BIツールとは", slide => {
  slide.addText("BI = Business Intelligence", {
    x: 0.5, y: 1.3, w: 9, h: 0.5,
    fontSize: 20, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("データを可視化して意思決定を支援するツール", {
    x: 0.5, y: 1.9, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("できること:", {
    x: 0.5, y: 2.5, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  const features = [
    "データをグラフ・チャートで表示",
    "フィルターで絞り込み",
    "ダッシュボードとして共有"
  ];
  features.forEach((f, idx) => {
    slide.addText(`• ${f}`, {
      x: 0.7, y: 2.9 + idx * 0.4, w: 8.8, h: 0.4,
      fontSize: 14, color: Brand.colors.text, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.2, w: 9, h: 0.7,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("今日使うツール: Looker Studio", {
    x: 0.6, y: 4.35, w: 8.8, h: 0.4,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド13-2: そもそも「データ」ってどんなもの？ =====
addContentSlide(pres, "そもそも「データ」ってどんなもの？", slide => {
  slide.addText("多くのデータは「テーブル形式」で記録されている", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 14, color: Brand.colors.subText, fontFace: Brand.font
  });
  // 説明
  slide.addText("例：YouTubeの視聴ログデータ", {
    x: 0.5, y: 1.4, w: 9, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  // YouTubeデータのテーブル例（行動ログ形式）
  const youtubeData = [
    tableHeader(["日時", "ユーザー", "動画", "アクション", "視聴時間"]),
    ["2025/12/01 10:15", "田中さん", "猫のおもしろ動画", "視聴", "3分20秒"],
    ["2025/12/01 10:18", "田中さん", "猫のおもしろ動画", "いいね", "-"],
    ["2025/12/01 11:30", "佐藤さん", "料理レシピ：パスタ", "視聴", "8分45秒"],
    ["2025/12/01 14:22", "鈴木さん", "猫のおもしろ動画", "視聴", "1分10秒"],
    ["2025/12/01 15:05", "佐藤さん", "猫のおもしろ動画", "コメント", "-"]
  ];
  slide.addTable(youtubeData, {
    x: 0.5, y: 1.8, w: 9, h: 1.7,
    fontFace: Brand.font, fontSize: 10, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [2.2, 1.3, 2.5, 1.3, 1.7]
  });
  // 解説
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.6, w: 4.3, h: 1.4,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("行（レコード）", {
    x: 0.6, y: 3.65, w: 4.1, h: 0.3,
    fontSize: 12, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("→ 1つの行動・イベントの記録\n　 誰かが何かするたびに1行増える", {
    x: 0.6, y: 3.95, w: 4.1, h: 0.55,
    fontSize: 11, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("このデータが何万行も蓄積される", {
    x: 0.6, y: 4.55, w: 4.1, h: 0.4,
    fontSize: 10, color: Brand.colors.subText, fontFace: Brand.font
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 5.0, y: 3.6, w: 4.5, h: 1.4,
    fill: { color: "E3F2FD" }
  });
  slide.addText("列（カラム）", {
    x: 5.1, y: 3.65, w: 4.3, h: 0.3,
    fontSize: 12, bold: true, color: "1565C0", fontFace: Brand.font
  });
  slide.addText("→ 記録する項目\n　 いつ・誰が・何を・どうした", {
    x: 5.1, y: 3.95, w: 4.3, h: 0.55,
    fontSize: 11, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("5W1Hを記録している", {
    x: 5.1, y: 4.55, w: 4.3, h: 0.4,
    fontSize: 10, color: Brand.colors.subText, fontFace: Brand.font
  });
});

// ===== スライド13-2: データはあるけど… =====
addContentSlide(pres, "データはあるけど…", slide => {
  slide.addText("多くの企業が抱える課題", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  const challenges = [
    { icon: "❌", title: "データの中身がよくわからない", details: "CSVやExcelで数字の羅列を見ても意味がわからない\n「このカラムは何？」「単位は？」" },
    { icon: "❌", title: "意味づけができない", details: "データがあっても、何を読み取ればいいかわからない\n「売上は上がってる？下がってる？」" },
    { icon: "❌", title: "使いたいデータが取れていない", details: "「こういうデータがほしい」けど記録していなかった\nあとから取り直すことはできない" }
  ];
  challenges.forEach((c, idx) => {
    const y = 1.5 + idx * 0.95;
    slide.addText(`${c.icon} ${c.title}`, {
      x: 0.5, y: y, w: 9, h: 0.35,
      fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(c.details, {
      x: 0.8, y: y + 0.35, w: 8.7, h: 0.55,
      fontSize: 11, color: Brand.colors.subText, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.4, w: 9, h: 0.7,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("→ データを「持っている」だけでは価値にならない", {
    x: 0.6, y: 4.5, w: 8.8, h: 0.5,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド13-3: BIツールが解決すること =====
addContentSlide(pres, "BIツールが解決すること", slide => {
  slide.addText("データを「見える化」して意味を見つける", {
    x: 0.5, y: 1.0, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const solutions = [
    { num: "①", before: "数字の羅列", after: "グラフで傾向がわかる", detail: "上がってる？下がってる？が一目瞭然" },
    { num: "②", before: "フィルターで絞り込み", after: "比較ができる", detail: "「この店舗だけ」「この期間だけ」で切り出す" },
    { num: "③", before: "複数のデータを並べる", after: "関係性が見える", detail: "「気温が高い日は売上が増える」など発見" }
  ];
  solutions.forEach((s, idx) => {
    const y = 1.6 + idx * 0.85;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fill: { color: Brand.colors.main }
    });
    slide.addText(s.num, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fontSize: 16, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(`${s.before} → ${s.after}`, {
      x: 1.1, y: y, w: 8.4, h: 0.4,
      fontSize: 13, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(s.detail, {
      x: 1.1, y: y + 0.4, w: 8.4, h: 0.4,
      fontSize: 11, color: Brand.colors.subText, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.0, w: 9, h: 1.1,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("BIツールとは…", {
    x: 0.6, y: 4.05, w: 8.8, h: 0.3,
    fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font, align: "center"
  });
  slide.addText("データから意味を見つける・読み取るためのツール", {
    x: 0.6, y: 4.35, w: 8.8, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
  slide.addText("データを理解しやすくし、傾向やパターンを可視化する", {
    x: 0.6, y: 4.7, w: 8.8, h: 0.35,
    fontSize: 13, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド14-2: なぜBIツールを使うの？ =====
addContentSlide(pres, "なぜBIツールを使うの？", slide => {
  slide.addText("Excelでもグラフは作れるけど…", {
    x: 0.5, y: 1.2, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("BIツールのメリット", {
    x: 0.5, y: 1.8, w: 9, h: 0.4,
    fontSize: 16, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  const benefits = [
    "データが更新されるとグラフも自動更新",
    "フィルターで見たいデータだけ表示",
    "URLを共有するだけでみんなが見れる",
    "プログラミング不要で直感的に操作"
  ];
  benefits.forEach((b, idx) => {
    slide.addText(`✓ ${b}`, {
      x: 0.7, y: 2.3 + idx * 0.45, w: 8.8, h: 0.4,
      fontSize: 14, color: Brand.colors.text, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.2, w: 9, h: 0.7,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("→ データ分析の「入り口」として最適", {
    x: 0.6, y: 4.35, w: 8.8, h: 0.4,
    fontSize: 16, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド14-3: 今日使うLooker Studio =====
addContentSlide(pres, "今日使うLooker Studio", slide => {
  slide.addText("Looker Studio（ルッカースタジオ）", {
    x: 0.5, y: 1.2, w: 9, h: 0.5,
    fontSize: 20, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("特徴", {
    x: 0.5, y: 1.8, w: 9, h: 0.4,
    fontSize: 16, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  const features = [
    "Googleが提供する無料のBIツール",
    "ブラウザだけで使える（アプリ不要）",
    "Googleアカウントがあれば誰でも使える"
  ];
  features.forEach((f, idx) => {
    slide.addText(`• ${f}`, {
      x: 0.7, y: 2.2 + idx * 0.45, w: 8.8, h: 0.4,
      fontSize: 14, color: Brand.colors.text, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.6, w: 9, h: 1.2,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("今日のハンズオン", {
    x: 0.6, y: 3.7, w: 8.8, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("→ 運営が準備したレポートをそのまま使います\n→ データ接続などの複雑な設定は不要！", {
    x: 0.6, y: 4.1, w: 8.8, h: 0.6,
    fontSize: 14, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド15: グラフの種類（基本編） =====
addContentSlide(pres, "データ可視化の種類（基本編）", slide => {
  slide.addText("まず覚えたい4つの基本グラフ", {
    x: 0.5, y: 1.2, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  const graphData = [
    tableHeader(["グラフ", "用途", "向いているデータ", "例"]),
    ["棒グラフ", "カテゴリ比較", "項目ごとの数値を比べたい時", "チーム別得点数、店舗別売上"],
    ["折れ線グラフ", "時系列変化", "時間による推移を見たい時", "月別観客動員数、年度別業績"],
    ["円グラフ", "構成比", "全体に対する割合を見たい時", "ポジション別人数、業種別構成"],
    ["散布図", "相関関係", "2つの数値の関係を見たい時", "身長×体重、価格×販売数"]
  ];
  slide.addTable(graphData, {
    x: 0.5, y: 1.7, w: 9, h: 2.2,
    fontFace: Brand.font, fontSize: 11, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [1.8, 1.8, 2.8, 2.6]
  });
  slide.addText("ポイント: 「何を伝えたいか」でグラフを選ぶ", {
    x: 0.5, y: 4.1, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド15-1b: グラフの種類（応用編） =====
addContentSlide(pres, "データ可視化の種類（応用編）", slide => {
  slide.addText("より高度な分析に使うグラフ", {
    x: 0.5, y: 1.2, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  const advancedGraphData = [
    tableHeader(["グラフ", "用途", "向いているデータ", "例"]),
    ["ヒートマップ", "密度・分布", "位置や頻度の集中を見たい時", "投球位置、選手の活動エリア"],
    ["ツリーマップ", "階層構成", "カテゴリの入れ子構造を見たい時", "地域×業種の店舗数分布"],
    ["積み上げ棒", "内訳比較", "複数項目の合計と内訳を比べたい時", "年度別の業種構成推移"],
    ["バブルチャート", "3変数比較", "3つの数値を同時に見たい時", "売上×利益×店舗数"],
    ["地図（マップ）", "地理分布", "場所ごとのデータを見たい時", "エリア別店舗密度"]
  ];
  slide.addTable(advancedGraphData, {
    x: 0.5, y: 1.7, w: 9, h: 2.6,
    fontFace: Brand.font, fontSize: 10, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [1.8, 1.6, 2.8, 2.8]
  });
  slide.addText("ポイント: Looker Studioでもこれらのグラフが作れます", {
    x: 0.5, y: 4.5, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド15-2: データセット別・おすすめグラフ =====
addContentSlide(pres, "データセット別・おすすめグラフ", slide => {
  slide.addText("どのデータに、どのグラフを使う？", {
    x: 0.5, y: 1.2, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.subText, fontFace: Brand.font
  });
  const recommendData = [
    tableHeader(["データセット", "データの種類", "おすすめグラフ", "可視化の例"]),
    ["プロ野球", "投球・打球位置", "ヒートマップ、散布図", "ストライクゾーン分析"],
    ["", "選手成績（比較）", "棒グラフ", "打率ランキング"],
    ["Jリーグ", "選手位置", "ヒートマップ", "選手の活動エリア"],
    ["Bリーグ", "シュート位置", "散布図", "エリア別成功率"],
    ["タウンページ", "地域×業種", "地図、ツリーマップ", "札幌市の業種分布"],
    ["", "年次推移", "折れ線グラフ", "業種別の増減トレンド"],
    ["", "構成比", "円グラフ、積み上げ棒", "地域の業種構成"]
  ];
  slide.addTable(recommendData, {
    x: 0.5, y: 1.7, w: 9, h: 2.8,
    fontFace: Brand.font, fontSize: 10, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main }, colW: [1.8, 2, 2.5, 2.7]
  });
  slide.addText("→ データの「何を見たいか」で、最適なグラフが変わる", {
    x: 0.5, y: 4.7, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== セクション: ハンズオン =====
addSectionSlide(pres, "4. ハンズオン", "チームでBIツールを操作してみよう");

// ===== スライド16-2: ハンズオンの準備 =====
addContentSlide(pres, "ハンズオンの準備", slide => {
  slide.addText("これからハンズオンを始めます", {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fontSize: 20, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  // 事前準備
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 1.7, w: 9, h: 0.8,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("GmailからLooker Studioにアクセスしてください", {
    x: 0.6, y: 1.75, w: 8.8, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("• 皆さんのGoogleアカウント宛に、Looker StudioのURLを送付済みです", {
    x: 0.6, y: 2.1, w: 8.8, h: 0.35,
    fontSize: 12, color: Brand.colors.text, fontFace: Brand.font
  });
  // これからやること
  slide.addText("【これからやること】", {
    x: 0.5, y: 2.7, w: 9, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  const steps = [
    "Googleアカウントのメールを確認",
    "届いているURLをクリックしてアクセス",
    "Googleアカウントでログイン",
    "画面が開いたら準備完了"
  ];
  steps.forEach((s, idx) => {
    slide.addText(`${idx + 1}. ${s}`, {
      x: 0.7, y: 3.1 + idx * 0.35, w: 8.8, h: 0.35,
      fontSize: 12, color: Brand.colors.text, fontFace: Brand.font
    });
  });
  // 困ったら
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.5, w: 9, h: 0.7,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("【困ったら】メールが届いていない/ログインできない → 手を挙げてください", {
    x: 0.6, y: 4.6, w: 8.8, h: 0.5,
    fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド17: ハンズオン手順 =====
addContentSlide(pres, "ハンズオン手順", slide => {
  const steps = [
    { num: "1", title: "フィルター体験", detail: "曜日やチームで絞り込み → データの変化を確認" },
    { num: "2", title: "ソート・期間変更", detail: "並び替え、9月〜10月のみに絞り込み → 傾向の変化を発見" },
    { num: "3", title: "グラフ追加（みんなで）", detail: "「グラフを追加」→ 棒グラフ → ディメンション:選手名、指標:得点" },
    { num: "4", title: "自由探索（残り時間）", detail: "チームで気になるデータを探索 → 発見を共有" }
  ];
  steps.forEach((step, idx) => {
    const y = 1.3 + idx * 0.95;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.6, h: 0.6,
      fill: { color: Brand.colors.main }
    });
    slide.addText(`Step ${step.num}`, {
      x: 0.5, y: y, w: 0.6, h: 0.6,
      fontSize: 12, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(step.title, {
      x: 1.2, y: y, w: 8.3, h: 0.35,
      fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(step.detail, {
      x: 1.2, y: y + 0.35, w: 8.3, h: 0.35,
      fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font
    });
  });
});

// ===== スライド18: ハンズオン開始 =====
addContentSlide(pres, "ハンズオン開始", slide => {
  slide.addText("BIツールを触ってみよう！", {
    x: 0.5, y: 1.0, w: 9, h: 0.45,
    fontSize: 20, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("今日体験する4つの操作", {
    x: 0.5, y: 1.5, w: 9, h: 0.35,
    fontSize: 16, color: Brand.colors.text, fontFace: Brand.font
  });
  const operations = [
    { icon: "🔍", name: "フィルター", desc: "「土曜日だけ」など条件で絞り込む", color: Brand.colors.accent3 },
    { icon: "↕️", name: "ソート", desc: "「観客数が多い順」など並び替える", color: Brand.colors.gold },
    { icon: "📅", name: "期間変更", desc: "「9月〜10月のみ」など期間を絞り込む", color: Brand.colors.orange },
    { icon: "📊", name: "グラフ追加", desc: "棒グラフを1つ作成してみる", color: Brand.colors.main }
  ];
  operations.forEach((op, idx) => {
    const y = 1.95 + idx * 0.6;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 9, h: 0.52,
      fill: { color: op.color }
    });
    slide.addText(`${op.icon} ${op.name}`, {
      x: 0.7, y: y + 0.02, w: 2.2, h: 0.48,
      fontSize: 13, bold: true, color: idx === 3 ? Brand.colors.white : Brand.colors.text, fontFace: Brand.font, valign: "middle"
    });
    slide.addText(op.desc, {
      x: 3.0, y: y + 0.02, w: 6.3, h: 0.48,
      fontSize: 12, color: idx === 3 ? Brand.colors.white : Brand.colors.text, fontFace: Brand.font, valign: "middle"
    });
  });
  slide.addText("→ フィルター等で操作に慣れたら、みんなでグラフを作成しよう", {
    x: 0.5, y: 4.5, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド18-2: グラフ追加の手順 =====
addContentSlide(pres, "グラフ追加の手順", slide => {
  slide.addText("棒グラフを作成してみよう", {
    x: 0.5, y: 1.0, w: 9, h: 0.45,
    fontSize: 20, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const graphSteps = [
    { num: "1", title: "「グラフを追加」をクリック", detail: "画面上部のメニューから選択" },
    { num: "2", title: "「棒グラフ」を選択", detail: "グラフ一覧から棒グラフのアイコンをクリック" },
    { num: "3", title: "キャンバスに配置", detail: "レポート上でドラッグして好きな場所に配置" },
    { num: "4", title: "ディメンションを設定", detail: "右側パネルで「選手名」や「チーム名」を選択" },
    { num: "5", title: "指標を設定", detail: "「得点」や「出場時間」など数値項目を選択" }
  ];
  graphSteps.forEach((step, idx) => {
    const y = 1.55 + idx * 0.6;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fill: { color: Brand.colors.main }
    });
    slide.addText(step.num, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fontSize: 16, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(step.title, {
      x: 1.1, y: y, w: 4, h: 0.5,
      fontSize: 13, bold: true, color: Brand.colors.text, fontFace: Brand.font, valign: "middle"
    });
    slide.addText(step.detail, {
      x: 5.2, y: y, w: 4.3, h: 0.5,
      fontSize: 11, color: Brand.colors.subText, fontFace: Brand.font, valign: "middle"
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.6, w: 9, h: 0.55,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("ポイント: ディメンション＝分類軸（何で分ける？）、指標＝数値（何を見る？）", {
    x: 0.6, y: 4.68, w: 8.8, h: 0.4,
    fontSize: 12, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== セクション: まとめ =====
addSectionSlide(pres, "5. まとめ", "次のワークへの準備");

// ===== スライド20: 振り返り =====
addContentSlide(pres, "振り返り", slide => {
  slide.addText("今日学んだこと", {
    x: 0.5, y: 1.2, w: 9, h: 0.4,
    fontSize: 18, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const learnings = [
    { num: "1", title: "身近なデータ活用", text: "YouTube, TikTok, Amazon は皆さんのデータを分析して価値を生んでいる" },
    { num: "2", title: "データセットの理解", text: "位置情報・成績・試合情報がIDで紐付いている" },
    { num: "3", title: "BIツールの基本操作", text: "フィルター・ソート・期間変更でデータを探索できるようになった" }
  ];
  learnings.forEach((item, idx) => {
    const y = 1.8 + idx * 0.85;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fill: { color: Brand.colors.main }
    });
    slide.addText(item.num, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fontSize: 16, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(item.title, {
      x: 1.1, y: y, w: 8.4, h: 0.35,
      fontSize: 14, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(item.text, {
      x: 1.1, y: y + 0.35, w: 8.4, h: 0.4,
      fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font
    });
  });
  slide.addText("→ 皆さんも「データを使う側」になれた！", {
    x: 0.5, y: 4.5, w: 9, h: 0.5,
    fontSize: 16, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
});

// ===== スライド21: 次のワークへ =====
addContentSlide(pres, "次のワークへ", slide => {
  slide.addText("「データをどう活かすか？」", {
    x: 0.5, y: 1.3, w: 9, h: 0.5,
    fontSize: 22, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("次のワークでは：", {
    x: 0.5, y: 2.0, w: 9, h: 0.4,
    fontSize: 16, color: Brand.colors.text, fontFace: Brand.font
  });
  const nextSteps = [
    "チームでアイデアを出し合う",
    "データを可視化してみる",
    "発表に向けて準備する"
  ];
  nextSteps.forEach((step, idx) => {
    slide.addText(`• ${step}`, {
      x: 0.7, y: 2.5 + idx * 0.45, w: 8.8, h: 0.4,
      fontSize: 16, color: Brand.colors.text, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.0, w: 9, h: 0.8,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("→ 今学んだことを活かして、アイデアを形にしよう！", {
    x: 0.6, y: 4.2, w: 8.8, h: 0.5,
    fontSize: 16, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== ペルソナスライド =====

// ペルソナ1: 地域事業者
const persona1 = {
  title: "ペルソナ① 地域事業者",
  basicInfo: [
    ["氏名（年齢）", "山田 健一（52歳）"],
    ["性別", "男性"],
    ["居住地", "北海道札幌市中央区（持ち家・築30年の一軒家、ローン完済済み）"],
    ["出身地", "北海道札幌市（生まれも育ちも札幌、地元への愛着が強い）"],
    ["家族構成", "妻・恵子（50歳・店の経理と接客を担当）、娘・美穂（26歳・東京のIT企業で会社員、年2回帰省）"],
    ["趣味", "釣り（支笏湖でトラウト、石狩川でサケ釣り）、道内の蕎麦屋巡り（年間30店舗以上訪問）、町内会の夏祭り実行委員、野球観戦（ファイターズの年間シート保有歴10年）"],
    ["趣味のきっかけ", "小学生の頃、父親に連れられて始めた釣りが今も続いている。蕎麦は30代の頃、自分の店の味を磨くために全国の名店を食べ歩き始めた"]
  ],
  detailInfo: [
    ["仕事", "札幌市内で蕎麦屋「山田庵」を2店舗経営。1号店（中央区南3条）は父から継いで創業25年、常連客中心で1日平均80名来客。2号店（北区麻生）は5年前にオープン、ショッピングモール近くでファミリー層向け、1日平均120名来客。従業員は妻と正社員1名、パート3名。年商は2店舗合計で約4,500万円。蕎麦粉は幌加内産にこだわっている"],
    ["平日の過ごし方", "朝5時起床、5時半から1号店で仕込み開始（出汁取り、麺打ち、天ぷら用野菜のカット）。11時開店、14時に昼のピークが終わったら車で2号店へ移動して様子確認とスタッフ指導。16時に1号店に戻り、17時から夜営業、20時閉店。21時帰宅、妻と夕食を取りながらニュースと野球中継を見て23時就寝"],
    ["休日の過ごし方", "月曜定休。午前は自宅で経理作業（手書きの売上帳簿をExcelに転記、妻に教わりながら）や仕入れ先との電話打ち合わせ。午後は妻とイオンで買い物するか、天気が良ければ一人で支笏湖へ釣りに出かける。月1回は商工会の集まり（情報交換と懇親会）に参加"],
    ["好きな時間", "閉店後に常連さんと少しだけ話す時間が一番好き。「また来るよ」「今日も美味しかった」「孫を連れてくるね」と言われると、この仕事を続けてきて本当に良かったと感じる。父から継いだ店を守れていることに誇りを持っている"],
    ["最近の関心事", "2号店が軌道に乗ってきたので、3店舗目を出すかどうか真剣に検討中。候補地は琴似（学生・単身者が多い）か新札幌（再開発で人口増加中）で迷っている。娘に「人口動態や競合店のデータを見て決めたら？」と言われたが、何のデータをどこで見ればいいのか分からない"],
    ["情報収集の方法", "商工会の集まりや同業者からの口コミが頼り。「あのエリアは最近人が増えてるらしい」という噂話で判断することが多い。ネットは苦手で、調べ物があると娘にLINEで聞く。スマホは持っているが、使うのはLINEと天気予報、たまにYahooニュースを見る程度"],
    ["悩み・課題", "「人口が減っているエリアもある」とニュースで聞くが、自分の商圏でどうなのか実感がわかない。25年の経験と勘だけで3店舗目の場所を決めていいのか不安。また、最近は若い世代（20-30代）の来客が減っている気がする。娘に「InstagramやGoogleマップの口コミが大事だよ」と言われたが、やり方が分からない"]
  ]
};
addPersonaSlide(pres, persona1);

// ペルソナ2: スポーツ観戦ライト層の学生
const persona2 = {
  title: "ペルソナ② スポーツ観戦ライト層の学生",
  basicInfo: [
    ["氏名（年齢）", "佐藤 美咲（21歳）"],
    ["性別", "女性"],
    ["居住地", "北海道札幌市北区（北大近くのワンルーム・家賃4.5万円・一人暮らし3年目）"],
    ["出身地", "北海道旭川市（帰省は年3回程度）"],
    ["家族構成", "実家に父（53歳・市役所・日ハムファン）、母（50歳・パート）、弟（17歳・高校サッカー部・コンサドーレファン）"],
    ["趣味", "カフェ巡り（月8回以上）、Instagram（フォロワー約520人）、推し活（K-POP）、Netflix、コスメ収集"],
    ["趣味のきっかけ", "大学入学後、友達の影響でカフェ巡りを開始。映える写真をInstagramに投稿したら反応が良くて楽しくなった"]
  ],
  detailInfo: [
    ["仕事（学業）", "北海道大学経済学部3年生。ゼミは消費者行動論・マーケティング専攻で、卒論テーマは「SNSが購買行動に与える影響」を検討中。成績は中の上でGPAは2.8。週3回（火・木・土）大学近くのおしゃれカフェでバイト（時給980円・月収約5万円）。就活を意識し始め、夏のインターンに食品メーカーと広告代理店の2社に応募、1社は書類通過"],
    ["平日の過ごし方", "8時起床、9時から授業（週4日、1日2-3コマ）。空きコマは図書館かカフェで課題。14時頃に授業終了、バイトがある日は16時〜21時勤務。移動中（地下鉄で片道15分）はInstagram・TikTok・YouTubeをひたすらチェック（1日のスクリーンタイム平均4時間）。帰宅後は自炊、お風呂、寝る前にNetflixで韓国ドラマを1話見るのが日課。24時就寝"],
    ["休日の過ごし方", "11時起床、ゆっくり準備して13時頃から友達と札幌駅周辺（ステラプレイス、大丸、パルコ）で買い物やカフェ巡り。新しくできた店は必ずチェックして写真を撮る。17時頃に解散、夜は一人でNetflix。自分からイベントを探すより、友達の誘いやSNSで流れてきた情報で動くことが多い"],
    ["好きな時間", "友達と一緒に新しい体験をしている時間が一番楽しい。初めてのカフェ、初めての場所、初めての食べ物。Instagramで「いいね」が50以上、できれば100以上もらえるとテンションが上がる。ストーリーズで日常をシェアして、友達から「いいな〜」とDMが来ると嬉しい"],
    ["スポーツとの関わり", "自分自身は運動部経験なし（中学は吹奏楽部、高校は帰宅部）。体育は苦手だった。父が日ハムファンで、子供の頃は家族でエスコンフィールドの前身の札幌ドームへ年1回程度。弟がサッカー少年で、弟の試合応援でルールは少し分かる。友達に誘われればスポーツ観戦に付き合う程度。スタジアムの雰囲気、応援の一体感、スタジアムグルメは好き"],
    ["スポーツ観戦との出会い", "子供の頃、父に連れられて日ハム戦を観戦。選手の名前は覚えていないが、球場の熱気と花火は印象に残っている。弟の影響でコンサドーレの試合をTV観戦。ドームの雰囲気が良さそうで一度行ってみたい。大学2年の冬、ゼミ友達に誘われてレバンガ北海道を観戦。会場が近くて行きやすく、チアのダンスがかっこよく、意外とハマりそう。選手のInstagramをフォロー開始"],
    ["悩み・課題", "どのスポーツも「もう一度行きたい」と思うが、チケットの買い方（どのサイト？席の種類は？）や持ち物が分からない。友達と一緒じゃないと行く勇気が出ない。ルールを知らないまま行って「にわかファン」と思われたら恥ずかしい。野球は試合時間が長そう、サッカーは寒そう、バスケは近いから行きやすそう、という漠然としたイメージ。もっと詳しくなりたいが何から始めればいいか分からない"]
  ]
};
addPersonaSlide(pres, persona2);

// ===== ヒントカード: タウンページ =====
addContentSlide(pres, "ヒントカード：タウンページ", slide => {
  const categories = ["業種", "エリア", "誰のため？", "シーン", "その他"];
  const cards = [
    ["飲食店", "中央区", "出店したい人", "引っ越し", "徒歩圏内"],
    ["小売店", "北区", "就活生", "開業", "駅チカ"],
    ["美容・理容", "駅前", "高齢者", "子育て", "穴場"],
    ["医療・福祉", "住宅街", "観光客", "通勤", "激戦区"],
    ["教育・学習", "繁華街", "学生", "老後", "ランキング"]
  ];
  const colW = 1.8;
  const startX = 0.5;
  // ヘッダー
  categories.forEach((cat, idx) => {
    slide.addShape(pres.ShapeType.rect, {
      x: startX + idx * colW, y: 1.0, w: colW - 0.1, h: 0.45,
      fill: { color: Brand.colors.main }
    });
    slide.addText(cat, {
      x: startX + idx * colW, y: 1.0, w: colW - 0.1, h: 0.45,
      fontSize: 12, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
  });
  // カード
  cards.forEach((row, rowIdx) => {
    row.forEach((card, colIdx) => {
      const y = 1.55 + rowIdx * 0.65;
      slide.addShape(pres.ShapeType.rect, {
        x: startX + colIdx * colW, y: y, w: colW - 0.1, h: 0.55,
        fill: { color: Brand.colors.gold }
      });
      slide.addText(card, {
        x: startX + colIdx * colW, y: y, w: colW - 0.1, h: 0.55,
        fontSize: 11, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
      });
    });
  });
});

// ===== ヒントカード: データスタジアム =====
addContentSlide(pres, "ヒントカード：データスタジアム", slide => {
  const categories = ["選手", "試合状況", "誰のため？", "シーン", "その他"];
  const cards = [
    ["得点", "ホーム", "初観戦の人", "推し探し", "応援"],
    ["出場時間", "勝ってる時", "ライトファン", "デート", "グッズ"],
    ["アシスト", "負けてる時", "子ども", "家族で", "チケット"],
    ["シュート位置", "接戦", "解説者", "飲み会ネタ", "SNS映え"],
    ["守備", "終盤", "選手本人", "予習・復習", "名場面"]
  ];
  const colW = 1.8;
  const startX = 0.5;
  // ヘッダー
  categories.forEach((cat, idx) => {
    slide.addShape(pres.ShapeType.rect, {
      x: startX + idx * colW, y: 1.0, w: colW - 0.1, h: 0.45,
      fill: { color: Brand.colors.main }
    });
    slide.addText(cat, {
      x: startX + idx * colW, y: 1.0, w: colW - 0.1, h: 0.45,
      fontSize: 12, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
  });
  // カード
  cards.forEach((row, rowIdx) => {
    row.forEach((card, colIdx) => {
      const y = 1.55 + rowIdx * 0.65;
      slide.addShape(pres.ShapeType.rect, {
        x: startX + colIdx * colW, y: y, w: colW - 0.1, h: 0.55,
        fill: { color: Brand.colors.gold }
      });
      slide.addText(card, {
        x: startX + colIdx * colW, y: y, w: colW - 0.1, h: 0.55,
        fontSize: 11, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
      });
    });
  });
});

// ===== Day1振り返りスライド =====
addContentSlide(pres, "Day1の振り返り", slide => {
  slide.addText("昨日学んだこと", {
    x: 0.5, y: 1.15, w: 9, h: 0.35,
    fontSize: 16, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  const day1Learnings = [
    { num: "1", title: "身近なデータ活用", details: [
      "YouTube: 視聴履歴・視聴時間からおすすめ動画を自動選定",
      "TikTok: スワイプ速度・視聴完了率で好みを即座に学習",
      "Amazon: 閲覧・購入・カート放棄データでレコメンド（売上35%）"
    ]},
    { num: "2", title: "データセットの理解", details: [
      "スポーツ: 選手ID・チームID・試合IDでデータが紐付く",
      "位置データ: 投球座標、シュート位置、選手トラッキング",
      "地域データ: 住所コード×業種で商圏分析が可能"
    ]},
    { num: "3", title: "BIツール体験", details: [
      "Looker Studioで棒グラフ・円グラフを作成",
      "ディメンション（分類軸）と指標（数値）の設定を学習"
    ]}
  ];
  day1Learnings.forEach((item, idx) => {
    const y = 1.55 + idx * 1.0;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y, w: 0.4, h: 0.4,
      fill: { color: Brand.colors.main }
    });
    slide.addText(item.num, {
      x: 0.5, y: y, w: 0.4, h: 0.4,
      fontSize: 14, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(item.title, {
      x: 1.0, y: y, w: 8.5, h: 0.35,
      fontSize: 13, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(item.details.map(d => "• " + d).join("\n"), {
      x: 1.0, y: y + 0.35, w: 8.5, h: 0.6,
      fontSize: 10, color: Brand.colors.subText, fontFace: Brand.font
    });
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.6, w: 9, h: 0.5,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("今日（Day2）は、この知識を活かしてアイデアを形にしよう！", {
    x: 0.6, y: 4.65, w: 8.8, h: 0.4,
    fontSize: 13, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== 最終アウトプットの内容（例）スライド =====
addContentSlide(pres, "最終アウトプットの内容（例）", slide => {
  slide.addText("※各グループで1枚作成　イメージのため項目の追加可能性有", {
    x: 3.5, y: 0.55, w: 6.0, h: 0.25,
    fontSize: 9, color: Brand.colors.subText, fontFace: Brand.font
  });

  // サービスタイトル（左）
  slide.addText("サービスタイトル", {
    x: 0.4, y: 0.85, w: 2.0, h: 0.25,
    fontSize: 10, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.1, w: 4.5, h: 0.65,
    fill: { color: Brand.colors.white }, line: { color: Brand.colors.main, width: 1 }
  });
  slide.addText("はじめてのスタジアム体験ナビ\n（Stadium First Guide）", {
    x: 0.5, y: 1.15, w: 4.3, h: 0.55,
    fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });

  // ペルソナが実現したいこと（右）
  slide.addText("ペルソナが実現したいこと", {
    x: 5.1, y: 0.85, w: 3.0, h: 0.25,
    fontSize: 10, color: Brand.colors.main, fontFace: Brand.font, align: "right"
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 1.1, w: 4.5, h: 0.65,
    fill: { color: Brand.colors.white }, line: { color: Brand.colors.main, width: 1 }
  });
  slide.addText("友達と一緒に「映える」\n新しい体験をしたい", {
    x: 5.2, y: 1.15, w: 4.3, h: 0.55,
    fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });

  // メインコンテンツエリア
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.85, w: 9.2, h: 3.2,
    fill: { color: Brand.colors.white }, line: { color: Brand.colors.main, width: 1 }
  });

  // どんな課題を（What）
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.85, w: 2.0, h: 1.5,
    fill: { color: "F5F5F5" }, line: { color: Brand.colors.main, width: 0.5 }
  });
  slide.addText("どんな課題を\n（What）", {
    x: 0.5, y: 2.25, w: 1.8, h: 0.7,
    fontSize: 10, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });
  slide.addText("初観戦の人は、スタジアムで「何を楽しめばいいか」「どこで写真を撮ればいいか」が分からず、スポーツ観戦＝ルールを知らないと楽しめないと思い込んでいる。\n※どんなデータから分かったか\n選手プロフィールを分析→「推しやすい選手」（若手・地元出身など）の特徴\n試合情報を分析→「盛り上がりやすい試合」（イベント開催日など）を特定\n\n• 友達に「スタジアム行ってみない？」と誘われた時\n• SNSで観戦投稿を見て「楽しそう」と思った時", {
    x: 2.5, y: 1.9, w: 7.0, h: 1.4,
    fontSize: 8, color: Brand.colors.text, fontFace: Brand.font
  });

  // どんなデータで、どんなツールで
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 3.35, w: 2.0, h: 0.7,
    fill: { color: "F5F5F5" }, line: { color: Brand.colors.main, width: 0.5 }
  });
  slide.addText("どんなデータで、\nどんなツールで", {
    x: 0.5, y: 3.45, w: 1.8, h: 0.5,
    fontSize: 9, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });
  slide.addText("• 選手プロフィール → 推しやすい選手をレコメンド\n• 試合情報 → 初心者向けの盛り上がる試合を提案\n• 選手成績 → 「この選手が活躍したら映える」瞬間を予測", {
    x: 2.5, y: 3.4, w: 7.0, h: 0.6,
    fontSize: 8, color: Brand.colors.text, fontFace: Brand.font
  });

  // どのように解決できるか（How）
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.05, w: 2.0, h: 1.0,
    fill: { color: "F5F5F5" }, line: { color: Brand.colors.main, width: 0.5 }
  });
  slide.addText("どのように\n解決できるか\n（How）", {
    x: 0.5, y: 4.2, w: 1.8, h: 0.7,
    fontSize: 9, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
  });
  slide.addText("• 観戦前：選手データから「あなたの推し候補」を3人提案（年齢近い・地元出身など）\n• 観戦当日：試合情報から「今日の映えポイント」を通知（応援タイム、グルメTOP3、フォトスポット）\n• 観戦後：選手成績から「今日のハイライト」を自動生成、SNSシェア用テンプレートを提供", {
    x: 2.5, y: 4.1, w: 7.0, h: 0.9,
    fontSize: 8, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== 最終スライド =====
const endSlide = pres.addSlide();
endSlide.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: Brand.colors.main }
});
endSlide.addText("ご清聴ありがとうございました", {
  x: 0, y: 2.0, w: 10, h: 0.8,
  fontSize: 36, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center"
});
endSlide.addText("質問があればお気軽にどうぞ！", {
  x: 0, y: 3.0, w: 10, h: 0.5,
  fontSize: 18, color: Brand.colors.accent1, fontFace: Brand.font, align: "center"
});

// ============================================================
// ファイル保存
// ============================================================

const outputPath = path.join(__dirname, "講義スライド-データ利活用のススメ_NTTDXPN.pptx");

pres.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("Success: PowerPoint created at " + outputPath);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error: Failed to create PowerPoint file.");
    console.error(err.message || err);
    process.exit(1);
  });
