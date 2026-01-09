"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// Next.js specific imports
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Role } from "@/types/user.interface";

export const UsersFilters = () => {
    const id = useId();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper function to update search params
    const updateQueryParams = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        // Push the new URL to the router
        router.push(`${pathname}?${params.toString()}`);
    };

    // 1. Create local state for the input value
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchEmail") || "");

    // 2. Effect to handle the debounce logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchTerm) {
                params.set("searchEmail", searchTerm);
            } else {
                params.delete("searchEmail");
            }

            // Use .replace instead of .push for a better back-button experience
            // { scroll: false } prevents the page from jumping to the top
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, pathname, router, searchParams]);

    const handleLimit = (value: string) => {
        updateQueryParams("limit", value);
    };

    const handleRoleFilter = (value: string) => {
        updateQueryParams("role", value);
    };

    const handleSort = (value: string) => {
        updateQueryParams("sort", value);
    };

    return (
        <div className="flex flex-wrap items-center gap-4">
            {/* searching feature */}
            <div className="space-y-2">
                <Label htmlFor={id}>Search User By Email</Label>
                <div className="relative max-w-[250px]">
                    <Input
                        id={id}
                        type="search"
                        placeholder="Type to search..."
                        className="ps-9"
                        // 3. Update local state instead of URL directly
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground">
                        <SearchIcon size={16} />
                    </div>
                </div>
            </div>

            {/* limit */}
            <div>
                <Label className="mb-2 block text-sm font-medium">Limit</Label>
                <Select
                    onValueChange={handleLimit}
                    defaultValue={searchParams.get("limit") || ""}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Rows per page</SelectLabel>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="35">35</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* user role */}
            <div>
                <Label className="mb-2 block text-sm font-medium">User Role</Label>
                <Select
                    onValueChange={handleRoleFilter}
                    defaultValue={searchParams.get("role") || ""}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.entries(Role).map(([_, value]) => (
                                <SelectItem key={value} value={value}>
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* sorting */}
            <div>
                <Label className="mb-2 block text-sm font-medium">Sort</Label>
                <Select
                    onValueChange={handleSort}
                    defaultValue={searchParams.get("sort") || ""}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort By..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Created Date</SelectLabel>
                            <SelectItem value="createdAt">Oldest First</SelectItem>
                            <SelectItem value="-createdAt">Newest First</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
