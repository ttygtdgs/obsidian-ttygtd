const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NTT DXパートナー";
pres.title = "データ基盤構築のメリット — 共立製薬様";

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
  border: "E0E0E0",
};
const F = "Meiryo UI";
const assets = path.join(process.env.HOME, ".claude/skills/ntt-dxpartner-pptx/assets");

// 共通ヘッダー
function addHeader(slide, title) {
  slide.background = { path: `${assets}/bg-content.png` };
  slide.addText(title, {
    x: 0.4, y: 0.25, w: 8, h: 0.5,
    fontSize: 24, bold: true, color: C.text, fontFace: F,
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 0.75, w: 9.2, h: 0.025, fill: { color: C.main },
  });
}

// ============================================================
// Slide 1: 表紙
// ============================================================
{
  const s = pres.addSlide();
  s.background = { path: `${assets}/bg-title.png` };
  s.addText("共立製薬株式会社 様", {
    x: 0.6, y: 1.6, w: 8, h: 0.5,
    fontSize: 20, color: C.accent, fontFace: F,
  });
  s.addText("データ基盤構築のメリット", {
    x: 0.6, y: 2.0, w: 8, h: 0.7,
    fontSize: 36, bold: true, color: C.white, fontFace: F,
  });
  s.addText("スコアシートデータの構造化による研究活用と業務効率化", {
    x: 0.6, y: 2.7, w: 8, h: 0.4,
    fontSize: 18, color: C.white, fontFace: F,
  });
  s.addText("2026年2月", {
    x: 0.6, y: 4.9, w: 2, h: 0.3,
    fontSize: 12, color: C.white, fontFace: F,
  });
  s.addImage({ path: `${assets}/logo.png`, x: 7.4, y: 4.5, w: 2.0, h: 0.47 });
}

// ============================================================
// Slide 2: メリットの全体像
// ============================================================
{
  const s = pres.addSlide();
  addHeader(s, "データ基盤構築のメリット — 全体像");

  // 2つの柱カード
  const pillars = [
    {
      num: "1",
      title: "データを研究に活かせる",
      desc: "紙ではできなかった傾向の可視化・\n異常検出・示唆出しが可能になる",
      subs: ["1-1. 傾向の可視化", "1-2. 異常検出・示唆出し"],
      color: C.main,
    },
    {
      num: "2",
      title: "業務を効率化できる",
      desc: "データの検索・転記・格納・規制対応に\nかかる手間を削減できる",
      subs: ["2-1. 過去データの検索", "2-2. 転記・格納の削減", "2-3. 規制対応", "2-4. 申請資料の作成"],
      color: C.main,
    },
  ];

  pillars.forEach((p, i) => {
    const x = 0.5 + i * 4.6;
    const w = 4.4;
    // カード背景
    s.addShape(pres.ShapeType.rect, {
      x, y: 1.1, w, h: 3.4,
      fill: { color: C.white },
      shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 },
    });
    // 上部カラーバー
    s.addShape(pres.ShapeType.rect, {
      x, y: 1.1, w, h: 0.08, fill: { color: p.color },
    });
    // 番号
    s.addText(p.num, {
      x: x + 0.15, y: 1.3, w: 0.5, h: 0.45,
      fontSize: 28, bold: true, color: C.main, fontFace: F,
    });
    // タイトル
    s.addText(p.title, {
      x: x + 0.6, y: 1.35, w: 3.5, h: 0.4,
      fontSize: 16, bold: true, color: C.text, fontFace: F,
    });
    // 区切り線
    s.addShape(pres.ShapeType.rect, {
      x: x + 0.15, y: 1.9, w: w - 0.3, h: 0.015, fill: { color: C.border },
    });
    // 説明
    s.addText(p.desc, {
      x: x + 0.15, y: 2.0, w: w - 0.3, h: 0.7,
      fontSize: 11, color: C.sub, fontFace: F, lineSpacing: 20,
    });
    // サブ項目
    p.subs.forEach((sub, j) => {
      s.addShape(pres.ShapeType.rect, {
        x: x + 0.15, y: 2.8 + j * 0.45, w: w - 0.3, h: 0.35,
        fill: { color: "EDF7FA" }, rectRadius: 0.03,
      });
      s.addText(sub, {
        x: x + 0.3, y: 2.8 + j * 0.45, w: w - 0.6, h: 0.35,
        fontSize: 11, bold: true, color: C.main, fontFace: F, valign: "middle",
      });
    });
  });

  // 下部まとめ
  s.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.7, w: 9, h: 0.5,
    fill: { color: "EDF7FA" }, line: { color: C.main, pt: 1 },
  });
  s.addText("これらにより、経験や勘ではなくデータに基づいた意思決定が可能になる", {
    x: 0.7, y: 4.72, w: 8.6, h: 0.45,
    fontSize: 12, bold: true, color: C.main, fontFace: F, valign: "middle",
  });
}

