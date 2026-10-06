import { useId } from 'react'

/**
 * Premium editorial seated professional — layered SVG with soft lighting.
 * Designed to sit behind a laptop at a desk; arms extend toward the keyboard.
 */
export function Person({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="0 0 360 420"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#F0D2B8" />
          <stop offset="45%" stopColor="#E2B996" />
          <stop offset="100%" stopColor="#C99572" />
        </linearGradient>
        <linearGradient id={`${uid}-skin-shadow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C99572" stopOpacity="0" />
          <stop offset="100%" stopColor="#A87050" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${uid}-hair`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#3D2E28" />
          <stop offset="55%" stopColor="#2A1F1B" />
          <stop offset="100%" stopColor="#1A1310" />
        </linearGradient>
        <linearGradient id={`${uid}-shirt`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#243442" />
          <stop offset="40%" stopColor="#1A2834" />
          <stop offset="100%" stopColor="#0F1820" />
        </linearGradient>
        <linearGradient id={`${uid}-shirt-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0A1016" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#0A1016" stopOpacity="0" />
          <stop offset="60%" stopColor="#0A1016" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A1016" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${uid}-cheek`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#E8A88A" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#E8A88A" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Soft ambient contact under torso */}
      <ellipse cx="180" cy="392" rx="90" ry="14" fill="rgb(23 33 43 / 0.07)" />

      {/* —— Left upper arm (behind torso edge) —— */}
      <path
        d="M108 198 C 82 218, 68 252, 74 288 C 78 308, 92 318, 112 312 L 128 278"
        fill={`url(#${uid}-shirt)`}
      />
      <path
        d="M108 198 C 82 218, 68 252, 74 288 C 78 308, 92 318, 112 312 L 128 278"
        fill={`url(#${uid}-shirt-side)`}
        opacity="0.5"
      />

      {/* —— Right upper arm —— */}
      <path
        d="M252 198 C 278 218, 292 252, 286 288 C 282 308, 268 318, 248 312 L 232 278"
        fill={`url(#${uid}-shirt)`}
      />

      {/* —— Torso (leaning slightly forward) —— */}
      <path
        d="M118 186
           C 124 158, 146 146, 180 144
           C 214 146, 236 158, 242 186
           L 248 320
           C 250 348, 232 362, 204 364
           L 156 364
           C 128 362, 110 348, 112 320 Z"
        fill={`url(#${uid}-shirt)`}
      />
      <path
        d="M118 186
           C 124 158, 146 146, 180 144
           C 214 146, 236 158, 242 186
           L 248 320
           C 250 348, 232 362, 204 364
           L 156 364
           C 128 362, 110 348, 112 320 Z"
        fill={`url(#${uid}-shirt-side)`}
      />
      {/* Collar / placket */}
      <path
        d="M162 152 L180 188 L198 152"
        stroke="#F66C2A"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M180 188 L180 240"
        stroke="#0A8FD8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* —— Neck —— */}
      <path
        d="M164 128 C 166 118, 172 114, 180 114 C 188 114, 194 118, 196 128 L 198 156 C 198 164, 192 168, 180 168 C 168 168, 162 164, 162 156 Z"
        fill={`url(#${uid}-skin)`}
      />
      <path
        d="M164 128 C 166 118, 172 114, 180 114 C 188 114, 194 118, 196 128 L 198 156 C 198 164, 192 168, 180 168 C 168 168, 162 164, 162 156 Z"
        fill={`url(#${uid}-skin-shadow)`}
      />

      {/* —— Head —— */}
      <ellipse cx="180" cy="92" rx="42" ry="48" fill={`url(#${uid}-skin)`} />
      <ellipse cx="180" cy="92" rx="42" ry="48" fill={`url(#${uid}-skin-shadow)`} />
      <ellipse cx="162" cy="102" rx="14" ry="10" fill={`url(#${uid}-cheek)`} />
      <ellipse cx="198" cy="102" rx="14" ry="10" fill={`url(#${uid}-cheek)`} />

      {/* Hair — soft volume, not a flat cap */}
      <path
        d="M138 96
           C 136 52, 152 36, 180 34
           C 212 36, 228 54, 224 98
           C 222 78, 210 62, 180 60
           C 154 62, 142 74, 138 96 Z"
        fill={`url(#${uid}-hair)`}
      />
      <path
        d="M138 90 C 132 108, 136 128, 148 136"
        stroke={`url(#${uid}-hair)`}
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M222 90 C 228 108, 224 128, 212 136"
        stroke={`url(#${uid}-hair)`}
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Refined face — soft, editorial */}
      <ellipse cx="166" cy="96" rx="2.4" ry="3.2" fill="#4A342C" opacity="0.55" />
      <ellipse cx="194" cy="96" rx="2.4" ry="3.2" fill="#4A342C" opacity="0.55" />
      <path
        d="M174 118 Q180 122 186 118"
        stroke="#B8886C"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M158 86 Q166 82 172 86"
        stroke="#3D2E28"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M188 86 Q194 82 202 86"
        stroke="#3D2E28"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* —— Forearms reaching to keyboard (in front of torso, under laptop in scene) —— */}
      <path
        d="M112 308 C 128 318, 148 324, 168 326 L 172 338 C 152 338, 128 332, 108 320 Z"
        fill={`url(#${uid}-shirt)`}
      />
      <path
        d="M248 308 C 232 318, 212 324, 192 326 L 188 338 C 208 338, 232 332, 252 320 Z"
        fill={`url(#${uid}-shirt)`}
      />

      {/* Hands on desk */}
      <ellipse
        cx="158"
        cy="336"
        rx="16"
        ry="9"
        fill={`url(#${uid}-skin)`}
        transform="rotate(-12 158 336)"
      />
      <ellipse
        cx="202"
        cy="336"
        rx="16"
        ry="9"
        fill={`url(#${uid}-skin)`}
        transform="rotate(12 202 336)"
      />
      <ellipse cx="158" cy="336" rx="16" ry="9" fill={`url(#${uid}-skin-shadow)`} transform="rotate(-12 158 336)" />
      <ellipse cx="202" cy="336" rx="16" ry="9" fill={`url(#${uid}-skin-shadow)`} transform="rotate(12 202 336)" />
    </svg>
  )
}
