/**
 * 穩定的 Notion 圖片代理端點（含伺服器端快取 + 併發限制）
 *
 * 問題：Notion Official API 的 S3 簽名 URL 約 1 小時後過期。
 * ISR 每次重新產生頁面時 URL 會改變，導致瀏覽器快取失效，每次重載都要重新下載。
 *
 * 解決方案：用穩定的 /api/notion-image?id=<blockId|pageId> 取代 S3 URL。
 * URL 基於 ID（不變），讓瀏覽器和 Next.js Image 的快取能跨 ISR 週期持續有效。
 *
 * 效能：每張圖原本要 2～3 次 Notion API 往返；首頁一次載入數十張圖時，
 * 會瞬間超過 Notion 官方 API 速率限制（約 3 req/s），造成圖片卡住或載不出來。
 * 因此加上：
 *   1) 伺服器端記憶體快取（同一張圖只跟 Notion 拿一次，之後所有人秒開）
 *   2) 相同 id 的併發請求去重（in-flight dedup）
 *   3) 對 Notion/S3 的併發上限（避免首次載入一次打爆速率限制）
 *
 * 使用方式：
 *   /api/notion-image?id=<blockId>   → 從 image block 取得圖片
 *   /api/notion-image?id=<pageId>    → 先嘗試 block，再 fallback 到 page cover
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 快取存活 24 小時
const MAX_CACHE_ENTRIES = 400 // 最多快取幾張圖（約 200KB/張 ≈ 80MB 上限）
const MAX_UPSTREAM_CONCURRENCY = 4 // 同時對 Notion/S3 抓圖的上限

// 圖片位元組快取：id -> { buffer, contentType, expiresAt }
const imageCache = new Map()
// 相同 id 的進行中請求：id -> Promise（避免同一張圖同時抓很多次）
const inflight = new Map()

// 極簡併發閘門：確保同時對外抓圖的數量不超過上限
let activeUpstream = 0
const waiters = []
function acquireSlot() {
  if (activeUpstream < MAX_UPSTREAM_CONCURRENCY) {
    activeUpstream++
    return Promise.resolve()
  }
  return new Promise(resolve => waiters.push(resolve))
}
function releaseSlot() {
  const next = waiters.shift()
  if (next) {
    next() // 交棒給下一個等待者，維持 activeUpstream 不變
  } else {
    activeUpstream--
  }
}

function getFromCache(id) {
  const hit = imageCache.get(id)
  if (!hit) return null
  if (hit.expiresAt < Date.now()) {
    imageCache.delete(id)
    return null
  }
  // 觸碰一下讓它移到最新（簡易 LRU）
  imageCache.delete(id)
  imageCache.set(id, hit)
  return hit
}

function putInCache(id, entry) {
  imageCache.set(id, entry)
  // 超過上限時，刪掉最舊的（Map 保留插入順序）
  while (imageCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = imageCache.keys().next().value
    imageCache.delete(oldestKey)
  }
}

// 實際去 Notion 解析 URL 並抓回圖片位元組（受併發閘門保護）
async function fetchImage(id, headers) {
  await acquireSlot()
  try {
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
      return { status: 404, error: 'image not found' }
    }

    // 3. 從 Notion（S3）取得圖片
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) {
      return { status: 502, error: 'failed to fetch image from source' }
    }
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await imgRes.arrayBuffer())
    return { status: 200, buffer, contentType }
  } finally {
    releaseSlot()
  }
}

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

  const sendImage = (entry, cacheState) => {
    res.setHeader('Content-Type', entry.contentType)
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
    )
    res.setHeader('X-Image-Cache', cacheState) // HIT / MISS，方便除錯
    res.end(entry.buffer)
  }

  try {
    // (a) 先看伺服器快取
    const cached = getFromCache(id)
    if (cached) {
      return sendImage(cached, 'HIT')
    }

    // (b) 若同一張圖已有進行中的請求，就共用它，避免重複抓
    let promise = inflight.get(id)
    if (!promise) {
      promise = fetchImage(id, headers).finally(() => inflight.delete(id))
      inflight.set(id, promise)
    }
    const result = await promise

    if (result.status !== 200) {
      return res.status(result.status).json({ error: result.error })
    }

    const entry = {
      buffer: result.buffer,
      contentType: result.contentType,
      expiresAt: Date.now() + CACHE_TTL_MS
    }
    putInCache(id, entry)
    return sendImage(entry, 'MISS')
  } catch (err) {
    console.error('[notion-image] error:', err)
    return res.status(502).json({ error: 'upstream fetch failed' })
  }
}
