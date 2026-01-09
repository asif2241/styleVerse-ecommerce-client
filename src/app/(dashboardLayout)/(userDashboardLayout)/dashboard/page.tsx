import Link from 'next/link';
import { ShoppingBag, User, Heart, Settings } from 'lucide-react';
import { RecentOrdersSection } from '@/components/shared/RecentOrderSection';

export default function UserDashboardPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Welcome Back, [User Name]!</h1>

            <p className="text-lg text-gray-600">
                Here you can view your recent orders, manage your profile, and update your preferences.
            </p>

            {/* Quick Access Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Link href="/dashboard/order-history" className="bg-indigo-50 hover:bg-indigo-100 p-6 rounded-lg transition-colors flex items-center gap-4 border border-indigo-200">
                    <ShoppingBag className="w-8 h-8 text-indigo-600" />
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-800">Your Orders</h2>
                        <p className="text-sm text-indigo-600">Track current orders or view past history.</p>
                    </div>
                </Link>

                <Link href="/dashboard/profile" className="bg-green-50 hover:bg-green-100 p-6 rounded-lg transition-colors flex items-center gap-4 border border-green-200">
                    <User className="w-8 h-8 text-green-600" />
                    <div>
                        <h2 className="text-xl font-semibold text-green-800">Manage Profile</h2>
                        <p className="text-sm text-green-600">Update your name, email, and shipping addresses.</p>
                    </div>
                </Link>

                {/* Add more links for Wishlist, Settings, etc. */}

            </section>

            {/* Recent Orders Snippet */}
            <section className="pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Your Recent Activity</h2>
                    <Link href="/dashboard/order-history" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View All &rarr;
                    </Link>
                </div>

                {/* Mock Recent Order Item */}
                <RecentOrdersSection></RecentOrdersSection>
            </section>
        </div>
    );
}