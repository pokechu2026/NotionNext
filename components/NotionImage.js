/**
 * 使用 Next.js Image 元件自動壓縮 Notion Official API 的圖片
 *
 * 功能：
 * - 自動壓縮（WebP/AVIF 格式，quality=75）
 * - 響應式尺寸（根據 size 參數）
 * - Lazy loading（預設）
 * - 優雅 fallback（載入失敗時隱藏）
 *
 * 與 LazyImage 的差異：
 * - LazyImage 用於 unofficial API 的 Notion proxy URL（已有壓縮）
 * - NotionImage 用於 Official API 的 prod-files-secure URL（需要 Next.js 壓縮）
 */
'use client'
import Image from 'next/image'
import { useState } from 'react'

/**
 * @param {string} src - 圖片 URL
 * @param {string} alt - alt text
 * @param {string} className - CSS class
 * @param {'thumbnail'|'content'|'banner'} size - 壓縮預設
 * @param {boolean} priority - 是否優先載入（above-fold）
 */
export default function NotionImage({
  src,
  alt = '',
  className = '',
  size = 'thumbnail',
  priority = false
}) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`bg-gray-100 dark:bg-dark-2 flex items-center justify-center ${className}`}>
        <svg className='w-12 h-12 text-gray-400 dark:text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
        </svg>
      </div>
    )
  }

  // 根據 size 選擇壓縮寬度
  const widthMap = { thumbnail: 640, content: 1080, banner: 1920 }
  const width = widthMap[size] || 640
  const height = size === 'banner' ? Math.round(width / 3) : Math.round(width * 0.6)

  // 判斷是否為可以由 Next.js 優化的 URL
  const isOptimizable =
    src.startsWith('/api/notion-image') ||
    src.includes('prod-files-secure') ||
    src.includes('notion.so') ||
    src.includes('unsplash.com')

  if (isOptimizable) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={75}
        className={className}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        onError={() => setError(true)}
      />
    )
  }

  // 外部 URL fallback 為普通 img
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading='lazy'
      onError={() => setError(true)}
    />
  )
}
