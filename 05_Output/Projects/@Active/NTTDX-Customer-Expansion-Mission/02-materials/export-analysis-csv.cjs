const fs = require("fs");
const iconv = require("iconv-lite");
const path = require("path");

const buf = fs.readFileSync("/Users/user/Downloads/入札王 2026.csv");
const text = iconv.decode(buf, "cp932");
const lines = text.split("\n").filter(l => l.trim());

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuote = !inQuote; }
    else if (ch === ',' && !inQuote) { result.push(current.trim()); current = ""; }
    else { current += ch; }
  }
  result.push(current.trim());
  return result;
}

const headers = parseCSVLine(lines[0]);
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const vals = parseCSVLine(lines[i]);
  const obj = {};
  headers.forEach((h, j) => { obj[h] = vals[j] || ""; });
  rows.push(obj);
}

// ========== Noise filter ==========
function isNoise(r) {
  const name = r["件名"] || "";
  const org = r["発注機関"] || "";
  if (/DIAPHRAGM|DRAG LINK|STORAGE ASSY|PANEL ASSY|SHIELD ASSY|HOUSING ASSY|ADAPTER ASSY|BRACKET ASSY|RING ASSY|COVER ASSY|TUBE ASSY|LEVER ASSY|CAP ASSY|LINK ASSY|SEAT ASSY|VALVE ASSY|SPRING ASSY|SUPPORT ASSY|RETAINER|PACKING|BUSHING/i.test(name)) return true;
  if (/RAG.*局舎|RAG.*発電|RAG.*空港|RAG.*ITV|RAG.*無線|RAG.*施設|RAG.*設備|RAG.*保守|RAG.*点検|RAG.*整備|RAG.*更新|RAG.*改修|RAG.*工事|空港.*RAG|遠隔対空通信/.test(name)) return true;
  if (/試薬|培地|プライマー|抗体.*購入|書籍購入|図書購入|雑誌購入|新聞購入|食料品|被服|草刈|清掃業務|建築工事|舗装工事/.test(name)) return true;
  if (/防衛省|防衛装備庁/.test(org)) {
    if (!/AI|生成|チャットボット|機械学習|深層学習|自然言語/i.test(name)) return true;
  }
  if (/閲覧表|閲覧\d/.test(name)) return true;
  if (/Nextorage|Ｎｅｘｔｏｒａｇｅ/.test(name)) return true;
  if (/Orage |Ｏｒａｇｅ/.test(name)) return true;
  if (/MAMMUT.*Crag|Crag.*Rope|Crag.*Helmet|Crag Classic|Crag Sender/.test(name)) return true;
  if (/SPECTRA GRAFIX|ＳＰＥＣＴＲＡ/.test(name)) return true;
  if (/DuraGen|Dura Gen|ＤｕｒａＧｅｎ/.test(name)) return true;
  if (/Virage.*ｽﾄﾚｰﾄ|Virage.*ﾎﾟﾘｱｷ|Virage.*スクリュー|インプラント一式/.test(name)) return true;
  if (/EXTRAGEN|ＥＸＴＲＡＧＥＮ/.test(name)) return true;
  if (/Ultra Gene Ass/.test(name)) return true;
  if (/図書[（(]|図書館.*図書|の購入.*書|他.*代【|図書.*ChatGPT|ChatGPT.*書|AI白書|ＡＩ白書/.test(name)) return true;
  if (/^【図書】/.test(name)) return true;
  if (/Storage Server|ストレージソフトウェア|IBM Storage|ｉＳｔｏｒａｇｅ|iStorage/.test(name)) return true;
  if (/NAS[（(]Network|ＮＡＳ[（(]Network|NAS.*サーバー更新|NAS.*導入支援/.test(name)) return true;
  if (/神津島RAG|神津島ＲＡＧ|三宅島VOR|三宅島ＶＯＲ/.test(name)) return true;
  if (/Drager|Ｄｒａｇｅｒ|ドレーゲル/.test(name)) return true;
  if (/SCOTT Rag|ＳＣＯＴＴ/.test(name) && !/AI|生成|チャット/.test(name)) return true;
  if (/Garage SW-|Ｆｉｒｓｔ Ｇａｒａｇｅ|First Garage/.test(name) && !/AI|生成/.test(name)) return true;
  if (/average\s*M[nwv]|ａｖｅｒａｇｅ|average.*シグマ|Sigma.*average/i.test(name)) return true;
  if (/ギター弦|アコースティックギター/.test(name)) return true;
  if (/シューズケース.*Storage|普通紙ロール/.test(name)) return true;
  if (/Jabra.*speak|Jabra.*GN AT3|ＪａｂｒａＧＮ/.test(name) && !/AI|生成|チャット/.test(name)) return true;
  if (/Global CCS Institute|Carbon Capture/.test(name)) return true;
  if (/gBlocks Gene Fragments/.test(name)) return true;
  if (/RENT OF MULTIFUNCTIONAL PRINTER/.test(name)) return true;
  if (/HPLC.*Nexera|ＧＰＣシステム/.test(name) && !/AI|生成/.test(name)) return true;
  if (/深層学習.*SSD|SSD.*深層学習/.test(name)) return true;
  if (/ポータブルSSD|外付け.*SSD|SSD.*購入/.test(name) && !/AI|生成|チャット/.test(name)) return true;
  if (/iPad.*購入|端末.*購入/.test(name) && !/AI|生成|チャット/.test(name)) return true;
  return false;
}

// ========== Classification ==========
function classifyPhase(name) {
  if (/研修|セミナー|ワークショップ|職業訓練|講座/.test(name)) return "①研修";
  if (/ロードマップ|計画策定|RFI|情報提供依頼|意見招請/.test(name)) return "②設計";
  if (/実証|検証|試行|トライアル|パイロット/.test(name)) return "③PoC";
  if (/運用|保守|ライセンス|サービス利用|利用契約|賃貸借/.test(name)) return "⑤運用";
  return "④構築";
}

function classifySubCat(name) {
  if (/チャットボット|chatbot/i.test(name)) return "チャットボット";
  if (/RAG/i.test(name)) return "RAG構築";
  if (/庁内.*生成AI|生成AI.*庁内|全庁.*AI|AI.*全庁/.test(name)) return "庁内生成AI環境";
  if (/学校.*AI|AI.*学校|英会話.*AI|AI.*英会話|教育.*生成AI|生成AI.*教育/.test(name)) return "教育・学校AI";
  if (/コンサル|活用支援|推進支援|アドバイザ|伴走/.test(name)) return "活用支援・コンサル";
  if (/(導入|サービス提供|環境提供|利用環境).*(生成AI|AI)|(生成AI|AI).*(導入|サービス提供|環境提供|利用環境)/.test(name)) return "生成AIサービス導入";
  if (/生成AI|生成ＡＩ/.test(name)) return "生成AI（その他）";
  return "AI（その他）";
}

function classifyAgencyType(org) {
  if (/都$|道$|府$|県$|都[^市]|北海道|東京都/.test(org)) return "都道府県";
  if (/市$|区$|町$|村$|広域|一部事務組合|消防|水道/.test(org)) return "市区町村";
  if (/省$|庁$|院$|裁判所|国会|衆議院|参議院|内閣|会計検査院/.test(org)) return "国";
  if (/機構$|研究所|大学$|大学校|法人|センター$|NICT|JAXA|JST|NEDO|理研/.test(org)) return "独法";
  return "その他";
}

function parseAmount(s) {
  const cleaned = (s || "").replace(/[,¥￥円\s"]/g, "");
  const num = parseFloat(cleaned);
  return (isNaN(num) || num <= 0) ? null : num;
}

function parseFY(r) {
  // Try 入札日 first, then 案件登録日
  const dateStr = r["入札日"] || r["案件登録日"] || "";
  const m = dateStr.match(/(\d{4})[\/\-](\d{1,2})/);
  if (!m) return null;
  const year = parseInt(m[1]);
  const month = parseInt(m[2]);
  return month >= 4 ? year : year - 1;
}

// ========== Dedup ==========
const noiseFlags = new Map();
rows.forEach((r, i) => {
  noiseFlags.set(i, isNoise(r));
});

const clean = rows.filter((r, i) => !noiseFlags.get(i));

const dedupMap = new Map();
const dedupStatus = new Map(); // track which rows are kept

clean.forEach(r => {
  const id = r["問い合わせ番号"] || "";
  const baseId = id.replace(/^[NR]/, "");
  const key = baseId || (r["件名"] || "").replace(/\s+/g, "").substring(0, 30);
  if (!dedupMap.has(key)) {
    dedupMap.set(key, r);
  } else {
    const existing = dedupMap.get(key);
    const existPrefix = (existing["問い合わせ番号"] || "").charAt(0);
    const prefix = id.charAt(0);
    if (prefix === "R" && existPrefix === "N") {
      if (!r["入札日"] && existing["入札日"]) r["入札日"] = existing["入札日"];
      dedupMap.set(key, r);
    }
  }
});

const uniqueSet = new Set([...dedupMap.values()]);

// ========== Build output ==========
const outHeaders = [
  "問い合わせ番号",
  "ステータス",
  "発注機関",
  "機関タイプ",
  "発注地域",
  "件名",
  "フェーズ",
  "サブカテゴリ",
  "年度",
  "入札種別",
  "案件登録日",
  "入札日",
  "開札日",
  "落札会社名",
  "落札金額",
  "落札金額(数値)",
  "予定金額",
  "応札企業",
  "応札社数",
  "ノイズ判定",
  "重複除外",
  "採用レコード",
];

function countBidders(s) {
  if (!s || s.trim() === "") return 0;
  return s.split(/[,、\n]/).filter(x => x.trim()).length;
}

function escCSV(v) {
  const s = String(v == null ? "" : v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const csvLines = [outHeaders.map(escCSV).join(",")];

rows.forEach((r, i) => {
  const noise = noiseFlags.get(i);
  const name = r["件名"] || "";
  const org = r["発注機関"] || "";
  const id = r["問い合わせ番号"] || "";
  const prefix = id.charAt(0);
  const status = prefix === "R" ? "落札結果" : prefix === "N" ? "入札中" : "";
  const phase = classifyPhase(name);
  const subCat = phase === "④構築" ? classifySubCat(name) : "";
  const agencyType = classifyAgencyType(org);
  const fy = parseFY(r);
  const amtRaw = r["落札金額"] || "";
  const amtNum = parseAmount(amtRaw);
  const bidders = countBidders(r["応札企業"] || "");
  const isDup = !noise && !uniqueSet.has(r);
  const isAdopted = !noise && uniqueSet.has(r);

  const row = [
    id,
    status,
    org,
    noise ? "" : agencyType,
    r["発注地域"] || "",
    name,
    noise ? "" : phase,
    noise ? "" : subCat,
    noise ? "" : (fy ? `FY${fy}` : ""),
    r["入札種別"] || "",
    r["案件登録日"] || "",
    r["入札日"] || "",
    r["開札日"] || "",
    r["落札会社名"] || "",
    amtRaw,
    amtNum != null ? amtNum : "",
    r["予定金額"] || "",
    r["応札企業"] || "",
    bidders > 0 ? bidders : "",
    noise ? "ノイズ" : "",
    isDup ? "重複" : "",
    isAdopted ? "○" : "",
  ];

  csvLines.push(row.map(escCSV).join(","));
});

// Write as UTF-8 with BOM (for Excel compatibility)
const outDir = path.join(process.env.HOME, "Desktop/obsidian-ttygtd/05_Output/Projects/@Active/NTTDX-Customer-Expansion-Mission/02-materials");
const outPath = path.join(outDir, "入札キング分析済みデータ.csv");
const bom = "\uFEFF";
fs.writeFileSync(outPath, bom + csvLines.join("\n"), "utf8");

// Stats
const noiseTotal = rows.filter((r, i) => noiseFlags.get(i)).length;
const uniqueTotal = uniqueSet.size;
const adoptedWithAmt = [...uniqueSet].filter(r => parseAmount(r["落札金額"] || "") !== null).length;

console.log(`=== CSV出力完了 ===`);
console.log(`出力先: ${outPath}`);
console.log(`全${rows.length}行（ノイズ${noiseTotal}件 + 重複${rows.length - noiseTotal - uniqueTotal}件 + 採用${uniqueTotal}件）`);
console.log(`うち金額判明: ${adoptedWithAmt}件`);
console.log(`\nカラム: ${outHeaders.join(", ")}`);
