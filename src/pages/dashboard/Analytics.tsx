import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Download, Globe2, PieChart as PieIcon, TrendingUp, Music2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { streamsSeries, daily30, platformShares, countries, topTracks } from '../../data/seed'
import { fmtCompact, fmtMoney, fmtNumber } from '../../lib/format'

function MoneyTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-panel2 px-4 py-2.5 shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="mt-0.5 text-xs font-semibold" style={{ color: entry.color ?? '#F2C14E' }}>
          {entry.name}: {entry.name === 'Receita' ? fmtMoney(entry.value, currency) : fmtNumber(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { currency, toast } = useApp()
  const [range, setRange] = useState<'30d' | '12m'>('12m')

  useEffect(() => {
    document.title = 'Estatísticas | SonoraDrop'
  }, [])

  const totalStreams = streamsSeries.reduce((acc, m) => acc + m.streams, 0)
  const totalRevenue = streamsSeries.reduce((acc, m) => acc + m.receita, 0)

  const exportCsv = () => {
    const rows = [
      ['Mês', 'Streams', 'Receita (USD)'],
      ...streamsSeries.map((m) => [m.m, String(m.streams), String(m.receita)]),
    ]
    const csv = rows.map((r) => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sonoradrop-estatisticas.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast('Relatório CSV exportado com sucesso.', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Estatísticas</h1>
          <p className="mt-1 text-sm text-zinc-500">Streams, receitas e audiência — por loja, por país e por faixa.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-line bg-panel p-1 text-xs font-bold">
            {([['30d', '30 dias'], ['12m', '12 meses']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setRange(key)} aria-pressed={range === key} className={`rounded-lg px-4 py-2 transition ${range === key ? 'bg-gold-400 text-[#221503]' : 'text-zinc-500 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={exportCsv} className="btn-outline !py-2.5 text-xs"><Download size={15} /> Exportar CSV</button>
        </div>
      </div>

      {/* KPIs agregados */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ['Streams totais', fmtCompact(totalStreams), '+18,2% vs. período anterior'],
          ['Receita estimada', fmtMoney(totalRevenue, currency), '+15,7% vs. período anterior'],
          ['Países alcançados', '54', '+6 novos este ano'],
          ['Seguidores nas lojas', '24.318', '+1.874 este trimestre'],
        ].map(([label, value, delta]) => (
          <div key={label as string} className="card p-4 sm:p-5">
            <p className="font-display text-xl font-extrabold text-white sm:text-2xl">{value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-zinc-500">{label}</p>
            <p className="kpi-up mt-2"><TrendingUp size={12} />{delta}</p>
          </div>
        ))}
      </div>

      {/* Gráfico principal */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-white">{range === '12m' ? 'Streams por mês' : 'Streams por dia'}</h2>
          <span className="rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300">Atualizado hoje, 06:00</span>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            {range === '12m' ? (
              <AreaChart data={streamsSeries} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F2C14E" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#F2C14E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<MoneyTooltip currency={currency} />} cursor={{ stroke: 'rgba(242,193,78,0.3)', strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="streams" name="Streams" stroke="#F2C14E" strokeWidth={2.5} fill="url(#revFill)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            ) : (
              <BarChart data={daily30} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: '#71717A', fontSize: 9.5 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<MoneyTooltip currency={currency} />} cursor={{ fill: 'rgba(242,193,78,0.07)' }} />
                <Bar dataKey="streams" name="Streams" fill="#F2C14E" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Plataformas */}
        <div className="card p-5 sm:p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><PieIcon size={17} className="text-gold-400" /> Streams por loja</h2>
          <div className="mt-4 flex flex-col items-center gap-5">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={platformShares} dataKey="streams" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                    {platformShares.map((p) => <Cell key={p.name} fill={p.color} />)}
                  </Pie>
                  <Tooltip content={<MoneyTooltip currency={currency} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full space-y-2">
              {platformShares.map((p) => (
                <li key={p.name} className="flex items-center gap-2.5 text-[12px]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                  <span className="flex-1 text-zinc-400">{p.name}</span>
                  <span className="tabular-nums text-zinc-500">{fmtCompact(p.streams)}</span>
                  <span className="w-12 text-right font-semibold tabular-nums text-zinc-300">{p.pct.toFixed(1).replace('.', ',')}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Países */}
        <div className="card p-5 sm:p-6 lg:col-span-3">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><Globe2 size={17} className="text-gold-400" /> Audiência por país</h2>
          <ul className="mt-5 space-y-4">
            {countries.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-zinc-300"><span aria-hidden="true" className="text-base">{c.flag}</span>{c.name}</span>
                  <span className="tabular-nums text-zinc-500">{fmtCompact(c.streams)} <span className="text-zinc-600">· {c.pct}%</span></span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300" style={{ width: `${c.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top faixas */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><Music2 size={17} className="text-gold-400" /> Faixas com melhor desempenho</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Faixa</th>
                <th className="px-5 py-3 text-right">Streams</th>
                <th className="px-5 py-3 text-right">Receita</th>
              </tr>
            </thead>
            <tbody>
              {topTracks.map((track, i) => (
                <tr key={track.title} className="border-b border-line/60 transition last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-display font-extrabold text-gold-500/80">0{i + 1}</td>
                  <td className="px-5 py-3">
                    <span className="block font-semibold text-zinc-100">{track.title}</span>
                    <span className="text-[11px] text-zinc-600">{track.detail}</span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-zinc-300">{fmtNumber(track.streams)}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-gold-300">{fmtMoney(track.revenue, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
