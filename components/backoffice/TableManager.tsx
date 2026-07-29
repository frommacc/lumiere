'use client'

import { FormEvent, useState, useTransition } from 'react'
import { LoaderCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { saveTableAction, saveTableTypeAction } from '@/actions/backoffice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type TableTypeOption = { id: string; name: string }

export function TableManager({ tableTypes }: { tableTypes: TableTypeOption[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [tableTypeId, setTableTypeId] = useState(tableTypes[0]?.id ?? '')

  const submitTable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await saveTableAction({
        number: form.get('number'),
        capacity: form.get('capacity'),
        tableTypeId,
      })
      if (result.success) toast.success(result.message)
      else toast.error(result.message)
      if (result.success) {
        event.currentTarget.reset()
        router.refresh()
      }
    })
  }

  const submitType = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await saveTableTypeAction({ name: form.get('name'), slug: form.get('slug'), description: form.get('description') })
      if (result.success) toast.success(result.message)
      else toast.error(result.message)
      if (result.success) {
        event.currentTarget.reset()
        router.refresh()
      }
    })
  }

  return (
    <div className='grid gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-5 xl:grid-cols-2'>
      <form onSubmit={submitTable} className='grid gap-3 sm:grid-cols-[1fr_7rem_1fr_auto] sm:items-end'>
        <div className='space-y-1.5'><Label htmlFor='table-number'>Broj na masa</Label><Input id='table-number' name='number' placeholder='M11' required /></div>
        <div className='space-y-1.5'><Label htmlFor='table-capacity'>Kapacitet</Label><Input id='table-capacity' name='capacity' type='number' min='1' max='30' placeholder='4' required /></div>
        <div className='space-y-1.5'><Label>Tip</Label><Select value={tableTypeId} onValueChange={setTableTypeId}><SelectTrigger><SelectValue placeholder='Izberi tip' /></SelectTrigger><SelectContent>{tableTypes.map((type) => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}</SelectContent></Select></div>
        <Button disabled={pending || !tableTypeId} type='submit'>{pending ? <LoaderCircle className='size-4 animate-spin' /> : <Plus className='size-4' />}Masa</Button>
      </form>
      <form onSubmit={submitType} className='grid gap-3 sm:grid-cols-[1fr_1fr_1.3fr_auto] sm:items-end'>
        <div className='space-y-1.5'><Label htmlFor='table-type-name'>Tip na masa</Label><Input id='table-type-name' name='name' placeholder='Terasa' required /></div>
        <div className='space-y-1.5'><Label htmlFor='table-type-slug'>Slug</Label><Input id='table-type-slug' name='slug' placeholder='terasa' required /></div>
        <div className='space-y-1.5'><Label htmlFor='table-type-description'>Opis</Label><Input id='table-type-description' name='description' placeholder='Otvorena terasa' /></div>
        <Button disabled={pending} type='submit' variant='outline'>{pending ? <LoaderCircle className='size-4 animate-spin' /> : <Plus className='size-4' />}Tip</Button>
      </form>
    </div>
  )
}
