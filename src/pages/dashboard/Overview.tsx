import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Banknote,
  CircleAlert,
  Disc3,
  Headphones,
  PenLine,
  Radio,
  TrendingUp,
  TrendingDown,
  UploadCloud,
  Users,
  Music4,
  AlertTriangle,
  CreditCard,
  Music,
  FilePen,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { streamsSeries, topTracks, activityFeed } from '../../data/seed'
import { fmtCompact, fmtMoney, fmtNumber } from '../../lib/format'

const ACTIVITY_ICONS: Record<string, typeof Music> = {
  upload: UploadCloud,
  payment: CreditCard,
  music: Music,
  alert: AlertTriangle,
  draft: FilePen,
}

function ChartTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-panel2 px-4 py-2.5 shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 font-display text-sm font-bold text-gold-300">{fmtNumber(payload[0].value)} streams</p>
      <p className="text-xs text-zinc-400">≈ {fmtMoney(payload[0].payload.receita, currency)}</p>
    </div>
  )
}

export default function Overview() {
  const { user, releases, currency, profile } = useApp()
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 19 ? 'Boa tarde' : 'Boa noite'
  const today = new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const liveCount = releases.filter((r) => r.status === 'live').length
  const actionCount = releases.filter((r) => r.status === 'action_required').length
  const drafts = releases.filter((r) => r.status === 'draft')
  const maxTrack = topTracks[0].streams

  const kpis = [
    { icon: Headphones, label: 'Streams (30 dias)', value: '372.400', delta: '+12,4%', up: true, tone: 'text-gold-400 bg-gold-400/10' },
    { icon: Banknote, label: 'Receita (30 dias)', value: fmtMoney(640, currency), delta: '+9,1%', up: true, tone: 'text-emerald-400 bg-emerald-400/10' },
    { icon: Disc3, label: 'Lançamentos ao vivo', value: String(liveCount), delta: `${releases.length} no total`, up: true, tone: 'text-violet-300 bg-violet-400/10' },
    { icon: Users, label: 'Seguidores nas lojas', value: '24.318', delta: '+8,3%', up: true, tone: 'text-sky-400 bg-sky-400/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{today}</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold text-white sm:text-3xl">
            {greeting}, {profile.nomeArtistico.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Aqui está o retrato da tua música hoje.</p>
        </div>
        <button onClick={() => navigate('/painel/novo-lancamento')} className="btn-gold !py-2.5 text-sm">
          <UploadCloud size={17} /> Novo lançamento
        </button>
      </div>

      {/* Alerta de ação necessária */}
      {actionCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/[0.07] p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15"><CircleAlert size={20} className="text-rose-400" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-300">A tua música está parada à espera de ti</p>
            <p className="text-xs text-rose-200/70">«Mafuila» precisa de uma capa com resolução mínima de 1400×1400px para entrar nas lojas.</p>
          </div>
          <button onClick={() => navigate('/painel/lancamentos')} className="btn !border !border-rose-400/40 !py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/10">
            Resolver agora <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, delta, up, tone }) => (
          <div key={label} className="card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
              <span className={up ? 'kpi-up' : 'kpi-down'}>{up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{delta}</span>
            </div>
            <p className="mt-3 font-display text-xl font-extrabold text-white sm:text-2xl">{value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500 sm:text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Gráfico de streams */}
        <div className="card p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-white">Streams — últimos 12 meses</h2>
              <p className="text-xs text-zinc-500">Total: 2,74M streams · ≈ {fmtMoney(10420, currency)} em royalties</p>
            </div>
            <Link to="/painel/estatisticas" className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-300 transition hover:text-gold-200">
              Ver estatísticas completas <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={streamsSeries} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="streamFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F2C14E" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F2C14E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: '#71717A', fontSize: 10.5 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} tick={{ fill: '#71717A', fontSize: 10.5 }} axisLine={false} tickLine={false} width={38} />
                <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ stroke: 'rgba(242,193,78,0.35)', strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="streams" stroke="#F2C14E" strokeWidth={2.5} fill="url(#streamFill)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top faixas */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white">Top faixas</h2>
            <BarChart3 size={17} className="text-zinc-600" />
          </div>
          <ol className="mt-4 space-y-4">
            {topTracks.slice(0, 5).map((track, i) => (
              <li key={track.title}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-baseline gap-2.5">
                    <span className="font-display text-xs font-extrabold text-gold-500/80">0{i + 1}</span>
                    <span className="truncate text-[13px] font-semibold text-zinc-100">{track.title}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-zinc-500">{fmtCompact(track.streams)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300" style={{ width: `${(track.streams / maxTrack) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Atividade recente */}
        <div className="card p-5 sm:p-6 lg:col-span-2">
          <h2 className="font-display text-base font-bold text-white">Atividade recente</h2>
          <ul className="mt-4 divide-y divide-line">
            {activityFeed.map((item) => {
              const Icon = ACTIVITY_ICONS[item.icon] ?? Music4
              return (
                <li key={item.id} className="flex items-start gap-3 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-panel2 text-zinc-500"><Icon size={16} /></span>
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-snug text-zinc-300">{item.text}</span>
                    <span className="mt-1 block text-[11px] text-zinc-600">{item.tempo}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Rascunho / próximos passos */}
        <div className="space-y-4">
          {drafts.length > 0 && (
            <div className="card border-gold-400/25 p-5">
              <div className="flex items-center gap-2">
                <PenLine size={16} className="text-gold-400" />
                <h3 className="text-sm font-bold text-gold-300">Rascunho por concluir</h3>
              </div>
              <p className="mt-2 text-[13px] text-zinc-400">«{drafts[0].title}» está guardado como rascunho — conclui o envio e entra nas lojas esta semana.</p>
              <button onClick={() => navigate(`/painel/novo-lancamento?rascunho=${drafts[0].id}`)} className="btn-outline mt-3 w-full !py-2 text-xs">
                Continuar edição <ArrowRight size={13} />
              </button>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-gold-400" />
              <h3 className="text-sm font-bold text-white">Dica de promoção</h3>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
              Lança sempre numa <strong className="text-zinc-200">sexta-feira</strong>: o algoritmo do Spotify e do Boomplay privilegia lançamentos semanais. Marca a data no assistente de lançamento.
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">Teu plano: {user?.plano}</h3>
              <Link to="/painel/definicoes" className="text-[11px] font-bold uppercase tracking-wider text-gold-300 hover:text-gold-200">Gerir</Link>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">0% de comissão · pagamentos mensais · suporte prioritário via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
