import { useEffect, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/terminal/styles/terminal.css'
import TopNav from '@/terminal/components/TopNav'
import ChartWorkspace from '@/terminal/components/ChartWorkspace'
import ChartTools from '@/terminal/components/ChartTools'
import TradingPanel from '@/terminal/components/TradingPanel'
import FloatingStats from '@/terminal/components/FloatingStats'
import AiAssistant from '@/terminal/components/AiAssistant'
import StatusBar from '@/terminal/components/StatusBar'
import type { ChartController } from '@/terminal/chart/TerminalChart'
import { X } from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

export default function TerminalPage() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.body.classList.contains('theme--dark') : false,
  )
  const [panelOpen, setPanelOpen] = useState(false)
  const controllerRef = useRef<ChartController | null>(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('tterm-root')
    return () => {
      root.classList.remove('tterm-root')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.body.classList.toggle('theme--dark', next)
      return next
    })
  }

  const theme: 'light' | 'dark' = isDark ? 'dark' : 'light'

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`tterm flex h-screen w-screen flex-col bg-slate-100 text-slate-800 ${
          isDark ? 'theme--dark bg-slate-950 text-slate-100' : ''
        }`}
      >
      <TopNav onOpenPanel={() => setPanelOpen(true)} />

      <div className="relative flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1 bg-white dark:bg-slate-900">
          <ChartWorkspace theme={theme} controllerRef={controllerRef} />
          <ChartTools
            onZoomIn={() => controllerRef.current?.zoomIn()}
            onZoomOut={() => controllerRef.current?.zoomOut()}
            onReset={() => controllerRef.current?.reset()}
          />
          <FloatingStats />
          <AiAssistant />
        </main>

        <aside className="hidden w-[340px] shrink-0 border-l border-slate-800 bg-slate-50 dark:bg-slate-950 lg:block">
          <TradingPanel />
        </aside>

        {panelOpen ? (
          <div className="absolute inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close trade panel"
              onClick={() => setPanelOpen(false)}
              className="absolute inset-0 h-full w-full bg-black/50"
            />
            <div className="absolute inset-y-0 right-0 flex w-[340px] max-w-[90vw] flex-col border-l border-slate-800 bg-slate-50 shadow-2xl dark:bg-slate-950">
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4">
                <span className="text-sm font-bold text-slate-100">Trade</span>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  aria-label="Close trade panel"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <TradingPanel />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
      </div>
    </QueryClientProvider>
  )
}
