import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: 'border-emerald-400/30 text-emerald-400',
  error: 'border-rose-400/30 text-rose-400',
  info: 'border-sky-400/30 text-sky-400',
}

export default function Toasts() {
  const { toasts, dismissToast } = useApp()
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[60] flex w-full max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type]
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-panel2/95 px-4 py-3 shadow-card backdrop-blur ${COLORS[toast.type]}`}
          >
            <Icon size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm leading-snug text-zinc-100">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Fechar notificação"
              className="rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
