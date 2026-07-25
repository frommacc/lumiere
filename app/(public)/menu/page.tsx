import { Suspense } from 'react'
import Menu from '@/components/Menu/Menu'
import MenuCategories from '@/components/Menu/MenuCategories'
import MenuCategoriesSkeleton from '@/components/Menu/MenuCategoriesSkeleton'
import MenuGridSkeleton from '@/components/Menu/skeletons/MenuGridSkeleton'

interface MenuPageProps {
  searchParams?: Promise<{ category?: string }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams
  const activeCategory = resolvedParams?.category || 'all'

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
        <MenuCategories activeCategory={activeCategory} />
      </Suspense>

      <Suspense key={activeCategory} fallback={<MenuGridSkeleton count={8} />}>
        <Menu categoryId={activeCategory} />
      </Suspense>
    </main>
  )
}
