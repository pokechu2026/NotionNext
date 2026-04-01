/* eslint-disable @next/next/no-img-element */
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import GradientBadge from './GradientBadge'

/**
 * 博文列表（首頁「最新 AI 應用教學案例」區塊）
 * @param {*} param0
 * @returns
 */
export const Blog = ({ posts }) => {
  const enable = siteConfig('PROXIO_BLOG_ENABLE')

  const PROXIO_BLOG_TITLE = siteConfig('PROXIO_BLOG_TITLE')
  const PROXIO_BLOG_TEXT_1 = siteConfig('PROXIO_BLOG_TEXT_1')

  if (!enable) {
    return null
  }

  return (
    <>
      {/* <!-- ====== Blog Section Start --> */}
      <section className='bg-white pt-20 dark:bg-dark lg:pt-[120px]'>
        <div className='container mx-auto'>
          {/* 区块标题文字 */}
          <div
            className='-mx-4 flex flex-wrap justify-center wow fadeInUp'
            data-wow-delay='.2s'>
            <div className='w-full px-4 py-4'>
              <div className='mx-auto max-w-[485px] text-center space-y-4'>
                <GradientBadge>
                  {PROXIO_BLOG_TITLE}
                </GradientBadge>

                <h2 className='text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {PROXIO_BLOG_TEXT_1}
                </h2>
              </div>
            </div>
          </div>
          {/* 博客列表 此处优先展示4篇文章 */}
          <div className='-mx-4 grid md:grid-cols-2 grid-cols-1'>
            {posts?.map((item, index) => {
              return (
                <div key={index} className='w-full px-4'>
                  <div
                    className='wow fadeInUp group mb-10 relative overflow-hidden blog'
                    data-wow-delay='.1s'>
                    <div className='relative rounded-xl border overflow-hidden shadow-md dark:border-gray-700 dark:bg-gray-800'>
                      <SmartLink href={item?.href} className='block'>
                        {/* 縮圖：16:9 比例顯示（無縮圖時顯示漸層佔位） */}
                        {item.pageCoverThumbnail ? (
                          <LazyImage
                            src={item.pageCoverThumbnail}
                            alt={item.title}
                            className='w-full aspect-video object-cover rounded-xl'
                          />
                        ) : (
                          <div className='w-full aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center'>
                            <svg className='w-12 h-12 text-gray-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                          </div>
                        )}
                        {/* Hover 遮罩：灰色底 + summary 文字 */}
                        <div className='absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6'>
                          <p className='max-w-[370px] text-sm text-white leading-relaxed text-center'>
                            {item.summary}
                          </p>
                        </div>
                      </SmartLink>
                    </div>
                    {/* 内容部分 */}
                    <div className='relative z-10 p-4'>
                      <span className='inline-block text-center text-xs font-medium leading-loose text-white'>
                        {item.publishDay}
                      </span>
                      <h3>
                        <SmartLink
                          href={item?.href}
                          className='mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl'>
                          {item.title}
                        </SmartLink>
                      </h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 更多案例 — 漸層流動按鈕 */}
          <div className='flex justify-center pb-6'>
            <SmartLink
              href='/course-case'
              className='group relative inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden'>
              {/* 漸層邊框 */}
              <span
                style={{ '--bg-size': '300%', backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)' }}
                className='animate-gradient absolute inset-0 rounded-full'
              />
              {/* 內層黑底 */}
              <span className='relative z-10 inline-flex items-center rounded-full bg-black px-7 py-3'>
                <span
                  style={{
                    '--bg-size': '300%',
                    backgroundSize: '300% 100%',
                    backgroundImage: 'linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  className='animate-gradient inline text-base font-medium'
                >
                  更多案例
                </span>
                <span className='ml-2 text-gray-400 transition-transform duration-200 group-hover:translate-x-1'>›</span>
              </span>
            </SmartLink>
          </div>
        </div>
      </section>
      {/* <!-- ====== Blog Section End --> */}
    </>
  )
}
