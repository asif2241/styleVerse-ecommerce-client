/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import DashboardPage from "@/app/(dashboardLayout)/admin/dashboard/page";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllOrdersQuery } from "@/redux/features/order/order.api";
import { Role } from "@/types/user.interface";
import Link from "next/link";

export const RecentOrdersSection = () => {
    const { data, isLoading } = useGetAllOrdersQuery(undefined);
    const { data: UserQueryData, isLoading: UserQueryLoading } = useUserInfoQuery(undefined);

    if (isLoading) return <div>Loading...</div>;

    const user = UserQueryData?.data;

    const OrderPageHref =
        user?.role === Role.USER
            ? "/dashboard/order-history"
            : [Role.ADMIN, Role.SUPER_ADMIN].includes(user?.role)
                ? "/admin/dashboard/manage-orders"
                : null;


    const orders = data?.data || [];

    // Helper to style status badges dynamically
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETE': return 'text-green-600 bg-green-50';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50';
            case 'CANCEL': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };


    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>

            <ul className="divide-y divide-gray-100">
                {orders.slice(0, 6).map((order: any) => (
                    <li key={order._id} className="py-3 flex justify-between items-center text-sm">
                        <div className="flex flex-col">
                            <span className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</span>
                            <span className="text-[10px] text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <span className="text-gray-600 font-semibold">
                            ${order.finalAmount.toFixed(2)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                    </li>
                ))}
            </ul>

            {orders.length === 0 && (
                <p className="text-gray-500 text-sm py-4">No recent orders found.</p>
            )}

            {
                OrderPageHref && (
                    <Link href={OrderPageHref as string} className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View All Orders &rarr;
                    </Link>
                )
            }
        </div>
    );
};