"""Main entry point for LLM evaluation CLI."""

import asyncio
import json
from datetime import datetime
from pathlib import Path
from uuid import uuid4

import typer
from dotenv import load_dotenv
from tabulate import tabulate

from .evaluator import calculate_metrics, parse_llm_response, validate_json_response
from .llm_clients import ClaudeClient, GeminiClient, OpenAIClient
from .pdf_processor import process_pdf
from .schemas import (
    AccuracyMetrics,
    EvaluationResult,
    ExtractionResult,
    ModelResult,
    PerformanceMetrics,
)

# 環境変数読み込み
load_dotenv()

app = typer.Typer(help="LLM Evaluation Framework for PDF data extraction")

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent


def load_prompt() -> str:
    """抽出プロンプトを読み込む"""
    prompt_path = PROJECT_ROOT / "config" / "prompts" / "extraction_prompt.txt"
    return prompt_path.read_text(encoding="utf-8")


def load_ground_truth(gt_path: Path) -> ExtractionResult | None:
    """正解データを読み込む"""
    if not gt_path.exists():
        return None
    data = json.loads(gt_path.read_text(encoding="utf-8"))
    return ExtractionResult.model_validate(data)


async def run_extraction(
    pdf_path: Path,
    models: list[str],
    prompt: str,
) -> list[ModelResult]:
    """指定モデルで抽出を実行"""
    # PDF処理
    images = process_pdf(pdf_path)
    image_data = [{"base64": img["base64"], "media_type": img["media_type"]} for img in images]

    results = []

    for model in models:
        typer.echo(f"  Running {model}...")

        # プロバイダー判定
        if model.startswith("claude"):
            client = ClaudeClient()
            provider = "claude"
        elif model.startswith("gpt"):
            client = OpenAIClient()
            provider = "openai"
        elif model.startswith("gemini"):
            client = GeminiClient()
            provider = "gemini"
        else:
            typer.echo(f"    Unknown model: {model}, skipping")
            continue

        # 抽出実行
        response = await client.extract_from_images(image_data, prompt, model)

        if not response.success:
            results.append(
                ModelResult(
                    model_name=model,
                    model_version=model,
                    provider=provider,
                    raw_response=response.raw_response,
                    error=response.error,
                )
            )
            continue

        # コスト計算
        cost = client.calculate_cost(model, response.input_tokens, response.output_tokens)

        # パフォーマンスメトリクス
        performance = PerformanceMetrics(
            latency_ms=response.latency_ms,
            input_tokens=response.input_tokens,
            output_tokens=response.output_tokens,
            estimated_cost_usd=cost,
        )

        # 抽出結果パース
        extraction = parse_llm_response(response.raw_response)

        results.append(
            ModelResult(
                model_name=model,
                model_version=model,
                provider=provider,
                extraction_result=extraction,
                raw_response=response.raw_response,
                performance=performance,
            )
        )

    return results


