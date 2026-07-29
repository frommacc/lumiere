'use client'

import { useTransition } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { toggleMenuItemAvailabilityAction } from '@/actions/backoffice'
import { Button } from '@/components/ui/button'

export function MenuAvailabilityToggle({ itemId, isAvailable }: { itemId: string; isAvailable: boolean }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      type='button'
      size='sm'
      variant='outline'
      disabled={pending}
      onClick={() => startTransition(async () => {
        const result = await toggleMenuItemAvailabilityAction(itemId, !isAvailable)
        if (result.success) toast.success(result.message)
        else toast.error(result.message)
        if (result.success) router.refresh()
      })}
    >
      {pending ? <LoaderCircle className='size-3.5 animate-spin' /> : isAvailable ? <EyeOff className='size-3.5' /> : <Eye className='size-3.5' />}
      {isAvailable ? 'Повлечи' : 'Објави'}
    </Button>
  )
}
