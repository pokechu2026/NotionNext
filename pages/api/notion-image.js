/**
 * 穩定的 Notion 圖片代理端點
 *
 * 問題：Notion Official API 的 S3 簽名 URL 約 1 小時後過期。
 * ISR 每次重新產生頁面時 URL 會改變，導致瀏覽器快取失效，每次重載都要重新下載。
 *
 * 解決方案：用穩定的 /api/notion-image?id=<blockId|pageId> 取代 S3 URL。
 * URL 基於 ID（不變），讓瀏覽器和 Next.js Image 的快取能跨 ISR 週期持續有效。
 *
 * 使用方式：
 *   /api/notion-image?id=<blockId>   → 從 image block 取得圖片
 *   /api/notion-image?id=<pageId>    → 先嘗試 block，再 fallback 到 page cover
 */
export default async function handler(req, res) {
  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'missing id' })
  }

  const token = process.env.NOTION_ACCESS_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'server config error' })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28'
  }

  let imageUrl = null

  // 1. 嘗試當作 block ID 取得（image block）
  try {
    const blockRes = await fetch(`https://api.notion.com/v1/blocks/${id}`, { headers })
    if (blockRes.ok) {
      const block = await blockRes.json()
      if (block.type === 'image') {
        imageUrl = block.image?.file?.url || block.image?.external?.url || null
      }
    }
  } catch {
    // 忽略，繼續嘗試 page
  }

  // 2. Fallback：嘗試當作 page ID 取得 page cover
  if (!imageUrl) {
    try {
      const pageRes = await fetch(`https://api.notion.com/v1/pages/${id}`, { headers })
      if (pageRes.ok) {
        const page = await pageRes.json()
        imageUrl = page.cover?.file?.url || page.cover?.external?.url || null
      }
    } catch {
      // 忽略
    }
  }

  if (!imageUrl) {
    return res.status(404).json({ error: 'image not found' })
  }

  // 3. 從 Notion（S3）取得圖片並轉發
  try {
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) {
      return res.status(502).json({ error: 'failed to fetch image from source' })
    }

    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const buffer = await imgRes.arrayBuffer()

    // 長效快取：CDN 快取 24h，瀏覽器 24h，允許 stale-while-revalidate
    res.setHeader('Content-Type', contentType)
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
    )
    res.end(Buffer.from(buffer))
  } catch (err) {
    console.error('[notion-image] fetch error:', err)
    return res.status(502).json({ error: 'upstream fetch failed' })
  }
}
