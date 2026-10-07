import type { BuildId } from '@/content/contact.ts'

/**
 * Imperative frame the filament reads every animation tick.
 * Kept outside React so scroll and pointer movement do not rerender the page.
 */
export const contactLive = {
  activeField: null as string | null,
  emailReady: false,
  messageRatio: 0,
  build: null as BuildId | null,
  arrived: false,
  complete: false,
  hoverOption: null as number | null,
  chosenOption: null as number | null,
  awake: false,
  pointerX: 0.5,
  pointerY: 0.5,
  finePointer: false,
}

export function resetContactLive() {
  contactLive.activeField = null
  contactLive.emailReady = false
  contactLive.messageRatio = 0
  contactLive.build = null
  contactLive.arrived = false
  contactLive.complete = false
  contactLive.hoverOption = null
  contactLive.chosenOption = null
  contactLive.awake = false
  contactLive.pointerX = 0.5
  contactLive.pointerY = 0.5
}

const tensionByBuild: Record<BuildId, number> = {
  healthcare: 1.22,
  website: 0.92,
  mobile: 1.38,
  product: 1,
  dashboard: 0.42,
  uiux: 1.12,
  logo: 1.04,
}

export function tensionFor(build: BuildId | null) {
  return build ? tensionByBuild[build] : 0.88
}
