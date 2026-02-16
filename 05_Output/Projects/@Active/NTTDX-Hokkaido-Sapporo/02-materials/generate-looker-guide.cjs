const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ============================================================
// Looker Studio 操作ガイド - 学生配布用
// ============================================================

const assetsPath = path.join(process.env.HOME, ".claude/skills/ntt-dxpartner-pptx/assets");

const Brand = {
  colors: {
    main: "297593",
    accent3: "C1E4F5",
    gold: "F3C551",
    text: "595959",
    subText: "7F7F7F",
    lineGray: "808080",
    white: "FFFFFF",
    copyright: "898989"
  },
  font: "Meiryo UI"
};

const Layout = {
  header: {
    title: { x: 0.43, y: 0.07, w: 9.0, h: 0.4, fontSize: 24.0 },
    decorLines: {
      line1: { x: 0.36, y: 0.3, h: 0.28 },
      line2: { x: 0.40, y: 0.32, h: 0.28 },
      line3: { x: 0.44, y: 0.35, h: 0.28 }
    },
    underline1: { x: 0.12, y: 0.4, w: 2.9 },
    underline2: { x: 0.22, y: 0.44, w: 2.2 },
    underline3: { x: 0.18, y: 0.48, w: 2.55 }
  },
  footer: {
    copyright: { x: -0.02, y: 5.45, w: 9.3, h: 0.17, fontSize: 8 }
  }
};

function addContentSlide(pres, title, contentFn) {
  const slide = pres.addSlide();
  slide.background = { color: Brand.colors.white };

  const lineWidth = 0.005;
  [Layout.header.decorLines.line1, Layout.header.decorLines.line2, Layout.header.decorLines.line3].forEach(line => {
    slide.addShape(pres.ShapeType.line, {
      x: line.x, y: line.y, w: lineWidth, h: line.h,
      line: { color: Brand.colors.main, width: 0.5 }
    });
  });

  [Layout.header.underline1, Layout.header.underline2, Layout.header.underline3].forEach(ul => {
    slide.addShape(pres.ShapeType.line, {
      x: ul.x, y: ul.y, w: ul.w, h: 0,
      line: { color: Brand.colors.lineGray, width: 0.5 }
    });
  });

  slide.addText(title, {
    x: Layout.header.title.x, y: Layout.header.title.y,
    w: Layout.header.title.w, h: Layout.header.title.h,
    fontSize: Layout.header.title.fontSize,
    bold: true, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addText("Copyright © 2026, NTT DXPartner Co.,Ltd , All rights reserved.", {
    x: Layout.footer.copyright.x, y: Layout.footer.copyright.y,
    w: Layout.footer.copyright.w, h: Layout.footer.copyright.h,
    fontSize: Layout.footer.copyright.fontSize,
    color: Brand.colors.copyright, fontFace: Brand.font
  });

  if (contentFn) contentFn(slide);
  return slide;
}

function tableHeader(cols) {
  return cols.map(c => ({ text: c, options: { bold: true, fill: Brand.colors.main, color: Brand.colors.white } }));
}

// ============================================================
// メイン処理
// ============================================================

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 });
pres.layout = "CUSTOM";

