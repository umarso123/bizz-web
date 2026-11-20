import { useLenis } from 'lenis/react'
import { useCallback, useEffect, useRef, useState } from 'react'

/** Self-contained Compass build, served from `public/embeds/compass.html`. */
const compassSrc = '/embeds/compass.html'

/** Styles injected into the embedded document: the site header replaces Compass's own bar. */
const embedStyles = `
  .bar { display: none !important; }
  html, body { overflow: hidden !important; }
  body { background: transparent !important; }
  .hero { padding-top: 24px; background: radial-gradient(circle at 83% 26%, #dcf1fb, transparent 44%); }
`

/**
 * Bizaffix Compass — compliance discovery demo, embedded under the site header.
 *
 * The demo is same-origin, so the iframe is sized to its content (no inner
 * scrollbar) and step changes scroll the page back to the top of the tool.
 */
export function CompassPage() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number>()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)

  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  const scrollToTool = useCallback(() => {
    const frame = frameRef.current
    if (!frame) return
    const root = getComputedStyle(document.documentElement)
    const clearance = parseFloat(root.getPropertyValue('--header-clearance')) * parseFloat(root.fontSize) || 92
    const top = frame.getBoundingClientRect().top + window.scrollY - clearance
    if (window.scrollY <= top + 1) return
    if (lenisRef.current) lenisRef.current.scrollTo(top, { immediate: true })
    else window.scrollTo(0, top)
  }, [])

  const handleLoad = useCallback(() => {
    const frame = frameRef.current
    const win = frame?.contentWindow
    const doc = frame?.contentDocument
    if (!frame || !win || !doc) return

    const style = doc.createElement('style')
    style.textContent = embedStyles
    doc.head.appendChild(style)

    // Compass calls window.scrollTo(0, 0) on "Start over"; route it to the host page.
    Object.defineProperty(win, 'scrollTo', { configurable: true, value: () => scrollToTool() })

    // Measure the body, not the document: the document is never shorter than the iframe itself.
    const measure = () => setHeight(Math.ceil(doc.body.getBoundingClientRect().height))
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(doc.body)

    // Step changes rewrite the progress label or toggle landing/workspace.
    const progress = doc.getElementById('mobileProgress')
    const workspace = doc.getElementById('workspace')
    let last = `${progress?.textContent}|${workspace?.hidden}`
    const steps = new MutationObserver(() => {
      const next = `${progress?.textContent}|${workspace?.hidden}`
      if (next === last) return
      last = next
      scrollToTool()
    })
    if (progress) steps.observe(progress, { childList: true, characterData: true, subtree: true })
    if (workspace) steps.observe(workspace, { attributes: true, attributeFilter: ['hidden'] })

    win.addEventListener('unload', () => {
      resize.disconnect()
      steps.disconnect()
    })
  }, [scrollToTool])

  useEffect(() => {
    const previous = document.title
    document.title = 'Bizaffix Compass — compliance discovery'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="studio-page">
      <h1 className="sr-only">Bizaffix Compass</h1>
      <iframe
        ref={frameRef}
        src={compassSrc}
        title="Bizaffix Compass compliance discovery tool"
        onLoad={handleLoad}
        className="block w-full border-0"
        style={{ height: height ?? '100vh' }}
      />
    </main>
  )
}
