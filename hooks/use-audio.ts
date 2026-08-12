'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export function useAudio(defaultSoundUrl = '/sounds/kds-alarm.mp3') {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const soundEnabledRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Synchronization of Ref so that there is no stale state in the Pusher callback
  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  // Play a sound when a new order arrives
  const playSound = useCallback(() => {
    if (!soundEnabledRef.current || !audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.play().catch((err) => {
      console.warn('The audio could not be played:', err)
    })
  }, [])

  // Turn on / off the sound
  const toggleSound = useCallback(async () => {
    if (!soundEnabled) {
      // Initialize an Audio instance if it doesn't already exist
      if (!audioRef.current) {
        audioRef.current = new Audio(defaultSoundUrl)
      }

      try {
        // This is the required "User Interaction Gesture" to unlock the sound in the browser
        await audioRef.current.play()
        setSoundEnabled(true)
      } catch (error) {
        console.error('Error activating sound:', error)
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

  // Cleanup during unmount
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
