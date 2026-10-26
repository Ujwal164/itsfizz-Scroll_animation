// Top-down sports car facing right. Inline SVG: crisp at any size, no image request.
export default function Car({ ref, className = "" }) {
  return (
    <div ref={ref} className={`car aspect-[2/1] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 200" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff5a4e" />
            <stop offset="0.5" stopColor="#e3261c" />
            <stop offset="1" stopColor="#a5130d" />
          </linearGradient>
          <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0f1720" />
            <stop offset="1" stopColor="#2b3a4a" />
          </linearGradient>
          <filter id="car-shadow" x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* shadow */}
        <rect x="34" y="40" width="352" height="132" rx="48" fill="#000" opacity="0.55" filter="url(#car-shadow)" />

        {/* tyres */}
        <rect x="74" y="24" width="64" height="24" rx="8" fill="#0b0b0b" />
        <rect x="74" y="152" width="64" height="24" rx="8" fill="#0b0b0b" />
        <rect x="282" y="26" width="60" height="22" rx="8" fill="#0b0b0b" />
        <rect x="282" y="152" width="60" height="22" rx="8" fill="#0b0b0b" />

        {/* body */}
        <path
          d="M30 66 Q30 38 64 36 L296 34 Q366 36 386 82 L386 118 Q366 164 296 166 L64 164 Q30 162 30 134 Z"
          fill="url(#car-body)"
        />

        {/* racing stripes on hood and trunk */}
        <rect x="292" y="88" width="88" height="8" rx="2" fill="#fff" opacity="0.9" />
        <rect x="292" y="104" width="88" height="8" rx="2" fill="#fff" opacity="0.9" />
        <rect x="34" y="88" width="108" height="8" rx="2" fill="#fff" opacity="0.9" />
        <rect x="34" y="104" width="108" height="8" rx="2" fill="#fff" opacity="0.9" />

        {/* cabin */}
        <path d="M148 64 Q146 100 148 136 L176 140 L176 60 Z" fill="url(#car-glass)" />
        <rect x="176" y="58" width="78" height="84" rx="16" fill="#b81910" />
        <path d="M254 58 L292 50 Q312 100 292 150 L254 142 Q264 100 254 58 Z" fill="url(#car-glass)" />
        <path d="M262 64 L284 58 Q296 80 290 92 Z" fill="#fff" opacity="0.12" />

        {/* mirrors */}
        <ellipse cx="256" cy="42" rx="10" ry="6" fill="#c41d14" />
        <ellipse cx="256" cy="158" rx="10" ry="6" fill="#c41d14" />

        {/* lights */}
        <path d="M368 50 Q382 60 384 76 L374 74 Q370 60 360 52 Z" fill="#fff6c8" />
        <path d="M368 150 Q382 140 384 124 L374 126 Q370 140 360 148 Z" fill="#fff6c8" />
        <rect x="30" y="52" width="6" height="26" rx="3" fill="#ff2a2a" />
        <rect x="30" y="122" width="6" height="26" rx="3" fill="#ff2a2a" />
      </svg>
    </div>
  );
}
