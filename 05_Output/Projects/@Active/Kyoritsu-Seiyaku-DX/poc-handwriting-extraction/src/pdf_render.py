"""PDF to Image Renderer

PDFを固定DPIで画像に変換する。
"""

from pathlib import Path
from typing import List

import fitz  # PyMuPDF
from PIL import Image
import numpy as np


DEFAULT_DPI = 300


def render_pdf_to_images(
    pdf_path: Path,
    dpi: int = DEFAULT_DPI,
    output_dir: Path | None = None,
) -> List[np.ndarray]:
    """PDFを画像リストに変換する。

    Args:
        pdf_path: 入力PDFのパス
        dpi: 出力解像度 (default: 300)
        output_dir: 画像を保存するディレクトリ (Noneなら保存しない)

    Returns:
        各ページの画像 (numpy array, BGR形式)
    """
    doc = fitz.open(pdf_path)
    images = []

    zoom = dpi / 72  # 72 is PDF default DPI
    matrix = fitz.Matrix(zoom, zoom)

    for page_num, page in enumerate(doc):
        pix = page.get_pixmap(matrix=matrix)

        # Convert to numpy array (RGB)
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
            pix.height, pix.width, pix.n
        )

        # Convert RGB to BGR for OpenCV compatibility
        if pix.n == 4:  # RGBA
            img_bgr = img_array[:, :, [2, 1, 0]]  # Drop alpha, swap R and B
        else:  # RGB
            img_bgr = img_array[:, :, [2, 1, 0]]

        images.append(img_bgr)

        # Save if output_dir is specified
        if output_dir:
            output_dir.mkdir(parents=True, exist_ok=True)
            output_path = output_dir / f"rendered_page_{page_num:03d}.png"
            Image.fromarray(img_array[:, :, :3]).save(output_path)
            print(f"Saved: {output_path}")

    doc.close()
    return images


def render_single_page(
    pdf_path: Path,
    page_num: int = 0,
    dpi: int = DEFAULT_DPI,
) -> np.ndarray:
    """PDFの指定ページのみを画像に変換する。

    Args:
        pdf_path: 入力PDFのパス
        page_num: ページ番号 (0-indexed)
        dpi: 出力解像度

    Returns:
        ページ画像 (numpy array, BGR形式)
    """
    doc = fitz.open(pdf_path)
    if page_num >= len(doc):
        raise ValueError(f"Page {page_num} does not exist. PDF has {len(doc)} pages.")

    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)

    page = doc[page_num]
    pix = page.get_pixmap(matrix=matrix)

    img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
        pix.height, pix.width, pix.n
    )

    # Convert RGB to BGR
    if pix.n >= 3:
        img_bgr = img_array[:, :, [2, 1, 0]]
    else:
        img_bgr = img_array

    doc.close()
    return img_bgr