// ============================================================
// Slide 3: 1-1. 傾向の可視化
// ============================================================
{
  const s = pres.addSlide();
  addHeader(s, "1-1. 傾向の可視化");

  // 注記
  s.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 9, h: 0.4,
    fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
  });
  s.addText("※「現在の運用」は想定であり、実際の業務フローはヒアリングによる確認が必要です", {
    x: 0.7, y: 0.97, w: 8.5, h: 0.35,
    fontSize: 9, color: C.orange, fontFace: F, valign: "middle",
  });

  const scenes = [
    {
      title: "ロット間の品質比較",
      now: "試験結果を手作業で突き合わせ。\n比較基準が担当者の判断に依存",
      after: "Golden Batchプロファイルを基準に\n新ロットを自動比較、逸脱を即座に検出",
    },
    {
      title: "観察者間のスコアリング一貫性",
      now: "評価基準の統一は研修や\n口頭指導で対応",
      after: "複数観察者のスコアを統計的に比較し\n評価傾向の差を定量化",
    },
  ];

  scenes.forEach((sc, i) => {
    const y = 1.55 + i * 1.85;
    // シーンタイトル
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y, w: 9, h: 0.4,
      fill: { color: C.main },
    });
    s.addText(sc.title, {
      x: 0.65, y, w: 8.7, h: 0.4,
      fontSize: 13, bold: true, color: C.white, fontFace: F, valign: "middle",
    });

    // 現在 → データ基盤
    // 現在カード
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y + 0.5, w: 4.1, h: 1.1,
      fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
    });
    s.addText("現在の運用（想定）", {
      x: 0.65, y: y + 0.55, w: 2, h: 0.25,
      fontSize: 9, bold: true, color: C.orange, fontFace: F,
    });
    s.addText(sc.now, {
      x: 0.65, y: y + 0.8, w: 3.8, h: 0.7,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18,
    });

    // 矢印
    s.addText("→", {
      x: 4.65, y: y + 0.7, w: 0.5, h: 0.6,
      fontSize: 24, color: C.main, fontFace: F, align: "center", valign: "middle",
    });

    // データ基盤カード
    s.addShape(pres.ShapeType.rect, {
      x: 5.2, y: y + 0.5, w: 4.3, h: 1.1,
      fill: { color: "E8F5E9" }, line: { color: "2E7D32", pt: 0.5 },
    });
    s.addText("データ基盤構築後", {
      x: 5.35, y: y + 0.55, w: 2, h: 0.25,
      fontSize: 9, bold: true, color: "2E7D32", fontFace: F,
    });
    s.addText(sc.after, {
      x: 5.35, y: y + 0.8, w: 4.0, h: 0.7,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18,
    });
  });
}

