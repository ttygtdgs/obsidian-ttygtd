---
tags:
  - project/nttdx-customer-expansion
  - automation
  - slack
  - bid-intelligence
created: 2026-02-10
status: draft
---

# 入札王メール → 案件整理 → Slack自動通知フロー設計書

## 1. 背景・目的

顧客接点拡大ミッション「施策3: 公募案件取得」の一環として、入札王からの自動通知メールを受信し、案件情報を構造化・AI評価した上でSlackに自動通知するフローを構築する。

**現状の課題**:
- 入札王のメール通知は届いているが、案件の確認・評価・共有が手動
- 締切に気づくのが遅れ、タイムリーな応札判断ができていない
- 案件の蓄積・分析が体系的にできていない

**目指す姿**:
- メール受信→解析→AI評価→Slack通知が完全自動
- チームが毎朝Slackで最新案件を確認し、即座に応札判断可能
- 案件データがGoogle Sheetsに蓄積され、分析・レポートに活用可能

---

## 2. アーキテクチャ案の比較

以下の5案を検討する。共通の入出力は:
- **入力**: 入札王からのメール通知（平日23:00頃 / 15:00頃）
- **出力**: Slack通知 + データ蓄積（分析・レポート用）

---

### 案A: Google Apps Script + Cloud Function

**コンセプト**: Google Workspace内で完結。GASがメール取得・パース・Slack投稿を担当し、LLM処理のみCloud Functionに委譲。

```
[入札王] → メール通知
    ↓
[Gmail] → ラベル「入札王通知」で自動分類
    ↓
[Google Apps Script] → 時間トリガー（23:30, 15:30）
    ├── メールHTML解析 → 案件情報抽出
    ├── Google Sheets照合 → 重複排除
    ├── ルールベース事前フィルタ
    ├── Cloud Function呼出 → LLM関連度スコアリング
    ├── Slackメッセージ整形・投稿（Incoming Webhook）
    └── Google Sheetsログ記録
    ↓
[Slack] + [Google Sheets] → チーム確認 → Looker Studio / PPTX
```

| 観点 | 評価 |
|------|------|
| **構築難易度** | 低。Gmail APIがネイティブ。OAuth/IMAP設定不要 |
| **運用コスト** | 月額 ~$1（LLM APIのみ）。インフラ無料 |
| **保守性** | GASのWeb IDE。バージョン管理はやや弱い（clasp併用で改善可） |
| **拡張性** | 中。GASの6分制限があり、フロー複雑化には限界あり |
| **チーム共有** | Google Sheetsで即座に共有。Looker Studio連携も容易 |
| **制約** | GAS実行時間6分上限。外部ライブラリ制限。デバッグしにくい |

**向いているケース**: 最速でMVPを立ち上げたい。Google Workspace中心の運用。

---

### 案B: n8n ワークフロー

**コンセプト**: n8nのビジュアルワークフローで全工程を構築。ノーコード/ローコードでチームメンバーも編集・理解しやすい。NTTDXPNが顧客に提供しているツールでもあり、自社実践（ドッグフーディング）になる。

```
[入札王] → メール通知
    ↓
[n8n: Email Trigger (IMAP)] → 新着メール検知
    ↓
[n8n: Code Node] → HTML解析・案件情報抽出
    ↓
[n8n: Google Sheets Node] → 重複チェック
    ↓
[n8n: IF Node] → ルールベースフィルタ
    ↓
[n8n: HTTP Request Node] → Claude API呼出（スコアリング）
    ↓
[n8n: Switch Node] → Grade A/B/C 振り分け
    ↓
[n8n: Slack Node] → チャンネル別投稿
    ↓
[n8n: Google Sheets Node] → ログ記録
```

| 観点 | 評価 |
|------|------|
| **構築難易度** | 中。IMAP or Gmail OAuth設定が必要。ノード接続自体は直感的 |
| **運用コスト** | セルフホスト: サーバー費 $5-20/月 + LLM ~$1。n8n Cloud: $20/月〜 |
| **保守性** | ビジュアルUI。非エンジニアでもフロー理解・修正可能 |
| **拡張性** | 高。400+の公式ノード。条件分岐・並列処理・エラーハンドリングが容易 |
| **チーム共有** | n8n UIでフロー共有。Google Sheets連携でデータも共有 |
| **制約** | サーバー維持が必要（セルフホスト時）。IMAP接続の安定性 |

