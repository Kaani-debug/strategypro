import { useEffect, useRef, useState } from 'react'

function TradingViewMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.5 19.3c-.6 0-1.1-.2-1.6-.5-.5-.3-.9-.7-1.2-1.2-.3.5-.8 1-1.3 1.3-.8.5-1.7.6-2.6.2-.8-.3-1.4-.9-1.7-1.7-.2-.6-.3-1.4.1-2.2.4-.9 1.2-1.4 2.1-1.8-.7-.7-1.2-1.5-1.3-2.5-.1-1.2.3-2.3 1.2-3.2C4.2 6.9 5.5 6.4 7 6.5c1.1 0 2.1.4 2.9 1.1.9.8 1.4 1.9 1.3 3.2v.1c.2.3.5.6.8.7-.6 1-1.2 1.7-2.5 2.3-.4.2-.8.6-1 1.1-.3-.7-.9-1.3-1.6-1.6-.1.1-.2.1-.4.1h-.5c-.7 0-1.3.5-1.4 1.2-.1.7.4 1.4 1.1 1.5h.4c.7 0 1.3-.3 1.7-.8.4-.5 1-.8 1.6-.8.6 0 1.2.3 1.6.8.4.5 1 .8 1.6.8h.1c.7 0 1.3-.5 1.4-1.2.1-.7-.4-1.4-1.1-1.5h-.4c-.2 0-.3.1-.5.1-.6.2-1.2 1-1.6 1.6-.2-.5-.6-.9-1-1.1-1.3-.6-1.9-1.3-2.5-2.3.3-.1.6-.4.8-.7v-.1c0-1.3.5-2.4 1.3-3.2.8-.7 1.8-1.1 2.9-1.1 1.5-.1 2.8.4 3.8 1.3.9.9 1.3 2 1.2 3.2-.1 1-.6 1.8-1.3 2.5.9.4 1.7.9 2.1 1.8.4.8.3 1.6.1 2.2-.3.8-.9 1.4-1.7 1.7-.9.4-1.8.3-2.6-.2-.5-.3-.9-.8-1.2-1.3-.3.5-.7.9-1.2 1.2-.5.3-1.1.5-1.7.5z"
      />
    </svg>
  )
}

export default function ChartsTab() {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isChartVisible, setIsChartVisible] = useState(true)

  const toggleChart = () => setIsChartVisible(prev => !prev)

  useEffect(() => {
    let active = true
    let unmount = () => {}
    let readyTimer = null

    import('../../lib/charts/SmartChartsIsland')
      .then(({ mountSmartChart }) => {
        if (!active || !containerRef.current) return
        unmount = mountSmartChart(containerRef.current, {
          onChartReady: () => {
            if (active) {
              if (readyTimer) clearTimeout(readyTimer)
              setIsLoading(false)
            }
          },
        })
        readyTimer = setTimeout(() => {
          if (active) setIsLoading(false)
        }, 6000)
      })
      .catch(() => {
        if (active) setHasError(true)
      })

    return () => {
      active = false
      if (readyTimer) clearTimeout(readyTimer)
      try {
        unmount()
      } catch (e) {
        /* noop */
      }
    }
  }, [])

  return (
    <div className="charts-tab">
      <div
        className={`charts-tab__chart${isChartVisible ? '' : ' charts-tab__chart--hidden'}`}
        ref={containerRef}
      />
      {hasError && (
        <div className="charts-tab__error">Unable to load the chart. Please check your connection and try again.</div>
      )}
      {isLoading && !hasError && isChartVisible && (
        <div className="charts-tab__loader">
          <span className="charts-tab__loader-text">Retrieving Chart Data...</span>
        </div>
      )}
      <div className="charts-tab__footer">
        Last digits stats for latest 1000 ticks on Volatility 100 (1s) Index
      </div>
      <button
        type="button"
        className="charts-tab__floating-button"
        title={isChartVisible ? 'Hide Trading View' : 'Show Trading View'}
        aria-expanded={isChartVisible}
        onClick={toggleChart}
      >
        <TradingViewMark />
        <span>Trading View</span>
      </button>
    </div>
  )
}
