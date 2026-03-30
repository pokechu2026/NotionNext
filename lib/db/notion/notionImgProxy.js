/**
 * Notion 圖片 URL 處理模組
 *
 * 注意：Notion Official API 返回的 prod-files-secure URL
 * 無法使用 notion.so/image/ 代理（代理不支援此格式）。
 * 因此直接使用原始簽名 URL，搭配 ISR 定期重新產生頁面來取得新的有效 URL。
 *
 * 此模組保留介面，方便未來如需切換至其他圖片代理方案。
 */

/**
 * 將 Notion S3 簽名 URL 轉為穩定的代理 URL
 *
 * Notion 的 prod-files-secure S3 URL 約 1 小時過期，ISR 重新產生時 URL 改變，
 * 導致瀏覽器快取失效。改用 /api/notion-image?id=<blockId> 穩定 URL，
 * 讓瀏覽器和 Next.js Image 快取跨 ISR 週期持續有效。
 */
function proxyNotionImage(url, blockId, size) {
  if (!url) return null
  // 已是代理 URL，避免重複包裝（e.g. fetchFirstImage 已處理過）
  if (url.startsWith('/api/notion-image')) return url
  // 外部 URL（Unsplash 等）不會過期，直接使用
  if (!url.includes('prod-files-secure')) return url
  // Notion S3 簽名 URL → 轉為穩定代理 URL
  if (!blockId) return url
  return `/api/notion-image?id=${blockId}`
}

/**
 * 遞迴處理 block 陣列中的圖片 URL
 * 將 image block 的 S3 簽名 URL 替換為穩定代理 URL（就地修改）
 */
function proxyBlockImages(blocks) {
  for (const block of blocks || []) {
    if (block.type === 'image' && block.image?.file?.url?.includes('prod-files-secure')) {
      block.image.file.url = `/api/notion-image?id=${block.id}`
    }
    if (block.children) proxyBlockImages(block.children)
  }
  return blocks
}

/**
 * 處理 page cover / icon URL（直通模式）
 */
function proxyPageCover(page) {
  return page || null
}

module.exports = { proxyNotionImage, proxyBlockImages, proxyPageCover }