**向いているケース**: 自社でn8nを運用中/導入予定。将来的にフローを拡張したい。顧客への提案時にデモとして活用したい。

---

### 案C: Dify + n8n 連携

**コンセプト**: AI処理（メール解析+スコアリング）をDifyのワークフローで構築し、n8nがメール取得・Slack投稿・データ管理のオーケストレーションを担当。AI部分とインフラ部分を分離する。

```
[入札王] → メール通知
    ↓
[n8n: Email Trigger] → 新着メール検知
    ↓
[n8n: HTTP Request] → Dify API呼出
    ↓
[Dify Workflow]
    ├── LLMノード: メール本文解析 → 構造化JSON抽出
    ├── LLMノード: 関連度スコアリング（A/B/C判定）
    └── テンプレートノード: Slack投稿文生成
    ↓
[n8n: 後続処理]
    ├── Slack投稿
    └── Google Sheets記録
```

| 観点 | 評価 |
|------|------|
| **構築難易度** | 中〜高。Dify + n8n 両方の設定が必要 |
| **運用コスト** | Difyセルフホスト + n8n: $10-30/月。Dify Cloud: 従量制 |
| **保守性** | AI部分の調整（プロンプト、モデル変更）がDify UIで完結。非エンジニアでも可 |
| **拡張性** | 非常に高。Dify側でRAG追加（過去落札データ参照等）、モデル切替が容易 |
| **チーム共有** | Dify UIでプロンプト管理共有。n8nでフロー共有 |
| **制約** | 2システム運用の複雑さ。Difyサーバー維持が必要 |

**向いているケース**: AI処理を頻繁にチューニングしたい。将来RAG（過去落札データ参照）を組み込みたい。Difyの自社実践にもなる。

---

### 案D: Python スクリプト (Cloud Run)

**コンセプト**: 全処理をPythonで実装し、Cloud Runにデプロイ。Cloud Schedulerで定期実行。最も柔軟だがコードファースト。

```
[Cloud Scheduler] → 定期トリガー（23:30, 15:30）
    ↓
[Cloud Run: Python]
    ├── Gmail API → メール取得
    ├── BeautifulSoup → HTML解析
    ├── Claude SDK → LLMスコアリング
    ├── slack_sdk → Slack投稿
    └── gspread → Google Sheets記録
    ↓
[Slack] + [Google Sheets]
```

| 観点 | 評価 |
|------|------|
| **構築難易度** | 中〜高。Gmail OAuth設定 + コード実装が必要 |
| **運用コスト** | Cloud Run無料枠内（月数回の短時間実行）+ LLM ~$1 |
| **保守性** | コードベース。Git管理でき、テスト・CI/CDが可能 |
| **拡張性** | 非常に高。Pythonエコシステムの全ライブラリが利用可能 |
| **チーム共有** | コードが読めるメンバーのみ。データ共有はSheets経由 |
| **制約** | 開発者依存度が高い。Gmail OAuth認証の初期設定がやや面倒 |

**向いているケース**: 既にPythonスクリプトの運用実績がある。複雑なデータ処理や分析ロジックを組み込みたい。

---

### 案E: GitHub Actions + Python

**コンセプト**: GitHub Actionsのスケジュール実行（cron）でPythonスクリプトを定期起動。コードとワークフロー定義が同一リポジトリで管理でき、サーバー不要。案Dの「Cloud Run + Cloud Scheduler」をGitHub Actionsに置き換えた構成。

```
[GitHub Actions: schedule cron]
    ↓  23:30 / 15:30 に起動
[GitHub Actions Runner]
    ├── Python: Gmail API → メール取得
    ├── Python: BeautifulSoup → HTML解析
    ├── Python: Claude SDK → LLMスコアリング
    ├── Python: slack_sdk → Slack投稿
    └── Python: gspread → Google Sheets記録
    ↓
[Slack] + [Google Sheets]

リポジトリ構成:
  .github/workflows/bid-notify.yml   ← cron定義
  src/main.py                        ← メイン処理
  src/parser.py                      ← メール解析
  src/scorer.py                      ← LLMスコアリング
  src/notifier.py                    ← Slack投稿
  tests/                             ← テスト
  credentials/service-account.json   ← (Secretsで管理)
```

