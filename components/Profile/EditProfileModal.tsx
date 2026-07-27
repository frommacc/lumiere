'use client'

import { useSession } from '@/lib/auth-client'
import { useEditProfileStore } from '@/store/useEditProfileStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EditProfileForm } from './EditProfileForm'

export function EditProfileModal() {
  const { data: session, isPending, refetch } = useSession()
  const isOpen = useEditProfileStore((state) => state.isOpen)
  const close = useEditProfileStore((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface p-6 sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='font-display normal-case tracking-normal text-2xl text-on-surface'>
            Уреди профил
          </DialogTitle>
          <DialogDescription>
            Ажурирајте ги основните податоци и профилната слика.
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className='space-y-4 animate-pulse'>
            <div className='h-28 rounded-xl bg-surface-container-high' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='h-12 rounded bg-surface-container-high' />
              <div className='h-12 rounded bg-surface-container-high' />
            </div>
          </div>
        ) : session?.user ? (
          <EditProfileForm
            user={session.user}
            onSuccess={async () => {
              await refetch()
              close()
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
