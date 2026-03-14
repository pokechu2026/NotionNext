/**
 * 閃光文字動畫效果
 * 一道光暈在文字上緩慢滑過，產生閃爍質感
 */
const AnimatedShinyText = ({ children, className = '', shimmerWidth = 150 }) => {
  return (
    <span
      style={{
        '--shiny-width': `${shimmerWidth}px`,
        backgroundSize: `${shimmerWidth}px 100%`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'rgba(255,255,255,0.65)',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,1) 50%, transparent)'
      }}
      className={`animate-shiny-text ${className}`}
    >
      {children}
    </span>
  )
}

export default AnimatedShinyText
