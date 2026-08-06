import React from 'react-18'
import ReactDOM from 'react-dom-18/client'
import * as SmartChartsModule from '@deriv-com/smartcharts-champion'
import { initConnection, getQuotes, subscribeQuotes, unsubscribeQuotes } from './feed'

const SmartChartsPkg = SmartChartsModule.default || SmartChartsModule

const {
  SmartChart,
  setSmartChartsPublicPath,
  ChartTitle,
  ChartMode,
  StudyLegend,
  Views,
  DrawTools,
  Share,
  ChartSize,
  CrosshairToggle,
  ToolbarWidget,
  createObjectFromLocalStorage,
} = SmartChartsPkg

setSmartChartsPublicPath('/dist/')
initConnection()

const el = React.createElement

const DEFAULT_SYMBOL = '1HZ100V'

const ACTIVE_LANGUAGES = ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'ZH_CN', 'ZH_TW']

function buildTradingTimes(tradingTimesResponse) {
  const simplified = {}
  tradingTimesResponse.trading_times?.markets?.forEach(market => {
    market.submarkets?.forEach(submarket => {
      submarket.symbols?.forEach(symbolObj => {
        const { symbol, times } = symbolObj
        const { open, close } = times
        const now = new Date()
        const dateStr = now.toISOString().substring(0, 11)
        const isOpenAllDay = open.length === 1 && open[0] === '00:00:00' && close[0] === '23:59:59'
        const isClosedAllDay = open.length === 1 && open[0] === '--'
        let isOpen = isOpenAllDay
        let openTime = ''
        let closeTime = ''
        if (!isClosedAllDay && open.length > 0 && close.length > 0) {
          openTime = `${dateStr}${open[0]}Z`
          closeTime = `${dateStr}${close[0]}Z`
          isOpen = now >= new Date(openTime) && now < new Date(closeTime)
        }
        simplified[symbol] = { isOpen, openTime, closeTime }
      })
    })
  })
  return simplified
}

function SmartChartsRoot({ onChartReady }) {
  const [chartData, setChartData] = React.useState({})
  const [symbol, setSymbol] = React.useState(DEFAULT_SYMBOL)
  const [granularity, setGranularity] = React.useState(0)
  const [chartType, setChartType] = React.useState('mountain')
  const [isConnectionOpened, setIsConnectionOpened] = React.useState(true)
  const [settings, setSettings] = React.useState(() => {
    const persisted = createObjectFromLocalStorage('smartchart-setting') || {}
    return {
      ...persisted,
      language: 'en',
      theme: persisted.theme || 'light',
      activeLanguages: ACTIVE_LANGUAGES,
    }
  })

  React.useEffect(() => {
    const connection = initConnection()
    const onOpened = () => setIsConnectionOpened(true)
    const onClosed = () => setIsConnectionOpened(false)
    connection.onOpened(onOpened)
    connection.onClosed(onClosed)

    let cancelled = false
    Promise.all([
      connection.send({ trading_times: 'today' }),
      connection.send({ active_symbols: 'brief' }),
    ])
      .then(([ttResponse, asResponse]) => {
        if (cancelled) return
        setChartData({
          tradingTimes: ttResponse.trading_times ? buildTradingTimes(ttResponse) : undefined,
          activeSymbols: asResponse.active_symbols,
        })
      })
      .catch(error => console.error('Failed to load chart metadata:', error))

    return () => {
      cancelled = true
      connection.offOpened(onOpened)
      connection.offClosed(onClosed)
    }
  }, [])

  const saveSettings = React.useCallback(newSettings => {
    localStorage.setItem('smartchart-setting', JSON.stringify(newSettings))
    setSettings(newSettings)
  }, [])

  const onMessage = React.useCallback(() => {}, [])

  const chartStatusListener = React.useCallback(
    isChartReady => {
      if (isChartReady) onChartReady(true)
    },
    [onChartReady]
  )

  const stateChangeListener = React.useCallback(() => {}, [])

  const renderTopWidgets = React.useCallback(
    () =>
      el(ChartTitle, {
        onChange: newSymbol => setSymbol(newSymbol),
        isNestedList: false,
      }),
    []
  )

  const renderToolbarWidget = React.useCallback(
    () =>
      el(
        ToolbarWidget,
        null,
        el(ChartMode, { onChartType: setChartType, onGranularity: setGranularity }),
        el(StudyLegend, null),
        el(Views, { onChartType: setChartType, onGranularity: setGranularity }),
        el(DrawTools, null),
        el(Share, null),
        el(CrosshairToggle, null)
      ),
    []
  )

  const renderControls = React.useCallback(() => el(ChartSize, null), [])

  return el(
    SmartChart,
    {
      id: '1',
      symbol,
      settings,
      chartType,
      granularity,
      isLive: true,
      chartData,
      getQuotes,
      subscribeQuotes,
      unsubscribeQuotes,
      topWidgets: renderTopWidgets,
      toolbarWidget: renderToolbarWidget,
      chartControlsWidgets: renderControls,
      onMessage,
      onSettingsChange: saveSettings,
      chartStatusListener,
      stateChangeListener,
      isConnectionOpened,
      isMobile: false,
      contractInfo: {},
      drawingToolFloatingMenuPosition: { x: 200, y: 200 },
    },
    null
  )
}

export function mountSmartChart(container, { onChartReady = () => {} } = {}) {
  const root = ReactDOM.createRoot(container)
  root.render(el(SmartChartsRoot, { onChartReady }))
  return () => {
    try {
      root.unmount()
    } catch (e) {
      /* noop */
    }
  }
}

