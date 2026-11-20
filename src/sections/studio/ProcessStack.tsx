import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { studioProcess } from "@/data/studio-home.ts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Where each card rests in the pile, by depth: 0 is the top card. */
const SLOTS = [
  { rotation: 0, y: 0, scale: 1 },
  { rotation: 3.2, y: 18, scale: 0.965 },
  { rotation: -3.6, y: 34, scale: 0.93 },
  { rotation: 2.2, y: 48, scale: 0.9 },
];
const slot = (depth: number) => SLOTS[Math.min(depth, SLOTS.length - 1)];

/** Screens of scroll per step. */
const PER_STEP = 0.9;

/**
 * 06: how we work. A blue panel, inset from the page, scales up to meet you and
 * pins. Inside, the steps are a pile of cards: each scroll step throws the top
 * card off and the pile shuffles up, rotations settling. The ticks on the right
 * and the round button follow along; the button jumps to the next card.
 */
export function ProcessStack() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const steps = studioProcess.steps;
  const n = steps.length;

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".sh-stack-card");
      cards.forEach((card, i) => gsap.set(card, { ...slot(i), zIndex: n - i }));
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The panel grows out of the page as it arrives.
        gsap.fromTo(
          panelRef.current,
          { scale: 0.9, borderRadius: "72px" },
          {
            scale: 1,
            borderRadius: "32px",
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "top top",
              scrub: 0.5,
            },
          },
        );

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${window.innerHeight * PER_STEP * (n - 1)}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (n - 1),
              duration: { min: 0.25, max: 0.7 },
              ease: "power2.inOut",
              delay: 0.08,
            },
            onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
          },
        });
        triggerRef.current = tl.scrollTrigger ?? null;

        for (let step = 0; step < n - 1; step++) {
          // The top card is thrown up and off, tumbling.
          tl.to(
            cards[step],
            {
              yPercent: -150,
              rotation: step % 2 ? 16 : -14,
              x: step % 2 ? 120 : -120,
              duration: 1,
              ease: "power2.in",
            },
            step,
          ).to(
            cards[step],
            { autoAlpha: 0, duration: 0.35, ease: "none" },
            step + 0.55,
          );
          // The rest shuffle up one place.
          for (let j = step + 1; j < n; j++)
            tl.to(cards[j], { ...slot(j - step - 1), duration: 1 }, step);
        }

        gsap.from(".sh-process-head > *", {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 60%" },
        });
        return () => {
          triggerRef.current = null;
        };
      });
    },
    { scope: ref },
  );

  const next = () => {
    const st = triggerRef.current;
    if (!st) {
      document
        .getElementById("closing")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const target =
      active >= n - 1
        ? st.end + 2
        : st.start + ((st.end - st.start) * (active + 1)) / (n - 1);
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section ref={ref} aria-labelledby="process-title" className="sh-process">
      <div ref={panelRef} className="sh-process-panel">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M -120 760 C 260 520, 360 980, 720 760 S 1220 380, 1560 560"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.08"
            strokeWidth="90"
            strokeLinecap="round"
          />
        </svg>

        <div className="sh-process-head sh-wrap relative z-10 flex items-start justify-between gap-6 pt-[clamp(24px,5vh,56px)]">
          <div>
            <p className="sh-label text-white/80">{studioProcess.label}</p>
            <h2
              id="process-title"
              className="sh-title-voice mt-3 text-[clamp(1.75rem,3.2vw,3.25rem)] text-white"
            >
              {studioProcess.title}
            </h2>
          </div>
          <p
            className="sh-display text-[clamp(2.25rem,5vw,5rem)] leading-none whitespace-nowrap text-white/90"
            aria-live="polite"
          >
            <span className="sr-only">Step </span>
            {String(active + 1).padStart(2, "0")}
            <span className="text-white/40">/{String(n).padStart(2, "0")}</span>
          </p>
        </div>

        <ol className="sh-stack">
          {steps.map((step, i) => (
            <li key={step.number} className="sh-stack-card">
              <div className="sh-stack-paper sh-cut-br">
                <span
                  className="sh-stack-num"
                  data-outline={i % 2 ? "" : undefined}
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <div className="min-w-0">
                  <h3 className="sh-title-voice text-[clamp(1.75rem,3.6vw,3.75rem)]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-[clamp(1rem,1.3vw,1.3125rem)] leading-[1.45] tracking-[-0.015em] text-[#3a5bc7]">
                    {step.body}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full px-3.5 py-1.5 text-[0.875rem] font-medium tracking-[-0.01em] shadow-[0_0_0_1.5px_#234ED1]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="sh-ticks" aria-hidden="true">
          {steps.map((step, i) => (
            <span key={step.number} data-on={i === active} />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="absolute bottom-[clamp(18px,4vh,40px)] left-1/2 z-4 grid size-16 -translate-x-1/2 place-items-center rounded-full bg-[var(--sh-ink)] text-white shadow-[0_14px_30px_-12px_rgb(10_26_58/0.7)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--sh-yellow)] md:size-[4.5rem]"
          aria-label={
            active >= n - 1 ? "Continue down the page" : studioProcess.next
          }
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 5v14M6 13l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default ProcessStack;
