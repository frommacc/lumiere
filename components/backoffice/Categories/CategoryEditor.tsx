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

export default function CategoryEditor({
  category,
  open: externalOpen,
  onOpenChange: setExternalOpen,
}: {
  category?: Category
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { pending, run } = useSavedAction()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = isControlled ? setExternalOpen : setInternalOpen

  // Состојби за формата
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')

  // Помошна функција за автоматско генерирање на slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!category) {
      // Само за нови категории креирај slug автоматски
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
              <Plus className='size-3.5' />
            )}
            {category ? 'Измени' : 'Нова категорија'}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Измени категорија' : 'Нова категорија'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className='grid gap-4'>
          {/* Име */}
          <div className='space-y-2'>
            <Label htmlFor='category-name'>Име</Label>
            <Input
              id='category-name'
              name='name'
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          {/* Слаг (Slug) & Редослед во два редa */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='category-slug'>Слаг (Slug)</Label>
              <Input
                id='category-slug'
                name='slug'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category-order'>Редослед</Label>
              <Input
                id='category-order'
                name='displayOrder'
                type='number'
                defaultValue={category?.displayOrder ?? 0}
                required
              />
            </div>
          </div>

          {/* Слика за категоријата */}
          <ImageUploadField
            label='Слика на категорија'
            currentImage={category?.image}
            value={imageFile}
            fallback={category?.name?.slice(0, 2).toUpperCase() ?? 'КАТ'}
            onChange={setImageFile}
            disabled={pending}
          />

          {/* Опис */}
          <div className='space-y-2'>
            <Label htmlFor='category-description'>Опис</Label>
            <Textarea
              id='category-description'
              name='description'
              defaultValue={category?.description ?? ''}
              className='min-h-20 resize-y'
            />
          </div>

          {/* Копче за зачувување */}
          <Button disabled={pending} type='submit' className='mt-2'>
            {pending ? (
              <LoaderCircle className='size-4 animate-spin mr-2' />
            ) : null}
            Зачувај
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
