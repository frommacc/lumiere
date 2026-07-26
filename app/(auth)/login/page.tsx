'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth-client' // Прилагоди ја патеката до auth-client доколку е поинаква
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: apiError } = await signIn.email({
        email,
        password,
      })

      if (apiError) {
        setError(apiError.message || 'Невалидна е-пошта или лозинка.')
      } else {
        router.push('/') // Насочување кон почетна или сакана страница по најава
        router.refresh()
      }
    } catch {
      setError('Се појави неочекувана грешка.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Најава</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Добредојдовте назад во Lumiere
          </p>
        </div>

        {error && (
          <div className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Е-пошта
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='example@domain.com'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-1'>
              <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Лозинка
              </label>
              {/* Опционален линк за ресетирање на лозинка */}
              <Link
                href='/forgot-password'
                className='text-xs text-gray-500 hover:underline'
              >
                Заборавена лозинка?
              </Link>
            </div>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50'
          >
            {loading ? 'Се најавува...' : 'Најави се'}
          </button>
        </form>

        <p className='mt-6 text-center text-xs text-gray-500'>
          Немате профил?{' '}
          <Link
            href='/register'
            className='font-semibold text-black hover:underline'
          >
            Регистрирајте се
          </Link>
        </p>
      </div>
    </div>
  )
}
