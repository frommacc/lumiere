'use client'

import { useTransition } from 'react'
import { Users, MoreVertical, Pencil, Trash2, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableModal } from './TableModal'
import { deleteTableAction } from '@/actions/backoffice/tables'

type TableTypeOption = { id: string; name: string }

type TableCardProps = {
  table: {
    id: string
    number: string
    capacity: number
    tableTypeId: string
    tableType: {
      name: string
    }
  }
  tableTypes?: TableTypeOption[]
}

export function TableCard({ table, tableTypes = [] }: TableCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (
      !confirm(
        `Дали сте сигурни дека сакате да ја избришете масата ${table.number}?`,
      )
    ) {
      return
    }

    startTransition(async () => {
      const result = await deleteTableAction(table.id)

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <article className='flex flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-5 transition-all hover:border-outline-variant/40'>
      <div className='flex items-start justify-between'>
        <div>
          <span className='rounded-md bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-on-surface-variant'>
            {table.tableType.name}
          </span>
          <p className='mt-2 font-display text-3xl font-bold'>{table.number}</p>
        </div>

        {/* Брзи акции за Менаџирање */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className='size-4 animate-spin' />
              ) : (
                <MoreVertical className='size-4' />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <TableModal
              tableTypes={tableTypes}
              initialData={{
                id: table.id,
                number: table.number,
                capacity: table.capacity,
                tableTypeId: table.tableTypeId,
              }}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className='mr-2 size-4' /> Измени
                </DropdownMenuItem>
              }
            />

            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className='mr-2 size-4' /> Избриши
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='mt-6 flex items-center gap-1.5 text-xs text-on-surface-variant border-t border-outline-variant/15 pt-3'>
        <Users className='size-4 text-primary' />
        <span>
          Капацитет:{' '}
          <strong className='text-foreground'>{table.capacity}</strong> лица
        </span>
      </div>
    </article>
  )
}
