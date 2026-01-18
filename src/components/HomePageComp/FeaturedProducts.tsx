"use client"
import { useGetAllProductsQuery } from "@/redux/features/product/product.api"
import ProductCard from "./ProductCard"
import { IProduct } from "@/types/product.interface"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useSearchParams } from "next/navigation"

function FeaturedProducts() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || undefined;
    const { data, isLoading } = useGetAllProductsQuery({ category })


    // Safely access products and limit to first 8 for the featured section
    const products: IProduct[] = data?.data?.slice(0, 8) || []

    if (isLoading) {
        return <div className="py-20 text-center">Loading Featured Products...</div>
    }

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="max-w-[1500px] w-11/12 mx-auto">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            Featured Products
                        </h2>
                        <p className="text-muted-foreground max-w-[600px] text-sm md:text-base">
                            Discover our handpicked selection of premium styles. From everyday essentials
                            to statement pieces, find what defines your StyleVerse.
                        </p>
                    </div>

                    {/* See More Button - Desktop/Tablet: Top Right | Mobile: Below text */}
                    <Link href="/products">
                        <Button variant="ghost" className="group text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold flex items-center gap-2 pr-2">
                            See More
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* --- PRODUCTS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {products.length > 0 ? (
                        products.slice(0, 8).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No featured products found.
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts