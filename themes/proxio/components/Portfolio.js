import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import GradientBadge from './GradientBadge'

/**
 * 作品集展示元件
 * 首頁模式：顯示 Featured 精選作品卡片
 * @param {Object} props
 * @param {Array} props.projects - 作品資料陣列
 */
export const Portfolio = ({ projects = [] }) => {
  // Hook 必須在最頂部呼叫，不能放在條件判斷之後
  const title = siteConfig('PROXIO_PORTFOLIO_TITLE', '精選作品', CONFIG)
  const text = siteConfig('PROXIO_PORTFOLIO_TEXT', '', CONFIG)
  const enable = siteConfig('PROXIO_PORTFOLIO_ENABLE', true, CONFIG)

  if (!enable || !projects || projects.length === 0) return null

  return (
    <section className='pb-8 pt-20 dark:bg-dark lg:pb-[40px] lg:pt-[120px]'>
      <div className='container'>
        {/* 區塊標題 */}
        <div className='-mx-4 flex flex-wrap wow fadeInUp' data-wow-delay='.15s'>
          <div className='w-full px-4'>
            <div className='mx-auto mb-12 lg:mb-[40px]'>
              <GradientBadge>
                {title}
              </GradientBadge>
              {text && (
                <h2 className='my-5 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {text}
                </h2>
              )}
            </div>
          </div>
        </div>

        {/* 作品卡片 Grid */}
        <div className='-mx-4 flex flex-wrap'>
          {projects.map((project, index) => (
            <div key={project.id || index} className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <SmartLink href={project.url} target='_blank' className='block'>
              <div
                className='wow fadeInUp group mb-10 rounded-xl border border-gray-200 dark:border-[#333333] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-800 cursor-pointer'
                data-wow-delay={`${0.1 + index * 0.05}s`}>
                {/* 封面圖 */}
                {project.cover && (
                  <div className='h-48 overflow-hidden'>
                    <LazyImage
                      src={project.cover}
                      alt={project.title}
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  </div>
                )}

                {/* 卡片內容 */}
                <div className='p-5'>
                  <h4 className='mb-2 text-lg font-bold text-dark dark:text-white'>
                    {project.title}
                  </h4>

                  <div className='mb-3 flex flex-wrap items-center gap-2'>
                    {/* 年份 */}
                    {project.year && (
                      <span className='inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                        {project.year}
                      </span>
                    )}
                    {/* 合作單位 */}
                    {project.unit && (
                      <span className='text-sm text-body-color dark:text-dark-6'>
                        {project.unit}
                      </span>
                    )}
                  </div>

                  {/* 角色標籤 */}
                  {project.roles && project.roles.length > 0 && (
                    <div className='mb-2 flex flex-wrap gap-1'>
                      {project.roles.map((role, i) => (
                        <span
                          key={i}
                          className='inline-block rounded-full border border-gray-200 dark:border-[#444] px-2 py-0.5 text-xs text-body-color dark:text-dark-6'>
                          {role}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 量化成果 */}
                  {project.metric && (
                    <p className='text-sm text-body-color dark:text-dark-6 italic'>
                      {project.metric}
                    </p>
                  )}
                </div>
              </div>
              </SmartLink>
            </div>
          ))}
        </div>

        {/* 查看全部按鈕 */}
        <div className='mt-4 w-full flex justify-center items-center'>
          <SmartLink
            href='/portfolio'
            className='group relative inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden'>
            <span
              style={{ '--bg-size': '300%', backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)' }}
              className='animate-gradient absolute inset-0 rounded-full'
            />
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
                查看全部作品
              </span>
              <span className='ml-2 text-gray-400 transition-transform duration-200 group-hover:translate-x-1'>›</span>
            </span>
          </SmartLink>
        </div>
      </div>
    </section>
  )
}