@app.command()
def extract(
    pdf_path: Path = typer.Argument(..., help="評価対象のPDFファイルパス"),
    models: str = typer.Option(
        "claude-sonnet-4-20250514",
        "--models",
        "-m",
        help="使用するモデル（カンマ区切り）",
    ),
    output_dir: Path = typer.Option(
        None,
        "--output",
        "-o",
        help="出力ディレクトリ（省略時: output/extractions）",
    ),
):
    """PDFからデータを抽出（評価なし）"""
    if not pdf_path.exists():
        typer.echo(f"Error: PDF file not found: {pdf_path}")
        raise typer.Exit(1)

    model_list = [m.strip() for m in models.split(",")]
    prompt = load_prompt()

    typer.echo(f"Extracting from: {pdf_path}")
    typer.echo(f"Models: {model_list}")

    # 抽出実行
    results = asyncio.run(run_extraction(pdf_path, model_list, prompt))

    # 出力
    output_dir = output_dir or PROJECT_ROOT / "output" / "extractions"
    output_dir.mkdir(parents=True, exist_ok=True)

    for result in results:
        if result.extraction_result:
            output_file = output_dir / f"{pdf_path.stem}_{result.model_name}.json"
            output_file.write_text(
                result.extraction_result.model_dump_json(indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            typer.echo(f"  Saved: {output_file}")
        else:
            typer.echo(f"  {result.model_name}: Extraction failed - {result.error}")


@app.command()
def evaluate(
    pdf_path: Path = typer.Argument(..., help="評価対象のPDFファイルパス"),
    ground_truth: Path = typer.Option(
        None,
        "--ground-truth",
        "-g",
        help="正解データファイル（省略時: ground_truth/data/{pdf_name}.json）",
    ),
    models: str = typer.Option(
        "claude-sonnet-4-20250514,gpt-4o,gemini-1.5-pro",
        "--models",
        "-m",
        help="評価するモデル（カンマ区切り）",
    ),
    output_dir: Path = typer.Option(
        None,
        "--output",
        "-o",
        help="出力ディレクトリ（省略時: output/evaluations）",
    ),
):
    """PDFからデータを抽出し、正解データと比較して評価"""
    if not pdf_path.exists():
        typer.echo(f"Error: PDF file not found: {pdf_path}")
        raise typer.Exit(1)

    # 正解データ読み込み
    gt_path = ground_truth or PROJECT_ROOT / "ground_truth" / "data" / f"{pdf_path.stem}.json"
    gt_data = load_ground_truth(gt_path)

    if gt_data is None:
        typer.echo(f"Warning: Ground truth not found: {gt_path}")
        typer.echo("  Running extraction only (no evaluation)")

    model_list = [m.strip() for m in models.split(",")]
    prompt = load_prompt()

    typer.echo(f"Evaluating: {pdf_path}")
    typer.echo(f"Models: {model_list}")

    # 抽出実行
    results = asyncio.run(run_extraction(pdf_path, model_list, prompt))

    # 評価実行（正解データがある場合）
    if gt_data:
        for result in results:
            if result.extraction_result:
                metrics = calculate_metrics(result.extraction_result, gt_data)
                result.metrics = metrics

    # 評価結果作成
    evaluation = EvaluationResult(
        evaluation_id=str(uuid4())[:8],
        timestamp=datetime.now(),
        pdf_file=str(pdf_path),
        ground_truth_file=str(gt_path) if gt_data else None,
        model_results=results,
    )

    # 結果表示
    display_results(evaluation)

    # 保存
    output_dir = output_dir or PROJECT_ROOT / "output" / "evaluations"
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = output_dir / f"evaluation_{timestamp}.json"
    output_file.write_text(
        evaluation.model_dump_json(indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    typer.echo(f"\nSaved: {output_file}")


def display_results(evaluation: EvaluationResult):
    """評価結果を表示"""
    typer.echo("\n" + "=" * 60)
    typer.echo("EVALUATION RESULTS")
    typer.echo("=" * 60)

    # パフォーマンス比較
    perf_data = []
    for r in evaluation.model_results:
        if r.performance:
            perf_data.append([
                r.model_name,
                f"{r.performance.latency_ms:.0f}ms",
                r.performance.input_tokens,
                r.performance.output_tokens,
                f"${r.performance.estimated_cost_usd:.4f}",
            ])
        else:
            perf_data.append([r.model_name, "N/A", "N/A", "N/A", "N/A"])

    typer.echo("\n## Performance")
    typer.echo(
        tabulate(
            perf_data,
            headers=["Model", "Latency", "Input Tokens", "Output Tokens", "Cost"],
            tablefmt="github",
        )
    )

    # 精度比較（正解データがある場合）
    has_metrics = any(r.metrics for r in evaluation.model_results)
    if has_metrics:
        acc_data = []
        for r in evaluation.model_results:
            if r.metrics:
                acc_data.append([
                    r.model_name,
                    f"{r.metrics.overall_accuracy:.1%}",
                    f"{r.metrics.precision:.2f}",
                    f"{r.metrics.recall:.2f}",
                    f"{r.metrics.f1_score:.2f}",
                ])
            else:
                acc_data.append([r.model_name, "N/A", "N/A", "N/A", "N/A"])

        typer.echo("\n## Accuracy")
        typer.echo(
            tabulate(
                acc_data,
                headers=["Model", "Overall", "Precision", "Recall", "F1"],
                tablefmt="github",
            )
        )


@app.command()
def list_models():
    """利用可能なモデル一覧を表示"""
    typer.echo("Available Models:\n")

    try:
        claude = ClaudeClient()
        typer.echo("Claude:")
        for model in claude.get_available_models():
            cost = claude.get_model_cost(model)
            typer.echo(
                f"  - {model} (${cost['input_per_million']}/M in, ${cost['output_per_million']}/M out)"
            )
    except ValueError:
        typer.echo("Claude: API key not configured")

    typer.echo()

    try:
        openai = OpenAIClient()
        typer.echo("OpenAI:")
        for model in openai.get_available_models():
            cost = openai.get_model_cost(model)
            typer.echo(
                f"  - {model} (${cost['input_per_million']}/M in, ${cost['output_per_million']}/M out)"
            )
    except ValueError:
        typer.echo("OpenAI: API key not configured")

    typer.echo()

    try:
        gemini = GeminiClient()
        typer.echo("Gemini:")
        for model in gemini.get_available_models():
            cost = gemini.get_model_cost(model)
            typer.echo(
                f"  - {model} (${cost['input_per_million']}/M in, ${cost['output_per_million']}/M out)"
            )
    except ValueError:
        typer.echo("Gemini: API key not configured")


if __name__ == "__main__":
    app()
