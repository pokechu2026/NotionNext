/**
 * 從獨立 Notion 資料庫讀取「代表專案」作品集
 * DB ID 由 themes/proxio/config.js 的 PROXIO_PORTFOLIO_DB_ID 設定
 */

const { proxyNotionImage, proxyBlockImages, proxyPageCover } = require('./notionImgProxy')

const PORTFOLIO_DB_ID = '8bc026255e6b829d8dd581c91a3fb7d4'

/**
 * 查詢 Notion 資料庫
 * @param {Object} filter - Notion filter object (optional)
 * @returns {Array} 格式化的專案陣列
 */
async function queryPortfolioDB(filter) {
  const token = process.env.NOTION_ACCESS_TOKEN
  if (!token) {
    console.warn('[Portfolio] NOTION_ACCESS_TOKEN not set, skipping portfolio fetch')
    return []
  }

  const url = `https://api.notion.com/v1/databases/${PORTFOLIO_DB_ID}/query`
  const body = {
    sorts: [{ property: 'year', direction: 'descending' }]
  }
  if (filter) {
    body.filter = filter
  }

  try {
    let allResults = []
    let hasMore = true
    let startCursor = undefined

    while (hasMore) {
      const reqBody = { ...body }
      if (startCursor) reqBody.start_cursor = startCursor

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      })

      if (!res.ok) {
        console.error('[Portfolio] Notion API error:', res.status, await res.text())
        return []
      }

      const data = await res.json()
      allResults = allResults.concat(data.results || [])
      hasMore = data.has_more
      startCursor = data.next_cursor
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
    return Promise.all(allResults.map(page => parseProject(page, headers)))
  } catch (err) {
    console.error('[Portfolio] Failed to fetch:', err)
    return []
  }
}

/**
 * 解析單個 Notion page 為專案物件
 * @param {Object} page - Notion page object
 * @param {Object} headers - API headers (用於抓取縮圖)
 */
async function parseProject(page, headers) {
  const props = page.properties || {}

  // title
  const titleProp = props['Project Name'] || props['Name'] || {}
  const title = titleProp?.title?.map(t => t.plain_text).join('') || ''

  // year (select)
  const year = props['year']?.select?.name || ''

  // Role (multi_select)
  const roles = (props['Role']?.multi_select || []).map(r => r.name)

  // 合作單位 (select)
  const unit = props['合作單位']?.select?.name || ''

  // Featured (checkbox)
  const featured = props['Featured']?.checkbox || false

  // Metric (rich_text)
  const metric = (props['Metric']?.rich_text || []).map(t => t.plain_text).join('')

  // 縮圖：優先 page cover → page icon → 頁面第一張圖片
  let cover = null
  const coverSource = page.cover
  const iconSource = page.icon

  if (coverSource) {
    if (coverSource.type === 'external') {
      cover = coverSource.external?.url || null
    } else if (coverSource.type === 'file') {
      cover = coverSource.file?.url || null
    }
  }
  if (!cover && iconSource && iconSource.type !== 'emoji') {
    if (iconSource.type === 'external') {
      cover = iconSource.external?.url || null
    } else if (iconSource.type === 'file') {
      cover = iconSource.file?.url || null
    }
  }

  // 沒有 cover/icon，抓頁面第一個 image block
  if (!cover && headers) {
    cover = await fetchFirstImage(page.id, headers)
  }

  // Notion 頁面連結
  const url = page.url || `https://notion.so/${page.id.replace(/-/g, '')}`

  return {
    id: page.id,
    title,
    year,
    roles,
    unit,
    featured,
    metric,
    cover,
    url
  }
}

/**
 * 抓取頁面的第一個 image block URL（縮圖來源）
 */
async function fetchFirstImage(pageId, headers) {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children?page_size=10`,
      { headers }
    )
    if (!res.ok) return null

    const data = await res.json()
    for (const block of data.results || []) {
      if (block.type === 'image') {
        return block.image?.file?.url || block.image?.external?.url || null
      }
    }
    return null
  } catch (err) {
    console.warn('[Portfolio] Failed to fetch first image for', pageId, err)
    return null
  }
}

/**
 * 取得所有 Featured 專案
 */
async function fetchFeaturedProjects() {
  return queryPortfolioDB({
    property: 'Featured',
    checkbox: { equals: true }
  })
}

/**
 * 取得全部專案（按年份倒序）
 */
async function fetchAllProjects() {
  return queryPortfolioDB()
}

/**
 * 取得單一專案的 Notion 頁面資料（metadata + blockMap）
 * 用於 /portfolio/[id] 詳細頁 SSG
 */
async function fetchProjectPage(pageId) {
  const token = process.env.NOTION_ACCESS_TOKEN
  if (!token) {
    console.warn('[Portfolio] NOTION_ACCESS_TOKEN not set')
    return null
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  }

  try {
    // 1. 取得頁面 metadata
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, { headers })
    if (!pageRes.ok) {
      console.error('[Portfolio] Page fetch error:', pageRes.status)
      return null
    }
    const page = await pageRes.json()
    const project = parseProject(page)

    // 2. 取得頁面所有 blocks（子內容）
    const blocks = await fetchAllBlocks(pageId, headers)

    // 將所有圖片 URL 轉為代理 URL（防止 AWS 簽名過期）
    proxyBlockImages(blocks)

    return { project, blocks }
  } catch (err) {
    console.error('[Portfolio] fetchProjectPage error:', err)
    return null
  }
}

/**
 * 遞迴取得頁面所有 blocks（含分頁 + 子 block）
 */
async function fetchAllBlocks(blockId, headers) {
  let allBlocks = []
  let hasMore = true
  let startCursor = undefined

  while (hasMore) {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`)
    if (startCursor) url.searchParams.set('start_cursor', startCursor)

    const res = await fetch(url.toString(), { headers })
    if (!res.ok) break

    const data = await res.json()
    allBlocks = allBlocks.concat(data.results || [])
    hasMore = data.has_more
    startCursor = data.next_cursor
  }

  // 遞迴取得有 children 的 block
  for (const block of allBlocks) {
    if (block.has_children) {
      block.children = await fetchAllBlocks(block.id, headers)
    }
  }

  return allBlocks
}

module.exports = { fetchFeaturedProjects, fetchAllProjects, fetchProjectPage }
