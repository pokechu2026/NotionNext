import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchAllProjects } from '@/lib/db/notion/fetchPortfolio'
import { DynamicLayout } from '@/themes/theme'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'

/**
 * /portfolio 作品集完整頁面
 */
const PortfolioPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPortfolio' {...props} />
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'portfolio', locale })

  // 取得全部作品
  try {
    props.portfolioProjects = await fetchAllProjects()
  } catch (err) {
    console.error('[Portfolio] Failed to fetch all projects:', err)
    props.portfolioProjects = []
  }

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

export default PortfolioPage
