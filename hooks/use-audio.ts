'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export function useAudio(defaultSoundUrl = '/sounds/kds-alarm.mp3') {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const soundEnabledRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Синхронизација на Ref за да нема stale state во Pusher callback
  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  // Пуштање звук кога ќе пристигне нова нарачка
  const playSound = useCallback(() => {
    if (!soundEnabledRef.current || !audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.play().catch((err) => {
      console.warn('Аудиото не можеше да се репродуцира:', err)
    })
  }, [])

  // Вклучување / Исклучување на звукот
  const toggleSound = useCallback(async () => {
    if (!soundEnabled) {
      // Иницијализирај Audio инстанца доколку сè уште не постои
      if (!audioRef.current) {
        audioRef.current = new Audio(defaultSoundUrl)
      }

      try {
        // Ова е потребниот "User Interaction Gesture" за да го отклучиме звукот во прелистувачот
        await audioRef.current.play()
        setSoundEnabled(true)
      } catch (error) {
        console.error('Грешка при активирање на звукот:', error)
        setSoundEnabled(false)
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setSoundEnabled(false)
    }
  }, [soundEnabled, defaultSoundUrl])

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return { soundEnabled, toggleSound, playSound }
}