**ワークフロー定義例** (.github/workflows/bid-notify.yml):
```yaml
name: 入札案件 Slack通知
on:
  schedule:
    - cron: '30 14 * * 1-5'  # 平日23:30 JST (UTC+9)
    - cron: '30 6 * * 1-5'   # 平日15:30 JST
  workflow_dispatch: {}       # 手動実行ボタン

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
      - run: python src/main.py
        env:
          GMAIL_CREDENTIALS: ${{ secrets.GMAIL_CREDENTIALS }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          GSHEET_CREDENTIALS: ${{ secrets.GSHEET_CREDENTIALS }}
```

| 観点 | 評価 |
|------|------|
| **構築難易度** | 中。Gmail OAuth設定が必要だが、それ以外はシンプル |
| **運用コスト** | 無料（privateリポ: 2,000分/月。1回2分 × 2回/日 × 22日 = 88分/月で十分余裕） |
| **保守性** | Git管理が自然。PR/レビュー/テスト/CI全てGitHub上で完結 |
| **拡張性** | 高。Pythonエコシステム全体 + GitHub Actionsのエコシステム |
| **チーム共有** | リポジトリ共有。コードが読めるメンバー向き。データはSheets経由 |
| **制約** | cronの精度（最大5-15分の遅延あり）。ステートレス（永続状態はSheets等の外部に持つ必要） |

**案D（Cloud Run）との違い**:

| | 案D: Cloud Run | 案E: GitHub Actions |
|---|---|---|
| スケジューラ | Cloud Scheduler（別途設定） | `.yml`ファイルでcron定義（コードと一体管理） |
| 実行環境 | Cloud Run（GCPコンソールで管理） | GitHub Actions Runner（リポジトリに統合） |
| 認証設定 | GCP IAM + サービスアカウント | GitHub Secrets（UIで設定） |
| デプロイ | `gcloud run deploy` | `git push`（自動） |
| 手動実行 | Cloud Console or gcloud CLI | GitHub UIの「Run workflow」ボタン |
| コスト | 無料枠内だがGCPアカウント必要 | 無料（GitHub Free/Teamプラン内） |
| ローカルテスト | Docker or Functions Framework | `python src/main.py`（そのまま実行可） |

**向いているケース**: GitHubでコード管理したい。GCPの追加設定を避けたい。開発→テスト→デプロイをGitHub上で完結させたい。

---

### 5案比較サマリー

| | 案A: GAS | 案B: n8n | 案C: Dify+n8n | 案D: Python+CloudRun | 案E: Python+GitHub Actions |
|---|:---:|:---:|:---:|:---:|:---:|
| **構築スピード** | ◎ | ○ | △ | △ | ○ |
| **月額コスト** | ◎ ~$1 | △ $5-20 | △ $10-30 | ○ ~$1 | ◎ 無料 |
| **非エンジニア運用** | ○ | ◎ | ◎ | × | × |
| **フロー拡張性** | △ | ◎ | ◎ | ◎ | ◎ |
| **AI部分の柔軟性** | ○ | ○ | ◎ | ◎ | ◎ |
| **ドッグフーディング** | × | ◎ | ◎ | × | × |
| **インフラ管理** | ◎ なし | △ サーバー必要 | × 2系統 | ○ GCP | ◎ なし |
| **Git/テスト管理** | △ | △ | △ | ○ | ◎ |
| **デプロイ容易性** | ○ | ○ | △ | △ | ◎ git push |

### 推奨パターン

#### パターン1: 最速MVP → ノーコード運用（非エンジニアチーム向け）

```
Phase 1: 案A（GAS）でMVP → メール構造把握、Slack通知検証
Phase 2: 案A上でAI評価追加 → スコアリング精度の検証
Phase 3: 案B（n8n）に移行 → チーム全体で運用・改善
         ドッグフーディングとして顧客デモにも活用
```

#### パターン2: コードファーストで堅実に（エンジニア主導）

```
Phase 1: 案E（GitHub Actions）でMVP → コード・テスト・cron一体管理
Phase 2: 案E上でAI評価追加 → PR/レビューで品質管理
Phase 3: 必要に応じて案B（n8n）に一部機能を移行
         or 案E上で拡張し続ける
```

#### パターン3: AI重視で将来性最大化

