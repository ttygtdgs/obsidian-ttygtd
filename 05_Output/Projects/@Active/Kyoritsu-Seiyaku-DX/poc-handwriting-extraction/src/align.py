"""Template Alignment Module

スキャン画像をテンプレートに位置合わせする。
特徴点マッチング → ホモグラフィ推定 → Warp変換
"""

from pathlib import Path
from typing import Tuple

import cv2
import numpy as np


def detect_and_match_features(
    template_img: np.ndarray,
    scan_img: np.ndarray,
    max_features: int = 5000,
    match_ratio: float = 0.75,
) -> Tuple[np.ndarray, np.ndarray]:
    """ORB特徴点でマッチングを行う。

    Args:
        template_img: テンプレート画像 (BGR)
        scan_img: スキャン画像 (BGR)
        max_features: 検出する特徴点の最大数
        match_ratio: Lowe's ratio test の閾値

    Returns:
        template_points: テンプレート側のマッチング点
        scan_points: スキャン側のマッチング点
    """
    # グレースケール変換
    template_gray = cv2.cvtColor(template_img, cv2.COLOR_BGR2GRAY)
    scan_gray = cv2.cvtColor(scan_img, cv2.COLOR_BGR2GRAY)

    # ORB検出器
    orb = cv2.ORB_create(nfeatures=max_features)

    # 特徴点とディスクリプタを検出
    kp1, desc1 = orb.detectAndCompute(template_gray, None)
    kp2, desc2 = orb.detectAndCompute(scan_gray, None)

    if desc1 is None or desc2 is None:
        raise ValueError("Could not detect features in one or both images")

    # BFマッチャー (Hamming距離)
    bf = cv2.BFMatcher(cv2.NORM_HAMMING)
    matches = bf.knnMatch(desc1, desc2, k=2)

    # Lowe's ratio test
    good_matches = []
    for m, n in matches:
        if m.distance < match_ratio * n.distance:
            good_matches.append(m)

    if len(good_matches) < 4:
        raise ValueError(f"Not enough matches found: {len(good_matches)} (need at least 4)")

    # マッチング点を抽出
    template_points = np.float32([kp1[m.queryIdx].pt for m in good_matches])
    scan_points = np.float32([kp2[m.trainIdx].pt for m in good_matches])

    return template_points, scan_points


def compute_homography(
    template_points: np.ndarray,
    scan_points: np.ndarray,
    ransac_threshold: float = 5.0,
) -> np.ndarray:
    """ホモグラフィ行列を計算する (RANSAC)。

    Args:
        template_points: テンプレート側の点群
        scan_points: スキャン側の点群
        ransac_threshold: RANSACのインライア閾値

    Returns:
        3x3 ホモグラフィ行列
    """
    H, mask = cv2.findHomography(scan_points, template_points, cv2.RANSAC, ransac_threshold)

    if H is None:
        raise ValueError("Could not compute homography matrix")

    inliers = np.sum(mask)
    print(f"Homography computed with {inliers}/{len(mask)} inliers")

    return H


def warp_image(
    image: np.ndarray,
    homography: np.ndarray,
    target_size: Tuple[int, int],
) -> np.ndarray:
    """画像をワープ変換する。

    Args:
        image: 入力画像
        homography: 3x3 ホモグラフィ行列
        target_size: 出力サイズ (width, height)

    Returns:
        ワープ後の画像
    """
    warped = cv2.warpPerspective(
        image,
        homography,
        target_size,
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(255, 255, 255),  # 白で埋める
    )
    return warped


def align_scan_to_template(
    template_img: np.ndarray,
    scan_img: np.ndarray,
    output_dir: Path | None = None,
) -> np.ndarray:
    """スキャン画像をテンプレートに位置合わせする。

    Args:
        template_img: テンプレート画像 (BGR)
        scan_img: スキャン画像 (BGR)
        output_dir: 中間画像を保存するディレクトリ

    Returns:
        位置合わせ後のスキャン画像
    """
    # 特徴点マッチング
    template_pts, scan_pts = detect_and_match_features(template_img, scan_img)
    print(f"Found {len(template_pts)} matching points")

    # ホモグラフィ推定
    H = compute_homography(template_pts, scan_pts)

    # ワープ変換
    h, w = template_img.shape[:2]
    aligned = warp_image(scan_img, H, (w, h))

    # 保存
    if output_dir:
        output_dir.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(output_dir / "aligned.png"), aligned)
        print(f"Saved aligned image to {output_dir / 'aligned.png'}")

    return aligned
