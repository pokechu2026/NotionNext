import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  try {
    // Notion数据库中的第几个视图用于站点展示和排序：
    const groupIndex = BLOG.NOTION_INDEX || 0
    if (viewIds && viewIds.length > 0) {
      const ids = collectionQuery[collectionId][viewIds[groupIndex]]?.collection_group_results?.blockIds || []
      if (ids) {
        for (const id of ids) {
          pageIds.push(id)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching page IDs from collectionQuery:', error.message);
    // 不 return，繼續嘗試後面的 fallback
  }

  // Fallback 1: 从 collectionQuery 原始排序（table 视图）
  if (pageIds.length === 0 && collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId] || {}).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
  }

  // Fallback 2: 從 collection_view.page_sort 取得 (Notion API 新格式，collection_query 為空時)
  if (pageIds.length === 0 && collectionView && viewIds?.length > 0) {
    const pageSet = new Set()
    for (const viewId of viewIds) {
      const viewOuter = collectionView[viewId]?.value
      // 相容新舊兩種格式：新格式多一層 { value: {...}, role: '...' }
      const viewData = viewOuter?.page_sort ? viewOuter : (viewOuter?.value ?? viewOuter)
      viewData?.page_sort?.forEach(id => pageSet.add(id))
    }
    pageIds = [...pageSet]
    if (pageIds.length > 0) {
      console.log('[getAllPageIds] Fallback: 從 collection_view.page_sort 取得', pageIds.length, '筆')
    }
  }

  return pageIds
}
