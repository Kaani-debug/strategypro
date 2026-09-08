import { Boxes, Gauge, Sparkles, Briefcase, Search, MonitorPlay, HandCoins, ShieldCheck, Bot, Rocket, BarChart3, LineChart, TrendingUp, DollarSign, Zap } from 'lucide-react'
import TraderBotControl from '../../components/TraderBotControl'

function TabStub({ icon: Icon, title, description, features }) {
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <div className="tab-content__icon"><Icon size={32} /></div>
        <h2 className="tab-content__title">{title}</h2>
        <p className="tab-content__subtitle">{description}</p>
      </div>
      <div className="tab-stub__features">
        {features?.map((f, i) => (
          <div key={i} className="tab-stub__feature">
            <f.icon size={20} />
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <div className="tab-stub__cta">
        <button className="btn btn--primary btn--lg">Launch {title}</button>
      </div>
    </div>
  )
}

export function FreeBotsTab() {
  return <TabStub icon={Boxes} title="Free Bots" description="Pre-built trading bots ready to use"
    features={[
      { icon: Bot, label: 'Martingale Bot' }, { icon: Bot, label: "D'Alembert Bot" },
      { icon: Bot, label: 'Reverse Martingale' }, { icon: Bot, label: "Oscar's Grind" },
    ]} />
}

export function SpeedbotTab() {
  return <TabStub icon={Gauge} title="Speedbot" description="High-frequency trading with rapid execution"
    features={[
      { icon: Zap, label: 'Turbo Mode' }, { icon: TrendingUp, label: 'Scalping Strategy' },
      { icon: BarChart3, label: 'Real-time Analytics' }, { icon: Rocket, label: 'Auto-execution' },
    ]} />
}

export function AISoftwareTab() {
  return <TabStub icon={Sparkles} title="AI Software" description="AI-powered trading strategies and signals"
    features={[
      { icon: Sparkles, label: 'AI Signal Generator' }, { icon: LineChart, label: 'Pattern Recognition' },
      { icon: TrendingUp, label: 'Predictive Analytics' }, { icon: BarChart3, label: 'Market Sentiment' },
    ]} />
}

export function AutoTraderTab() {
  return <TabStub icon={Briefcase} title="Auto Trader" description="Fully automated trading with customizable rules"
    features={[
      { icon: Briefcase, label: 'Automated Strategies' }, { icon: TrendingUp, label: 'Profit Targets' },
      { icon: DollarSign, label: 'Risk Management' }, { icon: BarChart3, label: 'Portfolio Tracking' },
    ]} />
}

export function AnalysisToolTab() {
  return <TabStub icon={Search} title="Analysis Tool" description="Advanced market analysis and research tools"
    features={[
      { icon: Search, label: 'Technical Analysis' }, { icon: BarChart3, label: 'Chart Patterns' },
      { icon: LineChart, label: 'Indicators' }, { icon: TrendingUp, label: 'Trend Detection' },
    ]} />
}

export function ManualTraderTab() {
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <div className="tab-content__icon"><MonitorPlay size={32} /></div>
        <h2 className="tab-content__title">Manual Trader</h2>
        <p className="tab-content__subtitle">Execute trades manually with real-time data</p>
      </div>
      <div className="tab-stub__features">
        {[
          { icon: MonitorPlay, label: 'One-click Trading' }, { icon: BarChart3, label: 'Live Charts' },
          { icon: TrendingUp, label: 'Real-time Quotes' }, { icon: DollarSign, label: 'Position Management' },
        ].map((f, i) => (
          <div key={i} className="tab-stub__feature">
            <f.icon size={20} />
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <TraderBotControl mode="manual" />
    </div>
  )
}

export function BulkTraderTab() {
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <div className="tab-content__icon"><HandCoins size={32} /></div>
        <h2 className="tab-content__title">Bulk Trader</h2>
        <p className="tab-content__subtitle">Execute multiple trades simultaneously</p>
      </div>
      <div className="tab-stub__features">
        {[
          { icon: HandCoins, label: 'Multi-asset Trading' }, { icon: TrendingUp, label: 'Batch Orders' },
          { icon: BarChart3, label: 'Portfolio Rebalance' }, { icon: DollarSign, label: 'Volume Discounts' },
        ].map((f, i) => (
          <div key={i} className="tab-stub__feature">
            <f.icon size={20} />
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <TraderBotControl mode="bulk" />
    </div>
  )
}

export { default as ChartsTab } from './ChartsTab'

export { default as CopyTraderTab } from './CopyTrader'

export function RiskCalculatorTab() {
  return (
    <div className="tab-content" style={{ maxWidth: '100%', textAlign: 'left', padding: '0' }}>
      <iframe
        src="https://risk.binarytool.site/"
        title="Risk Calculator"
        style={{
          width: '100%',
          height: 'calc(100vh - 22rem)',
          border: 'none',
        }}
      />
    </div>
  )
}

export { default as TradeAcademyTab } from './TradeAcademy'
