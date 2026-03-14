# Multi-Agent 協作規範

## 日誌規則

1. **開始任務前**：讀取 `.agents/logs/SUMMARY.md` 確認其他 agent 已修改的檔案
2. **完成任務後**：
   - 建立 `.agents/logs/{agent}-{YYYYMMDD}-{task}.md` 記錄異動
   - 在 `SUMMARY.md` **底部追加一行**（不修改既有行）
3. **命名格式**：`{agent名稱}-{日期}-{任務關鍵字}.md`

## 檔案修改規則

1. **修改前先讀取**：任何要修改的檔案，先 `cat` 或 read 確認當前內容
2. **不搶佔檔案**：如果 SUMMARY 顯示某檔案近期被其他 agent 修改，主動告知使用者
3. **日誌中列出「未修改」清單**：讓其他 agent 知道哪些檔案可安全操作

## Git 規則

1. **不主動 commit/push**：除非使用者明確指示
2. **不做 destructive 操作**：不 reset、不 force push、不刪分支
3. **一次只由一個 agent 執行 git 操作**

## siteConfig / Hook 規則（NotionNext 專案特有）

1. 所有 `siteConfig()` 呼叫必須在元件頂部，在任何 early return 之前
2. 不修改主資料庫 ID `105026255e6b83258d2781343b4c69f7`
3. 修改 `config.js` 或 `blog.config.js` 前必須先讀取當前內容
