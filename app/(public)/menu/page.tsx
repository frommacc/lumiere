import { Suspense } from 'react'
import Menu from '@/components/Menu/Menu'
import MenuCategories from '@/components/Menu/MenuCategories'
import MenuCategoriesSkeleton from '@/components/Menu/MenuCategoriesSkeleton'
import MenuGridSkeleton from '@/components/Menu/skeletons/MenuGridSkeleton'
import { getCategories } from '@/lib/db/categories.services'

export const unstable_instant = {
  prefetch: 'runtime',
  samples: [{ searchParams: { category: 'sample-category' } }],
}

type MenuSearchParams = {
  category?: string | string[]
}

interface MenuPageProps {
  searchParams: Promise<MenuSearchParams>
}

export default function MenuPage({ searchParams }: MenuPageProps) {
  return (
    <main className='flex-1 px-4 py-20 sm:px-8 lg:px-12 w-full max-w-7xl mx-auto'>
      {/* Top Title Section */}
      <div className='my-8'>
        <h1 className='font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface'>
          Гастрономско Мени
        </h1>
        <p className='mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-on-surface-variant'>
          Искусете ја уметноста на вкусовите преку нашата внимателно селектирана
          понуда. Секое јадење е приказна за традицијата и модерната кујна.
        </p>
      </div>

      <Suspense fallback={<MenuCategoriesSkeleton />}>
        <MenuCategoriesContent searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<MenuGridSkeleton count={8} />}>
        <MenuContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function MenuCategoriesContent({ searchParams }: MenuPageProps) {
  const activeCategory = await getActiveCategory(await searchParams)

  return <MenuCategories activeCategory={activeCategory} />
}

async function MenuContent({ searchParams }: MenuPageProps) {
  const activeCategory = await getActiveCategory(await searchParams)

  return <Menu categoryId={activeCategory} />
}

function getSelectedCategory(searchParams: MenuSearchParams) {
  const category = searchParams.category

  return typeof category === 'string' && category.length > 0
    ? category
    : undefined
}

async function getActiveCategory(searchParams: MenuSearchParams) {
  const selectedCategory = getSelectedCategory(searchParams)
  if (selectedCategory) return selectedCategory

  const categories = await getCategories()
  return categories[0]?.id
}
