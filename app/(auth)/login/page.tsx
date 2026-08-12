'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'

// UI components
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { loginSchema, type LoginFormValues } from '@/lib/validations/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/'

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null)
    setLoading(true)

    try {
      const { error: apiError } = await signIn.email({
        email: data.email,
        password: data.password,
      })

      if (apiError) {
        setServerError(apiError.message || 'Invalid email or password.')
      } else {
        router.push(redirectUrl)
        router.refresh()
      }
    } catch {
      setServerError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen flex-col md:flex-row bg-background text-foreground'>      {/* Left Side: Visual & Branding */}
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
            <h2 className='font-heading text-3xl md:text-5xl text-foreground mb-6 leading-tight'>              Welcome back
            </h2>
            <p className='text-base md:text-lg text-outline'>              Log in to your profile and continue the sophisticated experience.
            </p>
          </div>
          <div className='hidden md:block'>
            <span className='text-xs uppercase tracking-[0.5em] text-outline-variant'>
              The Aurelian Standard
            </span>
          </div>
        </div>
      </section>      {/* Right side: Login Form */}
      <section className='w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-background'>
        <div className='w-full max-w-md'>
          <header className='mb-10'>
            <h1 className='font-heading text-3xl font-normal text-foreground mb-2'>              Announcement
            </h1>
            <p className='text-outline text-sm'>              Enter your login details.
            </p>
          </header>          {/* Server Error */}
          { serverError && (
            <div className='mb-6 border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive rounded'>
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-7'
            noValidate
          >
            {/* Email Input */}
            <Controller
              control={control}
              name='email'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='email'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >                    Email
                  </Label>
                  <Input
                    {...field}
                    id='email'
                    type='email'
                    placeholder='example@domain.com'
                    className={`w-full bg-transparent border-0 border-b rounded-none px-2 py-2.5 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300 ${
                      fieldState.error
                        ? 'border-destructive'
                        : 'border-outline-variant focus:border-primary'
                    }`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-focus-within:w-full ${
                      fieldState.error ? 'bg-destructive' : 'bg-primary'
                    }`}
                  ></div>
                  {fieldState.error && (
                    <p className='text-[11px] text-destructive mt-1.5 block'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name='password'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <div className='flex justify-between items-center mb-1'>
                    <Label
                      htmlFor='password'
                      className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300'
                    >                      Password
                    </Label>
                    <div className='flex items-center gap-4'>
                      {/* Toggle password visibility */}
                      <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer select-none'
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className='h-3.5 w-3.5' />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className='h-3.5 w-3.5' />
                            <span>Show</span>
                          </>
                        )}
                      </button>

                      <Link
                        href='/forgot-password'
                        className='text-[10px] text-outline hover:text-primary transition-colors tracking-widest uppercase'
                      >                        Forgotten?
                      </Link>
                    </div>
                  </div>
                  <Input
                    {...field}
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    className={`w-full bg-transparent border-0 border-b rounded-none px-2 py-2.5 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300 ${
                      fieldState.error
                        ? 'border-destructive'
                        : 'border-outline-variant focus:border-primary'
                    }`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-focus-within:w-full ${
                      fieldState.error ? 'bg-destructive' : 'bg-primary'
                    }`}
                  ></div>
                  {fieldState.error && (
                    <p className='text-[11px] text-destructive mt-1.5 block'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Actions */}
            <div className='pt-4 space-y-6'>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-primary text-primary-foreground py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container disabled:opacity-50 shadow-lg cursor-pointer'
              >                {loading ? 'LOGINING...' : 'LOGIN'}
              </button>

              <div className='flex flex-col items-center space-y-2'>
                <p className='text-outline text-xs'>Don't have an account?</p>
                <Link
                  href='/register'
                  className='text-[11px] font-semibold tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-all pb-0.5 uppercase'
                >                  CREATE NEW
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
