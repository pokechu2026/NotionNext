# Choosehill 網站開發筆記

> 本資料夾記錄 choosehill-site（NotionNext 架構）的開發歷程、遇到的問題與解決方案。
> 適合日後維護、交接或回顧時參考。

## 目錄

| 編號 | 檔案 | 主題 |
|------|------|------|
| 01 | [architecture.md](./01-architecture.md) | NotionNext 架構總覽與關鍵觀念 |
| 02 | [hero-video.md](./02-hero-video.md) | 首頁 Hero 背景替換為全螢幕影片 |
| 03 | [course-page.md](./03-course-page.md) | 新增 /course 課程頁（Notion Official API） |
| 04 | [image-proxy.md](./04-image-proxy.md) | 圖片 URL 過期問題與解決歷程 |
| 05 | [image-compress.md](./05-image-compress.md) | 全站圖片自動壓縮加速（Next.js Image） |
| 06 | [og-image.md](./06-og-image.md) | 全站 OG 分享縮圖統一設定 |
| 07 | [scroll-fix.md](./07-scroll-fix.md) | 頁面進入時滾動位置修復 |
| 08 | [git-workflow.md](./08-git-workflow.md) | Git / PR / 部署流程指南 |
| 09 | [troubleshooting.md](./09-troubleshooting.md) | 常見問題排除速查表 |
| 10 | [portfolio-thumbnail.md](./10-portfolio-thumbnail.md) | 代表專案/課程卡片自動抓取頁面縮圖 |

## 技術棧

- **框架**: Next.js 14 (Pages Router)
- **CMS**: Notion（作為資料庫）
- **主題**: proxio
- **部署**: Zeabur（自動偵測 main 分支推送）
- **Notion API**: 同時使用 unofficial (`notion-client`) + Official (`api.notion.com/v1`)

## 圖片處理架構

```
                    ┌─────────────────┐
                    │   Notion 頁面    │
                    │ （上傳原始圖片）  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
   ┌──────────────────┐          ┌──────────────────┐
   │ Unofficial API    │          │ Official API      │
   │ (notion-client)   │          │ (api.notion.com)  │
   │ → 文章頁          │          │ → 課程/專案頁     │
   └────────┬─────────┘          └────────┬─────────┘
            │                             │
            ▼                             ▼
   ┌──────────────────┐          ┌──────────────────┐
   │ mapImgUrl()       │          │ NotionImage 元件  │
   │ + compressImage() │          │ (next/image)      │
   │ Notion proxy 壓縮 │          │ Next.js 壓縮      │
   │ width=1080        │          │ WebP/AVIF q=75    │
   └──────────────────┘          └──────────────────┘
```
