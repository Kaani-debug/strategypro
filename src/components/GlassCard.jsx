export default function GlassCard({ children, className = '', glow = false, onClick, style }) {
  return (
    <div
      className={`glass-card ${glow ? 'glass-card--glow' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}
