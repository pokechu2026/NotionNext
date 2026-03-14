/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

/**
 * 首页的生涯模块
 */
export const Career = () => {
  const Careers = siteConfig('PROXIO_CAREERS')
  return (
    <>
      {/* <!-- ====== About Section Start --> */}
      <section
        id='about'
        className='bg-gray-1 pb-8 pt-20 dark:bg-black lg:pb-[70px] lg:pt-[120px]'>
        <div className='container'>
          <div className='wow fadeInUp' data-wow-delay='.2s'>
            {/* 标题与描述 */}
            <div className='w-full px-4 mb-10'>
              <div className='flex flex-col space-y-4'>
                <span className='px-3 py-0.5 rounded-2xl dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white w-fit'>
                  {siteConfig('PROXIO_CAREER_TITLE')}
                </span>
                <h2 className='text-2xl font-semibold text-dark dark:text-white'>
                  {siteConfig('PROXIO_CAREER_TEXT')}
                </h2>
              </div>
            </div>

            <div className='-mx-4 flex flex-wrap items-center px-4'>
              {Careers?.map((item, index) => {
                return <CareerItem key={index} {...item} />
              })}
            </div>
          </div>
        </div>
      </section>
      {/* <!-- ====== About Section End --> */}
    </>
  )
}


// 生涯内容
const CareerItem = ({ title, bio, text, description }) => {
  return <div className='w-full border-b mb-8 border-gray-200 dark:border-[#333333] px-4 pb-8 wow fadeInUp' data-wow-delay='.1s'>
    <div className='flex flex-col md:flex-row md:justify-between gap-6'>
      {/* 左側：職稱與年份 */}
      <div className='md:w-2/5 flex-shrink-0'>
        <h4 className='text-xl font-bold text-dark dark:text-white mb-1'>
          {title}
        </h4>
        <p className='text-sm text-body-color dark:text-dark-6'>
          {text}
        </p>
      </div>
      {/* 右側：工作介紹與亮點 */}
      <div className='md:w-3/5'>
        <p className='text-base text-body-color dark:text-dark-6 leading-relaxed'>
          {description || bio}
        </p>
      </div>
    </div>
  </div>
}