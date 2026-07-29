import { useSimulation } from '../hooks/useSimulation'

export default function LiveTicker() {
  const { prices, connected, getDirection, SYMBOLS } = useSimulation()

  return (
    <div className="live-ticker">
      <div className="live-ticker__inner">
        <span className={`live-ticker__status ${connected ? 'connected' : 'connecting'}`}>
          {connected ? '● LIVE' : '○ CONNECTING'}
        </span>
        {SYMBOLS.map(sym => {
          const dir = getDirection(sym)
          return (
            <span key={sym} className={`live-ticker__item ${dir}`}>
              {sym}: {prices[sym]?.toFixed(2)} {dir === 'up' ? '▲' : '▼'}
            </span>
          )
        })}
      </div>
    </div>
  )
}
