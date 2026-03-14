/**
 * 極光文字動畫效果
 * 多色漸層在文字上流動，產生極光般的視覺效果
 */
const AuroraText = ({
  children,
  className = '',
  colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
  speed = 1
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '200% auto',
    animationDuration: `${10 / speed}s`
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className='sr-only'>{children}</span>
      <span
        className='animate-aurora relative'
        style={gradientStyle}
        aria-hidden='true'
      >
        {children}
      </span>
    </span>
  )
}

export default AuroraText
