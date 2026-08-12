'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth-client'
import Link from 'next/link'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// UI components (if you have them in @/components/ui/...)
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null)
    setLoading(true)

    try {
      const { error: apiError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
      })

      if (apiError) {
        setServerError(
          apiError.message || 'An error occurred during registration.',
        )
      } else {
        setRegisteredEmail(data.email)
        setSuccess(true)
      }
    } catch {
      setServerError('Unexpected error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-background p-6'>
        <div className='w-full max-w-md border border-outline-variant bg-card p-8 text-center shadow-2xl rounded-lg'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg'>
            ✓
          </div>
          <h2 className='mb-2 font-heading text-2xl font-bold text-foreground'>            Successful registration!
          </h2>
          <p className='mb-6 text-sm text-outline'>            We have sent you a verification email to{' '}
            <span className='font-semibold text-primary'>
              {registeredEmail}
            </span>            . Check your inbox to activate your account.
          </p>
          <Link
            href='/login'
            className='inline-block w-full bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary-container shadow-md'
          >            GO TO ANNOUNCEMENT
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className='flex min-h-screen flex-col md:flex-row bg-background text-foreground'>      {/* Left Side: Visual & Identity */}
      <section className='relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden'>
        <Image
          alt='High-end architectural materials'
          src='https://lh3.googleusercontent.com/aida-public/AB6AXuCe7De1V6RfGScoCyrylmWLKxUFvNkrh0E1Y49iDyPQBxufspWhXLh5NUVAo0I9V4gTrRNwVW2kQAww7l_c_g23md-X6vKOeA7-WDCaWav0CWiuKe6PPYu9zNgcKUqEL9pzjn0a0emH7EPGokPWAIwLiE_8WeoE5rSGxPy9Livxjtv6NI6eagP4NM3Qn3eXEhds0nMqhQ8yOmCpTbcfAQO5wyOtb9vB3cs7mnkFWeLUdpMgtbdafjkRyGkET3J6PfRHcVGZWdvx5u4'
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
            <h2 className='font-heading text-3xl md:text-5xl text-foreground mb-6 leading-tight'>              Join our exclusive community
            </h2>
            <p className='text-base md:text-lg text-outline'>              Experience the pinnacle of luxury and sophistication in every detail.
            </p>
          </div>
          <div className='hidden md:block'>
            <span className='text-xs uppercase tracking-[0.5em] text-outline-variant'>
              The Aurelian Standard
            </span>
          </div>
        </div>
      </section>      {/* Right side: Registration form */}
      <section className='w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-background'>
        <div className='w-full max-w-md'>
          <header className='mb-10'>
            <h1 className='font-heading text-3xl font-normal text-foreground mb-2'>              Registration
            </h1>
            <p className='text-outline text-sm'>              Enter your details to create a profile.
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
            {/* Name */}
            <Controller
              control={control}
              name='name'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='name'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >                    Name and surname
                  </Label>
                  <Input
                    {...field}
                    id='name'
                    type='text'
                    placeholder='Petar Petrovski'
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

            {/* Email */}
            <Controller
              control={control}
              name='email'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='email'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >
                    Email
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

            {/* Phone */}
            <Controller
              control={control}
              name='phone'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='phone'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >                    Telephone
                  </Label>
                  <Input
                    {...field}
                    id='phone'
                    type='tel'
                    placeholder='07X XXX XXX'
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

            {/* Passwords */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-medium uppercase tracking-widest text-outline'>                  Security
                </span>                {/* Common button to show/hide both passwords */}
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer select-none'
                >
                  {showPassword ? (
                    <>
                      <EyeOff className='h-3.5 w-3.5' />
                      <span>Hide passwords</span>
                    </>
                  ) : (
                    <>
                      <Eye className='h-3.5 w-3.5' />
                      <span>Show passwords</span>
                    </>
                  )}
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Password */}
                <Controller
                  control={control}
                  name='password'
                  render={({ field, fieldState }) => (
                    <div className='group relative'>
                      <Label
                        htmlFor='password'
                        className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                      >                        Password
                      </Label>
                      <Input
                        {...field}
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        className={`w-full bg-transparent border-0 border-b rounded-none px-0 py-2.5 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300 ${
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

                {/* Confirm Password */}
                <Controller
                  control={control}
                  name='confirmPassword'
                  render={({ field, fieldState }) => (
                    <div className='group relative'>
                      <Label
                        htmlFor='confirmPassword'
                        className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                      >                        Confirm Password
                      </Label>
                      <Input
                        {...field}
                        id='confirmPassword'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        className={`w-full bg-transparent border-0 border-b rounded-none px-0 py-2.5 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300 ${
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
              </div>
            </div>

            {/* Terms Checkbox */}
            <Controller
              control={control}
              name='terms'
              render={({ field, fieldState }) => (
                <div className='pt-2'>
                  <div className='flex items-start space-x-3'>
                    <Checkbox
                      id='terms'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='mt-0.5 border-outline-variant data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                    />
                    <Label
                      htmlFor='terms'
                      className='text-xs text-outline select-none leading-tight font-normal cursor-pointer'
                    >                      I accept {' '}
                      <a
                        href='#'
                        className='text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all'
                      >                        Terms and Conditions
                      </a>
                    </Label>
                  </div>
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
              >                {loading ? 'REGISTERING...' : 'CREATE PROFILE'}
              </button>

              <div className='flex flex-col items-center space-y-2'>
                <p className='text-outline text-xs'>Already have an account?</p>
                <Link
                  href='/login'
                  className='text-[11px] font-semibold tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-all pb-0.5 uppercase'
                >                  LOG IN
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
