'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type ActionResult = {
  success: boolean
  message: string
}

export function useSavedAction() {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const run = (operation: () => Promise<ActionResult>, after?: () => void) =>
    startTransition(async () => {
      const result = await operation()
      if (result.success) {
        toast.success(result.message)
        after?.()
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })

  return { pending, run }
}
