import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings as SettingsIcon,
  Globe2,
  BellRing,
  Lock,
  Trash2,
  LogOut,
  BadgeCheck,
  Sparkles,
  CreditCard,
  ArrowUpRight,
  ChevronRight,
  Laptop,
  Smartphone,
  CircleCheck,
  CircleAlert,
} from 'lucide-react'
import Modal from '../../components/Modal'
import { useApp } from '../../context/AppContext'

const PREF_KEY = 'sonoradrop.prefs'

interface Prefs {
  idioma: string
  relatorioMensal: boolean
  alertaStreams: boolean
  alertaPagamentos: boolean
  alertaNovidades: boolean
  alertaEmail: boolean
  perfilPublico: boolean
}

const defaultPrefs: Prefs = {
  idioma: 'Português (Angola)',
  relatorioMensal: true,
  alertaStreams: true,
  alertaPagamentos: true,
  alertaNovidades: false,
  alertaEmail: true,
  perfilPublico: true,
}

const loadPrefs = (): Prefs => {
  try {
    const raw = localStorage.getItem(PREF_KEY)
    return raw ? { ...defaultPrefs, ...(JSON.parse(raw) as Partial<Prefs>) } : defaultPrefs
  } catch {
    return defaultPrefs
  }
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-gold-400' : 'bg-zinc-700'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

const PLANS = [
  { nome: 'Starter', preco: 'Grátis', detalhe: '15% de comissão por stream' },
  { nome: 'Profissional', preco: '4.900 Kz/mês', detalhe: '0% de comissão · lançamentos ilimitados' },
  { nome: 'Gravadora', preco: '19.900 Kz/mês', detalhe: 'Até 10 artistas · relatórios dedicados' },
]

export default function Settings() {
  const { user, currency, setCurrency, toast, resetDemo, logout, exchangeRate, profile } = useApp()
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [passwords, setPasswords] = useState({ atual: '', nova: '', confirma: '' })
  const [pwError, setPwError] = useState<string | null>(null)
  const [planOpen, setPlanOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(user?.plano ?? 'Profissional')

  useEffect(() => {
    document.title = 'Definições | SonoraDrop'
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
    } catch {
      // ignorar
    }
  }, [prefs])

  const setPref = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs((prev) => ({ ...prev, [key]: value }))

  const changePassword = (e: FormEvent) => {
    e.preventDefault()
    if (!passwords.atual) return setPwError('Indica a palavra-passe atual.')
    if (passwords.nova.length < 6) return setPwError('A nova palavra-passe deve ter pelo menos 6 caracteres.')
    if (passwords.nova !== passwords.confirma) return setPwError('As palavras-passe novas não coincidem.')
    if (passwords.nova === passwords.atual) return setPwError('A nova palavra-passe tem de ser diferente da atual.')
    setPasswordOpen(false)
    setPasswords({ atual: '', nova: '', confirma: '' })
    setPwError(null)
    toast('Palavra-passe alterada com sucesso. (demonstração)', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Definições</h1>
        <p className="mt-1 text-sm text-zinc-500">Conta, preferências e notificações — tudo num só lugar.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Conta */}
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><SettingsIcon size={17} className="text-gold-400" /> Conta</h2>
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-line bg-panel2 p-4">
              <img src={profile.avatar} alt={profile.nomeArtistico} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{profile.nomeArtistico}</p>
                <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gold-300"><BadgeCheck size={12} /> Plano {user?.plano}</p>
              </div>
              <Link to="/painel/perfil" className="btn-outline !px-3.5 !py-2 text-xs">Editar perfil</Link>
            </div>

            <div className="mt-4 divide-y divide-line">
              <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Palavra-passe</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">Última alteração há 4 meses</p>
                </div>
                <button onClick={() => setPasswordOpen(true)} className="btn-outline !px-3.5 !py-2 text-xs"><Lock size={14} /> Alterar</button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Verificação em dois passos</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">Protege a conta com um código SMS</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300"><CircleAlert size={12} /> Inativo</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Sessões ativas</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">2 dispositivos com sessão iniciada</p>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                  <Laptop size={16} aria-label="Computador" />
                  <Smartphone size={16} aria-label="Telemóvel" />
                </div>
              </div>
            </div>
          </section>

          {/* Preferências regionais */}
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><Globe2 size={17} className="text-gold-400" /> Região e moeda</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="idioma" className="label">Idioma</label>
                <select id="idioma" value={prefs.idioma} onChange={(e) => setPref('idioma', e.target.value)} className="input">
                  <option>Português (Angola)</option>
                  <option>Português (Portugal)</option>
                  <option>English</option>
                  <option>Français</option>
                </select>
              </div>
              <div>
                <span className="label">Moeda de apresentação</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setCurrency('USD'); toast('Valores agora em dólares americanos (USD).', 'info') }}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${currency === 'USD' ? 'border-gold-400/60 bg-gold-400/10' : 'border-line hover:border-zinc-700'}`}
                  >
                    <span className="block text-sm font-bold text-white">USD $</span>
                    <span className="block text-[10px] text-zinc-500">Dólar americano</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCurrency('AOA'); toast('Valores agora em kwanzas angolanos (AOA).', 'info') }}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${currency === 'AOA' ? 'border-gold-400/60 bg-gold-400/10' : 'border-line hover:border-zinc-700'}`}
                  >
                    <span className="block text-sm font-bold text-white">AOA Kz</span>
                    <span className="block text-[10px] text-zinc-500">Kwanza angolano</span>
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-zinc-600">Taxa de referência: 1 USD = {exchangeRate} Kz</p>
              </div>
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-[11px] leading-snug text-zinc-500">
              <CircleCheck size={14} className="mt-0.5 shrink-0 text-emerald-400" />
              Os royalties são sempre calculados em USD e pagos na moeda do teu método de levantamento, à taxa do dia.
            </p>
          </section>

          {/* Notificações */}
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><BellRing size={17} className="text-gold-400" /> Notificações</h2>
            <div className="mt-4 divide-y divide-line">
              {([
                ['relatorioMensal', 'Relatório mensal de royalties', 'Recebe o resumo de streams e receita no dia 1 de cada mês.'],
                ['alertaStreams', 'Marcos de streaming', 'Quando uma faixa ultrapassa 100 mil, 500 mil ou 1 milhão de streams.'],
                ['alertaPagamentos', 'Pagamentos e levantamentos', 'Confirmações de pagamento por email e notificação na app.'],
                ['alertaNovidades', 'Novidades da SonoraDrop', 'Novas lojas, funcionalidades e oportunidades de playlists.'],
                ['alertaEmail', 'Cópia por email', 'Enviar as notificações também para o email registado.'],
                ['perfilPublico', 'Perfil de artista público', 'Mostrar o teu perfil na página de artistas da SonoraDrop.'],
              ] as const).map(([key, titulo, detalhe]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100">{titulo}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{detalhe}</p>
                  </div>
                  <Toggle checked={prefs[key]} onChange={(v) => setPref(key, v)} label={titulo} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Lateral: plano + zona de perigo */}
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-gold-400/30 bg-gradient-to-b from-gold-400/10 to-panel p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15"><Sparkles size={18} className="text-gold-400" /></span>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">O teu plano</p>
            <p className="font-display text-2xl font-extrabold text-white">{user?.plano}</p>
            <p className="mt-1 text-xs text-zinc-400">{PLANS.find((p) => p.nome === user?.plano)?.detalhe}</p>
            <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-400">
              <li className="flex items-center gap-1.5"><CircleCheck size={12} className="text-emerald-400" /> Lançamentos ilimitados</li>
              <li className="flex items-center gap-1.5"><CircleCheck size={12} className="text-emerald-400" /> 0% de comissão por stream</li>
              <li className="flex items-center gap-1.5"><CircleCheck size={12} className="text-emerald-400" /> Estatísticas em tempo real</li>
            </ul>
            <button onClick={() => setPlanOpen(true)} className="btn-outline mt-4 w-full !py-2.5 text-xs"><ArrowUpRight size={14} /> Gerir plano</button>
            <p className="mt-2 text-center text-[10px] text-zinc-600">Próxima renovação: 14 de dezembro</p>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white"><CreditCard size={17} className="text-gold-400" /> Faturação</h2>
            <div className="mt-3 rounded-xl border border-line bg-panel2 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">Multicaixa •••• 6789</span>
                <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">Ativo</span>
              </div>
              <p className="mt-1 text-[10.5px] text-zinc-500">Débito mensal · 4.900 Kz + IVA</p>
            </div>
            <Link to="/painel/rendimentos" className="mt-3 flex items-center justify-between rounded-xl px-1 py-2 text-xs font-semibold text-zinc-300 transition hover:text-gold-300">
              Ver histórico de pagamentos <ChevronRight size={14} />
            </Link>
          </section>

          <section className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.04] p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-rose-300"><Trash2 size={17} /> Zona de risco</h2>
            <p className="mt-2 text-[11px] leading-snug text-zinc-500">Repõe os dados de demonstração (lançamentos, saldo, notificações e perfil). Esta ação não pode ser desfeita.</p>
            <button onClick={() => setResetOpen(true)} className="mt-3 w-full rounded-xl border border-rose-400/30 px-4 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500/10">Repor demonstração</button>
            <button onClick={logout} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-400 transition hover:text-white"><LogOut size={14} /> Terminar sessão</button>
          </section>
        </div>
      </div>

      {/* Modal palavra-passe */}
      <Modal
        open={passwordOpen}
        onClose={() => { setPasswordOpen(false); setPwError(null) }}
        title="Alterar palavra-passe"
        subtitle="Escolhe uma palavra-passe forte e única."
        footer={
          <>
            <button onClick={() => { setPasswordOpen(false); setPwError(null) }} className="btn-ghost !py-2 text-xs">Cancelar</button>
            <button form="pw-form" type="submit" className="btn-gold !py-2.5 text-xs"><Lock size={14} /> Alterar palavra-passe</button>
          </>
        }
      >
        <form id="pw-form" onSubmit={changePassword} className="space-y-4" noValidate>
          <div>
            <label htmlFor="pw-atual" className="label">Palavra-passe atual</label>
            <input id="pw-atual" type="password" value={passwords.atual} onChange={(e) => { setPasswords((p) => ({ ...p, atual: e.target.value })); setPwError(null) }} className="input" autoComplete="current-password" autoFocus />
          </div>
          <div>
            <label htmlFor="pw-nova" className="label">Nova palavra-passe</label>
            <input id="pw-nova" type="password" value={passwords.nova} onChange={(e) => { setPasswords((p) => ({ ...p, nova: e.target.value })); setPwError(null) }} className="input" autoComplete="new-password" />
            <p className="mt-1 text-[11px] text-zinc-600">Mínimo de 6 caracteres.</p>
          </div>
          <div>
            <label htmlFor="pw-confirma" className="label">Confirmar nova palavra-passe</label>
            <input id="pw-confirma" type="password" value={passwords.confirma} onChange={(e) => { setPasswords((p) => ({ ...p, confirma: e.target.value })); setPwError(null) }} className="input" autoComplete="new-password" />
          </div>
          {pwError && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">{pwError}</p>}
        </form>
      </Modal>

      {/* Modal plano */}
      <Modal
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        title="Gerir plano"
        subtitle="Muda de plano a qualquer momento — sem penalizações."
        size="lg"
        footer={
          <>
            <button onClick={() => setPlanOpen(false)} className="btn-ghost !py-2 text-xs">Fechar</button>
            <button
              onClick={() => {
                setPlanOpen(false)
                toast(selectedPlan === user?.plano ? `Continuas no plano ${selectedPlan}.` : `Pedido de mudança para ${selectedPlan} registado. (demonstração)`, 'success')
              }}
              className="btn-gold !py-2.5 text-xs"
            >
              Confirmar plano {selectedPlan}
            </button>
          </>
        }
      >
        <div className="space-y-2.5">
          {PLANS.map((plan) => (
            <label key={plan.nome} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${selectedPlan === plan.nome ? 'border-gold-400/50 bg-gold-400/5' : 'border-line hover:border-zinc-700'}`}>
              <input type="radio" name="plano" value={plan.nome} checked={selectedPlan === plan.nome} onChange={() => setSelectedPlan(plan.nome)} className="h-4 w-4 accent-[#F2C14E]" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  {plan.nome}
                  {plan.nome === user?.plano && <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-300">Atual</span>}
                </p>
                <p className="text-[11px] text-zinc-500">{plan.detalhe}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-zinc-200">{plan.preco}</span>
            </label>
          ))}
          <p className="pt-1 text-[11px] leading-snug text-zinc-600">A mudança aplica-se no próximo ciclo de faturação. Os dados de demonstração não são cobrados.</p>
        </div>
      </Modal>

      {/* Modal repor */}
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Repor dados de demonstração?"
        subtitle="Todos os lançamentos, rascunhos, pagamentos e alterações de perfil serão eliminados."
        footer={
          <>
            <button onClick={() => setResetOpen(false)} className="btn-ghost !py-2 text-xs">Cancelar</button>
            <button onClick={resetDemo} className="btn !py-2.5 border border-rose-400/30 bg-rose-500/15 text-xs font-bold text-rose-200 hover:bg-rose-500/25"><Trash2 size={14} /> Sim, repor tudo</button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-zinc-400">Esta aplicação guarda os dados no teu navegador (localStorage). Repor a demonstração devolve a conta de exemplo «Mário Kalunga» ao estado inicial — útil para testar todos os fluxos outra vez.</p>
      </Modal>
    </div>
  )
}
