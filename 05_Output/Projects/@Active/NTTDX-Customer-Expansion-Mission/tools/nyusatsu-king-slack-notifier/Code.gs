/**
 * 入札王メール → Slack自動通知スクリプト
 *
 * Google Apps Script で動作。
 * 入札王から届くメール配信を自動パースし、Slackに通知する。
 *
 * セットアップ:
 *   1. Script Properties に SLACK_WEBHOOK_URL を設定
 *   2. 時間主導型トリガーで main() を5分間隔に設定
 */

// ============================================================
// 設定
// ============================================================

/** 処理済みメールに付与するGmailラベル */
const LABEL_NAME = '入札王/通知済';

/** Gmail検索クエリ（未処理の入札王メールのみ） */
const SEARCH_QUERY = 'subject:"入札王メール配信サービス" -label:入札王-通知済 newer_than:7d';

// ============================================================
// メイン処理
// ============================================================

/**
 * メイン関数: トリガーから呼び出される
 * 未処理の入札王メールを検索 → パース → Slack通知 → ラベル付与
 */
function main() {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  if (!webhookUrl) {
    Logger.log('エラー: SLACK_WEBHOOK_URL が設定されていません。Script Properties を確認してください。');
    return;
  }

  // 未処理メールを検索
  const threads = GmailApp.search(SEARCH_QUERY, 0, 20);
  if (threads.length === 0) {
    Logger.log('新着メールなし');
    return;
  }

  // ラベル取得 or 作成
  let label = GmailApp.getUserLabelByName(LABEL_NAME);
  if (!label) {
    label = GmailApp.createLabel(LABEL_NAME);
  }

  let totalCases = 0;

  for (const thread of threads) {
    const messages = thread.getMessages();

    for (const message of messages) {
      // 既にラベル付きスレッド内の古いメッセージはスキップ
      const body = message.getPlainBody();
      const subject = message.getSubject();
      const date = message.getDate();

      // メール本文から案件を抽出
      const cases = parseNyusatsuEmail(body);

      if (cases.length === 0) {
        Logger.log(`パース結果0件: ${subject} (${date})`);
        continue;
      }

      Logger.log(`${cases.length}件の案件を検出: ${subject} (${date})`);

      // 各案件をSlackに通知
      for (const c of cases) {
        sendSlackNotification(webhookUrl, c, date);
        totalCases++;
        // Slack APIレート制限対策: 1秒待機
        Utilities.sleep(1000);
      }
    }

    // 処理済みラベルを付与
    thread.addLabel(label);
  }

  Logger.log(`完了: ${threads.length}通から${totalCases}件の案件を通知`);
}

// ============================================================
// メールパース
// ============================================================

/**
 * 入札王メールの本文をパースして案件情報を抽出
 * @param {string} body メール本文（プレーンテキスト）
 * @returns {Array<Object>} 案件オブジェクトの配列
 */
function parseNyusatsuEmail(body) {
  const cases = [];
  const seenIds = new Set(); // ★重複排除用

  // 案件ブロックを分割（-----区切り）
  // 各ブロックは「問い合わせ番号」を含む
  const blocks = body.split(/-----+/);

  for (const block of blocks) {
    // 問い合わせ番号で案件ブロックを識別
    const idMatch = block.match(/\(問い合わせ番号\.(\d+)\)/);
    if (!idMatch) continue;

    const inquiryId = idMatch[1];

    // ★付き（既出案件）は重複なのでスキップ
    if (seenIds.has(inquiryId)) continue;
    seenIds.add(inquiryId);

    // 行単位で処理
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // カテゴリ: 【...】
    const categoryMatch = block.match(/【(.+?)】/);
    const category = categoryMatch ? categoryMatch[1] : '';

    // 問い合わせ番号行のインデックスを探す
    const idLineIdx = lines.findIndex(l => l.includes('問い合わせ番号'));
    if (idLineIdx < 0) continue;

    // 案件名: 番号の次行
    // ★が付いている場合は除去
    let caseName = (lines[idLineIdx + 1] || '').replace(/^★\s*/, '');

    // 発注機関: 案件名の次行
    const org = lines[idLineIdx + 2] || '';

    // 地域: 発注機関の次行
    const region = lines[idLineIdx + 3] || '';

    // 資格ランク / 入札方式 / 入札日
    const infoMatch = block.match(
      /資格ランク:\s*(.*?)\s*\/\s*入札方式:\s*(.*?)\s*\/\s*入札日:\s*(\S+)/
    );
    const rank = infoMatch ? infoMatch[1].trim() : '';
    const bidType = infoMatch ? infoMatch[2].trim() : '';
    const bidDate = infoMatch ? infoMatch[3].trim() : '';

    // 詳細URL
    const urlMatch = block.match(/(https:\/\/www\.nyusatsu-king\.com\/anken\/\S+)/);
    const url = urlMatch ? urlMatch[1] : '';

    // ★マーカーチェック（元の行に★があるかを確認）
    const originalLine = lines[idLineIdx + 1] || '';
    const isRepeated = originalLine.startsWith('★');

    cases.push({
      inquiryId,
      category,
      name: caseName,
      org,
      region,
      rank,
      bidType,
      bidDate,
      url,
      isRepeated,
    });
  }

  return cases;
}

