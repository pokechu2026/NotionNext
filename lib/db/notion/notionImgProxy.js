/**
 * 將 Notion AWS 簽名 URL 轉換為 notion.so 代理 URL（含壓縮）
 * AWS 簽名 URL 約 1 小時過期，代理 URL 永久有效
 *
 * 格式：https://www.notion.so/image/{encodedUrl}?table=block&id={blockId}&width=XXX&cache=v2
 *
 * 壓縮寬度預設值：
 *   - thumbnail (縮圖/列表卡片): 640px
 *   - content   (頁面內容圖片):  1080px
 *   - banner    (封面橫幅):      1920px
 *   - full      (不壓縮):        不加 width 參數
 */

const NOTION_HOST = process.env.NEXT_PUBLIC_NOTION_HOST || 'https://www.notion.so'

// 各場景的壓縮寬度
const SIZE_PRESETS = {
  thumbnail: 640,
  content: 1080,
  banner: 1920,
  full: 0 // 不壓縮
}

/**
 * 單一 URL 轉換 + 壓縮
 * @param {string} url - 原始圖片 URL
 * @param {string} blockId - Notion block 或 page ID
 * @param {string} size - 壓縮預設: 'thumbnail' | 'content' | 'banner' | 'full'
 * @returns {string|null}
 */
function proxyNotionImage(url, blockId, size = 'content') {
  if (!url) return null

  // 已經是代理 URL 且已有 width 參數，不重複處理
  if (url.includes('notion.so/image') && url.includes('width=')) return url

  const cleanBlockId = (blockId || '').replace(/-/g, '')
  const width = SIZE_PRESETS[size] || SIZE_PRESETS.content

  // Notion AWS 簽名 URL → 代理 URL
  if (
    url.includes('secure.notion-static.com') ||
    url.includes('prod-files-secure') ||
    url.startsWith('attachment:')
  ) {
    // 如果已經是代理 URL（沒有 width），加上壓縮參數
    let proxyUrl =
      NOTION_HOST +
      '/image/' +
      encodeURIComponent(url) +
      '?table=block&id=' +
      cleanBlockId

    if (width > 0) {
      proxyUrl += '&width=' + width + '&cache=v2'
    }

    return proxyUrl
  }

  // 已經是代理 URL 但沒有 width → 補上壓縮參數
  if (url.includes('notion.so/image') && !url.includes('width=') && width > 0) {
    const separator = url.includes('?') ? '&' : '?'
    return url + separator + 'width=' + width + '&cache=v2'
  }

  // 外部 URL 不做轉換
  return url
}

/**
 * 遞迴處理 block 陣列中所有的 image/video URL
 * 直接 mutate block 物件（效能考量）
 * 頁面內容圖片使用 content 壓縮（1080px）
 */
function proxyBlockImages(blocks) {
  if (!blocks || !Array.isArray(blocks)) return blocks

  for (const block of blocks) {
    const blockId = block.id || ''

    // 處理 image block → content 尺寸
    if (block.type === 'image' && block.image) {
      if (block.image.file?.url) {
        block.image.file.url = proxyNotionImage(block.image.file.url, blockId, 'content')
      }
      if (block.image.external?.url) {
        block.image.external.url = proxyNotionImage(block.image.external.url, blockId, 'content')
      }
    }

    // 處理 video block（不壓縮影片）
    if (block.type === 'video' && block.video) {
      if (block.video.file?.url) {
        block.video.file.url = proxyNotionImage(block.video.file.url, blockId, 'full')
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

  // cover → banner 尺寸
  if (page.cover?.type === 'file' && page.cover.file?.url) {
    page.cover.file.url = proxyNotionImage(page.cover.file.url, pageId, 'banner')
  }

  // icon → thumbnail 尺寸
  if (page.icon?.type === 'file' && page.icon.file?.url) {
    page.icon.file.url = proxyNotionImage(page.icon.file.url, pageId, 'thumbnail')
  }

  return page
}

module.exports = { proxyNotionImage, proxyBlockImages, proxyPageCover }
