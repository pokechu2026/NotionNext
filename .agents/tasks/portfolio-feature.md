# 任務：建立「代表專案」作品集展示功能

## 🎯 目標

在 Choosehill AI 網站（NotionNext + Proxio 主題）中，新增一個作品集展示功能，直接從獨立 Notion 資料庫讀取 45 個代表專案，在首頁顯示精選 Featured 作品，並建立獨立 `/portfolio` 頁面展示全部作品。

---

## 📋 背景資訊

- **框架**: NotionNext 4.9.3.1（Next.js 14, Pages Router）
- **主題**: `themes/proxio/`
- **部署**: Zeabur
- **專案目錄**: `/Users/mac/Library/Mobile Documents/com~apple~CloudDocs/Antigravity space/choosehill-site`

### Notion 資料庫

**「代表專案」DB ID**: `8bc026255e6b829d8dd581c91a3fb7d4`

**Schema:**
| 欄位 | 類型 | 說明 |
|---|---|---|
| Project Name | title | 專案名稱 |
| year | select | 年份（2010-2025） |
| Role | multi_select | 角色（講師/導演/製片/視覺設計/AI 應用開發 等） |
| 合作單位 | select | 合作夥伴 |
| Featured | checkbox | 是否為首頁精選 |
| Metric | rich_text | 量化成果（如獲獎紀錄） |
| Category | relation | 分類（關聯） |

**API Token**: 在 `.env.local` 中的 `NOTION_ACCESS_TOKEN`

### ⭐ 目前 6 個 Featured 作品
1. 金鐘獎雙金獎《臺灣特有種 VR》（2018, 公共電視台）
2. 威尼斯影展大獎《無法離開的人》（2022, Funique VR）
3. 聯成電腦菜鳥救星 Notion × ChatGPT 線上課程（2025）
4. AI ESG 健檢 App / CarneuBank 永續展覽（2025, 碳中和銀行）
5. 國防大學 AI 科技於社工領域的應用講座（2025）
6. GEN AI 繪圖生成作品（2025, 自行研發）

---

## 📝 執行步驟

### Step 1：建立 Portfolio 資料讀取模組

建立 `lib/notion/fetchPortfolio.js`：

```javascript
// 使用 Notion Official API 讀取「代表專案」資料庫
// DB ID: 8bc026255e6b829d8dd581c91a3fb7d4
// 需要：NOTION_ACCESS_TOKEN 從 process.env 讀取
```

功能：
- 呼叫 `POST https://api.notion.com/v1/databases/{db_id}/query`
- Header: `Authorization: Bearer {NOTION_ACCESS_TOKEN}`, `Notion-Version: 2022-06-28`
- 解析回傳資料，提取每個專案的：`title`, `year`, `roles[]`, `unit`, `featured`, `metric`, `cover`（頁面封面圖）, `id`
- 回傳格式化的陣列
- 提供 `fetchFeaturedProjects()` 只回傳 `Featured=true` 的項目
- 提供 `fetchAllProjects()` 回傳全部，按年份倒序排列

### Step 2：修改首頁 SSG 注入 Portfolio 資料

修改 `pages/index.js` 的 `getStaticProps`：
- import `fetchFeaturedProjects`
- 在 props 中加入 `featuredProjects` 欄位
- 傳遞給 `LayoutIndex`

### Step 3：建立 Portfolio 元件

建立 `themes/proxio/components/Portfolio.js`：

**首頁模式（精選 6 個）：**
- 區塊標題：可用 config 設定（如「精選作品」）
- 卡片 Grid（響應式：桌面 3 欄，平板 2 欄，手機 1 欄）
- 每張卡片顯示：封面圖、專案名稱、年份、角色標籤、合作單位
- 底部有「查看全部作品 →」連結到 `/portfolio`

**設計注意：**
- 遵循 Proxio 主題現有的 dark mode 支援（`dark:` class）
- 使用 Proxio 已有的 CSS 變數和間距規範
- 加入 hover 動效（卡片微升、陰影變化）

### Step 4：在 LayoutIndex 引入 Portfolio

修改 `themes/proxio/index.js`：
- import Portfolio 元件
- 在 Blog 區塊之後、Testimonials 之前插入
- 用 `siteConfig('PROXIO_PORTFOLIO_ENABLE')` 控制開關

### Step 5：建立 /portfolio 獨立頁面

建立 `pages/portfolio.js`：
- `getStaticProps` 中呼叫 `fetchAllProjects()`
- 提供全部 45 個作品的完整展示
- 支援年份篩選（依 year 欄位分組）
- 支援角色篩選（依 Role 欄位篩選）

### Step 6：更新 config.js

在 `themes/proxio/config.js` 新增：
```javascript
PROXIO_PORTFOLIO_ENABLE: true,
PROXIO_PORTFOLIO_TITLE: '精選作品',
PROXIO_PORTFOLIO_TEXT: '跨越影視、VR、AI 與設計的多元專案實績',
PROXIO_PORTFOLIO_DB_ID: '8bc026255e6b829d8dd581c91a3fb7d4',
```

### Step 7：驗證

1. 執行 `npm run dev`，確認 localhost 首頁顯示 6 個精選作品卡片
2. 點擊「查看全部」確認 `/portfolio` 頁面正常載入 45 個作品
3. 確認 dark mode 下外觀正常
4. 執行 `npm run build` 確認無錯誤

---

## ⚠️ 注意事項

1. **所有 `siteConfig()` 呼叫必須在元件頂部**，在任何 `if (!xxx) return null` 之前。`siteConfig` 內部使用 `useGlobal`（React Hook），違反順序會導致 Hydration 錯誤。
2. **不要修改 NotionNext 主資料庫**（ID: `105026255e6b83258d2781343b4c69f7`），代表專案是獨立 DB。
3. **Notion 圖片 URL 有時效性**，封面圖需考慮使用 `mapImgUrl` 或做代理處理。
4. **嚴格遵守 local-first 開發流程**：先在 localhost 驗證，確認沒問題後再推 Git。
5. **blog.config.js 和 themes/proxio/config.js 可能已被其他 agent 修改過**，開始前先 `cat` 檢查當前內容再做修改。
