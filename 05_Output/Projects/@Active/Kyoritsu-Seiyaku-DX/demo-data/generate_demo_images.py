"""
共立製薬 デモ用プレースホルダー画像生成
========================================
異常観察レコードに対応するデモ用記録写真（プレースホルダー）を生成する。

使い方:
  pip install Pillow
  python generate_demo_images.py

出力:
  ./images/*.png
"""

import csv
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

CSV_DIR = Path(__file__).parent / "csv"
IMAGE_DIR = Path(__file__).parent / "images"
IMAGE_DIR.mkdir(exist_ok=True)

# 症状ラベル
SYMPTOM_LABELS = {
    "nasal_discharge": "鼻汁",
    "lacrimation": "流涙",
    "eye_discharge": "眼脂",
    "conjunctivitis": "結膜炎",
    "vomiting": "嘔吐",
    "coughing": "咳",
    "respiratory_abnormal": "呼吸異常",
    "feces": "糞便異常",
    "dehydration": "脱水",
}

# 症状に対応する色（背景のグラデーション）
SYMPTOM_COLORS = {
    "nasal_discharge": (70, 130, 180),   # steel blue
    "lacrimation": (100, 149, 237),      # cornflower blue
    "eye_discharge": (147, 112, 219),    # medium purple
    "conjunctivitis": (199, 21, 133),    # medium violet red
    "vomiting": (205, 133, 63),          # peru
    "coughing": (210, 105, 30),          # chocolate
    "respiratory_abnormal": (178, 34, 34),  # firebrick
    "feces": (139, 119, 101),            # rosy brown
    "dehydration": (218, 165, 32),       # goldenrod
}


def _try_font(size: int):
    """日本語フォントを取得（macOS / Linux / フォールバック）"""
    candidates = [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    ]
    for fp in candidates:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    # フォールバック: デフォルトフォント
    try:
        return ImageFont.truetype("Arial", size)
    except OSError:
        return ImageFont.load_default()


def generate_placeholder_image(
    animal_id: str,
    day: int,
    symptom_key: str,
    observation_date: str,
    score: int,
    output_path: Path,
):
    """プレースホルダー画像を生成"""
    width, height = 640, 480
    bg_color = SYMPTOM_COLORS.get(symptom_key, (100, 100, 100))

    # 背景グラデーション風
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # 半透明オーバーレイ（暗め）
    overlay = Image.new("RGBA", (width, height), (*bg_color, 180))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # カメラアイコン風の円
    cx, cy = width // 2, height // 2 - 30
    draw.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], outline="white", width=3)
    # レンズ円
    draw.ellipse([cx - 35, cy - 35, cx + 35, cy + 35], outline="white", width=2)
    # 小さい円（レンズ反射）
    draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill="white")

    # テキスト
    font_large = _try_font(28)
    font_medium = _try_font(20)
    font_small = _try_font(16)

    symptom_label = SYMPTOM_LABELS.get(symptom_key, symptom_key)

    # ヘッダー
    draw.text((20, 20), "記録写真（デモ用プレースホルダー）", fill="white", font=font_small)

    # メイン情報
    draw.text((width // 2, cy + 80), symptom_label, fill="white", font=font_large, anchor="mm")
    draw.text((width // 2, cy + 115), f"スコア: {score}", fill=(255, 200, 100), font=font_medium, anchor="mm")

    # フッター情報
    y_footer = height - 80
    draw.text((20, y_footer), f"個体番号: {animal_id}", fill="white", font=font_medium)
    draw.text((20, y_footer + 28), f"Day {day}  |  {observation_date}", fill=(200, 200, 200), font=font_small)

    # 右下にスコアバッジ
    badge_x = width - 80
    badge_y = height - 70
    badge_color = (220, 50, 50) if score >= 3 else (255, 165, 0) if score >= 2 else (100, 180, 100)
    draw.rounded_rectangle([badge_x - 25, badge_y - 15, badge_x + 25, badge_y + 15],
                           radius=8, fill=badge_color)
    draw.text((badge_x, badge_y), str(score), fill="white", font=font_medium, anchor="mm")

    # 枠線
    draw.rectangle([0, 0, width - 1, height - 1], outline="white", width=2)

    img.save(output_path, "PNG")


def main():
    """observation.csv を読み込み、異常スコアが高い観察に対して画像を生成"""
    obs_path = CSV_DIR / "observation.csv"
    if not obs_path.exists():
        print("ERROR: observation.csv が見つかりません。先に generate_demo_data.py を実行してください。")
        return

    with open(obs_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # score_sheet.csv からanimal_id を引く
    sheet_path = CSV_DIR / "score_sheet.csv"
    sheet_map = {}
    with open(sheet_path, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            sheet_map[row["score_sheet_id"]] = row["animal_id"]

    # study.csv から試験開始日を引く
    study_path = CSV_DIR / "study.csv"
    study_map = {}
    with open(study_path, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            study_map[row["study_id"]] = row["study_period_start"]

    # score_sheet → study のマッピング
    sheet_study = {}
    with open(sheet_path, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            sheet_study[row["score_sheet_id"]] = row["study_id"]

    # 臨床スコアが高い観察を特定
    symptom_cols_single = ["vomiting", "coughing", "respiratory_abnormal", "dehydration"]
    symptom_cols_lr = ["nasal_discharge", "lacrimation", "eye_discharge", "conjunctivitis"]

    generated = []
    seen_combos = set()

    for row in rows:
        animal_id = sheet_map.get(row["score_sheet_id"], "???")
        study_id = sheet_study.get(row["score_sheet_id"], "")
        start_date = study_map.get(study_id, "")

        obs_date = row["observed_at"][:10]

        # day_number を計算
        if start_date:
            from datetime import datetime
            d_obs = datetime.strptime(obs_date, "%Y-%m-%d")
            d_start = datetime.strptime(start_date, "%Y-%m-%d")
            day_num = (d_obs - d_start).days
        else:
            day_num = 0

        # 各症状をチェック
        for col in symptom_cols_single:
            val = int(row.get(col, 0) or 0)
            if val >= 1:
                combo = (animal_id, day_num, col)
                if combo not in seen_combos:
                    seen_combos.add(combo)
                    fname = f"{animal_id}_day{day_num:02d}_{col}.png"
                    output_path = IMAGE_DIR / fname
                    generate_placeholder_image(animal_id, day_num, col, obs_date, val, output_path)
                    generated.append((row["observation_id"], f"images/{fname}"))

        for col in symptom_cols_lr:
            val_l = int(row.get(f"{col}_l", 0) or 0)
            val_r = int(row.get(f"{col}_r", 0) or 0)
            val = max(val_l, val_r)
            if val >= 2:  # 左右の高い方が2以上の場合のみ画像生成
                combo = (animal_id, day_num, col)
                if combo not in seen_combos:
                    seen_combos.add(combo)
                    fname = f"{animal_id}_day{day_num:02d}_{col}.png"
                    output_path = IMAGE_DIR / fname
                    generate_placeholder_image(animal_id, day_num, col, obs_date, val, output_path)
                    generated.append((row["observation_id"], f"images/{fname}"))

    print(f"プレースホルダー画像を {len(generated)} 枚生成しました → {IMAGE_DIR}")

    # image_mapping.csv を出力（observation_id → image_path のマッピング）
    mapping_path = CSV_DIR / "image_mapping.csv"
    with open(mapping_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["observation_id", "image_path"])
        for obs_id, img_path in generated:
            writer.writerow([obs_id, img_path])
    print(f"マッピングファイル: {mapping_path} ({len(generated)} 件)")


if __name__ == "__main__":
    main()
