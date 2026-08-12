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

import { useSavedAction } from '@/hooks/use-saved-action'
import { Category } from '@/lib/generated/prisma'
import { ImageUploadField } from '@/components/shared/ImageUploadField'
import { saveCategoryAction } from '@/actions/backoffice/categories'
import { Switch } from '@/components/ui/switch'

export default function CategoryEditor({
  category,
  open: externalOpen,
  onOpenChange: setExternalOpen,
}: {
  category?: Category
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { pending, running } = useSavedAction()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = isControlled ? setExternalOpen : setInternalOpen

  // States for the form
  const [ imageFile , setImageFile ] = useState<File | undefined>()
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [isPublished, setIsPublished] = useState<boolean>(
    category?.isPublished ?? true,
  )

  // Helper function for automatic slug generation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!category) {
      // Only for new categories create slug automatically
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      )
    }
  }

  const submit = ( event : FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    if (imageFile) {
      form.set('imageFile', imageFile)
    }

    run(
      () =>
        saveCategoryAction({
          id: category?.id,
          name: form.get('name') as string,
          slug: form.get('slug') as string,
          description: form.get('description') as string,
          displayOrder: Number(form.get('displayOrder')),
          isPublished: isPublished,
          image: category?.image ?? null,
          imageFile: imageFile,
        }),
      () => {
        setImageFile(undefined)
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
            variant={category ? 'ghost' : 'outline'}
          >
            {category ? (
              <Pencil className='size-3.5' />
            ) : (
              <Plus className='size-3.5' />            )}
            {category ? 'Edit' : 'New Category'}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>            {category ? 'Edit Category' : 'New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className='grid gap-4'>          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='category-name'>Name</Label>
            <Input
              id='category-name'
              name='name'
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>          {/* Slug & Order in two lines */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='category-slug'>Slug</Label>
              <Input
                id='category-slug'
                name='slug'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category-order'>Order</Label>
              <Input
                id='category-order'
                name='displayOrder'
                type='number'
                defaultValue={category?.displayOrder ?? 0}
                required
              />
            </div>
          </div>          {/* Image for category */}
          <ImageUploadField
            label='Category image'
            currentImage={category?.image}
            value={imageFile}
            fallback={category?.name?.slice(0, 2).toUpperCase() ?? 'CAT'}
            onChange={setImageFile}
            disabled={pending}
          />          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='category-description'>Description</Label>
            <Textarea
              id='category-description'
              name='description'
              defaultValue={category?.description ?? ''}
              className='min-h-20 resize-y'
            />
          </div>          {/* Status (isPublished Switch) */}
          <div className='flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface-container-low p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <Label
                htmlFor='category-published'
                className='text-sm font-medium'
              >                Published category
              </Label>
              <p className='text-xs text-muted-foreground'>                If disabled, the category will not be visible on the menu.
              </p>
            </div>
            <Switch
              id='category-published'
              checked={isPublished}
              onCheckedChange={setIsPublished}
              disabled={pending}
            />
          </div>          {/* Save button */}
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
