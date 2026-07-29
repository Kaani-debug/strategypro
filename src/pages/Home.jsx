import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSimulation } from '../hooks/useSimulation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AuthModal from '../components/AuthModal'
import GlassCard from '../components/GlassCard'

const features = [
  { icon: '🤖', title: 'AI-Powered Trading Bots', tag: 'Automate Your Success', text: 'Deploy intelligent trading strategies with our advanced bot system. No coding required, just configure, test, and let the bots work for you 24/7.' },
  { icon: '📊', title: 'Real-Time Market Analysis', tag: 'Data-Driven Decisions', text: 'Access professional-grade charts, indicators, and analytics. Track market trends, identify opportunities, and execute with confidence.' },
  { icon: '🔄', title: 'Copy Trading Network', tag: 'Follow Top Performers', text: 'Mirror successful traders automatically. Transparent performance metrics, full control over your capital, and instant execution.' },
  { icon: '🛡️', title: 'Risk Management Tools', tag: 'Protect Your Capital', text: 'Advanced stop-loss, take-profit, and position sizing tools. Set your risk parameters and trade with peace of mind.' },
]

const testimonials = [
  { initials: 'MG', name: 'Mark Gonzales', role: 'Professional Day Trader', text: 'StrategyPro transformed my trading. The automated bots handle my strategies flawlessly, and I\'ve seen consistent profits.' },
  { initials: 'KM', name: 'Kelvin Maxwell', role: 'Crypto Investor', text: 'Copy trading feature is incredible! I follow top performers and my portfolio has grown 40% in 3 months.' },
  { initials: 'DG', name: 'Delvoux Glen', role: 'Forex Specialist', text: 'Lightning-fast execution and professional-grade tools. The risk management features saved me from major losses.' },
  { initials: 'AK', name: 'Aisha Khan', role: 'Algorithmic Trader', text: 'The strategy builder let me automate my own setups without writing a line of code.' },
  { initials: 'JO', name: 'James Okoro', role: 'Independent Trader', text: 'Having bots and copy trading in one dashboard saves me hours every week.' },
  { initials: 'SL', name: 'Sophie Laurent', role: 'Options Trader', text: 'The mobile experience is excellent. I can monitor my bots from anywhere.' },
  { initials: 'RP', name: 'Raj Patel', role: 'Quantitative Analyst', text: 'Clean charting tools and reliable data exports. The risk management settings give me real control.' },
  { initials: 'EP', name: 'Elena Petrova', role: 'Portfolio Manager', text: 'Copying top-performing strategies gave my portfolio steady growth without watching charts all day.' },
]

const whyItems = [
  { icon: '🔒', title: 'Bank-Grade Security', text: 'Encrypted sessions and enterprise-grade security protocols.' },
  { icon: '⚡', title: 'Lightning-Fast Execution', text: 'Trade execution under 50ms ensures you never miss an opportunity.' },
  { icon: '🎯', title: 'Virtual Account', text: 'Practice risk-free with a $10,000 virtual account.' },
  { icon: '💬', title: '24/7 Customer Support', text: 'Our support team is available around the clock.' },
  { icon: '📈', title: 'Multi-Asset Trading', text: 'Trade across forex, crypto, indices, and more.' },
  { icon: '📱', title: 'Mobile App', text: 'Monitor your bots and adjust settings on the go.' },
]

