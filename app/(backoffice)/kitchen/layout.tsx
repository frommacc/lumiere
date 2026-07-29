import { BackofficeShell } from '@/components/backoffice/BackofficeShell'
import { requireRouteAccess } from '@/lib/authorization'

export default async function KitchenLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRouteAccess('/kitchen')
  return <BackofficeShell user={user}>{children}</BackofficeShell>
}