```
Phase 1: 案A（GAS）でMVP → 基本動作検証
Phase 2: 案C（Dify+n8n）に移行 → AI処理をDifyで管理
Phase 3: RAG追加（過去落札データ参照）、自動提案書ドラフト等
```

#### 判断基準

| 重視するポイント | 推奨パターン |
|-----------------|-------------|
| チーム全員で運用したい | パターン1（→ n8n） |
| Git管理・テスト・堅実な開発 | パターン2（→ GitHub Actions） |
| AI機能の拡張性を最大化 | パターン3（→ Dify+n8n） |
| とにかく早く動かしたい | パターン1 or 2のPhase 1のみ先行 |

---

## 3. メール解析

### 3.1 抽出対象フィールド

| フィールド | 説明 | 抽出方法 |
|-----------|------|----------|
| 件名 | 案件名 | HTMLパース |
| 発注機関 | 自治体・官公庁名 | HTMLパース |
| 地域 | 都道府県 | HTMLパース or 機関名から推定 |
| 締切日 | 応募期限 | HTMLパース → ISO 8601変換 |
| 応募方式 | プロポーザル/一般競争入札等 | HTMLパース |
| 詳細URL | 入札王の案件詳細リンク | aタグのhref |

### 3.2 パース方式

**メイン: 正規表現ベースHTMLパーサ**

```
parseNyusatsuOhEmail(htmlBody) → BidItem[]

1. メール本文を案件ブロック単位に分割（<tr>行 or <div>ブロック）
2. 各ブロックから正規表現でフィールド抽出
3. データ正規化（全角半角変換、日付ISO化、空白除去）
4. bid_id = SHA256(案件名 + 発注機関 + 締切日) で一意ID生成
```

**フォールバック: LLM構造化抽出**

メールHTML構造が変更された場合に使用:
```
1. HTMLタグ除去、テキストのみ抽出
2. Claude APIに送信：
   「以下の入札情報メールからJSON配列を抽出してください。
    各案件: {title, agency, region, deadline, method, url}」
3. JSONレスポンスをパース・バリデーション
```

パース失敗率20%超でSlackにアラート発報。

### 3.3 重複排除

- `bid_id = SHA256(正規化(案件名) + 正規化(発注機関) + 締切日)`
- Google Sheets `bid_log` シートの既存IDと照合
- GAS PropertiesServiceで直近IDをキャッシュし、Sheet検索を最小化

### 3.4 実装時の初期作業

1. 入札王の過去メール5-10件をGmailから取得
2. `GmailApp.getMessageById(id).getBody()` でHTML構造を確認
3. CSS/テーブル構造を特定し、正規表現パターンを構築
4. テストケースとして過去メールのパース結果を検証

---

## 4. AI関連度スコアリング

### 4.1 スコアリング基準

| 評価軸 | 重み | 内容 |
|--------|------|------|
| サービスフェーズ適合 | 30% | 理解/設計/検証/実装/定着のどれに該当するか |
| 技術適合 | 30% | AI, RAG, Dify, n8n, チャットボット等の技術マッチ |
| 予算妥当性 | 15% | NTTDXPNの対応レンジ（20万〜2,000万）に合うか |
| 地域アクセス | 10% | 対応可能な地域か |
| 締切余裕 | 15% | 提案準備に十分な時間があるか |

### 4.2 グレード分類

| グレード | スコア | 意味 | Slack通知先 |
|---------|--------|------|------------|
| **A（即対応）** | 70以上 | コア領域マッチ、予算・締切適合 | `#bid-intelligence` |
| **B（要検討）** | 40-69 | 部分マッチまたは条件付き | `#bid-intelligence` |
| **C（参考情報）** | 40未満 | 関連薄いまたは非対応 | `#bid-intelligence-all` のみ |

### 4.3 ルールベース事前フィルタ（LLM呼出前）

LLMコスト削減と高速化のため、明確なケースは事前判定:

**自動C判定（LLMスキップ）**:
- 締切まで3日未満
- 件名に「書籍」「試薬」「消耗品」「物品」「ストレージ機器」を含む

**自動A候補（LLM詳細分析を必ず実行）**:
- 「生成AI」+「研修 / PoC / 導入 / 構築」
- 「RAG」+「構築 / 検証」
- 「Dify」「n8n」を含む

**その他**: LLMに送信してスコアリング

