"""Claude API client for data extraction."""

import os
import time

import anthropic

from .base_client import BaseLLMClient, ExtractionResponse


class ClaudeClient(BaseLLMClient):
    """Anthropic Claude APIクライアント"""

    provider = "claude"

    # モデル別コスト（USD per million tokens）
    MODEL_COSTS = {
        "claude-opus-4-20250514": {"input_per_million": 15.0, "output_per_million": 75.0},
        "claude-sonnet-4-20250514": {"input_per_million": 3.0, "output_per_million": 15.0},
        "claude-3-5-sonnet-20241022": {"input_per_million": 3.0, "output_per_million": 15.0},
        "claude-3-5-haiku-20241022": {"input_per_million": 1.0, "output_per_million": 5.0},
    }

    def __init__(self, api_key: str | None = None):
        """
        Args:
            api_key: Anthropic APIキー（省略時は環境変数から取得）
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is required")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    async def extract_from_images(
        self,
        images: list[dict],
        prompt: str,
        model: str = "claude-sonnet-4-20250514",
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
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": img["media_type"],
                    "data": img["base64"],
                },
            })

        # プロンプトを追加
        content.append({"type": "text", "text": prompt})

        start_time = time.time()

        try:
            response = self.client.messages.create(
                model=model,
                max_tokens=4096,
                messages=[{"role": "user", "content": content}],
            )

            latency_ms = (time.time() - start_time) * 1000

            return ExtractionResponse(
                raw_response=response.content[0].text,
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
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
