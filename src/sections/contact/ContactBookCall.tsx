import { bookCall, getBookCallTarget } from '@/app/navigation.ts'
import { Button, type ButtonProps } from '@/components/ui/Button.tsx'
import type { ContactIntent } from '@/content/contact.ts'
import { useJumpToNote } from '@/sections/contact/useContactScroll.ts'

type ContactBookCallProps = {
  onIntent: (intent: ContactIntent) => void
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}

/**
 * Book a call, on the page Book a call usually leads to.
 * With a booking calendar configured it opens that; otherwise it turns the
 * note below into a call request and moves the cursor there.
 */
export function ContactBookCall({ onIntent, variant = 'primary', size = 'lg' }: ContactBookCallProps) {
  const jumpToNote = useJumpToNote()
  const target = getBookCallTarget()

  if (target.kind === 'external') {
    return (
      <Button href={target.href} target="_blank" rel="noreferrer noopener" variant={variant} size={size}>
        {bookCall.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => {
        onIntent('call')
        jumpToNote()
      }}
    >
      {bookCall.label}
    </Button>
  )
}
