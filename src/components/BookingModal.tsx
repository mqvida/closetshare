import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, ShieldCheck, X } from 'lucide-react'

type Item = { id: number; title: string; price: number; image: string; owner: string }
type Props = { item: Item; open: boolean; onClose: () => void; authenticated: boolean; onLogin: () => void }

const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next }

export function BookingModal({ item, open, onClose, authenticated, onLogin }: Props) {
  const [start, setStart] = useState(() => addDays(new Date(), 7))
  const [duration, setDuration] = useState(3)
  const [confirmed, setConfirmed] = useState(false)
  const end = useMemo(() => addDays(start, duration - 1), [start, duration])
  const rental = item.price * duration
  const protection = Math.round(rental * 0.08)
  const platform = Math.round(rental * 0.12)
  const total = rental + protection + platform

  if (!open) return null

  const moveDate = (days: number) => setStart((date) => addDays(date, days))
  const reserve = () => {
    if (!authenticated) { onClose(); onLogin(); return }
    setConfirmed(true)
  }

  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="booking-modal" role="dialog" aria-modal="true">
      <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
      {!confirmed ? <>
        <div className="booking-header"><img src={item.image} alt={item.title} /><div><span>{item.owner}</span><h2>{item.title}</h2><strong>R$ {item.price}<small> / dia</small></strong></div></div>
        <div className="booking-step"><span className="step-badge">1</span><div><b>Escolha as datas</b><p>Disponível para locação</p></div></div>
        <div className="date-picker"><button onClick={() => moveDate(-7)} aria-label="Semana anterior"><ChevronLeft size={18} /></button><div><CalendarDays size={17} /><strong>{formatDate(start)} → {formatDate(end)}</strong><small>{duration} dias de aluguel</small></div><button onClick={() => moveDate(7)} aria-label="Próxima semana"><ChevronRight size={18} /></button></div>
        <div className="duration-row">{[2, 3, 4, 5].map((days) => <button key={days} className={duration === days ? 'selected' : ''} onClick={() => setDuration(days)}>{days} dias</button>)}</div>
        <div className="price-breakdown"><div><span>Aluguel · {duration} dias</span><strong>R$ {rental}</strong></div><div><span>Proteção da locação · 8%</span><strong>R$ {protection}</strong></div><div><span>Serviço ClosetShare · 12%</span><strong>R$ {platform}</strong></div><div className="total"><span>Total</span><strong>R$ {total}</strong></div></div>
        <div className="secure-note"><ShieldCheck size={17} /><span><b>Proteção incluída</b><small>Pagamento seguro e suporte em caso de problema.</small></span></div>
        <button className="reserve-btn" onClick={reserve}>{authenticated ? 'Confirmar reserva' : 'Entrar e continuar'} <ChevronRight size={17} /></button>
      </> : <div className="booking-confirmed"><div className="confirmed-icon"><Check size={30} /></div><span className="kicker">RESERVA SOLICITADA</span><h2>Está quase!</h2><p>Sua solicitação para <strong>{item.title}</strong> foi registrada para <strong>{formatDate(start)} a {formatDate(end)}</strong>.</p><div className="confirmation-card"><span>Total estimado</span><strong>R$ {total}</strong><small>O pagamento será solicitado após a confirmação do proprietário.</small></div><button className="reserve-btn" onClick={onClose}>Voltar ao catálogo</button></div>}
    </div>
  </div>
}
