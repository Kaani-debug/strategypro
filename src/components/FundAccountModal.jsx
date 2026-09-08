import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, ChevronRight, CircleDollarSign, Lock, Send, ShieldCheck, Smartphone, Wallet, X, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAnalysisStore } from '../state/analysisStore'

const METHODS = [
  { id: 'mpesa', name: 'M-Pesa', brand: 'Safaricom', icon: Smartphone, hint: 'Deposit instantly from your M-Pesa wallet' },
  { id: 'airtel', name: 'Airtel Money', brand: 'Airtel', icon: Smartphone, hint: 'Deposit instantly from your Airtel Money' },
  { id: 'paypal', name: 'PayPal', brand: 'PayPal', icon: Wallet, hint: 'Pay securely with your PayPal balance' },
  { id: 'remitly', name: 'Remitly', brand: 'Remitly', icon: Send, hint: 'Transfer via your Remitly account' },
]

const AMOUNTS = [20, 50, 100, 200, 500]

const fmt = n => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const isMobileNumber = s => /^(07|01)\d{8}$/.test(s)
const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export default function FundAccountModal({ open, onClose }) {
  const { user, fundAccount } = useAuth()
  const [step, setStep] = useState('methods')
  const [method, setMethod] = useState(null)
  const [number, setNumber] = useState('')
  const [amount, setAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [txnRef, setTxnRef] = useState('')

  const account = useAnalysisStore(s => s.account)

  useEffect(() => {
    if (open) {
      setStep('methods')
      setMethod(null)
      setNumber('')
      setAmount(50)
      setCustomAmount('')
      setPin('')
      setError('')
      setProcessing(false)
      setTxnRef('')
    }
  }, [open])

  const isPinMethod = method?.id === 'mpesa' || method?.id === 'airtel'
  const finalAmount = customAmount ? Number(customAmount) : amount

  const selectMethod = m => {
    setMethod(m)
    setError('')
    setStep('form')
  }

  const formatNumber = raw => {
    const d = raw.replace(/\D/g, '').slice(0, 10)
    if (d.length > 6) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
    if (d.length > 3) return `${d.slice(0, 3)} ${d.slice(3)}`
    return d
  }

  const pickCustomAmount = v => {
    setCustomAmount(v)
    setAmount(null)
    setError('')
  }

  const submitForm = () => {
    setError('')
    if (!finalAmount || finalAmount < 1) {
      setError('Enter a deposit amount of at least $1.')
      return
    }
    if (isPinMethod) {
      if (!isMobileNumber(number.replace(/\s/g, ''))) {
        setError(method.id === 'mpesa' ? 'Enter a valid Safaricom number starting with 07 or 01 (10 digits).' : 'Enter a valid Airtel number (10 digits).')
        return
      }
      setTxnRef(`MP${Date.now().toString(36).toUpperCase().slice(-6)}`)
      setStep('pin')
    } else {
      if (method.id === 'paypal' && !isEmail(number.trim())) {
        setError('Enter the PayPal email address you want to pay from.')
        return
      }
      setTxnRef(method.id === 'paypal' ? `PP${Date.now().toString(36).toUpperCase().slice(-6)}` : `RM${Date.now().toString(36).toUpperCase().slice(-6)}`)
      setStep('pin')
    }
    setPin('')
  }

  const confirmPayment = () => {
    if (isPinMethod && pin.trim().length < 4) {
      setError('Enter your secret PIN to authorize the payment.')
      return
    }
    if (!isPinMethod && !(pin.trim().length >= 6)) {
      setError('Enter the confirmation code sent to your account.')
      return
    }
    setError('')
    setProcessing(true)
    setTimeout(() => {
      fundAccount(finalAmount)
      setProcessing(false)
      setStep('done')
    }, 900)
  }

  const newBalance = step === 'done' ? Number(user?.balance || account.balance) : Number(user?.balance ?? account.balance)

  const methodMeta = useMemo(() => METHODS.find(m => m.id === method?.id), [method])

  if (!open) return null

  return (
    <div className="fa-overlay" onClick={onClose}>
      <div className="fa-modal" role="dialog" aria-modal="true" aria-label="Fund Account" onClick={e => e.stopPropagation()}>
        <button className="fa-modal__close" onClick={onClose} aria-label="Close fund account">
          <X size={16} />
        </button>

        {step === 'methods' && (
          <div className="fa-body">
            <div className="fa-header">
              <CircleDollarSign size={26} />
              <h3 className="fa-title">Fund Your Real Account</h3>
              <p className="fa-sub">Deposit real money into your Deriv Real account. Funds are credited instantly.</p>
            </div>

            <div className="fa-balance">
              <span className="fa-balance__label">Current balance</span>
              <span className="fa-balance__value">
                {fmt(Number(user?.balance || account.balance))} <em>{account.currency}</em>
              </span>
            </div>

            <div className="fa-methods">
              {METHODS.map(m => {
                const Icon = m.icon
                return (
                  <button key={m.id} type="button" className="fa-method" onClick={() => selectMethod(m)}>
                    <span className="fa-method__icon"><Icon size={20} /></span>
                    <span className="fa-method__info">
                      <span className="fa-method__name">{m.name}</span>
                      <span className="fa-method__hint">{m.hint}</span>
                    </span>
                    <ChevronRight size={16} className="fa-method__chev" />
                  </button>
                )
              })}
            </div>

            <p className="fa-security"><ShieldCheck size={13} /> Deposits are processed securely. Your funds are credited to your Deriv Real account immediately.</p>
          </div>
        )}

        {step === 'form' && (
          <div className="fa-body">
            <button type="button" className="fa-back" onClick={() => setStep('methods')}><ArrowLeft size={14} /> All methods</button>

            <div className="fa-header">
              <span className="fa-method__icon fa-method__icon--big"><methodMeta.icon size={22} /></span>
              <h3 className="fa-title">Deposit via {methodMeta.name}</h3>
              <p className="fa-sub">
                {isPinMethod
                  ? `You will receive a ${methodMeta.brand} payment prompt to authorise the deposit.`
                  : `Complete the payment from your ${methodMeta.name} account.`}
              </p>
            </div>

            <div className="fa-form">
              {isPinMethod ? (
                <div className="fa-field">
                  <label className="fa-label">{methodMeta.brand} number</label>
                  <input
                    className="fa-input"
                    inputMode="tel"
                    placeholder="07XXXXXXXX"
                    value={number}
                    onChange={e => setNumber(formatNumber(e.target.value))}
                    autoFocus
                  />
                  <span className="fa-field-hint">A {methodMeta.name} prompt will be sent to this number.</span>
                </div>
              ) : (
                <div className="fa-field">
                  <label className="fa-label">{methodMeta.name} {methodMeta.id === 'paypal' ? 'email' : 'account'}</label>
                  <input
                    className="fa-input"
                    inputMode={methodMeta.id === 'paypal' ? 'email' : 'text'}
                    placeholder={methodMeta.id === 'paypal' ? 'you@example.com' : 'Your Remitly user ID'}
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              <div className="fa-field">
                <label className="fa-label">Amount (USD)</label>
                <div className="fa-amounts">
                  {AMOUNTS.map(a => (
                    <button
                      key={a}
                      type="button"
                      className={`fa-amount ${customAmount ? '' : amount === a ? 'fa-amount--active' : ''}`}
                      onClick={() => { setAmount(a); setCustomAmount('') }}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <input
                  className="fa-input fa-input--money"
                  inputMode="decimal"
                  placeholder="Or enter custom amount"
                  value={customAmount}
                  onChange={e => pickCustomAmount(e.target.value)}
                />
              </div>

              {error && <div className="fa-error">{error}</div>}

              <button type="button" className="fa-submit" onClick={submitForm}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'pin' && (
          <div className="fa-body">
            <div className="fa-header fa-header--center">
              <span className="fa-prompt">
                {isPinMethod ? <Zap size={18} /> : <Lock size={18} />}
              </span>
              <h3 className="fa-title">
                {isPinMethod ? `${methodMeta.name} Prompt` : 'Confirm Payment'}
              </h3>
              <p className="fa-sub">
                {isPinMethod
                  ? `A payment prompt of ${fmt(finalAmount)} was sent to ${formatNumber(number)}.`
                  : `Confirm payment of ${fmt(finalAmount)} from your ${methodMeta.name} account.`}
              </p>
            </div>

            <div className="fa-pin-card">
              <div className="fa-pin-card__row">
                <span>Amount</span>
                <b>{fmt(finalAmount)}</b>
              </div>
              <div className="fa-pin-card__row">
                <span>Reference</span>
                <b>{txnRef}</b>
              </div>
              <div className="fa-pin-card__row">
                <span>To</span>
                <b>Deriv Real · {account.id}</b>
              </div>
            </div>

            <div className="fa-form">
              <div className="fa-field">
                <label className="fa-label">
                  {isPinMethod ? 'Enter your secret PIN' : `${methodMeta.name} confirmation code`}
                </label>
                <input
                  className="fa-input fa-input--pin"
                  type="password"
                  inputMode={isPinMethod ? 'numeric' : 'text'}
                  placeholder={isPinMethod ? '••••' : 'Confirmation code'}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  autoFocus
                />
                <span className="fa-field-hint">
                  {isPinMethod ? 'Only your PIN is required to authorise this deposit.' : 'Enter the confirmation code we sent to you to authorise this deposit.'}
                </span>
              </div>

              {error && <div className="fa-error">{error}</div>}

              <button type="button" className="fa-submit" onClick={confirmPayment} disabled={processing}>
                {processing ? 'Processing…' : isPinMethod ? 'Pay & Deposit' : 'Confirm & Deposit'}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="fa-body">
            <div className="fa-done">
              <CheckCircle2 size={44} className="fa-done__icon" />
              <h3 className="fa-title">Deposit Successful</h3>
              <p className="fa-sub">
                {fmt(finalAmount)} has been credited to your Deriv Real account.
              </p>
              <div className="fa-balance">
                <span className="fa-balance__label">New real account balance</span>
                <span className="fa-balance__value">{fmt(newBalance)} <em>{account.currency}</em></span>
              </div>
              <button type="button" className="fa-submit" onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}