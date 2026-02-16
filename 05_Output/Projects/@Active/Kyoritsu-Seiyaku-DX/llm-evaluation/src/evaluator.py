"""Evaluation logic for comparing LLM extraction results with ground truth."""

import json
import re
import unicodedata
from typing import Any

from .schemas import AccuracyMetrics, AnimalRecord, ExtractionResult


def normalize_string(s: str | None) -> str | None:
    """文字列を正規化（空白除去、全角半角統一）"""
    if s is None:
        return None
    # 全角→半角（数字、アルファベット）
    s = unicodedata.normalize("NFKC", s)
    # 前後の空白除去
    s = s.strip()
    # 連続する空白を単一スペースに
    s = re.sub(r"\s+", " ", s)
    return s if s else None


def compare_values(
    extracted: Any,
    ground_truth: Any,
    field_type: str,
    numeric_tolerance: float = 0.1,
) -> bool:
    """フィールド値を比較

    Args:
        extracted: 抽出された値
        ground_truth: 正解値
        field_type: フィールドタイプ（string, number, boolean）
        numeric_tolerance: 数値の許容誤差

    Returns:
        一致すればTrue
    """
    # 両方nullならTrue
    if ground_truth is None and extracted is None:
        return True

    # 片方だけnullならFalse
    if ground_truth is None or extracted is None:
        return False

    if field_type == "string":
        return normalize_string(str(extracted)) == normalize_string(str(ground_truth))

    elif field_type == "number":
        try:
            ext_val = float(extracted)
            gt_val = float(ground_truth)
            return abs(ext_val - gt_val) <= numeric_tolerance
        except (ValueError, TypeError):
            return False

    elif field_type == "boolean":
        return bool(extracted) == bool(ground_truth)

    return extracted == ground_truth


# フィールドタイプのマッピング
FIELD_TYPES = {
    "animal_id": "string",
    "observation_time": "string",
    "body_temperature": "number",
    "body_weight": "number",
    "appetite": "string",
    "activity_level": "string",
    "feces_status": "string",
    "dehydration": "boolean",
    "vomiting": "boolean",
    "nasal_discharge": "boolean",
    "lacrimation": "boolean",
    "eye_discharge": "boolean",
    "coughing": "boolean",
    "sneezing": "boolean",
    "abnormal_respiratory_sounds": "boolean",
    "notes": "string",
}


def evaluate_record(
    extracted: AnimalRecord,
    ground_truth: AnimalRecord,
    numeric_tolerance: float = 0.1,
) -> dict[str, bool]:
    """単一レコードの評価

    Args:
        extracted: 抽出されたレコード
        ground_truth: 正解レコード
        numeric_tolerance: 数値の許容誤差

    Returns:
        フィールド別の正誤辞書
    """
    results = {}

    for field, field_type in FIELD_TYPES.items():
        ext_val = getattr(extracted, field, None)
        gt_val = getattr(ground_truth, field, None)
        results[field] = compare_values(ext_val, gt_val, field_type, numeric_tolerance)

    return results


def match_records(
    extracted_records: list[AnimalRecord],
    ground_truth_records: list[AnimalRecord],
) -> list[tuple[AnimalRecord | None, AnimalRecord | None]]:
    """抽出レコードと正解レコードをマッチング

    animal_idをキーにしてマッチング。
    マッチしない場合はNoneとペアリング。

    Returns:
        (extracted, ground_truth) のタプルリスト
    """
    # 正解レコードをanimal_idでインデックス
    gt_by_id = {r.animal_id: r for r in ground_truth_records}
    ext_by_id = {r.animal_id: r for r in extracted_records}

    all_ids = set(gt_by_id.keys()) | set(ext_by_id.keys())

    pairs = []
    for animal_id in sorted(all_ids):
        ext = ext_by_id.get(animal_id)
        gt = gt_by_id.get(animal_id)
        pairs.append((ext, gt))

    return pairs


def calculate_metrics(
    extracted: ExtractionResult,
    ground_truth: ExtractionResult,
    numeric_tolerance: float = 0.1,
) -> AccuracyMetrics:
    """抽出結果と正解データを比較してメトリクスを計算

    Args:
        extracted: 抽出結果
        ground_truth: 正解データ
        numeric_tolerance: 数値の許容誤差

    Returns:
        AccuracyMetrics: 計算されたメトリクス
    """
    # レコードをマッチング
    pairs = match_records(extracted.records, ground_truth.records)

    # フィールド別の正解/不正解カウント
    field_correct: dict[str, int] = {f: 0 for f in FIELD_TYPES}
    field_total: dict[str, int] = {f: 0 for f in FIELD_TYPES}

    # TP, FP, FN カウント（レコード単位）
    tp = 0  # 正しくマッチしたレコード
    fp = 0  # 抽出されたが正解にないレコード
    fn = 0  # 正解にあるが抽出されなかったレコード

    for ext, gt in pairs:
        if ext is None and gt is not None:
            fn += 1
            continue
        if ext is not None and gt is None:
            fp += 1
            continue
        if ext is not None and gt is not None:
            tp += 1
            # フィールド別評価
            field_results = evaluate_record(ext, gt, numeric_tolerance)
            for field, correct in field_results.items():
                field_total[field] += 1
                if correct:
                    field_correct[field] += 1

    # フィールド別正解率
    field_accuracies = {}
    for field in FIELD_TYPES:
        if field_total[field] > 0:
            field_accuracies[field] = field_correct[field] / field_total[field]
        else:
            field_accuracies[field] = 0.0

    # 全体正解率
    total_correct = sum(field_correct.values())
    total_count = sum(field_total.values())
    overall_accuracy = total_correct / total_count if total_count > 0 else 0.0

    # Precision, Recall, F1
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1_score = (
        2 * precision * recall / (precision + recall)
        if (precision + recall) > 0
        else 0.0
    )

    return AccuracyMetrics(
        overall_accuracy=overall_accuracy,
        field_accuracies=field_accuracies,
        precision=precision,
        recall=recall,
        f1_score=f1_score,
        json_valid=True,  # この関数に到達した時点でJSONは有効
        schema_valid=True,  # Pydanticでパースできた時点でスキーマ有効
    )


def parse_llm_response(response: str) -> ExtractionResult | None:
    """LLMレスポンスをパースしてExtractionResultに変換

    Args:
        response: LLMの生レスポンス

    Returns:
        ExtractionResult または None（パース失敗時）
    """
    try:
        # JSONブロックを抽出（```json ... ``` 形式に対応）
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", response)
        if json_match:
            json_str = json_match.group(1).strip()
        else:
            # JSONブロックがない場合は全体をJSONとして扱う
            json_str = response.strip()

        data = json.loads(json_str)
        return ExtractionResult.model_validate(data)

    except (json.JSONDecodeError, ValueError):
        return None


def validate_json_response(response: str) -> tuple[bool, bool, str | None]:
    """LLMレスポンスのJSON有効性とスキーマ準拠を検証

    Args:
        response: LLMの生レスポンス

    Returns:
        (json_valid, schema_valid, error_message)
    """
    try:
        # JSONブロックを抽出
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", response)
        if json_match:
            json_str = json_match.group(1).strip()
        else:
            json_str = response.strip()

        # JSON構文チェック
        data = json.loads(json_str)

        # スキーマ検証（Pydanticでバリデーション）
        ExtractionResult.model_validate(data)

        return True, True, None

    except json.JSONDecodeError as e:
        return False, False, f"JSON parse error: {e}"

    except ValueError as e:
        return True, False, f"Schema validation error: {e}"
