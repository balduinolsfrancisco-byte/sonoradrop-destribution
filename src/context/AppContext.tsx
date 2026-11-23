import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AOA_PER_USD,
  todaysISO,
  uid,
} from '../lib/format'
import {
  DEMO_ACCOUNT,
  DEMO_USER,
  SEED_BALANCE,
  SEED_PENDING,
  seedNotifications,
  seedPayouts,
  seedReleases,
} from '../data/seed'
import type {
  AppNotification,
  AppUser,
  Payout,
  ProfileState,
  Release,
  ReleaseStatus,
  ReleaseType,
  Toast,
  ToastType,
  Track,
} from '../types'

const KEYS = {
  user: 'sonoradrop.user',
  users: 'sonoradrop.users',
  releases: 'sonoradrop.releases',
  payouts: 'sonoradrop.payouts',
  balance: 'sonoradrop.balance',
  currency: 'sonoradrop.currency',
  notifications: 'sonoradrop.notifications',
  profile: 'sonoradrop.profile',
}

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage cheio ou indisponível — ignorar silenciosamente
  }
}

interface StoredUser extends AppUser {
  password: string
}

export interface RegisterInput {
  nome: string
  nomeArtistico: string
  email: string
  password: string
  plano: string
}

export interface NewReleaseInput {
  title: string
  type: ReleaseType
  genre: string
  language: string
  cover: string
  releaseDate: string
  platforms: string[]
  tracks: Track[]
  status: ReleaseStatus
}

