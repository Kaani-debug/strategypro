import type { TradeTypeId } from '@/terminal/lib/types'

export const WS_ENDPOINT = 'wss://ws.derivws.com/websockets/v3'
export const WS_APP_ID = 12812
export const WS_LANGUAGE = 'en'

export const TERMINAL_HISTORY_COUNT = 400
export const TERMINAL_GRANULARITY = 60

export const TERMINAL_STAKE_MIN = 0.35
export const TERMINAL_STAKE_MAX = 5000
export const TERMINAL_STAKE_STEP = 0.5
export const TERMINAL_INITIAL_BALANCE = 1000

export const MOCK_CONNECT_TIMEOUT_MS = 6000
export const MOCK_TICK_INTERVAL_MS = 1000
export const MOCK_HISTORY_POINTS = 300

export interface MarketSymbol {
  symbol: string
  name: string
  display: string
  digits: number
  base: number
}

export const SYMBOLS: MarketSymbol[] = [
  { symbol: 'R_10', name: 'Volatility 10 Index', display: 'V10', digits: 2, base: 500 },
  { symbol: 'R_25', name: 'Volatility 25 Index', display: 'V25', digits: 2, base: 600 },
  { symbol: 'R_50', name: 'Volatility 50 Index', display: 'V50', digits: 2, base: 800 },
  { symbol: 'R_75', name: 'Volatility 75 Index', display: 'V75', digits: 2, base: 1000 },
  { symbol: 'R_100', name: 'Volatility 100 Index', display: 'V100', digits: 2, base: 1250 },
  { symbol: '1HZ10V', name: 'Volatility 10 (1s) Index', display: 'V10·1s', digits: 2, base: 500 },
  { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index', display: 'V100·1s', digits: 2, base: 1250 },
]

export const DEFAULT_SYMBOL = SYMBOLS[4]

export interface TradeTypeMeta {
  id: TradeTypeId
  label: string
  description: string
}

export const TRADE_TYPES: TradeTypeMeta[] = [
  { id: 'rise-fall', label: 'Rise / Fall', description: 'Predict whether the exit price is above or below the entry price.' },
  { id: 'higher-lower', label: 'Higher / Lower', description: 'Predict whether the exit spot is higher or lower than the barrier.' },
  { id: 'touch', label: 'Touch / No Touch', description: 'Predict whether the price touches a target before expiry.' },
  { id: 'even-odd', label: 'Even / Odd', description: 'Predict the parity of the last digit of the exit spot.' },
  { id: 'match-diff', label: 'Matches / Differs', description: 'Predict whether the last digit matches or differs from the entry.' },
]

export const GROWTH_RATES: number[] = [1, 2, 3, 5, 8, 10, 15, 20, 25]

export interface LanguageOption {
  code: string
  label: string
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
  { code: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'PT', label: 'Português', flag: '🇵🇹' },
  { code: 'ID', label: 'Bahasa', flag: '🇮🇩' },
]
