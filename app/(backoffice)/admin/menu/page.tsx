import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { MenuAvailabilityToggle } from '@/components/backoffice/MenuAvailabilityToggle'
import { CategoryEditor, DeleteCategoryButton, DeleteMenuItemButton, MenuItemEditor } from '@/components/backoffice/MenuManager'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminMenu } from '@/lib/db/admin.services'
import { formatCurrency } from '@/lib/utils/order'

export default async function AdminMenuPage() {
  await requireRouteAccess('/admin/menu')
  const [categories, items] = await getAdminMenu()
  return <><BackofficeHeader eyebrow='Мени контрола' title='Мени и јадења' description='Креирајте, уредете, повлечете или избришете категории и јадења.' actions={<div className='flex gap-2'><CategoryEditor /><MenuItemEditor categories={categories} /></div>} />
    <div className='space-y-6 px-6 py-8 md:px-10'><section className='flex flex-wrap gap-3'>{categories.map((category) => <div key={category.id} className='rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-4'><p className='font-medium'>{category.name}</p><p className='mt-1 text-xs text-on-surface-variant'>/{category.slug}</p><div className='mt-3 flex gap-1'><CategoryEditor category={category} /><DeleteCategoryButton id={category.id} /></div></div>)}</section>
      <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'><div className='overflow-x-auto'><table className='w-full min-w-230 text-left text-sm'><thead className='border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant'><tr><th className='px-5 py-4'>Јадење</th><th className='px-5 py-4'>Кategoрија</th><th className='px-5 py-4'>Цена</th><th className='px-5 py-4'>Јавно мени</th><th className='px-5 py-4'>Акции</th></tr></thead><tbody className='divide-y divide-outline-variant/10'>{items.map((item) => <tr key={item.id}><td className='px-5 py-4'><p className='font-medium'>{item.name}</p><p className='mt-1 max-w-sm truncate text-xs text-on-surface-variant'>{item.description}</p></td><td className='px-5 py-4'>{item.category.name}</td><td className='px-5 py-4'>{formatCurrency(item.price)}</td><td className='px-5 py-4'><span className={item.isAvailable ? 'text-emerald-400' : 'text-on-surface-variant'}>{item.isAvailable ? 'Достапно' : 'Повлечено'}</span></td><td className='px-5 py-4'><div className='flex flex-wrap gap-1'><MenuAvailabilityToggle itemId={item.id} isAvailable={item.isAvailable} /><MenuItemEditor item={item} categories={categories} /><DeleteMenuItemButton id={item.id} /></div></td></tr>)}</tbody></table></div></div>
    </div></>
}
