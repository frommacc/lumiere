import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cacheLife, cacheTag } from 'next/cache'

import { getSpecialties } from '@/lib/db/menu-items.services'
import MenuClientGrid from '@/components/Menu/MenuClientGrid'

export default async function Specialties() {
  'use cache'
  cacheLife('weeks')
  cacheTag('specialties')

  const specialties = await getSpecialties()

  return (
    <section
      id='specialties'
      className='py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20'
    >
      {/* Title block */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6'>
        <div className='max-w-2xl'>
          <span className='font-sans text-primary text-xs tracking-[0.3em] font-semibold block mb-3'>
            КУЛИНАРСКИ РЕМЕК-ДЕЛА
          </span>
          <h2 className='font-display text-3xl md:text-5xl text-on-surface font-bold'>
            Нашите Специјалитети
          </h2>
        </div>

        <Link
          href='/menu'
          className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest font-sans uppercase text-primary hover:text-primary-container transition-colors group'
        >
          Види го целосното мени
          <ArrowRight
            size={14}
            className='transition-transform group-hover:translate-x-1'
          />
        </Link>
      </div>

      {/* Интерактивниот клиентски грид */}
      <MenuClientGrid items={specialties} />
    </section>
  )
}
