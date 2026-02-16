"""Google Gemini API client for data extraction."""

import base64
import os
import time

import google.generativeai as genai

from .base_client import BaseLLMClient, ExtractionResponse


class GeminiClient(BaseLLMClient):
    """Google Gemini APIクライアント"""

    provider = "gemini"

    # モデル別コスト（USD per million tokens）
    MODEL_COSTS = {
        "gemini-1.5-pro": {"input_per_million": 1.25, "output_per_million": 5.0},
        "gemini-1.5-flash": {"input_per_million": 0.075, "output_per_million": 0.30},
        "gemini-2.0-flash-exp": {"input_per_million": 0.0, "output_per_million": 0.0},
    }

    def __init__(self, api_key: str | None = None):
        """
        Args:
            api_key: Google APIキー（省略時は環境変数から取得）
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY is required")
        genai.configure(api_key=self.api_key)

    async def extract_from_images(
        self,
        images: list[dict],
        prompt: str,
        model: str = "gemini-1.5-pro",
    ) -> ExtractionResponse:
        """画像からデータを抽出

        Args:
            images: 画像データのリスト [{"base64": "...", "media_type": "image/png"}, ...]
            prompt: 抽出指示プロンプト
            model: 使用するモデル名

        Returns:
            ExtractionResponse: 抽出結果
        """
        # メッセージコンテンツを構築
        content = []

        # 画像を追加
        for img in images:
            image_data = base64.b64decode(img["base64"])
            content.append({
                "mime_type": img["media_type"],
                "data": image_data,
            })

        # プロンプトを追加
        content.append(prompt)

        start_time = time.time()

        try:
            model_instance = genai.GenerativeModel(model)
            response = model_instance.generate_content(content)

            latency_ms = (time.time() - start_time) * 1000

            # Gemini APIはトークン数を直接返さないため、概算を使用
            # 実際の実装では response.usage_metadata を確認
            input_tokens = 0
            output_tokens = 0

            if hasattr(response, "usage_metadata"):
                input_tokens = getattr(response.usage_metadata, "prompt_token_count", 0)
                output_tokens = getattr(
                    response.usage_metadata, "candidates_token_count", 0
                )

            return ExtractionResponse(
                raw_response=response.text,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                latency_ms=latency_ms,
                model=model,
                success=True,
            )

        except Exception as e:
            latency_ms = (time.time() - start_time) * 1000
            return ExtractionResponse(
                raw_response="",
                input_tokens=0,
                output_tokens=0,
                latency_ms=latency_ms,
                model=model,
                success=False,
                error=str(e),
            )

    def get_available_models(self) -> list[str]:
        """利用可能なモデル一覧を返す"""
        return list(self.MODEL_COSTS.keys())

    def get_model_cost(self, model: str) -> dict[str, float]:
        """モデルのコスト情報を返す"""
        return self.MODEL_COSTS.get(
            model, {"input_per_million": 0.0, "output_per_million": 0.0}
        )
