"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ShoppingCartIcon from "./ShopingCartIcon";
import { mockCategories } from "./shared/mockdata";
import { useUserStore } from "@/stores/useUserStore";
import { logoutUser } from "@/services/auth/logoutUser";
import Link from "next/link";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export default function PublicNavbar() {
  const id = useId();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // const { user, clearUser, fetchUser } = useUserStore();

  const { data, isLoading, isError } = useUserInfoQuery(undefined); console.log(data);
  if (isLoading) return <div>Loading...</div>; // optional skeleton
  const user = data?.data;

  // useEffect(() => {
  //   if (!user) fetchUser();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // console.log(user);

  const handleLogout = async () => {
    // Clear Zustand state
    await logoutUser()
  };

  return (
    <header className="border-b px-4 md:px-6 max-w-[1500px] w-11/12 mx-auto">
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

            {/* MOBILE CATEGORY MENU */}
            <PopoverContent align="start" className="w-56 p-2 md:hidden">
              <div className="flex flex-col gap-2">
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

        {/* Center Search */}
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

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-end md:gap-3 gap-2">
          <ShoppingCartIcon />

          {/* 🔥 CONDITIONAL LOGIN/LOGOUT */}
          {user ? (


            <Button className="ml-[3px]" variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>

          ) : (
            <Button className="ml-[3px]" asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="border-t py-2 max-md:hidden">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            {mockCategories.map((cat) => (
              <NavigationMenuItem key={cat._id}>
                {cat.children.length > 0 ? (
                  <>
                    {/* OPTION A: Category HAS children -> Render Trigger + Content */}
                    <NavigationMenuTrigger className="font-medium">
                      {cat.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 grid gap-2 min-w-[200px]">

                        {/* 1️⃣ ALL Category Link */}
                        <NavigationMenuLink asChild>
                          <a
                            href={`/category/${cat.name.toLowerCase()}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground font-semibold text-primary"
                          >
                            ALL {cat.name}
                          </a>
                        </NavigationMenuLink>

                        <div className="border-b my-2"></div>

                        {/* 2️⃣ Render CHILD categories */}
                        {cat.children.map((child) => (
                          <NavigationMenuLink asChild key={child._id}>
                            <a
                              href={`/category/${child.name.toLowerCase()}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm text-muted-foreground"
                            >
                              {child.name}
                            </a>
                          </NavigationMenuLink>
                        ))}

                      </div>
                    </NavigationMenuContent>

                  </>
                ) : (
                  /* OPTION B: Category has NO children -> Render a simple Link */
                  <NavigationMenuLink asChild>
                    <a
                      href={`/category/${cat.name.toLowerCase()}`}
                      className="font-medium block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {cat.name}
                    </a>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

    </header>
  );
}
