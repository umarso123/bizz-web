# Google Book a Call — Design

**Goal:** Visitors who click **Book a call** pick a date/time, enter name/email/phone, and the meeting is created on Bizaffix’s Google Calendar.

**Approach:** Google Calendar Appointment Schedule (host-managed). The website only opens the booking URL; Google owns availability, form fields, Meet links, and calendar invites.

## Visitor flow

1. Click **Book a call** (header, hero, footer, CTAs).
2. Land on Google booking page.
3. Choose date and time → enter name, email, phone (and any optional fields enabled in Google).
4. Confirm → event appears on the host calendar; visitor gets confirmation.

## Site behavior

- All **Book a call** actions use one configured booking URL (`VITE_BOOK_CALL_URL`).
- Until that URL is set, buttons fall back to `/contact` so the site does not break.
- `/contact` stays as the message form (not the scheduler).
- External booking opens in a new tab.

## Out of scope

- Custom in-site calendar UI
- Google Calendar API / OAuth
- Calendly / Cal.com (unless URL strategy changes later)

## Manual setup (host)

See plan: create Appointment Schedule in Google Calendar, enable phone field, copy booking page URL into `.env`.
