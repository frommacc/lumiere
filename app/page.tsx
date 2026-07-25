import AboutUs from '@/components/HomePage/AboutUs'
import ContactSection from '@/components/HomePage/Contact/ContactSection'
import Hero from '@/components/HomePage/Hero'
import Specialties from '@/components/HomePage/Specialties/Specialties'
import Testimonials from '@/components/HomePage/Testimonials/Testimonials'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className=''>
      <Hero />
      <Suspense fallback='Loading...'>
        <Specialties />
      </Suspense>
      <AboutUs />
      <Testimonials />
      <ContactSection />
    </main>
  )
}
