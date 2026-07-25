'use client'

import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Globe,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '../Icons/CustomIcons'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => {
        setSubscribed(false)
      }, 3500)
    }
  }

  return (
    <footer className='bg-surface text-foreground border-t border-outline-variant/20 pt-20 pb-10'>
      <div className='max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12'>
        {/* Col 1: Brand & Socials */}
        <div className='space-y-6'>
          <a
            href='#home'
            className='font-display text-2xl font-bold text-primary tracking-widest uppercase block'
          >
            LUMIÈRE
          </a>
          <p className='font-sans text-xs md:text-sm leading-relaxed'>
            Премиум гастрономско искуство во Скопје кое ги редефинира границите
            на луксузот, естетиката и автентичниот вкус.
          </p>
          <div className='flex gap-3'>
            <a
              href='#'
              className='w-10 h-10 rounded-full flex items-center justify-center border border-foreground/30 hover:text-primary hover:border-primary transition-all duration-300'
              aria-label='Instagram'
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href='#'
              className='w-10 h-10 rounded-full flex items-center justify-center border border-foreground/30 hover:text-primary hover:border-primary transition-all duration-300'
              aria-label='Facebook'
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href='#'
              className='w-10 h-10 rounded-full flex items-center justify-center border border-foreground/30 hover:text-primary hover:border-primary transition-all duration-300'
              aria-label='Website'
            >
              <Globe size={16} />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className='font-sans text-xs font-bold uppercase tracking-[0.2em] mb-6'>
            Линкови
          </h4>
          <ul className='space-y-3 font-sans text-xs text-foreground/90'>
            <li>
              <a
                href='#home'
                className='hover:text-primary transition-colors hover:underline decoration-primary/40 underline-offset-4'
              >
                Почетна
              </a>
            </li>
            <li>
              <a
                href='#menu'
                className='hover:text-primary transition-colors hover:underline decoration-primary/40 underline-offset-4'
              >
                Нашето Мени
              </a>
            </li>
            <li>
              <a
                href='#about'
                className='hover:text-primary transition-colors hover:underline decoration-primary/40 underline-offset-4'
              >
                За Ресторанот
              </a>
            </li>
            <li>
              <a
                href='#reviews'
                className='hover:text-primary transition-colors hover:underline decoration-primary/40 underline-offset-4'
              >
                Осврти &amp; Препораки
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact Info */}
        <div>
          <h4 className='font-sans text-xs font-bold uppercase tracking-[0.2em] mb-6'>
            Контакт
          </h4>
          <ul className='space-y-4 font-sans text-xs text-foreground/90'>
            <li className='flex items-start gap-2.5'>
              <MapPin size={15} className='text-primary shrink-0 mt-0.5' />
              <span>Ул. Македонија Бр. 1, Скопје, Македонија</span>
            </li>
            <li className='flex items-center gap-2.5'>
              <Phone size={15} className='text-primary shrink-0' />
              <span>+389 2 3123 456</span>
            </li>
            <li className='flex items-center gap-2.5'>
              <Mail size={15} className='text-primary shrink-0' />
              <span>contact@lumiere.mk</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter subscription */}
        <div className='space-y-4'>
          <h4 className='font-sans text-xs font-bold uppercase tracking-[0.2em]'>
            Билтен
          </h4>
          <p className='font-sans text-xs text-foreground/90 leading-relaxed'>
            Претплатете се за да добивате известувања за нашите нови специјални
            менија и ексклузивни дегустациски настани.
          </p>

          {subscribed ? (
            <div className='flex items-center gap-2 text-primary font-sans text-xs py-1 transition-all'>
              <CheckCircle2 size={16} />
              <span>Успешна претплата! Ви благодариме.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className='relative mt-2'>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Вашата е-пошта'
                className='w-full bg-transparent border-b border-outline-variant focus:outline-none focus:border-primary text-xs pb-2 pr-10 placeholder:text-outline-variant/60'
              />
              <button
                type='submit'
                className='absolute right-0 bottom-2 text-primary hover:text-primary-container p-1 transition-colors'
                aria-label='Претплати се'
              >
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar copyright */}
      <div className='max-w-7xl mx-auto px-6 md:px-16 mt-16 pt-8 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-sans tracking-wider text-outline'>
        <p>© 2026 LUMIÈRE GASTRONOMY. СИТЕ ПРАВА СЕ ЗАДРЖАНИ.</p>
        <div className='flex gap-6 uppercase'>
          <a href='#' className='hover:text-primary transition-colors'>
            Правила за користење
          </a>
          <a href='#' className='hover:text-primary transition-colors'>
            Политика за приватност
          </a>
        </div>
      </div>
    </footer>
  )
}
