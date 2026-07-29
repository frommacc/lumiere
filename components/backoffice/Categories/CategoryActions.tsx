'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSavedAction } from '@/hooks/use-saved-action'
import CategoryEditor from './CategoryEditor'
import { Category } from '@/lib/generated/prisma'
import { deleteCategoryAction } from '@/actions/backoffice/categories'

export default function CategoryActions({ category }: { category: Category }) {
  const { pending: isDeleting, run: runDelete } = useSavedAction()
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0 hover:bg-surface-container'
          >
            <span className='sr-only'>Отвори мени</span>
            <MoreHorizontal className='h-4 w-4 text-on-surface-variant' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-48 bg-surface-container text-on-surface'
        >
          <DropdownMenuLabel>Акции</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Акција: Измени */}
          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
            className='cursor-pointer'
          >
            <Pencil className='mr-2 size-4 text-on-surface-variant' />
            <span>Измени</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Акција: Избриши */}
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => {
              if (window.confirm('Да ја избришам категоријата?')) {
                runDelete(() => deleteCategoryAction(category.id))
              }
            }}
            className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
          >
            <Trash2 className='mr-2 size-4' />
            <span>Избриши</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Форма за измена контролирана од Dropdown менито */}
      <CategoryEditor
        category={category}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  )
}
