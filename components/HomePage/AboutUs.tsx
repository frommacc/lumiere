import React from 'react'
import { Award, Leaf, Sparkles } from 'lucide-react'
// import { motion } from 'motion/react'
import Image from 'next/image'

export default function AboutUs() {
  const brandPillars = [
    {
      icon: <Award className='text-primary shrink-0' size={20} />,
      title: 'Престижни Готвачи',
      desc: 'Нашиот тим е предводен од кулинарски визионери наградувани низ Европа.',
    },
    {
      icon: <Leaf className='text-primary shrink-0' size={20} />,
      title: '100% Органско потекло',
      desc: 'Состојки набавени директно од наши локлани органски фарми и градини.',
    },
    {
      icon: <Sparkles className='text-primary shrink-0' size={20} />,
      title: 'Модерна Алхемија',
      desc: 'Техники од молекуларна гастрономија кои ги будат сите пет сетила.',
    },
  ]

  return (
    <section id='about' className='py-28 bg-black scroll-mt-20'>
      <div className='max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
        {/* Left column: Visuals */}
        <div className='relative h-140 w-full'>
          {/* Subtle gold offset outline */}
          <div className='absolute -top-6 -left-6 w-48 h-48 border border-primary/20 -z-10 rounded-xl' />

          <Image
            className='w-full h-full object-cover rounded-xl border border-white/5 edge-light shadow-2xl'
            src='https://lh3.googleusercontent.com/aida-public/AB6AXuCBFqO-sIVa3Ni0vBjjS3D2ebpa4635s0Y9EjSRq-9Gnp6C6oBR5qYhr9o0asBG5j4fWYso5khYhi1v-gu1tBld7XjaV7KMxavBLwJ8qwg0_R00E11O-sHgGLiBltFsptJy1kjhDDJiNMfypUSuXTDBvPEepgiH_R05KG6i-3NvrXSa7u0-zBpEaXB3Rnxkig5N6zQ4OW5dCyxwInKOMk6yf3ttIYkQK8nmKFXl3Ay9xidLIF_cJR_p'
            alt='Lumiere Luxury Restaurant Interior'
            fill
            sizes='100vw'
          />

          {/* Floater Glass Badge */}
          <div className='absolute -bottom-6 -right-6 bg-surface/90 backdrop-blur-md border border-primary/30 p-6 rounded-xl edge-light shadow-xl max-w-50 text-center'>
            <p className='font-display text-primary text-4xl font-bold mb-1'>
              20
            </p>
            <p className='font-sans text-[10px] tracking-[0.15em] uppercase font-bold text-on-surface'>
              ГОДИНИ СТРАСТ &amp; ТРАДИЦИЈА
            </p>
          </div>
        </div>

        {/* Right column: Content */}
        <div className='space-y-8'>
          <span className='font-sans text-primary text-xs tracking-[0.3em] font-semibold block uppercase'>
            НАШАТА ПРИКАЗНА
          </span>

          <h2 className='font-display text-3xl md:text-5xl text-on-surface font-bold leading-tight'>
            Каде Светлината се Среќава со Совршенството на Вкусот
          </h2>

          <p className='font-sans text-sm md:text-base text-on-surface-variant leading-relaxed'>
            LUMIÈRE е визија преточена во луксузна реалност. Од основањето во
            2006 година, нашата мисија е да создаваме не само оброци, туку
            незаборавни доживувања кои остануваат врежани во сеќавањата на
            нашите гости. Секоја вечер е ново претставување на беспрекорен
            гастрономски театар.
          </p>

          <p className='font-sans text-sm text-on-surface-variant/85 leading-relaxed'>
            Софистицираните комбинации на ароми, врвната услуга и смирувачкиот
            современ амбиент во срцето на Скопје ја носат премиум угостителската
            индустрија чекор понапред во иднината на финиот вкус.
          </p>

          {/* Brand Pillars list */}
          <div className='pt-6 space-y-4 border-t border-outline-variant/25'>
            {brandPillars.map((pillar, idx) => (
              <div key={idx} className='flex gap-4 items-start'>
                {pillar.icon}
                <div>
                  <h4 className='font-sans text-xs font-bold uppercase tracking-wider text-on-surface'>
                    {pillar.title}
                  </h4>
                  <p className='font-sans text-xs text-on-surface-variant/80 mt-1'>
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
