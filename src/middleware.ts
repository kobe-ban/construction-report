import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = new Set(['/login', '/register'])
const AUTH_COOKIE = 'token'

async function isAuthed(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const secret = process.env.JWT_SECRET
  if (!secret) return false
  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(AUTH_COOKIE)?.value
  const authed = await isAuthed(token)

  // Already authenticated: bounce away from /login & /register
  if (authed && PUBLIC_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Public path: allow through
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  // Protected path requires auth
  if (!authed) {
    const url = new URL('/login', req.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except Next.js internals, static files, and API routes.
  // (API routes do their own auth check via getCurrentUser.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
