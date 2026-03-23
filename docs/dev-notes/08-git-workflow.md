# 08 — Git / PR / 部署流程指南

## 基本觀念

```
你的電腦 (localhost)
    │ git push
    ▼
GitHub (遠端儲存庫)
    │ 自動偵測 main 分支
    ▼
Zeabur (正式網站部署)
```

## 常用 Git 指令

### 查看狀態

```bash
# 看目前哪些檔案有修改
git status

# 看修改的內容差異
git diff

# 看最近的 commit 記錄
git log --oneline -5
```

### 提交修改

```bash
# 1. 加入要提交的檔案（指定檔案名）
git add 檔案1 檔案2 檔案3

# 2. 建立 commit（附上說明）
git commit -m "說明這次修改了什麼"

# 3. 推送到 GitHub
git push origin main
```

### 如果想用分支 + PR（較安全的方式）

```bash
# 1. 建立新分支
git checkout -b feat/新功能名稱

# 2. 修改程式碼...

# 3. 加入並提交
git add ...
git commit -m "feat: 描述"

# 4. 推送分支到 GitHub
git push -u origin feat/新功能名稱

# 5. 建立 Pull Request
gh pr create --title "標題" --body "說明"

# 6. 確認沒問題後合併
gh pr merge 編號

# 7. 切回 main 分支
git checkout main
git pull
```

## Commit 訊息格式

建議使用以下前綴：

| 前綴 | 用途 | 範例 |
|------|------|------|
| `feat:` | 新功能 | `feat: 新增課程頁面` |
| `fix:` | 修復問題 | `fix: 修復圖片過期破圖` |
| `perf:` | 效能優化 | `perf: 全站圖片自動壓縮` |
| `docs:` | 文件更新 | `docs: 新增開發筆記` |
| `style:` | 樣式調整 | `style: 調整卡片間距` |
| `refactor:` | 重構 | `refactor: 整理圖片處理邏輯` |

## 部署流程（Zeabur）

1. **推送到 main 分支** → Zeabur 自動偵測並開始部署
2. 部署過程約 2-5 分鐘
3. 部署完成後，訪問 `www.choosehill.com` 確認
4. ISR 頁面可能需要第一次訪問才會重新產生

### 確認部署狀態

- 到 Zeabur Dashboard 查看部署進度
- 或直接訪問網站確認新功能是否上線

## 直接推 main vs 開 PR？

| 方式 | 適用情境 |
|------|---------|
| 直接推 main | 小改動、已確認正確、快速修復 |
| 開 PR | 大功能、不確定的改動、需要紀錄 |

## 注意事項

- **不要推送 `.env.local`**（內含 API Token）
- 推送前先 `git status` 確認要提交的檔案
- 遇到衝突不要慌，可以用 `git stash` 暫存修改
