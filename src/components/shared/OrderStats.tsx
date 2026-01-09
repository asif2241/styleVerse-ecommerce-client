/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    subtext: string;
    indicatorColor: string;
}

const StatCard = ({ label, value, subtext, indicatorColor }: StatCardProps) => (
    <div className="flex flex-col p-6 flex-1 min-w-[200px]">
        <span className="text-sm font-medium text-gray-500 mb-1">{label}</span>
        <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <div className={cn("h-1.5 w-6 rounded-full", indicatorColor)} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
);

export const OrderSummaryStats = ({ stats }: { stats: any }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b bg-white rounded-t-xl">
            <StatCard
                label="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                subtext="Lifetime order count"
                indicatorColor="bg-blue-500"
            />
            <StatCard
                label="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                subtext="From completed orders"
                indicatorColor="bg-emerald-500"
            />
            <StatCard
                label="Pending Orders"
                value={stats.pendingOrders.toLocaleString()}
                subtext="Awaiting processing"
                indicatorColor="bg-amber-500"
            />
            <StatCard
                label="Failed Orders"
                value={stats.failedOrders.toLocaleString()}
                subtext="Payment or system failures"
                indicatorColor="bg-rose-500"
            />
        </div>
    );
};