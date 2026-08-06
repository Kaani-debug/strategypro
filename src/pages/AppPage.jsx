import { useState, useEffect } from 'react'
import DerivHeader from '../components/DerivHeader'
import AppFooter from '../components/AppFooter'
import BotControlBar from '../components/BotControlBar'
import TradeResultsPanel from '../components/results/TradeResultsPanel'
import { useSessionStore } from '../state/sessionStore'
import DashboardTab from './tabs/DashboardTab'
import BotBuilderTab from './tabs/BotBuilderTab'
import AnalysisToolTab from './tabs/AnalysisTool'
import { FreeBotsTab, SpeedbotTab, AISoftwareTab, AutoTraderTab, ManualTraderTab, BulkTraderTab, ChartsTab, CopyTraderTab, RiskCalculatorTab, TradeAcademyTab } from './tabs/stubs'
import { House, Bot, Boxes, Gauge, Sparkles, Briefcase, Search, MonitorPlay, HandCoins, ChartColumnStacked, Copy, ShieldCheck, GraduationCap } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: House, order: 0, component: DashboardTab },
  { id: 'bot-builder', label: 'Bot Builder', icon: Bot, order: 1, component: BotBuilderTab },
  { id: 'free-bots', label: 'Free Bots', icon: Boxes, order: 2, component: FreeBotsTab },
  { id: 'speedbot', label: 'Speedbot', icon: Gauge, order: 3, component: SpeedbotTab },
  { id: 'ai-software', label: 'AI Software', icon: Sparkles, order: 4, component: AISoftwareTab },
  { id: 'auto-trader', label: 'Auto Trader', icon: Briefcase, order: 5, component: AutoTraderTab },
  { id: 'analysis-tool', label: 'Analysis Tool', icon: Search, order: 6, component: AnalysisToolTab },
  { id: 'manual-trader', label: 'Manual Trader', icon: MonitorPlay, order: 7, component: ManualTraderTab },
  { id: 'bulk-trader', label: 'Bulk Trader', icon: HandCoins, order: 8, component: BulkTraderTab },
  { id: 'charts', label: 'Charts', icon: ChartColumnStacked, order: 9, component: ChartsTab },
  { id: 'copy-trader', label: 'Copy Trader', icon: Copy, order: 10, component: CopyTraderTab },
  { id: 'risk-calculator', label: 'Risk Calculator', icon: ShieldCheck, order: 11, component: RiskCalculatorTab },
  { id: 'trade-academy', label: 'Trade Academy', icon: GraduationCap, order: 12, component: TradeAcademyTab },
]

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('analysis-tool')

  useEffect(() => () => useSessionStore.getState().dispose(), [])

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || DashboardTab

  return (
    <div className="app-page">
      <DerivHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="dc-tabs--main__tabs" style={{ '--tab-width': `${100 / TABS.length}%` }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`dc-tabs__item ${activeTab === tab.id ? 'dc-tabs__active' : ''}`}
              style={{ order: tab.order }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <main className="dc-tab-content">
        <ActiveComponent />
      </main>

      <BotControlBar />
      <AppFooter />

      <TradeResultsPanel />
    </div>
  )
}
