import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = ["/login", "/register"].some((route) =>
    pathname.startsWith(route),
  );

  const isPublicFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico");

  if (!authToken && !isAuthRoute && !isPublicFile) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
