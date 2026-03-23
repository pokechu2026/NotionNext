# 05 — 全站圖片自動壓縮加速

## 問題描述

Notion 上傳的圖片通常是原始尺寸（2-5MB），頁面載入時瀏覽器要下載大量圖片，導致速度很慢。

## 兩套壓縮機制

本站同時使用兩種 Notion API，各有不同的壓縮方式：

### 1. 文章頁（Unofficial API）→ Notion Proxy 壓縮

```
原始: https://s3.../secure.notion-static.com/xxx/image.png
壓縮: https://www.notion.so/image/...?width=1080&cache=v2
```

- 由 `lib/db/notion/mapImage.js` 的 `compressImage()` 處理
- 適用首頁部落格文章縮圖

### 2. 課程/專案（Official API）→ Next.js Image 壓縮 🆕

```
原始: https://prod-files-secure.s3.../xxx/image.png?X-Amz-...
壓縮: /_next/image?url={encodedUrl}&w=640&q=75
```

- 由 `components/NotionImage.js` 元件處理
- 適用課程總覽、課程詳細、代表專案列表、代表專案詳細頁

## NotionImage 元件

```jsx
import NotionImage from '@/components/NotionImage'

// 縮圖（列表卡片）
<NotionImage src={url} alt="..." size="thumbnail" />

// 頁面內容圖片
<NotionImage src={url} alt="..." size="content" />

// 封面橫幅
<NotionImage src={url} alt="..." size="banner" priority />
```

### size 參數

| size | 壓縮寬度 | 適用場景 | 預估大小 |
|------|---------|---------|---------|
| `thumbnail` | 640px | 列表卡片縮圖 | ~50-100 KB |
| `content` | 1080px | 頁面內文圖片 | ~100-200 KB |
| `banner` | 1920px | 全寬封面圖 | ~150-300 KB |

### priority 參數

- `priority={true}`：首屏圖片（如封面橫幅），立即載入
- 預設 `false`：lazy loading，滾到可視區域才載入

## Next.js Image 壓縮原理

```
瀏覽器請求 /_next/image?url=原圖URL&w=640&q=75
  → Next.js 伺服器下載原圖
  → 壓縮至 640px 寬、品質 75%
  → 轉換為 WebP 或 AVIF 格式
  → 回傳壓縮圖 + 快取 7 天
  → 後續請求直接返回快取
```

### next.config.js 設定

```js
images: {
  formats: ['image/avif', 'image/webp'],
  domains: [
    'www.notion.so',
    'prod-files-secure.s3.us-west-2.amazonaws.com', // ← 新增
    // ...
  ],
  minimumCacheTTL: 60 * 60 * 24 * 7, // 7 天快取
}
```

## 效果對比

### 單張圖片
```
原始 PNG:  3,000 KB (3MB)    載入 2-3 秒（4G）
Next.js:      80 KB (WebP)   載入 0.06 秒    ← 快 37 倍！
```

### 15 張課程縮圖
```
壓縮前: 15 × 3MB = 45MB     載入 30+ 秒
壓縮後: 15 × 80KB = 1.2MB   載入 1-2 秒    ← 快 37 倍！
```

### 45 張代表專案縮圖
```
壓縮前: 45 × 2MB = 90MB     載入超過 1 分鐘
壓縮後: 45 × 80KB = 3.6MB   載入 3-4 秒    ← 快 25 倍！
```

## NotionImage vs LazyImage 使用時機

| 元件 | 使用場景 | 壓縮方式 |
|------|---------|---------|
| `LazyImage` | 文章頁（unofficial API 圖片，已有 Notion proxy 壓縮） | 客戶端 lazy load |
| `NotionImage` | 課程/專案頁（Official API 圖片，需要壓縮） | Next.js Image 伺服端壓縮 |

## 如何驗證效果

1. 開啟 Chrome DevTools（F12）
2. 切到 **Network** 頁籤
3. 篩選 **Img**
4. 重新載入頁面
5. 查看 **Size** 欄位，壓縮後的圖片應顯示為 50-200 KB
6. 查看 **Type** 欄位，應顯示 `webp` 或 `avif`

## 未來調整

- 修改 `NotionImage.js` 中 `widthMap` 的值可以調整壓縮寬度
- 修改 `quality={75}` 可以調整壓縮品質（1-100，越高越清晰但越大）
- 修改 `next.config.js` 中 `minimumCacheTTL` 可以調整快取時間

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `components/NotionImage.js` | Next.js Image 壓縮元件 |
| `components/LazyImage.js` | 客戶端 lazy load（文章用） |
| `next.config.js` | 圖片域名白名單、快取設定 |
| `lib/db/notion/mapImage.js` | 文章頁圖片壓縮（Notion proxy） |
| `conf/image.config.js` | 壓縮寬度/品質預設值 |
