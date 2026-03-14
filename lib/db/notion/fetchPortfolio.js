/**
 * 從獨立 Notion 資料庫讀取「代表專案」作品集
 * DB ID 由 themes/proxio/config.js 的 PROXIO_PORTFOLIO_DB_ID 設定
 */

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

    return allResults.map(parseProject)
  } catch (err) {
    console.error('[Portfolio] Failed to fetch:', err)
    return []
  }
}

/**
 * 解析單個 Notion page 為專案物件
 */
function parseProject(page) {
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

  // 圖片 - 優先從 page icon 取得（Notion 頁面內容圖），其次從 cover 取得
  let cover = null
  const iconSource = page.icon
  const coverSource = page.cover
  if (iconSource && iconSource.type !== 'emoji') {
    if (iconSource.type === 'external') {
      cover = iconSource.external?.url || null
    } else if (iconSource.type === 'file') {
      cover = iconSource.file?.url || null
    }
  }
  if (!cover && coverSource) {
    if (coverSource.type === 'external') {
      cover = coverSource.external?.url || null
    } else if (coverSource.type === 'file') {
      cover = coverSource.file?.url || null
    }
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

module.exports = { fetchFeaturedProjects, fetchAllProjects }
