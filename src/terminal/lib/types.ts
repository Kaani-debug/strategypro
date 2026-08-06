export type ConnectionStatus = 'connecting' | 'live' | 'mock' | 'offline'

export type TradeTypeId = 'rise-fall' | 'higher-lower' | 'touch' | 'even-odd' | 'match-diff'

export interface Tick {
  time: number
  price: number
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface TradeRecord {
  id: string
  symbol: string
  type: TradeTypeId
  stake: number
  growth: number
  payout: number
  profit: number
  openedAt: number
  status: 'open' | 'won' | 'lost'
}

export interface TradeStats {
  balance: number
  totalTrades: number
  wins: number
  losses: number
  netProfit: number
}

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  at: number
}
