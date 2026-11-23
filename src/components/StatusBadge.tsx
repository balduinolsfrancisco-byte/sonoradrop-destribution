import type { ReleaseStatus } from '../types'

const META: Record<ReleaseStatus, { label: string; cls: string; dot: string }> = {
  live: { label: 'Ao vivo', cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/25', dot: 'bg-emerald-400' },
  processing: { label: 'Em processamento', cls: 'bg-amber-400/10 text-amber-300 border-amber-400/25', dot: 'bg-amber-400 animate-pulse' },
  draft: { label: 'Rascunho', cls: 'bg-zinc-400/10 text-zinc-400 border-zinc-500/25', dot: 'bg-zinc-500' },
  action_required: { label: 'Ação necessária', cls: 'bg-rose-400/10 text-rose-300 border-rose-400/30', dot: 'bg-rose-400 animate-pulse' },
}

export default function StatusBadge({ status }: { status: ReleaseStatus }) {
  const meta = META[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${meta.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

export const TYPE_LABEL: Record<string, string> = {
  single: 'Single',
  ep: 'EP',
  album: 'Álbum',
}
