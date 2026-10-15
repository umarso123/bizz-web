/**
 * Google Calendar Appointment Schedule booking page URL.
 * Set `VITE_BOOK_CALL_URL` in `.env` (see `.env.example`).
 * Until set, Book a call falls back to `/contact`.
 */
export const googleBookingUrl = (import.meta.env.VITE_BOOK_CALL_URL as string | undefined)?.trim() ?? ''
