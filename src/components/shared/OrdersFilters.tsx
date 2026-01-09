"use client";

import { useEffect, useId, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ORDER_STATUS } from "@/types/order.interface";

export const OrdersFilters = () => {
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
        // Reset to page 1 whenever a filter changes
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    // Debounce for the search input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) {
                params.set("search", searchTerm);
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleLimit = (value: string) => updateQueryParams("limit", value);
    const handleStatusFilter = (value: string) => updateQueryParams("status", value);
    const handleSort = (value: string) => updateQueryParams("sort", value);

    return (
        <div className="flex flex-wrap items-center gap-4 py-4 px-2">
            {/* Search */}
            <div className="space-y-2">
                <Label htmlFor={id} className="text-xs font-bold uppercase text-gray-500">Search Order</Label>
                <div className="relative w-full max-w-[250px]">
                    <Input
                        id={id}
                        type="search"
                        placeholder="Name, email or phone..."
                        className="ps-9 h-10 border-gray-200 focus-visible:ring-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground">
                        <SearchIcon size={16} />
                    </div>
                </div>
            </div>

            {/* Limit */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-gray-500">Show</Label>
                <Select
                    onValueChange={handleLimit}
                    defaultValue={searchParams.get("limit") || "10"}
                >
                    <SelectTrigger className="w-[100px] h-10 border-gray-200">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="10">10 Rows</SelectItem>
                            <SelectItem value="20">20 Rows</SelectItem>
                            <SelectItem value="50">50 Rows</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Order Status */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-gray-500">Status</Label>
                <Select
                    onValueChange={handleStatusFilter}
                    defaultValue={searchParams.get("status") || ""}
                >
                    <SelectTrigger className="w-[160px] h-10 border-gray-200">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value=" ">All Status</SelectItem>
                            {Object.values(ORDER_STATUS).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Sorting */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-gray-500">Sort By</Label>
                <Select
                    onValueChange={handleSort}
                    defaultValue={searchParams.get("sort") || "-createdAt"}
                >
                    <SelectTrigger className="w-[180px] h-10 border-gray-200">
                        <SelectValue placeholder="Sort By..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Date</SelectLabel>
                            <SelectItem value="-createdAt">Newest First</SelectItem>
                            <SelectItem value="createdAt">Oldest First</SelectItem>
                            <SelectLabel>Amount</SelectLabel>
                            <SelectItem value="-finalAmount">Price: High to Low</SelectItem>
                            <SelectItem value="finalAmount">Price: Low to High</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};