import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__logo">Strategy<span>Pro</span></div>
          <div className="footer__links">
            <Link to="/#features" className="footer__link">Features</Link>
            <Link to="/#testimonials" className="footer__link">Testimonials</Link>
            <Link to="/#why" className="footer__link">Why Us</Link>
            <Link to="/" className="footer__link">Home</Link>
          </div>
        </div>
        <div className="footer__disclaimer">
          <p><strong>Risk Disclaimer:</strong> Derivatives are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money. Past performance is not indicative of future results. The information provided on this website is for educational purposes only and does not constitute financial advice.</p>
          <p style={{ marginTop: '1rem' }}>&copy; {new Date().getFullYear()} StrategyPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
