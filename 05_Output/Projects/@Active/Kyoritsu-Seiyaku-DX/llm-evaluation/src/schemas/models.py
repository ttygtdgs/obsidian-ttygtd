"""Pydantic models for LLM evaluation framework."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    """文書メタデータ"""

    document_date: str | None = Field(None, description="文書日付 (YYYY-MM-DD)")
    observer_name: str | None = Field(None, description="観察者名")
    facility_name: str | None = Field(None, description="施設名")


class AnimalRecord(BaseModel):
    """動物観察記録"""

    animal_id: str = Field(..., description="動物識別番号")
    observation_time: str | None = Field(None, description="観察時刻 (HH:MM)")
    body_temperature: float | None = Field(None, description="体温（℃）")
    body_weight: float | None = Field(None, description="体重（kg）")
    appetite: str | None = Field(None, description="食欲")
    activity_level: str | None = Field(None, description="元気・活動レベル")
    feces_status: str | None = Field(None, description="糞便状態")
    dehydration: bool | None = Field(None, description="脱水の有無")
    vomiting: bool | None = Field(None, description="嘔吐の有無")
    nasal_discharge: bool | None = Field(None, description="鼻汁の有無")
    lacrimation: bool | None = Field(None, description="流涙の有無")
    eye_discharge: bool | None = Field(None, description="眼脂の有無")
    coughing: bool | None = Field(None, description="発咳の有無")
    sneezing: bool | None = Field(None, description="くしゃみの有無")
    abnormal_respiratory_sounds: bool | None = Field(None, description="呼吸音異常の有無")
    notes: str | None = Field(None, description="備考・特記事項")


class ExtractionResult(BaseModel):
    """LLMによる抽出結果"""

    metadata: DocumentMetadata | None = None
    records: list[AnimalRecord] = Field(default_factory=list)


class PerformanceMetrics(BaseModel):
    """パフォーマンスメトリクス"""

    latency_ms: float = Field(..., description="応答時間（ミリ秒）")
    input_tokens: int = Field(..., description="入力トークン数")
    output_tokens: int = Field(..., description="出力トークン数")
    estimated_cost_usd: float = Field(..., description="推定コスト（USD）")


class AccuracyMetrics(BaseModel):
    """精度メトリクス"""

    overall_accuracy: float = Field(..., description="全体正解率")
    field_accuracies: dict[str, float] = Field(
        default_factory=dict, description="フィールド別正解率"
    )
    precision: float = Field(..., description="適合率")
    recall: float = Field(..., description="再現率")
    f1_score: float = Field(..., description="F1スコア")
    json_valid: bool = Field(..., description="JSON構文が有効か")
    schema_valid: bool = Field(..., description="スキーマに準拠しているか")


class ModelResult(BaseModel):
    """モデル別評価結果"""

    model_name: str = Field(..., description="モデル名")
    model_version: str = Field(..., description="モデルバージョン")
    provider: str = Field(..., description="プロバイダー（claude/openai/gemini）")
    extraction_result: ExtractionResult | None = None
    raw_response: str | None = Field(None, description="生のLLM応答")
    metrics: AccuracyMetrics | None = None
    performance: PerformanceMetrics | None = None
    error: str | None = Field(None, description="エラーメッセージ（失敗時）")


class EvaluationResult(BaseModel):
    """評価全体の結果"""

    evaluation_id: str = Field(..., description="評価ID")
    timestamp: datetime = Field(default_factory=datetime.now)
    pdf_file: str = Field(..., description="評価対象PDFファイル名")
    ground_truth_file: str | None = Field(None, description="正解データファイル名")
    model_results: list[ModelResult] = Field(default_factory=list)
    comparison_summary: dict[str, Any] | None = None
