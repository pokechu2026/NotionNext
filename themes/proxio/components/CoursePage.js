'use client'
import { useState, useMemo } from 'react'
import NotionImage from '@/components/NotionImage'
import SmartLink from '@/components/SmartLink'

/**
 * 課程總覽頁面元件（/course）
 * 結構：封面橫幅 → 課程卡片列表（含篩選） → 講師簡介
 */
export const CoursePage = ({
  courses = [],
  bannerUrl = null,
  lecturerBlocks = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  // 取得所有分類和難度選項
  const categories = useMemo(() => {
    const set = new Set(courses.map(c => c.category).filter(Boolean))
    return Array.from(set).sort()
  }, [courses])

  const difficulties = useMemo(() => {
    const order = ['入門', '進階', '實戰']
    const set = new Set(courses.map(c => c.difficulty).filter(Boolean))
    return Array.from(set).sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [courses])

  // 篩選
  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory)
        return false
      if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty)
        return false
      return true
    })
  }, [courses, selectedCategory, selectedDifficulty])

  // 難度對應顏色
  const difficultyColor = level => {
    switch (level) {
      case '入門':
        return 'bg-green-500/15 text-green-400 border-green-500/30'
      case '進階':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
      case '實戰':
        return 'bg-red-500/15 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <>
      {/* ====== 封面橫幅 ====== */}
      {bannerUrl && (
        <div className='w-full'>
          <NotionImage
            src={bannerUrl}
            alt='課程總覽'
            size='banner'
            className='w-full h-auto object-cover'
            priority
          />
        </div>
      )}

      {/* ====== 課程列表區 ====== */}
      <section className='bg-white pb-10 pt-14 dark:bg-dark lg:pb-20 lg:pt-20'>
        <div className='container mx-auto'>
          {/* 頁面標題 */}
          <div className='mx-auto mb-10 max-w-[600px] text-center'>
            <h1 className='mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
              AI 課程總覽
            </h1>
            <p className='text-base text-body-color dark:text-dark-6'>
              專為企業、學校與個人打造的 AI 應用課程，從入門到進階一應俱全
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

            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className='rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-dark-2 px-4 py-2 text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'>
              <option value='all'>所有難度</option>
              {difficulties.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <span className='flex items-center text-sm text-body-color dark:text-dark-6'>
              共 {filtered.length} 門課程
            </span>
          </div>

          {/* 課程卡片列表 */}
          <div className='-mx-4 flex flex-wrap'>
            {filtered.map((course, index) => (
              <div
                key={course.id || index}
                className='w-full px-4 md:w-1/2 lg:w-1/3'>
                <SmartLink
                  href={`/course/${course.id.replace(/-/g, '')}`}
                  className='block'>
                  <div
                    className='wow fadeInUp group mb-8 rounded-xl border border-gray-200 dark:border-[#333333] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-800 cursor-pointer'
                    data-wow-delay={`${0.1 + (index % 6) * 0.05}s`}>
                    {/* 縮圖 - 使用 Next.js Image 自動壓縮 */}
                    <div className='h-48 overflow-hidden bg-gray-100 dark:bg-dark-2'>
                      <NotionImage
                        src={course.cover}
                        alt={course.title}
                        size='thumbnail'
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>

                    <div className='p-5'>
                      <h3 className='mb-3 text-lg font-bold text-dark dark:text-white leading-snug'>
                        {course.title}
                      </h3>

                      <div className='mb-3 flex flex-wrap items-center gap-2'>
                        {course.category && (
                          <span className='inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary'>
                            {course.category}
                          </span>
                        )}
                        {course.difficulty && (
                          <span
                            className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${difficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                        )}
                      </div>

                      <div className='flex items-center gap-4 text-sm text-body-color dark:text-dark-6'>
                        {course.suggestedTime && (
                          <span className='flex items-center gap-1'>
                            <svg
                              className='h-4 w-4'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                            </svg>
                            {course.suggestedTime}
                          </span>
                        )}
                        {course.software && course.software.length > 0 && (
                          <span className='truncate'>
                            {course.software.join(' · ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </SmartLink>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className='text-center py-20 text-body-color dark:text-dark-6'>
              目前沒有符合條件的課程
            </div>
          )}
        </div>
      </section>

      {/* ====== 講師簡介區（Notion 同步區塊） ====== */}
      {lecturerBlocks.length > 0 && (
        <section className='bg-white dark:bg-dark pb-10 lg:pb-20'>
          <div className='container mx-auto max-w-4xl px-4'>
            <NotionBlockRenderer blocks={lecturerBlocks} />
          </div>
        </section>
      )}
    </>
  )
}

/**
 * 簡易 Notion Block 渲染器
 * 支援基本區塊類型：文字、標題、圖片、清單、分隔線、欄位、callout、synced_block
 */
const NotionBlockRenderer = ({ blocks = [] }) => {
  return (
    <div className='notion-blocks space-y-4'>
      {blocks.map((block, i) => (
        <NotionBlock key={block.id || i} block={block} />
      ))}
    </div>
  )
}

const NotionBlock = ({ block }) => {
  const type = block.type
  const children = block.children

  // 取得 rich_text 的純文字和樣式
  const renderRichText = richText => {
    if (!richText || richText.length === 0) return null
    return richText.map((t, i) => {
      let el = t.plain_text
      const a = t.annotations || {}
      if (a.bold) el = <strong key={i}>{el}</strong>
      else if (a.italic) el = <em key={i}>{el}</em>
      else if (a.code)
        el = (
          <code
            key={i}
            className='bg-gray-100 dark:bg-dark-2 px-1 rounded text-sm'>
            {el}
          </code>
        )
      else if (t.href)
        el = (
          <a
            key={i}
            href={t.href}
            className='text-primary underline'
            target='_blank'
            rel='noreferrer'>
            {el}
          </a>
        )
      else el = <span key={i}>{el}</span>
      return el
    })
  }

  switch (type) {
    case 'synced_block':
      // 渲染同步區塊的子內容
      return children ? <NotionBlockRenderer blocks={children} /> : null

    case 'paragraph':
      return (
        <p className='text-base text-body-color dark:text-dark-6 leading-relaxed'>
          {renderRichText(block.paragraph?.rich_text)}
        </p>
      )

    case 'heading_1':
      return (
        <h2 className='text-2xl font-bold text-dark dark:text-white mt-8 mb-4'>
          {renderRichText(block.heading_1?.rich_text)}
        </h2>
      )

    case 'heading_2':
      return (
        <h3 className='text-xl font-bold text-dark dark:text-white mt-6 mb-3'>
          {renderRichText(block.heading_2?.rich_text)}
        </h3>
      )

    case 'heading_3':
      return (
        <h4 className='text-lg font-semibold text-dark dark:text-white mt-4 mb-2'>
          {renderRichText(block.heading_3?.rich_text)}
        </h4>
      )

    case 'bulleted_list_item':
      return (
        <li className='text-base text-body-color dark:text-dark-6 ml-5 list-disc'>
          {renderRichText(block.bulleted_list_item?.rich_text)}
          {children && (
            <ul className='mt-1'>
              <NotionBlockRenderer blocks={children} />
            </ul>
          )}
        </li>
      )

    case 'numbered_list_item':
      return (
        <li className='text-base text-body-color dark:text-dark-6 ml-5 list-decimal'>
          {renderRichText(block.numbered_list_item?.rich_text)}
          {children && (
            <ol className='mt-1'>
              <NotionBlockRenderer blocks={children} />
            </ol>
          )}
        </li>
      )

    case 'image': {
      const url =
        block.image?.file?.url || block.image?.external?.url || null
      if (!url) return null
      return (
        <figure className='my-4'>
          <NotionImage
            src={url}
            alt={
              block.image?.caption?.map(t => t.plain_text).join('') || ''
            }
            size='content'
            className='w-full rounded-lg'
          />
          {block.image?.caption?.length > 0 && (
            <figcaption className='mt-2 text-center text-sm text-body-color dark:text-dark-6'>
              {block.image.caption.map(t => t.plain_text).join('')}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'divider':
      return <hr className='border-gray-200 dark:border-[#333] my-6' />

    case 'callout':
      return (
        <div className='flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-dark-2 my-4'>
          {block.callout?.icon?.emoji && (
            <span className='text-xl'>{block.callout.icon.emoji}</span>
          )}
          <div className='text-base text-body-color dark:text-dark-6'>
            {renderRichText(block.callout?.rich_text)}
            {children && <NotionBlockRenderer blocks={children} />}
          </div>
        </div>
      )

    case 'quote':
      return (
        <blockquote className='border-l-4 border-primary pl-4 my-4 text-body-color dark:text-dark-6 italic'>
          {renderRichText(block.quote?.rich_text)}
        </blockquote>
      )

    case 'column_list':
      return (
        <div className='flex flex-wrap gap-4 my-4'>
          {children &&
            children.map((col, i) => (
              <div key={col.id || i} className='flex-1 min-w-[200px]'>
                {col.children && (
                  <NotionBlockRenderer blocks={col.children} />
                )}
              </div>
            ))}
        </div>
      )

    case 'column':
      // column 的子內容由 column_list 處理
      return children ? <NotionBlockRenderer blocks={children} /> : null

    case 'toggle':
      return (
        <details className='my-2'>
          <summary className='cursor-pointer text-dark dark:text-white font-medium'>
            {renderRichText(block.toggle?.rich_text)}
          </summary>
          <div className='pl-4 mt-2'>
            {children && <NotionBlockRenderer blocks={children} />}
          </div>
        </details>
      )

    default:
      return null
  }
}
