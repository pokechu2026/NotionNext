# 03 — 新增 /course 課程頁（Notion Official API）

## 需求

新增一個課程頁面 `/course`，從 Notion 資料庫讀取課程資料，套用首頁同樣的 Header/Footer 深色主題。

頁面結構：
1. **封面橫幅**（從 Notion 頁面的第一張圖片取得）
2. **課程卡片列表**（從 Notion 資料庫查詢，含分類/難度篩選）
3. **講師簡介**（從 Notion 同步區塊取得）

點擊課程卡片進入 `/course/[id]` 詳細頁，顯示完整的 Notion 頁面內容。

## Notion 資料庫結構

- **DB ID**: `31b026255e6b80568efdc9180de7a0be`
- **課程總覽頁 ID**: `32c026255e6b809fb273d3c2ac2c15ab`

| 欄位名稱 | 類型 | 說明 |
|----------|------|------|
| 課程名稱 | title | 課程標題 |
| 課程分類 | select | AI 影音生成、AI 提案簡報... |
| 難度等級 | select | 入門 / 進階 / 實戰 |
| 建議時段 | select | 1 / 1.5 / 2 / 6 小時 |
| 課程時數/hr | number | 實際課程時數 |
| 授課軟體 | multi_select | ChatGPT、Gemini... |

## 新增的檔案

### 1. `lib/db/notion/fetchCourses.js` — 資料取得層

核心函式：

```
fetchAllCourses()          → 查詢課程 DB，回傳所有課程陣列
fetchCoursePageContent()   → 取得課程總覽頁的封面圖 + 講師同步區塊
fetchCoursePage(pageId)    → 取得單一課程的完整內容（用於詳細頁）
```

**API 呼叫流程：**
```
NOTION_ACCESS_TOKEN
  → POST api.notion.com/v1/databases/{DB_ID}/query
  → 每筆 page → parseCourse() 解析欄位
  → 每筆 page → fetchFirstImage() 抓頁面第一張圖作為縮圖
```

### 2. `pages/course/index.js` — 課程總覽頁路由

```js
export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'course', locale })
  props.courses = await fetchAllCourses()
  const { bannerUrl, lecturerBlocks } = await fetchCoursePageContent()
  props.courseBannerUrl = bannerUrl
  props.courseLecturerBlocks = lecturerBlocks
  delete props.allPages  // 移除不需要的大量頁面資料
  return { props, revalidate: ... }
}
```

### 3. `pages/course/[id].js` — 課程詳細頁路由

```js
export async function getStaticPaths() {
  const courses = await fetchAllCourses()
  return {
    paths: courses.map(c => ({ params: { id: c.id.replace(/-/g, '') } })),
    fallback: 'blocking'  // 新課程第一次訪問時即時產生
  }
}
```

### 4. `themes/proxio/components/CoursePage.js` — 課程總覽元件

功能：
- 分類 + 難度下拉篩選器
- 課程卡片列表（SmartLink 包裹，點擊跳轉詳細頁）
- 難度顏色標籤（入門=綠、進階=黃、實戰=紅）
- 底部講師簡介區（NotionBlockRenderer 渲染同步區塊）

### 5. `themes/proxio/components/CourseDetail.js` — 課程詳細頁元件

功能：
- 課程標題、分類、難度、時數、授課軟體標籤
- Notion 頁面完整內容渲染（自訂 renderBlock 函式）
- 返回課程總覽連結

### 6. `themes/proxio/index.js` — 註冊 Layout

```js
import { CoursePage } from './components/CoursePage'
import { CourseDetail } from './components/CourseDetail'

const LayoutCourse = props => (
  <CoursePage
    courses={props?.courses}
    bannerUrl={props?.courseBannerUrl}
    lecturerBlocks={props?.courseLecturerBlocks}
  />
)

const LayoutCourseDetail = props => (
  <CourseDetail course={props?.course} blocks={props?.blocks} />
)
```

## 遇到的問題與解決

### 問題 1：Notion Dashboard 視圖不渲染

**現象**: `react-notion-x` 的 Collection 元件顯示空白
**原因**: `react-notion-x` 不支援 `type: 'dashboard'` 視圖
**解決**: 不用 `react-notion-x` 渲染資料庫，改用 Official API 直接查詢 + 自訂元件

### 問題 2：Linked Database 資料為空

**現象**: 頁面中嵌入的 Linked Database，`collection_query` 回傳 `{}`
**原因**: `notion-client`（非官方 API）無法正確取得 Linked Database 的資料
**解決**: 同上，改用 Official API

### 問題 3：同步區塊內容抓不到

**現象**: 講師簡介的同步區塊 children 為空
**原因**: 同步區塊的「原始來源」頁面沒有分享給 Notion Integration
**解決**: 到 Notion 將原始頁面加入 Integration 的存取權限

### 問題 4：Button 區塊不支援

**現象**: Server log 出現 `Unsupported block type button`
**原因**: Notion 的 button 區塊是自動化功能，沒有對應的 Web 渲染
**處理**: 忽略，不影響頁面功能

## 路由優先級

```
pages/course/index.js     ← 明確路由（優先）
pages/[prefix]/index.js   ← 動態路由（較低優先）
```

Next.js 的明確路由（explicit route）永遠優先於動態路由（dynamic route），所以 `/course` 會正確匹配到 `pages/course/index.js`。
