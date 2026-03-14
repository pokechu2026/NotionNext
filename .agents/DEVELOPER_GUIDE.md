---
description: Choosehill AI (NotionNext Proxio) 網站開發與維護指南
---

# Choosehill AI 網站開發指南 (NotionNext - Proxio 主題)

這份文件記錄了本專案的架構特性、常見錯誤原因，以及標準的「本地優先」開發流程。後續接手的開發者或 AI 助手（IDE）請務必遵循此流程，以避免線上網站崩潰。

## ⚠️ 核心架構與脆弱點分析

本專案基於 **NotionNext (Next.js)** 框架，並深度依賴 Notion API 獲取內容。

### 為什麼之前會發生「白畫面 (Blank Page/White Screen)」？

1. **React Hydration Error (水合錯誤)**：
   NotionNext 的 `Proxio` 主題在 SSR (Server-Side Rendering) 和 Client 端的 DOM 結構對齊上原有潛在的脆弱性。當我們大規模替換 `themes/proxio/config.js` 的設定值時（例如大幅度增減字數、啟用/停用某個區塊），會導致伺服器產生的 HTML 與瀏覽器端 React 預期的結構不一致，從而引發 Hydration 崩潰。
2. **Hook 順序錯誤 (Hook Order Warning)**：
   如果你透過 `config.js` 的 true/false 開關直接移除了某個 React Component，而該 Component 內包含 React Hooks，動態的 conditionally rendering 可能會打破 Hooks 的調用順序，導致整個頁面直接白畫面。
3. **Zeabur 環境變量優先級**：
   網站部署在 Zeabur，Zeabur 上的「環境變量」優先級**大於**原始碼的 `blog.config.js`。例如 `NOTION_PAGE_ID` 必須在 Zeabur 後台設定才有效。

---

## 🚀 標準開發作業流程 (SOP)

為了徹底避免直接 push 後導致線上網站崩潰，所有修改**必須**遵循以下「本地優先」的開發循環：

### 步驟 1：啟動本地伺服器
在專案根目錄執行：
```bash
npm run dev
```
這會在 `http://localhost:3001` (或 3000) 啟動本地預覽環境。

### 步驟 2：進行小批量修改
**絕對不要一次性大幅度修改 `config.js`。**
例如，如果要改 Hero 區塊和 FAQ 區塊，請分成兩次動作：
1. 修改 Hero 區文字。
2. 存檔。

### 步驟 3：本地即時預覽與測試 (Local Validation)
1. 打開瀏覽器訪問 `http://localhost:3001`。
2. 確認修改已生效。
3. **最重要**：按下 `F12` 打開開發者工具的 Console (控制台)，**確認沒有紅色的 React Error**。
4. 點擊頁面互動，確認沒有白畫面。

### 步驟 4：版本控制與推播 (Commit & Push)
本地確認 100% 沒問題後，才能提交程式碼並推播至 GitHub：
```bash
git add .
git commit -m "feat: 更新 xxx 區塊內容"
git push origin main
```

### 步驟 5：線上監控 (Zeabur)
推播後，Zeabur 會自動偵測並重新部署（約需 1-3 分鐘）。
部署完成後，到正式網址 `https://www.choosehill.com`，使用**強制重新整理 (Cmd+Shift+R 或 Ctrl+F5)** 確認線上版本是否正常。

---

## 📝 專案重要位置對照表

如果你想修改...

| 修改目標 | 應該去哪裡改？ |
|----------|---------------|
| **網站標題、按鈕、服務介紹、Footer** | 修改 `themes/proxio/config.js` (透過程式碼) |
| **全站設定 (作者名、SEO 關鍵字、語言)** | 修改 `blog.config.js` (透過程式碼) |
| **最新文章版位、新增文章、修改關於我頁面內容** | 直接去 **Notion 資料庫** 新增/編輯頁面 (免改程式碼) |
| **更換 Favicon (網站 icon)** | 替換 `/public/images/choosehill/favicon.ico` |
| **Notion 綁定、Zeabur 域名設定** | 直接去 Zeabur 的「環境變量」和「域名」設定介面 |

---

## 💡 AI 助手 (IDE) 交接提示

*   **When modifying config.js**: Make small, incremental changes rather than replacing the entire file. The Proxio theme is highly sensitive to structure changes.
*   **Always Verify Locally**: Use the `default_api:run_command` to start `# npm run dev` if it's not running, and instruct the user to verify at `http://localhost:3001` *before* issuing any `git push` commands.
*   **Handle White Screens**: If the user reports a white screen after a config change, it is almost certainly a React Hydration or Hook error. Do not try to fix the JS logic deep inside the theme components. Instead, revert the `config.js` changes via git, and try applying the text changes more conservatively.
