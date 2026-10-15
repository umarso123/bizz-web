# Google Book a Call Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Point every **Book a call** CTA at a Google Appointment Schedule URL, with `/contact` fallback until configured.

**Architecture:** One env var `VITE_BOOK_CALL_URL` + helpers in `navigation.ts` / a small `BookCallLink`. Buttons use `href` for external; Links use the shared component.

**Tech Stack:** Vite env, React Router Link (fallback only), existing `Button` `href` support.

## Global Constraints

- CTA label stays **Book a call** (legacy-site.md).
- No invented copy; no custom calendar UI.

---

### Task 1: Booking config + navigation helpers

- [ ] Add `src/content/booking.ts` reading `VITE_BOOK_CALL_URL`
- [ ] Add `.env.example`
- [ ] Extend `src/app/navigation.ts` with `bookCallButtonProps` / target helper
- [ ] Add `BookCallLink` for non-Button CTAs

### Task 2: Wire all CTAs

- [ ] Header, Footer, ConnectBanner, FloatingHero, Hero, ClosingCta, ServicesPage
- [ ] Verify TypeScript build

### Task 3: Host fills URL

- [ ] User creates Google Appointment Schedule and pastes URL into `.env`
