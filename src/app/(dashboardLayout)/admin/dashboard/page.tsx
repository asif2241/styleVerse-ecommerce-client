import { RecentOrdersSection } from '@/components/shared/RecentOrderSection';
import { Users, ShoppingBag, DollarSign, ListChecks, PlusCircle, UserCog, PackagePlus } from 'lucide-react';
import Link from 'next/link';

// Define a simple structure for your summary cards
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    href: string;
}

// Temporary/Mock data for demonstration
const dashboardStats: StatCardProps[] = [
    {
        title: 'Total Users',
        value: '1,250',
        icon: Users,
        color: 'bg-indigo-500',
        href: '/admin/dashboard/manage-user',
    },
    {
        title: 'Pending Orders',
        value: '42',
        icon: ShoppingBag,
        color: 'bg-yellow-500',
        href: '/admin/dashboard/manage-orders', // Assuming you'll add this page
    },
    {
        title: 'Revenue (Last 30 Days)',
        value: '$15,890',
        icon: DollarSign,
        color: 'bg-green-500',
        // No specific page, links to general analytics
        href: '/admin/dashboard/analytics',
    },
    {
        title: 'Total Categories',
        value: '12',
        icon: ListChecks,
        color: 'bg-blue-500',
        href: '/admin/dashboard/add-category',
    },
];

// Component for a single stat card
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, href }) => (
    <Link href={href} className="block hover:shadow-lg transition-shadow duration-300">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-gray-400 mt-2">View details &rarr;</p>
            </div>
            <div className={`p-3 rounded-full ${color} text-white opacity-90`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </Link>
);


export default function DashboardPage() {
    return (
        <div className="space-y-10">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stats Grid */}
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>
            </section>

            {/* Recent Activity/Quick Actions Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity (Full Width on Mobile, 2/3 on Desktop) */}
                <RecentOrdersSection></RecentOrdersSection>

                {/* Quick Links (Full Width on Mobile, 1/3 on Desktop) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/dashboard/add-category"
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            <PlusCircle className="w-4 h-4 text-blue-600" /> Add New Category
                        </Link>
                        <Link
                            href="/admin/dashboard/manage-users"
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            <UserCog className="w-4 h-4 text-purple-600" /> Manage Users
                        </Link>
                        <Link
                            href="/admin/dashboard/add-product"
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            <PackagePlus className="w-4 h-4 text-green-600" /> Add New Product
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}