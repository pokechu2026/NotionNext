/**
 * 將 Notion AWS 簽名 URL 轉換為 notion.so 代理 URL
 * AWS 簽名 URL 約 1 小時過期，代理 URL 永久有效
 *
 * 格式：https://www.notion.so/image/{encodedUrl}?table=block&id={blockId}
 */

const NOTION_HOST = process.env.NEXT_PUBLIC_NOTION_HOST || 'https://www.notion.so'

/**
 * 單一 URL 轉換
 * @param {string} url - 原始圖片 URL
 * @param {string} blockId - Notion block 或 page ID
 * @returns {string|null}
 */
function proxyNotionImage(url, blockId) {
  if (!url) return null

  // 已經是代理 URL，不用再轉
  if (url.includes('notion.so/image')) return url

  // 只轉換 Notion AWS 簽名 URL
  if (
    url.includes('secure.notion-static.com') ||
    url.includes('prod-files-secure') ||
    url.startsWith('attachment:')
  ) {
    return (
      NOTION_HOST +
      '/image/' +
      encodeURIComponent(url) +
      '?table=block&id=' +
      (blockId || '').replace(/-/g, '')
    )
  }

  // 外部 URL 不做轉換
  return url
}

/**
 * 遞迴處理 block 陣列中所有的 image/video URL
 * 直接 mutate block 物件（效能考量）
 */
function proxyBlockImages(blocks) {
  if (!blocks || !Array.isArray(blocks)) return blocks

  for (const block of blocks) {
    const blockId = block.id || ''

    // 處理 image block
    if (block.type === 'image' && block.image) {
      if (block.image.file?.url) {
        block.image.file.url = proxyNotionImage(block.image.file.url, blockId)
      }
    }

    // 處理 video block
    if (block.type === 'video' && block.video) {
      if (block.video.file?.url) {
        block.video.file.url = proxyNotionImage(block.video.file.url, blockId)
      }
    }

    // 遞迴處理子 block
    if (block.children) {
      proxyBlockImages(block.children)
    }
  }

  return blocks
}

/**
 * 處理 page cover / icon 的 file URL
 */
function proxyPageCover(page) {
  if (!page) return null

  const pageId = page.id || ''

  // 處理 cover
  if (page.cover?.type === 'file' && page.cover.file?.url) {
    page.cover.file.url = proxyNotionImage(page.cover.file.url, pageId)
  }

  // 處理 icon (非 emoji)
  if (page.icon?.type === 'file' && page.icon.file?.url) {
    page.icon.file.url = proxyNotionImage(page.icon.file.url, pageId)
  }

  return page
}

module.exports = { proxyNotionImage, proxyBlockImages, proxyPageCover }
