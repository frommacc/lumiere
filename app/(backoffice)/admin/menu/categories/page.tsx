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

  // Loading the data in parallel
  const [categories, subcategories] = await Promise.all([
    getAdminCategories(),
    getAdminSubcategories(),
  ])

  // List of simplified categories for the select menu in the SubcategoryEditor
  const simpleCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }))

  return (
    <>
      <BackofficeHeader
        eyebrow='Menu control'
        title='Categories and Subcategories'
        description='Manage all main food categories and subcategories.'
        actions={
          <div className='flex items-center gap-2'>
            <CategoryEditor />
            <SubcategoryEditor categories={simpleCategories} />
          </div>
        }
      />

      <div className='px-6 py-8 md:px-10'>
        <Tabs defaultValue='categories' className='w-full space-y-6'>          {/* Tab control bar */}
          <TabsList className='bg-surface-container-low border border-outline-variant/20'>
            <TabsTrigger
              value='categories'
              className='data-[state=active]:bg-surface-container data-[state=active]:text-on-surface'
            >              Categories ({categories.length})
            </TabsTrigger>
            <TabsTrigger
              value='subcategories'
              className='data-[state=active]:bg-surface-container data-[state=active]:text-on-surface'
            >              Subcategories ({subcategories.length})
            </TabsTrigger>
          </TabsList>          {/* Tab 1: Main Categories */}
          <TabsContent
            value='categories'
            className='space-y-4 focus-visible:outline-none'
          >
            <CategoriesTable categories={categories} />
          </TabsContent>          {/* Tab 2: Subcategories */}
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
