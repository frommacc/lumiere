'use client'

import { FormEvent, useState, useTransition } from 'react'
import { LoaderCircle, Plus, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { saveTableAction } from '@/actions/backoffice/tables'

type TableTypeOption = { id: string; name: string }

type TableData = {
  id: string
  number: string
  capacity: number
  tableTypeId: string
}

type TableModalProps = {
  tableTypes: TableTypeOption[]
  initialData?: TableData
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TableModal({
  tableTypes,
  initialData,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: TableModalProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const isEditing = Boolean(initialData?.id)
  const isOpen = externalOpen ?? internalOpen
  const setIsOpen = externalOnOpenChange ?? setInternalOpen

  // Calculation of the implied value directly without useEffect
  const defaultTypeId = initialData?.tableTypeId ?? tableTypes[0]?.id ?? ''

  // States to keep track of the selected type and the prop we got
  const [prevInitialTypeId, setPrevInitialTypeId] = useState(
    initialData?.tableTypeId,
  )
  const [tableTypeId, setTableTypeId] = useState(defaultTypeId)

  // Synchronization during rendering: If initialData changes to another object, we update the state
  if (initialData?.tableTypeId !== prevInitialTypeId) {
    setPrevInitialTypeId(initialData?.tableTypeId)
    setTableTypeId(initialData?.tableTypeId ?? tableTypes[0]?.id ?? '')
  }

  const handleSubmit = ( event : FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await saveTableAction({
        id: initialData?.id,
        number: form.get('number'),
        capacity: form.get('capacity'),
        tableTypeId,
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
                <Pencil className='mr-2 size-4' /> Change table
              </>
            ) : (
              <>
                <Plus className='mr-2 size-4' /> Add a table
              </>
            )}
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? `Modify table: ${initialData?.number}`
              : 'Add new table'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='table-number'>Table number</Label>
            <Input
              id='table-number'
              name='number'
              defaultValue={initialData?.number ?? ''}
              placeholder='M11'
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='table-capacity'>Capacity (seats)</Label>
            <Input
              id='table-capacity'
              name='capacity'
              type='number'
              min='1'
              max='30'
              defaultValue={initialData?.capacity ?? ''}
              placeholder='4'
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label>Table type</Label>
            <Select value={tableTypeId} onValueChange={setTableTypeId}>
              <SelectTrigger>
                <SelectValue placeholder='Choose a type' />
              </SelectTrigger>
              <SelectContent>
                {tableTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end pt-2'>
            <Button disabled={pending || !tableTypeId} type='submit'>
              {pending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
              {isEditing ? 'Save Changes' : 'Create Table'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