interface AppContextValue {
  user: AppUser | null
  releases: Release[]
  payouts: Payout[]
  balance: number
  pending: number
  currency: 'USD' | 'AOA'
  setCurrency: (c: 'USD' | 'AOA') => void
  toasts: Toast[]
  toast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void
  login: (email: string, password: string) => string | null
  register: (input: RegisterInput) => string | null
  logout: () => void
  addRelease: (input: NewReleaseInput) => Release
  updateRelease: (id: string, patch: Partial<Release>) => void
  removeRelease: (id: string) => void
  requestWithdrawal: (amount: number, method: string) => string | null
  notifications: AppNotification[]
  markAllNotificationsRead: () => void
  profile: ProfileState
  saveProfile: (patch: Partial<ProfileState>) => void
  resetDemo: () => void
  exchangeRate: number
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const defaultProfile = (): ProfileState => ({
  nomeArtistico: DEMO_USER.nomeArtistico,
  nome: DEMO_USER.nome,
  email: DEMO_USER.email,
  telefone: '+244 923 456 789',
  pais: 'Angola',
  cidade: 'Luanda',
  genero: 'Semba · Afrobeat',
  bio: 'Artista e compositor angolano. Faço a ponte entre o semba tradicional e a eletrónica moderna — música feita para dançar em Luanda e em qualquer lado do mundo.',
  avatar: '/assets/avatar.jpg',
  links: {
    spotify: 'https://open.spotify.com/artist/mario-kalunga',
    instagram: 'https://www.instagram.com/mariokalunga',
    youtube: 'https://www.youtube.com/@mariokalunga',
  },
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => load(KEYS.user, null as AppUser | null))
  const [releases, setReleases] = useState<Release[]>(() => load(KEYS.releases, seedReleases()))
  const [payouts, setPayouts] = useState<Payout[]>(() => load(KEYS.payouts, seedPayouts()))
  const [balance, setBalance] = useState<number>(() => load(KEYS.balance, SEED_BALANCE))
  const [currency, setCurrency] = useState<'USD' | 'AOA'>(() => load(KEYS.currency, 'USD'))
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    load(KEYS.notifications, seedNotifications()),
  )
  const [profile, setProfile] = useState<ProfileState>(() => load(KEYS.profile, defaultProfile()))
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => save(KEYS.releases, releases), [releases])
  useEffect(() => save(KEYS.payouts, payouts), [payouts])
  useEffect(() => save(KEYS.balance, balance), [balance])
  useEffect(() => save(KEYS.currency, currency), [currency])
  useEffect(() => save(KEYS.notifications, notifications), [notifications])
  useEffect(() => save(KEYS.profile, profile), [profile])
  useEffect(() => save(KEYS.user, user), [user])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = uid()
    setToasts((prev) => [...prev.slice(-2), { id, message, type }])
    window.setTimeout(() => dismissToast(id), 4500)
  }, [dismissToast])

  const login = useCallback(
    (email: string, password: string): string | null => {
      const normalized = email.trim().toLowerCase()
      if (normalized === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
        setUser(DEMO_USER)
        return null
      }
      const users = load<StoredUser[]>(KEYS.users, [])
      const found = users.find((u) => u.email.toLowerCase() === normalized && u.password === password)
      if (!found) return 'Email ou palavra-passe incorretos. Experimenta a conta de demonstração.'
      const { password: _pw, ...appUser } = found
      setUser(appUser)
      return null
    },
    [],
  )

  const register = useCallback((input: RegisterInput): string | null => {
    const nome = input.nome.trim()
    const nomeArtistico = input.nomeArtistico.trim()
    const email = input.email.trim().toLowerCase()
    const password = input.password

    if (nome.length < 2) return 'Indica o teu nome completo.'
    if (nomeArtistico.length < 2) return 'Indica o teu nome artístico.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Indica um email válido.'
    if (password.length < 6) return 'A palavra-passe deve ter pelo menos 6 caracteres.'
    if (email === DEMO_ACCOUNT.email) return 'Este email está reservado à conta de demonstração.'

    const users = load<StoredUser[]>(KEYS.users, [])
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return 'Já existe uma conta com este email. Inicia sessão.'
    }

    const newUser: StoredUser = {
      id: uid(),
      nome,
      nomeArtistico,
      email,
      plano: input.plano,
      membroDesde: todaysISO(),
      password,
    }
    save(KEYS.users, [...users, newUser])
    const { password: _pw, ...appUser } = newUser
    // Conta nova: começa com um perfil em branco coerente com o registo
    setProfile({
      ...defaultProfile(),
      nome,
      nomeArtistico,
      email,
      telefone: '',
      cidade: '',
      genero: '',
      bio: '',
      links: { spotify: '', instagram: '', youtube: '' },
    })
    setUser(appUser)
    return null
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const addRelease = useCallback((input: NewReleaseInput): Release => {
    const release: Release = {
      ...input,
      id: uid(),
      streams: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
      upc:
        input.status === 'processing'
          ? String(Math.floor(8_410_000_000_000 + Math.random() * 99_999_999_999)).slice(0, 13)
          : undefined,
    }
    setReleases((prev) => [release, ...prev])
    return release
  }, [])

  const updateRelease = useCallback((id: string, patch: Partial<Release>) => {
    setReleases((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }, [])

  const removeRelease = useCallback((id: string) => {
    setReleases((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const requestWithdrawal = useCallback(
    (amount: number, method: string): string | null => {
      if (!Number.isFinite(amount) || amount <= 0) return 'Indica um valor válido.'
      if (amount < 50) return 'O valor mínimo para levantamento é $50.'
      if (amount > balance) return 'Saldo insuficiente para este levantamento.'
      const payout: Payout = {
        id: uid(),
        date: todaysISO(),
        amount,
        method,
        status: 'Pendente',
      }
      setPayouts((prev) => [payout, ...prev])
      setBalance((prev) => Math.round((prev - amount) * 100) / 100)
      return null
    },
    [balance],
  )

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })))
  }, [])

  const saveProfile = useCallback((patch: Partial<ProfileState>) => {
    setProfile((prev) => ({ ...prev, ...patch, links: { ...prev.links, ...(patch.links ?? {}) } }))
  }, [])

  const resetDemo = useCallback(() => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
    window.location.reload()
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      releases,
      payouts,
      balance,
      pending: SEED_PENDING,
      currency,
      setCurrency,
      toasts,
      toast,
      dismissToast,
      login,
      register,
      logout,
      addRelease,
      updateRelease,
      removeRelease,
      requestWithdrawal,
      notifications,
      markAllNotificationsRead,
      profile,
      saveProfile,
      resetDemo,
      exchangeRate: AOA_PER_USD,
    }),
    [
      user, releases, payouts, balance, currency, toasts, toast, dismissToast,
      login, register, logout, addRelease, updateRelease, removeRelease,
      requestWithdrawal, notifications, markAllNotificationsRead, profile,
      saveProfile, resetDemo,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>')
  return ctx
}
