# 04 — 圖片過期破圖問題與 Notion 代理修復

## 問題描述

代表專案和課程頁面上傳後，圖片一開始正常顯示，但過一段時間就變成破圖（裂開的圖示）。

## 根本原因

Notion 儲存的圖片放在 AWS S3，透過「簽名 URL」存取：

```
https://prod-files-secure.s3.us-west-2.amazonaws.com/xxx?
  X-Amz-Algorithm=AWS4-HMAC-SHA256&
  X-Amz-Credential=xxx&
  X-Amz-Date=20260324T...&
  X-Amz-Expires=3600&          ← 約 1 小時過期！
  X-Amz-Signature=xxx
```

我們的頁面是 **靜態產生 (SSG)**，HTML 裡寫死了這些 URL。當靜態頁面快取超過 1 小時，URL 就過期了。

## NotionNext 原有的解法

NotionNext 的文章頁使用 `lib/db/notion/mapImage.js` 中的 `mapImgUrl()` 函式，將 AWS URL 轉成 Notion 官方的圖片代理：

```
https://www.notion.so/image/{encodeURIComponent(原始URL)}?table=block&id={blockId}
```

這個代理 URL **永不過期**，Notion 伺服器會在背後用新的簽名去取圖片。

## 我們的問題

代表專案和課程頁面使用 **Official API** 取得資料，繞過了原有的 `mapImgUrl()`，所以圖片 URL 沒有被轉換。

## 解決方案

新增 `lib/db/notion/notionImgProxy.js` 共用模組：

```js
const NOTION_HOST = 'https://www.notion.so'

function proxyNotionImage(url, blockId, size = 'content') {
  // 偵測 AWS 簽名 URL
  if (url.includes('secure.notion-static.com') || url.includes('prod-files-secure')) {
    return NOTION_HOST + '/image/' + encodeURIComponent(url)
      + '?table=block&id=' + blockId
      + '&width=' + width + '&cache=v2'
  }
  return url
}
```

### 套用位置

| 檔案 | 套用函式 | 處理內容 |
|------|---------|---------|
| `fetchPortfolio.js` | `proxyNotionImage()` | 專案封面圖 |
| `fetchPortfolio.js` | `proxyBlockImages()` | 專案頁面所有內容圖片 |
| `fetchCourses.js` | `proxyNotionImage()` | 課程縮圖、封面橫幅 |
| `fetchCourses.js` | `proxyBlockImages()` | 課程頁面內容、講師區塊圖片 |

### 處理流程

```
Notion API 回傳 block
  → block.image.file.url = "https://prod-files-secure...?X-Amz-Expires=3600"
  → proxyBlockImages() 遍歷所有 block
  → 轉換為 "https://www.notion.so/image/...?table=block&id=xxx&width=1080&cache=v2"
  → 寫入靜態 HTML（永不過期）
```

## 關鍵概念

```
原始 URL（會過期）:
  https://prod-files-secure.s3.us-west-2.amazonaws.com/abc123/image.png?X-Amz-Expires=3600

代理 URL（永不過期）:
  https://www.notion.so/image/https%3A%2F%2Fprod-files-secure...?table=block&id=xxx
```

Notion 的 `/image/` 端點會：
1. 解碼原始 URL
2. 用自己的權限（永久有效）去 S3 取圖
3. 回傳圖片給瀏覽器

## 相關檔案

- `lib/db/notion/notionImgProxy.js` — 代理轉換模組
- `lib/db/notion/mapImage.js` — NotionNext 原有的圖片映射（文章用）
- `conf/image.config.js` — NOTION_HOST 設定
