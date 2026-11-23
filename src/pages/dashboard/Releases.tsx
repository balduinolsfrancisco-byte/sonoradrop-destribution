import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search,
  Plus,
  Disc3,
  Trash2,
  Eye,
  PenLine,
  AlertTriangle,
  CheckCircle2,
  Music,
  Store,
  CalendarDays,
  Barcode,
  ShieldCheck,
  ListMusic,
} from 'lucide-react'
import Modal from '../../components/Modal'
import StatusBadge, { TYPE_LABEL } from '../../components/StatusBadge'
import { useApp } from '../../context/AppContext'
import type { Release, ReleaseStatus } from '../../types'
import { fmtCompact, fmtDate, fmtMoney, fmtNumber } from '../../lib/format'

const TABS: { key: ReleaseStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'live', label: 'Ao vivo' },
  { key: 'processing', label: 'A processar' },
  { key: 'action_required', label: 'Ação necessária' },
  { key: 'draft', label: 'Rascunhos' },
]

export default function Releases() {
  const { releases, removeRelease, updateRelease, toast, currency } = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = searchParams.get('tab') as ReleaseStatus | 'all' | null
  const [tab, setTab] = useState<ReleaseStatus | 'all'>(
    initialTab && TABS.some((t) => t.key === initialTab) ? initialTab : 'all',
  )
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [selected, setSelected] = useState<Release | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Release | null>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    document.title = 'Lançamentos | SonoraDrop'
  }, [])

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: releases.length, live: 0, processing: 0, action_required: 0, draft: 0 }
    for (const r of releases) base[r.status] += 1
    return base
  }, [releases])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return releases.filter((r) => {
      if (tab !== 'all' && r.status !== tab) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.genre.toLowerCase().includes(q) ||
        r.tracks.some((t) => t.title.toLowerCase().includes(q))
      )
    })
  }, [releases, tab, query])

  const applySearch = (value: string) => {
    setQuery(value)
    setSearchParams(value.trim() ? { q: value.trim() } : {}, { replace: true })
  }

  const resubmit = (release: Release) => {
    updateRelease(release.id, { status: 'processing', issue: undefined })
    setSelected(null)
    toast(`«${release.title}» foi reenviada para processamento.`, 'success')
  }

  const confirmRemove = () => {
    if (!confirmDelete) return
    removeRelease(confirmDelete.id)
    toast(`«${confirmDelete.title}» foi eliminado.`, 'info')
    setConfirmDelete(null)
    setSelected(null)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Lançamentos</h1>
          <p className="mt-1 text-sm text-zinc-500">Gere todo o teu catálogo num só lugar — do rascunho ao lançamento mundial.</p>
        </div>
        <button onClick={() => navigate('/painel/novo-lancamento')} className="btn-gold !py-2.5 text-sm">
          <Plus size={17} /> Novo lançamento
        </button>
      </div>

      {/* Pesquisa + separadores */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={query} onChange={(e) => applySearch(e.target.value)} placeholder="Procurar por título, género ou faixa…" className="input pl-11" aria-label="Procurar lançamentos" />
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por estado">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                tab === key ? 'border-gold-400/50 bg-gold-400/10 text-gold-300' : 'border-line text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label} <span className="ml-1 text-[10px] opacity-70">{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grelha de lançamentos */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <Disc3 size={44} className="text-zinc-700" />
          <div>
            <p className="font-display text-lg font-bold text-white">Nada por aqui (ainda)</p>
            <p className="mt-1 text-sm text-zinc-500">
              {query ? `Nenhum resultado para “${query}”.` : 'Ainda não tens lançamentos neste estado.'}
            </p>
          </div>
          <button onClick={() => navigate('/painel/novo-lancamento')} className="btn-gold !py-2.5 text-sm"><Plus size={16} /> Criar o primeiro lançamento</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((release) => (
            <article key={release.id} className="card card-hover group flex gap-4 p-4 sm:gap-5 sm:p-5">
              <img src={release.cover} alt={`Capa de ${release.title}`} className="h-28 w-28 shrink-0 rounded-xl border border-line object-cover sm:h-32 sm:w-32" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={release.status} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">{TYPE_LABEL[release.type]}</span>
                </div>
                <h2 className="mt-2 truncate font-display text-lg font-bold text-white">{release.title}</h2>
                <p className="text-xs text-zinc-500">{release.genre} · {fmtDate(release.releaseDate)}</p>
                {release.status === 'action_required' && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-rose-300/90"><AlertTriangle size={12} className="mt-0.5 shrink-0" />Capa com resolução insuficiente</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <div className="text-[11px] leading-tight text-zinc-500">
                    {release.status === 'live' ? (
                      <>
                        <p><span className="font-bold text-zinc-300">{fmtCompact(release.streams)}</span> streams</p>
                        <p><span className="font-bold text-gold-300">{fmtMoney(release.revenue, currency)}</span> em royalties</p>
                      </>
                    ) : (
                      <p>{release.tracks.length} {release.tracks.length === 1 ? 'faixa' : 'faixas'} · {release.platforms.length} lojas</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSelected(release)} title="Ver detalhes" aria-label="Ver detalhes" className="rounded-lg border border-line p-2 text-zinc-400 transition hover:border-gold-400/40 hover:text-gold-300">
                      <Eye size={16} />
                    </button>
                    {(release.status === 'draft' || release.status === 'action_required') && (
                      <button onClick={() => navigate(`/painel/novo-lancamento?rascunho=${release.id}`)} title="Continuar edição" aria-label="Continuar edição" className="rounded-lg border border-line p-2 text-zinc-400 transition hover:border-gold-400/40 hover:text-gold-300">
                        <PenLine size={16} />
                      </button>
                    )}
                    <button onClick={() => setConfirmDelete(release)} title="Eliminar" aria-label="Eliminar lançamento" className="rounded-lg border border-line p-2 text-zinc-500 transition hover:border-rose-400/40 hover:text-rose-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ''}
        subtitle={selected ? `${TYPE_LABEL[selected.type]} · ${selected.genre}` : undefined}
        size="lg"
        footer={
          selected?.status === 'action_required' ? (
            <>
              <button onClick={() => setSelected(null)} className="btn-ghost !py-2 text-xs">Fechar</button>
              <button onClick={() => navigate(`/painel/novo-lancamento?rascunho=${selected.id}`)} className="btn-outline !py-2 text-xs"><PenLine size={15} /> Corrigir lançamento</button>
              <button onClick={() => resubmit(selected)} className="btn-gold !py-2 text-xs"><CheckCircle2 size={15} /> Reenviar já</button>
            </>
          ) : (
            <button onClick={() => setSelected(null)} className="btn-outline !py-2 text-xs">Fechar</button>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            {selected.status === 'action_required' && selected.issue && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/[0.07] p-4">
                <AlertTriangle size={19} className="mt-0.5 shrink-0 text-rose-400" />
                <div>
                  <p className="text-sm font-bold text-rose-300">O que precisas de corrigir</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-rose-200/80">{selected.issue}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5 sm:flex-row">
              <img src={selected.cover} alt={`Capa de ${selected.title}`} className="h-44 w-44 shrink-0 rounded-2xl border border-line object-cover" />
              <dl className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {[
                  { icon: CalendarDays, label: 'Data de lançamento', value: fmtDate(selected.releaseDate) },
                  { icon: Store, label: 'Lojas', value: `${selected.platforms.length} plataformas` },
                  { icon: Barcode, label: 'UPC', value: selected.upc ?? 'Atribuído no envio' },
                  { icon: ShieldCheck, label: 'Direitos', value: '100% do artista' },
                  { icon: Music, label: 'Idioma', value: selected.language },
                  { icon: ListMusic, label: 'Faixas', value: String(selected.tracks.length) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-line bg-panel2 p-3">
                    <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500"><Icon size={12} />{label}</dt>
                    <dd className="mt-1 text-[13px] font-semibold text-zinc-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {selected.status === 'live' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gold-400/25 bg-gold-400/5 p-4 text-center">
                  <p className="font-display text-2xl font-extrabold text-gold-300">{fmtNumber(selected.streams)}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Streams totais</p>
                </div>
                <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-4 text-center">
                  <p className="font-display text-2xl font-extrabold text-emerald-400">{fmtMoney(selected.revenue, currency)}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Royalties gerados</p>
                </div>
              </div>
            )}

            <div>
              <p className="label">Faixas ({selected.tracks.length})</p>
              <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line">
                {selected.tracks.map((track, i) => (
                  <li key={track.id} className="flex items-center gap-3 bg-panel2 px-4 py-2.5 text-sm">
                    <span className="w-6 text-right font-display text-xs font-bold text-zinc-600">{i + 1}</span>
                    <span className="flex-1 truncate text-zinc-200">{track.title}</span>
                    {track.explicit && <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-[9px] font-black text-zinc-500">E</span>}
                    <span className="text-xs text-zinc-500">{track.duration}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmação de eliminação */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar lançamento"
        footer={
          <>
            <button onClick={() => setConfirmDelete(null)} className="btn-ghost !py-2 text-xs">Cancelar</button>
            <button onClick={confirmRemove} className="btn !bg-rose-500 !py-2 text-xs font-bold text-white hover:bg-rose-600"><Trash2 size={15} /> Eliminar definitivamente</button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-zinc-300">
          Tens a certeza de que queres eliminar <strong className="text-white">«{confirmDelete?.title}»</strong>? Esta ação remove o lançamento do painel. Nas lojas, o pedido de remoção demora 5–10 dias úteis.
        </p>
      </Modal>
    </div>
  )
}
