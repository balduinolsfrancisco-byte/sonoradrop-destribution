export default function Logo({ size = 40, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="13" fill="#17141F" stroke="rgba(255,255,255,0.09)" />
        <path d="M24 6.5C24 6.5 12.7 22.2 12.7 30a11.3 11.3 0 0 0 22.6 0C35.3 22.2 24 6.5 24 6.5Z" fill="url(#sd-g)" />
        <path d="M19.4 31v-5.6M24 33.8V22.4M28.6 31v-8.2" stroke="#17141F" strokeWidth="2.3" strokeLinecap="round" />
        <defs>
          <linearGradient id="sd-g" x1="16" y1="10" x2="32" y2="39" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8D47E" />
            <stop offset="1" stopColor="#E0A32E" />
          </linearGradient>
        </defs>
      </svg>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[19px] font-extrabold tracking-tight text-white">
            Sonora<span className="text-gold-400">Drop</span>
          </span>
          <span className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.34em] text-zinc-500">
            Distribution
          </span>
        </span>
      )}
    </span>
  )
}
