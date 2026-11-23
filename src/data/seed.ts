import type { AppNotification, AppUser, Payout, Release } from '../types'

export const DEMO_ACCOUNT = {
  email: 'mario@sonoradrop.ao',
  password: 'demo1234',
}

export const DEMO_USER: AppUser = {
  id: 'demo-user',
  nome: 'Mário Kalunga dos Santos',
  nomeArtistico: 'Mário Kalunga',
  email: 'mario@sonoradrop.ao',
  plano: 'Profissional',
  membroDesde: '2023-03-14',
}

const ALL_PLATFORMS = [
  'Spotify',
  'Apple Music',
  'YouTube Music',
  'Deezer',
  'TikTok / Artist',
  'Instagram & Facebook',
  'Amazon Music',
  'TIDAL',
  'SoundCloud',
  'Boomplay',
  'Audiomack',
  'Mdundo',
]

export const PLATFORM_CATALOG = ALL_PLATFORMS

export const PLATFORM_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Globais', items: ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'Amazon Music', 'TIDAL', 'SoundCloud'] },
  { label: 'África', items: ['Boomplay', 'Audiomack', 'Mdundo'] },
  { label: 'Social & vídeo', items: ['TikTok / Artist', 'Instagram & Facebook'] },
]

export const GENRES = [
  'Semba',
  'Kizomba',
  'Afrobeat / Amapiano',
  'Hip-Hop',
  'Kuduro',
  'Afro House',
  'R&B',
  'Pop',
  'Afro Pop',
  'Eletrónica',
  'Jazz',
  'Gospel',
  'Outro',
]

export const LANGUAGES = ['Português', 'Kimbundu', 'Kikongo', 'Umbundu', 'Inglês', 'Francês', 'Instrumental']

export const SUGGESTED_COVERS = [
  '/assets/covers/kilombo-bounce.jpg',
  '/assets/covers/luanda-nocturno.jpg',
  '/assets/covers/mafuila.jpg',
  '/assets/covers/semba-eletronico.jpg',
]

export const seedReleases = (): Release[] => [
  {
    id: 'rel-kilombo',
    title: 'Kilombo Bounce',
    type: 'single',
    genre: 'Afrobeat / Amapiano',
    language: 'Português',
    cover: '/assets/covers/kilombo-bounce.jpg',
    status: 'live',
    releaseDate: '2025-09-12',
    upc: '8412345678901',
    platforms: ALL_PLATFORMS,
    tracks: [{ id: 't-kb-1', title: 'Kilombo Bounce', duration: '3:24', explicit: false }],
    streams: 743100,
    revenue: 2823.18,
    createdAt: '2025-08-20T10:00:00.000Z',
  },
  {
    id: 'rel-luanda-nocturno',
    title: 'Luanda Nocturno',
    type: 'album',
    genre: 'Kizomba',
    language: 'Português',
    cover: '/assets/covers/luanda-nocturno.jpg',
    status: 'live',
    releaseDate: '2025-06-20',
    upc: '8412345600012',
    platforms: ALL_PLATFORMS,
    tracks: [
      { id: 't-ln-1', title: 'Luanda Nocturno', duration: '4:02', explicit: false },
      { id: 't-ln-2', title: 'Mó Calor', duration: '3:47', explicit: true },
      { id: 't-ln-3', title: 'Mensagem', duration: '3:31', explicit: false },
      { id: 't-ln-4', title: 'Ilha da Madeira às 4 da Manhã', duration: '5:08', explicit: false },
      { id: 't-ln-5', title: 'Kizomba Lenta', duration: '4:20', explicit: false },
    ],
    streams: 2031900,
    revenue: 7717.83,
    createdAt: '2025-05-28T10:00:00.000Z',
  },
  {
    id: 'rel-mafuila',
    title: 'Mafuila',
    type: 'single',
    genre: 'Hip-Hop',
    language: 'Kimbundu',
    cover: '/assets/covers/mafuila.jpg',
    status: 'action_required',
    releaseDate: '2026-12-05',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Boomplay', 'Audiomack'],
    tracks: [{ id: 't-mf-1', title: 'Mafuila', duration: '3:12', explicit: true }],
    streams: 0,
    revenue: 0,
    createdAt: '2026-11-18T09:30:00.000Z',
    issue: 'A capa tem resolução inferior a 1400×1400px (atual: 800×800px). Envia uma capa em PNG ou JPG de alta resolução para continuar a distribuição.',
  },
  {
    id: 'rel-semba-eletronico',
    title: 'Semba Electrónico',
    type: 'ep',
    genre: 'Eletrónica',
    language: 'Português',
    cover: '/assets/covers/semba-eletronico.jpg',
    status: 'draft',
    releaseDate: '2027-02-13',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
    tracks: [
      { id: 't-se-1', title: 'Saudade da Ilha', duration: '4:44', explicit: false },
      { id: 't-se-2', title: 'Guitarra de Sintetizador', duration: '3:58', explicit: false },
    ],
    streams: 0,
    revenue: 0,
    createdAt: '2026-11-10T15:12:00.000Z',
  },
]