export default function Home() {
  const { user } = useAuth()
  const { prices, connected, getDirection, SYMBOLS } = useSimulation()
  const [authOpen, setAuthOpen] = useState(false)

  const vols = SYMBOLS.map(sym => ({ label: sym, value: prices[sym]?.toFixed(4) || '0', dir: getDirection(sym) }))

  return (
    <>
      <Header />
      <section className="hero section" id="hero">
        <div className="container">
          <div className="hero__badge fade-in">
            <span className="hero__badge-dot"></span>
            Trusted by 50,000+ Traders Worldwide
          </div>
          <div className="hero__content">
            <div className="fade-in-up">
              <h1 className="hero__title">Strategy<span>Pro</span> —<br />Automated Trading Bots,<br />Analysis &amp; Copy Trading</h1>
              <p className="hero__text">Your all-in-one workspace for automated trading, smart bots, and real-time market insights.</p>
              <div className="hero__actions">
                <button className="btn btn--primary btn--lg glow-btn" onClick={() => user ? window.location.href = '/app' : setAuthOpen(true)}>
                  {user ? 'Go to Dashboard' : 'Start Trading Now'}
                </button>
                <a href="#features" className="btn btn--outline btn--lg">Learn More</a>
              </div>
              <p className="hero__caption"><strong>No Credit Card Required</strong> &mdash; $10,000 Virtual Account</p>
            </div>
            <GlassCard glow className="fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="vol-panel">
                <div className="vol-panel__header">
                  <span className="vol-panel__title">Market Volatility</span>
                  <span className={`vol-panel__status ${connected ? '' : 'connecting'}`}>{connected ? '● Live' : '○ Connecting...'}</span>
                </div>
                <div className="vol-panel__list">
                  {vols.map((v, i) => (
                    <div className="vol-panel__item" key={i}>
                      <span className="vol-panel__label">{v.label}</span>
                      <span className={`vol-panel__value vol-panel__value--${v.dir}`}>
                        {v.dir === 'up' ? '▲' : '▼'} {v.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="stats section">
        <div className="container">
          <div className="stats__grid">
            {[{n:'7K+',l:'Active Traders'},{n:'$0.3B+',l:'Trading Volume'},{n:'14.0%',l:'Uptime'},{n:'21+',l:'Trading Pairs'}].map((s,i) => (
              <div className="fade-in-up" key={i} style={{animationDelay: `${i*0.1}s`}}>
                <div className="stats__number">{s.n}</div>
                <div className="stats__label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section features" id="features">
        <div className="container">
          <h2 className="section__title fade-in">Powerful Features for Modern Traders</h2>
          <p className="section__subtitle fade-in">Everything you need to succeed in today's fast-paced markets</p>
          <div className="features__grid">
            {features.map((f, i) => (
              <GlassCard key={i} glow className={`fade-in-up`} style={{animationDelay: `${i*0.1}s`}}>
                <div className="feature-card__icon">{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <div className="feature-card__tag">{f.tag}</div>
                <p className="feature-card__text">{f.text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials" id="testimonials">
        <div className="container">
          <h2 className="section__title fade-in">Trusted by Traders Worldwide</h2>
          <p className="section__subtitle fade-in">Join thousands of successful traders who have transformed their trading with StrategyPro</p>
          <div className="testimonials__grid">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className={`fade-in-up`} style={{animationDelay: `${i*0.05}s`}}>
                <p className="testimonial-card__text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-choose" id="why">
        <div className="container">
          <h2 className="section__title fade-in">Why Choose StrategyPro?</h2>
          <p className="section__subtitle fade-in">Join the platform that's redefining automated trading</p>
          <div className="why-choose__grid">
            {whyItems.map((item, i) => (
              <div className="why-item fade-in-up" key={i} style={{animationDelay: `${i*0.08}s`}}>
                <div className="why-item__icon">{item.icon}</div>
                <div className="why-item__title">{item.title}</div>
                <p className="why-item__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container">
          <h2 className="cta__title fade-in">Ready to Transform Your Trading?</h2>
          <p className="cta__text fade-in">Join 50,000+ traders who are already profiting with StrategyPro. Start with a free virtual account today.</p>
          <div className="cta__perks fade-in">
            <span className="cta__perk"><span className="cta__perk-icon">✓</span> No Credit Card</span>
            <span className="cta__perk"><span className="cta__perk-icon">✓</span> $10K Virtual Money</span>
            <span className="cta__perk"><span className="cta__perk-icon">✓</span> Full Platform Access</span>
          </div>
          <button className="btn btn--primary btn--lg glow-btn fade-in" onClick={() => user ? window.location.href = '/app' : setAuthOpen(true)}>
            {user ? 'Go to Dashboard' : 'Start Trading Now'}
          </button>
        </div>
      </section>

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
