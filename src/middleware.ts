import { NextResponse, type NextRequest } from 'next/server'

// Middleware håller sessionen vid liv genom att skicka vidare cookies.
// Auth-skydd hanteras i respektive server component.
export async function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
