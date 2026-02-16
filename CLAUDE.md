# Claude Code プロジェクト設定

このファイルはClaude Codeがプロジェクトのコンテキストを理解し、適切なタイミングでskillを発動するための設定ファイルです。

## プロジェクト概要

- **種別**: Obsidian Knowledge Management System
- **構造**: PARA法 + Zettelkasten
- **主要機能**: 知識管理、プレゼンテーション資料生成

## Skill発動条件

### ntt-dxpartner-pptx

以下のキーワードや条件に該当する場合、`/ntt-dxpartner-pptx` skillを発動してください：

**発動トリガー**:
- 「スライド」「PPTX」「PowerPoint」「パワポ」の作成依頼
- 「NTTDX」「NTTDXパートナー」「DXパートナー」への言及
- 「企画書」「提案書」「報告書」の作成依頼
- 「プレゼン資料」「発表資料」の作成依頼
- 05_Output/Projects/ 配下での資料作成時

**発動例**:
- 「スライドを作成して」
- 「PPTXファイルを生成して」
- 「提案書を作って」
- 「プレゼン資料をまとめて」
- 「NTTDXパートナー様式で資料を作成」

**関連ファイル**:
- `generate-pptx-nttdx.cjs` - PPTX生成スクリプト
- `05_Output/Projects/@Active/NTTDX-*/` - NTTDXプロジェクト

## フォルダ構成

```
00_Memo/    - 何でも放り込む場所
01_Inbox/   - 整理済みmd
02_Daily/   - デイリーノート
03_Input/   - 短期記憶（今週〜今月）
04_Memory/  - 長期記憶（体系化知識）
05_Output/  - アウトプット管理（Projects/Areas）
06_Templates/ - テンプレート集
07_System/  - システム・設定
08_prompts/ - プロンプト集
99_Archive/ - アーカイブ
```

## 命名規則

- **フォルダ名**: 英語
- **ファイル名**: 日本語（ハイフン区切り）
- **デイリーノート**: `YYYY-MM-DD-Daily.md`
- **MOC**: `_カテゴリー-MOC.md`

## 注意事項

- ファイル操作後は適切な場所に配置
- プロジェクトファイルは `05_Output/Projects/` 配下に作成
- 生成したPPTXは該当プロジェクトの `02-materials/` フォルダに保存
