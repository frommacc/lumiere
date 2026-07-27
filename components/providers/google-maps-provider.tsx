'use client'

import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

// Важно: Поставено надвор од компонентата за да го спречи непотребниот re-render
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
      libraries={LIBRARIES} // 👈 Мора да се додаде ова!
    >
      {children}
    </APIProvider>
  )
}
