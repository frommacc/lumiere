import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth, type SessionUser } from '@/lib/auth'
import {
  canAccessPath,
  getRoleHome,
  hasAnyRole,
} from '@/lib/constants/access-control'
import { Role, UserStatus } from '@/lib/generated/prisma'

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function requireRouteAccess(
  pathname: string,
): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) {
    redirect(`/login?redirect_url=${encodeURIComponent(pathname)}`)
  }

  // Заштита: Блокираните корисници немаат пристап до заштитени рути
  if (user.status === UserStatus.BLOCKED) {
    redirect('/login?error=blocked')
  }

  if (!canAccessPath(user.role, pathname)) {
    redirect(getRoleHome(user.role))
  }

  return user as SessionUser
}

export async function getAuthorizedUser(roles: Role[]) {
  const user = await getCurrentUser()
  return user && hasAnyRole(user.role, roles) ? user : null
}
