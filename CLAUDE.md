# Choosehill 選擇之丘 AI — 專案說明

## 專案概述
這是 Chase（趙建翔）的個人品牌網站，使用 NotionNext 架構（Next.js 14 + Notion 作為 CMS），部署在 Zeabur。

## 技術棧
- **框架**: Next.js 14 (Pages Router)
- **CMS**: Notion（同時使用 unofficial API + Official API）
- **主題**: proxio（`themes/proxio/`）
- **部署**: Zeabur（push main 自動部署）
- **網域**: choosehill.com / www.choosehill.com

## 關鍵架構

### 兩套 Notion API
| API | 用途 | 圖片壓縮方式 |
|-----|------|-------------|
| Unofficial (`notion-client`) | 文章頁、首頁部落格 | Notion proxy + `compressImage()` |
| Official (`api.notion.com/v1`) | 課程頁、代表專案頁 | Next.js Image (`NotionImage` 元件) |

### 自訂頁面（Official API）
- `/course` — 課程總覽（`pages/course/index.js`）
- `/course/[id]` — 課程詳細頁（`pages/course/[id].js`）
- `/portfolio` — 代表專案列表（走 `[prefix]/index.js` 動態路由）
- `/portfolio/[id]` — 代表專案詳細頁

### 重要的資料抓取檔案
- `lib/db/notion/fetchCourses.js` — 課程 DB 查詢 + 縮圖抓取
- `lib/db/notion/fetchPortfolio.js` — 代表專案 DB 查詢 + 縮圖抓取
- `lib/db/notion/notionImgProxy.js` — 圖片代理（目前直通模式）

### 圖片處理
- 文章頁用 `LazyImage` 元件（客戶端 lazy load）
- 課程/專案用 `NotionImage` 元件（Next.js Image 伺服端壓縮 WebP/AVIF）
- `notion.so/image/` 代理**不支援** Official API 的 `prod-files-secure` URL

## 環境變數
```
NOTION_ACCESS_TOKEN=secret_xxx  # Official API Integration Key
```

## 常用指令
```bash
yarn dev          # 本地開發 (localhost:3000)
yarn build        # 正式建置
git push origin main  # 推送並觸發 Zeabur 自動部署
```

## 開發筆記
詳細的開發歷程、問題解決方案請參考 `docs/dev-notes/` 資料夾（共 10 份文件）。

## 與 Chase 溝通注意事項
- Chase 對程式不熟，請用**白話文**解釋技術概念
- 修改完成後說明「改了什麼」和「為什麼這樣改」
- 重要操作前先確認，不要自作主張
- 用繁體中文溝通
