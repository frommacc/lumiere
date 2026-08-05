'use client'

import { FormEvent, useState, useMemo } from 'react'
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
import { ImageUploadField } from '@/components/shared/ImageUploadField'
import { saveMenuItemAction } from '@/actions/backoffice/menu-items'

export interface CategoryWithSubcategories {
  id: string
  name: string
  subcategories: { id: string; name: string }[]
}

export interface MenuItemWithRelationsData {
  id?: string
  name: string
  description: string
  price: number
  image?: string | null
  imageId?: string | null
  categoryId?: string | null
  subcategoryId?: string | null
  isAvailable: boolean
  isOrderable: boolean
  isPopular: boolean
  isExclusive: boolean
  isSpecial: boolean
  ingredients: string[]
  allergens: string[]
  dietary: string[]
  origin?: string | null
  preparation?: string | null
  pairing?: string | null
  subcategory?: { categoryId: string } | null
}

export default function MenuItemEditor({
  item,
  categories,
  open: externalOpen,
  onOpenChange: setExternalOpen,
}: {
  item?: MenuItemWithRelationsData
  categories: CategoryWithSubcategories[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { pending, run } = useSavedAction()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      setExternalOpen?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  // Одредување на почетна категорија
  const initialCategoryId =
    item?.categoryId ?? item?.subcategory?.categoryId ?? categories[0]?.id ?? ''
  const initialSubcategoryId = item?.subcategoryId ?? 'none'

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState(initialSubcategoryId)
  const [imageFile, setImageFile] = useState<File | undefined>()

  const availableSubcategories = useMemo(() => {
    const found = categories.find((c) => c.id === selectedCategoryId)
    return found?.subcategories ?? []
  }, [categories, selectedCategoryId])

  const [flags, setFlags] = useState({
    isAvailable: item?.isAvailable ?? true,
    isOrderable: item?.isOrderable ?? false,
    isPopular: item?.isPopular ?? false,
    isExclusive: item?.isExclusive ?? false,
    isSpecial: item?.isSpecial ?? false,
  })

  const handleCheckboxChange = (key: keyof typeof flags, checked: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: checked }))
  }

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId)
    setSelectedSubcategoryId('none')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const ingredientsRaw = form.get('ingredients') as string
    const allergensRaw = form.get('allergens') as string
    const dietaryRaw = form.get('dietary') as string

    const parseCSV = (val: string) =>
      val
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

    run(
      () =>
        saveMenuItemAction({
          id: item?.id,
          name: form.get('name') as string,
          description: form.get('description') as string,
          price: Number(form.get('price')),
          image: item?.image ?? null,
          imageId: item?.imageId ?? null,
          imageFile,
          categoryId: selectedCategoryId,
          subcategoryId:
            selectedSubcategoryId === 'none' ? null : selectedSubcategoryId,
          isAvailable: flags.isAvailable,
          isOrderable: flags.isOrderable,
          isPopular: flags.isPopular,
          isExclusive: flags.isExclusive,
          isSpecial: flags.isSpecial,
          ingredients: parseCSV(ingredientsRaw),
          allergens: parseCSV(allergensRaw),
          dietary: parseCSV(dietaryRaw),
          origin: (form.get('origin') as string) || null,
          preparation: (form.get('preparation') as string) || null,
          pairing: (form.get('pairing') as string) || null,
        }),
      () => {
        setImageFile(undefined)
        handleOpenChange(false)
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
      <DialogContent className='max-h-[90vh] overflow-y-auto custom-scrollbar border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{item ? 'Уреди артикл' : 'Нов артикл'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className='grid gap-5 sm:gap-6 sm:grid-cols-2'>
          {/* Form Content */}
          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='item-name'>Име</Label>
            <Input
              id='item-name'
              name='name'
              defaultValue={item?.name}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label>Категорија</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={handleCategoryChange}
            >
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

          <div className='space-y-2'>
            <Label>Поткатегорија (Опционално)</Label>
            <Select
              value={selectedSubcategoryId}
              onValueChange={setSelectedSubcategoryId}
              disabled={!availableSubcategories.length}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    availableSubcategories.length
                      ? 'Без поткатегорија'
                      : 'Нема поткатегории'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>Без поткатегорија</SelectItem>
                {availableSubcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='item-price'>Цена (МКД)</Label>
            <Input
              id='item-price'
              name='price'
              type='number'
              step='1'
              defaultValue={item?.price}
              required
            />
          </div>

          <div className='sm:col-span-2'>
            <ImageUploadField
              label='Слика на артикл'
              currentImage={item?.image ?? undefined}
              value={imageFile}
              fallback={item?.name?.slice(0, 2).toUpperCase() ?? 'МЕ'}
              onChange={setImageFile}
              disabled={pending}
            />
          </div>

          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='item-description'>Опис</Label>
            <Textarea
              id='item-description'
              name='description'
              defaultValue={item?.description ?? ''}
              required
              className='min-h-20 resize-y'
            />
          </div>

          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='item-ingredients'>
              Состојки (одвоени со запирка)
            </Label>
            <Input
              id='item-ingredients'
              name='ingredients'
              defaultValue={item?.ingredients?.join(', ') ?? ''}
              placeholder='Домати, Моцарела, Босилек'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='item-allergens'>Алергени (со запирка)</Label>
            <Input
              id='item-allergens'
              name='allergens'
              defaultValue={item?.allergens?.join(', ') ?? ''}
              placeholder='Глутен, Млеко'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='item-dietary'>Ознаки за исхрана (со запирка)</Label>
            <Input
              id='item-dietary'
              name='dietary'
              defaultValue={item?.dietary?.join(', ') ?? ''}
              placeholder='Вегетаријанско, Веганско'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='item-origin'>Потекло</Label>
            <Input
              id='item-origin'
              name='origin'
              defaultValue={item?.origin ?? ''}
              placeholder='Италија / Локално'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='item-pairing'>Препорачана комбинација</Label>
            <Input
              id='item-pairing'
              name='pairing'
              defaultValue={item?.pairing ?? ''}
              placeholder='Црвено вино / Вранец'
            />
          </div>

          <div className='sm:col-span-2 flex flex-wrap gap-x-6 gap-y-3 pt-2'>
            {[
              { id: 'isAvailable', label: 'Достапно', key: 'isAvailable' },
              {
                id: 'isOrderable',
                label: 'Може да се нарача',
                key: 'isOrderable',
              },
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
                  className='text-sm font-normal cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>

          <Button
            disabled={pending}
            type='submit'
            className='sm:col-span-2 mt-2'
          >
            {pending && <LoaderCircle className='size-4 animate-spin mr-2' />}
            Зачувај
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
