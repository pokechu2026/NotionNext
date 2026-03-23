# 01 — NotionNext 架構總覽

## 什麼是 NotionNext？

NotionNext 是一個用 **Next.js** 建構的部落格系統，以 **Notion** 作為 CMS（內容管理系統）。
你在 Notion 上寫文章、管理資料庫，網站就會自動抓取並顯示。

## 核心架構圖

```
Notion 頁面/資料庫
        │
        ▼
┌─────────────────────┐
│  資料取得層 (lib/db) │  ← getStaticProps 在 build 或 ISR 時執行
│  - notion-client     │  ← 非官方 API（文章、頁面內容）
│  - Official API      │  ← 官方 API（代表專案、課程）
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  頁面路由 (pages/)   │  ← Next.js Pages Router
│  - index.js          │  ← 首頁
│  - course/index.js   │  ← 課程總覽
│  - course/[id].js    │  ← 課程詳細頁
│  - portfolio/[id].js │  ← 代表專案詳細頁
│  - [prefix]/index.js │  ← 動態路由（分類、標籤等）
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  主題系統 (themes/)  │  ← DynamicLayout 動態載入
│  - proxio/           │  ← 目前使用的主題
│    - index.js        │  ← 匯出所有 Layout
│    - components/     │  ← 各元件（Hero、CoursePage 等）
│    - config.js       │  ← 主題設定
└─────────────────────┘
```

## 兩套 Notion API 的差異

| | 非官方 API (notion-client) | 官方 API (api.notion.com) |
|---|---|---|
| **套件** | `notion-client` | 直接 fetch |
| **用途** | 文章內容、頁面渲染 | 代表專案、課程資料庫 |
| **渲染** | `react-notion-x` 自動渲染 | 自訂元件手動渲染 |
| **認證** | `NOTION_ACCESS_TOKEN_V2`（cookie） | `NOTION_ACCESS_TOKEN`（integration key） |
| **優點** | 開箱即用，支援大部分區塊 | 穩定可控，可精確查詢 |
| **限制** | 不支援 dashboard 視圖、button 區塊 | 需自己寫渲染邏輯 |

## 主題系統運作方式

```
pages/course/index.js
  → getStaticProps() 取得資料
  → <DynamicLayout theme="proxio" layoutName="LayoutCourse" />
     → 載入 themes/proxio/index.js 中的 LayoutCourse
        → 包在 LayoutBase 裡（提供 Header + Footer）
           → 渲染 CoursePage 元件
```

### 新增頁面的標準流程

1. **建立頁面路由**: `pages/xxx/index.js`
2. **建立資料取得**: `lib/db/notion/fetchXxx.js`
3. **建立元件**: `themes/proxio/components/XxxPage.js`
4. **註冊 Layout**: 在 `themes/proxio/index.js` 新增 `LayoutXxx`
5. **匯出**: 加入 `module.exports`

## ISR（增量靜態再生）

網站使用 `getStaticProps` + `revalidate` 設定：
- 頁面在 build 時預先產生靜態 HTML
- 訪客瀏覽時，如果超過 `revalidate` 秒數，背景重新產生頁面
- 新資料會在下一次訪問時生效

```js
return {
  props,
  revalidate: 300 // 每 5 分鐘重新產生
}
```

## 關鍵設定檔

| 檔案 | 用途 |
|------|------|
| `blog.config.js` | 全站設定（標題、語言、Notion 頁面 ID） |
| `conf/image.config.js` | 圖片相關設定（壓縮寬度、Notion Host） |
| `themes/proxio/config.js` | 主題專屬設定（Hero 影片、Shader、Portfolio DB） |
| `.env.local` | 環境變數（API Token，不進 Git） |
