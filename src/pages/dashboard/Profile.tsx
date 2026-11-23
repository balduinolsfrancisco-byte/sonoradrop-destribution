import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  Camera,
  Save,
  BadgeCheck,
  Music2,
  Instagram,
  Youtube,
  Link2,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  UserRound,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { fmtDate, fmtNumber } from '../../lib/format'

const PAISES = ['Angola', 'Portugal', 'Brasil', 'Moçambique', 'Cabo Verde', 'África do Sul', 'França', 'Reino Unido', 'Estados Unidos', 'Outro']

export default function Profile() {
  const { profile, saveProfile, user, releases, toast } = useApp()
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'Perfil de Artista | SonoraDrop'
  }, [])

  useEffect(() => {
    setForm(profile)
  }, [profile])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const setLink = (key: keyof typeof form.links, value: string) => {
    setForm((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }))
    setDirty(true)
  }

  const onAvatar = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Escolhe um ficheiro de imagem (JPG ou PNG).', 'error')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      toast('A imagem deve ter menos de 4 MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 480
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#0A0910'
        ctx.fillRect(0, 0, size, size)
        const scale = Math.max(size / img.width, size / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
        set('avatar', canvas.toDataURL('image/jpeg', 0.88))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (form.nomeArtistico.trim().length < 2) next.nomeArtistico = 'Indica o teu nome artístico.'
    if (form.nome.trim().length < 2) next.nome = 'Indica o teu nome completo.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Indica um email válido.'
    if (form.bio.trim().length < 20) next.bio = 'Escreve pelo menos 20 caracteres na biografia.'
    setErrors(next)
    if (Object.keys(next).length) {
      toast('Verifica os campos assinalados.', 'error')
      return
    }
    saveProfile({ ...form, nomeArtistico: form.nomeArtistico.trim(), nome: form.nome.trim(), email: form.email.trim() })
    setDirty(false)
    toast('Perfil atualizado. As tuas lojas vão refletir as alterações em até 24h.', 'success')
  }

  const liveCount = releases.filter((r) => r.status === 'live').length
  const totalStreams = releases.reduce((sum, r) => sum + r.streams, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Perfil de artista</h1>
          <p className="mt-1 text-sm text-zinc-500">É assim que o teu nome aparece nas lojas e plataformas.</p>
        </div>
        <button type="submit" form="profile-form" disabled={!dirty} className="btn-gold !py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40">
          <Save size={17} /> {dirty ? 'Guardar alterações' : 'Tudo guardado'}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Cartão de artista */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-gold-400/10 via-panel to-panel p-6 text-center">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(242,193,78,0.22),transparent_70%)]" />
            <div className="relative mx-auto w-fit">
              <img src={form.avatar} alt={form.nomeArtistico} className="h-28 w-28 rounded-2xl border-2 border-gold-400/40 object-cover shadow-glow" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Alterar fotografia"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-panel2 text-gold-300 shadow-card transition hover:bg-panel2/70"
              >
                <Camera size={16} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onAvatar(e.target.files?.[0]); e.target.value = '' }} />
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-white">{form.nomeArtistico || 'Nome artístico'}</h2>
            <p className="mt-0.5 text-xs text-zinc-500">{form.genero || 'Género musical'}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <BadgeCheck size={13} /> Artista verificado
            </span>

            <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Ao vivo</dt>
                <dd className="mt-0.5 font-display text-lg font-bold text-white">{liveCount}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Streams</dt>
                <dd className="mt-0.5 font-display text-lg font-bold text-white">{fmtNumber(totalStreams)}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Desde</dt>
                <dd className="mt-0.5 font-display text-lg font-bold text-white">{new Date(user?.membroDesde ?? Date.now()).getFullYear()}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {form.links.spotify && (
                <a href={form.links.spotify} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-zinc-400 transition hover:border-emerald-400/40 hover:text-emerald-400" aria-label="Spotify">
                  <Music2 size={16} />
                </a>
              )}
              {form.links.instagram && (
                <a href={form.links.instagram} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-zinc-400 transition hover:border-pink-400/40 hover:text-pink-400" aria-label="Instagram">
                  <Instagram size={16} />
                </a>
              )}
              {form.links.youtube && (
                <a href={form.links.youtube} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-zinc-400 transition hover:border-rose-400/40 hover:text-rose-400" aria-label="YouTube">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white"><ShieldCheck size={16} className="text-gold-400" /> Conta</h3>
            <ul className="mt-3 space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-zinc-400"><Mail size={14} className="text-zinc-600" /> {user?.email}</li>
              <li className="flex items-center gap-2 text-zinc-400"><Sparkles size={14} className="text-zinc-600" /> Plano {user?.plano}</li>
              <li className="flex items-center gap-2 text-zinc-400"><MapPin size={14} className="text-zinc-600" /> {form.cidade}, {form.pais}</li>
              <li className="flex items-center gap-2 text-zinc-400"><BadgeCheck size={14} className="text-zinc-600" /> Membro desde {fmtDate(user?.membroDesde ?? new Date().toISOString())}</li>
            </ul>
            <p className="mt-4 rounded-lg bg-white/[0.03] px-3 py-2 text-[10.5px] leading-snug text-zinc-500">
              A fotografia de perfil é usada no Spotify for Artists e no Apple Music, apenas quando o teu perfil está verificado.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form id="profile-form" onSubmit={submit} className="space-y-6" noValidate>
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><UserRound size={17} className="text-gold-400" /> Identidade</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nome-artistico" className="label">Nome artístico *</label>
                <input id="nome-artistico" value={form.nomeArtistico} onChange={(e) => set('nomeArtistico', e.target.value)} className="input" placeholder="Como queres ser apresentado" />
                {errors.nomeArtistico && <p className="mt-1 text-[11px] text-rose-400">{errors.nomeArtistico}</p>}
              </div>
              <div>
                <label htmlFor="nome-completo" className="label">Nome completo *</label>
                <input id="nome-completo" value={form.nome} onChange={(e) => set('nome', e.target.value)} className="input" placeholder="Nome legal (para royalties)" />
                {errors.nome && <p className="mt-1 text-[11px] text-rose-400">{errors.nome}</p>}
              </div>
              <div>
                <label htmlFor="email" className="label">Email *</label>
                <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input" />
                {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="telefone" className="label">Telefone</label>
                <input id="telefone" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} className="input" placeholder="+244 9XX XXX XXX" />
              </div>
              <div>
                <label htmlFor="pais" className="label">País</label>
                <select id="pais" value={form.pais} onChange={(e) => set('pais', e.target.value)} className="input">
                  {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="cidade" className="label">Cidade</label>
                <input id="cidade" value={form.cidade} onChange={(e) => set('cidade', e.target.value)} className="input" placeholder="Luanda" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="genero" className="label">Géneros musicais</label>
                <input id="genero" value={form.genero} onChange={(e) => set('genero', e.target.value)} className="input" placeholder="Semba · Afrobeat" />
                <p className="mt-1.5 text-[11px] text-zinc-600">Ajuda os editores das lojas a conhecer-te melhor. Separa com «·».</p>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bio" className="label">Biografia *</label>
                <textarea id="bio" rows={5} value={form.bio} onChange={(e) => set('bio', e.target.value)} className="input resize-none" maxLength={600} />
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  {errors.bio ? <p className="text-[11px] text-rose-400">{errors.bio}</p> : <span />}
                  <span className="text-[11px] text-zinc-600">{form.bio.length}/600</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><Link2 size={17} className="text-gold-400" /> Links oficiais</h2>
            <p className="mt-1 text-xs text-zinc-500">Adiciona os teus perfis para verificação e para o público te encontrar.</p>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="spotify" className="label">Spotify for Artists</label>
                <div className="relative">
                  <Music2 size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input id="spotify" value={form.links.spotify} onChange={(e) => setLink('spotify', e.target.value)} className="input pl-11" placeholder="https://open.spotify.com/artist/…" />
                </div>
              </div>
              <div>
                <label htmlFor="instagram" className="label">Instagram</label>
                <div className="relative">
                  <Instagram size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input id="instagram" value={form.links.instagram} onChange={(e) => setLink('instagram', e.target.value)} className="input pl-11" placeholder="https://www.instagram.com/…" />
                </div>
              </div>
              <div>
                <label htmlFor="youtube" className="label">YouTube</label>
                <div className="relative">
                  <Youtube size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
                  <input id="youtube" value={form.links.youtube} onChange={(e) => setLink('youtube', e.target.value)} className="input pl-11" placeholder="https://www.youtube.com/@…" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-5 py-4">
            <p className="flex items-center gap-2 text-[11px] text-zinc-500"><Phone size={13} /> Os dados legais nunca são partilhados com o público.</p>
            <button type="submit" disabled={!dirty} className="btn-gold !py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"><Save size={15} /> Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
