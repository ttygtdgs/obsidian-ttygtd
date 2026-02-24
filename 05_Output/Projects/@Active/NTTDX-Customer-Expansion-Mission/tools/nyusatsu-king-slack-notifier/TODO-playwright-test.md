# Playwright MCP 入札王スクレイピング テスト計画

## 目的
Playwright MCPを使って入札王の詳細ページから金額・概要等を自動取得できるか検証する。

## 前提
- Playwright MCP: インストール済み（`claude mcp list`で確認）
- 入札王アカウント: tatsuya.gotouda@nttdxpn.co.jp

## テスト手順

### Step 1: ログインテスト
Playwright MCPでブラウザを開き、入札王にログインできるか確認。
- URL: https://www.nyusatsu-king.com/
- ログインフォームの構造を確認
- ID/PWでログイン実行

### Step 2: 詳細ページ遷移テスト
メール内のURLにアクセスし、案件詳細ページが表示されるか確認。
- テスト用URL（メールから取得したもの）:
  https://www.nyusatsu-king.com/anken/item_search_detail_view/?itk=PUlETzBZVE8yRWpN&usk=PT1BY3E4eWJqOGlid2hIWjNSbmJBODFicFJYWWpWSFpsMnlibThXYTVoVE54Y3pN

### Step 3: データ抽出テスト (2026-02-24 完了)
詳細ページから以下の情報を抽出できるか確認:
- [x] 案件名
- [x] 発注機関
- [x] 予定金額（予算） → 一般競争入札では非公開（ページ・PDF共に記載なし）
- [x] 案件概要・仕様 → PDF仕様書から取得可能（17,600ライセンス、県立高校63校等）
- [x] 入札日・締切日
- [x] 入札方式
- [x] 資格要件 → PDF仕様書から取得（1,000名以上の生成AI実績等）

### Step 3.5: 関連情報ページテスト (2026-02-24 完了)
「ログインして関連情報を閲覧」リンクから追加情報を取得:
- [x] 過去の類似案件の入札/落札情報
- [x] 落札会社名・落札金額（例: 有限会社トリガーデバイス ￥357,420）
- [x] 入札結果（例: 不調・くじ引き結果）

### Step 4: 自動化検討（次回TODO）
テスト結果を踏まえて:
- [ ] ログイン → 詳細取得の一連フローをスクリプト化
- [ ] GASとの連携方式を決定
- [ ] Slack通知への落札履歴・仕様概要の追加

## テスト実施記録 (2026-02-24)
- ログイン: info-education@nttdxpn.co.jp で成功
- テスト案件: 岐阜県 教育用生成AI文章添削システムの調達
- 昨年度同案件は**不調（入札不成立）**→ 再入札案件であることを発見

## 既存ファイル
- GASスクリプト: `tools/nyusatsu-king-slack-notifier/Code.gs`
- セットアップ手順: `tools/nyusatsu-king-slack-notifier/README.md`
