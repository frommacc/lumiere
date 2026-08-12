'use client'

import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

// Important: Placed outside the component to prevent unnecessary re-rendering
const LIBRARIES: ('places' | 'geometry' | 'drawing' | 'visualization')[] = [
  'places',
]

export function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  return (
    <APIProvider
      apiKey={apiKey}
      language='mk'
      region='MK'
      libraries={LIBRARIES} // 👈 Must add this!
    >
      {children}
    </APIProvider>
  )
}
