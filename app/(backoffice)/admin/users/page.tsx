import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { requireRouteAccess } from '@/lib/authorization'

import { getAdminUsers } from '@/lib/db/backoffice/users.services'
import { UsersTable } from '@/components/backoffice/Users/UsersTable'
import { PaginationControls } from '@/components/backoffice/shared/pagination-controls'
import { SearchInput } from '@/components/backoffice/shared/SearchInput'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const currentUser = await requireRouteAccess('/admin/users')
  const { q, page } = await searchParams

  const currentPage = Number(page) || 1
  const pageSize = 10

  const { users, totalItems, totalPages } = await getAdminUsers(
    q,
    currentPage,
    pageSize,
  )

  return (
    <>
      <BackofficeHeader
        eyebrow='Администрација'
        title='Корисници и улоги'
        description='Само Администратор може да управува со работните улоги и пристапот на корисниците.'
      />
      <div className='space-y-6 px-6 py-8 md:px-10'>
        {/* Форма за пребарување */}
        <div className='flex items-center gap-3'>
          <SearchInput placeholder='Пребарај име, е-пошта или телефон' />
        </div>

        {/* Табела со корисници и еден заедчки модал за уредување/бришење */}
        <div className='space-y-4'>
          <UsersTable users={users} currentUserId={currentUser.id} />

          {/* Пагинација */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  )
}
