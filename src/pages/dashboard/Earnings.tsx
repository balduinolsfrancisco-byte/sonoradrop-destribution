import { useEffect, useState, type FormEvent } from 'react'
import {
  Banknote,
  Wallet,
  Clock,
  PiggyBank,
  Smartphone,
  Landmark,
  CircleDollarSign,
  ArrowDownToLine,
  CheckCircle2,
  Hourglass,
  Info,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import Modal from '../../components/Modal'
import { useApp } from '../../context/AppContext'
import { streamsSeries, TOTAL_EARNED } from '../../data/seed'
import { fmtDate, fmtMoney, fmtUSD, fmtAOA, fmtNumber } from '../../lib/format'

const METHODS = [
  { id: 'Multicaixa Express', icon: Smartphone, detail: '•••• •••• •••• 6789 · instantâneo', note: 'Sem taxas' },
  { id: 'Transferência BAI (IBAN)', icon: Landmark, detail: 'AO06 0040 0000 1234 5678 9015 6 · Mário Kalunga', note: '1–2 dias úteis' },
  { id: 'PayPal', icon: CircleDollarSign, detail: 'mario@sonoradrop.ao', note: '1–3 dias úteis' },
]

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-panel2 px-4 py-2.5 shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-gold-300">{fmtUSD(payload[0].value)}</p>
    </div>
  )
}

export default function Earnings() {
  const { balance, pending, payouts, requestWithdrawal, currency, toast } = useApp()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState(METHODS[0].id)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Rendimentos | SonoraDrop'
  }, [])

  const openModal = () => {
    setAmount(balance.toFixed(2))
    setMethod(METHODS[0].id)
    setError(null)
    setOpen(true)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = Number(amount.replace(',', '.'))
    const problem = requestWithdrawal(value, method)
    if (problem) return setError(problem)
    setOpen(false)
    toast(`Levantamento de ${fmtUSD(value)} via ${method} pedido com sucesso.`, 'success')
  }

  const quickAmounts = [50, 100, 250, Math.floor(balance)]

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Rendimentos</h1>
          <p className="mt-1 text-sm text-zinc-500">O teu dinheiro, sempre visível — entra dia 5 de cada mês, direto para ti.</p>
        </div>
        <button onClick={openModal} className="btn-gold !py-3 text-sm"><ArrowDownToLine size={17} /> Levantar agora</button>
      </div>

      {/* Cartões de saldo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-gold-400/40 bg-gradient-to-br from-gold-400/15 via-panel to-panel p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/15"><Banknote size={21} className="text-gold-400" /></span>
          <p className="mt-4 font-display text-4xl font-extrabold text-gold-300">{fmtMoney(balance, currency)}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Saldo disponível para levantamento</p>
          <p className="mt-2 text-[11px] text-zinc-600">{currency === 'USD' ? `≈ ${fmtAOA(balance)}` : `≈ ${fmtUSD(balance)}`}</p>
        </div>
        <div className="card p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10"><Hourglass size={21} className="text-amber-400" /></span>
          <p className="mt-4 font-display text-3xl font-extrabold text-white">{fmtMoney(pending, currency)}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Pendente de pagamento</p>
          <p className="mt-2 text-[11px] text-zinc-600">Relatório de novembro · pago a 5 de dezembro</p>
        </div>
        <div className="card p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10"><PiggyBank size={21} className="text-emerald-400" /></span>
          <p className="mt-4 font-display text-3xl font-extrabold text-white">{fmtMoney(TOTAL_EARNED, currency)}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Total ganho desde 2021</p>
          <p className="mt-2 text-[11px] text-zinc-600">{fmtNumber(payouts.length)} pagamentos efetuados</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Gráfico de receita */}
        <div className="card p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-white">Receita por mês (USD)</h2>
            <span className="text-[11px] font-semibold text-zinc-500">últimos 12 meses</span>
          </div>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streamsSeries} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: '#71717A', fontSize: 10.5 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `$${v}`} tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} width={46} />
                <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(242,193,78,0.07)' }} />
                <Bar dataKey="receita" name="Receita" fill="#F2C14E" radius={[5, 5, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Métodos de pagamento */}
        <div className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><Wallet size={17} className="text-gold-400" /> Métodos de pagamento</h2>
          <ul className="mt-4 space-y-3">
            {METHODS.map(({ id, icon: Icon, detail, note }) => (
              <li key={id} className="rounded-xl border border-line bg-panel2 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400"><Icon size={17} /></span>
                    <span className="text-[13px] font-bold text-zinc-100">{id}</span>
                  </span>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">{note}</span>
                </div>
                <p className="mt-2 break-all text-[11px] leading-snug text-zinc-500">{detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 text-[11px] leading-snug text-zinc-500"><Info size={13} className="mt-0.5 shrink-0 text-gold-400" /> Mínimo de levantamento: $50. Pagamos a 5 de cada mês; pedidos são processados em 1–3 dias úteis, sem taxas da SonoraDrop.</p>
        </div>
      </div>

      {/* Histórico de pagamentos */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><Clock size={17} className="text-gold-400" /> Histórico de pagamentos</h2>
          <span className="text-[11px] text-zinc-500">{payouts.length} registos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Método</th>
                <th className="px-5 py-3 text-right">Valor</th>
                <th className="px-5 py-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-b border-line/60 transition last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 text-zinc-300">{fmtDate(payout.date)}</td>
                  <td className="px-5 py-3.5 text-zinc-400">{payout.method}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-zinc-100">{fmtUSD(payout.amount)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${payout.status === 'Concluído' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-400' : 'border-amber-400/25 bg-amber-400/10 text-amber-300'}`}>
                      {payout.status === 'Concluído' ? <CheckCircle2 size={12} /> : <Hourglass size={12} />}
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de levantamento */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Levantar rendimentos"
        subtitle={`Saldo disponível: ${fmtUSD(balance)}`}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="btn-ghost !py-2 text-xs">Cancelar</button>
            <button form="withdraw-form" type="submit" className="btn-gold !py-2.5 text-xs"><ArrowDownToLine size={15} /> Confirmar levantamento</button>
          </>
        }
      >
        <form id="withdraw-form" onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="valor" className="label">Valor (USD)</label>
            <input id="valor" type="number" min={50} step="0.01" inputMode="decimal" value={amount} onChange={(e) => { setAmount(e.target.value); setError(null) }} className="input !py-3.5 font-display text-xl font-bold" autoFocus required />
            <div className="mt-2 flex flex-wrap gap-2">
              {quickAmounts.filter((v) => v >= 50 && v <= balance).map((v) => (
                <button key={v} type="button" onClick={() => { setAmount(String(v)); setError(null) }} className="rounded-full border border-line px-3 py-1.5 text-[11px] font-bold text-zinc-400 transition hover:border-gold-400/40 hover:text-gold-300">
                  {v >= Math.floor(balance) ? 'Tudo' : `$${v}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="label">Método de pagamento</span>
            <div className="space-y-2">
              {METHODS.map(({ id, icon: Icon, detail }) => (
                <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${method === id ? 'border-gold-400/50 bg-gold-400/5' : 'border-line hover:border-zinc-700'}`}>
                  <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="h-4 w-4 accent-[#F2C14E]" />
                  <Icon size={18} className="shrink-0 text-gold-400" />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold text-zinc-100">{id}</span>
                    <span className="block truncate text-[10.5px] text-zinc-500">{detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">{error}</p>}
        </form>
      </Modal>
    </div>
  )
}