> キーワード設定は `03-公募案件分析-入札王データ.md` のTier1/Tier2キーワード戦略に基づく

### 4.4 LLMプロンプト設計

**システムプロンプト**:
```
あなたはNTT DXパートナーの入札案件スクリーニングアシスタントです。

NTT DXパートナーの強み:
- 生成AI活用研修（経営層/現場/推進者向け）：30-80万円
- 業務プロセスアセスメント・ユースケース設計：100-200万円
- PoC開発支援（RAG、Dify、n8n活用）：150-500万円
- 本実装・内製化支援（AI環境構築、LGWAN対応）：500-2,000万円
- SaaS提供・運用支援（Dify/n8nマネージド環境）：10-80万円/月
- 自治体・公共セクターでのAI/DX実績多数

対応可能な技術キーワード:
生成AI, RAG, Dify, n8n, ChatGPT, Claude, Gemini,
チャットボット, プロンプトエンジニアリング, LGWAN,
データ利活用, Copilot Studio, Azure OpenAI, AWS Bedrock
```

**ユーザープロンプト**:
```
以下の入札案件を評価してください。

案件名: {title}
発注機関: {agency}
地域: {region}
締切日: {deadline}
応募方式: {method}
カテゴリ: {category}

以下のJSON形式で回答:
{
  "score": <0-100>,
  "grade": "<A|B|C>",
  "phase": "<理解|設計|検証|実装|定着>",
  "matching_services": ["該当サービス名"],
  "key_technologies": ["関連技術"],
  "reasoning": "<50文字以内の判定理由>",
  "recommended_action": "<次のアクション>"
}
```

**モデル選定**: Claude Haiku（高速・低コスト）
- 1件あたり約$0.001
- 月300件で約$0.30-1.00

---

## 5. Slack通知フォーマット

### 5.1 チャンネル構成

| チャンネル | 投稿対象 | 用途 |
|-----------|---------|------|
| `#bid-intelligence` | Grade A + B | 主要モニタリング（チーム全員参加） |
| `#bid-intelligence-all` | 全グレード | アーカイブ・参照用 |

### 5.2 Grade A 通知メッセージ

```
🚨 [A] 令和7年度生成AI利活用研修委託業務

*発注機関:*  佐賀県
*締切日:*    2026/01/29 (残り12日)
*応募方式:*  公募型プロポーザル
*推定フェーズ:* ① 理解（研修）

*AI分析:*
研修パッケージB（現場向け）が最適。佐賀県は初案件のため新規開拓チャンス。

*該当サービス:* 研修パッケージB（現場向け）, 研修パッケージC（推進者向け）
*関連技術:* 生成AI, プロンプト

🔗 入札王で詳細を見る: [リンク]
✅ 応札検討: [Google Formリンク]

─────────────────
入札王通知 | 2026-01-17 23:00配信 | スコア: 85/100
```

### 5.3 Grade B 通知メッセージ

```
🟡 [B] 庁内AI環境構築支援業務

*発注機関:*  群馬県
*締切日:*    2026/02/05 (残り18日)
*応募方式:*  一般競争入札
*推定フェーズ:* ④ 実装

*AI分析:*
LGWAN対応実装案件。予算規模次第で対応可能。要件詳細の確認推奨。

*該当サービス:* 実装支援パッケージ
*関連技術:* 生成AI, LGWAN

🔗 入札王で詳細を見る: [リンク]

─────────────────
入札王通知 | 2026-01-17 23:00配信 | スコア: 55/100
```

### 5.4 Grade C（`#bid-intelligence-all` のみ）

```
⚪ [C] 庁内チャットボット運用保守（東京都）- 締切: 2026/02/15 - スコア: 25
```

### 5.5 デイリーダイジェスト（毎朝08:00）

```
📰 入札案件デイリーダイジェスト (2026-01-18)

*昨夜の新着: 8件*
  🚨 Grade A: 2件
  🟡 Grade B: 3件
  ⚪ Grade C: 3件

*直近の締切案件:*
1. [A] 佐賀県 生成AI研修 - 残り11日 (1/29)
2. [B] 群馬県 生成AIサービス導入 - 残り18日 (2/05)
3. [A] 明日香村 AI英会話導入 - 残り19日 (2/06)

*今週の累計:* A: 5件 / B: 8件 / C: 12件
```

