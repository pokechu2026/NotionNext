'use client'
import { useState, useMemo } from 'react'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'

/**
 * 教學案例總覽頁面元件（/course-case）
 * 結構：頁面標題 → 篩選器 → 卡片列表
 * 參照 AI 課程頁面渲染包裝
 */
export const TeachingCasePage = ({ posts = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 取得所有分類選項
  const categories = useMemo(() => {
    const set = new Set(posts.map(p => p.category).filter(Boolean))
    return Array.from(set).sort()
  }, [posts])

  // 篩選
  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter(p => p.category === selectedCategory)
  }, [posts, selectedCategory])

  // 分類對應顏色
  const categoryColor = cat => {
    switch (cat) {
      case '課程回顧':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      case '授課實績':
        return 'bg-green-500/15 text-green-400 border-green-500/30'
      case '技術分享':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
      case '心情隨筆':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  return (
    <>
      {/* ====== 教學案例列表區 ====== */}
      <section className='bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]'>
        <div className='container mx-auto'>
          {/* 頁面標題 */}
          <div className='mx-auto mb-10 max-w-[600px] text-center'>
            <h1 className='mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
              AI 應用教學案例
            </h1>
            <p className='text-base text-body-color dark:text-dark-6'>
              實戰導向的教學分享，從課程回顧到技術應用一覽無遺
            </p>
          </div>

          {/* 篩選器 */}
          <div className='mb-10 flex flex-wrap justify-center gap-4'>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className='rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-dark-2 px-4 py-2 text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'>
              <option value='all'>所有分類</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <span className='flex items-center text-sm text-body-color dark:text-dark-6'>
              共 {filtered.length} 篇案例
            </span>
          </div>

          {/* 案例卡片列表 */}
          <div className='-mx-4 flex flex-wrap'>
            {filtered.map((post, index) => (
              <div
                key={post.id || index}
                className='w-full px-4 md:w-1/2 lg:w-1/3'>
                <SmartLink href={post?.href} className='block'>
                  <div
                    className='wow fadeInUp group mb-8 rounded-xl border border-gray-200 dark:border-[#333333] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-800 cursor-pointer'
                    data-wow-delay={`${0.1 + (index % 6) * 0.05}s`}>
                    {/* 縮圖 — 16:9 比例 */}
                    <div className='overflow-hidden bg-gray-100 dark:bg-dark-2'>
                      {post.pageCoverThumbnail ? (
                        <LazyImage
                          src={post.pageCoverThumbnail}
                          alt={post.title}
                          className='w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                      ) : (
                        <div className='w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center'>
                          <svg className='w-12 h-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className='p-5'>
                      {/* 標題 */}
                      <h3 className='mb-3 text-lg font-bold text-dark dark:text-white leading-snug line-clamp-2'>
                        {post.title}
                      </h3>

                      {/* 分類標籤 + 日期 */}
                      <div className='mb-3 flex flex-wrap items-center gap-2'>
                        {post.category && (
                          <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${categoryColor(post.category)}`}>
                            {post.category}
                          </span>
                        )}
                        {post.publishDate && (
                          <span className='text-xs text-body-color dark:text-dark-6'>
                            {new Date(post.publishDate).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {/* 摘要 */}
                      {post.summary && (
                        <p className='text-sm text-body-color dark:text-dark-6 line-clamp-2'>
                          {post.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </SmartLink>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className='text-center py-20 text-body-color dark:text-dark-6'>
              目前沒有符合條件的案例
            </div>
          )}
        </div>
      </section>
    </>
  )
}
