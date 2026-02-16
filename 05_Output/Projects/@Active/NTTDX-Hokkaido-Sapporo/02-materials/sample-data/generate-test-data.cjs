const fs = require('fs');
const path = require('path');

// 地域データ
const areas = [
  { code: '01101', name: '札幌市中央区', districts: ['南一条西', '南二条西', '南三条西', '南四条西', '南五条西', '南六条西', '大通西', '北一条西', '北二条西', '北三条西'] },
  { code: '01102', name: '札幌市北区', districts: ['北七条西', '北八条西', '北十八条西', '北二十条西', '新琴似', '麻生町'] },
  { code: '01103', name: '札幌市東区', districts: ['北十五条東', '北二十条東', '北二十五条東', '東苗穂'] },
  { code: '01104', name: '札幌市白石区', districts: ['南郷通', '本通', '菊水', '東札幌'] },
  { code: '01105', name: '札幌市豊平区', districts: ['豊平三条', '月寒中央通', '平岸', '美園'] },
  { code: '01106', name: '札幌市南区', districts: ['澄川', '真駒内', '定山渓温泉'] },
  { code: '01107', name: '札幌市西区', districts: ['琴似', '二十四軒', '発寒', '西野'] },
  { code: '01108', name: '札幌市厚別区', districts: ['厚別中央', '大谷地', '青葉町'] },
  { code: '01109', name: '札幌市手稲区', districts: ['手稲本町', '前田', '星置'] },
  { code: '01110', name: '札幌市清田区', districts: ['清田', '平岡', '里塚'] }
];

// 業種データ（トレンドを持たせる）
const industries = [
  { code: '52', name: 'そば・うどん店', tpCode: '5299', tpName: 'ラーメン店', trend: -0.02, base: 50 },
  { code: '52', name: 'そば・うどん店', tpCode: '5205', tpName: '居酒屋', trend: -0.05, base: 80 },
  { code: '52', name: 'そば・うどん店', tpCode: '5207', tpName: '喫茶店', trend: 0.08, base: 40 },
  { code: '52', name: 'そば・うどん店', tpCode: '5206', tpName: 'バー', trend: -0.06, base: 30 },
  { code: '52', name: 'そば・うどん店', tpCode: '5203', tpName: '日本料理店', trend: -0.01, base: 25 },
  { code: '52', name: 'そば・うどん店', tpCode: '5201', tpName: '中華料理店', trend: 0.01, base: 35 },
  { code: '62', name: '病院', tpCode: '6204', tpName: '内科', trend: 0.02, base: 20 },
  { code: '62', name: '病院', tpCode: '6205', tpName: '歯科', trend: 0.03, base: 25 },
  { code: '62', name: '病院', tpCode: '6270', tpName: '動物病院', trend: 0.06, base: 8 },
  { code: '39', name: '情報処理サービス業', tpCode: '3901', tpName: 'ソフトウェア業', trend: 0.12, base: 15 },
  { code: '70', name: '旅館・ホテル', tpCode: '7001', tpName: 'ホテル', trend: 0.04, base: 12 },
  { code: '78', name: '洗濯・理容・美容業', tpCode: '7802', tpName: '美容院', trend: 0.03, base: 30 },
  { code: '56', name: '書籍・文房具小売業', tpCode: '5601', tpName: '書店', trend: -0.08, base: 10 },
  { code: '79', name: 'スポーツ施設提供業', tpCode: '7902', tpName: 'スポーツクラブ', trend: 0.10, base: 8 },
  { code: '82', name: '学習塾', tpCode: '8201', tpName: '学習塾', trend: 0.04, base: 15 },
  { code: '54', name: '飲食料品小売業', tpCode: '5401', tpName: '青果物小売業', trend: -0.04, base: 12 },
  { code: '55', name: 'その他の小売業', tpCode: '5507', tpName: '生花店', trend: -0.03, base: 8 },
  { code: '60', name: '医薬品・化粧品小売業', tpCode: '6001', tpName: '薬局', trend: 0.02, base: 18 },
  { code: '76', name: '公衆浴場業', tpCode: '7601', tpName: '温泉浴場', trend: -0.02, base: 5 },
  { code: '59', name: '自動車整備業', tpCode: '5901', tpName: '自動車整備業', trend: -0.03, base: 10 }
];

const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// 統計情報データ生成
let statRecords = [];
let seq = 1;

