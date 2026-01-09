import ProductsManagementTable from "@/components/dashboar/ProductsManagementTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ManageProductsPage() {
    return (
        <div className="min-h-screen bg-zinc-50/50">
            {/* Wrapping in Suspense allows Next.js to skip the useSearchParams 
               check during static generation.
            */}
            <Suspense fallback={<TableSkeleton />}>
                <ProductsManagementTable />
            </Suspense>
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="w-full space-y-4 p-4 md:p-8">
            <div className="h-20 w-full bg-zinc-200 animate-pulse rounded-xl" />
            <div className="h-12 w-full bg-zinc-100 animate-pulse rounded-lg" />
            <div className="rounded-xl border border-zinc-200 h-96 bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-800" />
                <p className="text-zinc-500 font-medium">Initializing StyleVerse Table...</p>
            </div>
        </div>
    );
}