export const seedPayouts = (): Payout[] => [
  { id: 'pay-1', date: '2026-11-01', amount: 1850.0, method: 'Multicaixa Express', status: 'Concluído' },
  { id: 'pay-2', date: '2026-09-15', amount: 1200.0, method: 'Transferência BAI (IBAN)', status: 'Concluído' },
  { id: 'pay-3', date: '2026-07-02', amount: 980.4, method: 'Multicaixa Express', status: 'Concluído' },
  { id: 'pay-4', date: '2026-05-10', amount: 750.0, method: 'PayPal', status: 'Concluído' },
]

export const SEED_BALANCE = 1842.3
export const SEED_PENDING = 640.0
export const TOTAL_EARNED = 12486.1

const monthlyRaw: [string, number][] = [
  ['Dez 25', 98400],
  ['Jan 26', 112300],
  ['Fev 26', 134750],
  ['Mar 26', 151200],
  ['Abr 26', 178600],
  ['Mai 26', 210400],
  ['Jun 26', 246800],
  ['Jul 26', 258100],
  ['Ago 26', 291250],
  ['Set 26', 322700],
  ['Out 26', 348900],
  ['Nov 26', 372400],
]

export const streamsSeries = monthlyRaw.map(([m, streams]) => ({
  m,
  streams,
  receita: Math.round(streams * 0.0038),
}))

export const daily30: { d: string; streams: number }[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  const base = 10500 + Math.sin(i / 3.1) * 3200 + (i % 7 === 5 ? 5200 : 0) + ((i * 137) % 900)
  return {
    d: date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    streams: Math.max(6200, Math.round(base)),
  }
})

export const platformShares = [
  { name: 'Spotify', streams: 1380000, pct: 33.0, color: '#1DB954' },
  { name: 'Apple Music', streams: 862000, pct: 20.6, color: '#FA243C' },
  { name: 'YouTube Music', streams: 742000, pct: 17.7, color: '#FF4E45' },
  { name: 'Boomplay', streams: 398000, pct: 9.5, color: '#F2C14E' },
  { name: 'Deezer', streams: 241000, pct: 5.8, color: '#A238FF' },
  { name: 'Audiomack', streams: 187000, pct: 4.5, color: '#37A6E0' },
  { name: 'Outros', streams: 670000, pct: 8.9, color: '#5B5670' },
]

export const countries = [
  { flag: '🇦🇴', name: 'Angola', pct: 46, streams: 1910000 },
  { flag: '🇵🇹', name: 'Portugal', pct: 17, streams: 706000 },
  { flag: '🇫🇷', name: 'França', pct: 8, streams: 332000 },
  { flag: '🇧🇷', name: 'Brasil', pct: 7, streams: 291000 },
  { flag: '🇲🇿', name: 'Moçambique', pct: 5, streams: 208000 },
  { flag: '🇿🇦', name: 'África do Sul', pct: 3, streams: 124000 },
  { flag: '🌍', name: 'Outros (48 países)', pct: 14, streams: 581000 },
]

export const topTracks = [
  { title: 'Luanda Nocturno', detail: 'Luanda Nocturno — Álbum', streams: 812400, revenue: 3087.12 },
  { title: 'Kilombo Bounce', detail: 'Kilombo Bounce — Single', streams: 743100, revenue: 2823.78 },
  { title: 'Mó Calor', detail: 'Luanda Nocturno — Álbum', streams: 402800, revenue: 1530.64 },
  { title: 'Mensagem', detail: 'Luanda Nocturno — Álbum', streams: 388600, revenue: 1476.68 },
  { title: 'Saudade da Ilha', detail: 'Semba Electrónico — EP', streams: 296300, revenue: 1125.94 },
]

export const seedNotifications = (): AppNotification[] => [
  { id: 'n1', tipo: 'sucesso', titulo: '«Kilombo Bounce» ultrapassou 1 milhão de streams no Spotify', tempo: 'há 2 horas', lida: false },
  { id: 'n2', tipo: 'alerta', titulo: 'Mafuila requer ação: capa com resolução inferior a 1400×1400px', tempo: 'há 1 dia', lida: false },
  { id: 'n3', tipo: 'pagamento', titulo: 'Pagamento de $1.850,00 enviado via Multicaixa Express', tempo: 'há 22 dias', lida: true },
  { id: 'n4', tipo: 'info', titulo: 'Semba Electrónico foi guardado como rascunho', tempo: 'há 13 dias', lida: true },
]

export const activityFeed = [
  { id: 'a1', icon: 'alert', text: 'Ação necessária em «Mafuila»: resolução da capa insuficiente', tempo: 'há 1 dia' },
  { id: 'a2', icon: 'upload', text: '«Mafuila» enviada para processamento (5 lojas)', tempo: 'há 5 dias' },
  { id: 'a3', icon: 'payment', text: 'Pagamento de $1.850,00 via Multicaixa Express confirmado', tempo: 'há 22 dias' },
  { id: 'a4', icon: 'music', text: '«Kilombo Bounce» está ao vivo no Spotify, Apple Music e Boomplay', tempo: 'há 2 meses' },
  { id: 'a5', icon: 'draft', text: 'Rascunho «Semba Electrónico» atualizado (2 faixas)', tempo: 'há 13 dias' },
]

export const STORE_BADGES = [
  'Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'TIDAL', 'Amazon Music',
  'Boomplay', 'Audiomack', 'Mdundo', 'SoundCloud', 'TikTok', 'Instagram',
]
