"use client";

import { LayoutDashboard, LogOutIcon, SearchIcon, Snail } from "lucide-react";
import { useId, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ShoppingCartIcon from "./ShopingCartIcon";
import Link from "next/link";
import { authApi, useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Role } from "@/types/user.interface";
import { useAllCategoryQuery } from "@/redux/features/category/category.api";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

export default function PublicNavbar() {
  const id = useId();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopPopover, setOpenDesktopPopover] = useState<string | null>(null);

  // Next.js Navigation Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const CATEGORY_VISIBLE_ROUTES = ["/", "/products"];

  const showCategories = CATEGORY_VISIBLE_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const { data, isLoading } = useUserInfoQuery(undefined);
  const { data: categoryData } = useAllCategoryQuery(undefined);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  if (isLoading) return null;



  const categories: Category[] = categoryData?.data;
  const user = data?.data;

  const dashboardHref =
    user?.role === Role.USER
      ? "/dashboard"
      : [Role.ADMIN, Role.SUPER_ADMIN].includes(user?.role)
        ? "/admin/dashboard"
        : null;


  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  /**
   * Filter Handler
   * Updates the URL search params instead of navigating to a new route
   */
  const handleCategoryFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", value.toUpperCase());

    // Update the URL. { scroll: false } prevents the page from jumping to top
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <nav className="border-b px-4 md:px-6 max-w-[1500px] w-11/12 mx-auto ">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu */}
          <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>            <PopoverTrigger asChild>
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

            <PopoverContent align="start" className="w-56 p-2 md:hidden">
              <div className="flex flex-col gap-2">
                <Link href="/" className="w-full text-left font-semibold py-1">
                  Home
                </Link>
                <Link href="/about" className="w-full text-left font-semibold py-1">
                  About Us
                </Link>
                <Link href="/products" className="w-full text-left font-semibold py-1">
                  All Items
                </Link>
                <Link href="/contact" className="w-full text-left font-semibold py-1">
                  Contact Us
                </Link>

                <div className="border-t my-2"></div>

                {showCategories && categories?.map((cat) => (
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

                    {openCategory === cat._id && (
                      <div className="ml-3 flex flex-col gap-1 border-l pl-3">
                        {/* Mobile "ALL" Filter */}
                        <button
                          onClick={() => {
                            handleCategoryFilter(cat.name);
                            setOpenCategory(null);           // ← close subcategory
                            setMobileMenuOpen(false);        // ← close whole mobile menu!
                          }}
                          className="text-left text-primary font-medium"
                        >
                          ALL {cat.name}
                        </button>

                        {/* Mobile Child Filters */}
                        {cat.children.map((child) => (
                          <button
                            key={child._id}
                            onClick={() => {
                              handleCategoryFilter(child.name);
                              setOpenCategory(null);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left text-sm text-muted-foreground hover:text-primary"
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Logo */}
          <Link className="text-primary hover:text-primary/90" href="/">
            <span className="text-xl font-bold text-gray-900">StyleVerse</span>
          </Link>
        </div>



        {/* Right Side */}
        <div className="flex flex-1 items-center justify-end md:gap-5 gap-4">
          <ShoppingCartIcon />

          {dashboardHref && (
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-primary hover:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          )}

          {user?.email ? (
            <Button onClick={handleLogout} variant="outline" className="text-sm">
              <span><LogOutIcon></LogOutIcon></span>
              <span className="max-md:hidden">Logout</span>
            </Button>
          ) : (
            <Button asChild className="text-sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="border-t py-2 max-md:hidden">


        <div className="flex items-center justify-center gap-6">
          <Link href="/" className="font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="font-medium hover:text-primary">
            About Us
          </Link>
          <Link href="/contact" className="font-medium hover:text-primary">
            Contact Us
          </Link>
          <Link href="/products" className="font-medium hover:text-primary">
            All Items
          </Link>


          {/* CATEGORY FILTER LOGIC - Desktop with Popover */}
          {showCategories && categories?.map((cat) => (
            <Popover
              key={cat._id}
              open={openDesktopPopover === cat._id}
              onOpenChange={(open) => {
                if (!open) setOpenDesktopPopover(null);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "font-medium px-3 py-2 text-base",
                    "hover:bg-transparent hover:text-primary",
                    openDesktopPopover === cat._id && "text-primary bg-accent/50"
                  )}
                  onClick={() => setOpenDesktopPopover(cat._id)}
                >
                  {cat.name}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                sideOffset={6}
                className="w-64 p-4 shadow-lg border bg-popover text-popover-foreground rounded-xl"
                avoidCollisions={false}
              >
                <div className="grid gap-2">
                  {/* ALL Category Filter Button */}
                  <div
                    role="button"
                    onClick={() => {
                      handleCategoryFilter(cat.name);
                      setOpenDesktopPopover(null); // ← close!
                    }}
                    className="cursor-pointer block select-none rounded-md p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground font-semibold text-primary"
                  >
                    ALL {cat.name}
                  </div>

                  {cat.children.length > 0 && (
                    <>
                      <div className="border-b my-2 border-border" />
                      {cat.children.map((child) => (
                        <div
                          key={child._id}
                          role="button"
                          onClick={() => {
                            handleCategoryFilter(child.name);
                            setOpenDesktopPopover(null); // ← close!
                          }}
                          className="cursor-pointer block select-none rounded-md p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm text-muted-foreground"
                        >
                          {child.name}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ))}

        </div>
      </div>
    </nav>
  );
}