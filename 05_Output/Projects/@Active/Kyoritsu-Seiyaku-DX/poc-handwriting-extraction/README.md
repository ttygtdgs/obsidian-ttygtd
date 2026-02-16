# 手書き抽出PoC (Handwriting Extraction PoC)

固定帳票PDF（CamScanner等でスキャン）から、印刷テンプレートとの差分で手書き部分のみを抽出し、ROIごとにOCR/分類してJSON出力するPoCプロジェクト。

## 構成

```
poc-handwriting-extraction/
├── src/
│   ├── __init__.py
│   ├── main.py          # CLIエントリポイント
│   ├── pdf_render.py    # PDF→画像変換
│   ├── align.py         # テンプレート整列（特徴点マッチング→ホモグラフィ→warp）
│   ├── diff_mask.py     # 差分抽出（absdiff→threshold→morph）
│   ├── roi.py           # ROI切り出し
│   └── ocr_clients.py   # OCRクライアント（スタブ/Cloud Vision/Vertex AI）
├── sample_fields.json   # ROI定義のサンプル
├── requirements.txt     # Python依存関係
└── README.md
```

## セットアップ

```bash
# Python 3.10+ 推奨
cd poc-handwriting-extraction

# 仮想環境を作成
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt
```

## 使い方

```bash
# 基本的な使い方
python -m src.main \
    --input scan.pdf \
    --template template.pdf \
    --fields sample_fields.json \
    --output out/result.json \
    --workdir out/work

# オプション
python -m src.main --help
```

### オプション一覧

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `--input`, `-i` | スキャンしたPDF | (必須) |
| `--template`, `-t` | テンプレートPDF | (必須) |
| `--fields`, `-f` | フィールド定義JSON | (必須) |
| `--output`, `-o` | 出力JSON | (必須) |
| `--workdir`, `-w` | 中間画像出力ディレクトリ | None |
| `--page`, `-p` | 処理するページ番号 | 0 |
| `--dpi` | PDF変換時のDPI | 300 |
| `--threshold` | 差分検出の閾値 | 30 |
| `--ocr-client` | OCRクライアント種別 | stub |
| `--skip-ocr` | OCR処理をスキップ | False |

## 出力

### result.json

```json
{
  "metadata": {
    "input_pdf": "scan.pdf",
    "template_pdf": "template.pdf",
    "fields_json": "fields.json",
    "page": 0,
    "dpi": 300,
    "threshold": 30,
    "ocr_client": "stub"
  },
  "fields": {
    "patient_name": {
      "type": "text",
      "bbox": [200, 150, 300, 50],
      "has_content": true,
      "text": "山田太郎",
      "confidence": 0.95
    },
    ...
  }
}
```

### 中間画像 (workdir)

| ファイル | 説明 |
|---------|------|
| `01_template.png` | テンプレート画像 |
| `01_scan.png` | スキャン画像 |
| `02_aligned.png` | 位置合わせ後 |
| `03_diff/diff_raw.png` | 生の差分画像 |
| `03_diff/diff_binary.png` | 二値化後 |
| `03_diff/diff_mask.png` | モルフォロジー処理後 |
| `03_masked.png` | マスク適用後 |
| `04_roi_overlay.png` | ROI可視化 |
| `05_rois/roi_*.png` | 各ROI画像 |

## fields.json の書き方

```json
{
  "fields": [
    {
      "name": "field_name",
      "x": 100,          // 左上X座標 (px @ 300dpi)
      "y": 200,          // 左上Y座標
      "width": 150,      // 幅
      "height": 40,      // 高さ
      "type": "text",    // text, number, checkbox, signature
      "options": {       // オプション（任意）
        "label": "表示名"
      }
    }
  ]
}
```

### フィールドタイプ

| タイプ | 説明 | OCR処理 |
|-------|------|---------|
| `text` | 自由テキスト | 文字認識 |
| `number` | 数値 | 数字認識 |
| `checkbox` | チェックボックス | チェック有無判定 |
| `signature` | 署名欄 | 署名有無判定 |

---

## 次にやること (TODO)

### 1. OCR接続 (Cloud Vision API)

