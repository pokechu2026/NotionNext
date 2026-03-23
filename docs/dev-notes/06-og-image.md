# 06 — 全站 OG 分享縮圖統一設定

## 什麼是 OG Image？

當你把網站連結分享到 LINE、Facebook、Twitter 等平台時，會顯示一張預覽縮圖。這張圖是由 HTML 的 `<meta property="og:image">` 標籤決定的。

## 問題

原本全站的 OG 圖片使用 Notion 資料庫的封面圖（`siteInfo.pageCover`），這是 NotionNext 的預設行為。但這張圖不是我們想要的品牌形象圖。

## 解決方案

修改 `components/SEO.js`，將所有頁面的預設 OG 圖片統一改為自訂圖片。

### 修改內容

檔案：`components/SEO.js`

```js
// 修改前（使用 Notion 封面圖）
image: `${siteInfo?.pageCover}`

// 修改後（使用自訂圖片）
image: '/images/choosehill/chase-photo.webp'
```

共修改了 12 處路由的預設圖片設定。

### 邏輯

```
文章頁: 有自訂封面圖 → 使用文章封面圖
文章頁: 沒有封面圖   → 使用 chase-photo.webp
其他頁面（首頁、課程、分類等）→ 一律使用 chase-photo.webp
```

## 圖片放置位置

```
/public/images/choosehill/chase-photo.webp
```

放在 `public/` 資料夾下的檔案可以直接透過 URL 存取：
`https://www.choosehill.com/images/choosehill/chase-photo.webp`

## 社群平台快取清除

修改 OG 圖片後，社群平台可能還會顯示舊圖（因為有快取）：

| 平台 | 清除方式 |
|------|---------|
| Facebook | [Facebook 偵錯工具](https://developers.facebook.com/tools/debug/) 輸入網址 → 點「重新擷取」 |
| LINE | 等待自動更新（通常 1-7 天），或修改網址加上 `?v=2` 等參數強制重抓 |
| Twitter | [Card Validator](https://cards-dev.twitter.com/validator) 輸入網址 |

## 注意事項

- OG 圖片建議尺寸：1200 x 630 px
- 格式建議：JPG 或 PNG（部分平台不支援 WebP）
- 如果想針對特定頁面用不同圖片，需要在該頁面的 `getStaticProps` 中設定 `meta.image`
