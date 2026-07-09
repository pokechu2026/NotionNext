/**
 * 統一的 Notion API 請求工具
 * - fetchNotionWithRetry：遇到 429（速率限制）或 5xx 自動重試，避免頁面內容抓一半就放棄
 * - mapWithConcurrency：限制併發數量的平行處理，避免一次發太多請求反而觸發限流
 *
 * 注意：頁面內容是遞迴抓取的（block 底下還有 block），如果每一層各自平行處理，
 * 實際同時發出的請求數會隨遞迴深度疊加、遠超限制。因此真正的併發上限放在
 * fetchNotionWithRetry 裡，用一個「全域」的請求名額（不分層級）統一控管。
 */

const MAX_CONCURRENT_NOTION_REQUESTS = 6
let activeRequests = 0
const waitQueue = []

function acquireSlot() {
  return new Promise(resolve => {
    const tryAcquire = () => {
      if (activeRequests < MAX_CONCURRENT_NOTION_REQUESTS) {
        activeRequests++
        resolve()
      } else {
        waitQueue.push(tryAcquire)
      }
    }
    tryAcquire()
  })
}

function releaseSlot() {
  activeRequests--
  const next = waitQueue.shift()
  if (next) next()
}

async function fetchNotionWithRetry(url, options = {}, maxRetries = 4) {
  let res
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // 只有實際發送請求時才佔用名額，等待重試(backoff)時要釋放，
    // 不然少數被限流的請求會卡住名額，反而拖慢其他所有請求
    await acquireSlot()
    try {
      res = await fetch(url, options)
    } finally {
      releaseSlot()
    }

    if (res.ok) return res

    const shouldRetry = (res.status === 429 || res.status >= 500) && attempt < maxRetries
    if (!shouldRetry) return res

    const retryAfterHeader = res.headers.get('retry-after')
    const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : null
    const backoffMs = retryAfterMs || Math.min(1000 * 2 ** attempt, 8000)
    await new Promise(resolve => setTimeout(resolve, backoffMs))
  }
  return res
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let index = 0

  async function worker() {
    while (index < items.length) {
      const current = index++
      results[current] = await mapper(items[current], current)
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker)
  await Promise.all(workers)
  return results
}

module.exports = { fetchNotionWithRetry, mapWithConcurrency }
