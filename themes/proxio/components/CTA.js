import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import SparklesText from './SparklesText'
import AnimatedShinyText from './AnimatedShinyText'
import AuroraText from './AuroraText'
import GradientBadge from './GradientBadge'

/**
 * CTA，用于创建一个呼吁用户行动的部分（Call To Action，简称 CTA）。
 * 该组件通过以下方式激励用户进行特定操作
 * 用户的公告栏内容将在此显示
 **/
export const CTA = () => {
  const enable = siteConfig('PROXIO_CTA_ENABLE')
  const PROXIO_CTA_TITLE_2 = siteConfig('PROXIO_CTA_TITLE_2')
  const PROXIO_CTA_DESCRIPTION = siteConfig('PROXIO_CTA_DESCRIPTION')
  const PROXIO_CTA_BUTTON = siteConfig('PROXIO_CTA_BUTTON')
  const PROXIO_CTA_BUTTON_URL = siteConfig('PROXIO_CTA_BUTTON_URL', '')
  const PROXIO_CTA_BUTTON_TEXT = siteConfig('PROXIO_CTA_BUTTON_TEXT')

  if (!enable) {
    return null
  }
  return (
    <>
      {/* <!-- ====== CTA Section Start --> */}
      <section className='relative z-10 overflow-hidden bg-gray-1 dark:bg-black py-20 lg:py-[115px]'>
        <div className='container mx-auto'>
          <div className='relative overflow-hidden'>
            <div className='-mx-4 flex flex-wrap items-stretch'>
              <div className='w-full px-4 mb-2'>
                <div className='mx-auto max-w-[570px] text-center wow fadeInUp' data-wow-delay='.2s'>
                  <SparklesText sparklesCount={5} colors={{ first: '#ffaa40', second: '#9c40ff' }} className='text-base'>
                    <GradientBadge>
                      {siteConfig('PROXIO_CTA_TITLE')}
                    </GradientBadge>
                  </SparklesText>
                  <h2 className='mt-6 mb-2.5 text-3xl font-bold leading-snug md:text-[38px] md:leading-[1.44]'>
                    <AnimatedShinyText shimmerWidth={200}>
                      {(() => {
                        const title = PROXIO_CTA_TITLE_2 || ''
                        const parts = title.split(/(數位轉型)/)
                        return parts.map((part, i) =>
                          part === '數位轉型' ? (
                            <SparklesText key={i} sparklesCount={6} colors={{ first: '#9E7AFF', second: '#FE8BBB' }}>
                              <AuroraText colors={['#FF0080', '#7928CA', '#0070F3', '#38bdf8']} speed={1.2}>
                                {part}
                              </AuroraText>
                            </SparklesText>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )
                      })()}
                    </AnimatedShinyText>
                  </h2>
                  <p className='mx-auto mb-6 max-w-[515px] text-base leading-[1.5] dark:text-white'>
                    {PROXIO_CTA_DESCRIPTION}
                  </p>
                  {PROXIO_CTA_BUTTON && (
                    <SmartLink
                      href={PROXIO_CTA_BUTTON_URL}
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
                          {PROXIO_CTA_BUTTON_TEXT}
                        </span>
                        <span className='ml-2 text-gray-400 transition-transform duration-200 group-hover:translate-x-1'>›</span>
                      </span>
                    </SmartLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
      {/* <!-- ====== CTA Section End --> */}
    </>
  )
}
