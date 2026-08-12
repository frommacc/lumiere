'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// UI Components
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ResetPasswordInputs,
  resetPasswordSchema,
} from '@/lib/validations/auth'

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      })

      if (resetError) {
        setError('root', {
          message:
            'An error occurred while resetting the password. The link has expired or is invalid.',
        })
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('root', {
        message: 'Network error. Please try again.',
      })
      console.error(err)
    }
  }

  return (
    <>      {/* CASE 1: SUCCESSFUL CHANGE */}
      {success? (
        <div className='space-y-8 animate-[fadeIn_0.5s_ease-out_forwards]'>
          <div className='border border-primary/30 bg-primary/5 p-6 rounded-none space-y-3 relative overflow-hidden'>
            <div className='flex items-center gap-3 text-primary'>
              <CheckCircle2 className='h-5 w-5 shrink-0' />
              <h3 className='text-xs font-semibold uppercase tracking-widest'>                Successful change!
              </h3>
            </div>
            <p className='text-xs text-outline leading-relaxed'>              Your password has been successfully updated. We immediately redirect you to
              login page...
            </p>
          </div>

          <div className='pt-2'>
            <Link
              href='/login'
              className='block w-full bg-primary text-primary-foreground py-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container shadow-lg'
            >              GO TO ANNOUNCEMENT
            </Link>
          </div>
        </div>      ) : (
        /* CASE 2: NEW PASSWORD FORM */
        <div>
          <header className='mb-10'>
            <h1 className='font-heading text-3xl font-normal text-foreground mb-2'>              New password
            </h1>
            <p className='text-outline text-sm'>              Enter your new secure access password.
            </p>
          </header>

          {/* Root error */}
          {errors.root && (
            <div className='mb-6 border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive rounded-none'>
              {errors.root.message}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-7'
            noValidate
          >            {/* New Password */}
            <Controller
              control={control}
              name='password'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='password'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >                    New password
                  </Label>
                  <div className='relative flex items-center'>
                    <Input
                      {...field}
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary rounded-none px-2 py-2.5 pr-10 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-2 text-outline hover:text-primary transition-colors focus:outline-none p-1'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                  <div className='absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-focus-within:w-full'></div>
                  {fieldState.error && (
                    <p className='text-[11px] font-medium text-destructive mt-1'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />            {/* Confirm password */}
            <Controller
              control={control}
              name='confirmPassword'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='confirmPassword'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >                    Confirm password
                  </Label>
                  <div className='relative flex items-center'>
                    <Input
                      {...field}
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary rounded-none px-2 py-2.5 pr-10 text-foreground focus-visible:ring-0 focus-visible:outline-none transition-all duration-300'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-2 text-outline hover:text-primary transition-colors focus:outline-none p-1'
                      aria-label={
                        showConfirmPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                  <div className='absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-focus-within:w-full'></div>
                  {fieldState.error && (
                    <p className='text-[11px] font-medium text-destructive mt-1'>
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
                disabled={isSubmitting}
                className='w-full bg-primary text-primary-foreground py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container disabled:opacity-50 shadow-lg cursor-pointer'
              >                {isSubmitting ? 'SAVING...' : 'CHANGE PASSWORD'}
              </button>

              <div className='flex flex-col items-center space-y-2'>
                <p className='text-outline text-xs'>Remember your password?</p>
                <Link
                  href='/login'
                  className='text-[11px] font-semibold tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-all pb-0.5 uppercase'
                >                  BACK TO ANNOUNCEMENT
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ResetPasswordForm
