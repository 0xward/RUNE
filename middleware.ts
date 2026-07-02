import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only protect the cron endpoint now — terminal access is gated
// client-side via RunePass ownership (see components/web3/runepass-gate.tsx)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/cron")) {
    const auth = request.headers.get("authorization");
    const secret = process.env.CRON_SECRET;
    if (secret && auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/cron/:path*"],
};
