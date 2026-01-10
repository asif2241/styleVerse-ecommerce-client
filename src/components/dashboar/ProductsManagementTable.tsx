/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Plus,
    Search,
    ChevronDown,
    Filter,
    Loader2,
    PackageOpen
} from "lucide-react";
import Swal from "sweetalert2"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


// Assuming these are your API hooks from StyleVerse Redux setup
import { IProduct } from "@/types/product.interface";
import { useDeleteProductMutation, useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import PaginationComp from "../shared/PaginationComp";

export default function ProductsManagementTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "-createdAt";
    const limit = searchParams.get("limit") || "12";
    const category = searchParams.get("category") || undefined;
    const page = searchParams.get("page") || "1";




    const [localSearch, setLocalSearch] = useState(search);

    const updateFilter = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        // Logic: If we are changing filters (not the page), reset back to page 1
        if (!updates.page) {
            params.delete("page");
        }

        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // 🔹 Debounce Logic: Updates the URL after 2 seconds of inactivity
    useEffect(() => {
        // If the localSearch is the same as the URL search, do nothing
        if (localSearch === search) return;

        const timer = setTimeout(() => {
            updateFilter({ search: localSearch });
        }, 2000); // 2000ms = 2 seconds

        return () => clearTimeout(timer); // Cleanup timer if user types again before 2s
    }, [localSearch]);

    // Sync local search with URL if user navigates back/forward or clears filters
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const hasActiveFilters = !!(search || category || page !== "1");


    // 1. Fetching data from StyleVerse API
    const { data, isLoading, isFetching } = useGetAllProductsQuery({
        // category,
        sort,
        // minPrice: minPrice || undefined,
        // maxPrice: maxPrice || undefined,
        limit,
        search: search || undefined,
        // page
    });
    const [deleteProduct] = useDeleteProductMutation();

    const products = data?.data || [];

    // const handleDelete = async (productId: string) => {
    //     console.log(productId);
    //     if (!confirm("Are you sure? This will remove the product from StyleVerse permanently.")) return;

    //     try {
    //         await deleteProduct({ productId }).unwrap();
    //         toast.success("Product deleted successfully");
    //     } catch (err: any) {
    //         toast.error(err?.data?.message || "Failed to delete product");
    //     }
    // };


    const handleDelete = async (productId: string) => {
        console.log(productId);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will remove the product from StyleVerse permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct({ productId }).unwrap();

                Swal.fire({
                    title: "Deleted!",
                    text: "Product has been successfully deleted.",
                    icon: "success"
                }).then(() => {
                    // nothing to do here 
                });

            } catch (err: any) {
                Swal.fire({
                    title: "Failed!",
                    text: err?.message || "Failed to delete product due to a server error.",
                    icon: "error"
                });
            }
        }
    };


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilter({ search: localSearch });
    };

    const handlePageChange = (newPage: number) => {
        updateFilter({ page: newPage.toString() });
        // Scroll to top of grid when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const clearAllFilters = () => {
        // Reset local states immediately
        // setLocalMin("");
        // setLocalMax("");
        setLocalSearch("");
        // Clear the URL
        router.push(pathname);
    };




    if (isLoading) {
        return (
            <div className="flex flex-col h-96 items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-800" />
                <p className="text-zinc-500 font-medium animate-pulse">Loading StyleVerse Inventory...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground text-sm">
                        View, edit, and manage your StyleVerse product catalog.
                    </p>
                </div>
                <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
                    <Link href="/admin/dashboard/add-product">
                        <Plus className="mr-2 h-4 w-4" /> New Product
                    </Link>
                </Button>
            </div>

            {/* Toolbar Section */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col md:w-4/5 w-full  md:flex-row items-stretch md:items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl mb-8 gap-4 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9 h-10 border-zinc-200 focus-visible:ring-zinc-400"
                            key={`search-${search}`} // Forces input to reset when search is cleared
                            defaultValue={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                    </form>

                    <div className="flex items-center gap-3">
                        <Select value={sort} onValueChange={(v) => updateFilter({ sort: v })}>
                            <SelectTrigger className="w-full md:w-[160px] h-11 border-gray-100 bg-gray-50 rounded-xl">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-createdAt">Newest</SelectItem>
                                <SelectItem value="price">Price: Low-High</SelectItem>
                                <SelectItem value="-price">Price: High-Low</SelectItem>
                                <SelectItem value="-totalSales">Most Popular</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={limit} onValueChange={(v) => updateFilter({ limit: v })}>
                            <SelectTrigger className="w-[80px] h-11 border-gray-100 bg-gray-50 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="24">24</SelectItem>
                                <SelectItem value="48">48</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                {hasActiveFilters && (
                    <Button
                        onClick={clearAllFilters}
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 mb-8 hover:bg-red-50 gap-2 h-9 px-3 transition-colors"
                    >
                        <Trash2 size={16} /> Clear All Filters
                    </Button>
                )}
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm relative">
                {/* Visual overlay for background fetching */}
                {isFetching && !isLoading && (
                    <div className="absolute inset-0 bg-white/20 z-10 backdrop-blur-[1px] flex items-center justify-center" />
                )}

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="font-semibold">Product Details</TableHead>
                            <TableHead className="font-semibold">Price</TableHead>
                            <TableHead className="font-semibold">Stock Status</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product: IProduct) => (
                                <TableRow key={product._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-lg border border-zinc-100 bg-zinc-50 overflow-hidden">
                                            <Image
                                                src={product.images[0] || "/placeholder.png"}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-zinc-900 line-clamp-1">
                                                {product.title}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                    SKU: {product.sku}
                                                </span>
                                                <span className="text-zinc-300">|</span>
                                                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                                    {product.category
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-zinc-700">
                                        ${product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {product.sizes.reduce((acc, s) => acc + s.quantity, 0) > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-sm font-medium text-emerald-700">
                                                    {product.sizes.reduce((acc, s) => acc + s.quantity, 0)} In Stock
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                                <span className="text-sm font-medium text-red-700">Out of Stock</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 rounded-lg">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <Link href={`/admin/dashboard/edit-product/${product.slug}`}>
                                                        <Edit className="mr-2 h-4 w-4 text-zinc-500" /> Edit Product
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                                    onClick={() => handleDelete(product._id as string)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-zinc-400">
                                        <PackageOpen className="h-10 w-10 mb-2 opacity-20" />
                                        <p>No products found in StyleVerse inventory.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="my-5">
                    <PaginationComp currentPage={data?.meta?.page} totalPages={data?.meta?.totalPage} paginationItemsToDisplay={5} onPageChange={handlePageChange}></PaginationComp>
                </div>
            </div>
        </div>
    );
}