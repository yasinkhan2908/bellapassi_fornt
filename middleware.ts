import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Clone request headers and inject pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next();
  
  // Add compression headers
  response.headers.set('Content-Encoding', 'gzip');
  response.headers.set('Cache-Control', 'public, max-age=3600');
  
  return response;

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
