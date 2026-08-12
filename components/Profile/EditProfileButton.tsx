'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditProfileStore } from '@/store/useEditProfileStore'

export function EditProfileButton() {
  const open = useEditProfileStore((state) => state.open)

  return (
    <Button
      type='button'
      variant='outline'
      onClick={open}
      className='mt-6 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground'
    >
      <Pencil />      Edit profile
    </Button>
  )
}
