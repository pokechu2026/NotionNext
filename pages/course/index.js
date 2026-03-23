import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchAllCourses, fetchCoursePageContent } from '@/lib/db/notion/fetchCourses'
import { DynamicLayout } from '@/themes/theme'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'

/**
 * /course 課程總覽頁面
 * 結構：封面橫幅 → 課程卡片列表 → 講師簡介（Notion 同步區塊）
 */
const CourseListPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutCourse' {...props} />
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'course', locale })

  // 取得全部課程
  try {
    props.courses = await fetchAllCourses()
  } catch (err) {
    console.error('[Course] Failed to fetch all courses:', err)
    props.courses = []
  }

  // 取得課程頁面的封面圖和講師簡介
  try {
    const { bannerUrl, lecturerBlocks } = await fetchCoursePageContent()
    props.courseBannerUrl = bannerUrl
    props.courseLecturerBlocks = lecturerBlocks
  } catch (err) {
    console.error('[Course] Failed to fetch page content:', err)
    props.courseBannerUrl = null
    props.courseLecturerBlocks = []
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

export default CourseListPage