// ============================================================
// Slide 4: 1-2. 異常検出・示唆出し
// ============================================================
{
  const s = pres.addSlide();
  addHeader(s, "1-2. 異常検出・示唆出し");

  s.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 9, h: 0.4,
    fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
  });
  s.addText("※「現在の運用」は想定であり、実際の業務フローはヒアリングによる確認が必要です", {
    x: 0.7, y: 0.97, w: 8.5, h: 0.35,
    fontSize: 9, color: C.orange, fontFace: F, valign: "middle",
  });

  const scenes = [
    {
      title: "試験途中の早期予測",
      now: "14日間の試験完了を\n待ってから結果を評価",
      after: "「Day3の体温がX℃超 → Day7以降に\n重篤化しやすい」等のパターンで早期判断",
    },
    {
      title: "試験に使う動物頭数の最適化",
      now: "過去の慣例や経験値を\nもとに頭数を決定",
      after: "過去データから統計的に必要な最小頭数を\n算出。コスト削減と動物福祉（3Rs）に直結",
    },
    {
      title: "Humane Endpoint基準の客観化",
      now: "試験早期終了の判断基準が\n経験則に依存",
      after: "「この閾値を超えた個体は回復しなかった」\nというエビデンスで倫理委員会に説明可能",
    },
  ];

  scenes.forEach((sc, i) => {
    const y = 1.55 + i * 1.25;
    // タイトル
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y, w: 9, h: 0.35,
      fill: { color: C.main },
    });
    s.addText(sc.title, {
      x: 0.65, y, w: 8.7, h: 0.35,
      fontSize: 12, bold: true, color: C.white, fontFace: F, valign: "middle",
    });

    // 現在カード
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y + 0.42, w: 4.1, h: 0.7,
      fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
    });
    s.addText(sc.now, {
      x: 0.65, y: y + 0.45, w: 3.8, h: 0.65,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 16, valign: "middle",
    });

    // 矢印
    s.addText("→", {
      x: 4.65, y: y + 0.42, w: 0.5, h: 0.7,
      fontSize: 22, color: C.main, fontFace: F, align: "center", valign: "middle",
    });

    // データ基盤カード
    s.addShape(pres.ShapeType.rect, {
      x: 5.2, y: y + 0.42, w: 4.3, h: 0.7,
      fill: { color: "E8F5E9" }, line: { color: "2E7D32", pt: 0.5 },
    });
    s.addText(sc.after, {
      x: 5.35, y: y + 0.45, w: 4.0, h: 0.65,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 16, valign: "middle",
    });
  });
}

// ============================================================
// Slide 5: 2. 業務を効率化できる（2-1, 2-2）
// ============================================================
{
  const s = pres.addSlide();
  addHeader(s, "2-1 / 2-2. 検索・転記格納の効率化");

  s.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 9, h: 0.4,
    fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
  });
  s.addText("※「現在の運用」は想定であり、実際の業務フローはヒアリングによる確認が必要です", {
    x: 0.7, y: 0.97, w: 8.5, h: 0.35,
    fontSize: 9, color: C.orange, fontFace: F, valign: "middle",
  });

  const scenes = [
    {
      label: "2-1",
      title: "過去データの検索",
      now: "ファイル棚や書庫から紙の記録を探す。\n担当者の異動・退職で所在不明になるリスク",
      after: "試験名・期間・投与物質・個体番号で\n即座に横断検索。誰でもアクセス可能",
    },
    {
      label: "2-2",
      title: "データの転記・格納作業",
      now: "紙に手書き記入 → ファイリング保管。\n他帳票への転記作業が発生",
      after: "タブレットから直接デジタル入力 → DB自動格納。\n転記作業・転記ミスを解消",
    },
  ];

  scenes.forEach((sc, i) => {
    const y = 1.55 + i * 1.85;
    // ラベル + タイトル
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y, w: 9, h: 0.4,
      fill: { color: C.main },
    });
    s.addText(`${sc.label}   ${sc.title}`, {
      x: 0.65, y, w: 8.7, h: 0.4,
      fontSize: 13, bold: true, color: C.white, fontFace: F, valign: "middle",
    });

    // 現在カード
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y + 0.5, w: 4.1, h: 1.1,
      fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
    });
    s.addText("現在の運用（想定）", {
      x: 0.65, y: y + 0.55, w: 2, h: 0.25,
      fontSize: 9, bold: true, color: C.orange, fontFace: F,
    });
    s.addText(sc.now, {
      x: 0.65, y: y + 0.8, w: 3.8, h: 0.7,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18,
    });

    // 矢印
    s.addText("→", {
      x: 4.65, y: y + 0.7, w: 0.5, h: 0.6,
      fontSize: 24, color: C.main, fontFace: F, align: "center", valign: "middle",
    });

    // データ基盤カード
    s.addShape(pres.ShapeType.rect, {
      x: 5.2, y: y + 0.5, w: 4.3, h: 1.1,
      fill: { color: "E8F5E9" }, line: { color: "2E7D32", pt: 0.5 },
    });
    s.addText("データ基盤構築後", {
      x: 5.35, y: y + 0.55, w: 2, h: 0.25,
      fontSize: 9, bold: true, color: "2E7D32", fontFace: F,
    });
    s.addText(sc.after, {
      x: 5.35, y: y + 0.8, w: 4.0, h: 0.7,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18,
    });
  });
}

