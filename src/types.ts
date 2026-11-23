export type ReleaseType = 'single' | 'ep' | 'album'
export type ReleaseStatus = 'live' | 'processing' | 'draft' | 'action_required'

export interface Track {
  id: string
  title: string
  duration: string
  explicit: boolean
}

export interface Release {
  id: string
  title: string
  type: ReleaseType
  genre: string
  language: string
  cover: string
  status: ReleaseStatus
  releaseDate: string
  upc?: string
  platforms: string[]
  tracks: Track[]
  streams: number
  revenue: number
  createdAt: string
  issue?: string
}

export interface Payout {
  id: string
  date: string
  amount: number
  method: string
  status: 'Concluído' | 'Pendente'
}

export interface AppUser {
  id: string
  nome: string
  nomeArtistico: string
  email: string
  plano: string
  membroDesde: string
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export interface AppNotification {
  id: string
  tipo: 'sucesso' | 'alerta' | 'pagamento' | 'info'
  titulo: string
  tempo: string
  lida: boolean
}

export interface ProfileState {
  nomeArtistico: string
  nome: string
  email: string
  telefone: string
  pais: string
  cidade: string
  genero: string
  bio: string
  avatar: string
  links: {
    spotify: string
    instagram: string
    youtube: string
  }
}
