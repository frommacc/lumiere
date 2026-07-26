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
            'Се случи грешка при ресетирање на лозинката. Линкот е истечен или невалиден.',
        })
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('root', {
        message: 'Мрежна грешка. Ве молиме обидете се повторно.',
      })
      console.error(err)
    }
  }

  return (
    <>
      {/* СЛУЧАЈ 1: УСПЕШНА ПРОМЕНА */}
      {success ? (
        <div className='space-y-8 animate-[fadeIn_0.5s_ease-out_forwards]'>
          <div className='border border-primary/30 bg-primary/5 p-6 rounded-none space-y-3 relative overflow-hidden'>
            <div className='flex items-center gap-3 text-primary'>
              <CheckCircle2 className='h-5 w-5 shrink-0' />
              <h3 className='text-xs font-semibold uppercase tracking-widest'>
                Успешна промена!
              </h3>
            </div>
            <p className='text-xs text-outline leading-relaxed'>
              Вашата лозинка е успешно ажурирана. Веднаш ве пренасочуваме кон
              страницата за најава...
            </p>
          </div>

          <div className='pt-2'>
            <Link
              href='/login'
              className='block w-full bg-primary text-primary-foreground py-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary-container shadow-lg'
            >
              ОДИ КОН НАЈАВА
            </Link>
          </div>
        </div>
      ) : (
        /* СЛУЧАЈ 2: ФОРМА ЗА НОВА ЛОЗИНКА */
        <div>
          <header className='mb-10'>
            <h1 className='font-heading text-3xl font-normal text-foreground mb-2'>
              Нова лозинка
            </h1>
            <p className='text-outline text-sm'>
              Внесете ја вашата нова безбедна лозинка за пристап.
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
          >
            {/* Нова Лозинка */}
            <Controller
              control={control}
              name='password'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='password'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >
                    Нова лозинка
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
                        showPassword ? 'Сокриј лозинка' : 'Прикажи лозинка'
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
            />

            {/* Потврди лозинка */}
            <Controller
              control={control}
              name='confirmPassword'
              render={({ field, fieldState }) => (
                <div className='group relative'>
                  <Label
                    htmlFor='confirmPassword'
                    className='block text-[10px] font-medium uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors duration-300 mb-1'
                  >
                    Потврди лозинка
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
                          ? 'Сокриј лозинка'
                          : 'Прикажи лозинка'
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
              >
                {isSubmitting ? 'СЕ ЗАЧУВУВА...' : 'ПРОМЕНИ ЛОЗИНКА'}
              </button>

              <div className='flex flex-col items-center space-y-2'>
                <p className='text-outline text-xs'>Се сетивте на лозинката?</p>
                <Link
                  href='/login'
                  className='text-[11px] font-semibold tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-all pb-0.5 uppercase'
                >
                  НАЗАД КОН НАЈАВА
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
