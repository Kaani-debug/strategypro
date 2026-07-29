import { Boxes, Gauge, Sparkles, Briefcase, Search, MonitorPlay, HandCoins, ChartColumnStacked, Copy, ShieldCheck, GraduationCap, Bot, Rocket, BarChart3, LineChart, TrendingUp, DollarSign, Zap } from 'lucide-react'

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
  return <TabStub icon={MonitorPlay} title="Manual Trader" description="Execute trades manually with real-time data"
    features={[
      { icon: MonitorPlay, label: 'One-click Trading' }, { icon: BarChart3, label: 'Live Charts' },
      { icon: TrendingUp, label: 'Real-time Quotes' }, { icon: DollarSign, label: 'Position Management' },
    ]} />
}

export function BulkTraderTab() {
  return <TabStub icon={HandCoins} title="Bulk Trader" description="Execute multiple trades simultaneously"
    features={[
      { icon: HandCoins, label: 'Multi-asset Trading' }, { icon: TrendingUp, label: 'Batch Orders' },
      { icon: BarChart3, label: 'Portfolio Rebalance' }, { icon: DollarSign, label: 'Volume Discounts' },
    ]} />
}

export function ChartsTab() {
  return <TabStub icon={ChartColumnStacked} title="Charts" description="Interactive price charts with advanced tools"
    features={[
      { icon: BarChart3, label: 'Candlestick Charts' }, { icon: LineChart, label: 'Line Charts' },
      { icon: TrendingUp, label: 'Technical Indicators' }, { icon: ChartColumnStacked, label: 'Volume Analysis' },
    ]} />
}

export function CopyTraderTab() {
  return <TabStub icon={Copy} title="Copy Trader" description="Copy trades from successful traders automatically"
    features={[
      { icon: Copy, label: 'Top Traders' }, { icon: TrendingUp, label: 'Performance Stats' },
      { icon: DollarSign, label: 'Profit Sharing' }, { icon: BarChart3, label: 'Risk Ratings' },
    ]} />
}

export function RiskCalculatorTab() {
  return <TabStub icon={ShieldCheck} title="Risk Calculator" description="Calculate and manage your trading risk"
    features={[
      { icon: ShieldCheck, label: 'Risk Assessment' }, { icon: DollarSign, label: 'Position Sizing' },
      { icon: TrendingUp, label: 'Risk/Reward Ratio' }, { icon: BarChart3, label: 'Scenario Analysis' },
    ]} />
}

export function TradeAcademyTab() {
  return <TabStub icon={GraduationCap} title="Trade Academy" description="Learn trading with structured courses and guides"
    features={[
      { icon: GraduationCap, label: 'Beginner Guides' }, { icon: BarChart3, label: 'Video Tutorials' },
      { icon: TrendingUp, label: 'Strategy Guides' }, { icon: ShieldCheck, label: 'Risk Management' },
    ]} />
}
