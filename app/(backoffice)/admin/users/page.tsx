import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { requireRouteAccess } from '@/lib/authorization'

import { getAdminUsers } from '@/lib/db/backoffice/users.services'
import { UsersTable } from '@/components/backoffice/Users/UsersTable'
import { PaginationControls } from '@/components/backoffice/shared/pagination-controls'
import { SearchInput } from '@/components/backoffice/shared/SearchInput'
import { RoleSelect } from '@/components/backoffice/Users/RoleSelect'
import { Role } from '@/lib/generated/prisma'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; role?: string }>
}) {
  const currentUser = await requireRouteAccess('/admin/users')
  const { q, page, role } = await searchParams

  const currentPage = Number(page) || 1
  const pageSize = 10

  // Безбедна проверка дали `role` од URL е валиден Role enum
  const selectedRole =
    role && Object.values(Role).includes(role as Role)
      ? (role as Role)
      : undefined

  const { users, totalItems, totalPages } = await getAdminUsers(
    q,
    selectedRole,
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
        {/* Форма за пребарување и филтрирање */}
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='max-w-md w-full'>
            <SearchInput placeholder='Пребарај име, е-пошта или телефон' />
          </div>

          <RoleSelect />
        </div>

        {/* Табела со корисници */}
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
