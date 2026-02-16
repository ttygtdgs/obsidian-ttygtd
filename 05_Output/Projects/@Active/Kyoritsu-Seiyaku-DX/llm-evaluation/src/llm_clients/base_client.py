"""Base class for LLM clients."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class ExtractionResponse:
    """LLM抽出レスポンス"""

    raw_response: str
    input_tokens: int
    output_tokens: int
    latency_ms: float
    model: str
    success: bool
    error: str | None = None


class BaseLLMClient(ABC):
    """LLMクライアントの抽象基底クラス"""

    provider: str = "base"

    @abstractmethod
    async def extract_from_images(
        self,
        images: list[dict],
        prompt: str,
        model: str,
    ) -> ExtractionResponse:
        """画像からデータを抽出

        Args:
            images: 画像データのリスト [{"base64": "...", "media_type": "image/png"}, ...]
            prompt: 抽出指示プロンプト
            model: 使用するモデル名

        Returns:
            ExtractionResponse: 抽出結果
        """
        pass

    @abstractmethod
    def get_available_models(self) -> list[str]:
        """利用可能なモデル一覧を返す"""
        pass

    @abstractmethod
    def get_model_cost(self, model: str) -> dict[str, float]:
        """モデルのコスト情報を返す

        Returns:
            {"input_per_million": float, "output_per_million": float}
        """
        pass

    def calculate_cost(
        self, model: str, input_tokens: int, output_tokens: int
    ) -> float:
        """APIコストを計算

        Args:
            model: モデル名
            input_tokens: 入力トークン数
            output_tokens: 出力トークン数

        Returns:
            推定コスト（USD）
        """
        costs = self.get_model_cost(model)
        input_cost = (input_tokens / 1_000_000) * costs["input_per_million"]
        output_cost = (output_tokens / 1_000_000) * costs["output_per_million"]
        return input_cost + output_cost
