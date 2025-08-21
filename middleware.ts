import { NextResponse, NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/utils/updateSession' 

export async function middleware(req: NextRequest) {
  const { response, supabase } = await updateSession(req)

  const { data: { user } } = await supabase.auth.getUser()

  const protectedPaths = ['/profile', '/admin', '/cart', '/checkout'];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !user) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/profile/:path*', '/admin/', '/cart/:path*', '/checkout/:path*'], 
  // only run on these routes
}