// ============================================================
// Slide 6: 2-3 / 2-4. 規制対応・申請資料
// ============================================================
{
  const s = pres.addSlide();
  addHeader(s, "2-3 / 2-4. 規制対応・申請資料の効率化");

  s.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 9, h: 0.4,
    fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
  });
  s.addText("※「現在の運用」は想定であり、実際の業務フローはヒアリングによる確認が必要です", {
    x: 0.7, y: 0.97, w: 8.5, h: 0.35,
    fontSize: 9, color: C.orange, fontFace: F, valign: "middle",
  });

  const scenes = [
    {
      label: "2-3",
      title: "GCP査察・規制当局の監査対応",
      now: "紙の記録を手作業で整理・準備。\n修正履歴の追跡が困難",
      after: "「いつ・誰が・何を記録・修正したか」の\n監査証跡が自動記録。raw data即時提出可能",
    },
    {
      label: "2-4",
      title: "承認申請資料の作成",
      now: "臨床試験データの集計・整形を\n手作業で実施",
      after: "統計解析結果・個体別データ一覧を\n申請様式に合わせて自動出力",
    },
  ];

  scenes.forEach((sc, i) => {
    const y = 1.55 + i * 1.85;
    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y, w: 9, h: 0.4,
      fill: { color: C.main },
    });
    s.addText(`${sc.label}   ${sc.title}`, {
      x: 0.65, y, w: 8.7, h: 0.4,
      fontSize: 13, bold: true, color: C.white, fontFace: F, valign: "middle",
    });

    s.addShape(pres.ShapeType.rect, {
      x: 0.5, y: y + 0.5, w: 4.1, h: 1.1,
      fill: { color: "FFF8E1" }, line: { color: C.gold, pt: 0.5 },
    });
    s.addText("現在の運用（想定）", {
      x: 0.65, y: y + 0.55, w: 2, h: 0.25,
      fontSize: 9, bold: true, color: C.orange, fontFace: F,
    });
    s.addText(sc.now, {
      x: 0.65, y: y + 0.8, w: 3.8, h: 0.7,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18,
    });

    s.addText("→", {
      x: 4.65, y: y + 0.7, w: 0.5, h: 0.6,
      fontSize: 24, color: C.main, fontFace: F, align: "center", valign: "middle",
    });

    s.addShape(pres.ShapeType.rect, {
      x: 5.2, y: y + 0.5, w: 4.3, h: 1.1,
      fill: { color: "E8F5E9" }, line: { color: "2E7D32", pt: 0.5 },
    });
    s.addText("データ基盤構築後", {
      x: 5.35, y: y + 0.55, w: 2, h: 0.25,
      fontSize: 9, bold: true, color: "2E7D32", fontFace: F,
    });
    s.addText(sc.after, {
      x: 5.35, y: y + 0.8, w: 4.0, h: 0.7,
      fontSize: 10, color: C.text, fontFace: F, lineSpacing: 18,
    });
  });
}

