'use client'
import { useEffect } from 'react'
import SmartLink from '@/components/SmartLink'
import NotionImage from '@/components/NotionImage'

/**
 * Notion block → HTML 渲染器
 * 支援常見的 Notion 區塊類型
 */
function renderBlock(block, depth = 0) {
  const { type, id } = block
  const value = block[type]

  switch (type) {
    case 'synced_block':
      return block.children
        ? block.children.map(child => renderBlock(child, depth))
        : null

    case 'paragraph':
      return (
        <p key={id} className='mb-4 text-base leading-relaxed text-body-color dark:text-dark-6'>
          {renderRichText(value?.rich_text)}
        </p>
      )

    case 'heading_1':
      return (
        <h1 key={id} className='mb-4 mt-8 text-3xl font-bold text-dark dark:text-white'>
          {renderRichText(value?.rich_text)}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 key={id} className='mb-3 mt-6 text-2xl font-bold text-dark dark:text-white'>
          {renderRichText(value?.rich_text)}
        </h2>
      )

    case 'heading_3':
      return (
        <h3 key={id} className='mb-2 mt-4 text-xl font-semibold text-dark dark:text-white'>
          {renderRichText(value?.rich_text)}
        </h3>
      )

    case 'bulleted_list_item':
      return (
        <li key={id} className='mb-1 ml-6 list-disc text-body-color dark:text-dark-6'>
          {renderRichText(value?.rich_text)}
          {block.children && (
            <ul>{block.children.map(child => renderBlock(child, depth + 1))}</ul>
          )}
        </li>
      )

    case 'numbered_list_item':
      return (
        <li key={id} className='mb-1 ml-6 list-decimal text-body-color dark:text-dark-6'>
          {renderRichText(value?.rich_text)}
          {block.children && (
            <ol>{block.children.map(child => renderBlock(child, depth + 1))}</ol>
          )}
        </li>
      )

    case 'to_do':
      return (
        <div key={id} className='mb-1 flex items-start gap-2'>
          <input type='checkbox' checked={value?.checked} readOnly className='mt-1' />
          <span className={`text-body-color dark:text-dark-6 ${value?.checked ? 'line-through opacity-60' : ''}`}>
            {renderRichText(value?.rich_text)}
          </span>
        </div>
      )

    case 'toggle':
      return (
        <details key={id} className='mb-4'>
          <summary className='cursor-pointer font-medium text-dark dark:text-white'>
            {renderRichText(value?.rich_text)}
          </summary>
          <div className='ml-4 mt-2'>
            {block.children?.map(child => renderBlock(child, depth + 1))}
          </div>
        </details>
      )

    case 'quote':
      return (
        <blockquote key={id} className='mb-4 border-l-4 border-primary pl-4 italic text-body-color dark:text-dark-6'>
          {renderRichText(value?.rich_text)}
        </blockquote>
      )

    case 'callout':
      return (
        <div key={id} className='mb-4 flex gap-3 rounded-lg bg-gray-50 dark:bg-dark-2 p-4'>
          {value?.icon?.emoji && <span className='text-xl shrink-0'>{value.icon.emoji}</span>}
          <div className='text-body-color dark:text-dark-6'>
            {renderRichText(value?.rich_text)}
            {block.children?.map(child => renderBlock(child, depth + 1))}
          </div>
        </div>
      )

    case 'divider':
      return <hr key={id} className='my-6 border-gray-200 dark:border-gray-700' />

    case 'image': {
      const src = value?.file?.url || value?.external?.url || ''
      const caption = value?.caption?.map(c => c.plain_text).join('') || ''
      return (
        <figure key={id} className='mb-6'>
          {src && (
            <NotionImage
              src={src}
              alt={caption || 'course image'}
              size='content'
              className='w-full rounded-lg'
            />
          )}
          {caption && (
            <figcaption className='mt-2 text-center text-sm text-body-color dark:text-dark-6'>
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'video': {
      const videoUrl = value?.file?.url || value?.external?.url || ''
      return (
        <div key={id} className='mb-6'>
          {videoUrl && (
            <video controls className='w-full rounded-lg'>
              <source src={videoUrl} />
            </video>
          )}
        </div>
      )
    }

    case 'embed':
    case 'bookmark': {
      const url = value?.url || ''
      return (
        <div key={id} className='mb-4'>
          <a href={url} target='_blank' rel='noopener noreferrer'
            className='text-primary hover:underline break-all'>
            {url}
          </a>
        </div>
      )
    }

    case 'code': {
      const code = value?.rich_text?.map(t => t.plain_text).join('') || ''
      return (
        <pre key={id} className='mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4'>
          <code className='text-sm text-gray-100'>{code}</code>
        </pre>
      )
    }

    case 'table': {
      return (
        <div key={id} className='mb-4 overflow-x-auto'>
          <table className='w-full border-collapse border border-gray-200 dark:border-gray-700'>
            <tbody>
              {block.children?.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.table_row?.cells?.map((cell, cellIndex) => {
                    const Tag = rowIndex === 0 && value?.has_column_header ? 'th' : 'td'
                    return (
                      <Tag key={cellIndex}
                        className='border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-body-color dark:text-dark-6'>
                        {cell.map(c => c.plain_text).join('')}
                      </Tag>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'column_list':
      return (
        <div key={id} className='mb-4 flex flex-wrap gap-4'>
          {block.children?.map(child => renderBlock(child, depth + 1))}
        </div>
      )

    case 'column':
      return (
        <div key={id} className='flex-1 min-w-0'>
          {block.children?.map(child => renderBlock(child, depth + 1))}
        </div>
      )

    default:
      return null
  }
}

/**
 * Notion rich_text 陣列 → React 元素
 */
function renderRichText(richTextArr) {
  if (!richTextArr || richTextArr.length === 0) return null

  return richTextArr.map((item, i) => {
    const { text, annotations, href } = item
    const content = text?.content || item.plain_text || ''

    let el = content

    if (annotations?.bold) el = <strong key={i}>{el}</strong>
    if (annotations?.italic) el = <em key={i}>{el}</em>
    if (annotations?.strikethrough) el = <s key={i}>{el}</s>
    if (annotations?.underline) el = <u key={i}>{el}</u>
    if (annotations?.code) {
      el = (
        <code key={i} className='rounded bg-gray-100 dark:bg-dark-2 px-1 py-0.5 text-sm text-primary'>
          {el}
        </code>
      )
    }

    if (href || text?.link?.url) {
      const url = href || text.link.url
      el = (
        <a key={i} href={url} target='_blank' rel='noopener noreferrer'
          className='text-primary hover:underline'>
          {el}
        </a>
      )
    }

    return typeof el === 'string' ? <span key={i}>{el}</span> : el
  })
}

/**
 * 難度對應顏色
 */
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

/**
 * 課程詳細頁元件
 */
export const CourseDetail = ({ course, blocks = [] }) => {
  // 進入頁面時滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!course) return null

  // 將連續的 list item 包成 ul/ol
  const groupedBlocks = groupListItems(blocks)

  return (
    <section className='bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]'>
      <div className='container mx-auto max-w-4xl'>
        {/* 返回按鈕 */}
        <div className='mb-8'>
          <SmartLink
            href='/course'
            className='inline-flex items-center gap-2 text-body-color dark:text-dark-6 hover:text-primary transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            返回課程總覽
          </SmartLink>
        </div>

        {/* 課程標題區 */}
        <div className='mb-8'>
          <h1 className='mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
            {course.title}
          </h1>

          <div className='flex flex-wrap items-center gap-3'>
            {course.category && (
              <span className='inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                {course.category}
              </span>
            )}
            {course.difficulty && (
              <span
                className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${difficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
            )}
            {course.suggestedTime && (
              <span className='flex items-center gap-1 text-sm text-body-color dark:text-dark-6'>
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                {course.suggestedTime}
              </span>
            )}
            {course.hours && (
              <span className='text-sm text-body-color dark:text-dark-6'>
                {course.hours} 小時
              </span>
            )}
          </div>

          {course.software && course.software.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {course.software.map((sw, i) => (
                <span key={i}
                  className='inline-block rounded-full border border-gray-200 dark:border-[#444] px-3 py-1 text-xs text-body-color dark:text-dark-6'>
                  {sw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 封面圖（已關閉，頁面內容的第一張圖片會自然顯示） */}

        {/* Notion 內容 */}
        <div className='notion-content'>
          {groupedBlocks.map((item, index) => {
            if (item._grouped === 'ul') {
              return <ul key={`ul-${index}`} className='mb-4'>{item.items.map(b => renderBlock(b))}</ul>
            }
            if (item._grouped === 'ol') {
              return <ol key={`ol-${index}`} className='mb-4'>{item.items.map(b => renderBlock(b))}</ol>
            }
            return renderBlock(item)
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * 將連續 bulleted/numbered list items 群組化
 */
function groupListItems(blocks) {
  const result = []
  let currentList = null

  for (const block of blocks) {
    if (block.type === 'bulleted_list_item') {
      if (currentList && currentList._grouped === 'ul') {
        currentList.items.push(block)
      } else {
        if (currentList) result.push(currentList)
        currentList = { _grouped: 'ul', items: [block] }
      }
    } else if (block.type === 'numbered_list_item') {
      if (currentList && currentList._grouped === 'ol') {
        currentList.items.push(block)
      } else {
        if (currentList) result.push(currentList)
        currentList = { _grouped: 'ol', items: [block] }
      }
    } else {
      if (currentList) {
        result.push(currentList)
        currentList = null
      }
      result.push(block)
    }
  }

  if (currentList) result.push(currentList)
  return result
}
