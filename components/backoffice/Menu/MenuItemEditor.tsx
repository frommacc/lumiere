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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useSavedAction } from '@/hooks/use-saved-action'
import { MenuItem } from '@/lib/generated/prisma'
import { ImageUploadField } from '@/components/shared/ImageUploadField'
import { saveMenuItemAction } from '@/actions/backoffice/menu-items'

export default function MenuItemEditor({
  item,
  categories,
  open: externalOpen,
  onOpenChange: setExternalOpen,
}: {
  item?: MenuItem
  categories: { id: string; name: string }[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { pending, run } = useSavedAction()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = isControlled ? setExternalOpen : setInternalOpen

  // Состојби за формата
  const [categoryId, setCategoryId] = useState(
    item?.categoryId ?? categories[0]?.id ?? '',
  )
  const [imageFile, setImageFile] = useState<File | undefined>()

  // Состојби за булови знаменца (за Radix Checkbox)
  const [flags, setFlags] = useState({
    isAvailable: item?.isAvailable ?? true,
    isPopular: item?.isPopular ?? false,
    isExclusive: item?.isExclusive ?? false,
    isSpecial: item?.isSpecial ?? false,
  })

  const handleCheckboxChange = (key: keyof typeof flags, checked: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: checked }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    if (imageFile) {
      form.set('imageFile', imageFile)
    }

    run(
      () =>
        saveMenuItemAction({
          id: item?.id,
          name: form.get('name') as string,
          description: form.get('description') as string,
          price: Number(form.get('price')),
          image: item?.image ?? null, // Постоечки URL
          imageId: item?.imageId ?? null, // Постоечки Cloudinary ID (додадено)
          imageFile: imageFile, // Новиот File
          categoryId,
          isPopular: flags.isPopular,
          isExclusive: flags.isExclusive,
          isSpecial: flags.isSpecial,
          isAvailable: flags.isAvailable,
        }),
      () => {
        setImageFile?.(undefined)
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
            variant={item ? 'ghost' : 'default'}
            disabled={!categories.length}
          >
            {item ? (
              <Pencil className='size-3.5' />
            ) : (
              <Plus className='size-3.5' />
            )}
            {item ? 'Измени' : 'Нов артикл'}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{item ? 'Уреди артикл' : 'Нов артикл'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className='grid gap-5 sm:gap-8 sm:grid-cols-2'>
          {/* Име */}
          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='item-name'>Име</Label>
            <Input
              id='item-name'
              name='name'
              defaultValue={item?.name}
              required
            />
          </div>

          {/* Категорија */}
          <div className='space-y-2'>
            <Label>Категорија</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Избери категорија' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Цена */}
          <div className='space-y-2'>
            <Label htmlFor='item-price'>Цена (МКД)</Label>
            <Input
              id='item-price'
              name='price'
              type='number'
              step='0.01'
              defaultValue={item?.price}
              required
            />
          </div>

          {/* Custom Image Upload Component */}
          <div className='sm:col-span-2'>
            <ImageUploadField
              label='Слика на артикл'
              currentImage={item?.image}
              value={imageFile}
              fallback={item?.name?.slice(0, 2).toUpperCase() ?? 'МЕ'}
              onChange={setImageFile}
              disabled={pending}
            />
          </div>

          {/* Опис */}
          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='item-description'>Опис</Label>
            <Textarea
              id='item-description'
              name='description'
              defaultValue={item?.description ?? ''}
              required
              className='min-h-24 resize-y'
            />
          </div>

          {/* Опции (Чекбоксови со Shadcn UI) */}
          <div className='sm:col-span-2 flex flex-wrap gap-x-6 gap-y-3 pt-2'>
            {[
              { id: 'isAvailable', label: 'Достапно', key: 'isAvailable' },
              { id: 'isPopular', label: 'Популарно', key: 'isPopular' },
              { id: 'isExclusive', label: 'Ексклузивно', key: 'isExclusive' },
              { id: 'isSpecial', label: 'Специјалитет', key: 'isSpecial' },
            ].map(({ id, label, key }) => (
              <div key={id} className='flex items-center space-x-2'>
                <Checkbox
                  id={id}
                  checked={flags[key as keyof typeof flags]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      key as keyof typeof flags,
                      Boolean(checked),
                    )
                  }
                />
                <Label
                  htmlFor={id}
                  className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>

          {/* Копче за зачувување */}
          <Button
            disabled={pending || !categoryId}
            type='submit'
            className='sm:col-span-2 mt-2'
          >
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
