import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

// Legacy single-location URLs 301 → the primary clinic so old bookmarks / SEO
// don't break after the move to /[location]/* routing.
const PRIMARY_LOCATION = "westbrook";
const LEGACY_PATHS = [
  "/about-us",
  "/our-team",
  "/medical-services",
  "/uninsured-services",
  "/faq",
  "/contact-us",
  "/view-clinic",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/+$/, "");
  if (LEGACY_PATHS.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${PRIMARY_LOCATION}${path}`;
    return NextResponse.redirect(url, 301);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname.startsWith("/admin/login");

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/about-us",
    "/our-team",
    "/medical-services",
    "/uninsured-services",
    "/faq",
    "/contact-us",
    "/view-clinic",
  ],
};
