// middleware.ts (at project root)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getCookie } from "./services/auth/tokenHandler";

type VerifiedToken = {
    userId: string;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN" | "USER";
};

const protectedRoutes = {
    admin: ["/admin"],
    user: ["/dashboard", "/profile", "/orders", "/wishlist"],
};

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token safely
    let token: string | null = null;
    let role: "ADMIN" | "SUPER_ADMIN" | "USER" | "GUEST" = "GUEST";

    try {
        token = await getCookie("accessToken"); // returns string | null
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as VerifiedToken;
            role = decoded.role || "USER";
        }
    } catch (error) {
        token = null; // ensure token is cleared if invalid
    }

    // Public routes
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
        if (token && (pathname === "/login" || pathname === "/register")) {
            const redirectUrl = role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin/dashboard" : "/dashboard";
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return NextResponse.next();
    }

    // Admin routes
    if (protectedRoutes.admin.some((route) => pathname.startsWith(route))) {
        if (!token) return redirectToLogin(request);
        if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
        return NextResponse.next();
    }

    // User protected routes
    if (protectedRoutes.user.some((route) => pathname.startsWith(route))) {
        if (!token) return redirectToLogin(request);
        return NextResponse.next();
    }

    // API protection (optional)
    if (pathname.startsWith("/api/")) {
        if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/public")) {
            return NextResponse.next();
        }
        if (!token) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|images/).*)",
    ],
};