import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Banknote,
  Check,
  ChevronDown,
  CircleDollarSign,
  Disc3,
  Globe2,
  Headphones,
  LayoutDashboard,
  Menu,
  Music2,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UploadCloud,
  Wallet,
  X,
  Zap,
} from 'lucide-react'
import Logo from '../components/Logo'
import Toasts from '../components/Toasts'
import { useApp } from '../context/AppContext'
import { STORE_BADGES } from '../data/seed'

const FAQ = [
  {
    q: 'Quanto custa distribuir a minha música?',
    a: 'O plano Starter é grátis para sempre (com 15% de comissão por stream). O plano Profissional custa 4.900 Kz/mês — ou 49.000 Kz/ano — e tem 0% de comissão. A Gravadora custa 19.900 Kz/mês para até 10 artistas. Sem taxas de adesão, sem surpresas.',
  },
  {
    q: 'Quanto tempo demora a minha música a chegar às lojas?',
    a: 'Spotify, YouTube Music, TikTok e Instagram em 24–72 horas. Apple Music, Deezer, Boomplay, TIDAL e Amazon Music em 2–5 dias úteis. Lançamentos marcados para uma data futura seguem sempre a data escolhida.',
  },
  {
    q: 'Como recebo as minhas receitas?',
    a: 'Pagamentos mensais a partir de $50, via Multicaixa Express, transferência bancária (BAI/BFA/BIC) ou PayPal — sem comissões da SonoraDrop. Recebes um extrato transparente com o detalhe por loja e por país.',
  },
  {
    q: 'Fico com os direitos da minha música?',
    a: 'Sim, 100% teus, para sempre. A SonoraDrop é uma distribuidora — não ficamos com direitos autorais, partilhas de editora nem exige exclusividade. Podes retirar os teus lançamentos a qualquer momento.',
  },
  {
    q: 'Posso usar a SonoraDrop se não tiver editora?',
    a: 'Claro — a maioria dos nossos 2.400+ artistas são independentes. Tratamos da distribuição, UPC/ISRC, Content ID do YouTube e relatórios de royalties, para que te possas focar em fazer música.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Colocar «Kilombo Bounce» no Spotify e no Boomplay demorou 48 horas. Os pagamentos chegam mesmo, via Multicaixa Express, sem complicações.',
    name: 'Nelson Tchissola',
    role: 'Produtor & DJ · Kilombo Sound',
    initials: 'NT',
  },
  {
    quote: 'Antes pagava o dobro a distribuidoras estrangeiras. Hoje recebo 100% das minhas receitas e um relatório claro todos os meses, em português.',
    name: 'Tatiana Zua',
    role: 'Cantora e compositora · Luanda',
    initials: 'TZ',
  },
  {
    quote: 'Como editora independente, gerir 6 artistas num único painel mudou o meu trabalho. O suporte responde no WhatsApp, em minutos.',
    name: 'Kalunga Roxo',
    role: 'Kalunga Roxo Records · Editora',
    initials: 'KR',
  },
]

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)
  const [email, setEmail] = useState('')
  const { toast, user } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'SonoraDrop Distribution | A tua música em todas as lojas, em todo o mundo'
  }, [])

  const subscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      toast('Indica um email válido para subscreveres.', 'error')
      return
    }
    setEmail('')
    toast('Obrigado por subscreveres a newsletter da SonoraDrop!', 'success')
  }

  const plans = [
    {
      name: 'Starter',
      price: 'Grátis',
      suffix: 'para sempre',
      description: 'Para começar sem risco.',
      features: ['15% comissão por stream', '2 lançamentos por ano', '180+ lojas e plataformas', 'UPC e ISRC incluídos', 'Pagamento trimestral (mín. $50)', 'Suporte por email'],
      cta: 'Começar grátis',
      featured: false,
      plan: 'Starter',
    },
    {
      name: 'Profissional',
      price: annual ? '49.000 Kz' : '4.900 Kz',
      suffix: annual ? 'por ano (2 meses grátis)' : 'por mês',
      description: 'Para artistas a sério.',
      features: ['0% de comissão — ficas com 100%', 'Lançamentos ilimitados', 'Todas as lojas + Boomplay e Mdundo', 'Content ID do YouTube', 'Pagamentos mensais via Multicaixa Express', 'Smartlinks e pré-saves', 'Suporte prioritário via WhatsApp'],
      cta: 'Escolher Profissional',
      featured: true,
      plan: 'Profissional',
    },
    {
      name: 'Gravadora',
      price: annual ? '199.000 Kz' : '19.900 Kz',
      suffix: annual ? 'por ano (2 meses grátis)' : 'por mês · até 10 artistas',
      description: 'Para editoras independentes.',
      features: ['Tudo do plano Profissional', 'Painel multi-artista', 'Analista de royalties dedicado', 'Relatórios personalizados (PDF/CSV)', 'Gestor de conta em Luanda', 'Contrato de distribuição anual'],
      cta: 'Escolher Gravadora',
      featured: false,
      plan: 'Gravadora',
    },
  ]

  return (
    <div className="min-h-screen bg-ink text-zinc-200">
      <Toasts />

      {/* ───────────────── NAVBAR ───────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="SonoraDrop — início">
              <Logo size={38} />
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-400 lg:flex" aria-label="Navegação principal">
              <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
              <a href="#recursos" className="transition hover:text-white">Recursos</a>
              <a href="#precos" className="transition hover:text-white">Preços</a>
              <a href="#faq" className="transition hover:text-white">FAQ</a>
            </nav>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <Link to="/painel" className="btn-gold !px-4 !py-2.5 text-sm"><LayoutDashboard size={16} /> Ir para o painel</Link>
            ) : (
              <>
                <Link to="/entrar" className="btn-ghost !px-4 !py-2.5 text-sm">Entrar</Link>
                <Link to="/registar" className="btn-gold !px-4 !py-2.5 text-sm">Começar grátis <ArrowRight size={16} /></Link>
              </>
            )}
          </div>
          <button className="rounded-xl border border-line p-2.5 text-zinc-300 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-line bg-surface px-5 pb-6 pt-3 lg:hidden">
            {['como-funciona', 'recursos', 'precos', 'faq'].map((id) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white">
                {id === 'como-funciona' ? 'Como funciona' : id === 'recursos' ? 'Recursos' : id === 'precos' ? 'Preços' : 'Perguntas frequentes'}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              {user ? (
                <Link to="/painel" onClick={() => setMenuOpen(false)} className="btn-gold"><LayoutDashboard size={16} /> Ir para o painel</Link>
              ) : (
                <>
                  <Link to="/entrar" onClick={() => setMenuOpen(false)} className="btn-outline">Entrar</Link>
                  <Link to="/registar" onClick={() => setMenuOpen(false)} className="btn-gold">Começar grátis <ArrowRight size={16} /></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-gold-400/10 blur-[160px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-violet-600/15 blur-[160px]" />
        <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="eyebrow"><Sparkles size={13} /> Distribuidora angolana nº 1</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl">
              A tua música.<br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-600 bg-clip-text text-transparent">Em todas as lojas.</span><br />
              Em todo o mundo.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              Levamos os teus lançamentos a Spotify, Apple Music, YouTube Music, Boomplay e mais de <strong className="text-zinc-100">180 lojas em 190+ países</strong> — e pagamos-te via Multicaixa Express, com 0% de comissão no plano Profissional.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/registar" className="btn-gold text-base !px-6 !py-4">Começar gratuitamente <ArrowRight size={18} /></Link>
              <a href="#como-funciona" className="btn-outline text-base !px-6 !py-4">Ver como funciona</a>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {['NT', 'TZ', 'KR', 'JM'].map((i, idx) => (
                  <span key={idx} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-gradient-to-br from-panel2 to-panel text-[11px] font-bold text-gold-300">
                    {i}
                  </span>
                ))}
              </div>
              <div className="text-xs leading-snug text-zinc-400">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={13} className="fill-gold-400 text-gold-400" />)}
                  4,9/5
                </span>
                2.400+ artistas já distribuem connosco
              </div>
            </div>
          </div>

          {/* Imagem + cartões flutuantes */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border border-line shadow-card">
              <img src="/assets/hero.jpg" alt="Artista angolano a gravar no estúdio da SonoraDrop em Luanda" className="aspect-[4/5] w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            </div>

            <div className="animate-floaty absolute left-[-12px] top-8 rounded-2xl border border-line bg-panel2/90 px-4 py-3 shadow-card backdrop-blur-md sm:left-[-24px]">
              <div className="flex items-center gap-3">
                <img src="/assets/covers/kilombo-bounce.jpg" alt="Capa do single Kilombo Bounce" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Kilombo Bounce</p>
                  <p className="font-display text-sm font-bold text-white">743.100 streams</p>
                </div>
              </div>
              <div className="mt-2 flex h-4 items-end gap-[3px]" aria-hidden="true">
                {[0.5, 0.8, 0.4, 1, 0.65, 0.9, 0.45, 0.75, 1, 0.6, 0.85, 0.5, 0.95, 0.7].map((h, i) => (
                  <span key={i} className="eq-bar w-[4px] rounded-sm bg-gold-400/80" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.09}s` }} />
                ))}
              </div>
            </div>

            <div className="animate-floaty-late absolute bottom-28 right-[-8px] rounded-2xl border border-gold-400/30 bg-panel2/90 px-4 py-3 shadow-glow backdrop-blur-md sm:right-[-20px]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/15"><TrendingUp size={18} className="text-gold-400" /></span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Este mês</span>
                  <span className="font-display text-base font-extrabold text-gold-300">+$2.823,78</span>
                </span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Ao vivo em 12 lojas</span>
            </div>
          </div>
        </div>

        {/* Faixa de lojas */}
        <div className="border-y border-line bg-surface/60 py-4">
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Disponível em</p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max items-center gap-12 pr-12">
              {[...STORE_BADGES, ...STORE_BADGES].map((store, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap font-display text-sm font-bold text-zinc-500">
                  <Music2 size={15} className="text-gold-500/70" /> {store}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── NÚMEROS ───────────────── */}
      <section className="container-x py-12">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {[
            ['38M+', 'streams gerados em 2026'],
            ['2.400+', 'artistas distribuídos'],
            ['190+', 'países alcançados'],
            ['$4,2M+', 'pagos a artistas desde 2021'],
          ].map(([n, d]) => (
            <div key={d}>
              <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">{n}</p>
              <p className="mt-1.5 text-xs text-zinc-500 sm:text-[13px]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── COMO FUNCIONA ───────────────── */}
      <section id="como-funciona" className="border-t border-line bg-surface/40 py-16 sm:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow"><Zap size={13} /> Como funciona</span>
            <h2 className="section-title mt-5">Do estúdio às lojas em <span className="text-gold-400">4 passos</span></h2>
            <p className="mt-3 text-zinc-400">Sem papelada, sem intermediários, sem espera. Tu fazes a música — nós tratamos de todo o resto.</p>
          </div>
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: UploadCloud, step: '1', title: 'Envia a tua música', text: 'Carrega a faixa, a capa e os metadados. Nós verificamos tudo em minutos.' },
              { icon: Disc3, step: '2', title: 'Escolhe as lojas', text: 'Seleciona Spotify, Boomplay, Apple Music e mais 180+ — ou simplesmente todas.' },
              { icon: Rocket, step: '3', title: 'Vamos a lançar', text: 'A tua música entra ao vivo em 24–72h, na data que escolheste.' },
              { icon: Banknote, step: '4', title: 'Recebe o teu dinheiro', text: 'Pagamentos mensais via Multicaixa Express, transferência ou PayPal.' },
            ].map(({ icon: Icon, step, title, text }) => (
              <li key={step} className="card card-hover relative p-6">
                <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-white/5">{step}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-400"><Icon size={22} /></span>
                <h3 className="mt-4 font-display text-base font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────── RECURSOS ───────────────── */}
      <section id="recursos" className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><BadgeCheck size={13} /> Porquê a SonoraDrop</span>
          <h2 className="section-title mt-5">Feita em Angola,<br />para <span className="text-gold-400">artistas africanos</span></h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Globe2, title: 'Alcance global real', text: 'Distribuição para 190+ países, com foco em Angola, Portugal, França, Brasil e PALOP — onde a tua música já toca.' },
            { icon: Wallet, title: 'Recebes via Multicaixa Express', text: 'A única distribuidora com payout nativo em kwanza, para o teu cartão ou IBAN angolano. Sem taxas escondidas.' },
            { icon: ShieldCheck, title: '100% dos teus direitos', text: 'Ficas sempre com os direitos de autor. Nós nunca pedimos exclusividade nem partilha de editora.' },
            { icon: BarChart3, title: 'Estatísticas que importam', text: 'Streams, receita e audiência por loja e por país — atualizados todos os dias, exportáveis em CSV.' },
            { icon: CircleDollarSign, title: 'Content ID do YouTube', text: 'Monetiza automaticamente os vídeos que usam as tuas músicas no YouTube e no Shorts.' },
            { icon: Headphones, title: 'Suporte humano, em português', text: 'Equipa baseada em Luanda, no WhatsApp, de segunda a sábado. Sem bots, sem ticketeria infinita.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card card-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel2 text-gold-400"><Icon size={20} /></span>
              <h3 className="mt-4 font-display text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── PREÇOS ───────────────── */}
      <section id="precos" className="border-t border-line bg-surface/40 py-16 sm:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow"><CircleDollarSign size={13} /> Planos e preços</span>
            <h2 className="section-title mt-5">Escolhe o teu plano.<br /><span className="text-gold-400">Sem taxas escondidas.</span></h2>
            <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-line bg-panel p-1 text-sm font-semibold">
              <button onClick={() => setAnnual(false)} className={`rounded-full px-4 py-2 transition ${!annual ? 'bg-gold-400 text-[#221503]' : 'text-zinc-400 hover:text-white'}`}>Mensal</button>
              <button onClick={() => setAnnual(true)} className={`rounded-full px-4 py-2 transition ${annual ? 'bg-gold-400 text-[#221503]' : 'text-zinc-400 hover:text-white'}`}>Anual <span className="text-[10px] font-bold uppercase">−17%</span></button>
            </div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative flex flex-col rounded-2xl border p-7 ${plan.featured ? 'border-gold-400/50 bg-gradient-to-b from-gold-400/10 via-panel to-panel shadow-glow' : 'border-line bg-panel'}`}>
                {plan.featured && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#221503]">Mais popular</span>}
                <h3 className="font-display text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-zinc-500">{plan.description}</p>
                <p className="mt-5 font-display text-4xl font-extrabold text-white">{plan.price}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500">{plan.suffix}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-gold-400" />{f}</li>
                  ))}
                </ul>
                <button onClick={() => navigate(`/registar?plano=${encodeURIComponent(plan.plan)}`)} className={`${plan.featured ? 'btn-gold' : 'btn-outline'} mt-7 w-full`}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">Todos os planos incluem UPC, ISRC e relatório mensal. Cancelas quando quiseres, sem multas.</p>
        </div>
      </section>

      {/* ───────────────── TESTEMUNHOS ───────────────── */}
      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><Quote size={13} /> Quem já distribui connosco</span>
          <h2 className="section-title mt-5">Artistas angolanos,<br /><span className="text-gold-400">resultados reais</span></h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col p-6">
              <div className="flex gap-1">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={14} className="fill-gold-400 text-gold-400" />)}</div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400/15 font-display text-xs font-extrabold text-gold-300">{t.initials}</span>
                <span>
                  <span className="block text-sm font-bold text-white">{t.name}</span>
                  <span className="block text-xs text-zinc-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section id="faq" className="border-t border-line bg-surface/40 py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title mt-5">Perguntas <span className="text-gold-400">frequentes</span></h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">Não encontras a tua resposta? Fala connosco no WhatsApp — respondemos em menos de 4 horas úteis.</p>
            <a href="https://wa.me/244923000000" className="btn-outline mt-6 !py-2.5 text-xs">WhatsApp +244 923 000 000</a>
          </div>
          <div className="lg:col-span-3">
            <div className="divide-y divide-line rounded-2xl border border-line bg-panel">
              {FAQ.map((item, i) => {
                const open = openFaq === i
                return (
                  <div key={i}>
                    <button onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                      <span className="text-sm font-bold text-zinc-100 sm:text-[15px]">{item.q}</span>
                      <ChevronDown size={18} className={`shrink-0 text-gold-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && <div className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CTA FINAL ───────────────── */}
      <section className="container-x py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-gold-400/15 via-panel to-violet-900/20 px-8 py-14 text-center sm:px-16">
          <Music2 size={120} className="pointer-events-none absolute -left-6 -top-6 text-gold-400/10" aria-hidden="true" />
          <Music2 size={140} className="pointer-events-none absolute -bottom-8 -right-8 text-gold-400/10" aria-hidden="true" />
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-5xl">O teu som já está pronto?</h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-400">Cria a tua conta em 2 minutos e vê «a tua música em todas as lojas» acontecer.</p>
          <Link to="/registar" className="btn-gold mx-auto mt-8 w-max text-base !px-8 !py-4">Criar conta gratuita <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="border-t border-line bg-surface">
        <div className="container-x grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo size={36} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">A distribuidora musical de Angola para o mundo. Independente, transparente e feita para quem faz música.</p>
            <form onSubmit={subscribe} className="mt-5">
              <label htmlFor="newsletter" className="label">Newsletter dos artistas</label>
              <div className="flex max-w-sm gap-2">
                <input id="newsletter" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="o.teu@email.com" className="input" aria-label="O teu email" />
                <button type="submit" className="btn-gold !px-4" aria-label="Subscrever"><ArrowRight size={18} /></button>
              </div>
            </form>
          </div>
          <div className="md:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Produto</p>
            <ul className="mt-3 space-y-2.5 text-sm text-zinc-400">
              <li><a href="#recursos" className="hover:text-white">Distribuição</a></li>
              <li><a href="#precos" className="hover:text-white">Planos</a></li>
              <li><a href="#como-funciona" className="hover:text-white">Como funciona</a></li>
              <li><Link to="/registar" className="hover:text-white">Criar conta</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Suporte</p>
            <ul className="mt-3 space-y-2.5 text-sm text-zinc-400">
              <li>WhatsApp: +244 923 000 000 (Seg–Sáb)</li>
              <li>suporte@sonoradrop.ao</li>
              <li>Av. 4 de Fevereiro 151, Luanda</li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Legal</p>
            <ul className="mt-3 space-y-2.5 text-sm text-zinc-400">
              <li><Link to="/legal/termos" className="hover:text-white">Termos de serviço</Link></li>
              <li><Link to="/legal/privacidade" className="hover:text-white">Política de privacidade</Link></li>
              <li><Link to="/legal/royalties" className="hover:text-white">Política de royalties</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-zinc-600 sm:flex-row">
            <p>© 2026 SonoraDrop Distribution, Lda. Todos os direitos reservados.</p>
            <p>Feito em Luanda 🇦🇴 · Pagamentos via Multicaixa Express · BAI · PayPal</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
