# 04 — 圖片 URL 過期問題與解決歷程

## 問題描述

代表專案和課程頁面上傳後，圖片一開始正常顯示，但過一段時間就變成破圖。

## 根本原因

Notion 儲存的圖片放在 AWS S3，透過「簽名 URL」存取：

```
https://prod-files-secure.s3.us-west-2.amazonaws.com/xxx?
  X-Amz-Algorithm=AWS4-HMAC-SHA256&
  X-Amz-Expires=3600          ← 約 1 小時過期！
```

我們的頁面是 **靜態產生 (SSG)**，HTML 裡寫死了這些 URL。當靜態頁面快取超過 1 小時，URL 就過期了。

## 嘗試過的解法

### 方案 A：Notion 圖片代理 ❌ 失敗

NotionNext 原有文章頁使用 `notion.so/image/` 代理將 AWS URL 轉為永久連結：

```
https://www.notion.so/image/{encodeURIComponent(原始URL)}?table=block&id={blockId}
```

**為什麼失敗**：此代理只支援舊版的 `secure.notion-static.com` URL（unofficial API 使用的格式），**不支援** Official API 的 `prod-files-secure.s3.us-west-2.amazonaws.com` 格式。

錯誤現象：
- 代理 URL 長達 1900+ 字元（因為完整 AWS 認證參數也被編碼進去）
- 瀏覽器請求直接返回錯誤，圖片完全無法顯示
- 不管有沒有帶 `width` 參數都一樣失敗

### 方案 B：ISR 刷新 + Next.js Image ✅ 最終方案

1. **移除代理**：`notionImgProxy.js` 改為直通模式，直接使用原始簽名 URL
2. **靠 ISR 保鮮**：`revalidate = 60` 秒，每分鐘重新產生頁面取得新的有效 URL
3. **Next.js Image 壓縮**：用 `next/image` 元件自動壓縮（見 05-image-compress.md）

## 兩種 API 的圖片 URL 差異

| | Unofficial API (notion-client) | Official API (api.notion.com) |
|---|---|---|
| URL 格式 | `s3.us-west-2.amazonaws.com/secure.notion-static.com/...` | `prod-files-secure.s3.us-west-2.amazonaws.com/...` |
| notion.so/image 代理 | ✅ 可用 | ❌ 不可用 |
| 壓縮方式 | `compressImage()` + Notion proxy width | Next.js Image (`/_next/image`) |
| URL 有效期 | 透過代理永久有效 | 1 小時（靠 ISR 刷新） |

## 為什麼 ISR 不會讓圖片過期？

```
時間軸:
T=0    頁面產生，URL 有效至 T+1hr
T+1min 有人訪問 → 觸發背景重新產生（新 URL，有效至 T+1min+1hr）
T+2min 有人訪問 → 使用剛重新產生的頁面（URL 仍有效）
...
T+59min URL 仍有效（離過期還有 1 分鐘）
T+60min 但 ISR 已在 T+1min 就產生了新頁面，所以不會真的過期
```

**唯一風險**：若超過 1 小時完全沒有任何人訪問，第一個訪客會看到過期圖片。但下一次訪問就會觸發重新產生。

## 關鍵教訓

> **不是所有 Notion URL 都能用 `notion.so/image/` 代理。**
> Official API 的 `prod-files-secure` URL 需要用其他方式處理。

## 相關檔案

- `lib/db/notion/notionImgProxy.js` — 已改為直通模式
- `lib/db/notion/mapImage.js` — 原有文章用的圖片映射（仍使用 Notion proxy）
- `components/NotionImage.js` — Next.js Image 壓縮元件
