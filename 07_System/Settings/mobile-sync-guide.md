---
title: Obsidian スマホ連携ガイド
tags: [obsidian, mobile, sync, setup]
created: 2025-11-17
---

# 📱 Obsidian スマホ連携ガイド

**最終更新**: 2025-11-17

---

## 🎯 概要

Obsidianをスマートフォンと連携させることで、外出先でもメモを取ったり、ノートを確認したりできます。このガイドでは、最も簡単で確実な方法を紹介します。

---

## 📋 連携方法の比較

| 方法 | 費用 | 難易度 | 速度 | 推奨度 |
|------|------|--------|------|--------|
| **Obsidian Sync** | 有料（月額$10） | ⭐ 簡単 | ⭐⭐⭐ 高速 | ⭐⭐⭐⭐⭐ |
| **iCloud Drive** | 無料（5GB） | ⭐⭐ 普通 | ⭐⭐ 普通 | ⭐⭐⭐⭐ |
| **Dropbox** | 無料（2GB） | ⭐⭐ 普通 | ⭐⭐ 普通 | ⭐⭐⭐ |
| **Google Drive** | 無料（15GB） | ⭐⭐⭐ やや難 | ⭐⭐ 普通 | ⭐⭐ |
| **Obsidian Git** | 無料 | ⭐⭐⭐⭐ 難しい | ⭐ 遅い | ⭐ |

---

## ✅ 推奨方法1: Obsidian Sync（最も簡単・確実）

### メリット
- ✅ **公式サービス**で最も安定
- ✅ **エンドツーエンド暗号化**でセキュア
- ✅ **リアルタイム同期**が高速
- ✅ **設定が簡単**（5分で完了）
- ✅ **プラグイン設定も同期**される
- ✅ **バージョン履歴**が自動保存

### デメリット
- ❌ **有料**（月額$10、年額$96）
- ❌ 無料トライアルは14日間のみ

### セットアップ手順

#### ステップ1: Obsidian Syncに登録
1. デスクトップ版Obsidianを開く
2. 設定（⚙️）→ **Sync** を開く
3. 「Enable Sync」をクリック
4. Obsidianアカウントでログイン（なければ作成）
5. プランを選択（月額$10または年額$96）

#### ステップ2: デスクトップで同期を有効化
1. Sync設定で「Enable Sync」をON
2. 同期するVaultを選択（`obsidian-ttygtd`）
3. 「Sync now」をクリックして初回同期

#### ステップ3: スマホで同期を有効化
1. **iOS**: App Storeで「Obsidian」をインストール
2. **Android**: Google Playで「Obsidian」をインストール
3. アプリを起動
4. 「Open folder as vault」→「Sync with Obsidian Sync」
5. 同じObsidianアカウントでログイン
6. 同期されたVaultを選択

#### ステップ4: 確認
- デスクトップでノートを編集
- スマホで「Pull changes」を実行（または自動同期を待つ）
- 変更が反映されているか確認

### 料金
- **月額プラン**: $10/月
- **年額プラン**: $96/年（$8/月相当、20%割引）

---

## ✅ 推奨方法2: iCloud Drive（Mac + iPhoneユーザー向け）

### メリット
- ✅ **無料**（5GBまで、必要に応じて有料プラン）
- ✅ **MacとiPhoneの連携**が簡単
- ✅ **自動同期**が便利

### デメリット
- ❌ **Android非対応**
- ❌ 同期速度がObsidian Syncより遅い
- ❌ プラグイン設定は同期されない

### セットアップ手順

#### ステップ1: VaultをiCloud Driveに移動
1. **デスクトップで**:
   - Finderを開く
   - `~/Library/Mobile Documents/com~apple~CloudDocs/` に移動
   - または `~/iCloud Drive/` に移動
   - `obsidian-ttygtd`フォルダをここに移動（またはコピー）

2. **Obsidianで**:
   - 「Open another vault」→「Open folder as vault」
   - iCloud Drive内の`obsidian-ttygtd`を選択

#### ステップ2: iPhoneでVaultを開く
1. **Obsidianアプリをインストール**（App Store）
2. アプリを起動
3. 「Open folder as vault」→「iCloud Drive」
4. `obsidian-ttygtd`フォルダを選択

#### ステップ3: 同期確認
- Macでノートを編集
- iPhoneで「Pull changes」を実行
- 変更が反映されているか確認

### 注意事項
- ⚠️ **iCloud Driveの同期は自動**ですが、数秒〜数分かかる場合があります
- ⚠️ **両方のデバイスで同時に編集**すると競合する可能性があります
- ⚠️ **大きなファイル**（画像など）が多いと同期が遅くなります

---

