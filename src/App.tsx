import { useEffect } from 'react'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Legal from './pages/Legal'
import DashboardLayout from './components/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Releases from './pages/dashboard/Releases'
import NewRelease from './pages/dashboard/NewRelease'
import Analytics from './pages/dashboard/Analytics'
import Earnings from './pages/dashboard/Earnings'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'
import Logo from './components/Logo'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada | SonoraDrop'
  }, [])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <Logo size={44} />
      <p className="mt-10 font-display text-7xl font-extrabold text-gold-400">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white">Esta página não existe</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        O link pode estar errado ou o conteúdo foi movido. Volta ao início e continua a explorar a SonoraDrop.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-outline !py-2.5 text-sm"><Compass size={16} /> Página inicial</Link>
        <Link to="/painel" className="btn-gold !py-2.5 text-sm">Ir para o painel</Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/entrar" element={<Auth />} />
        <Route path="/registar" element={<Auth />} />
        <Route path="/legal" element={<Navigate to="/legal/termos" replace />} />
        <Route path="/legal/:doc" element={<Legal />} />

        <Route path="/painel" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="lancamentos" element={<Releases />} />
          <Route path="novo-lancamento" element={<NewRelease />} />
          <Route path="estatisticas" element={<Analytics />} />
          <Route path="rendimentos" element={<Earnings />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="definicoes" element={<Settings />} />
          <Route path="*" element={<Navigate to="/painel" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
