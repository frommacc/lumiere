import { cacheLife, cacheTag } from 'next/cache'
import TestimonialsClient from './TestimonialsClient'
import { getReviews } from '@/lib/db/reviews.services'
import { ReviewButton } from '@/components/Reviews/ReviewButton'

export default async function Testimonials() {
  'use cache'
  cacheLife('weeks')
  cacheTag('reviews')

  const reviews = await getReviews()

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
          <div className='mt-6 flex justify-center'>
            <ReviewButton compact />
          </div>
        </div>

        {reviews.length ? (
          <TestimonialsClient reviews={reviews} />
        ) : (
          <p className='text-center text-sm text-on-surface-variant'>
            Сè уште нема одобрени reviews. Бидете први што ќе сподели искуство.
          </p>
        )}
      </div>
    </section>
  )
}
