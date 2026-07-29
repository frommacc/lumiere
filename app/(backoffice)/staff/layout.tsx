import { BackofficeShell } from '@/components/backoffice/BackofficeShell'
import { requireRouteAccess } from '@/lib/authorization'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRouteAccess('/staff')
  return <BackofficeShell user={user}>{children}</BackofficeShell>
}
