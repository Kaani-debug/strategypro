import { useAuth } from '../../context/AuthContext'
import { Upload, Bot, Puzzle, Zap, Sparkles, RotateCcw, FileUp, ArrowUpDown, BarChart3, Eye, Undo2, Redo2, ZoomIn, ZoomOut } from 'lucide-react'

export default function DashboardTab() {
  const { user } = useAuth()

  const quickActions = [
    { icon: Upload, label: 'Upload Bot', color: '#ff444f' },
    { icon: Bot, label: 'Free Bots', color: '#4bb4b3' },
    { icon: Puzzle, label: 'Bot Editor', color: '#7c5cfc' },
    { icon: Zap, label: 'Quick Strategy', color: '#ffad3a' },
  ]

  const toolbarItems = [
    { icon: RotateCcw, label: 'Reset' },
    { icon: FileUp, label: 'Import' },
    { icon: ArrowUpDown, label: 'Sort' },
    { icon: BarChart3, label: 'Charts' },
    { icon: Eye, label: 'TradingView' },
    { icon: Undo2, label: 'Undo' },
    { icon: Redo2, label: 'Redo' },
    { icon: ZoomIn, label: 'Zoom In' },
    { icon: ZoomOut, label: 'Zoom Out' },
  ]

  return (
    <div className="dash-tab-content">
      {/* Hero */}
      <section className="dash-hero">
        <div className="dash-hero__greeting">
          Hello {user?.acctId || 'Trader'} <span className="dash-hero__wave">👋</span>
        </div>
        <h1 className="dash-hero__title">Your Ultimate Deriv Trading Companion.</h1>
      </section>

      {/* Quick Actions */}
      <section className="dash-quick-actions">
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-quick-actions__grid">
          {quickActions.map((action, i) => (
            <button key={i} className="dash-quick-card" style={{ '--card-accent': action.color }}>
              <div className="dash-quick-card__icon" style={{ background: `${action.color}15` }}>
                <action.icon size={24} color={action.color} />
              </div>
              <span className="dash-quick-card__label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Blockly Workspace */}
      <section className="dash-blockly">
        <div className="dash-blockly__toolbar">
          {toolbarItems.map((item, i) => (
            <button key={i} className="dash-blockly__toolbar-btn" title={item.label}>
              <item.icon size={16} />
            </button>
          ))}
        </div>
        <div className="dash-blockly__workspace">
          <div className="dash-blockly__placeholder">
            <Bot size={48} className="dash-blockly__placeholder-icon" />
            <p>Drag blocks here to build your strategy</p>
            <button className="btn btn--primary" style={{ marginTop: '1rem' }}>Get Started</button>
          </div>
        </div>
      </section>

      {/* AI Scanner */}
      <button className="dash-ai-scanner">
        <Sparkles size={20} />
        <span>AI Scanner</span>
      </button>

      {/* Audio elements */}
      <audio preload="auto" src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4B/f3+AgH+AgH9/f39/f3+AgH+AgH9/gH9/f39/f39/gH+AgH+AgH9/f3+AgH9/f39/f39/f39/f39/f39/f3+AgH9/f39/f4B/f39/f39/f38" />
    </div>
  )
}
