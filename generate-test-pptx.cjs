const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ============================================================
// NTT DXパートナー PPTX生成スクリプト（リファクタリング版）
// Codexレビュー指摘事項を反映
// ============================================================

// --- 環境チェック ---
if (!process.env.HOME) {
  console.error("Error: HOME environment variable is not defined.");
  process.exit(1);
}

// --- パス設定 ---
const assetsPath = path.join(process.env.HOME, ".claude/skills/ntt-dxpartner-pptx/assets");

// --- アセット存在チェック ---
const requiredAssets = [
  "logo.png",
  "logo-small.png",
  "bg-title.png",
  "bg-content.png"
];

for (const asset of requiredAssets) {
  const assetFullPath = path.join(assetsPath, asset);
  if (!fs.existsSync(assetFullPath)) {
    console.error(`Error: Required asset not found: ${assetFullPath}`);
    process.exit(1);
  }
}

// ============================================================
// ブランド定義（一元管理）
// ============================================================

const Brand = {
  // カラーパレット
  colors: {
    main: "156082",        // ティールブルー（プライマリ）
    accent1: "6CE6E8",     // ライトシアン（強調）
    accent2: "48FAF6",     // シアン（グラフ等）
    accent3: "C1E4F5",     // ライトブルー（背景等）
    gold: "F3C551",        // ゴールド（警告・重要）
    orange: "FCAE3B",      // オレンジ（アラート）
    text: "595959",        // ダークグレー（本文）
    subText: "7F7F7F",     // ミディアムグレー（補足）
    background: "FFFFFF",  // 白
    white: "FFFFFF"
  },

  // フォント
  font: "Meiryo UI",

  // ロゴ設定（比率を維持）
  logo: {
    main: {
      file: "logo.png",
      width: 2.11,
      height: 0.5,      // 比率 4.22:1 (612×145px)
      ratio: 4.22
    },
    small: {
      file: "logo-small.png",
      width: 1.46,
      height: 0.3,      // 比率 4.87:1 (292×60px)
      ratio: 4.87
    }
  },

  // 背景画像
  backgrounds: {
    title: "bg-title.png",
    content: "bg-content.png"
  }
};

// ============================================================
// レイアウト定数（一元管理）
// ============================================================

const Layout = {
  // スライドサイズ（16:9）
  slide: {
    width: 10,
    height: 5.625
  },

  // ヘッダー
  header: {
    title: { x: 0.5, y: 0.3, w: 7.0, h: 0.6, fontSize: 28 },  // 幅を縮小してロゴと重ならないように
    underline: { x: 0.5, y: 0.9, w: 9, h: 0.03 },
    logo: { x: 8.2, y: 0.2 }  // logo-small用
  },

  // フッター（ページ番号）
  footer: {
    pageNumber: { x: 0.3, y: 5.1, w: 0.5, h: 0.4, fontSize: 12 }
  },

  // コンテンツエリア
  content: {
    startY: 1.2,
    margin: 0.5
  },

  // 表紙
  title: {
    mainTitle: { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 42 },
    subTitle: { x: 0.5, y: 2.9, w: 9, h: 0.6, fontSize: 28 },
    date: { x: 0.5, y: 4.8, w: 9, h: 0.4, fontSize: 14 },
    logo: { x: 7.3, y: 4.4 }  // logo-main用
  },

  // 最終スライド
  end: {
    message: { y: 2.3, fontSize: 36 },
    logo: { x: 3.95, y: 3.8 }
  }
};

// ============================================================
// 共通関数
// ============================================================

/**
 * コンテンツスライドの共通ヘッダーを追加
 */
function addContentHeader(slide, pres, title, options = {}) {
  const { titleColor = Brand.colors.text } = options;

  // 背景
  slide.addImage({
    path: path.join(assetsPath, Brand.backgrounds.content),
    x: 0, y: 0,
    w: Layout.slide.width, h: Layout.slide.height
  });

  // タイトル
  slide.addText(title, {
    x: Layout.header.title.x,
    y: Layout.header.title.y,
    w: Layout.header.title.w,
    h: Layout.header.title.h,
    fontSize: Layout.header.title.fontSize,
    bold: true,
    color: titleColor,
    fontFace: Brand.font
  });

  // アンダーライン
  slide.addShape(pres.ShapeType.rect, {
    x: Layout.header.underline.x,
    y: Layout.header.underline.y,
    w: Layout.header.underline.w,
    h: Layout.header.underline.h,
    fill: { color: Brand.colors.main }
  });

  // 注: ロゴはbg-content.pngに含まれているため、別途追加不要
}

/**
 * ページ番号を追加
 */
function addPageNumber(slide, pageNum, options = {}) {
  const { prefix = "" } = options;
  const displayNum = prefix ? `${prefix}-${pageNum}` : String(pageNum);

  slide.addText(displayNum, {
    x: Layout.footer.pageNumber.x,
    y: Layout.footer.pageNumber.y,
    w: Layout.footer.pageNumber.w,
    h: Layout.footer.pageNumber.h,
    fontSize: Layout.footer.pageNumber.fontSize,
    color: Brand.colors.subText,
    fontFace: Brand.font
  });
}

