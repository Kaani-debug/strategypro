import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSimulation } from '../hooks/useSimulation'
import {
  Zap, ArrowRight, Bot, ChartNoAxesColumn, Users, ShieldCheck,
  CircleCheckBig, TriangleAlert
} from 'lucide-react'

const FEATURES = [
  { icon: Bot, title: 'AI-Powered Trading Bots', tag: 'Automate Your Success', text: 'Deploy intelligent trading strategies with our advanced bot system. No coding required, just configure, test, and let the bots work for you 24/7.' },
  { icon: ChartNoAxesColumn, title: 'Real-Time Market Analysis', tag: 'Data-Driven Decisions', text: 'Access professional-grade charts, indicators, and analytics. Track market trends, identify opportunities, and execute with confidence.' },
  { icon: Users, title: 'Copy Trading Network', tag: 'Follow Top Performers', text: 'Mirror successful traders automatically. Transparent performance metrics, full control over your capital, and instant execution.' },
  { icon: ShieldCheck, title: 'Risk Management Tools', tag: 'Protect Your Capital', text: 'Advanced stop-loss, take-profit, and position sizing tools. Set your risk parameters and trade with peace of mind.' },
]

const REVIEWS = [
  { initials: 'MG', name: 'Mark Gonzales', role: 'Professional Day Trader', text: 'StrategyPro transformed my trading. The automated bots handle my strategies flawlessly, and I\'ve seen consistent profits. The platform is intuitive and powerful.' },
  { initials: 'KM', name: 'Kelvin Maxwell', role: 'Crypto Investor', text: 'Copy trading feature is incredible! I follow top performers and my portfolio has grown 40% in 3 months. The transparency and control are unmatched.' },
  { initials: 'DG', name: 'Delvoux Glen', role: 'Forex Specialist', text: 'Lightning-fast execution and professional-grade tools. The risk management features saved me from major losses. This is the future of trading.' },
  { initials: 'AK', name: 'Aisha Khan', role: 'Algorithmic Trader', text: 'The strategy builder let me automate my own setups without writing a line of code, and the backtests lined up closely with live results.' },
  { initials: 'JO', name: 'James Okoro', role: 'Independent Trader', text: 'Having bots and copy trading in one dashboard saves me hours every week. Withdrawals have always been smooth and on time.' },
  { initials: 'SL', name: 'Sophie Laurent', role: 'Options Trader', text: 'The mobile experience is excellent. I can check signals, adjust risk settings, and monitor my bots from anywhere.' },
  { initials: 'RP', name: 'Raj Patel', role: 'Quantitative Analyst', text: 'Clean charting tools and reliable data exports. The risk management settings give me real control over drawdown.' },
  { initials: 'EP', name: 'Elena Petrova', role: 'Portfolio Manager', text: 'Copying top-performing strategies gave my portfolio steady growth without needing to watch charts all day.' },
]

const TYPING_TEXTS = [
  'Automated Trading Bots, Analysis and Copy Trading',
  'Simplify your market analysis',
  'Clear signals and real-time analytics help you spot opportunities without the guesswork.',
]

const SYM_LIST = ['Vol 10', 'Vol 25', 'Vol 50', 'Vol 75', 'Vol 100', 'Vol 10 (1s)', 'Vol 100 (1s)', 'Bull Market', 'Bear Market']

function StarRating() {
  return (
    <div className="landing-page__review-stars" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className="landing-page__review-star is-active" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, hidden }) {
  return (
    <article className={`landing-page__review-card ${hidden ? 'aria-hidden' : ''}`} {...(hidden ? { 'aria-hidden': 'true' } : {})}>
      <div className="landing-page__review-avatar">
        <div className="landing-page__review-avatar-fallback" aria-hidden="true">{review.initials}</div>
      </div>
      <p className="landing-page__review-quote">&ldquo;{review.text}&rdquo;</p>
      <div className="landing-page__review-meta">
        <div className="landing-page__review-name">{review.name}</div>
        <div className="landing-page__review-role">{review.role}</div>
      </div>
      <StarRating />
    </article>
  )
}

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.scroll-reveal'))
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('scroll-reveal--visible'))
      return
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal--visible')
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('scroll-reveal--visible')
      } else {
        obs.observe(el)
      }
    })
    const safety = window.setTimeout(() => {
      els.forEach(el => el.classList.add('scroll-reveal--visible'))
      obs.disconnect()
    }, 4000)
    return () => {
      obs.disconnect()
      window.clearTimeout(safety)
    }
  }, [])
}

