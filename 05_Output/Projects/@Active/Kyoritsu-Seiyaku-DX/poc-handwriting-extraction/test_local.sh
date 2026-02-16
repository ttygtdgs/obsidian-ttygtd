#!/bin/bash
# ローカルテスト実行スクリプト

set -e

cd "$(dirname "$0")"

echo "=== 手書き抽出PoC ローカルテスト ==="
echo ""

# 仮想環境チェック
if [ ! -d ".venv" ]; then
    echo "[1/4] 仮想環境を作成中..."
    python3 -m venv .venv
fi

echo "[1/4] 仮想環境を有効化..."
source .venv/bin/activate

echo "[2/4] 依存関係をインストール..."
pip install -q -r requirements.txt

echo "[3/4] テストデータを生成..."
python create_test_data.py

echo "[4/4] パイプラインを実行..."
python -m src.main \
    --input test_data/scan.pdf \
    --template test_data/template.pdf \
    --fields test_data/fields.json \
    --output out/result.json \
    --workdir out/work

echo ""
echo "=== 完了 ==="
echo ""
echo "出力ファイル:"
echo "  out/result.json     - 抽出結果"
echo "  out/work/           - 中間画像"
echo ""
echo "確認コマンド:"
echo "  cat out/result.json | python -m json.tool"
echo "  open out/work/      # macOS"
