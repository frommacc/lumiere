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
import SubcategoryEditor from './SubcategoryEditor'
import { deleteSubcategoryAction } from '@/actions/backoffice/subcategories'
import { SubcategoryWithRelations } from '@/types/categories'
import { Category } from '@/lib/generated/prisma'

interface SubcategoryActionsProps {
  subcategory: SubcategoryWithRelations
  categories: Pick<Category, 'id' | 'name'>[]
}

export default function SubcategoryActions({
  subcategory,
  categories,
}: SubcategoryActionsProps) {
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
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4 text-on-surface-variant' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-48 bg-surface-container text-on-surface'
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
            className='cursor-pointer'
          >
            <Pencil className='mr-2 size-4 text-on-surface-variant' />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => {
              if (window.confirm('Delete subcategory?')) {
                runDelete(() => deleteSubcategoryAction(subcategory.id))
              }
            }}
            className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
          >
            <Trash2 className='mr-2 size-4' />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SubcategoryEditor
        subcategory={subcategory}
        categories={categories}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  )
}
