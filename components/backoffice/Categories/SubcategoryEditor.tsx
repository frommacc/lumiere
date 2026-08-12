'use client'

import { FormEvent, useState } from 'react'
import { LoaderCircle, Pencil, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useSavedAction } from '@/hooks/use-saved-action'
import { saveSubcategoryAction } from '@/actions/backoffice/subcategories'
import { SubcategoryWithRelations } from '@/types/categories'
import { Category } from '@/lib/generated/prisma'
import { Switch } from '@/components/ui/switch'

interface SubcategoryEditorProps {
  subcategory?: SubcategoryWithRelations
  categories: Pick<Category, 'id' | 'name'>[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function SubcategoryEditor({
  subcategory,
  categories,
  open: externalOpen,
  onOpenChange: setExternalOpen,
}: SubcategoryEditorProps) {
  const { pending, run } = useSavedAction()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = isControlled ? setExternalOpen : setInternalOpen

  const [categoryId, setCategoryId] = useState(
    subcategory?.categoryId ?? categories[0]?.id ?? '',
  )
  const [name, setName] = useState(subcategory?.name ?? '')
  const [slug, setSlug] = useState(subcategory?.slug ?? '')
  const [isPublished, setIsPublished] = useState<boolean>(
    subcategory?.isPublished ?? true,
  )

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!subcategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      )
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    run(
      () =>
        saveSubcategoryAction({
          id: subcategory?.id,
          categoryId,
          name: form.get('name') as string,
          slug: form.get('slug') as string,
          description: form.get('description') as string,
          displayOrder: Number(form.get('displayOrder')),
          isPublished,
        }),
      () => {
        setOpen?.(false)
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button
            type='button'
            size='sm'
            variant={subcategory ? 'ghost' : 'outline'}
          >
            {subcategory ? (
              <Pencil className='size-3.5' />
            ) : (
              <Plus className='size-3.5' />            )}
            {subcategory ? 'Edit' : 'New SubCategory'}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>            {subcategory ? 'Edit subcategory' : 'New subcategory'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className='grid gap-4'>          {/* Parent Category */}
          <div className='space-y-2'>
            <Label htmlFor='parent-category'>Main Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id='parent-category' className='w-full'>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='subcategory-name'>Name</Label>
            <Input
              id='subcategory-name'
              name='name'
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>          {/* Stack & Order */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='subcategory-slug'>Slug</Label>
              <Input
                id='subcategory-slug'
                name='slug'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='subcategory-order'>Order</Label>
              <Input
                id='subcategory-order'
                name='displayOrder'
                type='number'
                defaultValue={subcategory?.displayOrder ?? 0}
                required
              />
            </div>
          </div>          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='subcategory-description'>Description</Label>
            <Textarea
              id='subcategory-description'
              name='description'
              defaultValue={subcategory?.description ?? ''}
              className='min-h-20 resize-y'
            />
          </div>          {/* Status (isPublished Switch) */}
          <div className='flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface-container-low p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <Label
                htmlFor='subcategory-published'
                className='text-sm font-medium'
              >                Published subcategory
              </Label>
              <p className='text-xs text-muted-foreground'>                If disabled, the subcategory will not be visible on
                the menu.
              </p>
            </div>
            <Switch
              id='subcategory-published'
              checked={isPublished}
              onCheckedChange={setIsPublished}
              disabled={pending}
            />
          </div>

          <Button disabled={pending} type='submit' className='mt-2'>
            {pending ? (
              <LoaderCircle className='size-4 animate-spin mr-2' />            ) : null}
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
