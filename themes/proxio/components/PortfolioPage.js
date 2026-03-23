'use client'
import { useState, useMemo } from 'react'
import NotionImage from '@/components/NotionImage'
import SmartLink from '@/components/SmartLink'

/**
 * 作品集完整頁面元件（/portfolio）
 * 支援年份、角色篩選
 */
export const PortfolioPage = ({ projects = [] }) => {
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')

  // 取得所有年份和角色選項
  const years = useMemo(() => {
    const set = new Set(projects.map(p => p.year).filter(Boolean))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [projects])

  const roles = useMemo(() => {
    const set = new Set(projects.flatMap(p => p.roles || []))
    return Array.from(set).sort()
  }, [projects])

  // 篩選
  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (selectedYear !== 'all' && p.year !== selectedYear) return false
      if (selectedRole !== 'all' && !(p.roles || []).includes(selectedRole)) return false
      return true
    })
  }, [projects, selectedYear, selectedRole])

  return (
    <section className='bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]'>
      <div className='container mx-auto'>
        {/* 頁面標題 */}
        <div className='mx-auto mb-10 max-w-[600px] text-center'>
          <h1 className='mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
            代表專案
          </h1>
          <p className='text-base text-body-color dark:text-dark-6'>
            跨越影視、VR、AI 與設計的多元專案實績
          </p>
        </div>

        {/* 篩選器 */}
        <div className='mb-10 flex flex-wrap justify-center gap-4'>
          {/* 年份篩選 */}
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className='rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-dark-2 px-4 py-2 text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'>
            <option value='all'>所有年份</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* 角色篩選 */}
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className='rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-dark-2 px-4 py-2 text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'>
            <option value='all'>所有角色</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* 結果數量 */}
          <span className='flex items-center text-sm text-body-color dark:text-dark-6'>
            共 {filtered.length} 個專案
          </span>
        </div>

        {/* 卡片列表 */}
        <div className='-mx-4 flex flex-wrap'>
          {filtered.map((project, index) => (
            <div key={project.id || index} className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <SmartLink href={`/portfolio/${project.id.replace(/-/g, '')}`} className='block'>
              <div className='wow fadeInUp group mb-8 rounded-xl border border-gray-200 dark:border-[#333333] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-800 cursor-pointer'
                data-wow-delay={`${0.1 + (index % 6) * 0.05}s`}>
                {/* 封面圖 */}
                {/* 封面圖 - 使用 Next.js Image 自動壓縮 */}
                <div className='h-48 overflow-hidden bg-gray-100 dark:bg-dark-2'>
                  <NotionImage
                    src={project.cover}
                    alt={project.title}
                    size='thumbnail'
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                </div>

                <div className='p-5'>
                  <h3 className='mb-2 text-lg font-bold text-dark dark:text-white'>
                    {project.title}
                  </h3>

                  <div className='mb-3 flex flex-wrap items-center gap-2'>
                    {project.year && (
                      <span className='inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                        {project.year}
                      </span>
                    )}
                    {project.unit && (
                      <span className='text-sm text-body-color dark:text-dark-6'>
                        {project.unit}
                      </span>
                    )}
                  </div>

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

        {filtered.length === 0 && (
          <div className='text-center py-20 text-body-color dark:text-dark-6'>
            目前沒有符合條件的專案
          </div>
        )}
      </div>
    </section>
  )
}
