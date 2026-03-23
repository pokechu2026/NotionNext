# Choosehill 網站開發筆記

> 本資料夾記錄 choosehill-site（NotionNext 架構）的開發歷程、遇到的問題與解決方案。
> 適合日後維護、交接或回顧時參考。

## 目錄

| 編號 | 檔案 | 主題 |
|------|------|------|
| 01 | [architecture.md](./01-architecture.md) | NotionNext 架構總覽與關鍵觀念 |
| 02 | [hero-video.md](./02-hero-video.md) | 首頁 Hero 背景替換為全螢幕影片 |
| 03 | [course-page.md](./03-course-page.md) | 新增 /course 課程頁（Notion Official API） |
| 04 | [image-proxy.md](./04-image-proxy.md) | 圖片過期破圖問題與 Notion 代理修復 |
| 05 | [image-compress.md](./05-image-compress.md) | 全站圖片自動壓縮加速 |
| 06 | [og-image.md](./06-og-image.md) | 全站 OG 分享縮圖統一設定 |
| 07 | [scroll-fix.md](./07-scroll-fix.md) | 頁面進入時滾動位置修復 |
| 08 | [git-workflow.md](./08-git-workflow.md) | Git / PR / 部署流程指南 |
| 09 | [troubleshooting.md](./09-troubleshooting.md) | 常見問題排除速查表 |

## 技術棧

- **框架**: Next.js 14 (Pages Router)
- **CMS**: Notion（作為資料庫）
- **主題**: proxio
- **部署**: Zeabur（自動偵測 main 分支推送）
- **Notion API**: 同時使用 unofficial (`notion-client`) + Official (`api.notion.com/v1`)
