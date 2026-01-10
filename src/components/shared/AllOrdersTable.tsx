/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useGetAllOrdersQuery } from "@/redux/features/order/order.api";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrdersFilters } from "./OrdersFilters";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PaginationComp from "./PaginationComp";
import { OrderSummaryStats } from "./OrderStats";
import StylePulseLoader from "./StylePulseLoader";

export default function AllOrdersTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = {
        page: searchParams.get("page") || "1",
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
        sort: searchParams.get("sort") || "-createdAt",
        limit: searchParams.get("limit") || "10",
    };

    const { data, isLoading } = useGetAllOrdersQuery(query);

    if (isLoading) {
        return <StylePulseLoader size="lg" text="Fetching your orders..." />;
    }

    const orders = data?.data || [];

    // Calculate real stats from the current dataset
    const statsData = {
        totalOrders: data?.meta?.total || 0, // Total count from backend meta
        totalRevenue: orders
            .filter((order: any) => order.status === "COMPLETE")
            .reduce((sum: number, order: any) => sum + (order.finalAmount || 0), 0),
        pendingOrders: orders.filter((order: any) => order.status === "PENDING").length,
        failedOrders: orders.filter((order: any) => order.status === "FAILED").length,
    };
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETE": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING": return "bg-orange-100 text-orange-700 border-orange-200";
            case "CANCEL": return "bg-red-100 text-red-700 border-red-200";
            case "FAILED": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    return (
        <div className="w-full bg-white rounded-xl border shadow-sm overflow-hidden mb-10">
            {/* 1. Summary Section */}
            <OrderSummaryStats stats={statsData} />

            {/* 2. Filters Section */}
            <div className="p-2 border-b">
                <OrdersFilters />
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-600">Product Name</TableHead>
                            <TableHead className="font-semibold text-gray-600">Customer</TableHead>
                            <TableHead className="font-semibold text-gray-600">Order ID</TableHead>
                            <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                            <TableHead className="text-center font-semibold text-gray-600">Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600 pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : data?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data?.map((order: any) => (
                                <TableRow key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {order.productDetails?.[0]?.title || "Generic Product"}
                                                {order.products.length > 1 && ` + ${order.products.length - 1} more`}
                                            </span>
                                            <span className="text-xs text-gray-500">{order.productDetails?.[0]?.category || "Electric"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">
                                                {order.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{order.name}</span>
                                                <span className="text-xs text-gray-500">Star Customer</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-mono text-gray-700">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs text-gray-500">
                                                {order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy") : "N/A"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">${order.finalAmount?.toLocaleString()}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Paid Online</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={cn("rounded-full px-3 py-1 font-medium", getStatusColor(order.status))}>
                                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs border-gray-200 hover:bg-zinc-900 hover:text-white transition-all"
                                            onClick={() => router.push(`/order/${order._id}`)}
                                        >
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between p-4 border-t bg-gray-50/30">
                <p className="text-sm text-gray-500">
                    Showing {data?.data?.length || 0} of {data?.meta?.total || 0} results
                </p>
                <PaginationComp
                    currentPage={Number(data?.meta?.page)}
                    totalPages={data?.meta?.totalPage}
                    paginationItemsToDisplay={5}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}