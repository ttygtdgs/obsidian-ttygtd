"""OpenAI API client for data extraction."""

import os
import time

import openai

from .base_client import BaseLLMClient, ExtractionResponse


class OpenAIClient(BaseLLMClient):
    """OpenAI APIクライアント"""

    provider = "openai"

    # モデル別コスト（USD per million tokens）
    MODEL_COSTS = {
        "gpt-4o": {"input_per_million": 5.0, "output_per_million": 15.0},
        "gpt-4o-mini": {"input_per_million": 0.15, "output_per_million": 0.60},
        "gpt-4-turbo": {"input_per_million": 10.0, "output_per_million": 30.0},
    }

    def __init__(self, api_key: str | None = None):
        """
        Args:
            api_key: OpenAI APIキー（省略時は環境変数から取得）
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is required")
        self.client = openai.OpenAI(api_key=self.api_key)

    async def extract_from_images(
        self,
        images: list[dict],
        prompt: str,
        model: str = "gpt-4o",
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
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{img['media_type']};base64,{img['base64']}",
                    "detail": "high",
                },
            })

        # プロンプトを追加
        content.append({"type": "text", "text": prompt})

        start_time = time.time()

        try:
            response = self.client.chat.completions.create(
                model=model,
                max_tokens=4096,
                messages=[{"role": "user", "content": content}],
            )

            latency_ms = (time.time() - start_time) * 1000

            return ExtractionResponse(
                raw_response=response.choices[0].message.content or "",
                input_tokens=response.usage.prompt_tokens if response.usage else 0,
                output_tokens=response.usage.completion_tokens if response.usage else 0,
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
