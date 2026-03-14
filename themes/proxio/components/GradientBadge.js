/**
 * 漸層流動徽章
 * 漸層外框 + 漸層文字動畫
 */
const GradientBadge = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex relative rounded-2xl p-[1.5px] overflow-hidden ${className}`}>
      {/* 漸層外框 */}
      <span
        style={{ '--bg-size': '300%', backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)' }}
        className='animate-gradient absolute inset-0 rounded-2xl'
      />
      <span className='relative z-10 px-3 py-0.5 rounded-2xl dark:bg-black bg-white'>
        <span
          style={{
            '--bg-size': '300%',
            backgroundSize: '300% 100%',
            backgroundImage: 'linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          className='animate-gradient inline font-medium'
        >
          {children}
        </span>
      </span>
    </span>
  )
}

export default GradientBadge
