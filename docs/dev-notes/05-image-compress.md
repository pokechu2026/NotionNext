# 05 — 全站圖片自動壓縮加速

## 問題描述

Notion 上傳的圖片通常是原始尺寸（2-5MB），頁面載入時瀏覽器要下載大量圖片，導致速度很慢。

## 解決方案

利用 Notion 圖片代理的 `width` 參數，讓伺服器回傳壓縮後的小圖。

**完全不需要重新上傳 Notion 裡的圖片。**

## 原理

Notion 的 `/image/` 代理支援以下參數：

```
https://www.notion.so/image/{url}?table=block&id={id}&width=1080&cache=v2
                                                       ^^^^^^^^^^^^^^^^^^
                                                       壓縮參數
```

- `width=1080`: 將圖片寬度壓縮到 1080px（等比縮放）
- `cache=v2`: 啟用 Notion 的快取機制

## 壓縮預設值

在 `notionImgProxy.js` 中定義了四種場景：

```js
const SIZE_PRESETS = {
  thumbnail: 640,   // 列表卡片縮圖
  content: 1080,    // 頁面內容圖片
  banner: 1920,     // 封面橫幅
  full: 0           // 不壓縮（影片等）
}
```

## 各場景對應

| 場景 | 壓縮寬度 | 預估大小 | 使用位置 |
|------|---------|---------|---------|
| thumbnail | 640px | ~50-100 KB | 課程/專案列表的卡片縮圖 |
| content | 1080px | ~100-200 KB | 課程/專案詳細頁的內容圖片 |
| banner | 1920px | ~150-300 KB | 課程總覽頁封面橫幅 |
| full | 不壓縮 | 原始大小 | 影片檔案 |

## 效果對比

以一張 3MB 的講師封面圖為例：

```
原始:     3,000 KB (3MB)     ← 載入約 2-3 秒（4G 網路）
banner:     250 KB           ← 載入約 0.2 秒
thumbnail:   80 KB           ← 載入約 0.06 秒
```

15 張課程縮圖的總下載量：
```
壓縮前: 15 x 3MB = 45MB     ← 超慢
壓縮後: 15 x 80KB = 1.2MB   ← 快速
```

## 使用方式

在資料取得層呼叫 `proxyNotionImage()` 時指定 size：

```js
// 縮圖（列表頁）
cover = proxyNotionImage(cover, page.id, 'thumbnail')

// 頁面內容（自動處理所有圖片 block）
proxyBlockImages(blocks)  // 預設使用 'content'

// 封面橫幅
bannerUrl = proxyNotionImage(rawUrl, imageBlock.id, 'banner')
```

## 如何驗證效果

1. 開啟 Chrome DevTools（F12）
2. 切到 **Network** 頁籤
3. 篩選 **Img**
4. 重新載入頁面
5. 查看每張圖片的 **Size** 欄位

## 未來調整

如果覺得圖片畫質不夠，可以修改 `notionImgProxy.js` 中的 `SIZE_PRESETS`，例如：
- 把 `content` 從 1080 改成 1280
- 把 `thumbnail` 從 640 改成 800
