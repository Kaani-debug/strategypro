import { useState, useEffect } from 'react'
import { ShieldCheck, Cookie, Settings, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const STORAGE_KEY = 'sp_cookies_consent'

const DEFAULT_PREFS = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveConsent(accepted, categories) {
  const payload = {
    accepted,
    categories: { ...DEFAULT_PREFS, ...categories },
    timestamp: new Date().toISOString(),
    version: '1.0',
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function getConsent() {
  return loadConsent()
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS })

  useEffect(() => {
    const existing = loadConsent()
    if (!existing) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const acceptAll = () => {
    saveConsent(true, { necessary: true, analytics: true, marketing: true, preferences: true })
    setVisible(false)
  }

  const rejectAll = () => {
    saveConsent(false, { necessary: true, analytics: false, marketing: false, preferences: false })
    setVisible(false)
  }

  const savePrefs = () => {
    saveConsent(true, prefs)
    setVisible(false)
  }

  const togglePref = key => {
    if (key === 'necessary') return
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  if (!visible) return null

  return (
    <div className="cc-overlay" role="dialog" aria-label="Cookie Consent" aria-modal="true">
      <div className="cc-backdrop" />
      <div className="cc-panel">
        <div className="cc-header">
          <div className="cc-header__icon">
            <Cookie size={28} />
          </div>
          <div className="cc-header__text">
            <h2 className="cc-title">We Value Your Privacy</h2>
            <p className="cc-subtitle">
              This website uses cookies to enhance your browsing experience, provide personalized
              content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to
              the use of all cookies.
            </p>
          </div>
        </div>

        <div className="cc-categories">
          <button className="cc-cat-toggle" onClick={() => setShowDetails(d => !d)}>
            <Settings size={14} />
            <span>Cookie Settings</span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <div className="cc-cat-list">
              <CookieCategory
                label="Strictly Necessary"
                description="Required for the website to function properly. These cookies enable core features such as security, session management, and accessibility."
                required
                checked={prefs.necessary}
                onToggle={() => togglePref('necessary')}
              />
              <CookieCategory
                label="Analytics & Performance"
                description="Help us understand how visitors interact with our website by collecting anonymous usage data. This allows us to improve performance and user experience."
                checked={prefs.analytics}
                onToggle={() => togglePref('analytics')}
              />
              <CookieCategory
                label="Marketing & Advertising"
                description="Used to deliver relevant advertisements and track campaign effectiveness. These cookies may be set by third-party advertising partners."
                checked={prefs.marketing}
                onToggle={() => togglePref('marketing')}
              />
              <CookieCategory
                label="Functionality & Preferences"
                description="Remember your settings and preferences to provide a more personalized experience, such as your preferred language, theme, and chart layouts."
                checked={prefs.preferences}
                onToggle={() => togglePref('preferences')}
              />
            </div>
          )}
        </div>

        <div className="cc-actions">
          <button className="cc-btn cc-btn--reject" onClick={rejectAll}>
            Reject All
          </button>
          {showDetails && (
            <button className="cc-btn cc-btn--save" onClick={savePrefs}>
              Save Preferences
            </button>
          )}
          <button className="cc-btn cc-btn--accept" onClick={acceptAll}>
            <ShieldCheck size={15} />
            Accept All
          </button>
        </div>

        <div className="cc-footer">
          <span className="cc-footer__text">
            We comply with GDPR, CCPA, and ePrivacy Directive requirements.
          </span>
          <a className="cc-footer__link" href="#cookie-policy" onClick={e => e.preventDefault()}>
            Full Cookie Policy
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  )
}

function CookieCategory({ label, description, required, checked, onToggle }) {
  return (
    <div className={`cc-cat ${required ? 'cc-cat--required' : ''}`}>
      <div className="cc-cat__info">
        <span className="cc-cat__label">{label}</span>
        {required && <span className="cc-cat__badge">Always Active</span>}
        <p className="cc-cat__desc">{description}</p>
      </div>
      <label className="cc-cat__toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          disabled={required}
        />
        <span className="cc-cat__slider" />
      </label>
    </div>
  )
}