### 5.6 締切リマインダー

- **7日前**: 通常リマインダー
- **3日前**: 緊急リマインダー（`team_decision` が未設定の場合のみ）

```
⏰ 締切間近リマインダー

以下の案件の締切が3日後に迫っています:
🚨 [A] 佐賀県 生成AI研修 - 2026/01/29 (残り3日)
   → 応札判断がまだ未定です。確認をお願いします。
```

### 5.7 通知方式

**Phase 1: Incoming Webhook**（最もシンプル）
- Slack管理画面でWebhook URLを発行
- GASから `UrlFetchApp.fetch(webhookUrl, payload)` で投稿
- ボタン類はGoogle FormやGAS Web Appへのリンクで代替

**Phase 2（将来）: Slack Bot App**
- 応札検討/見送りのインタラクティブ操作が必要になった場合に移行
- Slackスレッド内で直接判断ステータスを更新可能に

---

## 6. データストレージ

### 6.1 Google Sheets構成

**スプレッドシート名**: `入札王案件ログ`

#### Sheet 1: `bid_log`（案件ログ）

| カラム | 型 | 説明 |
|--------|---|------|
| A: bid_id | String | SHA256ハッシュ（重複排除キー） |
| B: received_at | DateTime | メール受信日時 |
| C: processed_at | DateTime | 処理完了日時 |
| D: title | String | 案件名 |
| E: agency | String | 発注機関 |
| F: region | String | 地域（都道府県） |
| G: deadline | Date | 締切日 |
| H: days_remaining | Number | 締切までの残日数（自動計算） |
| I: method | String | 応募方式 |
| J: detail_url | String | 入札王詳細リンク |
| K: score | Integer | AIスコア (0-100) |
| L: grade | String | A / B / C |
| M: phase | String | サービスフェーズ（理解/設計/検証/実装/定着） |
| N: matching_services | String | 該当サービス（カンマ区切り） |
| O: key_technologies | String | 関連技術（カンマ区切り） |
| P: ai_reasoning | String | AI判定理由 |
| Q: recommended_action | String | 推奨アクション |
| R: team_decision | String | 応札検討 / 見送り / 保留（手動入力） |
| S: decision_by | String | 判断者名（手動入力） |
| T: decision_at | DateTime | 判断日時（手動入力） |
| U: notes | String | 備考（手動入力） |
| V: slack_ts | String | Slackメッセージタイムスタンプ |

#### Sheet 2: `processing_log`（処理ログ）

| カラム | 型 | 説明 |
|--------|---|------|
| timestamp | DateTime | 処理日時 |
| email_id | String | GmailメッセージID |
| bids_found | Integer | メール内の案件数 |
| bids_processed | Integer | 正常処理件数 |
| bids_skipped | Integer | 重複スキップ件数 |
| errors | String | エラー内容（あれば） |
| execution_time_ms | Integer | 処理時間 |

#### Sheet 3: `config`（設定）

| キー | 値 | 説明 |
|------|---|------|
| slack_webhook_url | https://hooks.slack.com/... | Webhook URL |
| slack_webhook_all_url | https://hooks.slack.com/... | 全件用Webhook URL |
| llm_endpoint | https://...cloudfunctions.net/... | Cloud Function URL |
| min_days_before_deadline | 3 | 自動C判定の日数閾値 |
| target_keywords | 生成AI,RAG,Dify,n8n,チャットボット,ChatGPT,プロンプト | Tier1+Tier2キーワード |
| noise_keywords | 書籍,試薬,消耗品,物品,ストレージ機器 | ノイズ除外キーワード |
| last_processed_email_id | abc123... | 処理済みメールのチェックポイント |

> **設定のポイント**: キーワード等をconfigシートで管理することで、コード変更なしにフィルタ条件を調整可能。

### 6.2 既存パイプラインとの連携

- **PPTX生成**: `generate-bidding-analysis-v3-pptx.cjs` のデータソースとしてSheetsを参照可能
- **Looker Studio**: Sheets直接接続でダッシュボード構築可能（北海道プロジェクトで実績あり）
- **月次分析**: `03-公募案件分析-入札王データ.md` の更新データとして活用

---

## 7. エラーハンドリング・監視

### 7.1 障害パターンと対策

