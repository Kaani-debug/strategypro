import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import RiskDisclaimerModal from '../RiskDisclaimerModal'

export default function RiskDisclaimerBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <footer className="ws-disclaimer">
        <button className="ws-disclaimer__link" onClick={() => setOpen(true)}>
          <TriangleAlert size={13} />
          <span>Risk Disclaimer</span>
        </button>
        <p className="ws-disclaimer__text">
          Trading involves substantial risk of loss. Analytical outputs assist decision-making and do not guarantee outcomes.
          Never trade with funds you cannot afford to lose.
        </p>
      </footer>
      <RiskDisclaimerModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