/**
 * テーブルヘッダー行のスタイルを生成
 */
function createTableHeader(columns) {
  return columns.map(text => ({
    text,
    options: {
      bold: true,
      fill: { color: Brand.colors.main },
      color: Brand.colors.white
    }
  }));
}

// ============================================================
// プレゼンテーション生成
// ============================================================

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NTT DXパートナー";
pres.title = "テストスライド（全スライドタイプ）";

// --- 目次定義（スライド構成と一致させる） ---
const tocItems = [
  { num: 1, title: "ブランド要素一覧" },
  { num: 2, title: "カラーサンプル" },
  { num: 3, title: "レイアウト仕様" },
  { num: 4, title: "Appendix" }
];

// ===== スライド1: 表紙（Title） =====
const titleSlide = pres.addSlide();
titleSlide.addImage({
  path: path.join(assetsPath, Brand.backgrounds.title),
  x: 0, y: 0,
  w: Layout.slide.width, h: Layout.slide.height
});
titleSlide.addText("NTT DXパートナー", {
  x: Layout.title.mainTitle.x,
  y: Layout.title.mainTitle.y,
  w: Layout.title.mainTitle.w,
  h: Layout.title.mainTitle.h,
  fontSize: Layout.title.mainTitle.fontSize,
  bold: true,
  color: Brand.colors.white,
  fontFace: Brand.font
});
titleSlide.addText("全スライドタイプ テスト", {
  x: Layout.title.subTitle.x,
  y: Layout.title.subTitle.y,
  w: Layout.title.subTitle.w,
  h: Layout.title.subTitle.h,
  fontSize: Layout.title.subTitle.fontSize,
  color: Brand.colors.white,
  fontFace: Brand.font
});
titleSlide.addText("2026年1月", {
  x: Layout.title.date.x,
  y: Layout.title.date.y,
  w: Layout.title.date.w,
  h: Layout.title.date.h,
  fontSize: Layout.title.date.fontSize,
  color: Brand.colors.white,
  fontFace: Brand.font
});
titleSlide.addImage({
  path: path.join(assetsPath, Brand.logo.main.file),
  x: Layout.title.logo.x,
  y: Layout.title.logo.y,
  w: Brand.logo.main.width,
  h: Brand.logo.main.height
});

// ===== スライド2: 目次（TOC） =====
const tocSlide = pres.addSlide();
tocSlide.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: Brand.colors.background }
});
tocSlide.addText("目次", {
  x: Layout.header.title.x,
  y: Layout.header.title.y,
  w: Layout.header.title.w,
  h: 0.7,
  fontSize: Layout.header.title.fontSize,
  bold: true,
  color: Brand.colors.main,
  fontFace: Brand.font
});
tocSlide.addShape(pres.ShapeType.rect, {
  x: Layout.header.underline.x,
  y: 1.0,
  w: Layout.header.underline.w,
  h: Layout.header.underline.h,
  fill: { color: Brand.colors.main }
});

tocItems.forEach((item, idx) => {
  tocSlide.addText(`${item.num}. ${item.title}`, {
    x: 0.8,
    y: 1.4 + (idx * 0.6),
    w: 8, h: 0.5,
    fontSize: 18,
    color: Brand.colors.text,
    fontFace: Brand.font
  });
});

// ===== スライド3: ブランド要素一覧（Content） =====
const slide3 = pres.addSlide();
addContentHeader(slide3, pres, "ブランド要素一覧");

const brandData = [
  createTableHeader(["要素", "値", "説明"]),
  ["メインカラー", "#156082", "ティールブルー（プライマリ）"],
  ["アクセント1", "#6CE6E8", "ライトシアン（強調）"],
  ["アクセント2", "#48FAF6", "シアン（グラフ等）"],
  ["アクセント3", "#C1E4F5", "ライトブルー（背景等）"],
  ["ゴールド", "#F3C551", "警告・重要な情報"],
  ["オレンジ", "#FCAE3B", "アラート・注意"],
  ["テキスト", "#595959", "本文テキスト"],
  ["フォント", "Meiryo UI", "全体で使用"]
];
slide3.addTable(brandData, {
  x: 0.5, y: Layout.content.startY, w: 9, h: 3.2,
  fontFace: Brand.font, fontSize: 12,
  color: Brand.colors.text,
  border: { pt: 0.5, color: Brand.colors.main },
  colW: [2.5, 2, 4.5]
});
addPageNumber(slide3, 1);

// ===== スライド4: カラーサンプル（Content） =====
const slide4 = pres.addSlide();
addContentHeader(slide4, pres, "カラーサンプル");

const colorBoxes = [
  { color: Brand.colors.main, label: "Main\n#156082", x: 0.5 },
  { color: Brand.colors.accent1, label: "Accent1\n#6CE6E8", x: 2.3 },
  { color: Brand.colors.accent2, label: "Accent2\n#48FAF6", x: 4.1 },
  { color: Brand.colors.gold, label: "Gold\n#F3C551", x: 5.9 },
  { color: Brand.colors.orange, label: "Orange\n#FCAE3B", x: 7.7 }
];

