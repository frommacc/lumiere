'use client'
import { useReservationStore } from '@/store/useReservationStore'
import { Clock, Phone, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function Hero() {
  const { openReservation } = useReservationStore()
  const onScrollToMenu = () => {}
  return (
    <header
      id='home'
      className='relative h-screen w-full overflow-hidden flex items-center justify-center'
    >
      {/* Background Image Container */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute inset-0 bg-linear-to-b from-black/65 via-black/35 to-surface z-10' />
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.01 }}
          transition={{
            duration: 12,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className='w-full h-full object-cover'
          src='https://lh3.googleusercontent.com/aida-public/AB6AXuCa5tbCRs84Vqn6EokNLVoFcfX6oSdxI3kBIJ0oFu3fDGwEFKpqjw6eRcpgoPd8vrnhNM9eSEPmvYT2otg5kwW4y5P-8TdV9MkYBTvDUVJ3PGL6_i0VZimuR2qKx-Fp70eJ2GZBcZpC7y4TvlUei-6DhC2mF7TEhNu88rRUp7CTi7Gi0BuBFGwV0copwV_mtYR_q0i-Lem-Ew7CPfYqoLd250-Cbt4nE1WaB2Whkd5r-IEclgEyQv4t'
          alt='Lumiere Fine Dining Plate'
        />
      </div>

      {/* Hero Content */}
      <div className='relative z-20 text-center px-6 max-w-4xl'>
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='font-sans text-xs uppercase tracking-[0.3em] text-primary block mb-4'
        >
          КУЛИНАРСКА ЕЛЕГАНЦИЈА &amp; ПРЕСТИЖ
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className='font-mono text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 uppercase leading-tight'
        >
          Lumière Gastronomy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className='font-sans text-sm md:text-lg text-foreground/80 max-w-2xl mx-auto italic mb-12 leading-relaxed'
        >
          Ексклузивна одисеја на вкусови каде светлината се спојува со уметноста
          на кулинарството.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-4'
        >
          <Link
            href='#menu'
            onClick={onScrollToMenu}
            className='group w-full sm:w-auto bg-primary text-primary-foreground font-sans text-xs uppercase tracking-[0.2em] font-semibold px-10 py-4 hover:shadow-[0_0_25px_rgba(242,202,80,0.4)] hover:bg-primary-container active:scale-95 transition-all duration-300 flex items-center justify-center gap-2'
          >
            НАРАЧАЈ ОНЛАЈН
            <ArrowRight
              size={14}
              className='group-hover:translate-x-1 transition-transform'
            />
          </Link>

          <button
            onClick={openReservation}
            className='w-full sm:w-auto border border-surface-variant font-sans text-xs uppercase tracking-[0.2em] font-semibold px-10 py-4 hover:bg-surface-variant/30 active:scale-95 transition-all duration-300'
          >
            РЕЗЕРВИРАЈ МАСА
          </button>
        </motion.div>
      </div>

      {/* Hero Footer Info */}
      <div className='absolute bottom-10 left-0 w-full z-20 px-8 md:px-16 hidden md:flex justify-between items-end border-t border-white/10 pt-6 opacity-80'>
        <div className='flex gap-12'>
          <div className='flex items-center gap-3'>
            <Clock size={16} className='text-primary' />
            <div className='font-sans text-[10px] tracking-widest uppercase'>
              <p className='text-on-surface-variant font-medium text-[8px]'>
                РАБОТНО ВРЕМЕ
              </p>
              <p className='text-on-surface font-semibold'>
                12:00 - 00:00 секој ден
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Phone size={16} className='text-primary' />
            <div className='font-sans text-[10px] tracking-widest uppercase'>
              <p className='text-on-surface-variant font-medium text-[8px]'>
                КОНТАКТ РЕЗЕРВАЦИИ
              </p>
              <p className='text-on-surface font-semibold'>+389 2 3123 456</p>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='font-sans text-[10px] tracking-widest uppercase text-right'>
            <p className='text-on-surface-variant font-medium text-[8px]'>
              ЛОКАЦИЈА
            </p>
            <p className='text-on-surface font-semibold'>
              Ул. Македонија Бр. 1, Скопје
            </p>
          </div>
          <MapPin size={16} className='text-primary' />
        </div>
      </div>
    </header>
  )
}
