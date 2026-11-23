import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useNavigate, useLocation, Link, Outlet, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Disc3,
  PlusCircle,
  BarChart3,
  Banknote,
  UserRound,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  MessageCircle,
  CreditCard,
  BadgeCheck,
  CircleAlert,
  Info,
  CheckCheck,
  ChevronDown,
} from 'lucide-react'
import Logo from './Logo'
import { useApp } from '../context/AppContext'
import Toasts from './Toasts'

const NAV = [
  { to: '/painel', label: 'Visão Geral', icon: LayoutDashboard, end: true },
  { to: '/painel/lancamentos', label: 'Lançamentos', icon: Disc3 },
  { to: '/painel/novo-lancamento', label: 'Novo Lançamento', icon: PlusCircle, accent: true },
  { to: '/painel/estatisticas', label: 'Estatísticas', icon: BarChart3 },
  { to: '/painel/rendimentos', label: 'Rendimentos', icon: Banknote },
  { to: '/painel/perfil', label: 'Perfil de Artista', icon: UserRound },
  { to: '/painel/definicoes', label: 'Definições', icon: Settings },
]

const NOTIF_ICON = {
  sucesso: BadgeCheck,
  alerta: CircleAlert,
  pagamento: CreditCard,
  info: Info,
}

const NOTIF_COLOR = {
  sucesso: 'text-emerald-400',
  alerta: 'text-amber-400',
  pagamento: 'text-sky-400',
  info: 'text-zinc-400',
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useApp()
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link to="/" aria-label="SonoraDrop — página inicial">
          <Logo size={38} />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navegação do painel">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600"> Menu principal </p>
        {NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end as boolean | undefined}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gold-400/10 text-gold-300 shadow-[inset_2px_0_0_0_#F2C14E]'
                    : item.accent
                      ? 'text-gold-300/80 hover:bg-gold-400/5 hover:text-gold-300'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" strokeWidth={1.8} />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-line p-4">
        <div className="rounded-xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 to-transparent p-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-gold-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-gold-300">Suporte local</p>
          </div>
          <p className="mt-1.5 text-xs leading-snug text-zinc-400">
            Falas com gente de verdade, em português. Respondemos em menos de 4 horas úteis.
          </p>
          <a
            href="https://wa.me/244923000000"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs font-semibold text-gold-300 transition hover:bg-gold-400/20"
          >
            <MessageCircle size={14} /> WhatsApp +244 923 000 000
          </a>
        </div>
        <p className="mt-4 px-1 text-center text-[10px] text-zinc-700">
          SonoraDrop v1.0 · Plano {user?.plano} · © 2026
        </p>
      </div>
    </div>
  )
}

function Dropdown({ open, onClose, children, align = 'right' }: { open: boolean; onClose: () => void; children: ReactNode; align?: 'right' | 'left' }) {
  if (!open) return null
  return (
    <>
      <button className="fixed inset-0 z-30 cursor-default" aria-label="Fechar menu" onClick={onClose} tabIndex={-1} />
      <div className={`absolute z-40 mt-2 ${align === 'right' ? 'right-0' : 'left-0'} w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-panel2 shadow-card`}>
        {children}
      </div>
    </>
  )
}

export default function DashboardLayout() {
  const { user, logout, notifications, markAllNotificationsRead, profile, balance } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSidebarOpen(false)
    setBellOpen(false)
    setAvatarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!user) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />

  const unread = notifications.filter((n) => !n.lida).length

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/painel/lancamentos?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-line bg-surface lg:block">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-surface">
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-4 rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Conteúdo */}
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-ink/85 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            className="rounded-xl border border-line p-2.5 text-zinc-400 transition hover:text-white lg:hidden"
          >
            <Menu size={18} />
          </button>

          <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 md:block" role="search">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procurar lançamentos, faixas…  (Ctrl K)"
              aria-label="Procurar lançamentos"
              className="input pl-11"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/painel/rendimentos')}
              title="Saldo disponível — ir para Rendimentos"
              className="hidden items-center gap-2 rounded-xl border border-gold-400/25 bg-gold-400/5 px-3.5 py-2 text-xs font-semibold text-gold-300 transition hover:bg-gold-400/10 sm:inline-flex"
            >
              <Banknote size={15} />
              ${balance.toFixed(2)}
            </button>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => { setBellOpen((v) => !v); setAvatarOpen(false) }}
                aria-label={`Notificações${unread ? `, ${unread} por ler` : ''}`}
                className="relative rounded-xl border border-line p-2.5 text-zinc-400 transition hover:text-white"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
              <Dropdown open={bellOpen} onClose={() => setBellOpen(false)}>
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Notificações</p>
                  <button
                    onClick={markAllNotificationsRead}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-300 transition hover:text-gold-200"
                  >
                    <CheckCheck size={13} /> Marcar todas como lidas
                  </button>
                </div>
                <ul className="max-h-96 overflow-y-auto py-2">
                  {notifications.map((n) => {
                    const Icon = NOTIF_ICON[n.tipo]
                    return (
                      <li key={n.id} className={`flex items-start gap-3 px-4 py-3 transition hover:bg-white/[0.03] ${n.lida ? 'opacity-55' : ''}`}>
                        <Icon size={17} className={`mt-0.5 shrink-0 ${NOTIF_COLOR[n.tipo]}`} />
                        <span>
                          <span className="block text-[13px] leading-snug text-zinc-200">{n.titulo}</span>
                          <span className="mt-1 block text-[11px] text-zinc-500">{n.tempo}</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </Dropdown>
            </div>

            {/* Avatar / menu do utilizador */}
            <div className="relative">
              <button
                onClick={() => { setAvatarOpen((v) => !v); setBellOpen(false) }}
                className="flex items-center gap-2 rounded-xl border border-line py-1.5 pl-1.5 pr-2 transition hover:border-gold-400/30"
                aria-label="Menu da conta"
              >
                <img src={profile.avatar} alt={profile.nomeArtistico} className="h-8 w-8 rounded-lg object-cover" />
                <span className="hidden text-left md:block">
                  <span className="block text-xs font-bold leading-tight text-white">{profile.nomeArtistico}</span>
                  <span className="block text-[10px] text-zinc-500">{user.plano}</span>
                </span>
                <ChevronDown size={14} className="hidden text-zinc-500 md:block" />
              </button>
              <Dropdown open={avatarOpen} onClose={() => setAvatarOpen(false)}>
                <div className="border-b border-line px-4 py-3">
                  <p className="text-sm font-bold text-white">{profile.nomeArtistico}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
                <div className="py-2">
                  <button onClick={() => navigate('/painel/perfil')} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
                    <UserRound size={16} /> Perfil de artista
                  </button>
                  <button onClick={() => navigate('/painel/definicoes')} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
                    <Settings size={16} /> Definições
                  </button>
                  <button onClick={() => navigate('/painel/rendimentos')} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
                    <Banknote size={16} /> Rendimentos e pagamentos
                  </button>
                </div>
                <div className="border-t border-line py-2">
                  <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-300 transition hover:bg-rose-500/10">
                    <LogOut size={16} /> Terminar sessão
                  </button>
                </div>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>

      <Toasts />
    </div>
  )
}
