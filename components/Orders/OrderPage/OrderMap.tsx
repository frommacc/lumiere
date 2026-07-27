'use client'

import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { GoogleMapsProvider } from '@/components/providers/google-maps-provider'

interface OrderMapProps {
  address?: string | null
  latitude?: number | null
  longitude?: number | null
}

export function OrderMap(props: OrderMapProps) {
  return (
    <GoogleMapsProvider>
      <OrderMapContent {...props} />
    </GoogleMapsProvider>
  )
}

function OrderMapContent({ latitude, longitude }: OrderMapProps) {
  // Подразбирливи координати за Скопје (ако нема внесено конкретни)
  const defaultPosition = { lat: 41.9981, lng: 21.4254 }

  const position =
    latitude && longitude ? { lat: latitude, lng: longitude } : defaultPosition

  return (
    <section className='w-full h-90 md:h-100 mt-12 rounded-lg overflow-hidden border border-border/30 bg-card relative shadow-sm'>
      <Map
        defaultCenter={position}
        defaultZoom={16}
        gestureHandling={'cooperative'}
        disableDefaultUI={false}
        mapId={'restaurant_order_map'} // Потребно за AdvancedMarker
        className='w-full h-full'
      >
        {/* Црвен Маркер на точната локација */}
        {latitude && longitude && (
          <AdvancedMarker position={position}>
            <Pin
              background={'#e11d48'} // Примарна црвена боја за маркерот
              borderColor={'#9f1239'}
              glyphColor={'#ffffff'}
            />
          </AdvancedMarker>
        )}
      </Map>
    </section>
  )
}
