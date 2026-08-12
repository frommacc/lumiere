import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

const InvalidToken = () => {
  return (
    <div className='space-y-8 animate-[fadeIn_0.5s_ease-out_forwards]'>
      <div className='border border-destructive/30 bg-destructive/5 p-6 rounded-none space-y-3 relative overflow-hidden'>
        <div className='flex items-center gap-3 text-destructive'>
          <AlertCircle className='h-5 w-5 shrink-0' />
          <h3 className='text-xs font-semibold uppercase tracking-widest'>            Invalid link
          </h3>
        </div>
        <p className='text-xs text-outline leading-relaxed'>          The reset link is invalid, expired or already used. Ve
          please request a new link to protect your profile.
        </p>
      </div>

      <div className='pt-2 space-y-4'>
        <Link
          href='/forgot-password'
          className='block w-full bg-primary text-primary-foreground py-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container shadow-lg'
        >          REQUEST A NEW LINK
        </Link>

        <div className='text-center'>
          <Link
            href='/login'
            className='text-[11px] font-semibold tracking-widest text-outline hover:text-primary transition-all uppercase'
          >            BACK TO ANNOUNCEMENT
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InvalidToken
