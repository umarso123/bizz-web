import { useState, useRef, type MouseEvent } from 'react'

const TABS = [
  { id: 'architecture', label: '01 // ARCHITECTURE' },
  { id: 'terminal', label: '02 // LIVE LOGS' },
  { id: 'stack', label: '03 // TECH STACK' },
  { id: 'benchmarks', label: '04 // METRICS' },
] as const

type TabId = (typeof TABS)[number]['id']

export function TechTerminal() {
  const [activeTab, setActiveTab] = useState<TabId>('architecture')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    // Subtle 3D perspective tilt (-8deg to +8deg)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const handleCopyCommand = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npx bizaffix-core@latest init')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[560px] rounded-[18px] border border-black/10 bg-[#0e121b] text-white shadow-[0_25px_60px_-15px_rgba(13,18_31,0.25)] transition-transform duration-200 ease-out select-none overflow-hidden"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        fontFamily: "'JetBrains Mono', 'Geist Mono', ui-monospace, monospace",
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(47,91,234,0.35), transparent 70%)`,
        }}
      />

      {/* Terminal Top Chrome / Window Controls */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f56]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[11px] text-zinc-400 tracking-wider">
            BIZAFFIX // CORE ENGINE v2.5
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase">
            60 FPS · OPTIMAL
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 flex border-b border-white/10 bg-black/40 text-[11px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 text-center transition-all cursor-pointer font-mono tracking-wider ${
                isActive
                  ? 'border-b-2 border-[#2f5bea] bg-white/[0.06] text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content Display Area */}
      <div className="relative z-10 p-5 min-h-[300px] flex flex-col justify-between">
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>TOPOLOGY: DISTRIBUTED PRODUCT ENGINE</span>
              <span className="text-[#f5c84c]">REGION: GLOBAL EDGE</span>
            </div>

            {/* Visual Node Diagram */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <span className="block text-[10px] text-zinc-400">01 // INTAKE</span>
                <span className="mt-1 block text-[13px] font-semibold text-white">Edge Gateway</span>
                <span className="mt-1 block text-[9px] text-[#2f5bea]">Cloudflare / Workers</span>
              </div>

              <div className="rounded-xl border border-[#2f5bea]/50 bg-[#2f5bea]/10 p-3 text-center shadow-[0_0_15px_rgba(47,91,234,0.2)]">
                <span className="block text-[10px] text-[#2f5bea]">02 // INTELLIGENCE</span>
                <span className="mt-1 block text-[13px] font-semibold text-white">AI Agent Mesh</span>
                <span className="mt-1 block text-[9px] text-emerald-400">LLM Router &amp; Vector</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <span className="block text-[10px] text-zinc-400">03 // EXECUTION</span>
                <span className="mt-1 block text-[13px] font-semibold text-white">Full-Stack Core</span>
                <span className="mt-1 block text-[9px] text-[#f5c84c]">React · Node · K8s</span>
              </div>
            </div>

            {/* Micro Benchmark Bar */}
            <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-3">
              <div className="flex justify-between text-[11px] text-zinc-300">
                <span>P99 Core Latency</span>
                <span className="text-emerald-400 font-mono">14.2 ms (Verified)</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#2f5bea] to-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-2 text-[12px] leading-relaxed">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-emerald-400">$</span>
              <span>bun run deploy:production --verify-build</span>
            </div>
            <div className="text-zinc-400 text-[11px]">
              <p className="text-zinc-500">→ Analyzing dependency graph (Next.js 15, React 19, TypeScript)</p>
              <p className="text-[#2f5bea]">✔ Compiled 184 client chunks in 280ms</p>
              <p className="text-emerald-400">✔ Neural routing pipeline initialized (14/14 models warm)</p>
              <p className="text-zinc-300">✔ Automated testing: 148 passed · 0 failed (100% test coverage)</p>
              <p className="text-[#f5c84c]">● Edge CDN caches primed across 28 global regions</p>
              <p className="text-emerald-400 font-semibold mt-2">
                🚀 Deployment Live: https://bizaffix.com [HEALTH: 100%]
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stack' && (
          <div className="space-y-3">
            <div className="text-[11px] text-zinc-400">
              PRODUCTION CAPABILITIES &amp; FRAMEWORKS
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Next.js 15',
                'React 19',
                'TypeScript 5.8',
                'Python / PyTorch',
                'AI Agent Mesh',
                'Flutter & Swift',
                'Tailwind CSS v4',
                'Docker & K8s',
                'AWS Lambda',
                'GraphQL / REST',
                'Supabase & Postgres',
                'GSAP & Lenis Motion',
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-zinc-200 transition-colors hover:border-[#2f5bea] hover:text-white hover:bg-[#2f5bea]/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="text-[10px] text-zinc-400 block">SYSTEM AVAILABILITY</span>
              <span className="text-[24px] font-bold text-white block mt-1 tracking-tight">99.98%</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Zero unplanned downtime</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="text-[10px] text-zinc-400 block">LIGHTHOUSE SCORE</span>
              <span className="text-[24px] font-bold text-emerald-400 block mt-1 tracking-tight">100 / 100</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">SEO · Perf · Accessibility</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="text-[10px] text-zinc-400 block">AI INFERENCE TIME</span>
              <span className="text-[24px] font-bold text-[#2f5bea] block mt-1 tracking-tight">&lt; 180ms</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Streaming tokens</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="text-[10px] text-zinc-400 block">ANIMATION REFRESH</span>
              <span className="text-[24px] font-bold text-[#f5c84c] block mt-1 tracking-tight">60 FPS</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">GPU-accelerated GSAP</span>
            </div>
          </div>
        )}

        {/* Bottom Interactive Command Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">$</span>
            <span className="text-zinc-300">npx bizaffix-core@latest init</span>
          </div>

          <button
            type="button"
            onClick={handleCopyCommand}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer active:scale-95"
          >
            {copied ? '✔ COPIED' : 'COPY'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TechTerminal
