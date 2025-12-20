"use client";

import { SearchIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle, // Import this for easy styling
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ShoppingCartIcon from "./ShopingCartIcon";
import { mockCategories } from "./shared/mockdata";
import Link from "next/link";
import { authApi, useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Role } from "@/types/user.interface";

// --- Helper Functions for Dashboard Link ---

/**
 * Determines the correct dashboard path based on the user's role.
 * User folders suggest: (dashboardLayout)/admin/dashboard and (userDashboardLayout)/dashboard
 */
const getDashboardPath = (role?: string | null) => {
  // Check for ADMIN role based on your file structure (image_ad4e80.png)
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  // Default to user dashboard based on your file structure (image_ac4f9c.png)
  return "/dashboard";
};

// ------------------------------------------

export default function PublicNavbar() {
  const id = useId();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const { data, isLoading } = useUserInfoQuery(undefined);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  // NOTE: You should handle `isLoading` gracefully, perhaps with a Skeleton.
  if (isLoading) return null;

  const user = data?.data;
  const userRole = user?.role; // Assuming user data includes a `role` field

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };


  return (
    <nav className="border-b px-4 md:px-6 max-w-[1500px] w-11/12 mx-auto ">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                >
                  <path d="M4 6H20" />
                  <path d="M4 12H20" />
                  <path d="M4 18H20" />
                </svg>
              </Button>
            </PopoverTrigger>

            {/* MOBILE CATEGORY MENU (Combined with new links) */}
            <PopoverContent align="start" className="w-56 p-2 md:hidden">
              <div className="flex flex-col gap-2">
                {/* 🔥 ADDED LINKS HERE (Mobile) */}
                <Link href="/about" className="w-full text-left font-semibold py-1">
                  About Us
                </Link>
                <Link href="/contact" className="w-full text-left font-semibold py-1">
                  Contact Us
                </Link>
                {user?.role === Role.SUPER_ADMIN && (
                  <Link href={"/admin/dashboard"} className="w-full text-left font-semibold py-1 text-primary">
                    Dashboard
                  </Link>
                )}
                <div className="border-t my-2"></div>

                {/* Existing Category Loop */}
                {mockCategories.map((cat) => (
                  <div key={cat._id}>
                    <button
                      onClick={() =>
                        setOpenCategory((prev) =>
                          prev === cat._id ? null : cat._id
                        )
                      }
                      className="w-full text-left font-semibold py-1"
                    >
                      {cat.name}
                    </button>

                    {/* Show children when expanded */}
                    {openCategory === cat._id && (
                      <div className="ml-3 flex flex-col gap-1 border-l pl-3">

                        {/* ALL link */}
                        <a
                          href={`/category/${cat.name.toLowerCase()}`}
                          className="text-primary font-medium"
                        >
                          ALL {cat.name}
                        </a>

                        {/* Child links */}
                        {cat.children.map((child) => (
                          <a
                            key={child._id}
                            href={`/category/${child.name.toLowerCase()}`}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Logo */}
          <a className="text-primary hover:text-primary/90" href="#">
            <span className="text-xl font-bold text-gray-900">StyleVerse</span>
          </a>
        </div>

        {/* Center Search (Unchanged) */}
        <div className="grow">
          <div className="relative mx-auto w-full max-w-xs">
            <Input
              className="peer h-8 ps-8 pe-10"
              id={id}
              placeholder="Search..."
              type="search"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>

        {/* Right Side (Unchanged) */}
        <div className="flex flex-1 items-center justify-end md:gap-3 gap-2">
          <ShoppingCartIcon />

          {/* CONDITIONAL LOGIN/LOGOUT */}
          {user?.email && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm"
            >
              Logout
            </Button>
          )}
          {!user?.email && (
            <Button asChild className="text-sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="border-t py-2 max-md:hidden">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">

            {/* ✅ FIXED: About Us */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className={navigationMenuTriggerStyle()}>
                  About Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* ✅ FIXED: Contact Us */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className={navigationMenuTriggerStyle()}>
                  Contact Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* ✅ FIXED: Dashboard Link */}
            {user?.role === Role.SUPER_ADMIN && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/admin/dashboard"
                    className={`${navigationMenuTriggerStyle()} font-semibold text-primary`}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {/* Existing Category Loop */}
            {mockCategories.map((cat) => (
              <NavigationMenuItem key={cat._id}>
                {cat.children.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="font-medium">
                      {cat.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 grid gap-2 min-w-[200px]">
                        {/* ALL Category Link */}
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${cat.name.toLowerCase()}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground font-semibold text-primary"
                          >
                            ALL {cat.name}
                          </Link>
                        </NavigationMenuLink>
                        <div className="border-b my-2"></div>
                        {/* Child categories */}
                        {cat.children.map((child) => (
                          <NavigationMenuLink asChild key={child._id}>
                            <Link
                              href={`/category/${child.name.toLowerCase()}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm text-muted-foreground"
                            >
                              {child.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  /* Category with no children */
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/category/${cat.name.toLowerCase()}`}
                      className="font-medium block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {cat.name}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}