// ============================================================
// Slide 7: まとめ
// ============================================================
{
  const s = pres.addSlide();
  addHeader(s, "まとめ");

  // 2つの柱サマリー
  const summaries = [
    {
      num: "1",
      title: "データを研究に活かせる",
      items: [
        "ロット間比較・観察者間ばらつきの可視化",
        "試験途中の早期予測・頭数最適化",
        "Humane Endpoint基準のエビデンス化",
      ],
      color: C.main,
    },
    {
      num: "2",
      title: "業務を効率化できる",
      items: [
        "過去データの即座の横断検索",
        "転記作業の解消・格納の自動化",
        "GCP査察対応・申請資料の自動生成",
      ],
      color: C.main,
    },
  ];

  summaries.forEach((sm, i) => {
    const x = 0.5 + i * 4.6;
    const w = 4.4;
    s.addShape(pres.ShapeType.rect, {
      x, y: 1.1, w, h: 2.8,
      fill: { color: C.white },
      shadow: { type: "outer", blur: 3, offset: 1, angle: 45, opacity: 0.15 },
    });
    s.addShape(pres.ShapeType.rect, {
      x, y: 1.1, w: 0.08, h: 2.8, fill: { color: sm.color },
    });
    s.addText(sm.num, {
      x: x + 0.2, y: 1.2, w: 0.5, h: 0.4,
      fontSize: 24, bold: true, color: C.main, fontFace: F,
    });
    s.addText(sm.title, {
      x: x + 0.65, y: 1.25, w: 3.5, h: 0.35,
      fontSize: 15, bold: true, color: C.text, fontFace: F,
    });
    s.addShape(pres.ShapeType.rect, {
      x: x + 0.15, y: 1.75, w: w - 0.3, h: 0.015, fill: { color: C.border },
    });

    const itemText = sm.items.map((it) => `✓  ${it}`).join("\n");
    s.addText(itemText, {
      x: x + 0.25, y: 1.9, w: w - 0.5, h: 1.8,
      fontSize: 11, color: C.text, fontFace: F, lineSpacing: 24, valign: "top",
    });
  });

  // メッセージ
  s.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.15, w: 9, h: 0.8,
    fill: { color: "EDF7FA" }, line: { color: C.main, pt: 1.5 },
  });
  s.addText("経験や勘ではなく、データに基づいた意思決定が可能になる", {
    x: 0.7, y: 4.2, w: 8.6, h: 0.35,
    fontSize: 14, bold: true, color: C.main, fontFace: F, valign: "middle",
  });
  s.addText("※ 「現在の運用」は想定です。実際の業務フローはヒアリングにて確認させてください", {
    x: 0.7, y: 4.55, w: 8.6, h: 0.3,
    fontSize: 10, color: C.sub, fontFace: F, valign: "middle",
  });
}

// ============================================================
// Slide 8: 最終スライド
// ============================================================
{
  const s = pres.addSlide();
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.main },
  });
  s.addText("ご清聴ありがとうございました", {
    x: 0, y: 2.2, w: 10, h: 0.7,
    fontSize: 32, bold: true, color: C.white, fontFace: F, align: "center",
  });
  s.addImage({ path: `${assets}/logo.png`, x: 3.95, y: 3.5, w: 2.1, h: 0.5 });
}

// ============================================================
// 出力
// ============================================================
const outDir = path.join(
  __dirname
);
const outFile = path.join(outDir, "データ基盤メリット提案_共立製薬_NTTDXPN.pptx");

pres.writeFile({ fileName: outFile }).then(() => {
  console.log(`PPTX generated: ${outFile}`);
});
