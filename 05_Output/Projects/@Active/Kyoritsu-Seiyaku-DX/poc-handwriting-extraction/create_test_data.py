#!/usr/bin/env python3
"""テスト用のダミーPDFを生成するスクリプト

テンプレートPDFと、手書き風の記入があるスキャンPDFを生成する。
"""

from pathlib import Path

import fitz  # PyMuPDF
import numpy as np


def create_template_pdf(output_path: Path):
    """テンプレートPDFを生成する（印刷用の空フォーム）"""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)  # A4

    # タイトル
    page.insert_text((50, 50), "患者スコアシート", fontsize=20, fontname="japan")

    # フィールドラベルと枠線
    fields = [
        {"label": "患者氏名:", "rect": (150, 80, 350, 110)},
        {"label": "患者ID:", "rect": (400, 80, 500, 110)},
        {"label": "日付:", "rect": (400, 120, 550, 150)},
        {"label": "スコア1:", "rect": (100, 200, 160, 230)},
        {"label": "スコア2:", "rect": (200, 200, 260, 230)},
        {"label": "スコア3:", "rect": (300, 200, 360, 230)},
        {"label": "□ 該当する", "rect": (100, 280, 130, 310)},
        {"label": "□ 該当しない", "rect": (200, 280, 230, 310)},
        {"label": "備考:", "rect": (100, 350, 500, 500)},
        {"label": "担当者署名:", "rect": (350, 550, 550, 620)},
    ]

    for field in fields:
        # ラベル
        page.insert_text((field["rect"][0], field["rect"][1] - 5),
                        field["label"], fontsize=10, fontname="japan")
        # 枠線
        rect = fitz.Rect(field["rect"])
        page.draw_rect(rect, color=(0, 0, 0), width=0.5)

    doc.save(output_path)
    doc.close()
    print(f"Created: {output_path}")


def create_scan_pdf(output_path: Path):
    """手書き風の記入があるスキャンPDFを生成する"""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)  # A4

    # タイトル（テンプレートと同じ）
    page.insert_text((50, 50), "患者スコアシート", fontsize=20, fontname="japan")

    # フィールドラベルと枠線（テンプレートと同じ）
    fields = [
        {"label": "患者氏名:", "rect": (150, 80, 350, 110)},
        {"label": "患者ID:", "rect": (400, 80, 500, 110)},
        {"label": "日付:", "rect": (400, 120, 550, 150)},
        {"label": "スコア1:", "rect": (100, 200, 160, 230)},
        {"label": "スコア2:", "rect": (200, 200, 260, 230)},
        {"label": "スコア3:", "rect": (300, 200, 360, 230)},
        {"label": "□ 該当する", "rect": (100, 280, 130, 310)},
        {"label": "□ 該当しない", "rect": (200, 280, 230, 310)},
        {"label": "備考:", "rect": (100, 350, 500, 500)},
        {"label": "担当者署名:", "rect": (350, 550, 550, 620)},
    ]

    for field in fields:
        page.insert_text((field["rect"][0], field["rect"][1] - 5),
                        field["label"], fontsize=10, fontname="japan")
        rect = fitz.Rect(field["rect"])
        page.draw_rect(rect, color=(0, 0, 0), width=0.5)

    # ===== 手書き風の記入を追加 =====

    # 患者氏名
    page.insert_text((160, 100), "山田 太郎", fontsize=14, fontname="japan",
                    color=(0.1, 0.1, 0.3))

    # 患者ID
    page.insert_text((410, 100), "12345", fontsize=14, fontname="helv",
                    color=(0.1, 0.1, 0.3))

    # 日付
    page.insert_text((410, 140), "2026/1/29", fontsize=12, fontname="helv",
                    color=(0.1, 0.1, 0.3))

    # スコア
    page.insert_text((120, 220), "7", fontsize=16, fontname="helv",
                    color=(0.1, 0.1, 0.3))
    page.insert_text((220, 220), "8", fontsize=16, fontname="helv",
                    color=(0.1, 0.1, 0.3))
    page.insert_text((320, 220), "6", fontsize=16, fontname="helv",
                    color=(0.1, 0.1, 0.3))

    # チェックボックス（該当するにチェック）
    page.draw_line((102, 282), (128, 308), color=(0.1, 0.1, 0.3), width=2)
    page.draw_line((128, 282), (102, 308), color=(0.1, 0.1, 0.3), width=2)

    # 備考
    page.insert_text((110, 370), "経過良好。", fontsize=11, fontname="japan",
                    color=(0.1, 0.1, 0.3))
    page.insert_text((110, 390), "次回は2週間後に再診予定。", fontsize=11, fontname="japan",
                    color=(0.1, 0.1, 0.3))

    # 署名（手書き風の線）
    points = [
        (370, 590), (390, 580), (410, 595), (430, 575),
        (450, 590), (470, 580), (490, 600), (510, 585)
    ]
    for i in range(len(points) - 1):
        page.draw_line(points[i], points[i+1], color=(0.1, 0.1, 0.3), width=1.5)

    doc.save(output_path)
    doc.close()
    print(f"Created: {output_path}")


