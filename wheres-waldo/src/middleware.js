import { NextResponse } from "next/server";

import {
  isProtectedMapCreationApiPath,
  shouldBlockMapCreation,
} from "./lib/access/mapCreationGate";

export function middleware(request) {
  if (!shouldBlockMapCreation()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/map-creation")) {
    return new NextResponse(null, { status: 404 });
  }

  if (isProtectedMapCreationApiPath(pathname)) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/map-creation/:path*", "/api/image/:path*", "/api/scores/:path*"],
};