for (const year of years) {
  for (const area of areas) {
    // 中央区は他区より多め
    const areaMultiplier = area.code === '01101' ? 2.5 : 1.0;

    for (const industry of industries) {
      // 年ごとのトレンド計算
      const yearIndex = year - 2000;
      const trendMultiplier = Math.pow(1 + industry.trend, yearIndex);
      const baseCount = Math.round(industry.base * areaMultiplier * trendMultiplier);

      // ランダム変動を加える（±15%）
      const variance = 0.85 + Math.random() * 0.30;
      const count = Math.max(1, Math.round(baseCount * variance));

      for (const district of area.districts) {
        // 件数分レコードを生成（件数=1固定）
        const districtCount = Math.max(1, Math.round(count / area.districts.length * (0.5 + Math.random())));
        for (let i = 0; i < districtCount; i++) {
          const chome = Math.floor(Math.random() * 10) + 1;
          statRecords.push({
            seq: String(seq++).padStart(5, '0'),
            year,
            areaCode5: area.code,
            areaCode6: String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0'),
            tsusho: '0',
            basicCode: industry.code,
            basicName: industry.name,
            tpCode: industry.tpCode,
            tpName: industry.tpName,
            pref: '北海道',
            city: area.name,
            district,
            chome: `${chome}丁目`,
            count: '1'
          });
        }
      }
    }
  }
}

// CSVヘッダー
const statHeader = '通番,年度,住所コード上位,住所コード下位,通称識別,基本分類コード,基本分類名,TP分類コード,TP分類名,都道府県名,市区郡町村名,大字通称名,字丁目名,件数';

// CSV出力
const statCSV = statHeader + '\n' + statRecords.map(r =>
  `${r.seq},${r.year},${r.areaCode5},${r.areaCode6},${r.tsusho},${r.basicCode},${r.basicName},${r.tpCode},${r.tpName},${r.pref},${r.city},${r.district},${r.chome},${r.count}`
).join('\n');

fs.writeFileSync(path.join(__dirname, 'iTown_statistics.csv'), statCSV);
console.log(`Generated iTown_statistics.csv: ${statRecords.length} records`);

// 標準出力データも増やす
const standardRecords = [];
let stdSeq = 1;

const names = {
  '5299': ['札幌ラーメン', '味噌一番', '北の味', '麺屋', '極味', '旭川ラーメン', '函館塩ラーメン'],
  '5205': ['北の幸', '居酒屋', '酒処', '炉端', '海鮮', '焼鳥', 'ジンギスカン'],
  '5207': ['カフェ', '珈琲館', 'コーヒーハウス', '茶房', 'ティールーム'],
  '5206': ['バー', 'ラウンジ', 'パブ', 'ショットバー'],
  '6204': ['クリニック', '内科医院', '診療所'],
  '6205': ['歯科', 'デンタルクリニック', '歯科医院'],
  '3901': ['システム', 'IT', 'ソフトウェア', 'テクノロジー', 'デジタル'],
  '7001': ['ホテル', 'イン', 'ステイ', 'リゾート'],
  '7802': ['美容室', 'ヘアサロン', 'ビューティー']
};

for (const area of areas) {
  for (const industry of industries) {
    const nameList = names[industry.tpCode] || [industry.tpName];
    const count = Math.round(industry.base * (area.code === '01101' ? 2 : 0.8));

    for (let i = 0; i < count; i++) {
      const district = area.districts[Math.floor(Math.random() * area.districts.length)];
      const baseName = nameList[Math.floor(Math.random() * nameList.length)];
      const suffix = ['本店', '支店', area.name.replace('札幌市', ''), district, ''][Math.floor(Math.random() * 5)];
      const kanjiName = `${baseName} ${suffix}`.trim();
      const kanaName = kanjiName; // 簡略化

      const tel1 = '011';
      const tel2 = `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      const chome = Math.floor(Math.random() * 10) + 1;
      const banchi = `${Math.floor(Math.random() * 20) + 1}-${Math.floor(Math.random() * 30) + 1}`;
      const zip = `0${Math.floor(Math.random() * 90) + 10}0${Math.floor(Math.random() * 900) + 100}`;

      standardRecords.push({
        seq: String(stdSeq++).padStart(8, '0'),
        type: '0',
        tel1,
        tel2,
        telCode: '',
        kana: kanaName,
        kanji: kanjiName,
        corpCode: Math.random() > 0.7 ? '1' : '0',
        areaCode: area.code + String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0'),
        pref: '北海道',
        city: area.name,
        district,
        chome: `${chome}丁目`,
        banchi,
        zip,
        basicCode: industry.code,
        basicName: industry.name,
        tpCode: industry.tpCode,
        tpName: industry.tpName
      });
    }
  }
}

const stdHeader = '通番,情報種別,市外局番,電話番号,電番略符号,カナ名称,漢字名称,法人種類コード,住所コード,都道府県名,市区郡町村名,大字通称名,字丁目名,街区番号,郵便番号,基本分類コード,基本分類名,TP分類コード,TP分類名';

const stdCSV = stdHeader + '\n' + standardRecords.map(r =>
  `${r.seq},${r.type},${r.tel1},${r.tel2},${r.telCode},${r.kana},${r.kanji},${r.corpCode},${r.areaCode},${r.pref},${r.city},${r.district},${r.chome},${r.banchi},${r.zip},${r.basicCode},${r.basicName},${r.tpCode},${r.tpName}`
).join('\n');

fs.writeFileSync(path.join(__dirname, 'iTown.csv'), stdCSV);
console.log(`Generated iTown.csv: ${standardRecords.length} records`);
