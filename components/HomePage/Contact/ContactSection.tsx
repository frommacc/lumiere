import ContactForm from './ContactForm'
import ContactMap from './ContactMap'

export default function ContactSection() {
  return (
    <section
      className='py-24 lg:py-32 bg-surface border-t border-outline-variant/20'
      id='contact'
    >
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24'>
          <ContactForm />
          <ContactMap />
        </div>
      </div>
    </section>
  )
}
