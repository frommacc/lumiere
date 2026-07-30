'use client'

import { FormEvent, useState, useTransition } from 'react'
import { LoaderCircle, Plus, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { saveTableTypeAction } from '@/actions/backoffice/tables'

type TableTypeData = {
  id: string
  name: string
  slug: string
  description?: string | null
}

type TableTypeModalProps = {
  initialData?: TableTypeData
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TableTypeModal({
  initialData,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: TableTypeModalProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const isEditing = Boolean(initialData?.id)
  const isOpen = externalOpen ?? internalOpen
  const setIsOpen = externalOnOpenChange ?? setInternalOpen

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await saveTableTypeAction({
        id: initialData?.id,
        name: form.get('name'),
        slug: form.get('slug'),
        description: form.get('description'),
      })

      if (result.success) {
        toast.success(result.message)
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !externalOpen ? (
        <DialogTrigger asChild>
          <Button variant={isEditing ? 'outline' : 'default'}>
            {isEditing ? (
              <>
                <Pencil className='mr-2 size-4' /> Измени тип
              </>
            ) : (
              <>
                <Plus className='mr-2 size-4' /> Додај тип
              </>
            )}
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? `Измени тип: ${initialData?.name}`
              : 'Додај нов тип на маса'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='table-type-name'>Име на тип</Label>
            <Input
              id='table-type-name'
              name='name'
              defaultValue={initialData?.name ?? ''}
              placeholder='Тераса'
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='table-type-slug'>Slug</Label>
            <Input
              id='table-type-slug'
              name='slug'
              defaultValue={initialData?.slug ?? ''}
              placeholder='terasa'
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='table-type-description'>Опис</Label>
            <Input
              id='table-type-description'
              name='description'
              defaultValue={initialData?.description ?? ''}
              placeholder='Отворена тераса'
            />
          </div>

          <div className='flex justify-end pt-2'>
            <Button disabled={pending} type='submit'>
              {pending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
              {isEditing ? 'Зачувај измени' : 'Креирај тип'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
