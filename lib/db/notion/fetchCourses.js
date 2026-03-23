/**
 * 從 Notion 資料庫讀取「課程」清單
 * DB ID: 31b026255e6b80568efdc9180de7a0be (Choosehill AI Course)
 *
 * 欄位：課程名稱 (title)、課程分類 (select)、難度等級 (select)、
 *        建議時段 (select)、課程時數/hr (number)、授課軟體 (multi_select)
 *
 * 縮圖來源：各課程頁面的第一個 image block（頁面內容）
 */

const COURSE_DB_ID = '31b026255e6b80568efdc9180de7a0be'

/**
 * 查詢課程資料庫
 */
async function queryCourseDB() {
  const token = process.env.NOTION_ACCESS_TOKEN
  if (!token) {
    console.warn('[Course] NOTION_ACCESS_TOKEN not set, skipping course fetch')
    return []
  }

  const url = `https://api.notion.com/v1/databases/${COURSE_DB_ID}/query`
  const headers = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  }

  try {
    let allResults = []
    let hasMore = true
    let startCursor = undefined

    while (hasMore) {
      const reqBody = {}
      if (startCursor) reqBody.start_cursor = startCursor

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(reqBody)
      })

      if (!res.ok) {
        console.error('[Course] Notion API error:', res.status, await res.text())
        return []
      }

      const data = await res.json()
      allResults = allResults.concat(data.results || [])
      hasMore = data.has_more
      startCursor = data.next_cursor
    }

    // 解析每筆課程，並抓取縮圖
    const courses = await Promise.all(allResults.map(page => parseCourse(page, headers)))
    return courses
  } catch (err) {
    console.error('[Course] Failed to fetch:', err)
    return []
  }
}

/**
 * 解析單筆 Notion page 為課程物件
 * 並從頁面內容抓取第一張圖片作為縮圖
 */
async function parseCourse(page, headers) {
  const props = page.properties || {}

  // 課程名稱 (title)
  const titleProp = props['課程名稱'] || {}
  const title = titleProp?.title?.map(t => t.plain_text).join('') || ''

  // 課程分類 (select)
  const category = props['課程分類']?.select?.name || ''

  // 難度等級 (select)
  const difficulty = props['難度等級']?.select?.name || ''

  // 建議時段 (select)
  const suggestedTime = props['建議時段']?.select?.name || ''

  // 課程時數/hr (number)
  const hours = props['課程時數/hr']?.number || null

  // 授課軟體 (multi_select)
  const software = (props['授課軟體']?.multi_select || []).map(s => s.name)

  // 縮圖：優先 page cover，否則抓取頁面第一張圖片
  let cover = null

  // 嘗試 page cover
  if (page.cover) {
    if (page.cover.type === 'external') {
      cover = page.cover.external?.url || null
    } else if (page.cover.type === 'file') {
      cover = page.cover.file?.url || null
    }
  }

  // 沒有 cover，抓頁面第一個 image block
  if (!cover) {
    cover = await fetchFirstImage(page.id, headers)
  }

  return {
    id: page.id,
    title,
    category,
    difficulty,
    suggestedTime,
    hours,
    software,
    cover
  }
}

/**
 * 抓取頁面的第一個 image block URL
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
    console.warn('[Course] Failed to fetch first image for', pageId, err)
    return null
  }
}

/**
 * 取得所有課程
 */
async function fetchAllCourses() {
  return queryCourseDB()
}

/**
 * 取得課程總覽頁的額外內容（封面圖 + 講師簡介區塊）
 * 頁面 ID: 32c026255e6b809fb273d3c2ac2c15ab
 *
 * 頁面結構：
 *   block 0: image（封面橫幅）
 *   block 1: 空行
 *   block 2: child_database（課程資料庫 — 由 CourseList 取代）
 *   block 3: synced_block（講師簡介）
 */
const COURSE_PAGE_ID = '32c026255e6b809fb273d3c2ac2c15ab'

async function fetchCoursePageContent() {
  const token = process.env.NOTION_ACCESS_TOKEN
  if (!token) return { bannerUrl: null, lecturerBlocks: [] }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28'
  }

  try {
    // 取得頂層 blocks
    const res = await fetch(
      `https://api.notion.com/v1/blocks/${COURSE_PAGE_ID}/children?page_size=50`,
      { headers }
    )
    if (!res.ok) return { bannerUrl: null, lecturerBlocks: [] }

    const data = await res.json()
    const blocks = data.results || []

    // 封面圖：第一個 image block
    let bannerUrl = null
    const imageBlock = blocks.find(b => b.type === 'image')
    if (imageBlock) {
      bannerUrl =
        imageBlock.image?.file?.url ||
        imageBlock.image?.external?.url ||
        null
    }

    // 講師簡介：synced_block 及其後面所有 block（排除 child_database 和 image）
    const lecturerBlocks = []
    let foundSynced = false
    for (const block of blocks) {
      if (block.type === 'synced_block') foundSynced = true
      if (foundSynced) {
        // 遞迴取得子 block
        const enriched = await enrichBlock(block, headers)
        lecturerBlocks.push(enriched)
      }
    }

    return { bannerUrl, lecturerBlocks }
  } catch (err) {
    console.error('[Course] Failed to fetch page content:', err)
    return { bannerUrl: null, lecturerBlocks: [] }
  }
}

/**
 * 遞迴取得 block 的子內容
 */
async function enrichBlock(block, headers) {
  const result = { ...block }

  if (block.has_children || block.type === 'synced_block') {
    // 如果是 synced_block 且有 synced_from，取原始來源的子 block
    let fetchId = block.id
    if (
      block.type === 'synced_block' &&
      block.synced_block?.synced_from?.block_id
    ) {
      fetchId = block.synced_block.synced_from.block_id
    }

    try {
      const res = await fetch(
        `https://api.notion.com/v1/blocks/${fetchId}/children?page_size=100`,
        { headers }
      )
      if (res.ok) {
        const data = await res.json()
        result.children = await Promise.all(
          (data.results || []).map(child => enrichBlock(child, headers))
        )
      }
    } catch {
      // 原始同步區塊可能未共享給 integration，靜默失敗
    }
  }

  return result
}

/**
 * 取得單一課程頁面資料（metadata + blocks）
 * 用於 /course/[id] 詳細頁 SSG
 */
async function fetchCoursePage(pageId) {
  const token = process.env.NOTION_ACCESS_TOKEN
  if (!token) {
    console.warn('[Course] NOTION_ACCESS_TOKEN not set')
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
      console.error('[Course] Page fetch error:', pageRes.status)
      return null
    }
    const page = await pageRes.json()
    const course = await parseCourse(page, headers)

    // 2. 取得頁面所有 blocks（子內容）
    const blocks = await fetchAllBlocks(pageId, headers)

    return { course, blocks }
  } catch (err) {
    console.error('[Course] fetchCoursePage error:', err)
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

  // 遞迴取得有 children 的 block（含 synced_block 特殊處理）
  for (const block of allBlocks) {
    if (block.has_children || block.type === 'synced_block') {
      // synced_block 需從原始來源取得子內容
      let fetchId = block.id
      if (
        block.type === 'synced_block' &&
        block.synced_block?.synced_from?.block_id
      ) {
        fetchId = block.synced_block.synced_from.block_id
      }

      try {
        block.children = await fetchAllBlocks(fetchId, headers)
      } catch {
        // 原始同步區塊可能未共享給 integration，靜默失敗
      }
    }
  }

  return allBlocks
}

module.exports = { fetchAllCourses, fetchCoursePageContent, fetchCoursePage }
