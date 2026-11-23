import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Disc3,
  UploadCloud,
  Plus,
  Rocket,
  Save,
  BadgeCheck,
  Store,
  ListMusic,
  ImageIcon,
  Sparkles,
  Info,
  FileText,
  Music2,
  Trash2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { GENRES, LANGUAGES, PLATFORM_GROUPS, PLATFORM_CATALOG, SUGGESTED_COVERS } from '../../data/seed'
import { todaysISO, uid } from '../../lib/format'
import type { ReleaseType, Track } from '../../types'
import StatusBadge from '../../components/StatusBadge'

const STEPS = [
  { n: 1, label: 'Detalhes', icon: FileText },
  { n: 2, label: 'Faixas & capa', icon: ListMusic },
  { n: 3, label: 'Lojas', icon: Store },
  { n: 4, label: 'Revisão', icon: BadgeCheck },
]

const generateUpc = () => String(Math.floor(8_410_000_000_000 + Math.random() * 89_999_999_999)).slice(0, 13)

const freshTrack = (): Track => ({ id: uid(), title: '', duration: '', explicit: false })

export default function NewRelease() {
  const { releases, addRelease, updateRelease, toast, user } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const editId = searchParams.get('rascunho') ?? searchParams.get('editar')
  const draft = useMemo(() => {
    const found = releases.find((r) => r.id === editId)
    return found && (found.status === 'draft' || found.status === 'action_required') ? found : null
  }, [releases, editId])
  const isDraft = draft?.status === 'draft'

  const [step, setStep] = useState(0)
  const [type, setType] = useState<ReleaseType>(draft?.type ?? 'single')
  const [title, setTitle] = useState(draft?.title ?? '')
  const [genre, setGenre] = useState(draft?.genre ?? GENRES[0])
  const [language, setLanguage] = useState(draft?.language ?? LANGUAGES[0])
  const [releaseDate, setReleaseDate] = useState(draft?.releaseDate ?? '')
  const [tracks, setTracks] = useState<Track[]>(draft?.tracks?.length ? draft.tracks : [freshTrack()])
  const [cover, setCover] = useState<string | null>(draft?.cover ?? null)
  const [platforms, setPlatforms] = useState<string[]>(draft?.platforms ?? [...PLATFORM_CATALOG])
  const [rights, setRights] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Novo lançamento | SonoraDrop'
  }, [])

  useEffect(() => {
    setError(null)
  }, [step])

  const changeType = (t: ReleaseType) => {
    setType(t)
    if (t === 'single' && tracks.length > 1) setTracks((prev) => prev.slice(0, 1))
  }

  const updateTrack = (id: string, patch: Partial<Track>) =>
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const addTrack = () => {
    if (tracks.length >= 20) return
    setTracks((prev) => [...prev, freshTrack()])
  }

  const removeTrack = (id: string) => {
    setTracks((prev) => (prev.length > 1 ? prev.filter((t) => t.id !== id) : prev))
  }

  const togglePlatform = (name: string) =>
    setPlatforms((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]))

  const allSelected = platforms.length === PLATFORM_CATALOG.length
  const toggleAll = () => setPlatforms(allSelected ? [] : [...PLATFORM_CATALOG])

  /* Upload com redimensionamento automático para 1000×1000 JPEG */
  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('O ficheiro tem de ser uma imagem (JPG ou PNG).')
      return
    }
    const img = new Image()
    const reader = new FileReader()
    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = Math.min(1000, Math.max(img.width, img.height))
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, size, size)
          const ratio = Math.min(size / img.width, size / img.height)
          const w = img.width * ratio
          const h = img.height * ratio
          ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
          setCover(canvas.toDataURL('image/jpeg', 0.88))
          setError(null)
        }
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  /* Validação por passo */
  const validateStep = (s: number): string | null => {
    if (s === 0) {
      if (title.trim().length < 2) return 'Indica o título do lançamento.'
      if (!releaseDate) return 'Escolhe a data de lançamento.'
      const chosen = new Date(`${releaseDate}T00:00:00`)
      const minDate = new Date(`${todaysISO()}T00:00:00`)
      if (Number.isNaN(chosen.getTime())) return 'A data de lançamento não é válida.'
      if (chosen < minDate) return 'A data de lançamento tem de ser hoje ou no futuro.'
      return null
    }
    if (s === 1 && tracks.some((t) => t.title.trim().length > 120)) {
      return 'O título de uma faixa é demasiado longo (máx. 120 caracteres).'
    }
    if (s === 1) {
      for (const [i, t] of tracks.entries()) {
        if (!t.title.trim()) return `A faixa ${i + 1} precisa de um título.`
        if (!/^\d{1,2}:[0-5]\d$/.test(t.duration.trim())) return `A faixa ${i + 1} precisa de duração no formato mm:ss (ex.: 3:24).`
      }
      if (!cover) return 'Adiciona uma capa (upload ou uma das capas sugeridas).'
      return null
    }
    if (s === 2) {
      if (platforms.length === 0) return 'Seleciona pelo menos uma loja.'
      return null
    }
    return null
  }

  const next = () => {
    const problem = validateStep(step)
    if (problem) return setError(problem)
    setStep((s) => Math.min(3, s + 1))
  }

  const saveDraft = () => {
    const name = title.trim() || 'Sem título'
    if (draft) {
      updateRelease(draft.id, { title: name, type, genre, language, releaseDate: releaseDate || todaysISO(), tracks, cover: cover ?? draft.cover, platforms, status: 'draft', issue: undefined })
      toast('Rascunho atualizado.', 'info')
      navigate('/painel/lancamentos?tab=draft')
    } else {
      const created = addRelease({
        title: name, type, genre, language,
        releaseDate: releaseDate || todaysISO(),
        tracks: tracks.filter((t) => t.title.trim()).length ? tracks : [{ ...freshTrack(), title: name }],
        cover: cover ?? SUGGESTED_COVERS[0],
        platforms,
        status: 'draft',
      })
      toast('Lançamento guardado como rascunho.', 'info')
      // mantém o rascunho aberto no wizard para o utilizador poder continuar a editar
      navigate(`/painel/novo-lancamento?rascunho=${created.id}`, { replace: true })
    }
  }

  const submit = () => {
    if (!rights) return setError('Precisas de confirmar que és o titular dos direitos desta música.')
    const finalTitle = title.trim()
    if (draft) {
      updateRelease(draft.id, {
        title: finalTitle, type, genre, language, releaseDate, tracks, cover: cover ?? draft.cover,
        platforms, status: 'processing', upc: draft.upc ?? generateUpc(), issue: undefined,
      })
    } else {
      addRelease({ title: finalTitle, type, genre, language, releaseDate, tracks, cover: cover!, platforms, status: 'processing' })
    }
    toast(`«${finalTitle}» enviada para processamento — vai ao ar em 24–72h.`, 'success')
    navigate('/painel/lancamentos')
  }

  const record = (n: number) => {
    setStep(n)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{isDraft ? 'A continuar rascunho' : draft ? 'Correção necessária' : 'Distribuição'}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">{isDraft ? `Continuar: ${draft?.title}` : draft ? `Corrigir: ${draft.title}` : 'Novo lançamento'}</h1>
          <p className="mt-1 text-sm text-zinc-500">Preenche os 4 passos — a tua música entra nas lojas em 24–72 horas.</p>
        </div>
        {(!draft || isDraft) && <button onClick={saveDraft} className="btn-outline !py-2.5 text-xs"><Save size={15} /> Guardar rascunho</button>}
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-1 sm:gap-2" aria-label="Progresso">
        {STEPS.map(({ n, label }, i) => {
          const done = step > i
          const active = step === i
          return (
            <li key={n} className="flex flex-1 items-center gap-1 sm:gap-2">
              <button onClick={() => record(i)} aria-current={active ? 'step' : undefined} className={`flex items-center gap-2 rounded-xl px-2 py-2 transition sm:px-3 ${active ? 'bg-gold-400/10' : ''}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold transition ${
                  done ? 'border-gold-400 bg-gold-400 text-[#221503]' : active ? 'border-gold-400/60 bg-gold-400/15 text-gold-300' : 'border-line text-zinc-600'
                }`}>
                  {done ? <Check size={15} strokeWidth={3} /> : n}
                </span>
                <span className={`hidden text-[11px] font-bold uppercase tracking-wider md:block ${active ? 'text-gold-300' : done ? 'text-zinc-400' : 'text-zinc-600'}`}>{label}</span>
              </button>
              {i < STEPS.length - 1 && <span aria-hidden="true" className={`h-px flex-1 ${done ? 'bg-gold-400/60' : 'bg-line'}`} />}
            </li>
          )
        })}
      </ol>

      {error && (
        <p id="wizard-error" role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <CircleAlert size={17} className="mt-0.5 shrink-0" />{error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ─────────── Formulário ─────────── */}
        <div className="card p-6 xl:col-span-2">

          {/* PASSO 1 — Detalhes */}
          {step === 0 && (
            <fieldset className="space-y-5">
              <legend className="sr-only">Detalhes do lançamento</legend>
              <div>
                <span className="label">Tipo de lançamento</span>
                <div className="grid grid-cols-3 gap-2">
                  {([['single', 'Single', '1 faixa'], ['ep', 'EP', '2–6 faixas'], ['album', 'Álbum', '7+ faixas']] as [ReleaseType, string, string][]).map(([value, label, hint]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => changeType(value)}
                      aria-pressed={type === value}
                      className={`rounded-xl border px-4 py-4 text-center transition ${
                        type === value ? 'border-gold-400/60 bg-gold-400/10 shadow-glow' : 'border-line hover:border-zinc-700'
                      }`}
                    >
                      <Disc3 size={20} className={`mx-auto ${type === value ? 'text-gold-400' : 'text-zinc-600'}`} />
                      <span className="mt-2 block font-display text-sm font-bold text-white">{label}</span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-zinc-500">{hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="titulo" className="label">Título do lançamento *</label>
                <input id="titulo" value={title} onChange={(e) => setTitle(e.target.value)} className="input !py-3 text-base font-semibold" placeholder="Ex.: Kilombo Bounce" autoFocus />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="genero" className="label">Género principal</label>
                  <select id="genero" value={genre} onChange={(e) => setGenre(e.target.value)} className="input">
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="idioma" className="label">Idioma principal</label>
                  <select id="idioma" value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="data" className="label">Data de lançamento *</label>
                <input id="data" type="date" min={todaysISO()} value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="input" />
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-500"><Info size={12} /> Recomendamos lançar a uma sexta-feira. Escolhe uma data com pelo menos 7 dias de antecedência.</p>
              </div>
            </fieldset>
          )}

          {/* PASSO 2 — Faixas & capa */}
          {step === 1 && (
            <fieldset className="space-y-6">
              <legend className="sr-only">Faixas e capa do lançamento</legend>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="label !mb-0">Faixas ({tracks.length})</span>
                  {type !== 'single' && (
                    <button type="button" onClick={addTrack} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-bold text-gold-300 transition hover:border-gold-400/40"><Plus size={13} /> Adicionar faixa</button>
                  )}
                </div>
                <ol className="mt-3 space-y-2">
                  {tracks.map((track, i) => (
                    <li key={track.id} className="flex items-center gap-2 rounded-xl border border-line bg-panel2 p-2.5">
                      <span className="w-6 shrink-0 text-right font-display text-xs font-bold text-zinc-600">{i + 1}</span>
                      <Music2 size={15} className="shrink-0 text-zinc-600" />
                      <input value={track.title} onChange={(e) => updateTrack(track.id, { title: e.target.value })} placeholder={`Título da faixa ${i + 1}`} aria-label={`Título da faixa ${i + 1}`} className="input !border-transparent !bg-transparent !px-2 !py-1.5 focus:!border-line" />
                      <input value={track.duration} onChange={(e) => updateTrack(track.id, { duration: e.target.value })} placeholder="3:24" aria-label="Duração mm:ss" className="input w-20 !px-2 !py-1.5 text-center tabular-nums" />
                      <button
                        type="button"
                        onClick={() => updateTrack(track.id, { explicit: !track.explicit })}
                        aria-pressed={track.explicit}
                        title="Conteúdo explícito"
                        className={`shrink-0 rounded-md border px-2 py-1.5 text-[10px] font-black transition ${track.explicit ? 'border-rose-400/50 bg-rose-500/15 text-rose-400' : 'border-line text-zinc-600 hover:text-zinc-400'}`}
                      >E</button>
                      <button type="button" onClick={() => removeTrack(track.id)} aria-label="Remover faixa" className="shrink-0 rounded-lg p-2 text-zinc-600 transition hover:text-rose-400"><Trash2 size={16} /></button>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <span className="label">Capa do lançamento *</span>
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Preview */}
                  <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-panel2">
                    {cover ? (
                      <img src={cover} alt="Pré-visualização da capa" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex flex-col items-center gap-2 text-zinc-600"><ImageIcon size={30} /><span className="text-[10px] font-semibold uppercase tracking-wider">Sem capa</span></span>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline w-full !py-3 text-xs">
                      <UploadCloud size={17} /> Carregar imagem (JPG/PNG)
                    </button>
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                    <p className="text-[11px] leading-snug text-zinc-500">Quadrada, mínimo 1400×1400px. Nós otimizamos automaticamente para as exigências de cada loja.</p>
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500"><Sparkles size={12} className="text-gold-400" /> Ou escolhe uma capa sugerida</p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_COVERS.map((src) => (
                          <button key={src} type="button" onClick={() => { setCover(src); setError(null) }} aria-pressed={cover === src} aria-label="Escolher capa sugerida" className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${cover === src ? 'border-gold-400 shadow-glow' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                            <img src={src} alt="Capa sugerida" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          )}

          {/* PASSO 3 — Lojas */}
          {step === 2 && (
            <fieldset>
              <legend className="sr-only">Escolhe as lojas</legend>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="label !mb-0">Lojas e plataformas</span>
                  <p className="mt-1 text-xs text-zinc-500">{platforms.length} de {PLATFORM_CATALOG.length} selecionadas</p>
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-gold-400/40">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-[#F2C14E]" />
                  Selecionar todas
                </label>
              </div>
              <div className="mt-4 space-y-5">
                {PLATFORM_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((store) => {
                        const active = platforms.includes(store)
                        return (
                          <button
                            key={store}
                            type="button"
                            onClick={() => togglePlatform(store)}
                            aria-pressed={active}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                              active ? 'border-gold-400/50 bg-gold-400/10 text-gold-300' : 'border-line text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {active && <Check size={13} strokeWidth={3} />}
                            {store}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-line bg-panel2 p-3 text-[11px] leading-snug text-zinc-500"><Info size={14} className="mt-0.5 shrink-0 text-gold-400" /> Algumas lojas (Apple Music, Boomplay) fazem revisão manual dos metadados e podem pedir correções. Avisamos-te por email e no painel.</p>
            </fieldset>
          )}

          {/* PASSO 4 — Revisão */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <img src={cover ?? SUGGESTED_COVERS[0]} alt="Capa do lançamento" className="h-40 w-40 rounded-2xl border border-line object-cover" />
                <div className="min-w-0 flex-1">
                  <StatusBadge status="processing" />
                  <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{title || 'Sem título'}</h2>
                  <p className="text-sm text-zinc-500">{genre} · {language} · {type === 'single' ? 'Single' : type === 'ep' ? 'EP' : 'Álbum'}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-zinc-400">
                    <div><dt className="text-[10px] font-bold uppercase text-zinc-600">Lançamento</dt><dd>{releaseDate || '—'}</dd></div>
                    <div><dt className="text-[10px] font-bold uppercase text-zinc-600">Faixas</dt><dd>{tracks.length}</dd></div>
                    <div><dt className="text-[10px] font-bold uppercase text-zinc-600">Lojas</dt><dd>{platforms.length} plataformas</dd></div>
                    <div><dt className="text-[10px] font-bold uppercase text-zinc-600">Artista</dt><dd>{user?.nomeArtistico}</dd></div>
                  </dl>
                </div>
              </div>

              <div>
                <p className="label">Faixas</p>
                <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line">
                  {tracks.map((t, i) => (
                    <li key={t.id} className="flex items-center gap-3 bg-panel2 px-4 py-2 text-sm">
                      <span className="w-6 text-right text-xs font-bold text-zinc-600">{i + 1}</span>
                      <span className="flex-1 truncate text-zinc-200">{t.title}</span>
                      {t.explicit && <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-[9px] font-black text-zinc-500">E</span>}
                      <span className="text-xs tabular-nums text-zinc-500">{t.duration}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold-400/25 bg-gold-400/5 p-4">
                <input type="checkbox" checked={rights} onChange={(e) => { setRights(e.target.checked); setError(null) }} className="mt-0.5 h-5 w-5 shrink-0 accent-[#F2C14E]" />
                <span className="text-[13px] leading-relaxed text-zinc-300">
                  <strong className="text-gold-300">Declaro ser o titular exclusivo</strong> dos direitos desta música (autores, intérpretes e produtores) e autorizo a SonoraDrop a distribuí-la nas lojas selecionadas. Entendo que conteúdo sem autorização será removido e pode gerar responsabilização.
                </span>
              </label>
            </div>
          )}

          {/* Navegação entre passos */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
            {step > 0 ? (
              <button onClick={() => setStep((s) => s - 1)} className="btn-ghost !py-2.5 text-xs"><ChevronLeft size={16} /> Voltar</button>
            ) : <span />}
            {step < 3 ? (
              <button onClick={next} className="btn-gold !py-2.5 text-xs">Continuar <ChevronRight size={16} /></button>
            ) : (
              <button onClick={submit} className="btn-gold !py-3 text-sm"><Rocket size={17} /> Enviar para distribuição</button>
            )}
          </div>
        </div>

        {/* ─────────── Resumo lateral ─────────── */}
        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Pré-visualização</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-panel2">
                  {cover ? <img src={cover} alt="Capa" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-zinc-700"><ImageIcon size={26} /></span>}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-extrabold text-white">{title || 'Título do lançamento'}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{user?.nomeArtistico}</p>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-400"><Disc3 size={11} /> {type === 'single' ? 'Single' : type === 'ep' ? 'EP' : 'Álbum'} · {genre}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[12px]">
                <div className="flex justify-between"><dt className="text-zinc-500">Faixas</dt><dd className="font-semibold text-zinc-200">{tracks.length}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Lojas selecionadas</dt><dd className="font-semibold text-zinc-200">{platforms.length} / {PLATFORM_CATALOG.length}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Comissão</dt><dd className="font-semibold text-emerald-400">0% · ficas com tudo</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Data</dt><dd className="font-semibold text-zinc-200">{releaseDate || '—'}</dd></div>
              </dl>
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300"><Sparkles size={14} /> O que acontece a seguir</p>
            <ol className="mt-3 space-y-2.5 text-[12px] leading-snug text-zinc-400">
              <li className="flex gap-2"><span className="font-bold text-gold-500">1.</span> A nossa equipa valida áudio, capa e metadados (minutos).</li>
              <li className="flex gap-2"><span className="font-bold text-gold-500">2.</span> Recebes confirmação por email com o link «Artist Pick».</li>
              <li className="flex gap-2"><span className="font-bold text-gold-500">3.</span> A música entra ao vivo nas lojas na data escolhida.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}
