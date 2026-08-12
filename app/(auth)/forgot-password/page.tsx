'use client'

import { useState } from 'react'
import { requestPasswordReset } from '@/lib/auth-client'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

// UI components
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      })

      if (result.error) {
        setError('We failed to send reset email.')
      } else {
        setSuccess(true)
        toast.success(`Reset link sent to: ${email}`)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Forgot password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen flex-col md:flex-row bg-background text-foreground'>      {/* Left Side: Visual & Identity */}
      <section className='relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden'>
        <Image
          alt='Lumière Ambiance'
          src='https://lh3.googleusercontent.com/aida-public/AB6AXuDMjZ8JM3C73asUmtqpWnpAQt2ftc6z5yfSqfCql30aSkF8Z5xeXWc6KPrD_k2T4r5cPO54aAekyq0KzSy6jBFYOt_Zn3XXP7_gNGlNAe6wGWIvbJBTblLCQvb_NvJZD3z1u2g993djy6aqm_a7khsXqJgIYTImUpQsGh-TlI8-diKnmL1_WszMCVY_vuRZdBiLhVGQ81KAfztiaDRMzMpF5pQ-nJy4989c9tiA2CYnEyt6ySrSEsNxhskVpCKSCVhIMFNHxd_ORpI'
          fill
          priority
          className='object-cover grayscale-[0.3]'
        />
        <div className='absolute inset-0 bg-background/80'></div>
        <div className='relative z-10 h-full flex flex-col justify-between p-8 md:p-16'>
          <div className='flex items-center space-x-4'>
            <div className='h-px w-12 bg-primary'></div>
            <span className='text-xs font-semibold uppercase tracking-[0.3em] text-primary'>
              Lumière Architecture
            </span>
          </div>
          <div className='max-w-md my-auto py-12 md:py-0'>
            <h2 className='font-heading text-3xl md:text-5xl text-foreground mb-6 leading-tight'>              Forgot your password?
            </h2>
            <p className='text-base md:text-lg text-outline'>              Don't worry. Enter your email and we'll send it to you
              secure link to choose a new one.
            </p>
          </div>
          <div className='hidden md:block'>
            <span className='text-xs uppercase tracking-[0.5em] text-outline-variant'>
              The Aurelian Standard
            </span>
          </div>
        </div>
      </section>      {/* Right side: Form / Success state */}
      <section className='w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-background'>
        <div className='w-full max-w-md'>          {/* CASE 1: SUCCESS SENT LINK */}
          {success? (
            <div className='space-y-8 animate-[fadeIn_0.5s_ease-out_forwards]'>
              <div className='border border-primary/30 bg-primary/5 p-6 rounded-none space-y-3 relative overflow-hidden'>
                <div className='flex items-center gap-3 text-primary'>
                  <CheckCircle2 className='h-5 w-5 shrink-0' />
                  <h3 className='text-xs font-semibold uppercase tracking-widest'>                    The link has been sent!
                  </h3>
                </div>
                <p className='text-xs text-outline leading-relaxed'>                  We've sent you an email with reset instructions on{' '}
                  <span className='font-semibold text-foreground'>{email}</span>                  . Check your inbox.
                </p>
              </div>

              <div className='pt-2'>
                <Link
                  href='/login'
                  className='block w-full bg-primary text-primary-foreground py-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container shadow-lg'
                >                  GO TO ANNOUNCEMENT
                </Link>
              </div>
            </div>          ) : (
            /* CASE 2: STANDARD FORM */
            <div>
              <header className='mb-10'>
                <h1 className='font-heading text-3xl font-normal text-foreground mb-2'>                  Forgot password
                </h1>
                <p className='text-outline text-sm'>                  Enter your email to receive a reset link.
                </p>
              </header>              {/* Server / Local error */}
              { error && (
                <div className='mb-6 border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive rounded'>
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className='flex flex-col space-y-7'
                noValidate
              >
                {/* Email Input */}
                <div className='group relative'>
                  <Label
                    htmlFor='email'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='example@domain.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary rounded-none px-2 py-2.5 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300'
                  />
                  <div className='absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-focus-within:w-full'></div>
                </div>

                {/* Actions */}
                <div className='pt-4 space-y-6'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-primary text-primary-foreground py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container disabled:opacity-50 shadow-lg cursor-pointer'
                  >                    {loading ? 'SENDING...' : 'SEND LINK'}
                  </button>

                  <div className='flex flex-col items-center space-y-2'>
                    <p className='text-outline text-xs'>                      Remember your password?
                    </p>
                    <Link
                      href='/login'
                      className='text-[11px] font-semibold tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-all pb-0.5 uppercase'
                    >                      BACK TO ANNOUNCEMENT
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
