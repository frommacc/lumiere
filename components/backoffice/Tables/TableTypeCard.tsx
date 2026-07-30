'use client'

import { useTransition } from 'react'
import { MoreVertical, Pencil, Trash2, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableTypeModal } from './TableTypeModal'
import { deleteTableTypeAction } from '@/actions/backoffice/tables'

type TableTypeCardProps = {
  type: {
    id: string
    name: string
    slug: string
    description?: string | null
    _count: {
      tables: number
    }
  }
}

export function TableTypeCard({ type }: TableTypeCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (type._count.tables > 0) {
      toast.error(
        'Не можете да го избришете типот бидејќи содржи активни маси.',
      )
      return
    }

    if (
      !confirm(
        `Дали сте сигурни дека сакате да го избришете типот "${type.name}"?`,
      )
    ) {
      return
    }

    startTransition(async () => {
      const result = await deleteTableTypeAction(type.id)

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
          <p className='font-medium text-lg'>{type.name}</p>
          <p className='mt-1 text-xs font-mono text-on-surface-variant'>
            slug: {type.slug}
          </p>
        </div>

        {/* Брзи акции за менаџирање */}
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
            <TableTypeModal
              initialData={{
                id: type.id,
                name: type.name,
                slug: type.slug,
                description: type.description,
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

      <p className='mt-3 text-sm text-on-surface-variant'>
        {type.description || 'Нема опис.'}
      </p>

      <div className='mt-4 border-t border-outline-variant/15 pt-3 text-xs font-medium text-primary'>
        {type._count.tables} {type._count.tables === 1 ? 'маса' : 'маси'}
      </div>
    </article>
  )
}
