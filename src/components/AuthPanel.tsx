import { FormEvent, useState } from 'react'
import { ArrowRight, Mail, X } from 'lucide-react'
import { sendMagicLink } from '../lib/auth'

type Props = { onClose: () => void }

export function AuthPanel({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!email.includes('@')) return setError('Digite um e-mail válido.')
    setLoading(true)
    const result = await sendMagicLink(email.trim())
    setLoading(false)
    if (result.error) setError(result.error.message)
    else setMessage('Link enviado. Confira seu e-mail para entrar no ClosetShare.')
  }

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose}><X size={19} /></button>
      <div className="auth-icon"><Mail size={22} /></div>
      <span className="kicker">BEM-VINDO AO CLOSETSHARE</span>
      <h2>Entre no seu closet</h2>
      <p>Use seu e-mail para receber um link seguro de acesso.</p>
      <form onSubmit={submit}>
        <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" autoFocus /></label>
        {error && <div className="form-error">{error}</div>}
        {message && <div className="form-success">{message}</div>}
        <button className="btn primary auth-submit" disabled={loading}>{loading ? 'Enviando...' : <>Receber meu link <ArrowRight size={17} /></>}</button>
      </form>
      <small>Ao continuar, você concorda com os termos e a política de privacidade.</small>
    </div>
  </div>
}
