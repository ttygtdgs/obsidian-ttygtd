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

### Step 3: データ抽出テスト
詳細ページから以下の情報を抽出できるか確認:
- [ ] 案件名
- [ ] 発注機関
- [ ] 予定金額（予算）
- [ ] 案件概要・仕様
- [ ] 入札日・締切日
- [ ] 入札方式
- [ ] 資格要件

### Step 4: 自動化検討
テスト結果を踏まえて:
- ログイン → 詳細取得の一連フローをスクリプト化
- GASとの連携方式を決定
- Slack通知への金額・概要の追加

## 必要な情報（次回セッション開始時に用意）
- [ ] 入札王のログインパスワード（セッション内で使用、保存しない）
- [ ] テストしたい案件のURL（最新のメールから）

## 既存ファイル
- GASスクリプト: `tools/nyusatsu-king-slack-notifier/Code.gs`
- セットアップ手順: `tools/nyusatsu-king-slack-notifier/README.md`
