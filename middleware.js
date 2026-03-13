import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  if (req.auth) return NextResponse.next();

  const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  const signInUrl = new URL("/login", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.svg|login|pending-access).*)",
  ],
};
