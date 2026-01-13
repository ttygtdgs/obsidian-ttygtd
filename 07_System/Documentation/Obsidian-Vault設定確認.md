# Obsidian Vault設定確認ガイド

## 問題
Obsidianが別のフォルダを参照しているため、現在のフォルダの変更が反映されない

## 解決方法

### 方法1: 正しいVaultを開く（推奨）

1. **Obsidianを開く**
2. **メニューから**: `File` → `Open Vault`
3. **正しいフォルダを選択**:
   ```
   /Users/user/Desktop/obsidian-ttygtd
   ```
4. **または「Open folder as vault」を選択**して、上記のフォルダを選択

### 方法2: 現在開いているVaultを確認

1. **Obsidianの左下**に現在開いているVault名が表示されています
2. **Vault名をクリック**すると、Vaultの場所が表示されます
3. 正しいフォルダ（`obsidian-ttygtd`）が開かれているか確認

### 方法3: 新しいVaultとして開き直す

1. **Obsidianを開く**
2. **メニューから**: `File` → `Open Vault` → `Open folder as vault`
3. **フォルダを選択**: `/Users/user/Desktop/obsidian-ttygtd`
4. **「Open」をクリック**

## 確認方法

正しいVaultが開かれているか確認するには：

1. **HOMEダッシュボードを開く**:
   - クイックスイッチャー（`Cmd+O`）で「HOME」と入力
   - または、ファイルエクスプローラーで `07_System/Dashboards/🏠-HOME.md` を開く

2. **「📋 タスク管理」セクションが表示されるか確認**

3. **「全プロジェクトタスク管理カンバン」リンクをクリック**して、`All-Projects-Task-Management.md` が開けるか確認

## 現在のVaultの場所

**正しいVaultの場所**:
```
/Users/user/Desktop/obsidian-ttygtd
```

このフォルダには `.obsidian` フォルダが存在し、Obsidianの設定が保存されています。

## トラブルシューティング

### Vaultが開けない場合

1. **フォルダの権限を確認**
   ```bash
   ls -la /Users/user/Desktop/obsidian-ttygtd
   ```

2. **`.obsidian` フォルダが存在するか確認**
   ```bash
   ls -la /Users/user/Desktop/obsidian-ttygtd/.obsidian
   ```

3. **Obsidianを再起動**

### 複数のVaultが表示される場合

- 不要なVaultは「Remove vault」で削除できます
- 正しいVault（`obsidian-ttygtd`）だけを残してください

## 参考

- [[20251113_ObsidianのVaultとは何か]] - Vaultの詳細説明

