'use client'

import React from 'react'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import { useApiIsLoaded } from '@vis.gl/react-google-maps'
import { MapPin } from 'lucide-react'

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string, lat?: number, lng?: number) => void
  disabled?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  disabled = false,
}: AddressAutocompleteProps) {
  const isApiLoaded = useApiIsLoaded()

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    // Иницијализирај само откако APIProvider ќе ја вчита Google Maps скриптата
    initOnMount: isApiLoaded,
    requestOptions: {
      componentRestrictions: { country: 'mk' },
      language: 'mk',
    },
    debounce: 300,
    defaultValue: value,
  })

  const handleSelect = async (description: string) => {
    setValue(description, false)
    clearSuggestions()

    try {
      const results = await getGeocode({ address: description })
      const { lat, lng } = await getLatLng(results[0])

      onChange(description, lat, lng)
    } catch (error) {
      console.error('Error fetching geocode:', error)
      onChange(description)
    }
  }

  return (
    <div className='relative group w-full'>
      <label className='text-[10px] text-outline uppercase mb-1 block font-semibold'>
        Адреса за Достава{' '}
        <span className='ml-1 text-[8px] text-muted-foreground'>(Скопје)</span>
      </label>

      <input
        type='text'
        required
        disabled={!ready || disabled}
        value={inputValue || value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder='Започни да пишуваш улица...'
        className='w-full bg-transparent border-b border-outline-variant/50 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm disabled:opacity-50'
      />

      {status === 'OK' && data.length > 0 && (
        <ul className='absolute z-50 left-0 right-0 mt-1 bg-card border border-border/40 rounded-xs shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-border/20'>
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className='px-4 py-3 hover:bg-primary/10 cursor-pointer flex items-center gap-3 text-xs text-foreground transition-colors'
            >
              <MapPin className='w-4 h-4 text-primary shrink-0' />
              <span>{description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
