import { create } from 'zustand'
import { LANGUAGES } from '@/terminal/data/config'

export type ChartTool = 'crosshair' | 'draw' | 'pan' | 'measure'

interface UiState {
  language: string
  assistantOpen: boolean
  statsOpen: boolean
  chartToolsOpen: boolean
  tool: ChartTool
  timeframe: number
  setLanguage: (code: string) => void
  toggleAssistant: () => void
  setAssistantOpen: (open: boolean) => void
  toggleStats: () => void
  toggleChartTools: () => void
  setTool: (tool: ChartTool) => void
  setTimeframe: (seconds: number) => void
}

const initialLanguage = (): string => {
  try {
    const saved = localStorage.getItem('tterm_lang')
    if (saved && LANGUAGES.some((l) => l.code === saved)) return saved
  } catch {
    /* noop */
  }
  return 'EN'
}

export const useUiStore = create<UiState>((set) => ({
  language: initialLanguage(),
  assistantOpen: false,
  statsOpen: true,
  chartToolsOpen: false,
  tool: 'crosshair',
  timeframe: 1,

  setLanguage: (language) => {
    try {
      localStorage.setItem('tterm_lang', language)
    } catch {
      /* noop */
    }
    set({ language })
  },

  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),

  setAssistantOpen: (assistantOpen) => set({ assistantOpen }),

  toggleStats: () => set((s) => ({ statsOpen: !s.statsOpen })),

  toggleChartTools: () => set((s) => ({ chartToolsOpen: !s.chartToolsOpen })),

  setTool: (tool) => set({ tool }),

  setTimeframe: (timeframe) => set({ timeframe }),
}))
