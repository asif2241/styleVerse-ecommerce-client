
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

// // middleware.ts (at project root or /src)import { NextResponse } from "next/server";
// "use server"
// import { NextResponse, type NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// type VerifiedToken = {
//     userId: string;
//     email: string;
//     role: "ADMIN" | "SUPER_ADMIN" | "USER";
// };

// // Helper function to get cookies
// async function getCookie(key: string) {
//     const cookieStore = await cookies();
//     return cookieStore.get(key)?.value || null;
// }

// // Route groups that need protection
// const protectedRouteGroups = {
//     user: ["/dashboard"], // (userDashboardLayout) group
//     admin: ["/admin/dashboard"], // admin group
// };

// // Individual routes that need protection (outside route groups)
// const protectedIndividualRoutes = [
//     "/order-history",
//     "/profile",
//     "/settings",
//     "/wishlist",
//     "/add-category",
//     "/add-product",
//     "/edit-product",
//     "/manage-orders",
//     "/manage-products",
//     "/manage-users"
// ];

// const publicRoutes = [
//     "/",
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/about",
//     "/cart",
//     "/contact",
//     "/order",
//     "/payment",
//     "/products"
// ];

// export async function proxy(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     // 1. Get token from cookies using your helper function
//     const token = await getCookie("accessToken");
//     let role: "ADMIN" | "SUPER_ADMIN" | "USER" | "GUEST" = "GUEST";

//     if (token) {
//         try {
//             const verifiedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
//             const decoded = verifiedToken as unknown as VerifiedToken;
//             role = decoded.role || "USER";
//         } catch (error) {
//             console.error("JWT Verification failed:", error);
//             // Clear invalid token - Note: This needs to be handled differently
//             // since we can't modify response cookies directly in proxy
//             return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
//         }
//     }

//     // 2. Check for route group protections
//     // Check for user dashboard route group
//     if (protectedRouteGroups.user.some((route) => pathname.startsWith(route))) {
//         if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
//             if (!token) return redirectToLogin(request);

//             // Redirect ADMIN/SUPER_ADMIN to admin dashboard
//             if (["ADMIN", "SUPER_ADMIN"].includes(role)) {
//                 return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//             }

//             // Allow only USER role
//             if (role !== "USER") {
//                 return NextResponse.redirect(new URL("/login", request.url));
//             }
//         }
//         return NextResponse.next();
//     }

//     // Check for admin dashboard route group
//     if (protectedRouteGroups.admin.some((route) => pathname.startsWith(route))) {
//         if (pathname.startsWith("/admin/dashboard")) {
//             if (!token) return redirectToLogin(request);

//             // Allow only ADMIN and SUPER_ADMIN
//             if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
//                 // Redirect USER to user dashboard
//                 if (role === "USER") {
//                     return NextResponse.redirect(new URL("/dashboard", request.url));
//                 }
//                 return NextResponse.redirect(new URL("/login", request.url));
//             }
//         }
//         return NextResponse.next();
//     }

//     // 3. Check individual protected routes
//     const isProtectedIndividualRoute = protectedIndividualRoutes.some((route) =>
//         pathname === route || pathname.startsWith(`${route}/`)
//     );

//     if (isProtectedIndividualRoute) {
//         if (!token) return redirectToLogin(request);

//         // Admin-only routes
//         const adminOnlyRoutes = [
//             "/add-category",
//             "/add-product",
//             "/edit-product",
//             "/manage-orders",
//             "/manage-products",
//             "/manage-users"
//         ];

//         const isAdminRoute = adminOnlyRoutes.some((route) =>
//             pathname === route || pathname.startsWith(`${route}/`)
//         );

//         if (isAdminRoute && !["ADMIN", "SUPER_ADMIN"].includes(role)) {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }

//         // User-only routes (order-history, profile, settings, wishlist)
//         const userOnlyRoutes = [
//             "/order-history",
//             "/profile",
//             "/settings",
//             "/wishlist"
//         ];

//         const isUserRoute = userOnlyRoutes.some((route) =>
//             pathname === route || pathname.startsWith(`${route}/`)
//         );

//         if (isUserRoute && role === "GUEST") {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
//     }

//     // 4. Public routes logic
//     const isPublicRoute = publicRoutes.some((route) =>
//         pathname === route || pathname.startsWith(`${route}/`)
//     );

//     if (isPublicRoute) {
//         // Redirect logged-in users away from auth pages
//         if (token && (pathname === "/login" || pathname === "/register")) {
//             const redirectUrl = ["ADMIN", "SUPER_ADMIN"].includes(role)
//                 ? "/admin/dashboard"
//                 : "/dashboard";
//             return NextResponse.redirect(new URL(redirectUrl, request.url));
//         }
//         return NextResponse.next();
//     }

//     // 5. Allow access to other routes (like nested routes in route groups)
//     return NextResponse.next();
// }

// function redirectToLogin(request: NextRequest) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
//     return NextResponse.redirect(loginUrl);
// }

// export const config = {
//     matcher: [
//         "/((?!_next/static|_next/image|favicon.ico|robots.txt|images/).*)",
//     ],
// };