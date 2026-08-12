export default function ContactMap() {
  const mapUrl =
    'https://maps.google.com/maps?q=Bul.%20Partizanski%20Odredi%2022,%20Skopje&t=&z=16&ie=UTF8&iwloc=&output=embed'
  return (
    <div className='relative h-125 lg:h-auto min-h-100 bg-surface-container-high overflow-hidden group rounded-lg'>
      <div className='absolute inset-0 grayscale transition-opacity duration-700'>
        <iframe
          src={mapUrl}
          width='100%'
          height='100%'
          style={{ border: 0 }}
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          title='Location on the map'
        />
      </div>

      <div className='absolute inset-0 pointer-events-none border border-outline-variant/20' />

      <div className='absolute bottom-8 left-8 bg-card/80 backdrop-blur-md p-6 border border-outline-variant/30 rounded-md'>
        <p className='font-sans text-primary text-xs font-semibold mb-2 uppercase tracking-wider'>          VISIT US
        </p>
        <p className='text-sm text-foreground'>          Open every day
          <br />
          12:00 - 00:00
        </p>
      </div>
    </div>
  )
}