## ✅ 方法3: Dropbox（Mac + 任意のスマホ）

### メリット
- ✅ **無料**（2GBまで）
- ✅ **Mac、iPhone、Androidすべて対応**
- ✅ 設定が比較的簡単

### デメリット
- ❌ 同期速度がObsidian Syncより遅い
- ❌ プラグイン設定は同期されない
- ❌ Dropboxアプリのインストールが必要

### セットアップ手順

#### ステップ1: Dropboxをインストール
1. [Dropbox公式サイト](https://www.dropbox.com/)からアプリをダウンロード
2. Macにインストールしてログイン

#### ステップ2: VaultをDropboxに移動
1. Finderで`~/Dropbox/`フォルダを開く
2. `obsidian-ttygtd`フォルダをここに移動（またはコピー）

3. **Obsidianで**:
   - 「Open another vault」→「Open folder as vault」
   - Dropbox内の`obsidian-ttygtd`を選択

#### ステップ3: スマホでVaultを開く
1. **Dropboxアプリをインストール**（App Store / Google Play）
2. **Obsidianアプリをインストール**
3. Obsidianアプリを起動
4. 「Open folder as vault」→「Files」→「Dropbox」
5. `obsidian-ttygtd`フォルダを選択

---

## 🔧 現在の設定確認

現在のシステムでは、**Obsidian Gitプラグイン**が設定されていますが、これは主に**バックアップ用**です。モバイルでの使いやすさを考えると、上記のクラウドストレージ同期を併用することをおすすめします。

### Git + クラウドストレージの併用
- **Git**: バックアップ・バージョン管理（デスクトップのみ）
- **クラウドストレージ**: モバイル同期

---

## 📱 モバイルでの使い方

### 基本操作
- **新規ノート作成**: 右下の「+」ボタン
- **検索**: 上部の検索バー
- **Dailyノート**: カレンダーアイコンから

### クイックメモ（00_Memo）
1. アプリを開く
2. 「+」→「New note」
3. ファイル名: `memo-YYYYMMDD-HHMM.md`（適当でOK）
4. 内容を入力
5. 保存

### Dailyノートの確認
1. カレンダーアイコンをタップ
2. 日付を選択
3. Dailyノートが開く

---

## ⚠️ トラブルシューティング

### 問題1: 同期されない

#### Obsidian Syncの場合
- デスクトップとスマホの両方で「Sync now」を実行
- インターネット接続を確認
- Obsidianアカウントが同じか確認

#### iCloud Driveの場合
- iCloud Driveの同期状況を確認（設定→Apple ID→iCloud）
- 「Pull changes」を手動実行
- しばらく待ってから再確認

### 問題2: 競合エラー

**原因**: 両方のデバイスで同時に編集した

**解決策**:
1. どちらかの変更を優先する
2. 競合ファイル（`.sync-conflict-*.md`）を確認
3. 必要な内容をマージして、競合ファイルを削除

### 問題3: プラグインが動作しない

**原因**: プラグイン設定はObsidian Syncでしか同期されない

**解決策**:
- Obsidian Syncを使用する
- または、各デバイスで手動設定

---

## 🎯 推奨設定

### モバイルでの推奨設定

#### 1. 自動同期の有効化
- Obsidian Sync: 自動（デフォルト）
- iCloud Drive: 自動（デフォルト）
- Dropbox: 自動（デフォルト）

#### 2. オフライン編集の有効化
- 設定 → Files & Links → 「Allow offline editing」をON

#### 3. バッテリー節約
- 設定 → Mobile → 「Reduce motion」をON
- 設定 → Mobile → 「Reduce animations」をON

---

## 💡 ベストプラクティス

### 1. 外出先でのメモ
- **00_Memo**に素早くメモ
- 後でデスクトップで整理

### 2. Dailyノートの確認
- 朝の通勤中に今日のTODOを確認
- 夜に振り返りを記入

### 3. プロジェクトの進捗確認
- 会議前にプロジェクトノートを確認
- メモを取って後で整理

### 4. 同期のタイミング
- **Obsidian Sync**: 自動同期（推奨）
- **iCloud/Dropbox**: 編集後に「Pull changes」を実行

---

## 📚 関連ドキュメント

- [[plugins-list.md]] - プラグイン一覧
- [[daily-workflow.md]] - デイリーワークフロー
- [[system-overview.md]] - システム概要

---

## 🔗 外部リソース

- [Obsidian Sync公式ページ](https://obsidian.md/sync)
- [Obsidian Mobile公式ガイド](https://help.obsidian.md/Mobile/Obsidian+Mobile)
- [iCloud Drive設定ガイド](https://support.apple.com/ja-jp/HT204025)

---

**最終更新**: 2025-11-17



