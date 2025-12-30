"use client";

import { useState } from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { IProduct } from "@/types/product.interface";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    Loader2,
    Filter,
    RotateCcw,
    Search,
    ChevronRight,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ProductCard from "../HomePageComp/ProductCard";
import PaginationComp from "../shared/PaginationComp";

export default function AllItemsSection() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. URL Query Extraction
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || "-createdAt";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const limit = searchParams.get("limit") || "12";
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || "1";

    // 2. Local state initialized DIRECTLY from URL values
    // This removes the need for useEffect to "sync" them
    const [localMin, setLocalMin] = useState(minPrice);
    const [localMax, setLocalMax] = useState(maxPrice);
    const [localSearch, setLocalSearch] = useState(search);

    // This key will force a re-render of the inputs when filters are cleared
    const filterKey = `${minPrice}-${maxPrice}-${search}`;
    const hasActiveFilters = !!(minPrice || maxPrice || search || category || page !== "1");

    // 3. API Query
    const { data, isLoading, isFetching } = useGetAllProductsQuery({
        category,
        sort,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        limit,
        search: search || undefined,
        page
    });

    const products: IProduct[] = data?.data || [];

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilter({ search: localSearch });
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        updateFilter({ page: newPage.toString() });
        // Scroll to top of grid when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const handlePriceApply = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilter({ minPrice: localMin, maxPrice: localMax });
    };

    const clearAllFilters = () => {
        // Reset local states immediately
        setLocalMin("");
        setLocalMax("");
        setLocalSearch("");
        // Clear the URL
        router.push(pathname);
    };

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1500px] w-11/12 mx-auto py-10">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <span>Shop</span> <ChevronRight size={10} />
                        <span className="text-orange-600 font-bold">{category || "All Collections"}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 uppercase">
                        {category || "Explore All"}
                    </h1>
                </div>

                {hasActiveFilters && (
                    <Button
                        onClick={clearAllFilters}
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-9 px-3 transition-colors"
                    >
                        <Trash2 size={16} /> Clear All Filters
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* --- SIDEBAR --- */}
                <aside className="w-full lg:w-64 space-y-6">
                    <div key={filterKey} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
                            <Filter size={18} className="text-orange-600" /> Price Range
                        </h3>
                        <form onSubmit={handlePriceApply} className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <Input
                                        placeholder="Min"
                                        type="number"
                                        defaultValue={localMin}
                                        onChange={(e) => setLocalMin(e.target.value)}
                                        className="pl-7 h-10 border-gray-200"
                                    />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        defaultValue={localMax}
                                        onChange={(e) => setLocalMax(e.target.value)}
                                        className="pl-7 h-10 border-gray-200"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                                Apply Price
                            </Button>
                        </form>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1">
                    {/* Responsive Top Bar */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl mb-8 gap-4 shadow-sm">

                        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Search styles..."
                                className="pl-10 h-11 bg-gray-50 border-none rounded-xl"
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

                    {/* Product Grid */}
                    <div className="relative min-h-[400px]">
                        {isFetching && (
                            <div className="absolute inset-0 bg-white/40 z-10 flex items-start justify-center pt-24 backdrop-blur-[1px]">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                            </div>
                        )}

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="bg-white p-5 rounded-full shadow-sm mb-6">
                                    <RotateCcw size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                                <p className="text-muted-foreground mb-8 max-w-xs">
                                    Try adjusting your search or price filters.
                                </p>
                                <Button onClick={clearAllFilters} className="bg-orange-600 hover:bg-orange-700">
                                    Reset All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="my-5">
                        <PaginationComp currentPage={data?.meta?.page} totalPages={data?.meta?.totalPage} paginationItemsToDisplay={5} onPageChange={handlePageChange}></PaginationComp>
                    </div>
                </main>
            </div>
        </div>
    );
}