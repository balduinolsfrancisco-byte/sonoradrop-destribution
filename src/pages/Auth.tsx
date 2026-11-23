import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Music2,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
  Zap,
} from 'lucide-react'
import Logo from '../components/Logo'
import Toasts from '../components/Toasts'
import { useApp } from '../context/AppContext'
import { DEMO_ACCOUNT } from '../data/seed'

export default function Auth() {
  const location = useLocation()
  const isRegister = location.pathname === '/registar'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, user, toast } = useApp()

  const [nome, setNome] = useState('')
  const [nomeArtistico, setNomeArtistico] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [plano, setPlano] = useState(() => searchParams.get('plano') ?? 'Profissional')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/painel', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    setError(null)
    document.title = isRegister
      ? 'Criar conta | SonoraDrop Distribution'
      : 'Entrar | SonoraDrop Distribution'
  }, [isRegister, location.pathname])

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)
    setError(null)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      const result = isRegister
        ? register({ nome, nomeArtistico, email, password, plano })
        : login(email, password)
      setSubmitting(false)
      if (result) {
        setError(result)
        return
      }
      toast(isRegister ? `Bem-vindo à SonoraDrop, ${nomeArtistico || nome}!` : 'Bem-vindo de volta!', 'success')
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from.startsWith('/painel') ? from : '/painel', { replace: true })
    }, 550)
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <Toasts />

      {/* Painel lateral visual */}
      <aside className="relative hidden w-[46%] overflow-hidden lg:block">
        <img src="/assets/hero.jpg" alt="Artista angolano no estúdio" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/55 to-ink/10" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/" aria-label="Voltar à página inicial" className="w-max">
            <Logo size={44} />
          </Link>
          <div>
            <blockquote className="max-w-md font-display text-2xl font-bold leading-snug text-white">
              “Colocar um disco no Spotify custava-me uma fortuna. A SonoraDrop fez em 48 horas.”
            </blockquote>
            <p className="mt-4 text-sm font-semibold text-gold-300">Nelson Tchissola</p>
            <p className="text-xs text-zinc-400">Produtor & DJ · Kilombo Sound · Luanda</p>
            <ul className="mt-8 space-y-2.5 text-[13px] text-zinc-300">
              {[
                { icon: Zap, text: 'Ao vivo nas lojas em 24–72 horas' },
                { icon: Wallet, text: 'Pagamentos via Multicaixa Express, sem comissões escondidas' },
                { icon: ShieldCheck, text: 'Os direitos autorais são 100% teus, para sempre' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5"><Icon size={16} className="shrink-0 text-gold-400" />{text}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Formulário */}
      <main className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-white">
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
          <div className="lg:hidden"><Logo size={32} /></div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-10 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-extrabold text-white">
              {isRegister ? 'Cria a tua conta' : 'Bem-vindo de volta'}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {isRegister
                ? 'Junta-te a 2.400+ artistas angolanos a distribuir pelo mundo.'
                : 'Entra para gerires os teus lançamentos, estatísticas e rendimentos.'}
            </p>

            {/* Alternância Entrar / Registar */}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-line bg-panel p-1 text-sm font-semibold">
              <Link to="/entrar" className={`rounded-lg py-2.5 text-center transition ${!isRegister ? 'bg-gold-400 text-[#221503]' : 'text-zinc-500 hover:text-white'}`}>Entrar</Link>
              <Link to="/registar" className={`rounded-lg py-2.5 text-center transition ${isRegister ? 'bg-gold-400 text-[#221503]' : 'text-zinc-500 hover:text-white'}`}>Criar conta</Link>
            </div>

            {/* Conta de demonstração */}
            {!isRegister && (
              <button
                onClick={fillDemo}
                className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-gold-400/30 bg-gold-400/5 px-4 py-3 text-left transition hover:border-gold-400/50 hover:bg-gold-400/10"
              >
                <span className="flex items-start gap-2.5">
                  <Sparkles size={17} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-gold-300">Conta de demonstração</span>
                    <span className="mt-0.5 block text-xs text-zinc-400">{DEMO_ACCOUNT.email} · {DEMO_ACCOUNT.password}</span>
                  </span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300">Preencher</span>
              </button>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              {isRegister && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nome" className="label">Nome completo</label>
                    <div className="relative">
                      <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="input pl-11" placeholder="Mário Kalunga" autoComplete="name" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="nomeArtistico" className="label">Nome artístico</label>
                    <div className="relative">
                      <Music2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input id="nomeArtistico" value={nomeArtistico} onChange={(e) => setNomeArtistico(e.target.value)} className="input pl-11" placeholder="Mário Kalunga" autoComplete="nickname" required />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" placeholder="o.teu@email.com" autoComplete="email" required />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label">Palavra-passe</label>
                <div className="relative">
                  <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11 pr-12" placeholder="Mínimo 6 caracteres" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={6} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 transition hover:text-white">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label htmlFor="plano" className="label">Plano</label>
                  <select id="plano" value={plano} onChange={(e) => setPlano(e.target.value)} className="input">
                    <option value="Starter">Starter — Grátis (15% comissão)</option>
                    <option value="Profissional">Profissional — 4.900 Kz/mês (0% comissão)</option>
                    <option value="Gravadora">Gravadora — 19.900 Kz/mês (até 10 artistas)</option>
                  </select>
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <button type="submit" disabled={submitting} className="btn-gold w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? <Loader2 size={19} className="animate-spin" /> : isRegister ? <BadgeCheck size={19} /> : <ArrowRight size={19} />}
                {submitting ? 'A processar…' : isRegister ? 'Criar a minha conta' : 'Entrar'}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-600">
              Ao continuares, aceitas os <a href="#" className="text-zinc-400 underline-offset-2 hover:underline">Termos de serviço</a> e a <a href="#" className="text-zinc-400 underline-offset-2 hover:underline">Política de privacidade</a> da SonoraDrop.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
