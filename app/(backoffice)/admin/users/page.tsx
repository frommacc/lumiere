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
  searchParams: Promise<{ q?: string; page?: string; role?: string }>}) {
  const currentUser = await requireRouteAccess('/admin/users')
  const { q , page , role } = await searchParams

  const currentPage = Number(page) || 1
  const pageSize = 10

  // Safe check that `role` from URL is a valid Role enum
  const selectedRole =
    role && Object.values(Role).includes(role as Role)
      ? (role as role)
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
        eyebrow='Administration'
        title='Users and roles'
        description='Only an Administrator can manage job roles and user access.'
      />
      <div className='space-y-6 px-6 py-8 md:px-10'>        {/* Search and filter form */}
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='max-w-md w-full'>
            <SearchInput placeholder='Search by name, email or phone' />
          </div>

          <RoleSelect />
        </div>        {/* Table of users */}
        <div className='space-y-4'>
          <UsersTable users={users} currentUserId={currentUser.id} />          {/* Pagination */}
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
