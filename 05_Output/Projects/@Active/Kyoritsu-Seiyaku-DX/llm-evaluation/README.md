# LLM Evaluation Framework

PDFドキュメントからデータを抽出し、複数のLLMモデルの精度を比較評価するフレームワーク。

## セットアップ

### 1. 依存関係のインストール

```bash
cd llm-evaluation
pip install -e .
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集してAPIキーを設定：

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
GOOGLE_API_KEY=xxxxx
```

## 使い方

### 基本的な抽出（単一モデル）

```bash
python -m src.main extract input/pdfs/sample.pdf
```

### 複数モデルでの抽出

```bash
python -m src.main extract input/pdfs/sample.pdf \
  --models "claude-sonnet-4-20250514,gpt-4o,gemini-1.5-pro"
```

### 評価（正解データとの比較）

```bash
python -m src.main evaluate input/pdfs/sample.pdf \
  --ground-truth ground_truth/data/sample.json \
  --models "claude-sonnet-4-20250514,gpt-4o"
```

### 利用可能なモデル一覧

```bash
python -m src.main list-models
```

## ディレクトリ構成

```
llm-evaluation/
├── config/
│   └── prompts/
│       └── extraction_prompt.txt  # 抽出プロンプト
├── src/
│   ├── main.py                    # CLIエントリーポイント
│   ├── pdf_processor.py           # PDF処理
│   ├── evaluator.py               # 評価ロジック
│   ├── llm_clients/               # LLMクライアント
│   └── schemas/                   # データスキーマ
├── ground_truth/
│   └── data/                      # 正解データ（JSON）
├── input/
│   └── pdfs/                      # 評価対象PDF
└── output/
    ├── extractions/               # 抽出結果
    └── evaluations/               # 評価結果
```

## 正解データの作成

`ground_truth/data/`にPDFと同名のJSONファイルを作成：

```json
{
  "metadata": {
    "document_date": "2026-01-15",
    "observer_name": "田中太郎",
    "facility_name": "第一飼育施設"
  },
  "records": [
    {
      "animal_id": "DOG-001",
      "observation_time": "09:30",
      "body_temperature": 38.5,
      "body_weight": 12.3,
      "appetite": "良好",
      "activity_level": "普通",
      "feces_status": "正常",
      "dehydration": false,
      "vomiting": false,
      "notes": null
    }
  ]
}
```

## 対応モデル

| Provider | Models |
|----------|--------|
| Claude | claude-opus-4, claude-sonnet-4, claude-3-5-haiku |
| OpenAI | gpt-4o, gpt-4o-mini |
| Gemini | gemini-1.5-pro, gemini-2.0-flash-exp |

## 評価メトリクス

- **Overall Accuracy**: 全フィールドの正解率
- **Field Accuracy**: フィールド別正解率
- **Precision/Recall/F1**: レコード単位の適合率・再現率
- **Latency**: 応答時間
- **Cost**: API費用
