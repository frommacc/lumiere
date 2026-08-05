'use client'

import { MenuItemWithRelations } from '@/types/menu-item'
import MenuItemDetails from './MenuItemDetails'
import MenuListGrid from './MenuListGrid'
import { useAddToCart } from '@/hooks/use-add-to-cart'

interface MenuClientGridProps {
  items: MenuItemWithRelations[]
  showCategories?: boolean
}

export default function MenuClientGrid({
  items,
  showCategories = true,
}: MenuClientGridProps) {
  const {
    handleAddToCart,
    isItemAdded,
    selectedMenuItem,
    onOpenDetails,
    onCloseDetails,
  } = useAddToCart()

  if (!showCategories) {
    return (
      <>
        <MenuListGrid
          items={items}
          handleAddToCart={handleAddToCart}
          isItemAdded={isItemAdded}
          onOpenDetails={onOpenDetails}
          horizontalScroll={showCategories === false}
        />

        <MenuItemDetails
          item={selectedMenuItem}
          isOpen={!!selectedMenuItem}
          onClose={onCloseDetails}
        />
      </>
    )
  }

  const directItems = items.filter((item) => !item.subcategory)

  const groupedBySubcategory = items.reduce(
    (acc, item) => {
      if (item.subcategory) {
        const key = item.subcategory.name
        if (!acc[key]) {
          acc[key] = {
            slug: item.subcategory.slug,
            items: [],
          }
        }
        acc[key].items.push(item)
      }
      return acc
    },
    {} as Record<string, { slug: string; items: MenuItemWithRelations[] }>,
  )

  return (
    <div className='space-y-16 pb-12'>
      {directItems.length > 0 && (
        <MenuListGrid
          items={directItems}
          handleAddToCart={handleAddToCart}
          isItemAdded={isItemAdded}
          onOpenDetails={onOpenDetails}
        />
      )}

      {Object.entries(groupedBySubcategory).map(([subCategoryName, data]) => (
        <section
          key={data.slug}
          id={data.slug}
          className='space-y-6 scroll-mt-24'
        >
          <div className='flex items-center gap-4'>
            <h2 className='font-display text-xl md:text-2xl font-bold tracking-tight text-surface-foreground'>
              {subCategoryName}
            </h2>
            <div className='h-px flex-1 bg-outline-variant/40 mt-1' />
          </div>

          <MenuListGrid
            items={data.items}
            handleAddToCart={handleAddToCart}
            isItemAdded={isItemAdded}
            onOpenDetails={onOpenDetails}
          />
        </section>
      ))}

      <MenuItemDetails
        item={selectedMenuItem}
        isOpen={!!selectedMenuItem}
        onClose={onCloseDetails}
      />
    </div>
  )
}