def create_fields_json(output_path: Path):
    """テスト用のfields.jsonを生成する（DPI=72基準→300DPI換算）"""
    import json

    # PDF座標(72dpi) → 画像座標(300dpi) の変換係数
    scale = 300 / 72

    fields_72dpi = [
        {"name": "patient_name", "x": 150, "y": 80, "width": 200, "height": 30, "type": "text"},
        {"name": "patient_id", "x": 400, "y": 80, "width": 100, "height": 30, "type": "number"},
        {"name": "date", "x": 400, "y": 120, "width": 150, "height": 30, "type": "text"},
        {"name": "score_1", "x": 100, "y": 200, "width": 60, "height": 30, "type": "number"},
        {"name": "score_2", "x": 200, "y": 200, "width": 60, "height": 30, "type": "number"},
        {"name": "score_3", "x": 300, "y": 200, "width": 60, "height": 30, "type": "number"},
        {"name": "checkbox_applicable", "x": 100, "y": 280, "width": 30, "height": 30, "type": "checkbox"},
        {"name": "checkbox_not_applicable", "x": 200, "y": 280, "width": 30, "height": 30, "type": "checkbox"},
        {"name": "notes", "x": 100, "y": 350, "width": 400, "height": 150, "type": "text"},
        {"name": "signature", "x": 350, "y": 550, "width": 200, "height": 70, "type": "signature"},
    ]

    # 300dpiに変換
    fields_300dpi = []
    for f in fields_72dpi:
        fields_300dpi.append({
            "name": f["name"],
            "x": int(f["x"] * scale),
            "y": int(f["y"] * scale),
            "width": int(f["width"] * scale),
            "height": int(f["height"] * scale),
            "type": f["type"],
        })

    data = {
        "version": "1.0",
        "description": "テスト用フィールド定義 (300dpi基準)",
        "fields": fields_300dpi
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Created: {output_path}")


if __name__ == "__main__":
    test_dir = Path("test_data")
    test_dir.mkdir(exist_ok=True)

    create_template_pdf(test_dir / "template.pdf")
    create_scan_pdf(test_dir / "scan.pdf")
    create_fields_json(test_dir / "fields.json")

    print("\n✓ テストデータ生成完了")
    print(f"  {test_dir}/template.pdf  - テンプレート")
    print(f"  {test_dir}/scan.pdf      - 記入済みスキャン")
    print(f"  {test_dir}/fields.json   - ROI定義")
    print("\n実行コマンド:")
    print(f"  python -m src.main -i {test_dir}/scan.pdf -t {test_dir}/template.pdf -f {test_dir}/fields.json -o out/result.json -w out/work")
