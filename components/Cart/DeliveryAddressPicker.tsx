'use client'

import { useEffect } from 'react'
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'

interface DeliveryAddressPickerProps {
  coords: { lat: number; lng: number } | null
  onCoordsChange: (lat: number, lng: number) => void
}

// Helper component for synchronizing the center of the map with the new coordinates
function MapController({ coords }: { coords: { lat: number; lng: number } }) {
  const map = useMap()

  useEffect(() => {
    if (map && coords) {
      map.panTo(coords)
    }
  }, [map, coords])

  return null
}

export function DeliveryAddressPicker({
  coords,
  onCoordsChange,
}: DeliveryAddressPickerProps) {
  if (!coords) return null

  return (
    <div className='w-full h-56 mt-3 rounded-md overflow-hidden border border-border/40 relative group'>
      <Map
        defaultCenter={coords}
        defaultZoom={16}
        // 'greedy' allows dragging the map with 1 finger on mobile and direct drag on desktop
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        // We enable basic controls for a better user experience
        zoomControl={true}
        mapId={'delivery_address_picker'}
        className='w-full h-full'
      >
        <MapController coords={coords} />

        <AdvancedMarker
          position={coords}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              onCoordsChange(e.latLng.lat(), e.latLng.lng())
            }
          }}
        >
          <Pin
            background={'#e11d48'}
            borderColor={'#9f1239'}
            glyphColor={'#ffffff'}
          />
        </AdvancedMarker>
      </Map>

      <div className='absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-xs text-[10px] text-muted-foreground px-2 py-1 rounded-xs text-center border border-border/30 pointer-events-none z-10'>        💡 You can drag the map or move the pin right over yours
        entry
      </div>
    </div>
  )
}