colorBoxes.forEach(box => {
  slide4.addShape(pres.ShapeType.rect, {
    x: box.x, y: 1.3, w: 1.6, h: 1.2,
    fill: { color: box.color }
  });
  slide4.addText(box.label, {
    x: box.x, y: 2.6, w: 1.6, h: 0.6,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// 追加カラー（accent3）
slide4.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 3.4, w: 9, h: 0.6,
  fill: { color: Brand.colors.accent3 }
});
slide4.addText("Accent3 (#C1E4F5) - 背景・セクション区切りに使用", {
  x: 0.6, y: 3.5, w: 8.8, h: 0.4,
  fontSize: 12, color: Brand.colors.text, fontFace: Brand.font
});

slide4.addText("テキストサンプル（ダークグレー #595959）", {
  x: 0.5, y: 4.2, w: 9, h: 0.3,
  fontSize: 14, color: Brand.colors.text, fontFace: Brand.font
});
slide4.addText("サブテキストサンプル（ミディアムグレー #7F7F7F）", {
  x: 0.5, y: 4.5, w: 9, h: 0.3,
  fontSize: 12, color: Brand.colors.subText, fontFace: Brand.font
});
addPageNumber(slide4, 2);

// ===== スライド5: レイアウト仕様（Content） =====
const slide5 = pres.addSlide();
addContentHeader(slide5, pres, "レイアウト仕様");

slide5.addText("ロゴサイズ仕様", {
  x: 0.5, y: 1.2, w: 9, h: 0.4,
  fontSize: 16, bold: true, color: Brand.colors.text, fontFace: Brand.font
});

const logoData = [
  createTableHeader(["ファイル", "サイズ", "比率", "用途"]),
  ["logo.png", "612×145px", "4.22:1", "表紙・大きめ表示用"],
  ["logo-small.png", "292×60px", "4.87:1", "ヘッダー・小さめ表示用"]
];
slide5.addTable(logoData, {
  x: 0.5, y: 1.7, w: 9, h: 1,
  fontFace: Brand.font, fontSize: 11,
  color: Brand.colors.text,
  border: { pt: 0.5, color: Brand.colors.main },
  colW: [2.5, 2, 1.5, 3]
});

slide5.addText("背景画像仕様", {
  x: 0.5, y: 3.0, w: 9, h: 0.4,
  fontSize: 16, bold: true, color: Brand.colors.text, fontFace: Brand.font
});

const bgData = [
  createTableHeader(["ファイル", "サイズ", "用途"]),
  ["bg-title.png", "1200×675px", "表紙スライド背景"],
  ["bg-content.png", "1200×675px", "コンテンツ/Appendix背景"]
];
slide5.addTable(bgData, {
  x: 0.5, y: 3.5, w: 9, h: 0.9,
  fontFace: Brand.font, fontSize: 11,
  color: Brand.colors.text,
  border: { pt: 0.5, color: Brand.colors.main },
  colW: [3, 2.5, 3.5]
});
addPageNumber(slide5, 3);

// ===== スライド6: 最終スライド（End） =====
const endSlide = pres.addSlide();
endSlide.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: Brand.colors.main }
});
endSlide.addText("ご清聴ありがとうございました", {
  x: 0,
  y: Layout.end.message.y,
  w: Layout.slide.width, h: 1,
  fontSize: Layout.end.message.fontSize,
  bold: true,
  color: Brand.colors.white,
  fontFace: Brand.font,
  align: "center"
});
endSlide.addImage({
  path: path.join(assetsPath, Brand.logo.main.file),
  x: Layout.end.logo.x,
  y: Layout.end.logo.y,
  w: Brand.logo.main.width,
  h: Brand.logo.main.height
});

// ===== スライド7: Appendix =====
const appendixSlide = pres.addSlide();
addContentHeader(appendixSlide, pres, "Appendix", { titleColor: Brand.colors.main });

appendixSlide.addText("このスライドはAppendix（補足資料）のテンプレートです。", {
  x: 0.5, y: 1.5, w: 9, h: 0.5,
  fontSize: 14, color: Brand.colors.text, fontFace: Brand.font
});
appendixSlide.addText("必要に応じて詳細データや参考情報を記載してください。", {
  x: 0.5, y: 2.0, w: 9, h: 0.5,
  fontSize: 14, color: Brand.colors.subText, fontFace: Brand.font
});

// Appendixのカラーサンプル（accent3の使用例）
appendixSlide.addShape(pres.ShapeType.rect, {
  x: 0.5, y: 2.8, w: 9, h: 1.5,
  fill: { color: Brand.colors.accent3 }
});
appendixSlide.addText("Accent3カラー（#C1E4F5）を背景に使用した例", {
  x: 0.6, y: 3.3, w: 8.8, h: 0.5,
  fontSize: 14, color: Brand.colors.text, fontFace: Brand.font, align: "center"
});

addPageNumber(appendixSlide, 1, { prefix: "A" });

// ============================================================
// ファイル保存
// ============================================================

const outputPath = path.join(process.env.HOME, "Desktop/NTTDXパートナー_全スライドタイプテスト.pptx");

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
