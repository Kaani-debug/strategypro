import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Callback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Authenticating...')

  useEffect(() => {
    const code = searchParams.get('code')
    const token = searchParams.get('token1')

    if (token) {
      localStorage.setItem('auth_token', token)
      setStatus('Authentication successful! Redirecting...')
      setTimeout(() => { navigate('/app') }, 1500)
    } else if (code) {
      setStatus('Authorization code received. Exchanging for token...')
      setTimeout(() => { navigate('/app') }, 2000)
    } else {
      setStatus('No authentication data received. Redirecting to login...')
      setTimeout(() => { navigate('/login') }, 2000)
    }
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container" style={{textAlign:'center',paddingTop:'8rem'}}>
          <div className="auth-card" style={{margin:'0 auto'}}>
            <h2 style={{fontSize:'2rem',fontWeight:600,marginBottom:'1rem'}}>OAuth Callback</h2>
            <p style={{color:'var(--du-text-less-prominent)'}}>{status}</p>
            <div className="derivs-loader" style={{margin:'2rem auto'}}>
              {[1,2,3,4,5].map(i => <span key={i} className="derivs-loader__element" style={{background:'var(--du-brand-red-coral)'}} />)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
