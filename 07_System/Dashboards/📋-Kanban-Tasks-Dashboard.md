# 📋 Kanban Tasks Dashboard

## カンバン形式でタスクを表示

### 方法1: Kanbanプラグインを使う

1. **新規ノートを作成**
   - ファイル名: `プロジェクト名-タスク管理.md`
   - 場所: `05_Output/Projects/@Active/[プロジェクト名]/` など

2. **ファイルの先頭に以下を追加**:
```markdown
---
kanban-plugin: board
---
```

3. **カラムを作成**:
```markdown
## 📋 TODO
- [ ] タスク1
- [ ] タスク2

## 🚀 進行中
- [ ] タスク3

## ✅ 完了
- [x] タスク4
```

4. **カンバンビューに切り替え**
   - ノートを開いた状態で、右上の「カンバン」アイコンをクリック
   - または、コマンドパレット（`Cmd+P`）で「Kanban: Open board」を選択

### 方法2: Dataviewでカンバン風に表示

以下のコードをノートに貼り付けると、既存のタスクが自動的にカンバン形式で表示されます：

```dataview
TASK
FROM "05_Output/Projects/@Active"
WHERE !completed
GROUP BY status
SORT file.ctime DESC
```

### 方法3: プロジェクト別カンバン

各プロジェクトフォルダに `タスク管理.md` を作成し、そのプロジェクトのタスクをカンバン形式で管理：

```markdown
---
kanban-plugin: board
---

## 📋 TODO
- [ ] 要件定義
- [ ] 設計書作成

## 🚀 進行中
- [ ] 開発中

## ✅ 完了
- [x] 企画完了
```

## 既存のタスクをカンバンで表示する方法

### NTTDX案件のタスクをカンバン表示

```dataview
TASK
FROM "05_Output/Projects/@Active/NTTDX"
WHERE !completed
GROUP BY file.name
SORT file.ctime DESC
```

### 全プロジェクトのタスクをカンバン表示

```dataview
TASK
FROM "05_Output/Projects/@Active"
WHERE !completed
GROUP BY file.folder
SORT file.ctime DESC
```

## カンバンのカスタマイズ

### カラムの追加・削除
- カンバンビューで「+」ボタンをクリックしてカラムを追加
- カラム名を右クリックして削除

### カードの移動
- ドラッグ&ドロップでカラム間を移動
- カードをクリックして詳細を編集

### カラムの設定
- カラム名を右クリック → 「Column settings」で設定変更
- カラムの色、制限数などを設定可能

## 参考ファイル

- [[カンバンタスクがmdで作成可能]] - カンバンの実例
- [[🎯-Projects-Dashboard]] - プロジェクトダッシュボード

## 使い方のコツ

1. **プロジェクトごとにカンバンを作成**
   - 各プロジェクトフォルダに `タスク管理.md` を作成
   - プロジェクト固有のタスクを管理

2. **カラム名を統一**
   - TODO / 進行中 / 完了
   - または、プロジェクトのフェーズに合わせてカスタマイズ

3. **定期的に更新**
   - 週次レビューでカンバンを確認
   - 完了したタスクを移動

4. **リンクを活用**
   - カード内に `[[関連ノート]]` を追加
   - プロジェクトの詳細ノートと連携

