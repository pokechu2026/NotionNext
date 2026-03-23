# 07 — 頁面進入時滾動位置修復

## 問題描述

從課程總覽頁點擊課程卡片進入詳細頁時，頁面不是從頂部開始，而是出現在頁面中段左右的位置。代表專案頁也有同樣問題。

## 原因分析

Next.js 有內建的 `scrollRestoration: true` 設定（在 `next.config.js`），但這主要處理瀏覽器的「上一頁/下一頁」行為。對於新頁面導航，有時候因為頁面佈局的載入時序，瀏覽器可能保留了前一頁的滾動位置。

## 解決方案

在詳細頁元件中加入 `useEffect`，確保進入頁面時滾動到頂部：

### CourseDetail.js

```jsx
import { useEffect } from 'react'

export const CourseDetail = ({ course, blocks = [] }) => {
  // 進入頁面時滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ...
}
```

### PortfolioDetail.js

```jsx
import { useEffect } from 'react'

export const PortfolioDetail = ({ project, blocks = [] }) => {
  // 進入頁面時滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ...
}
```

## 重點

- `useEffect(() => { ... }, [])` 的空陣列 `[]` 代表只在元件「首次掛載」時執行一次
- `window.scrollTo(0, 0)` 將頁面滾動到左上角 (x=0, y=0)
- 這是最簡單可靠的做法，不依賴 Next.js 的路由行為

## 適用時機

任何「從列表頁點擊進入詳細頁」的場景都建議加上這段程式碼。