// ============================================================
// Slack通知
// ============================================================

/**
 * Slack Block Kit形式で案件を通知
 * @param {string} webhookUrl Slack Incoming Webhook URL
 * @param {Object} c 案件オブジェクト
 * @param {Date} emailDate メール受信日
 */
function sendSlackNotification(webhookUrl, c, emailDate) {
  const dateStr = Utilities.formatDate(emailDate, 'Asia/Tokyo', 'yyyy-MM-dd');
  const repeatedTag = c.isRepeated ? ' (再掲)' : '';

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `🔔 新着入札案件${repeatedTag}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*📋 ${c.name}*`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*🏢 発注機関:*\n${c.org}` },
        { type: 'mrkdwn', text: `*📍 地域:*\n${c.region}` },
        { type: 'mrkdwn', text: `*📅 入札日:*\n${c.bidDate || '未定'}` },
        { type: 'mrkdwn', text: `*🔖 入札方式:*\n${c.bidType || '不明'}` },
      ],
    },
  ];

  // カテゴリがあれば表示
  if (c.category) {
    blocks.push({
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `📂 カテゴリ: ${c.category}　|　📮 配信日: ${dateStr}　|　🔢 No.${c.inquiryId}` },
      ],
    });
  }

  // 詳細リンクボタン
  if (c.url) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '🔗 入札王で詳細を見る', emoji: true },
          url: c.url,
          style: 'primary',
        },
      ],
    });
  }

  blocks.push({ type: 'divider' });

  const payload = {
    blocks: blocks,
    text: `新着入札案件: ${c.name} (${c.org}, 入札日: ${c.bidDate})`, // フォールバック
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(webhookUrl, options);
  const code = response.getResponseCode();

  if (code !== 200) {
    Logger.log(`Slack送信エラー (${code}): ${response.getContentText()}`);
  }
}

// ============================================================
// テスト・ユーティリティ
// ============================================================

/**
 * テスト: 最新の入札王メールをパースしてログ出力
 * Slackには送信しない。GASエディタの「実行ログ」で確認
 */
function testParseOnly() {
  const threads = GmailApp.search('subject:"入札王メール配信サービス"', 0, 1);
  if (threads.length === 0) {
    Logger.log('入札王メールが見つかりません');
    return;
  }

  const message = threads[0].getMessages().pop(); // 最新メッセージ
  const body = message.getPlainBody();
  const cases = parseNyusatsuEmail(body);

  Logger.log(`=== パース結果: ${cases.length}件 ===`);
  cases.forEach((c, i) => {
    Logger.log(`\n--- 案件 ${i + 1} ---`);
    Logger.log(`案件名: ${c.name}`);
    Logger.log(`発注機関: ${c.org}`);
    Logger.log(`地域: ${c.region}`);
    Logger.log(`入札日: ${c.bidDate}`);
    Logger.log(`入札方式: ${c.bidType}`);
    Logger.log(`カテゴリ: ${c.category}`);
    Logger.log(`URL: ${c.url}`);
    Logger.log(`再掲: ${c.isRepeated}`);
  });
}

/**
 * テスト: 最新の入札王メールをパースしてSlackに送信
 * ラベルは付与しない（何度でもテスト可能）
 */
function testSendToSlack() {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  if (!webhookUrl) {
    Logger.log('エラー: SLACK_WEBHOOK_URL が設定されていません');
    return;
  }

  const threads = GmailApp.search('subject:"入札王メール配信サービス"', 0, 1);
  if (threads.length === 0) {
    Logger.log('入札王メールが見つかりません');
    return;
  }

  const message = threads[0].getMessages().pop();
  const body = message.getPlainBody();
  const cases = parseNyusatsuEmail(body);

  Logger.log(`${cases.length}件をSlackに送信します...`);
  for (const c of cases) {
    sendSlackNotification(webhookUrl, c, message.getDate());
    Utilities.sleep(1000);
  }
  Logger.log('送信完了');
}

/**
 * ラベルをリセット（再テスト用）
 * 処理済みラベルを全て除去して、再度 main() で処理できるようにする
 */
function resetLabels() {
  const label = GmailApp.getUserLabelByName(LABEL_NAME);
  if (!label) {
    Logger.log('ラベルが存在しません');
    return;
  }

  const threads = label.getThreads();
  for (const thread of threads) {
    thread.removeLabel(label);
  }
  Logger.log(`${threads.length}スレッドのラベルをリセットしました`);
}
