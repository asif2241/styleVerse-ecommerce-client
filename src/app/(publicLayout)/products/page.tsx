import AllItemsSection from "@/components/AllProductsPageComponents/AllItemsSection";
import { Metadata } from "next";
import { Suspense } from "react"; // 1. Import Suspense

export const metadata: Metadata = {
    title: "All Items | StyleVerse",
    description:
        "Browse all items including men, women, and kids collections. Filter by price, brand, and category.",
};

export default function AllProductsPage() {
    return (
        <div>
            {/* 2. Wrap the section that uses searchParams */}
            <Suspense fallback={<ProductLoadingState />}>
                <AllItemsSection />
            </Suspense>
        </div>
    );
}

// Optional: A simple loading UI to prevent layout shift
function ProductLoadingState() {
    return (
        <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading products...</div>
        </div>
    );
}