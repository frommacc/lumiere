'use client'

import { FormEvent, useState } from 'react'
import { MapPin, Phone, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget

    try {
      // Тука ја ставаш твојата API логика (на пр. fetch('/api/contact', ...))
      // Симулираме мрежно барање од 1 секунда:
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      form.reset()
    } catch {
      setError('Се појави грешка при испраќањето. Обидете се повторно.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-12'>
      <div>
        <span className='font-sans text-xs font-semibold uppercase text-primary tracking-[0.3em] block mb-4'>
          ПОВРЗЕТЕ СЕ СО НАС
        </span>
        <h2 className='font-sans text-5xl font-bold text-foreground mb-8'>
          Контакт
        </h2>
        <div className='space-y-4 text-muted-foreground'>
          <div className='flex items-center gap-4'>
            <MapPin className='w-5 h-5 text-primary shrink-0' />
            <p className='text-base'>Бул. Партизански Одреди 22, Скопје</p>
          </div>
          <div className='flex items-center gap-4'>
            <Phone className='w-5 h-5 text-primary shrink-0' />
            <p className='text-base'>+389 2 3123 456</p>
          </div>
        </div>
      </div>

      {/* УСПЕШНО ИСПРАТЕНА ПОРАКА */}
      {isSubmitted ? (
        <div className='bg-surface-container border border-primary/30 p-8 rounded-lg space-y-4 transition-all duration-500 animate-in fade-in zoom-in-95'>
          <div className='flex items-center gap-3 text-primary'>
            <CheckCircle2 className='w-8 h-8 shrink-0' />
            <h3 className='font-sans font-bold text-xl text-foreground'>
              Ви благодариме!
            </h3>
          </div>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Вашата порака е успешно испратена. Нашиот тим ќе ве контактира во
            најкраток можен рок.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className='text-xs font-semibold uppercase tracking-wider text-primary hover:underline pt-2 inline-block cursor-pointer'
          >
            Испрати друга порака →
          </button>
        </div>
      ) : (
        /* ФОРМА ЗА КОНТАКТ */
        <form onSubmit={handleSubmit} className='space-y-8'>
          {error && (
            <div className='flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md text-sm'>
              <AlertCircle className='w-5 h-5 shrink-0' />
              <p>{error}</p>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='relative'>
              <label className='font-sans text-[10px] text-outline mb-2 block uppercase tracking-widest'>
                Име и Презиме
              </label>
              <input
                type='text'
                name='name'
                required
                placeholder='Вашето име'
                className='w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-foreground py-2 transition-colors placeholder:text-outline/50 outline-none'
              />
            </div>
            <div className='relative'>
              <label className='font-sans text-[10px] text-outline mb-2 block uppercase tracking-widest'>
                Е-пошта
              </label>
              <input
                type='email'
                name='email'
                required
                placeholder='email@example.com'
                className='w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-foreground py-2 transition-colors placeholder:text-outline/50 outline-none'
              />
            </div>
          </div>
          <div className='relative'>
            <label className='font-sans text-[10px] text-outline mb-2 block uppercase tracking-widest'>
              Порака
            </label>
            <textarea
              name='message'
              rows={4}
              required
              placeholder='Како можеме да ви помогнеме?'
              className='w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-foreground py-2 transition-colors placeholder:text-outline/50 resize-none outline-none'
            />
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='bg-primary text-primary-foreground font-sans font-semibold text-xs tracking-wider px-12 py-4 hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all duration-300 active:scale-95 uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'СЕ ИСПРАЌА...' : 'ИСПРАТИ ПОРАКА'}
          </button>
        </form>
      )}
    </div>
  )
}
