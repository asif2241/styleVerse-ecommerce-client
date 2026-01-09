/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    Calendar,
    Mail,
    MapPin,
    Phone,
    Package,
    CreditCard,
    ArrowLeft,
    Printer
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetSingleOrderQuery } from "@/redux/features/order/order.api";
import { Skeleton } from "../ui/skeleton";
import { ISingleOrder } from "@/types/order.interface";

export default function OrderDetailsPage({ orderId }: { orderId: string }) {
    const { data, isLoading } = useGetSingleOrderQuery({ orderId });

    // Loading Skeleton
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    console.log(data);

    if (!data?.data) return <div className="p-10 text-center">Order not found.</div>;

    const order: ISingleOrder = data.data;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETE": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING": return "bg-orange-100 text-orange-700 border-orange-200";
            case "CANCEL": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <Link href="/" className="flex items-center gap-1">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h1>
                        <Badge className={cn("rounded-full", getStatusColor(order.status))}>
                            {order.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> {format(new Date(order.createdAt), "PPP")}
                        </span>
                        <span className="flex items-center gap-1">
                            <CreditCard size={14} /> {order.payment?.status || "UNPAID"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"
                        //  onClick={() => window.print()}
                        className="gap-2">
                        <Printer size={16} /> Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Product Table */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package size={20} className="text-gray-500" /> Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4 text-center">Qty</th>
                                            <th className="px-6 py-4 text-right">Unit Price</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {order?.products.map((item: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative h-12 w-12 rounded-lg border bg-gray-100 overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item?.product?.images?.[0] || "/placeholder.png"}
                                                                alt={item?.product?.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900 line-clamp-1">{item.product?.title}</span>
                                                            <span className="text-xs text-gray-500">Size: {item.size}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium">x{item.quantity}</td>
                                                <td className="px-6 py-4 text-right">${item.unitPrice.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right font-semibold">${(item.unitPrice * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order History / Timeline (Optional Placeholder) */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 italic">No special instructions provided for this order.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer & Summary */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600">
                                    {order?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{order?.name}</p>
                                    <p className="text-xs text-gray-500">Customer ID: {order?.user?._id?.slice(-6)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm">
                                    <Mail size={16} className="text-gray-400 mt-0.5" />
                                    <span className="text-gray-600 break-all">{order.email}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <Phone size={16} className="text-gray-400 mt-0.5" />
                                    <span className="text-gray-600">{order.phone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                    <span className="text-gray-600">{order.shippingAddress}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="border-none shadow-sm bg-zinc-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Subtotal</span>
                                <span>${order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Shipping</span>
                                <span>${order.deliveryCharge.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Discount</span>
                                <span className="text-red-400">-${order.discount.toLocaleString()}</span>
                            </div>
                            <Separator className="bg-zinc-800" />
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-base font-semibold">Total Amount</span>
                                <span className="text-xl font-bold text-white">${order.finalAmount.toLocaleString()}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-zinc-800">
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                                    <span>Transaction ID</span>
                                    <span className="text-zinc-300">{order.payment?.transactionId || "N/A"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}