// ===== スライド1: 画面構成と基本操作 =====
addContentSlide(pres, "Looker Studio 操作ガイド", slide => {
  // 画面構成（左半分）
  slide.addText("【画面の見方】", {
    x: 0.4, y: 0.85, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });

  // 画面図解
  // メニューバー
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.25, w: 4.4, h: 0.4,
    fill: { color: "E0E0E0" }, line: { color: "BDBDBD", width: 0.5 }
  });
  slide.addText("メニューバー（グラフを追加、表示、共有）", {
    x: 0.5, y: 1.28, w: 4.2, h: 0.35,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });

  // 左パネル
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.7, w: 1.0, h: 2.0,
    fill: { color: "F5F5F5" }, line: { color: "BDBDBD", width: 0.5 }
  });
  slide.addText("データ\nパネル", {
    x: 0.45, y: 2.3, w: 0.9, h: 0.8,
    fontSize: 8, color: Brand.colors.subText, fontFace: Brand.font, align: "center"
  });

  // キャンバス
  slide.addShape(pres.ShapeType.rect, {
    x: 1.45, y: 1.7, w: 2.0, h: 2.0,
    fill: { color: Brand.colors.white }, line: { color: "BDBDBD", width: 0.5 }
  });
  slide.addText("キャンバス\n（レポート作成）", {
    x: 1.5, y: 2.3, w: 1.9, h: 0.8,
    fontSize: 9, color: Brand.colors.subText, fontFace: Brand.font, align: "center"
  });

  // 右パネル
  slide.addShape(pres.ShapeType.rect, {
    x: 3.5, y: 1.7, w: 1.3, h: 2.0,
    fill: { color: Brand.colors.accent3 }, line: { color: "BDBDBD", width: 0.5 }
  });
  slide.addText("プロパティ\nパネル\n（設定変更）", {
    x: 3.55, y: 2.2, w: 1.2, h: 1.0,
    fontSize: 8, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });

  // 凡例
  slide.addText("★ グラフを選択すると右側に設定パネルが出る", {
    x: 0.4, y: 3.8, w: 4.4, h: 0.3,
    fontSize: 9, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });

  // 基本操作（右半分）
  slide.addText("【よく使う操作】", {
    x: 5.1, y: 0.85, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });

  const operations = [
    tableHeader(["やりたいこと", "操作方法"]),
    ["グラフを追加", "「グラフを追加」→ 種類選択 → ドラッグ配置"],
    ["データを変更", "グラフ選択 → 右パネル「ディメンション」「指標」"],
    ["フィルター", "グラフ選択 → 右パネル「フィルター」"],
    ["並び替え", "グラフ選択 → 右パネル「並べ替え」"],
    ["元に戻す", "Ctrl + Z（Mac: Cmd + Z）"],
    ["プレビュー", "右上「表示」ボタン"]
  ];
  slide.addTable(operations, {
    x: 5.1, y: 1.2, w: 4.5, h: 2.5,
    fontFace: Brand.font, fontSize: 9, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main },
    colW: [1.5, 3.0]
  });

  // ポイント
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 3.75, w: 4.5, h: 0.35,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("保存は自動！ 右上に「保存済み」と表示されます", {
    x: 5.2, y: 3.78, w: 4.3, h: 0.3,
    fontSize: 10, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });

  // 困ったとき
  slide.addText("【困ったとき】", {
    x: 5.1, y: 4.2, w: 4.5, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("• グラフが出ない → ディメンションと指標を両方設定\n• 消してしまった → Ctrl+Z で元に戻る\n• 表示がおかしい → 右上「表示」で確認", {
    x: 5.1, y: 4.5, w: 4.5, h: 0.9,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド2: ディメンションと指標の見分け方 =====
addContentSlide(pres, "ディメンションと指標を理解しよう", slide => {
  // 導入文
  slide.addText("Looker Studioでグラフを作るとき、必ず「ディメンション」と「指標」を設定します。", {
    x: 0.4, y: 0.8, w: 9.2, h: 0.3,
    fontSize: 11, color: Brand.colors.text, fontFace: Brand.font
  });

  // ディメンション説明（左半分）緑色
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.2, w: 4.4, h: 0.4,
    fill: { color: "4CAF50" }
  });
  slide.addText("ディメンション（緑色で表示）", {
    x: 0.5, y: 1.23, w: 4.2, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  slide.addText("＝「分類・グループ分け」に使う項目", {
    x: 0.4, y: 1.7, w: 4.4, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });

  const dimExamples = [
    "• 選手名（誰？）",
    "• チーム名（どのチーム？）",
    "• 業種（何の業界？）",
    "• 日付（いつ？）",
    "• 地域・エリア（どこ？）"
  ];
  slide.addText(dimExamples.join("\n"), {
    x: 0.5, y: 2.05, w: 4.2, h: 1.3,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 3.4, w: 4.4, h: 0.5,
    fill: { color: "E8F5E9" }
  });
  slide.addText("見分け方: 「〇〇ごとに」と言えるもの\n例）選手ごとに、チームごとに、日付ごとに", {
    x: 0.5, y: 3.45, w: 4.2, h: 0.45,
    fontSize: 9, color: "2E7D32", fontFace: Brand.font
  });

  // 指標説明（右半分）青色
  slide.addShape(pres.ShapeType.rect, {
    x: 5.2, y: 1.2, w: 4.4, h: 0.4,
    fill: { color: "2196F3" }
  });
  slide.addText("指標（青色で表示）", {
    x: 5.3, y: 1.23, w: 4.2, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  slide.addText("＝「数えたり計算したりする」数値", {
    x: 5.2, y: 1.7, w: 4.4, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });

  const metricExamples = [
    "• 得点（何点？）",
    "• 出場時間（何分？）",
    "• 件数（いくつ？）",
    "• 売上金額（いくら？）",
    "• 平均値・合計値"
  ];
  slide.addText(metricExamples.join("\n"), {
    x: 5.3, y: 2.05, w: 4.2, h: 1.3,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addShape(pres.ShapeType.rect, {
    x: 5.2, y: 3.4, w: 4.4, h: 0.5,
    fill: { color: "E3F2FD" }
  });
  slide.addText("見分け方: 「合計」「平均」「最大」できるもの\n例）得点の合計、出場時間の平均", {
    x: 5.3, y: 3.45, w: 4.2, h: 0.45,
    fontSize: 9, color: "1565C0", fontFace: Brand.font
  });

  // 覚え方のコツ
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.05, w: 9.2, h: 1.0,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("★ 覚え方のコツ", {
    x: 0.5, y: 4.1, w: 2.0, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("グラフの「軸」や「分類」になるもの → ディメンション（緑）　　　グラフの「棒の高さ」や「数字」になるもの → 指標（青）\n\n例）「チームごとの得点合計」を棒グラフにしたい → ディメンション＝チーム名、指標＝得点", {
    x: 0.5, y: 4.4, w: 9.0, h: 0.6,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド3: よく使う4つのグラフ =====
addContentSlide(pres, "よく使う4つのグラフ", slide => {
  slide.addText("「グラフを追加」から選べる、実務でよく使うグラフ4種類を紹介します。", {
    x: 0.4, y: 0.8, w: 9.2, h: 0.3,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  // 4つのグラフを2x2で配置
  const graphs = [
    {
      name: "表（テーブル）",
      desc: "データを一覧で表示",
      use: "件数・金額などの詳細確認",
      example: "選手別の得点一覧"
    },
    {
      name: "棒グラフ",
      desc: "数値の大小を比較",
      use: "ランキング、比較分析",
      example: "チーム別の総得点"
    },
    {
      name: "円グラフ",
      desc: "割合・構成比を表示",
      use: "シェア、内訳の把握",
      example: "業種別の店舗数割合"
    },
    {
      name: "スコアカード",
      desc: "数値だけをシンプルに表示",
      use: "重要指標の強調表示",
      example: "総得点「1,234点」"
    }
  ];

  graphs.forEach((g, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.4 + col * 4.7;
    const y = 1.15 + row * 1.75;

    // グラフ名ヘッダー
    slide.addShape(pres.ShapeType.rect, {
      x: x, y: y, w: 4.5, h: 0.35,
      fill: { color: Brand.colors.main }
    });
    slide.addText(g.name, {
      x: x + 0.1, y: y + 0.02, w: 4.3, h: 0.3,
      fontSize: 12, bold: true, color: Brand.colors.white, fontFace: Brand.font
    });

    // 説明エリア
    slide.addShape(pres.ShapeType.rect, {
      x: x, y: y + 0.35, w: 4.5, h: 1.25,
      fill: { color: "F8F8F8" }, line: { color: "E0E0E0", width: 0.5 }
    });
    slide.addText(`${g.desc}`, {
      x: x + 0.1, y: y + 0.45, w: 4.3, h: 0.25,
      fontSize: 10, bold: true, color: Brand.colors.text, fontFace: Brand.font
    });
    slide.addText(`使い所: ${g.use}`, {
      x: x + 0.1, y: y + 0.75, w: 4.3, h: 0.25,
      fontSize: 9, color: Brand.colors.subText, fontFace: Brand.font
    });
    slide.addText(`例）${g.example}`, {
      x: x + 0.1, y: y + 1.05, w: 4.3, h: 0.25,
      fontSize: 9, color: Brand.colors.main, fontFace: Brand.font
    });
  });

  // 共通手順
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.7, w: 9.2, h: 0.5,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("★ 共通手順: 「グラフを追加」→ 種類を選択 → キャンバス上でクリックして配置 → 右パネルで設定", {
    x: 0.5, y: 4.75, w: 9.0, h: 0.4,
    fontSize: 10, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド4: 表（テーブル）の作り方 =====
addContentSlide(pres, "表（テーブル）の作り方", slide => {
  slide.addText("データを一覧表示したいときは「表」を使います。選手一覧や店舗リストなど。", {
    x: 0.4, y: 0.8, w: 9.2, h: 0.3,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  // 左側：手順
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.15, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("作成手順", {
    x: 0.5, y: 1.18, w: 4.3, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  const tableSteps = [
    { num: "1", text: "「グラフを追加」をクリック" },
    { num: "2", text: "「表」を選択" },
    { num: "3", text: "キャンバス上でクリックして配置" },
    { num: "4", text: "右パネルの「設定」タブで\n　ディメンション（行の項目）を追加" },
    { num: "5", text: "指標（表示したい数値）を追加" }
  ];

  tableSteps.forEach((step, idx) => {
    const y = 1.65 + idx * 0.5;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.4, y: y, w: 0.35, h: 0.35,
      fill: { color: Brand.colors.gold }
    });
    slide.addText(step.num, {
      x: 0.4, y: y, w: 0.35, h: 0.35,
      fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(step.text, {
      x: 0.85, y: y, w: 4.0, h: 0.45,
      fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
    });
  });

  // 右側：設定例
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 1.15, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("設定例", {
    x: 5.2, y: 1.18, w: 4.3, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  // 設定例の図解
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 1.65, w: 4.5, h: 2.7,
    fill: { color: "F5F5F5" }, line: { color: "E0E0E0", width: 0.5 }
  });

  slide.addText("【選手別成績表を作る場合】", {
    x: 5.2, y: 1.75, w: 4.3, h: 0.3,
    fontSize: 10, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });

  slide.addText("ディメンション（緑）:", {
    x: 5.2, y: 2.1, w: 4.3, h: 0.25,
    fontSize: 9, bold: true, color: "4CAF50", fontFace: Brand.font
  });
  slide.addText("　選手名　→ 行ごとに1選手", {
    x: 5.2, y: 2.35, w: 4.3, h: 0.25,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addText("指標（青）:", {
    x: 5.2, y: 2.7, w: 4.3, h: 0.25,
    fontSize: 9, bold: true, color: "2196F3", fontFace: Brand.font
  });
  slide.addText("　得点、出場時間、アシスト数\n　→ 列として数値を表示", {
    x: 5.2, y: 2.95, w: 4.3, h: 0.45,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addText("結果イメージ:", {
    x: 5.2, y: 3.5, w: 4.3, h: 0.25,
    fontSize: 9, bold: true, color: Brand.colors.subText, fontFace: Brand.font
  });
  // ミニテーブルイメージ
  const miniTable = [
    tableHeader(["選手名", "得点", "出場時間"]),
    ["田中 太郎", "15", "35分"],
    ["鈴木 次郎", "12", "42分"],
    ["...", "...", "..."]
  ];
  slide.addTable(miniTable, {
    x: 5.2, y: 3.75, w: 4.3, h: 0.55,
    fontFace: Brand.font, fontSize: 8, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main },
    colW: [1.8, 1.0, 1.5]
  });

  // 下部のヒント
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.5, w: 9.2, h: 0.6,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("★ ポイント", {
    x: 0.5, y: 4.55, w: 1.5, h: 0.25,
    fontSize: 10, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("指標を複数追加すると列が増えます。「行数」設定で表示件数を制限できます（例：上位10件）", {
    x: 0.5, y: 4.8, w: 9.0, h: 0.25,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド5: 棒グラフ・円グラフの作り方 =====
addContentSlide(pres, "棒グラフ・円グラフの作り方", slide => {
  // 棒グラフ（左半分）
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 0.85, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("棒グラフ", {
    x: 0.5, y: 0.88, w: 4.3, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  const barSteps = [
    { num: "1", text: "「グラフを追加」→「棒グラフ」" },
    { num: "2", text: "キャンバス上でクリックして配置" },
    { num: "3", text: "ディメンション（緑）を設定\n　→ 横軸（例：チーム名、選手名）" },
    { num: "4", text: "指標（青）を設定\n　→ 棒の高さ（例：得点、件数）" }
  ];

  barSteps.forEach((step, idx) => {
    const y = 1.35 + idx * 0.58;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.4, y: y, w: 0.35, h: 0.35,
      fill: { color: Brand.colors.gold }
    });
    slide.addText(step.num, {
      x: 0.4, y: y, w: 0.35, h: 0.35,
      fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(step.text, {
      x: 0.85, y: y, w: 4.0, h: 0.55,
      fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
    });
  });

  // 棒グラフの使い所
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 3.7, w: 4.5, h: 0.6,
    fill: { color: "E8F5E9" }
  });
  slide.addText("使い所：大小の比較、ランキング表示\n例）チーム別得点、月別売上", {
    x: 0.5, y: 3.75, w: 4.3, h: 0.5,
    fontSize: 9, color: "2E7D32", fontFace: Brand.font
  });

  // 円グラフ（右半分）
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 0.85, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("円グラフ", {
    x: 5.2, y: 0.88, w: 4.3, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  const pieSteps = [
    { num: "1", text: "「グラフを追加」→「円グラフ」" },
    { num: "2", text: "キャンバス上でクリックして配置" },
    { num: "3", text: "ディメンション（緑）を設定\n　→ 分類（例：業種、ポジション）" },
    { num: "4", text: "指標（青）を設定\n　→ 割合の元になる数値（例：件数）" }
  ];

  pieSteps.forEach((step, idx) => {
    const y = 1.35 + idx * 0.58;
    slide.addShape(pres.ShapeType.rect, {
      x: 5.1, y: y, w: 0.35, h: 0.35,
      fill: { color: Brand.colors.gold }
    });
    slide.addText(step.num, {
      x: 5.1, y: y, w: 0.35, h: 0.35,
      fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(step.text, {
      x: 5.55, y: y, w: 4.0, h: 0.55,
      fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
    });
  });

  // 円グラフの使い所
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 3.7, w: 4.5, h: 0.6,
    fill: { color: "E3F2FD" }
  });
  slide.addText("使い所：割合・構成比の表示\n例）業種別シェア、ポジション別人数", {
    x: 5.2, y: 3.75, w: 4.3, h: 0.5,
    fontSize: 9, color: "1565C0", fontFace: Brand.font
  });

  // 共通ポイント
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.45, w: 9.2, h: 0.7,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("★ グラフが表示されないとき", {
    x: 0.5, y: 4.5, w: 4.0, h: 0.25,
    fontSize: 10, bold: true, color: Brand.colors.text, fontFace: Brand.font
  });
  slide.addText("→ ディメンション（緑）と指標（青）が両方設定されているか確認！\n→ 片方だけだとグラフは表示されません", {
    x: 0.5, y: 4.75, w: 9.0, h: 0.35,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド6: スコアカードの使い方 =====
addContentSlide(pres, "スコアカードの使い方", slide => {
  slide.addText("数値だけをシンプルに表示したいときは「スコアカード」を使います。", {
    x: 0.4, y: 0.8, w: 9.2, h: 0.3,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  // スコアカードとは
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.15, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("スコアカードとは？", {
    x: 0.5, y: 1.18, w: 4.3, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.6, w: 4.5, h: 1.8,
    fill: { color: "F5F5F5" }, line: { color: "E0E0E0", width: 0.5 }
  });

  slide.addText("重要な数値を大きく表示する\nシンプルなグラフです。", {
    x: 0.5, y: 1.7, w: 4.3, h: 0.5,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  // スコアカードイメージ
  slide.addShape(pres.ShapeType.rect, {
    x: 1.0, y: 2.3, w: 3.4, h: 0.9,
    fill: { color: Brand.colors.white }, line: { color: Brand.colors.main, width: 1 }
  });
  slide.addText("総得点", {
    x: 1.1, y: 2.35, w: 3.2, h: 0.3,
    fontSize: 10, color: Brand.colors.subText, fontFace: Brand.font, align: "center"
  });
  slide.addText("1,234", {
    x: 1.1, y: 2.6, w: 3.2, h: 0.5,
    fontSize: 28, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });

  // 作成手順（右側）
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 1.15, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("作成手順", {
    x: 5.2, y: 1.18, w: 4.3, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  const scoreSteps = [
    { num: "1", text: "「グラフを追加」→「スコアカード」" },
    { num: "2", text: "キャンバス上でクリックして配置" },
    { num: "3", text: "指標（青）を設定\n　→ 表示したい数値（例：得点の合計）" },
    { num: "4", text: "※ディメンションは不要です！" }
  ];

  scoreSteps.forEach((step, idx) => {
    const y = 1.65 + idx * 0.55;
    slide.addShape(pres.ShapeType.rect, {
      x: 5.1, y: y, w: 0.35, h: 0.35,
      fill: { color: Brand.colors.gold }
    });
    slide.addText(step.num, {
      x: 5.1, y: y, w: 0.35, h: 0.35,
      fontSize: 12, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center", valign: "middle"
    });
    slide.addText(step.text, {
      x: 5.55, y: y, w: 4.0, h: 0.5,
      fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
    });
  });

  // 使い所
  slide.addText("【こんなときに使う】", {
    x: 0.4, y: 3.55, w: 4.5, h: 0.3,
    fontSize: 10, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("• KPIや目標数値を目立たせたい\n• 「合計〇〇件」などシンプルに表示\n• ダッシュボードの見出し的に使う", {
    x: 0.4, y: 3.85, w: 4.5, h: 0.7,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });

  // ポイント
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.6, w: 9.2, h: 0.55,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("★ スコアカードは「指標だけ」で使える唯一のグラフ！ディメンションは設定不要です。", {
    x: 0.5, y: 4.65, w: 9.0, h: 0.45,
    fontSize: 10, bold: true, color: Brand.colors.main, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド7: フィルターと並べ替え =====
addContentSlide(pres, "フィルターと並べ替えを使おう", slide => {
  // フィルター説明（左半分）
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 0.85, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("フィルター（データを絞り込む）", {
    x: 0.5, y: 0.88, w: 4.3, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  slide.addText("使い方", {
    x: 0.4, y: 1.35, w: 1.0, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });

  const filterSteps = [
    "1. グラフをクリックして選択",
    "2. 右パネルの「設定」タブを開く",
    "3. 「フィルター」の「+フィルターを追加」",
    "4. 条件を設定（例：チーム＝○○）"
  ];
  slide.addText(filterSteps.join("\n"), {
    x: 0.4, y: 1.65, w: 4.4, h: 1.0,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addText("活用例", {
    x: 0.4, y: 2.7, w: 1.0, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("• 特定のチームだけ表示したい\n• 「飲食店」だけに絞りたい\n• ○月以降のデータだけ見たい", {
    x: 0.4, y: 3.0, w: 4.4, h: 0.8,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  // 並べ替え説明（右半分）
  slide.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 0.85, w: 4.5, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("並べ替え（順番を変える）", {
    x: 5.2, y: 0.88, w: 4.3, h: 0.35,
    fontSize: 13, bold: true, color: Brand.colors.white, fontFace: Brand.font
  });

  slide.addText("使い方", {
    x: 5.1, y: 1.35, w: 1.0, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });

  const sortSteps = [
    "1. グラフをクリックして選択",
    "2. 右パネルの「設定」タブを開く",
    "3. 「並べ替え」の項目を選択",
    "4. 昇順（小→大）or 降順（大→小）を選ぶ"
  ];
  slide.addText(sortSteps.join("\n"), {
    x: 5.1, y: 1.65, w: 4.4, h: 1.0,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  slide.addText("活用例", {
    x: 5.1, y: 2.7, w: 1.0, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("• 得点が多い順に並べたい → 降順\n• 名前順（あいうえお順）にしたい → 昇順\n• 上位10件だけ表示したい → 行数制限", {
    x: 5.1, y: 3.0, w: 4.4, h: 0.8,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });

  // 行数制限の説明
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 3.9, w: 9.2, h: 1.2,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("★ 表示件数を制限する方法（トップ10など）", {
    x: 0.5, y: 3.95, w: 9.0, h: 0.3,
    fontSize: 11, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("右パネル →「設定」タブ →「行数」で数字を入力（例：10）\n→ 並べ替えと組み合わせると「得点トップ10」などが作れる！", {
    x: 0.5, y: 4.3, w: 9.0, h: 0.7,
    fontSize: 10, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ===== スライド8: よくあるトラブルと解決法 =====
addContentSlide(pres, "困ったときの対処法", slide => {
  // トラブル一覧
  const troubles = [
    {
      problem: "グラフが表示されない・エラーが出る",
      solutions: [
        "→ ディメンションと指標が両方設定されているか確認",
        "→ データソースが正しく接続されているか確認",
        "→ 一度グラフを削除して、新しく作り直す"
      ]
    },
    {
      problem: "データが更新されない・古いまま",
      solutions: [
        "→ ブラウザを「スーパーリロード」する",
        "　 Windows: Shift + 更新ボタン または Ctrl + Shift + R",
        "　 Mac: Shift + 更新ボタン または Cmd + Shift + R"
      ]
    },
    {
      problem: "間違えて消してしまった",
      solutions: [
        "→ すぐに Ctrl + Z（Mac: Cmd + Z）で元に戻す",
        "→ 何度も押せば、複数の操作を戻せます"
      ]
    },
    {
      problem: "表示がおかしい・レイアウトが崩れる",
      solutions: [
        "→ 右上の「表示」ボタンでプレビュー確認",
        "→ グラフのサイズや位置を調整"
      ]
    }
  ];

  let yPos = 0.85;
  troubles.forEach((t, idx) => {
    // 問題タイトル
    slide.addShape(pres.ShapeType.rect, {
      x: 0.4, y: yPos, w: 9.2, h: 0.35,
      fill: { color: idx % 2 === 0 ? "FFEBEE" : "FFF3E0" }
    });
    slide.addText(`Q: ${t.problem}`, {
      x: 0.5, y: yPos + 0.03, w: 9.0, h: 0.3,
      fontSize: 11, bold: true, color: idx % 2 === 0 ? "C62828" : "E65100", fontFace: Brand.font
    });
    yPos += 0.4;

    // 解決法
    slide.addText(t.solutions.join("\n"), {
      x: 0.5, y: yPos, w: 9.0, h: t.solutions.length * 0.22,
      fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
    });
    yPos += t.solutions.length * 0.22 + 0.15;
  });

  // 最後のヒント
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.7, w: 9.2, h: 0.45,
    fill: { color: Brand.colors.gold }
  });
  slide.addText("💡 迷ったら → グラフを選択して右パネルを確認！ 設定は全て右側で変更できます", {
    x: 0.5, y: 4.75, w: 9.0, h: 0.35,
    fontSize: 11, bold: true, color: Brand.colors.text, fontFace: Brand.font, align: "center"
  });
});

// ===== スライド9: ショートカットキー一覧 =====
addContentSlide(pres, "便利なショートカットキー", slide => {
  // Windows
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 0.85, w: 4.4, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("Windows", {
    x: 0.5, y: 0.88, w: 4.2, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center"
  });

  const winShortcuts = [
    tableHeader(["操作", "キー"]),
    ["元に戻す", "Ctrl + Z"],
    ["やり直す", "Ctrl + Y"],
    ["コピー", "Ctrl + C"],
    ["貼り付け", "Ctrl + V"],
    ["全選択", "Ctrl + A"],
    ["保存（自動）", "自動保存されます"],
    ["スーパーリロード", "Ctrl + Shift + R"]
  ];
  slide.addTable(winShortcuts, {
    x: 0.4, y: 1.3, w: 4.4, h: 2.8,
    fontFace: Brand.font, fontSize: 10, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main },
    colW: [2.4, 2.0]
  });

  // Mac
  slide.addShape(pres.ShapeType.rect, {
    x: 5.2, y: 0.85, w: 4.4, h: 0.4,
    fill: { color: Brand.colors.main }
  });
  slide.addText("Mac", {
    x: 5.3, y: 0.88, w: 4.2, h: 0.35,
    fontSize: 14, bold: true, color: Brand.colors.white, fontFace: Brand.font, align: "center"
  });

  const macShortcuts = [
    tableHeader(["操作", "キー"]),
    ["元に戻す", "Cmd + Z"],
    ["やり直す", "Cmd + Shift + Z"],
    ["コピー", "Cmd + C"],
    ["貼り付け", "Cmd + V"],
    ["全選択", "Cmd + A"],
    ["保存（自動）", "自動保存されます"],
    ["スーパーリロード", "Cmd + Shift + R"]
  ];
  slide.addTable(macShortcuts, {
    x: 5.2, y: 1.3, w: 4.4, h: 2.8,
    fontFace: Brand.font, fontSize: 10, color: Brand.colors.text,
    border: { pt: 0.5, color: Brand.colors.main },
    colW: [2.4, 2.0]
  });

  // 補足
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 4.25, w: 9.2, h: 0.85,
    fill: { color: Brand.colors.accent3 }
  });
  slide.addText("【覚えておくと便利】", {
    x: 0.5, y: 4.3, w: 3.0, h: 0.25,
    fontSize: 10, bold: true, color: Brand.colors.main, fontFace: Brand.font
  });
  slide.addText("• Ctrl + Z（Cmd + Z）の「元に戻す」は最もよく使うショートカット！\n• 間違えたらすぐ Ctrl + Z を押す習慣をつけよう\n• 保存は自動なので、作業中に何もする必要はありません", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.5,
    fontSize: 9, color: Brand.colors.text, fontFace: Brand.font
  });
});

// ファイル出力
const outputPath = path.join(__dirname, "Looker-Studio-操作ガイド_NTTDXPN.pptx");
pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`Success: PowerPoint created at ${outputPath}`))
  .catch(err => console.error("Error:", err));
