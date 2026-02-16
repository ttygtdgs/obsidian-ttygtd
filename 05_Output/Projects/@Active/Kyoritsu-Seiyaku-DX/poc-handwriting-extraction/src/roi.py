"""ROI (Region of Interest) Extraction

fields.json に従って、画像から特定領域を切り出す。
"""

import json
from pathlib import Path
from typing import Dict, List, Any

import cv2
import numpy as np


class ROIDefinition:
    """ROI定義クラス"""

    def __init__(
        self,
        name: str,
        x: int,
        y: int,
        width: int,
        height: int,
        field_type: str = "text",
        options: Dict[str, Any] | None = None,
    ):
        self.name = name
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.field_type = field_type  # "text", "checkbox", "signature", "number"
        self.options = options or {}

    @property
    def bbox(self) -> tuple:
        """(x, y, width, height) のタプルを返す"""
        return (self.x, self.y, self.width, self.height)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "type": self.field_type,
            "options": self.options,
        }


def load_fields_json(json_path: Path) -> List[ROIDefinition]:
    """fields.json からROI定義を読み込む。

    Args:
        json_path: fields.json のパス

    Returns:
        ROI定義のリスト
    """
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    rois = []
    for field in data.get("fields", []):
        roi = ROIDefinition(
            name=field["name"],
            x=field["x"],
            y=field["y"],
            width=field["width"],
            height=field["height"],
            field_type=field.get("type", "text"),
            options=field.get("options", {}),
        )
        rois.append(roi)

    return rois


def extract_roi(
    image: np.ndarray,
    roi: ROIDefinition,
    padding: int = 0,
) -> np.ndarray:
    """画像からROI領域を切り出す。

    Args:
        image: 入力画像 (BGR)
        roi: ROI定義
        padding: 追加パディング (ピクセル)

    Returns:
        切り出した画像
    """
    h, w = image.shape[:2]

    # パディングを適用
    x1 = max(0, roi.x - padding)
    y1 = max(0, roi.y - padding)
    x2 = min(w, roi.x + roi.width + padding)
    y2 = min(h, roi.y + roi.height + padding)

    return image[y1:y2, x1:x2].copy()


def extract_all_rois(
    image: np.ndarray,
    rois: List[ROIDefinition],
    output_dir: Path | None = None,
) -> Dict[str, np.ndarray]:
    """全ROIを切り出す。

    Args:
        image: 入力画像 (BGR)
        rois: ROI定義のリスト
        output_dir: ROI画像を保存するディレクトリ

    Returns:
        {ROI名: 切り出し画像} の辞書
    """
    extracted = {}

    for roi in rois:
        roi_image = extract_roi(image, roi)
        extracted[roi.name] = roi_image

        if output_dir:
            output_dir.mkdir(parents=True, exist_ok=True)
            safe_name = roi.name.replace("/", "_").replace(" ", "_")
            output_path = output_dir / f"roi_{safe_name}.png"
            cv2.imwrite(str(output_path), roi_image)

    if output_dir:
        print(f"Saved {len(extracted)} ROI images to {output_dir}")

    return extracted


def visualize_rois(
    image: np.ndarray,
    rois: List[ROIDefinition],
    output_path: Path | None = None,
) -> np.ndarray:
    """ROI領域を画像上に可視化する。

    Args:
        image: 入力画像 (BGR)
        rois: ROI定義のリスト
        output_path: 出力画像のパス

    Returns:
        ROI領域を描画した画像
    """
    vis_image = image.copy()

    # フィールドタイプごとの色
    colors = {
        "text": (0, 255, 0),      # 緑
        "checkbox": (255, 0, 0),   # 青
        "signature": (0, 0, 255),  # 赤
        "number": (255, 255, 0),   # シアン
    }

    for roi in rois:
        color = colors.get(roi.field_type, (128, 128, 128))

        # 矩形描画
        cv2.rectangle(
            vis_image,
            (roi.x, roi.y),
            (roi.x + roi.width, roi.y + roi.height),
            color,
            2,
        )

        # ラベル描画
        cv2.putText(
            vis_image,
            f"{roi.name} ({roi.field_type})",
            (roi.x, roi.y - 5),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            color,
            1,
        )

    if output_path:
        cv2.imwrite(str(output_path), vis_image)
        print(f"Saved ROI visualization to {output_path}")

    return vis_image


def check_roi_has_content(
    roi_image: np.ndarray,
    threshold: float = 0.01,
) -> bool:
    """ROI領域に内容（手書き）があるかチェックする。

    Args:
        roi_image: ROI画像 (BGR)
        threshold: 非白ピクセルの割合閾値

    Returns:
        内容があればTrue
    """
    gray = cv2.cvtColor(roi_image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)

    non_white_ratio = np.sum(binary > 0) / binary.size
    return bool(non_white_ratio > threshold)  # numpy.bool_ → Python bool
