"""OCR Client Module

OCR呼び出しのスタブ実装。
後でGoogle Cloud Vision API や Vertex AI に差し替え可能。
"""

import json
import base64
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, Any, List

import cv2
import numpy as np


class OCRResult:
    """OCR結果を格納するクラス"""

    def __init__(
        self,
        text: str,
        confidence: float,
        raw_response: Dict[str, Any] | None = None,
    ):
        self.text = text
        self.confidence = confidence
        self.raw_response = raw_response or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "confidence": self.confidence,
        }


class BaseOCRClient(ABC):
    """OCRクライアントの基底クラス"""

    @abstractmethod
    def recognize(self, image: np.ndarray, field_type: str = "text") -> OCRResult:
        """画像からテキストを認識する。

        Args:
            image: 入力画像 (BGR)
            field_type: フィールドタイプ ("text", "number", "checkbox", "signature")

        Returns:
            OCR結果
        """
        pass


class StubOCRClient(BaseOCRClient):
    """スタブOCRクライアント (テスト用)"""

    def __init__(self, stub_responses: Dict[str, str] | None = None):
        """
        Args:
            stub_responses: {フィールド名: 返すテキスト} の辞書
        """
        self.stub_responses = stub_responses or {}
        self._call_count = 0

    def recognize(self, image: np.ndarray, field_type: str = "text") -> OCRResult:
        self._call_count += 1

        # フィールドタイプに応じたダミー応答
        if field_type == "checkbox":
            # 画像の黒ピクセル率でチェック有無を判定
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
            fill_ratio = np.sum(binary > 0) / binary.size
            is_checked = fill_ratio > 0.05
            return OCRResult(
                text="checked" if is_checked else "unchecked",
                confidence=0.9 if is_checked else 0.8,
            )

        elif field_type == "signature":
            # 署名の有無を判定
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
            fill_ratio = np.sum(binary > 0) / binary.size
            has_signature = fill_ratio > 0.02
            return OCRResult(
                text="signed" if has_signature else "unsigned",
                confidence=0.85,
            )

        elif field_type == "number":
            return OCRResult(
                text=f"[STUB_NUMBER_{self._call_count}]",
                confidence=0.95,
            )

        else:  # text
            return OCRResult(
                text=f"[STUB_TEXT_{self._call_count}]",
                confidence=0.90,
            )


class CloudVisionOCRClient(BaseOCRClient):
    """Google Cloud Vision API クライアント (未実装)"""

    def __init__(self, project_id: str | None = None):
        self.project_id = project_id
        # TODO: google-cloud-vision クライアントの初期化

    def recognize(self, image: np.ndarray, field_type: str = "text") -> OCRResult:
        """Cloud Vision APIでOCRを実行する。

        NOTE: 実装時は以下の手順:
        1. 画像をBase64エンコード
        2. vision.ImageAnnotatorClient.text_detection() を呼び出し
        3. 結果をパース
        """
        raise NotImplementedError(
            "Cloud Vision OCR is not implemented. "
            "Install google-cloud-vision and implement this method."
        )


class VertexAIOCRClient(BaseOCRClient):
    """Vertex AI (Gemini) を使ったOCRクライアント (未実装)"""

    def __init__(
        self,
        project_id: str | None = None,
        location: str = "us-central1",
        model_name: str = "gemini-1.5-flash",
    ):
        self.project_id = project_id
        self.location = location
        self.model_name = model_name
        # TODO: Vertex AI クライアントの初期化

    def recognize(self, image: np.ndarray, field_type: str = "text") -> OCRResult:
        """Vertex AI (Gemini) でOCRを実行する。

        NOTE: 実装時は以下の手順:
        1. 画像をBase64エンコード
        2. フィールドタイプに応じたプロンプトを生成
        3. Gemini API を呼び出し
        4. 結果をパース
        """
        raise NotImplementedError(
            "Vertex AI OCR is not implemented. "
            "Install google-cloud-aiplatform and implement this method."
        )


def create_ocr_client(
    client_type: str = "stub",
    **kwargs,
) -> BaseOCRClient:
    """OCRクライアントのファクトリ関数。

    Args:
        client_type: "stub", "cloud_vision", "vertex_ai"
        **kwargs: クライアント固有のパラメータ

    Returns:
        OCRクライアント
    """
    if client_type == "stub":
        return StubOCRClient(**kwargs)
    elif client_type == "cloud_vision":
        return CloudVisionOCRClient(**kwargs)
    elif client_type == "vertex_ai":
        return VertexAIOCRClient(**kwargs)
    else:
        raise ValueError(f"Unknown OCR client type: {client_type}")


def process_rois_with_ocr(
    roi_images: Dict[str, np.ndarray],
    roi_definitions: List[Any],  # List[ROIDefinition]
    ocr_client: BaseOCRClient,
) -> Dict[str, Dict[str, Any]]:
    """全ROIに対してOCRを実行する。

    Args:
        roi_images: {ROI名: 画像} の辞書
        roi_definitions: ROI定義のリスト
        ocr_client: OCRクライアント

    Returns:
        {ROI名: {text, confidence, type}} の辞書
    """
    results = {}

    # ROI定義から名前→タイプのマッピングを作成
    type_map = {roi.name: roi.field_type for roi in roi_definitions}

    for name, image in roi_images.items():
        field_type = type_map.get(name, "text")
        ocr_result = ocr_client.recognize(image, field_type=field_type)

        results[name] = {
            "text": ocr_result.text,
            "confidence": ocr_result.confidence,
            "type": field_type,
        }

    return results
