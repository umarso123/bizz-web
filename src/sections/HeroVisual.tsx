const blue = '#2f5bea'
const orange = '#f5c84c'
const ink = '#0d121f'

export function HeroVisual() {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 720 520"
        role="img"
        aria-label="A connected care system linking provider workflow, patient experience, and a phone"
        className="h-auto w-full overflow-visible font-sans"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <radialGradient id="hero-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={orange} stopOpacity="0.45" />
            <stop offset="42%" stopColor={orange} stopOpacity="0.14" />
            <stop offset="100%" stopColor={orange} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-blue-wash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={blue} stopOpacity="0.16" />
            <stop offset="70%" stopColor={blue} stopOpacity="0.04" />
            <stop offset="100%" stopColor={blue} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-node-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={blue} stopOpacity="0.35" />
            <stop offset="100%" stopColor={blue} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-node-orange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={orange} stopOpacity="0.4" />
            <stop offset="100%" stopColor={orange} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-phone-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={blue} stopOpacity="0.55" />
            <stop offset="100%" stopColor={blue} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="300" cy="268" rx="250" ry="168" fill="url(#hero-blue-wash)" />

        <g fill="none" stroke={blue} strokeWidth="1.25">
          <ellipse cx="300" cy="268" rx="228" ry="132" opacity="0.45" />
          <ellipse cx="300" cy="268" rx="156" ry="90" opacity="0.62" />
          <ellipse cx="300" cy="268" rx="86" ry="50" opacity="0.8" />
        </g>

        <circle cx="118" cy="214" r="3.5" fill={blue} />
        <circle cx="168" cy="168" r="2.5" fill={blue} opacity="0.7" />
        <circle cx="430" cy="150" r="2.5" fill={blue} opacity="0.8" />
        <circle cx="392" cy="214" r="3" fill={blue} />
        <circle cx="214" cy="392" r="3" fill={orange} />
        <circle cx="486" cy="318" r="2.5" fill={blue} opacity="0.65" />
        <circle cx="96" cy="300" r="2" fill={blue} opacity="0.55" />

        <path
          d="M300 250 C318 210 332 180 344 164"
          fill="none"
          stroke={blue}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1.5 7"
        />
        <circle cx="314" cy="226" r="2.2" fill={blue} />
        <circle cx="328" cy="196" r="2.2" fill={blue} />
        <circle cx="340" cy="174" r="2.2" fill={blue} />

        <path d="M292 280 C270 320 236 360 214 392" fill="none" stroke={orange} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M308 280 C324 318 336 342 344 352" fill="none" stroke={orange} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="258" cy="330" r="3.5" fill={orange} />
        <circle cx="236" cy="362" r="2.5" fill={orange} />

        <g>
          <rect x="78" y="122" width="292" height="52" rx="14" fill="#ffffff" stroke="#E4E9ED" />
          <text x="98" y="153" fill={ink} fontSize="16" fontWeight="500">
            Provider workflow
          </text>
          <circle cx="344" cy="148" r="16" fill="url(#hero-node-blue)" />
          <circle cx="344" cy="148" r="6" fill={blue} />
        </g>

        <g>
          <rect x="78" y="342" width="292" height="52" rx="14" fill="#ffffff" stroke={orange} strokeOpacity="0.55" />
          <text x="98" y="373" fill={ink} fontSize="16" fontWeight="500">
            Patient experience
          </text>
          <circle cx="344" cy="368" r="16" fill="url(#hero-node-orange)" />
          <circle cx="344" cy="368" r="6" fill={orange} />
        </g>

        <g>
          <circle cx="300" cy="268" r="46" fill="url(#hero-core-glow)" />
          <circle cx="300" cy="268" r="11" fill={orange} />
          <circle cx="300" cy="268" r="4" fill="#ffffff" />
        </g>

        <g>
          <rect x="448" y="36" width="246" height="360" rx="34" fill="#ffffff" stroke={blue} strokeOpacity="0.35" strokeWidth="1.25" />
          <rect x="522" y="54" width="96" height="6" rx="3" fill={blue} opacity="0.28" />

          <circle cx="488" cy="108" r="16" fill={orange} />
          <circle cx="488" cy="104" r="5" fill="#ffffff" />
          <path d="M478 118c2.2 6 7.2 9 10 9s7.8-3 10-9" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="516" y="96" width="120" height="7" rx="3.5" fill="#E4E9ED" />
          <rect x="516" y="112" width="78" height="6" rx="3" fill="#EEF1F3" />

          <rect x="468" y="152" width="206" height="58" rx="14" fill="#ffffff" stroke="#E4E9ED" />
          <rect x="484" y="168" width="20" height="18" rx="4" fill="none" stroke={blue} strokeWidth="1.4" />
          <path d="M484 174h20M489 168v-4M499 168v-4" fill="none" stroke={blue} strokeWidth="1.4" strokeLinecap="round" />
          <text x="514" y="186" fill={ink} fontSize="15" fontWeight="500">
            appointment booked
          </text>

          <rect x="468" y="224" width="206" height="58" rx="14" fill="#ffffff" stroke="#E4E9ED" />
          <circle cx="494" cy="253" r="9" fill="none" stroke={blue} strokeWidth="1.4" />
          <path d="M494 247v7l4 3" fill="none" stroke={blue} strokeWidth="1.4" strokeLinecap="round" />
          <text x="514" y="258" fill={ink} fontSize="15" fontWeight="500">
            history view
          </text>
          <circle cx="642" cy="253" r="18" fill="url(#hero-phone-glow)" />
          <circle cx="642" cy="253" r="4" fill={blue} />
        </g>
      </svg>
    </div>
  )
}
