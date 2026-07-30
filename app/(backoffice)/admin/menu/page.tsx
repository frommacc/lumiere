import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { MenuTable } from '@/components/backoffice/Menu/MenuTable'

import { requireRouteAccess } from '@/lib/authorization'
import MenuItemEditor from '@/components/backoffice/Menu/MenuItemEditor'
import { getAdminMenuItems } from '@/lib/db/backoffice/menu-items.services'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminMenuPage({ searchParams }: PageProps) {
  await requireRouteAccess('/admin/menu')

  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const PAGE_SIZE = 3

  const { categories, items, pagination } = await getAdminMenuItems(
    currentPage,
    PAGE_SIZE,
  )

  return (
    <>
      <BackofficeHeader
        eyebrow='Мени контрола'
        title='Мени и јадења'
        description='Креирајте, уредете, повлечете или избришете јадења.'
        actions={<MenuItemEditor categories={categories} />}
      />

      <div className='px-6 py-8 md:px-10'>
        <MenuTable
          items={items}
          categories={categories}
          pagination={pagination}
        />
      </div>
    </>
  )
}
