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
      // This is where you put your API logic (eg fetch('/api/contact', ...))
      // We simulate a 1 second network request:
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      form.reset()
    } catch {
      setError('An error occurred while sending. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-12'>
      <div>
        <span className='font-sans text-xs font-semibold uppercase text-primary tracking-[0.3em] block mb-4'>          CONNECT WITH US
        </span>
        <h2 className='font-sans text-5xl font-bold text-foreground mb-8'>          Contact
        </h2>
        <div className='space-y-4 text-muted-foreground'>
          <div className='flex items-center gap-4'>
            <MapPin className='w-5 h-5 text-primary shrink-0' />
            <p className='text-base'>Blvd. Partizanski Odredi 22, Skopje</p>
          </div>
          <div className='flex items-center gap-4'>
            <Phone className='w-5 h-5 text-primary shrink-0' />
            <p className='text-base'>+389 2 3123 456</p>
          </div>
        </div>
      </div>      {/* MESSAGE SENT SUCCESSFULLY */}
      {isSubmitted ? (
        <div className='bg-surface-container border border-primary/30 p-8 rounded-lg space-y-4 transition-all duration-500 animate-in fade-in zoom-in-95'>
          <div className='flex items-center gap-3 text-primary'>
            <CheckCircle2 className='w-8 h-8 shrink-0' />
            <h3 className='font-sans font-bold text-xl text-foreground'>              Thank you!
            </h3>
          </div>
          <p className='text-muted-foreground text-sm leading-relaxed'>            Your message has been sent successfully. Our team will contact you at
            the shortest possible time.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className='text-xs font-semibold uppercase tracking-wider text-primary hover:underline pt-2 inline-block cursor-pointer'
          >            Send another message →
          </button>
        </div>      ) : (
        /* CONTACT FORM */
        <form onSubmit={handleSubmit} className='space-y-8'>
          {error && (
            <div className='flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md text-sm'>
              <AlertCircle className='w-5 h-5 shrink-0' />
              <p>{error}</p>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='relative'>
              <label className='font-sans text-[10px] text-outline mb-2 block uppercase tracking-widest'>                Name and Surname
              </label>
              <input
                type='text'
                name='name'
                required
                placeholder='Your name'
                className='w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-foreground py-2 transition-colors placeholder:text-outline/50 outline-none'
              />
            </div>
            <div className='relative'>
              <label className='font-sans text-[10px] text-outline mb-2 block uppercase tracking-widest'>                Email
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
            <label className='font-sans text-[10px] text-outline mb-2 block uppercase tracking-widest'>              Message
            </label>
            <textarea
              name='message'
              rows={4}
              required
              placeholder='How can we help you?'
              className='w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-foreground py-2 transition-colors placeholder:text-outline/50 resize-none outline-none'
            />
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='bg-primary text-primary-foreground font-sans font-semibold text-xs tracking-wider px-12 py-4 hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all duration-300 active:scale-95 uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      )}
    </div>
  )
}
