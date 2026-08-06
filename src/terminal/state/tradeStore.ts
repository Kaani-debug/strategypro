import { create } from 'zustand'
import type { TradeRecord, TradeStats, TradeTypeId } from '@/terminal/lib/types'
import { TERMINAL_INITIAL_BALANCE, TERMINAL_STAKE_MAX, TERMINAL_STAKE_MIN } from '@/terminal/data/config'

export interface StakeValidation {
  ok: boolean
  value: number
  error: string | null
}

export function validateStake(input: string): StakeValidation {
  const trimmed = input.trim()
  if (trimmed === '') return { ok: false, value: 0, error: 'Stake is required' }
  const value = Number(trimmed)
  if (!Number.isFinite(value)) return { ok: false, value: 0, error: 'Enter a valid amount' }
  if (value < TERMINAL_STAKE_MIN) {
    return { ok: false, value, error: `Minimum stake is ${TERMINAL_STAKE_MIN.toFixed(2)}` }
  }
  if (value > TERMINAL_STAKE_MAX) {
    return { ok: false, value, error: `Maximum stake is ${TERMINAL_STAKE_MAX.toFixed(2)}` }
  }
  return { ok: true, value: Math.round(value * 100) / 100, error: null }
}

export function payoutFor(stake: number, growthRate: number): number {
  return Math.round(stake * (1 + growthRate / 100) * 100) / 100
}

export type BuyState = 'idle' | 'pending' | 'confirmed' | 'error'

interface TradeState extends TradeStats {
  tradeType: TradeTypeId
  growthRate: number
  stakeInput: string
  takeProfitEnabled: boolean
  takeProfitInput: string
  lastTrade: TradeRecord | null
  buyState: BuyState
  buyMessage: string | null
  setTradeType: (type: TradeTypeId) => void
  setGrowthRate: (rate: number) => void
  setStakeInput: (input: string) => void
  setTakeProfitEnabled: (enabled: boolean) => void
  setTakeProfitInput: (input: string) => void
  openTrade: (symbol: string) => void
  resolveTrade: (won: boolean) => void
  dismissBuy: () => void
}

export const useTradeStore = create<TradeState>((set, get) => ({
  balance: TERMINAL_INITIAL_BALANCE,
  totalTrades: 0,
  wins: 0,
  losses: 0,
  netProfit: 0,
  tradeType: 'rise-fall',
  growthRate: 5,
  stakeInput: '10',
  takeProfitEnabled: false,
  takeProfitInput: '',
  lastTrade: null,
  buyState: 'idle',
  buyMessage: null,

  setTradeType: (tradeType) => set({ tradeType }),

  setGrowthRate: (growthRate) => set({ growthRate }),

  setStakeInput: (stakeInput) => set({ stakeInput }),

  setTakeProfitEnabled: (takeProfitEnabled) => set({ takeProfitEnabled }),

  setTakeProfitInput: (takeProfitInput) => set({ takeProfitInput }),

  openTrade: (symbol) => {
    const { tradeType, growthRate, stakeInput } = get()
    const validation = validateStake(stakeInput)
    if (!validation.ok) {
      set({ buyState: 'error', buyMessage: validation.error })
      return
    }
    const stake = validation.value
    const payout = payoutFor(stake, growthRate)
    const trade: TradeRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      symbol,
      type: tradeType,
      stake,
      growth: growthRate,
      payout,
      profit: 0,
      openedAt: Date.now(),
      status: 'open',
    }
    set((state) => ({
      balance: Math.round((state.balance - stake) * 100) / 100,
      totalTrades: state.totalTrades + 1,
      lastTrade: trade,
      buyState: 'pending',
      buyMessage: `Purchase initiated — stake ${stake.toFixed(2)} placed.`,
    }))
  },

  resolveTrade: (won) => {
    const { lastTrade, balance } = get()
    if (!lastTrade) return
    const profit = won
      ? Math.round((lastTrade.payout - lastTrade.stake) * 100) / 100
      : -Math.round(lastTrade.stake * 100) / 100
    set((state) => ({
      balance: Math.round((balance + (won ? lastTrade.payout : 0)) * 100) / 100,
      wins: state.wins + (won ? 1 : 0),
      losses: state.losses + (won ? 0 : 1),
      netProfit: Math.round((state.netProfit + profit) * 100) / 100,
      lastTrade: { ...lastTrade, profit, status: won ? 'won' : 'lost' },
      buyState: 'confirmed',
      buyMessage: won
        ? `Trade won — payout ${lastTrade.payout.toFixed(2)} credited.`
        : `Trade lost — stake ${lastTrade.stake.toFixed(2)} forfeited.`,
    }))
  },

  dismissBuy: () => set({ buyState: 'idle', buyMessage: null }),
}))
