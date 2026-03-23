# 10 — 代表專案/課程卡片自動抓取頁面縮圖

## 問題描述

代表專案和課程的列表卡片沒有顯示縮圖，只有文字資訊，視覺效果差。

## 原因

Notion 資料庫的項目大多沒有設定 page cover（封面圖）。圖片都在頁面**內容**裡，而非 page cover 屬性。

## 解決方案

自動從 Notion 頁面的第一個 image block 抓取圖片作為縮圖。

### 核心函式：fetchFirstImage

```js
async function fetchFirstImage(pageId, headers) {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=10`,
    { headers }
  )
  if (!res.ok) return null

  const data = await res.json()
  for (const block of data.results || []) {
    if (block.type === 'image') {
      return block.image?.file?.url || block.image?.external?.url || null
    }
  }
  return null
}
```

### 縮圖來源優先順序

```
1. page cover（Notion 頁面封面圖）
2. page icon（非 emoji 的圖片 icon）
3. 頁面內容的第一個 image block  ← 新增
4. 佔位圖示（灰色圖片 icon）     ← fallback
```

## 套用位置

| 檔案 | 函式 | 說明 |
|------|------|------|
| `fetchCourses.js` | `parseCourse()` → `fetchFirstImage()` | 課程卡片縮圖 |
| `fetchPortfolio.js` | `parseProject()` → `fetchFirstImage()` | 代表專案卡片縮圖 |

## 效能考量

`fetchFirstImage` 需要額外一次 API 請求（每個項目一次）。

```
45 個專案 × 1 次 API = 45 次額外請求
```

但這些請求在 `getStaticProps` 中執行（build time），使用 `Promise.all` 並行處理，不影響使用者體驗。ISR 每 60 秒最多重新產生一次。

## `page_size=10` 的考量

只取前 10 個 block，因為：
- 大部分頁面的第一張圖片都在前幾個 block
- 減少 API 回傳資料量
- 如果前 10 個 block 都沒有圖片，很可能頁面就是沒有圖片

## 相關檔案

- `lib/db/notion/fetchCourses.js` — 課程資料抓取
- `lib/db/notion/fetchPortfolio.js` — 代表專案資料抓取
- `components/NotionImage.js` — 壓縮顯示元件
