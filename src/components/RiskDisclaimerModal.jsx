import { TriangleAlert, X } from 'lucide-react'

export default function RiskDisclaimerModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="risk-disclaimer-overlay" onClick={onClose}>
      <div className="risk-disclaimer-modal" onClick={e => e.stopPropagation()}>
        <button className="risk-disclaimer-modal__close" onClick={onClose}>
          <X size={16} />
        </button>

        <TriangleAlert size={32} className="risk-disclaimer-modal__icon" />

        <h3 className="risk-disclaimer-modal__title">Risk Disclaimer</h3>

        <p className="risk-disclaimer-modal__text">
          Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products:
        </p>

        <ul className="risk-disclaimer-modal__list">
          <li>You may lose some or all of the money you invest in the trade.</li>
          <li>If your trade involves currency conversion, exchange rates will affect your profit and loss.</li>
          <li>You should never trade with borrowed money or with money that you cannot afford to lose.</li>
        </ul>
      </div>
    </div>
  )
}
