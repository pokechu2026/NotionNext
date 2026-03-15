import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchAllProjects, fetchProjectPage } from '@/lib/db/notion/fetchPortfolio'
import { DynamicLayout } from '@/themes/theme'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'

/**
 * /portfolio/[id] 單一專案詳細頁
 */
const PortfolioDetailPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPortfolioDetail' {...props} />
}

/**
 * 產生所有專案的靜態路徑
 */
export async function getStaticPaths() {
  const projects = await fetchAllProjects()
  const paths = projects.map(p => ({
    params: { id: p.id.replace(/-/g, '') }
  }))

  return {
    paths,
    fallback: 'blocking' // 新專案第一次訪問時即時產生
  }
}

/**
 * 取得單一專案的資料
 */
export async function getStaticProps({ params, locale }) {
  const { id } = params

  // 取得全站共用資料（Header、Footer 等）
  const props = await fetchGlobalAllData({ from: 'portfolio-detail', locale })

  // 取得專案頁面內容
  const pageData = await fetchProjectPage(id)

  if (!pageData) {
    return { notFound: true }
  }

  props.project = pageData.project
  props.blocks = pageData.blocks

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default PortfolioDetailPage
