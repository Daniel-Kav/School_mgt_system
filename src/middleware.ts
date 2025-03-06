import { authMiddleware } from "@clerk/nextjs/server";
import { createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

// console.log(matchers);

export default authMiddleware({
  beforeAuth: (req) => {
    // Run any code that doesn't require auth data
    return NextResponse.next();
  },
  afterAuth: (auth, req) => {
    const { userId, sessionClaims } = auth;
    
    // Debug log
    console.log(`Session state: ${JSON.stringify({ userId, sessionClaims })}`);

    if (!auth.userId) {
      // Handle non-authenticated requests
      return NextResponse.next();
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role;

    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role!)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