```python
# src/ocr_clients.py の CloudVisionOCRClient を実装

from google.cloud import vision

class CloudVisionOCRClient(BaseOCRClient):
    def __init__(self, project_id: str | None = None):
        self.client = vision.ImageAnnotatorClient()

    def recognize(self, image: np.ndarray, field_type: str = "text") -> OCRResult:
        # 1. 画像をエンコード
        _, encoded = cv2.imencode('.png', image)
        content = encoded.tobytes()

        # 2. APIコール
        image = vision.Image(content=content)
        response = self.client.text_detection(image=image)

        # 3. 結果をパース
        texts = response.text_annotations
        if texts:
            return OCRResult(
                text=texts[0].description.strip(),
                confidence=0.9,  # Cloud Visionは信頼度を返さないことがある
                raw_response={"annotations": [t.description for t in texts]}
            )
        return OCRResult(text="", confidence=0.0)
```

**必要な設定:**
- `pip install google-cloud-vision`
- GCPプロジェクトのCloud Vision APIを有効化
- サービスアカウントキーを設定 (`GOOGLE_APPLICATION_CREDENTIALS`)

### 2. Vertex AI (Gemini) 接続

```python
# src/ocr_clients.py の VertexAIOCRClient を実装

import vertexai
from vertexai.generative_models import GenerativeModel, Part

class VertexAIOCRClient(BaseOCRClient):
    def __init__(self, project_id: str, location: str = "us-central1"):
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-1.5-flash")

    def recognize(self, image: np.ndarray, field_type: str = "text") -> OCRResult:
        # 1. 画像をBase64エンコード
        _, encoded = cv2.imencode('.png', image)
        image_data = base64.b64encode(encoded.tobytes()).decode('utf-8')

        # 2. プロンプト生成
        prompts = {
            "text": "この画像の手書きテキストを読み取ってください。テキストのみを出力。",
            "number": "この画像の数字を読み取ってください。数字のみを出力。",
            "checkbox": "このチェックボックスにチェックが入っていますか？'checked'か'unchecked'で回答。",
            "signature": "この欄に署名がありますか？'signed'か'unsigned'で回答。",
        }

        # 3. APIコール
        image_part = Part.from_data(base64.b64decode(image_data), mime_type="image/png")
        response = self.model.generate_content([prompts[field_type], image_part])

        return OCRResult(text=response.text.strip(), confidence=0.85)
```

**必要な設定:**
- `pip install google-cloud-aiplatform`
- GCPプロジェクトのVertex AIを有効化
- 認証設定

### 3. ROI座標の調整

実際の帳票に合わせてROI座標を調整する手順：

1. **テンプレートPDFを300dpiで画像化**
   ```bash
   python -c "
   from src.pdf_render import render_pdf_to_images
   from pathlib import Path
   render_pdf_to_images(Path('template.pdf'), output_dir=Path('out'))
   "
   ```

2. **画像編集ソフトで座標を確認**
   - GIMP, Photoshop, Preview等で画像を開く
   - 各フィールドの(x, y, width, height)を計測

3. **fields.jsonを更新**
   - 座標はすべて300dpi基準のピクセル値

4. **可視化して確認**
   ```bash
   python -m src.main --input scan.pdf --template template.pdf \
       --fields fields.json --output /dev/null --workdir out/work --skip-ocr
   # out/work/04_roi_overlay.png を確認
   ```

### 4. Cloud Run化

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

# Cloud Run用にHTTPサーバー化が必要
# FastAPI or Flask でラップ
```

**Cloud Run化の追加作業:**
- FastAPI/Flaskでエンドポイント作成
- Cloud Storageからの入力/出力対応
- 認証・認可の追加

### 5. 精度向上のための調整

- **位置合わせ**: SIFT/SURFを試す（ORBで精度が出ない場合）
- **差分検出**: 閾値の動的調整、適応的二値化
- **前処理**: ノイズ除去、コントラスト調整
- **後処理**: OCR結果の正規化、バリデーション

---

## 開発メモ

### 処理フロー

```
[スキャンPDF] → PDF変換(300dpi) → 位置合わせ → 差分抽出 → ROI切り出し → OCR → JSON
[テンプレートPDF] ↗
[fields.json] → ROI定義読み込み ↗
```

### 想定環境

- **ローカル開発**: macOS/Linux + Python 3.10+
- **本番**: Cloud Run + Cloud Vision API / Vertex AI
- **入力**: CamScannerでスキャンしたPDF（歪み・回転あり）
- **出力**: 構造化JSON（後続システム連携用）
