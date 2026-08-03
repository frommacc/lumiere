import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import CategoryEditor from '@/components/backoffice/Categories/CategoryEditor'
import { CategoriesTable } from '@/components/backoffice/Categories/CategoriesTable'
import SubcategoryEditor from '@/components/backoffice/Categories/SubcategoryEditor'
import { SubcategoriesTable } from '@/components/backoffice/Categories/SubcategoriesTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminCategories } from '@/lib/db/backoffice/categories.services'
import { getAdminSubcategories } from '@/lib/db/backoffice/categories.services'

export default async function AdminMenuCategoriesPage() {
  await requireRouteAccess('/admin/menu/categories')

  // Вчитување на податоците паралелно
  const [categories, subcategories] = await Promise.all([
    getAdminCategories(),
    getAdminSubcategories(),
  ])

  // Листа со поедноставени категории за селект менито во SubcategoryEditor
  const simpleCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }))

  return (
    <>
      <BackofficeHeader
        eyebrow='Мени контрола'
        title='Категории и Подкатегории'
        description='Управувајте со сите главни категории и подкатегории за јадењата.'
        actions={
          <div className='flex items-center gap-2'>
            <CategoryEditor />
            <SubcategoryEditor categories={simpleCategories} />
          </div>
        }
      />

      <div className='px-6 py-8 md:px-10'>
        <Tabs defaultValue='categories' className='w-full space-y-6'>
          {/* Контролна лента со табови */}
          <TabsList className='bg-surface-container-low border border-outline-variant/20'>
            <TabsTrigger
              value='categories'
              className='data-[state=active]:bg-surface-container data-[state=active]:text-on-surface'
            >
              Категории ({categories.length})
            </TabsTrigger>
            <TabsTrigger
              value='subcategories'
              className='data-[state=active]:bg-surface-container data-[state=active]:text-on-surface'
            >
              Подкатегории ({subcategories.length})
            </TabsTrigger>
          </TabsList>

          {/* Таб 1: Главни Категории */}
          <TabsContent
            value='categories'
            className='space-y-4 focus-visible:outline-none'
          >
            <CategoriesTable categories={categories} />
          </TabsContent>

          {/* Таб 2: Подкатегории */}
          <TabsContent
            value='subcategories'
            className='space-y-4 focus-visible:outline-none'
          >
            <SubcategoriesTable
              subcategories={subcategories}
              categories={simpleCategories}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
