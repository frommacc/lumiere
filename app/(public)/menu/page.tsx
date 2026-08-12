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
  searchParams: Promise<MenuSearchParams>}

// 1. WE CHANGE IT TO A SYNCHRONOUS FUNCTION (No async/await!)
export default function MenuPage({ searchParams }: MenuPageProps) {
  return (
    <main className='flex-1 px-4 py-20 sm:px-8 lg:px-12 w-full max-w-7xl mx-auto'>
      <div className='my-8'>
        <h1 className='font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface'>          Gastronomic Menu
        </h1>
        <p className='mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-on-surface-variant'>          Experience the art of flavors through our carefully selected
          an offer. Each dish is a story of tradition and modern cuisine.
        </p>
      </div>

      <Suspense fallback={<MenuCategoriesSkeleton />}>
        <MenuCategoriesContent searchParams={searchParams} />
      </Suspense>      {/* 2. MenuContentWrapper resolves searchParams inside behind Suspense boundary */}
      <Suspense fallback={<MenuGridSkeleton count={8} />}>
        <MenuContentWrapper searchParams={searchParams} />
      </Suspense>
    </main>  )
}

// Helper asynchronous component that contains all `await` calls
async function MenuContentWrapper({ searchParams }: MenuPageProps) {
  const resolvedSearchParams = await searchParams
  const activeCategory = await getActiveCategory(resolvedSearchParams)

  return (
    // This internal Suspense with key guarantees a skeleton when changing category!
    <Suspense key={activeCategory} fallback={<MenuGridSkeleton count={8} />}>
      <Menu categoryId={activeCategory} />
    </Suspense>
  )
}

async function MenuCategoriesContent({ searchParams }: MenuPageProps) {
  const activeCategory = await getActiveCategory(await searchParams)
  return <MenuCategories activeCategory={activeCategory} />
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
  return categories[0]?.id || categories[0]?.slug
}
