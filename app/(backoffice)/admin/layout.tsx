import { BackofficeShell } from '@/components/backoffice/BackofficeShell'
import { requireRouteAccess } from '@/lib/authorization'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRouteAccess('/admin')
  return <BackofficeShell user={user}>{children}</BackofficeShell>
}
