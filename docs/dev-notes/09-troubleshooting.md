# 09 — 常見問題排除速查表

## 圖片相關

### 圖片顯示破圖（裂開圖示）

**原因**: Notion AWS 簽名 URL 過期（約 1 小時），或使用了不支援的代理格式
**解法**:
- 文章頁：確認圖片 URL 有經過 `mapImgUrl()` 轉換（Notion proxy）
- 課程/專案頁：確認使用 `NotionImage` 元件 + ISR revalidate ≤ 60s
**相關檔案**: `components/NotionImage.js`, `lib/db/notion/mapImage.js`
**詳細說明**: [04-image-proxy.md](./04-image-proxy.md)

> ⚠️ **重要教訓**：`notion.so/image/` 代理**不支援** Official API 的 `prod-files-secure` URL！
> 之前嘗試用代理包裝導致全站圖片全部破掉。最終改為直接使用原始 URL + ISR 刷新。

### 圖片載入太慢

**原因**: 原始圖片尺寸太大（2-5MB）
**解法**:
- 文章頁：`compressImage()` 自動加上 `width=1080`（Notion proxy 壓縮）
- 課程/專案頁：使用 `NotionImage` 元件（Next.js Image 壓縮為 WebP/AVIF）
**相關檔案**: `components/NotionImage.js`
**詳細說明**: [05-image-compress.md](./05-image-compress.md)

### 列表卡片沒有縮圖

**原因**: Notion 頁面沒設定 page cover
**解法**: `fetchFirstImage()` 自動從頁面內容抓取第一個 image block
**詳細說明**: [10-portfolio-thumbnail.md](./10-portfolio-thumbnail.md)

### LINE/FB 分享縮圖是舊的

**原因**: 社群平台有圖片快取
**解法**: 使用 [Facebook 偵錯工具](https://developers.facebook.com/tools/debug/) 重新擷取，LINE 需等待自動更新
**詳細說明**: [06-og-image.md](./06-og-image.md)

---

## Notion 資料相關

### 新增的 Notion 頁面/課程網站上看不到

**原因**: 靜態頁面有快取，需要等 ISR 重新產生
**解法**:
1. 等待 `revalidate` 秒數後再次訪問（預設 60 秒）
2. 或重新部署（push 一個空 commit）

```bash
git commit --allow-empty -m "trigger rebuild"
git push origin main
```

### Notion 同步區塊（synced block）內容為空

**原因**: 同步區塊的「原始來源」頁面沒有分享給 Integration
**解法**:
1. 到 Notion 找到原始區塊所在的頁面
2. 點右上角「...」→「Connections」→ 加入你的 Integration（如 Antigravity）

### Notion Dashboard/Gallery 視圖不顯示

**原因**: `react-notion-x` 不支援 dashboard 視圖類型
**解法**: 不要用 `react-notion-x` 渲染，改用 Official API + 自訂元件
**參考**: 代表專案和課程頁面都是用這個方式

### 出現 `Unsupported block type button`

**原因**: Notion 的 button 區塊是自動化功能，無法在網頁上渲染
**處理**: 忽略此錯誤，不影響頁面功能

---

## 頁面顯示相關

### 進入頁面後不在頂部，而是在中段

**原因**: 瀏覽器的滾動位置復原行為
**解法**: 在元件中加入 `useEffect(() => { window.scrollTo(0, 0) }, [])`
**詳細說明**: [07-scroll-fix.md](./07-scroll-fix.md)

### 新頁面路由跟現有動態路由衝突

**原因**: `pages/[prefix]/index.js` 是動態路由，可能攔截到新頁面
**解法**: 建立明確路由 `pages/xxx/index.js`，明確路由優先級高於動態路由

### 頁面出現但沒有 Header/Footer

**原因**: Layout 沒有包在 `LayoutBase` 裡
**解法**: 確認 `themes/proxio/index.js` 中的 Layout 有正確匯出，且 `DynamicLayout` 會用 `LayoutBase` 包裹

### 頁面資料超過 128 KB 警告

**原因**: `getStaticProps` 傳給頁面的 JSON 資料太大
**處理**: 這是效能警告，不影響功能。可以透過以下方式減少資料量：
- 刪除不需要的欄位（如 `delete props.allPages`）
- 減少 block 層級深度
- 分頁載入

---

## 部署相關

### 推送後 Zeabur 沒有部署

**可能原因**:
1. 推送的不是 main 分支
2. Zeabur 的 webhook 斷線

**解法**: 到 Zeabur Dashboard 手動觸發部署

### 部署成功但網站沒更新

**可能原因**: CDN 快取或 ISR 快取
**解法**: 等幾分鐘後刷新，或清除瀏覽器快取 (Ctrl+Shift+R)

---

## 開發環境

### `npm run dev` 失敗

**常見原因**:
1. 缺少 `.env.local` 檔案
2. Node.js 版本不對
3. 依賴套件未安裝

**解法**:
```bash
# 確認 Node 版本
node -v  # 建議 18+

# 重新安裝依賴
yarn install

# 確認 .env.local 存在且有設定 NOTION_ACCESS_TOKEN
cat .env.local
```

### 環境變數清單

```bash
# .env.local 必要設定
NOTION_ACCESS_TOKEN=secret_xxx        # Notion Official API Integration Key
NOTION_ACCESS_TOKEN_V2=xxx            # Notion 非官方 API cookie token（選用）
```

---

## 快速診斷流程

```
頁面有問題
  ├── 圖片破圖？
  │     ├── 文章頁 → 檢查 mapImgUrl() 有無正確轉換
  │     └── 課程/專案 → 確認用 NotionImage 元件 + ISR revalidate=60
  ├── 圖片太慢？
  │     ├── 文章頁 → compressImage() 應加 width=1080
  │     └── 課程/專案 → 確認用 NotionImage（Next.js 自動壓縮）
  ├── 縮圖沒有？ → 確認 fetchFirstImage() 有被呼叫
  ├── 內容沒更新？ → 等 ISR revalidate 或重新部署
  ├── 區塊不顯示？ → 查 console 看是否有 Unsupported block type
  ├── 滾動位置錯？ → 加 useEffect scrollTo
  └── 頁面 404？ → 確認路由檔案位置和 getStaticPaths
```
