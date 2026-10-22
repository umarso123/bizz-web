import PushpinTearFooter from '@/components/ui/pushpin-tear-footer.tsx'
import { getBookCallTarget } from '@/app/navigation.ts'
import { studioEmail, studioSocial } from '@/content/contact.ts'
import { paperFont, paperInk } from '@/lib/paper-theme.ts'

/**
 * The site footer: the Pushpin Tear Footer (21st.dev/@kedhareswer, in
 * components/ui) dressed in Bizaffix copy, brand colours and Dazzed.
 */

const linkedin = studioSocial.find((item) => item.label === 'LinkedIn')?.href
const bookCall = getBookCallTarget()
const bookCallHref = bookCall.kind === 'external' ? bookCall.href : bookCall.to

export function SiteFooter() {
  return (
    <PushpinTearFooter
      brand="bizaffix."
      name="bizaffix"
      logo={
        <img
          src="/images/brand/bizaffix-logo.png"
          alt=""
          className="h-7 w-auto brightness-0 invert"
          draggable={false}
        />
      }
      logoHref="/"
      socials={[
        ...(linkedin ? [{ icon: 'linkedin' as const, label: 'LinkedIn', href: linkedin }] : []),
        { icon: 'mail', label: 'Email', href: `mailto:${studioEmail}` },
      ]}
      email={studioEmail}
      // No newsletter on the legacy site, so no sign-up form that goes nowhere.
      newsletter={null}
      status={{ label: 'available for new projects', href: bookCallHref }}
      mark="BZ / 2026"
      // No live clock
      timeZone=""
      columns={[
        {
          title: 'services',
          links: [
            { label: 'Healthcare', href: '/healthcare' },
            { label: 'Mobile & web', href: '/services' },
            { label: 'Cloud', href: '/services' },
          ],
          cta: { label: 'work.', href: '/work' },
        },
        {
          title: 'company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ],
          cta: { label: 'connect.', href: '/contact' },
        },
      ]}
      chat={{ label: 'let’s connect', href: '/contact' }}
      // No privacy or terms pages exist yet, so these point at real pages instead of "#".
      sideLinks={[
        { icon: 'doc', label: 'careers', href: '/careers' },
        { icon: 'mail', label: 'contact', href: '/contact' },
      ]}
      copyright={`Bizaffix LLC © ${new Date().getFullYear()}`}
      credit="engineered in austin"
      handle={{ label: 'LinkedIn', href: linkedin }}
      sheet={paperInk.blue}
      paper={paperInk.cream}
      sheetInk={paperInk.white}
      paperInk={paperInk.navy}
      fontSans={paperFont}
      className="bz-footer"
    />
  )
}
