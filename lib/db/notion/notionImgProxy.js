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
 * 圖片 URL 處理（直通模式）
 * 保留原始 URL 不做轉換，ISR 會定期重新取得新的簽名 URL
 */
function proxyNotionImage(url, blockId, size) {
  return url || null
}

/**
 * 遞迴處理 block 陣列中的圖片 URL（直通模式）
 */
function proxyBlockImages(blocks) {
  return blocks || []
}

/**
 * 處理 page cover / icon URL（直通模式）
 */
function proxyPageCover(page) {
  return page || null
}

module.exports = { proxyNotionImage, proxyBlockImages, proxyPageCover }
