import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchAllCourses, fetchCoursePage } from '@/lib/db/notion/fetchCourses'
import { DynamicLayout } from '@/themes/theme'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'

/**
 * /course/[id] 單一課程詳細頁
 */
const CourseDetailPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutCourseDetail' {...props} />
}

/**
 * 產生所有課程的靜態路徑
 */
export async function getStaticPaths() {
  const courses = await fetchAllCourses()
  const paths = courses.map(c => ({
    params: { id: c.id.replace(/-/g, '') }
  }))

  return {
    paths,
    fallback: 'blocking' // 新課程第一次訪問時即時產生
  }
}

/**
 * 取得單一課程的資料
 */
export async function getStaticProps({ params, locale }) {
  const { id } = params

  // 取得全站共用資料（Header、Footer 等）
  const props = await fetchGlobalAllData({ from: 'course-detail', locale })

  // 取得課程頁面內容
  const pageData = await fetchCoursePage(id)

  if (!pageData) {
    return { notFound: true }
  }

  props.course = pageData.course
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

export default CourseDetailPage
