#!/usr/bin/env python3
"""Handwriting Extraction PoC - CLI Entry Point

固定帳票PDFから手書き部分を抽出し、ROIごとにOCR/分類してJSON出力する。

Usage:
    python -m src.main \\
        --input scan.pdf \\
        --template template.pdf \\
        --fields fields.json \\
        --output out/result.json \\
        --workdir out/work
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any

import click
import cv2

from .pdf_render import render_single_page, DEFAULT_DPI
from .align import align_scan_to_template
from .diff_mask import extract_handwriting_mask, apply_mask_to_image
from .roi import load_fields_json, extract_all_rois, visualize_rois, check_roi_has_content
from .ocr_clients import create_ocr_client, process_rois_with_ocr


@click.command()
@click.option(
    "--input", "-i",
    "input_pdf",
    type=click.Path(exists=True, path_type=Path),
    required=True,
    help="入力PDF (スキャン画像)",
)
@click.option(
    "--template", "-t",
    "template_pdf",
    type=click.Path(exists=True, path_type=Path),
    required=True,
    help="テンプレートPDF (印刷元)",
)
@click.option(
    "--fields", "-f",
    "fields_json",
    type=click.Path(exists=True, path_type=Path),
    required=True,
    help="フィールド定義JSON",
)
@click.option(
    "--output", "-o",
    "output_json",
    type=click.Path(path_type=Path),
    required=True,
    help="出力JSON",
)
@click.option(
    "--workdir", "-w",
    "work_dir",
    type=click.Path(path_type=Path),
    default=None,
    help="中間画像出力ディレクトリ",
)
@click.option(
    "--page", "-p",
    type=int,
    default=0,
    help="処理するページ番号 (0-indexed)",
)
@click.option(
    "--dpi",
    type=int,
    default=DEFAULT_DPI,
    help=f"PDF変換時のDPI (default: {DEFAULT_DPI})",
)
@click.option(
    "--threshold",
    type=int,
    default=30,
    help="差分検出の閾値 (default: 30)",
)
@click.option(
    "--ocr-client",
    type=click.Choice(["stub", "cloud_vision", "vertex_ai"]),
    default="stub",
    help="OCRクライアント (default: stub)",
)
@click.option(
    "--skip-ocr",
    is_flag=True,
    default=False,
    help="OCR処理をスキップする",
)
def main(
    input_pdf: Path,
    template_pdf: Path,
    fields_json: Path,
    output_json: Path,
    work_dir: Path | None,
    page: int,
    dpi: int,
    threshold: int,
    ocr_client: str,
    skip_ocr: bool,
):
    """手書き抽出PoCを実行する。"""

    print("=" * 60)
    print("Handwriting Extraction PoC")
    print("=" * 60)

    # 出力ディレクトリを作成
    output_json.parent.mkdir(parents=True, exist_ok=True)
    if work_dir:
        work_dir.mkdir(parents=True, exist_ok=True)

    # Step 1: PDF → 画像変換
    print(f"\n[1/6] Rendering PDFs to images (DPI={dpi})...")
    template_img = render_single_page(template_pdf, page_num=page, dpi=dpi)
    scan_img = render_single_page(input_pdf, page_num=page, dpi=dpi)

    if work_dir:
        cv2.imwrite(str(work_dir / "01_template.png"), template_img)
        cv2.imwrite(str(work_dir / "01_scan.png"), scan_img)
        print(f"  Saved: {work_dir}/01_template.png, 01_scan.png")

    print(f"  Template: {template_img.shape}")
    print(f"  Scan: {scan_img.shape}")

    # Step 2: テンプレート整列
    print(f"\n[2/6] Aligning scan to template...")
    try:
        aligned_img = align_scan_to_template(template_img, scan_img)
        if work_dir:
            cv2.imwrite(str(work_dir / "02_aligned.png"), aligned_img)
            print(f"  Saved: {work_dir}/02_aligned.png")
    except ValueError as e:
        print(f"  WARNING: Alignment failed: {e}")
        print("  Using original scan image without alignment")
        aligned_img = scan_img

    # Step 3: 差分抽出
    print(f"\n[3/6] Extracting handwriting mask (threshold={threshold})...")
    diff_img, mask = extract_handwriting_mask(
        template_img,
        aligned_img,
        threshold=threshold,
        output_dir=work_dir / "03_diff" if work_dir else None,
    )

    # マスク適用した画像
    masked_img = apply_mask_to_image(aligned_img, mask)
    if work_dir:
        cv2.imwrite(str(work_dir / "03_masked.png"), masked_img)

    # Step 4: ROI定義の読み込み
    print(f"\n[4/6] Loading ROI definitions from {fields_json}...")
    rois = load_fields_json(fields_json)
    print(f"  Loaded {len(rois)} ROI definitions")

    if work_dir:
        vis_img = visualize_rois(aligned_img, rois, work_dir / "04_roi_overlay.png")

    # Step 5: ROI切り出し
    print(f"\n[5/6] Extracting ROIs...")
    roi_images = extract_all_rois(
        masked_img,  # マスク適用後の画像からROIを切り出し
        rois,
        output_dir=work_dir / "05_rois" if work_dir else None,
    )

    # 各ROIに内容があるかチェック
    roi_has_content = {name: check_roi_has_content(img) for name, img in roi_images.items()}
    print(f"  ROIs with content: {sum(roi_has_content.values())}/{len(rois)}")

    # Step 6: OCR処理
    if skip_ocr:
        print(f"\n[6/6] Skipping OCR (--skip-ocr flag)")
        ocr_results = {}
    else:
        print(f"\n[6/6] Running OCR (client={ocr_client})...")
        client = create_ocr_client(ocr_client)
        ocr_results = process_rois_with_ocr(roi_images, rois, client)

    # 結果をJSON出力
    result = {
        "metadata": {
            "input_pdf": str(input_pdf),
            "template_pdf": str(template_pdf),
            "fields_json": str(fields_json),
            "page": page,
            "dpi": dpi,
            "threshold": threshold,
            "ocr_client": ocr_client,
        },
        "fields": {},
    }

    for roi in rois:
        field_result = {
            "type": roi.field_type,
            "bbox": roi.bbox,
            "has_content": roi_has_content.get(roi.name, False),
        }
        if roi.name in ocr_results:
            field_result.update(ocr_results[roi.name])
        result["fields"][roi.name] = field_result

    # JSON保存
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"Output saved to: {output_json}")
    if work_dir:
        print(f"Work files saved to: {work_dir}")
    print("=" * 60)

    return 0


if __name__ == "__main__":
    sys.exit(main())
