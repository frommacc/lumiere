import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Дефинирање на помошни функции за рутите
const isProfileRoute = (pathname: string) => pathname.startsWith('/profile')
const isAdminRoute = (pathname: string) => pathname.startsWith('/admin')
const isKitchenRoute = (pathname: string) => pathname.startsWith('/kitchen')
const isStaffRoute = (pathname: string) => pathname.startsWith('/staff')

// Променети во /login и /register
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

  // Ако рутата не е заштитена, веднаш продолжи
  if (!isPrivate && !isAdmin && !isKitchen && !isStaff && !isAuth) {
    return NextResponse.next()
  }

  // Влечење на сесијата од Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  // 1. Ако корисникот е веќе најавен, а пробува да отвори /login или /register
  if (session && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Доколку нема сесија за која било заштитена рута -> Пренасочи кон /login
  if (!session && (isPrivate || isAdmin || isKitchen || isStaff)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Контрола на пристап според Роли (Role Authorization)
  if (session) {
    const role = session.user.role

    // Админ рути: Достапни за ADMIN и MANAGER
    if (isAdmin && role !== 'ADMIN' && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Кујнски екран: Достапен за KITCHEN, MANAGER и ADMIN
    if (
      isKitchen &&
      role !== 'KITCHEN' &&
      role !== 'MANAGER' &&
      role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Персонал (келнери): Достапен за STAFF, MANAGER и ADMIN
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
