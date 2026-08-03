'use client'

import { useState } from 'react'
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

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
import MenuItemEditor, {
  CategoryWithSubcategories,
  MenuItemWithRelationsData,
} from './MenuItemEditor'
import {
  deleteMenuItemAction,
  toggleMenuItemAvailabilityAction,
} from '@/actions/backoffice/menu-items'

export default function MenuItemActions({
  item,
  categories,
}: {
  item: MenuItemWithRelationsData
  categories: CategoryWithSubcategories[]
}) {
  const { pending: isDeleting, run: runDelete } = useSavedAction()
  const { pending: isToggling, run: runToggle } = useSavedAction()
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

          <DropdownMenuItem
            disabled={isToggling}
            onClick={() =>
              runToggle(() =>
                toggleMenuItemAvailabilityAction(item.id!, !item.isAvailable),
              )
            }
            className='cursor-pointer'
          >
            {item.isAvailable ? (
              <>
                <EyeOff className='mr-2 size-4 text-on-surface-variant' />
                <span>Повлечи</span>
              </>
            ) : (
              <>
                <Eye className='mr-2 size-4 text-emerald-400' />
                <span>Објави</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
            className='cursor-pointer'
          >
            <Pencil className='mr-2 size-4 text-on-surface-variant' />
            <span>Измени</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => {
              if (window.confirm('Да го избришам артиклот?')) {
                runDelete(() => deleteMenuItemAction(item.id!))
              }
            }}
            className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
          >
            <Trash2 className='mr-2 size-4' />
            <span>Избриши</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MenuItemEditor
        item={item}
        categories={categories}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  )
}
