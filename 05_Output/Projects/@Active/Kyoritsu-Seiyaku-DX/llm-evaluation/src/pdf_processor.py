"""PDF processing module for converting PDF to images and Base64."""

import base64
from io import BytesIO
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image


class PDFProcessor:
    """PDFを画像に変換しBase64エンコードするクラス"""

    def __init__(self, dpi: int = 200, image_format: str = "png"):
        """
        Args:
            dpi: 画像解像度（デフォルト: 200）
            image_format: 出力画像形式（デフォルト: png）
        """
        self.dpi = dpi
        self.image_format = image_format
        self.zoom = dpi / 72  # 72 DPIが基準

    def pdf_to_images(self, pdf_path: str | Path) -> list[Image.Image]:
        """PDFファイルを画像のリストに変換

        Args:
            pdf_path: PDFファイルのパス

        Returns:
            PIL Imageオブジェクトのリスト（ページごと）
        """
        pdf_path = Path(pdf_path)
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        images = []
        doc = fitz.open(pdf_path)

        try:
            for page_num in range(len(doc)):
                page = doc[page_num]
                mat = fitz.Matrix(self.zoom, self.zoom)
                pix = page.get_pixmap(matrix=mat)

                img_data = pix.tobytes("png")
                img = Image.open(BytesIO(img_data))
                images.append(img)
        finally:
            doc.close()

        return images

    def image_to_base64(self, image: Image.Image) -> str:
        """PIL ImageをBase64文字列に変換

        Args:
            image: PIL Imageオブジェクト

        Returns:
            Base64エンコードされた文字列
        """
        buffer = BytesIO()
        image.save(buffer, format=self.image_format.upper())
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode("utf-8")

    def pdf_to_base64_images(self, pdf_path: str | Path) -> list[str]:
        """PDFファイルをBase64画像のリストに変換

        Args:
            pdf_path: PDFファイルのパス

        Returns:
            Base64エンコードされた画像文字列のリスト（ページごと）
        """
        images = self.pdf_to_images(pdf_path)
        return [self.image_to_base64(img) for img in images]

    def get_media_type(self) -> str:
        """現在の画像形式のMIMEタイプを返す"""
        format_map = {
            "png": "image/png",
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
        }
        return format_map.get(self.image_format.lower(), "image/png")


def process_pdf(pdf_path: str | Path, dpi: int = 200) -> list[dict]:
    """PDFを処理してLLM API用のデータを返す

    Args:
        pdf_path: PDFファイルのパス
        dpi: 画像解像度

    Returns:
        各ページの画像データを含む辞書のリスト
        [{"page": 1, "base64": "...", "media_type": "image/png"}, ...]
    """
    processor = PDFProcessor(dpi=dpi)
    base64_images = processor.pdf_to_base64_images(pdf_path)
    media_type = processor.get_media_type()

    return [
        {"page": i + 1, "base64": b64, "media_type": media_type}
        for i, b64 in enumerate(base64_images)
    ]
