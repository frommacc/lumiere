import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { canAccessPath, getRoleHome } from '@/lib/constants/access-control'

// Defining helper functions for routes
const isProfileRoute = (pathname: string) => pathname.startsWith('/profile')
const isAdminRoute = (pathname: string) => pathname.startsWith('/admin')
const isKitchenRoute = (pathname: string) => pathname.startsWith('/kitchen')
const isStaffRoute = (pathname: string) => pathname.startsWith('/staff')

// Changed to /login and /register
const isAuthRoute = (pathname: string) =>
  pathname === '/login' ||
  pathname === '/register' ||
  pathname === '/reset-password' ||
  pathname === '/forgot-password'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPrivate = isProfileRoute(pathname)
  const isAdmin = isAdminRoute(pathname)
  const isKitchen = isKitchenRoute(pathname)
  const isStaff = isStaffRoute(pathname)
  const isAuth = isAuthRoute(pathname)

  // If the route is not protected, proceed immediately
  if (!isPrivate && !isAdmin && !isKitchen && !isStaff && !isAuth) {
    return NextResponse.next()
  }

  // Pulling the session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  // 1. If the user is already logged in, and tries to open /login or /register
  if (session && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. If there is no session for any secure route -> Redirect to /login
  if (!session && (isPrivate || isAdmin || isKitchen || isStaff)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Access control according to Role (Role Authorization)
  if (session) {
    if (!canAccessPath(session.user.role, pathname)) {
      return NextResponse.redirect(
        new URL(getRoleHome(session.user.role), request.url),
      )
    }

    const role = session.user.role

    // Admin Routes: Available for ADMIN and MANAGER
    if (isAdmin && role !== 'ADMIN' && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Kitchen screen: Available for KITCHEN, MANAGER and ADMIN
    if (
      isKitchen &&
      role !== 'KITCHEN' &&
      role !== 'MANAGER' &&
      role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Staff (waiters): Available for STAFF, MANAGER and ADMIN
    if (isStaff && role !== 'STAFF' && role !== 'MANAGER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/kitchen/:path*',
    '/staff/:path*',
    '/profile/:path*',
    '/login',
    '/register',
    '/reset-password',
    '/forgot-password',
  ],
}
