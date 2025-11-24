import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → login
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Get role from DB
  const { data: profile } = await supabase
    .from("users")
    .select("role_id")
    .eq("id", user.id)
    .single();

  // role_id = 2 is admin
  if (profile?.role_id !== 2) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
