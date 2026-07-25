import { cacheLife, cacheTag } from 'next/cache'
import TestimonialsClient from './TestimonialsClient'
import { getReviews } from '@/lib/db/reviews.services'

export default async function Testimonials() {
  'use cache'
  cacheLife('weeks')
  cacheTag('reviews')

  const reviews = await getReviews()

  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <section
      id='reviews'
      className='py-24 px-6 md:px-16 overflow-hidden bg-surface-container-low/40 scroll-mt-20'
    >
      <div className='max-w-5xl mx-auto'>
        {/* Title */}
        <div className='text-center mb-16'>
          <span className='font-sans text-primary text-xs tracking-[0.3em] font-semibold block uppercase mb-3'>
            ИСКУСТВА НА ГОСТИТЕ
          </span>
          <h2 className='font-display text-3xl md:text-5xl text-on-surface font-bold'>
            Осврти од Нашите Посетители
          </h2>
        </div>

        {/* Client Carousel component */}
        <TestimonialsClient reviews={reviews} />
      </div>
    </section>
  )
}
