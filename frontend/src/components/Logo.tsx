interface Props {
  size?: number;
  withText?: boolean;
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="CV Tailor logo">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset=".55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
      <path d="M20 14h17l9 9v27a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z" fill="#fff" fillOpacity=".95" />
      <path d="M37 14v9h9z" fill="#c7d2fe" />
      <rect x="22" y="29" width="16" height="3" rx="1.5" fill="#6366f1" />
      <rect x="22" y="36" width="20" height="3" rx="1.5" fill="#a5b4fc" />
      <rect x="22" y="43" width="12" height="3" rx="1.5" fill="#a5b4fc" />
      <path d="M47 8l1.8 4.2L53 14l-4.2 1.8L47 20l-1.8-4.2L41 14l4.2-1.8z" fill="#fde68a" />
    </svg>
  );
}

export function Logo({ size = 36, withText = true }: Props) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      {withText && (
        <span className="font-extrabold tracking-tight text-lg text-white">
          CV<span className="text-gradient">Tailor</span>
        </span>
      )}
    </span>
  );
}
