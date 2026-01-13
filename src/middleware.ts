import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ideolo_admin";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isAdminPage = pathname.startsWith("/admin");
    const isAdminApi = pathname.startsWith("/api/admin");

    const isLoginPage = pathname === "/admin";
    const isLoginApi = pathname === "/api/admin/login";

    if (!isAdminPage && !isAdminApi) return NextResponse.next();

    if (isLoginPage || isLoginApi) return NextResponse.next();

    const hasCookie = req.cookies.has(COOKIE_NAME);

    if (hasCookie) return NextResponse.next();

    if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
