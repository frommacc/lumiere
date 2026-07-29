'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Camera, ImageIcon, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImageUploadFieldProps {
  value?: File
  currentImage?: string | null
  fallback: string
  label?: string
  error?: string
  disabled?: boolean
  onChange: (file: File | undefined) => void
}

export function ImageUploadField({
  value,
  currentImage,
  fallback,
  label = 'Профилна слика',
  error,
  disabled = false,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const setFile = (file: File | undefined) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)

    const nextPreviewUrl = file ? URL.createObjectURL(file) : undefined
    previewUrlRef.current = nextPreviewUrl
    setPreviewUrl(nextPreviewUrl)
    onChange(file)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0])
    event.target.value = ''
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant'>
            {label}
          </p>
          <p className='mt-1 text-xs text-outline'>
            JPG, PNG или WebP · до 5 MB
          </p>
        </div>
        {value && (
          <Button
            type='button'
            variant='ghost'
            size='xs'
            disabled={disabled}
            onClick={() => setFile(undefined)}
            className='text-on-surface-variant hover:text-destructive'
          >
            <X />
            Откажи
          </Button>
        )}
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-4'>
        <div className='relative shrink-0 self-start'>
          <div className='relative flex size-24 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-surface-container-high text-primary font-display text-2xl font-semibold'>
            {previewUrl || currentImage ? (
              <Image
                src={previewUrl || currentImage || ''}
                alt={label}
                fill
                sizes='96px'
                className='object-cover'
                unoptimized={Boolean(previewUrl)} // Го заобиколува Next.js оптимизаторот за локални blob preview URL-и
              />
            ) : (
              <span>{fallback}</span>
            )}
          </div>

          {/* Икончето за камера */}
          <span className='absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-surface-container-low'>
            <Camera className='size-3.5' />
          </span>
        </div>

        <div className='min-w-0 flex-1'>
          <p className='text-sm text-on-surface'>
            {value ? value.name : 'Поставете нова слика.'}
          </p>
          <p className='mt-1 text-xs leading-relaxed text-on-surface-variant'>
            Новата слика ќе ја замени претходната по успешно зачувување.
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className='mt-4 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground'
          >
            {currentImage || value ? <ImageIcon /> : <Upload />}
            Избери слика
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        onChange={handleChange}
        disabled={disabled}
        className='sr-only'
      />

      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  )
}
