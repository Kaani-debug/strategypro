import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button className="theme-toggle" onClick={toggle} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <span className="theme-toggle__icon">{theme === 'light' ? '🌙' : '☀️'}</span>
    </button>
  )
}
