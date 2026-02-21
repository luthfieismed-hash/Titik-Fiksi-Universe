import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Jika ada orang asing mencoba mengetik localhost:3000/admin...
  if (path.startsWith('/admin')) {
    // Cek apakah dia punya "Kunci" berupa Cookie sesi login
    const session = request.cookies.get('admin_session');
    
    if (!session) {
      // Jika tidak punya kunci, tendang paksa ke halaman login rahasia!
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Jika punya kunci atau mengakses halaman publik biasa, silakan lewat.
  return NextResponse.next();
}

// Beri tahu satpam ini untuk hanya menjaga folder /admin dan isinya
export const config = {
  matcher: ['/admin/:path*'],
}