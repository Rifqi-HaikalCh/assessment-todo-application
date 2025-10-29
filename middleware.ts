import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const token = request.cookies.get('auth-token')?.value
  
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    if (token) {
      url.pathname = '/todo'
    } else {
      url.pathname = '/login'
    }
    return NextResponse.redirect(url)
  }
  
  const publicRoutes = ['/login', '/register']
  
  const protectedRoutes = ['/todo', '/admin', '/profile']
  
  const adminRoutes = ['/admin']
  
  const isPublicRoute = publicRoutes.includes(pathname)
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (!token && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
  
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/todo'
    return NextResponse.redirect(url)
  }
  
  if (isAdminRoute) {
    const response = NextResponse.next()
    response.headers.set('x-admin-route', 'true')
    return response
  }

  if (pathname.startsWith('/todo')) {
    const response = NextResponse.next()
    response.headers.set('x-user-route', 'true')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}