| 障害パターン | 発生頻度 | 影響 | 対策 |
|-------------|---------|------|------|
| 入札王メール未着 | 低 | 案件見落とし | 00:30までにメール無い場合Slackへ警告 |
| メールHTML構造変更 | 中（年1回程度） | パーサ破損 | LLMフォールバックパーサ + パース失敗率監視 |
| LLM API障害/タイムアウト | 低 | スコアなし | `[未評価]`タグ付きで通知 + 30分後リトライ |
| Slack Webhook無効 | 極低 | 通知停止 | 週次テスト + エラー時管理者メール |
| GAS実行タイムアウト（6分） | 中（大量案件時） | 一部未処理 | 10件/実行のバッチ処理 + 継続トリガー |
| 重複通知 | 中 | Slackノイズ | SHA256ベースの重複排除 |

### 7.2 ヘルスチェック（毎日01:00実行）

```
1. 入札王メールが22:00-00:30に届いたか確認
   → 未着: Slackへ「⚠️ 本日の入札王通知メールが未着です」

2. 全案件が正常処理されたか確認
   → processing_logのbids_found vs bids_processedを照合
   → 不一致: エラー詳細をSlack通知

3. LLM APIの疎通確認
   → ダミーリクエストで応答確認
   → 障害: 「⚠️ LLM APIに接続できません」
```

### 7.3 エラー通知フォーマット

```
⚠️ 入札通知パイプライン エラー

時刻: 2026-01-18 23:45
エラー: LLM APIタイムアウト（3件未評価）
影響: 3件の案件がスコアなしで通知されました
対応: 30分後に自動リトライ実行予定
```

---

## 8. セキュリティ考慮事項

| 項目 | 対応方針 |
|------|---------|
| APIキー管理 | Cloud Functionの環境変数 or Secret Manager |
| Slack Webhook URL | GAS PropertiesService or configシート（限定共有） |
| メール内容 | 公開入札情報のため機密性低。ただしGoogle Sheets共有範囲は社内に限定 |
| Cloud Function | IAM認証付きで呼び出し元をGASに限定 |

---

## 9. 実装フェーズ計画

### Phase 1: MVP

**目標**: メール到着 → パース → 基本Slack通知

- Gmailフィルタ設定（ラベル「入札王通知」）
- GASプロジェクト作成 + 時間トリガー設定
- HTMLパーサ実装（正規表現ベース）
- Google Sheetsスプレッドシート + スキーマ作成
- 重複排除ロジック
- Slack Incoming Webhook設定
- 基本メッセージフォーマットで投稿（キーワードフィルタのみ、LLMなし）

### Phase 2: AI評価

**目標**: LLMベースの関連度スコアリング追加

- Cloud Function デプロイ（Python / Claude API）
- スコアリングプロンプト実装
- ルールベース事前フィルタ
- グレード別チャンネルルーティング（A+B → #bid-intelligence）
- Slackメッセージにスコア・分析結果を追加

### Phase 3: 監視・運用安定化

**目標**: 信頼性と運用性の確保

- ヘルスチェック実装（毎日01:00）
- エラー通知Slack投稿
- デイリーダイジェスト（毎朝08:00）
- 締切リマインダー（7日前・3日前）
- 運用手順書作成

### Phase 4: 拡張（将来）

- Slack Bot化（応札判断のインタラクティブ操作）
- Looker Studioダッシュボード連携
- PPTX分析レポート自動生成連携
- 応札結果（落札/未落札）のフィードバックループ
- 競合分析の自動化

---

## 10. コスト見積

| 項目 | 月額コスト |
|------|-----------|
| Google Apps Script | 無料 |
| Google Sheets | 無料 |
| Cloud Function（無料枠内） | 無料 |
| Claude Haiku API（約300件/月） | ~$1 |
| Slack Incoming Webhook | 無料 |
| **合計** | **~$1/月** |

---

## 11. 関連ドキュメント

- [[00-プロジェクト概要]] - 顧客成熟度5フェーズの定義
- [[01-施策1-サービスソリューション整理]] - サービスカタログ（LLMプロンプトの参照データ）
- [[02-施策全体-顧客接点拡大ミッション（酒井さんスライド）]] - 施策3「公募案件取得」の戦略文脈
- [[03-公募案件分析-入札王データ]] - 入札王データ分析結果、キーワード戦略、ノイズ除外ルール
