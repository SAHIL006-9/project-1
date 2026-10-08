import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects admin routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is an admin route (but not login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // In a real app, you'd verify the JWT token here
    // For now, we'll let the client-side auth handle it
    // This is a placeholder for server-side auth protection
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};