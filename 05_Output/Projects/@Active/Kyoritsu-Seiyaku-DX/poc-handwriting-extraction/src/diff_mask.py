"""Difference Mask Extraction

テンプレートとスキャン画像の差分から手書き部分を抽出する。
absdiff → threshold → morphological operations
"""

from pathlib import Path
from typing import Tuple

import cv2
import numpy as np


def compute_absolute_difference(
    template_img: np.ndarray,
    scan_img: np.ndarray,
) -> np.ndarray:
    """2つの画像の絶対差分を計算する。

    Args:
        template_img: テンプレート画像 (BGR)
        scan_img: スキャン画像 (BGR, テンプレートに位置合わせ済み)

    Returns:
        差分画像 (グレースケール)
    """
    # グレースケール変換
    template_gray = cv2.cvtColor(template_img, cv2.COLOR_BGR2GRAY)
    scan_gray = cv2.cvtColor(scan_img, cv2.COLOR_BGR2GRAY)

    # 絶対差分
    diff = cv2.absdiff(template_gray, scan_gray)

    return diff


def apply_threshold(
    diff_img: np.ndarray,
    threshold: int = 30,
    use_adaptive: bool = False,
) -> np.ndarray:
    """差分画像を二値化する。

    Args:
        diff_img: 差分画像 (グレースケール)
        threshold: 固定閾値 (use_adaptive=Falseの場合)
        use_adaptive: 適応的二値化を使用するか

    Returns:
        二値化マスク
    """
    if use_adaptive:
        # 適応的二値化
        binary = cv2.adaptiveThreshold(
            diff_img,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=11,
            C=-5,
        )
    else:
        # 固定閾値
        _, binary = cv2.threshold(diff_img, threshold, 255, cv2.THRESH_BINARY)

    return binary


def apply_morphological_operations(
    binary_img: np.ndarray,
    kernel_size: int = 3,
    iterations: int = 1,
) -> np.ndarray:
    """モルフォロジー演算でノイズ除去・領域連結する。

    Args:
        binary_img: 二値画像
        kernel_size: カーネルサイズ
        iterations: 演算の繰り返し回数

    Returns:
        処理後の二値画像
    """
    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE,
        (kernel_size, kernel_size)
    )

    # Opening (ノイズ除去)
    opened = cv2.morphologyEx(binary_img, cv2.MORPH_OPEN, kernel, iterations=iterations)

    # Closing (穴埋め・連結)
    closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel, iterations=iterations)

    return closed


def extract_handwriting_mask(
    template_img: np.ndarray,
    scan_img: np.ndarray,
    threshold: int = 30,
    morph_kernel: int = 3,
    output_dir: Path | None = None,
) -> Tuple[np.ndarray, np.ndarray]:
    """手書き部分のマスクを抽出する。

    Args:
        template_img: テンプレート画像 (BGR)
        scan_img: スキャン画像 (BGR, 位置合わせ済み)
        threshold: 二値化閾値
        morph_kernel: モルフォロジーカーネルサイズ
        output_dir: 中間画像を保存するディレクトリ

    Returns:
        diff_img: 差分画像 (グレースケール)
        mask: 手書きマスク (二値)
    """
    # 差分計算
    diff = compute_absolute_difference(template_img, scan_img)

    # 二値化
    binary = apply_threshold(diff, threshold=threshold)

    # モルフォロジー処理
    mask = apply_morphological_operations(binary, kernel_size=morph_kernel)

    # 保存
    if output_dir:
        output_dir.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(output_dir / "diff_raw.png"), diff)
        cv2.imwrite(str(output_dir / "diff_binary.png"), binary)
        cv2.imwrite(str(output_dir / "diff_mask.png"), mask)
        print(f"Saved diff images to {output_dir}")

    return diff, mask


def apply_mask_to_image(
    image: np.ndarray,
    mask: np.ndarray,
    background_color: Tuple[int, int, int] = (255, 255, 255),
) -> np.ndarray:
    """マスクを適用して手書き部分のみを抽出する。

    Args:
        image: 入力画像 (BGR)
        mask: 二値マスク
        background_color: 背景色 (BGR)

    Returns:
        マスク適用後の画像
    """
    # マスクを3チャンネルに拡張
    mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

    # 背景を作成
    background = np.full_like(image, background_color, dtype=np.uint8)

    # マスク適用
    result = np.where(mask_3ch > 0, image, background)

    return result
