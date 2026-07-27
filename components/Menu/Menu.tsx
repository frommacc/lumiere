import { getMenuItems } from '@/lib/db/menu-items.services'
import MenuClientGrid from './MenuClientGrid'

interface MenuListProps {
  categoryId?: string
}

export default async function Menu({ categoryId }: MenuListProps) {
  const menuItems = await getMenuItems(categoryId)

  if (menuItems.length === 0) {
    return (
      <div className='my-16 flex flex-col items-center justify-center text-center'>
        <p className='font-display text-lg text-on-surface'>
          Нема пронајдено јадења во оваа категорија.
        </p>
      </div>
    )
  }

  return <MenuClientGrid items={menuItems} />
}
