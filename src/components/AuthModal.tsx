import { FormEvent, useState } from 'react'
import { ArrowLeft, CheckCircle2, Mail, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

type Props = {
  open: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export function AuthModal({ open, onClose, onAuthenticated }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!isSupabaseConfigured || !supabase) {
      setError('O login ainda precisa ser conectado ao projeto Supabase. Configure as variáveis do ambiente para continuar.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    setSent(true)
  }

  const continueDemo = () => {
    onAuthenticated()
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        {!sent ? <>
          <div className="auth-icon"><Mail size={22} /></div>
          <span className="kicker">ACESSO RÁPIDO</span>
          <h2 id="auth-title">Entre para reservar</h2>
          <p>Use seu e-mail. Enviaremos um link seguro para acessar sua conta sem precisar criar senha.</p>
          <form onSubmit={submit}>
            <label htmlFor="email">Seu e-mail</label>
            <input id="email" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" autoFocus />
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-submit" disabled={loading}>{loading ? 'Enviando...' : 'Continuar com e-mail'}</button>
          </form>
          {!isSupabaseConfigured && <button className="demo-link" onClick={continueDemo}>Continuar em modo demonstração</button>}
          <small>Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.</small>
        </> : <div className="auth-success">
          <CheckCircle2 size={45} />
          <span className="kicker">QUASE LÁ</span>
          <h2>Confira seu e-mail</h2>
          <p>Enviamos o link de acesso para <strong>{email}</strong>. Abra o link para voltar ao ClosetShare.</p>
          <button className="auth-submit" onClick={() => { setSent(false); setEmail(''); onAuthenticated() }}>Voltar para a reserva</button>
          <button className="back-link" onClick={() => setSent(false)}><ArrowLeft size={15} /> Usar outro e-mail</button>
        </div>}
      </div>
    </div>
  )
}
