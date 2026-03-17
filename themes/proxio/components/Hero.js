/* eslint-disable @next/next/no-img-element */
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'
import AnimatedShinyText from './AnimatedShinyText'
import AuroraText from './AuroraText'
import SparklesText from './SparklesText'
import { ShaderAnimation } from './ShaderAnimation'

/**
 * 英雄大图区块
 */
export const Hero = props => {
  const config = props?.NOTION_CONFIG || CONFIG
  const pageCover = props?.siteInfo?.pageCover
  const bannerImage =
    siteConfig('PROXIO_HERO_BANNER_IMAGE', null, config) || pageCover
  const bannerIframe = siteConfig('PROXIO_HERO_BANNER_IFRAME_URL', null, config)
  const shaderEnabled = CONFIG.PROXIO_HERO_SHADER_ENABLE ?? false
  const PROXIO_HERO_BUTTON_1_TEXT = siteConfig(
    'PROXIO_HERO_BUTTON_1_TEXT',
    null,
    config
  )
  const PROXIO_HERO_BUTTON_2_TEXT = siteConfig(
    'PROXIO_HERO_BUTTON_2_TEXT',
    null,
    config
  )
  const PROXIO_HERO_BUTTON_2_ICON = siteConfig(
    'PROXIO_HERO_BUTTON_2_ICON',
    null,
    config
  )
  return (
    <>
      {/* <!-- ====== Hero Section Start --> */}
      <div id='home' className='h-screen relative overflow-hidden bg-primary '>
        {/* 背景層：Shader 流光 > iframe 嵌入 > 靜態圖片 */}
        {shaderEnabled ? (
          <ShaderAnimation fallbackImage={bannerImage} />
        ) : bannerIframe ? (
          <iframe
            src={bannerIframe}
            className='w-full absolute h-screen left-0 top-0 pointer-events-none'
          />
        ) : bannerImage ? (
          <LazyImage
            priority
            className='w-full object-cover absolute h-screen left-0 top-0 pointer-events-none'
            src={bannerImage}
          />
        ) : null}
        {/* 阴影遮罩 */}
        <div className='h-1/3 w-full absolute left-0 bottom-0 z-10'>
          <div
            className='h-full w-full absolute group-hover:opacity-100 transition-all duration-1000 
                    bg-gradient-to-b from-transparent to-white dark:to-black'
          />
        </div>
      </div>
      {/* 文字标题等 */}
      <div className='w-full pb-15 dark:text-white'>
        <div className='container -mx-4 flex flex-wrap items-center'>
          <div className='w-full px-4'>
            <div
              className='hero-content wow fadeInUp mx-auto max-w-[780px] text-center'
              data-wow-delay='0.5s'>
              {/* 主标题 */}
              <h1 className='mb-6 text-3xl font-bold leading-snug sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]'>
                <AnimatedShinyText shimmerWidth={200}>
                  {(() => {
                    const title = siteConfig('PROXIO_HERO_TITLE_1', null, config) || ''
                    // 將「AI」和「發光發熱」包裹成極光效果
                    const parts = title.split(/(AI|發光發熱)/)
                    return parts.map((part, i) =>
                      part === 'AI' || part === '發光發熱' ? (
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
              </h1>
              {/* 次标题 */}
              <p className='mx-auto mb-9 max-w-[600px] text-base font-medium  sm:text-lg sm:leading-[1.44]'>
                {siteConfig('PROXIO_HERO_TITLE_2', null, config)}
              </p>
              {/* 按钮组 */}
              <ul className='mb-10 flex flex-wrap items-center justify-center gap-5'>
                {PROXIO_HERO_BUTTON_1_TEXT && (
                  <li>
                    <SmartLink
                      href={siteConfig('PROXIO_HERO_BUTTON_1_URL', '')}
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
                          {PROXIO_HERO_BUTTON_1_TEXT}
                        </span>
                        <span className='ml-2 text-gray-400 transition-transform duration-200 group-hover:translate-x-1'>›</span>
                      </span>
                    </SmartLink>
                  </li>
                )}
                {PROXIO_HERO_BUTTON_2_TEXT && (
                  <li>
                    <SmartLink
                      href={siteConfig('PROXIO_HERO_BUTTON_2_URL', '')}
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
                          {PROXIO_HERO_BUTTON_2_TEXT}
                        </span>
                        <span className='ml-2 text-gray-400 transition-transform duration-200 group-hover:translate-x-1'>›</span>
                      </span>
                    </SmartLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ====== Hero Section End --> */}
    </>
  )
}
