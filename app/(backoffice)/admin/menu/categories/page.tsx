import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import CategoryEditor from '@/components/backoffice/Categories/CategoryEditor'
import { CategoriesTable } from '@/components/backoffice/Categories/CategoriesTable'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminCategories } from '@/lib/db/admin.services'

export default async function AdminMenuCategoriesPage() {
  await requireRouteAccess('/admin/menu/categories')

  const categories = await getAdminCategories()

  return (
    <>
      <BackofficeHeader
        eyebrow='Мени контрола'
        title='Категории на мени'
        description='Управувајте со сите категории во кои се групираат јадењата.'
        actions={<CategoryEditor />}
      />

      <div className='px-6 py-8 md:px-10'>
        <CategoriesTable categories={categories} />
      </div>
    </>
  )
}