export default function Home() {
  const navigate = useNavigate()
  const { prices, connected, getDirection } = useSimulation()
  const [displayText, setDisplayText] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  useScrollReveal()

  useEffect(() => {
    const currentText = TYPING_TEXTS[textIdx]
    if (isDeleting) {
      if (charIdx <= 0) {
        setIsDeleting(false)
        setTextIdx(i => (i + 1) % TYPING_TEXTS.length)
        setCharIdx(0)
        return
      }
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIdx - 1))
        setCharIdx(c => c - 1)
      }, 25)
      return () => clearTimeout(timer)
    } else {
      if (charIdx >= currentText.length) {
        const timer = setTimeout(() => setIsDeleting(true), 3000)
        return () => clearTimeout(timer)
      }
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIdx + 1))
        setCharIdx(c => c + 1)
      }, 60)
      return () => clearTimeout(timer)
    }
  }, [charIdx, isDeleting, textIdx])

  return (
    <div className="landing-page-root">
      {/* Sticky header: 3 lines */}
      <div className="lp-sticky-header">
        {/* Line 1: Top running price ticker */}
        <div className="lp-ticker-top">
          <div className="lp-ticker-top__inner">
            <span className={`lp-ticker-top__status ${connected ? 'connected' : 'connecting'}`}>
              {connected ? '● LIVE' : '○ CONNECTING'}
            </span>
            {[...Array(2)].map((_, dup) => SYM_LIST.map((sym, i) => {
              const dir = getDirection(sym)
              return (
                <span key={`${dup}-${i}`} className={`lp-ticker-top__item ${dir}`}>
                  {sym}: {prices[sym]?.toFixed(2) || '---'} {dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—'}
                </span>
              )
            }))}
          </div>
        </div>

        {/* Line 2: Header with logo + login */}
        <header className="lp-header">
          <div className="lp-header__content">
            <div className="lp-header__logo">
              <span className="lp-header__logo-strat">Strategy</span>
              <span className="lp-header__logo-pro">Pro</span>
            </div>
            <button className="lp-header__login-btn" onClick={() => navigate('/login')}>
              <span>Login Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </header>

        {/* Line 3: Market ticker */}
        <div className="lp-market-ticker">
          <div className="lp-market-ticker__strip">
            {[...Array(2)].map((_, dup) => SYM_LIST.map((sym, i) => (
              <div key={`${dup}-${i}`} className="lp-market-ticker__item">
                <span className="lp-market-ticker__name">{sym}</span>
                <span className="lp-market-ticker__price">---</span>
              </div>
            )))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="lp-hero">
        <div className="lp-hero__bg" aria-hidden="true" />
        <div className="lp-hero__overlay" />
        <div className="lp-hero__inner">
          <div className="lp-hero__copy">
            <div className="lp-hero__badge">
              <Zap size={18} />
              <span>Trusted by 50,000+ Traders Worldwide</span>
            </div>
            <h1 className="lp-sr-only">StrategyPro - Automated Trading Bots, Analysis and Copy Trading</h1>
            <div className="lp-hero__typewriter">
              <p className="lp-hero__typewriter-line">
                <span>{displayText}</span>
                <span className="lp-hero__typewriter-cursor" />
              </p>
            </div>
            <div className="lp-hero__cta">
              <button className="lp-hero__cta-btn" onClick={() => navigate('/login')}>
                <span>Start Trading Now</span>
                <ArrowRight size={20} />
              </button>
              <div className="lp-hero__features-quick">
                <span><CircleCheckBig size={16} /> No Credit Card Required</span>
                <span><CircleCheckBig size={16} /> $10,000 Virtual Account</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews marquee — full width */}
        <div className="lp-hero__reviews scroll-reveal" aria-hidden="true">
          <div className="lp-hero__reviews-track">
            {[...Array(2)].map((_, dup) => REVIEWS.map((r, i) => (
              <ReviewCard key={`${dup}-${i}`} review={r} hidden={dup > 0} />
            )))}
          </div>
        </div>

        {/* Stats */}
        <div className="lp-hero__stats">
          {[
            { value: '50K+', label: 'Active Traders' },
            { value: '$2.5B+', label: 'Trading Volume' },
            { value: '99.9%', label: 'Uptime' },
            { value: '150+', label: 'Trading Pairs' },
          ].map((s, i) => (
            <div key={i} className="lp-hero__stat scroll-reveal">
              <div className="lp-hero__stat-value">{s.value}</div>
              <div className="lp-hero__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div className="lp-content">
        {/* Features */}
        <div className="lp-features">
          <span className="lp-section-eyebrow scroll-reveal">Platform</span>
          <h2 className="lp-features__title scroll-reveal">Powerful Features for Modern Traders</h2>
          <p className="lp-features__subtitle scroll-reveal">Everything you need to succeed in today's fast-paced markets</p>
          <p className="lp-features__intro scroll-reveal">Whether you prefer manual decisions, automated bot execution, or copy trading, StrategyPro gives you practical tools for finding setups, managing risk, and keeping your trading workflow simple.</p>
          <div className="lp-features__grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="lp-feature-card scroll-reveal">
                <div className="lp-feature-card__icon"><f.icon size={26} /></div>
                <h3 className="lp-feature-card__title">{f.title}</h3>
                <p className="lp-feature-card__tag">{f.tag}</p>
                <p className="lp-feature-card__text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <section className="lp-testimonials" aria-label="Reviews">
          <div className="lp-testimonials__header">
            <span className="lp-section-eyebrow scroll-reveal">Community</span>
            <h2 className="lp-testimonials__title scroll-reveal">Trusted by Traders Worldwide</h2>
            <p className="lp-testimonials__subtitle scroll-reveal">Join thousands of successful traders who have transformed their trading with StrategyPro</p>
            <div className="lp-testimonials__summary scroll-reveal">
              <div className="lp-trust-badge"><StarRating /><span>4.9 average rating</span></div>
              <div className="lp-trust-badge"><Users size={18} /><span>50,000+ traders</span></div>
              <div className="lp-trust-badge"><CircleCheckBig size={18} /><span>Verified reviews</span></div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <div className="lp-benefits">
          <span className="lp-section-eyebrow scroll-reveal">Why StrategyPro</span>
          <h2 className="lp-benefits__title scroll-reveal">Why Choose StrategyPro?</h2>
          <p className="lp-benefits__subtitle scroll-reveal">Join the platform that's redefining automated trading</p>
          <ul className="lp-benefits__list">
            {[
              'Bank-grade security with encrypted sessions',
              'Lightning-fast execution under 50ms',
              'Funded real-money accounts with instant deposits',
              '24/7 customer support and trading resources',
              'Multi-asset trading across forex, crypto, and indices',
              'Mobile app for trading on the go',
            ].map((b, i) => (
              <li key={i} className={`lp-benefit-item scroll-reveal ${i === 3 ? 'is-active' : ''}`}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Final CTA */}
        <div className="lp-final-cta">
          <div className="lp-final-cta__content">
            <span className="lp-section-eyebrow scroll-reveal">Get Started</span>
            <h2 className="lp-final-cta__title scroll-reveal">Ready to Transform Your Trading?</h2>
            <p className="lp-final-cta__text scroll-reveal">Join 50,000+ traders who are already profiting with StrategyPro. Fund your real account and start trading today.</p>
            <button className="lp-final-cta__btn scroll-reveal" onClick={() => navigate('/login')}>
              <span>Start Free Trial</span>
              <ArrowRight size={20} />
            </button>
            <div className="lp-final-cta__features scroll-reveal">
              <span>✓ No Credit Card</span>
              <span>✓ $10K Virtual Money</span>
              <span>✓ Full Platform Access</span>
            </div>
          </div>
        </div>

        {/* Risk disclaimer */}
        <div className="lp-risk-disclaimer scroll-reveal">
          <div className="lp-risk-disclaimer__content">
            <TriangleAlert size={24} className="lp-risk-disclaimer__icon" />
            <h3 className="lp-risk-disclaimer__title">⚠️ Risk Disclaimer</h3>
            <div className="lp-risk-disclaimer__text">
              <p>Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products:</p>
              <ul className="lp-risk-disclaimer__list">
                <li>You may lose some or all of the money you invest in the trade.</li>
                <li>If your trade involves currency conversion, exchange rates will affect your profit and loss.</li>
                <li>You should never trade with borrowed money or with money that you cannot afford to lose.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="lp-footer">
        <button className="lp-footer__icon" title="Fullscreen"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M14.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1H14v-3.5a.5.5 0 0 1 .5-.5m-13 0a.5.5 0 0 1 .5.5V14h3.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5m4-9a.5.5 0 0 1 0 1H2v3.5a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V2h-3.5a.5.5 0 0 1 0-1z" /></svg></button>
        <button className="lp-footer__lang">
          <svg viewBox="0 0 24 16" width="18" height="12"><path fill="#0D47A1" d="M0 2a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" /><path fill="#fff" d="M0 2a2 2 0 0 1 2-2h1.606L10 4.263V0h4v4.263L20.395 0H22a2 2 0 0 1 2 2v.404L18.606 6H24v4h-5.394L24 13.596V14a2 2 0 0 1-2 2h-1.606L14 11.737V16h-4v-4.263L3.606 16H2a2 2 0 0 1-2-2v-.404L5.394 10H0V6h5.394L0 2.404z" /><path fill="#F44336" d="M10.759 0v6.726H0v2.522h10.759V16h2.482V9.248H24V6.726H13.241V0z" /><path fill="#F44336" d="M22.764.151 14.07 5.885h1.52L23.495.672c-.2-.225-.449-.404-.73-.52M23.72 15.023l-7.483-4.934h-1.52l8.423 5.554c.235-.163.433-.375.58-.62M1.198 15.833l8.71-5.744h-1.52L.482 15.302c.194.227.439.41.716.53M.243 1.044l7.34 4.841h1.52L.793.405a2 2 0 0 0-.55.64" /></svg>
          <span>EN</span>
        </button>
        <div className="lp-footer__divider" />
        <button className="lp-footer__icon" title="Theme"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4m0-7C6.35 5 5 6.35 5 8s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3m.5-2.5v-2C8.5.22 8.28 0 8 0s-.5.22-.5.5v2c0 .28.22.5.5.5s.5-.22.5-.5m3.74 1.96 1.11-1.11c.2-.2.2-.51 0-.71s-.51-.2-.71 0l-1.11 1.11c-.2.2-.2.51 0 .71a.485.485 0 0 0 .7 0zm1.11 8.89c.2-.2.2-.51 0-.71l-1.11-1.11c-.2-.2-.51-.2-.71 0s-.2.51 0 .71l1.11 1.11a.485.485 0 0 0 .7 0zm-10 0 1.11-1.11c.2-.2.2-.51 0-.71s-.51-.2-.71 0l-1.11 1.11c-.2-.2-.2.51 0 .71a.485.485 0 0 0 .7 0zm1.11-8.89c.2-.2.2-.51 0-.71L3.35 2.64c-.2-.2-.51-.2-.71 0s-.2.51 0 .71l1.11 1.11a.485.485 0 0 0 .7 0zM16 8c0-.28-.22-.5-.5-.5h-2c-.28 0-.5.22-.5.5s.22.5.5.5h2c.28 0 .5-.22.5-.5m-7.5 7.5v-2c0-.28-.22-.5-.5-.5s-.5.22-.5.5v2c0 .28.22.5.5.5s.5-.22.5-.5M3 8c0-.28-.22-.5-.5-.5h-2c-.28 0-.5.22-.5.5s.22.5.5.5h2c.28 0 .5-.22.5-.5" /></svg></button>
        <div className="lp-footer__divider" />
        <button className="lp-footer__icon" title="Save"><svg viewBox="0 0 12 24" width="16" height="16"><path d="m5.625 18.875-5.5-5.5a.53.53 0 0 1 0-.719.53.53 0 0 1 .719 0L5.5 17.312V5.5c0-.25.219-.5.5-.5.25 0 .5.25.5.5v11.813l4.625-4.657a.53.53 0 0 1 .719 0 .53.53 0 0 1 0 .719l-5.5 5.5a.53.53 0 0 1-.719 0" /></svg></button>
        <div className="lp-footer__divider" />
        <div className="lp-footer__time">
          <span>{new Date().toUTCString().replace('GMT', 'GMT')}</span>
        </div>
        <div className="lp-footer__divider" />
        <div className="lp-footer__network">
          <div className="lp-footer__network-dot" />
        </div>
      </footer>
    </div>
  )
}
