import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('sp_theme') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    document.body.className = `body theme theme--${theme}`
    localStorage.setItem('sp_theme', theme)
  }, [theme])

  const toggle = () => setTheme(p => p === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
