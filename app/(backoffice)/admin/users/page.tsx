import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { UserRoleControl } from '@/components/backoffice/UserRoleControl'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminUsers } from '@/lib/db/admin.services'
import { Role } from '@/lib/generated/prisma'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const currentUser = await requireRouteAccess('/admin/users')
  const { q } = await searchParams
  const users = await getAdminUsers(q)
  return <><BackofficeHeader eyebrow='Administracija' title='Korisnici i roli' description='Samo Administrator moze da upravuva so rabotnite roli. Sopstvenata rola i posledniot Admin se zashtiteni.' />
    <div className='space-y-6 px-6 py-8 md:px-10'><form className='flex gap-3'><Input name='q' defaultValue={q} placeholder='Prebaraj ime ili e-poshta' className='max-w-md bg-surface-container-high' /><Button type='submit'>Prebaraj</Button></form><div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'><div className='overflow-x-auto'><table className='w-full min-w-210 text-left text-sm'><thead className='border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant'><tr><th className='px-5 py-4'>Korisnik</th><th className='px-5 py-4'>Telefon</th><th className='px-5 py-4'>Chlen od</th><th className='px-5 py-4'>Rola</th></tr></thead><tbody className='divide-y divide-outline-variant/10'>{users.map((user) => <tr key={user.id}><td className='px-5 py-4'><p className='font-medium'>{user.name}</p><p className='mt-1 text-xs text-on-surface-variant'>{user.email}</p></td><td className='px-5 py-4'>{user.phone}</td><td className='px-5 py-4 text-on-surface-variant'>{formatBackofficeDateTime(user.createdAt)}</td><td className='px-5 py-4'><UserRoleControl userId={user.id} role={user.role} disabled={user.id === currentUser.id || (user.role === Role.ADMIN && user.id === currentUser.id)} /></td></tr>)}</tbody></table></div></div></div>
  </>
}
