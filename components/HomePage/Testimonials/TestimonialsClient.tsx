'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ReviewWithUser } from '@/types/review'

interface TestimonialsClientProps {
  reviews: ReviewWithUser[]
}

export default function TestimonialsClient({
  reviews,
}: TestimonialsClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  if (!reviews || reviews.length === 0) {
    return null
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const currentReview = reviews[currentIndex]

  // Слика по подразбирање доколку корисникот нема слика во базата
  const avatarUrl =
    currentReview.user.image ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'

  return (
    <div className='relative min-h-95 flex flex-col justify-between'>
      <Quote
        size={40}
        className='text-primary/15 absolute -top-8 -left-2 md:-left-8'
      />

      <AnimatePresence mode='wait' custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 50 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className='text-center space-y-8 py-4'
        >
          {/* Stars rating */}
          <div className='flex justify-center text-primary gap-1'>
            {Array.from({ length: currentReview.rating }).map((_, i) => (
              <Star
                key={i}
                size={18}
                fill='currentColor'
                className='text-primary'
              />
            ))}
          </div>

          {/* Review Text */}
          <blockquote className='font-display text-xl md:text-3xl italic text-on-surface max-w-4xl mx-auto leading-relaxed'>
            &quot;{currentReview.text}&quot;
          </blockquote>

          {/* Guest Profile */}
          <div className='flex flex-col items-center'>
            <Image
              className='w-16 h-16 rounded-full object-cover mb-4 border border-outline-variant/30 grayscale shadow-md'
              src={avatarUrl}
              alt={currentReview.user.name}
              width={64}
              height={64}
            />
            <p className='font-sans text-xs uppercase tracking-widest font-bold text-on-surface'>
              {currentReview.user.name}
            </p>
            <p className='font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mt-1'>
              {currentReview.role}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className='flex justify-center gap-4 mt-8'>
        <button
          onClick={handlePrev}
          className='w-12 h-12 border border-outline-variant/30 rounded-full flex items-center justify-center text-on-surface hover:text-primary hover:border-primary hover:bg-primary/5 active:scale-90 transition-all duration-300'
          aria-label='Претходна препорака'
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className='w-12 h-12 border border-outline-variant/30 rounded-full flex items-center justify-center text-on-surface hover:text-primary hover:border-primary hover:bg-primary/5 active:scale-90 transition-all duration-300'
          aria-label='Следна препорака'
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
