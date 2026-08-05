import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { MenuTable } from '@/components/backoffice/Menu/MenuTable'

import { requireRouteAccess } from '@/lib/authorization'
import MenuItemEditor from '@/components/backoffice/Menu/MenuItemEditor'
import { getAdminMenuItems } from '@/lib/db/backoffice/menu-items.services'
import { SearchInput } from '@/components/backoffice/shared/SearchInput'

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AdminMenuPage({ searchParams }: PageProps) {
  await requireRouteAccess('/admin/menu')

  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const searchQuery = resolvedSearchParams.q || ''

  const PAGE_SIZE = 10

  const { categories, items, pagination } = await getAdminMenuItems(
    searchQuery,
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

      <div className='space-y-6 px-6 py-8 md:px-10'>
        <div className='flex items-center gap-3'>
          <SearchInput placeholder='Пребарај артикли, по име, опис...' />
        </div>

        <MenuTable
          items={items}
          categories={categories}
          pagination={pagination}
        />
      </div>
    </>
  )
}
