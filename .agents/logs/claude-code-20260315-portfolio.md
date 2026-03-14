# Portfolio 作品集展示功能

- **Agent**: claude-code
- **日期**: 2026-03-15
- **任務來源**: `.agents/tasks/portfolio-feature.md`
- **狀態**: 完成（待本地驗證）

---

## 異動檔案

### 新增
| 檔案 | 說明 |
|---|---|
| `lib/db/notion/fetchPortfolio.js` | Notion Official API 資料讀取模組 |
| `themes/proxio/components/Portfolio.js` | 首頁精選作品元件 |
| `themes/proxio/components/PortfolioPage.js` | /portfolio 完整頁面元件（含篩選器） |
| `pages/portfolio.js` | /portfolio 路由頁面（SSG） |

### 修改
| 檔案 | 改動範圍 | 說明 |
|---|---|---|
| `themes/proxio/config.js` | 新增 4 行 (`PROXIO_PORTFOLIO_*`) | Portfolio 區塊設定 |
| `themes/proxio/index.js` | import + LayoutPortfolio + export | 整合元件到主題 |
| `pages/index.js` | import + getStaticProps 注入 | 首頁 SSG 注入 featuredProjects |

### 未修改（其他 agent 可安全操作）
- `blog.config.js`
- `themes/proxio/components/Hero.js`
- `themes/proxio/components/CTA.js`
- `themes/proxio/components/Career.js`
- `themes/proxio/components/Features.js`
- `themes/proxio/components/Blog.js`
- 所有 `lib/db/SiteDataApi.js` 等既有模組

---

## 注意事項

1. 需要 `.env.local` 中的 `NOTION_ACCESS_TOKEN` 有權限存取 DB `8bc026255e6b829d8dd581c91a3fb7d4`
2. build 時發現 `public/sitemap.xml` 與 `pages/sitemap.xml.js` 衝突（既有問題），已刪除 `public/sitemap.xml` 解決
3. `themes/proxio/index.js` 和 `pages/index.js` 已被修改，後續 agent 若需改這兩個檔案請先讀取最新內容
