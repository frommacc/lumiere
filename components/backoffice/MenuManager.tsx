'use client'

import { FormEvent, useState, useTransition } from 'react'
import { LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { deleteCategoryAction, deleteMenuItemAction, saveCategoryAction, saveMenuItemAction } from '@/actions/backoffice'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type MenuCategoryOption = { id: string; name: string; slug: string; description: string | null; image: string; displayOrder: number }
export type MenuItemEditorValue = { id: string; name: string; description: string; price: number; image: string; categoryId: string; isPopular: boolean; isExclusive: boolean; isSpecial: boolean; isAvailable: boolean }

function useSavedAction() {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const run = (operation: () => Promise<{ success: boolean; message: string }>, after?: () => void) => startTransition(async () => {
    const result = await operation()
    if (result.success) toast.success(result.message)
    else toast.error(result.message)
    if (result.success) { after?.(); router.refresh() }
  })
  return { pending, run }
}

export function CategoryEditor({ category }: { category?: MenuCategoryOption }) {
  const { pending, run } = useSavedAction()
  const [open, setOpen] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    run(() => saveCategoryAction({ id: category?.id, name: form.get('name'), slug: form.get('slug'), description: form.get('description'), image: form.get('image'), displayOrder: form.get('displayOrder') }), () => setOpen(false))
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button type='button' size='sm' variant={category ? 'ghost' : 'outline'}>{category ? <Pencil className='size-3.5' /> : <Plus className='size-3.5' />}{category ? 'Uredi' : 'Nova kategorija'}</Button></DialogTrigger><DialogContent className='border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-lg'><DialogHeader><DialogTitle>{category ? 'Uredi kategorija' : 'Nova kategorija'}</DialogTitle></DialogHeader><form onSubmit={submit} className='grid gap-4'><Field id='category-name' label='Ime' name='name' defaultValue={category?.name} /><Field id='category-slug' label='Slug' name='slug' defaultValue={category?.slug} /><Field id='category-image' label='URL na slika' name='image' type='url' defaultValue={category?.image} /><Field id='category-order' label='Redosled' name='displayOrder' type='number' defaultValue={category?.displayOrder ?? 0} /><Field id='category-description' label='Opis' name='description' defaultValue={category?.description ?? ''} required={false} /><Button disabled={pending} type='submit'>{pending ? <LoaderCircle className='size-4 animate-spin' /> : null}Zachuvaj</Button></form></DialogContent></Dialog>
}

export function MenuItemEditor({ item, categories }: { item?: MenuItemEditorValue; categories: MenuCategoryOption[] }) {
  const { pending, run } = useSavedAction()
  const [open, setOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? categories[0]?.id ?? '')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    run(() => saveMenuItemAction({ id: item?.id, name: form.get('name'), description: form.get('description'), price: form.get('price'), image: form.get('image'), categoryId, isPopular: Boolean(form.get('isPopular')), isExclusive: Boolean(form.get('isExclusive')), isSpecial: Boolean(form.get('isSpecial')), isAvailable: Boolean(form.get('isAvailable')) }), () => setOpen(false))
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button type='button' size='sm' variant={item ? 'ghost' : 'default'} disabled={!categories.length}>{item ? <Pencil className='size-3.5' /> : <Plus className='size-3.5' />}{item ? 'Uredi' : 'Novo jadenje'}</Button></DialogTrigger><DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-xl'><DialogHeader><DialogTitle>{item ? 'Uredi jadenje' : 'Novo jadenje'}</DialogTitle></DialogHeader><form onSubmit={submit} className='grid gap-4 sm:grid-cols-2'><Field id='item-name' label='Ime' name='name' defaultValue={item?.name} /><Field id='item-price' label='Cena (MKD)' name='price' type='number' defaultValue={item?.price} /><div className='space-y-2 sm:col-span-2'><Label>Kategorija</Label><Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger><SelectValue placeholder='Izberi kategorija' /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div><div className='sm:col-span-2'><Field id='item-image' label='URL na slika' name='image' type='url' defaultValue={item?.image} /></div><div className='space-y-2 sm:col-span-2'><Label htmlFor='item-description'>Opis</Label><textarea id='item-description' name='description' defaultValue={item?.description} required className='min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-primary' /></div><div className='sm:col-span-2 flex flex-wrap gap-x-5 gap-y-3'>{[['isAvailable','Dostapno',item?.isAvailable ?? true],['isPopular','Popularno',item?.isPopular ?? false],['isExclusive','Ekskluzivno',item?.isExclusive ?? false],['isSpecial','Specijalitet',item?.isSpecial ?? false]].map(([name,label,checked]) => <label key={name as string} className='flex items-center gap-2 text-sm'><input name={name as string} type='checkbox' defaultChecked={Boolean(checked)} />{label}</label>)}</div><Button disabled={pending || !categoryId} type='submit' className='sm:col-span-2'>{pending ? <LoaderCircle className='size-4 animate-spin' /> : null}Zachuvaj</Button></form></DialogContent></Dialog>
}

export function DeleteMenuItemButton({ id }: { id: string }) { const { pending, run } = useSavedAction(); return <Button type='button' size='sm' variant='ghost' disabled={pending} className='text-destructive hover:bg-destructive/10 hover:text-destructive' onClick={() => { if (window.confirm('Da go izbrisham jadenjeto?')) run(() => deleteMenuItemAction(id)) }}><Trash2 className='size-3.5' />Izbrishi</Button> }
export function DeleteCategoryButton({ id }: { id: string }) { const { pending, run } = useSavedAction(); return <Button type='button' size='sm' variant='ghost' disabled={pending} className='text-destructive hover:bg-destructive/10 hover:text-destructive' onClick={() => { if (window.confirm('Da ja izbrisham kategorijata?')) run(() => deleteCategoryAction(id)) }}><Trash2 className='size-3.5' />Izbrishi</Button> }

function Field({ id, label, name, defaultValue, type = 'text', required = true }: { id: string; label: string; name: string; defaultValue?: string | number; type?: string; required?: boolean }) { return <div className='space-y-2'><Label htmlFor={id}>{label}</Label><Input id={id} name={name} type={type} defaultValue={defaultValue} required={required} /></div> }
