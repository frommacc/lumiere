'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth-client' // Прилагоди ја патеката до auth-client доколку е поинаква
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Валидација за потврда на лозинка
    if (formData.password !== formData.confirmPassword) {
      setError('Лозинките не се совпаѓаат.')
      return
    }

    setLoading(true)

    try {
      const { error: apiError } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone, // Проследување на дополнителното поле
      })

      if (apiError) {
        setError(apiError.message || 'Се појави грешка при регистрацијата.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Неочекувана грешка. Обидете се повторно.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg'>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>
            Успешна регистрација!
          </h2>
          <p className='mb-6 text-gray-600'>
            Ви испративме е-пошта за верификација на{' '}
            <span className='font-semibold'>{formData.email}</span>. Проверете
            го вашето сандаче за да го активирате профилот.
          </p>
          <Link
            href='/login'
            className='inline-block rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
          >
            Оди кон Најава
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Креирај профил</h1>
          <p className='mt-1 text-sm text-gray-500'>Добредојдовте во Lumiere</p>
        </div>

        {error && (
          <div className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Име и презиме
            </label>
            <input
              type='text'
              name='name'
              required
              value={formData.name}
              onChange={handleChange}
              placeholder='Петар Петровски'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Телефонски број
            </label>
            <input
              type='tel'
              name='phone'
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder='+389 7X XXX XXX'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Е-пошта
            </label>
            <input
              type='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='example@domain.com'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Лозинка
            </label>
            <input
              type='password'
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Потврди лозинка
            </label>
            <input
              type='password'
              name='confirmPassword'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='••••••••'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50'
          >
            {loading ? 'Се регистрира...' : 'Регистрирај се'}
          </button>
        </form>

        <p className='mt-6 text-center text-xs text-gray-500'>
          Веќе имате профил?{' '}
          <Link
            href='/login'
            className='font-semibold text-black hover:underline'
          >
            Најавете се
          </Link>
        </p>
      </div>
    </div>
  )
}
