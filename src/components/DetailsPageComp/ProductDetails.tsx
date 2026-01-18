"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { IProduct } from "@/types/product.interface";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import Link from "next/link";



export default function ProductDetails({ product }: { product: IProduct }) {

    // State for interactivity
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    // const [mainImage, setMainImage] = useState(product.images[0]);
    const [mainImage, setMainImage] = useState<string | null>(null);

    const { addToCart } = useCartStore()

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size!");
            return;
        }

        addToCart({
            productId: product._id as string,
            title: product.title,
            slug: product.slug,
            image: product.images[0],
            price: product.discountPrice ? product.discountPrice : product.price,
            color: product.color,
            selectedSize,
            quantity: 1,
        });

    };

    // ✅ Update main image when product loads
    React.useEffect(() => {
        if (product?.images?.length) {
            setMainImage(product.images[0]);
        }
    }, [product]);
    // ✅ Guard AFTER hooks
    // if (!product) {
    //     return <div className="p-10">Loading product...</div>;
    // }
    // Calculate Discount Percentage
    const discountPercentage = Math.round(
        ((product.price - (product.discountPrice ? product.discountPrice : 0)) / product.price) * 100
    );
    const rating = product.averageRating ?? 0;


    // Handle Quantity Change
    const handleQuantity = (type: "inc" | "dec") => {
        if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
        if (type === "inc" && quantity < 10) setQuantity(quantity + 1); // Max limit example
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-white">
            {/* Responsive Layout:
        - Mobile: Stacked (flex-col)
        - Desktop: Two Columns (Grid with 12 cols, 7 for images, 5 for details)
      */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* --- LEFT COLUMN: Image Gallery --- */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">

                    {/* Thumbnails (Hidden on mobile, side strip on desktop) */}
                    <div className="hidden md:flex flex-col gap-4 w-24">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`relative aspect-square w-full rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? "border-black" : "border-transparent hover:border-gray-200"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${idx}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image Area */}
                    <div className="flex-1 relative aspect-[4/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        {/* Badge Overlay */}
                        {discountPercentage > 0 && (
                            <Badge className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm">
                                -{discountPercentage}% OFF
                            </Badge>
                        )}
                        {mainImage && (
                            <Image
                                src={mainImage}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                priority
                            />
                        )}
                    </div>

                    {/* Mobile Thumbnails (Horizontal Scroll) */}
                    <div className="flex md:hidden gap-3 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${mainImage === img ? "border-black" : "border-gray-200"
                                    }`}
                            >
                                <Image src={img} alt="thumb" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Product Details --- */}
                <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24 h-fit">

                    {/* Header Info */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                            <span className="font-medium tracking-wide text-orange-600">
                                {product.brand}
                            </span>
                            <span>{product.category} • {product.gender}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            {product.title}
                        </h1>

                        {/* Price Block
                        <div className="flex items-end gap-3 pt-2">
                            <span className="text-2xl font-bold text-gray-900">
                                ${product.discountPrice}
                            </span>
                            {product.price > product.discountPrice && (
                                <span className="text-lg text-gray-500 line-through mb-0.5">
                                    ${product.price}
                                </span>
                            )}
                        </div> */}

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                $
                                {(product.discountPrice ?? product.price).toFixed(2)}
                            </span>

                            {product.discountPrice !== undefined && (
                                <span className="text-lg text-gray-500 line-through mb-0.5">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Ratings */}
                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < Math.floor(rating) ? "currentColor" : "none"}
                                        className={i < rating ? "text-yellow-500" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                ({rating} Stars)
                            </span>
                        </div>


                        <Separator />

                        {/* Configuration: Color & Size */}
                        <div className="space-y-6">

                            {/* Color Display (Read Only based on data) */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                                        style={{ backgroundColor: product.color.toLowerCase() }}
                                        title={product.color}
                                    />
                                    <span className="text-sm text-gray-600">{product.color}</span>
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
                                    <Link href={"/size-chart"} className="text-xs text-gray-500 underline hover:text-black">
                                        Size Guide
                                    </Link>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {product.sizes.map((item) => (
                                        <Button
                                            key={item.size}
                                            variant="outline"
                                            disabled={!item.isInStock || item.quantity === 0}
                                            onClick={() => setSelectedSize(item.size)}
                                            className={`h-12 border-gray-200 hover:border-black hover:bg-gray-50 transition-all ${selectedSize === item.size
                                                ? "border-black ring-1 ring-black bg-gray-50"
                                                : ""
                                                } ${!item.isInStock ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
                                                }`}
                                        >
                                            {item.size}
                                        </Button>
                                    ))}
                                </div>
                                {!selectedSize && (
                                    <p className="text-red-500 text-xs mt-2 h-4">Please select a size</p>
                                )}
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {/* Quantity Counter */}
                                <div className="flex items-center border border-gray-300 rounded-md w-full sm:w-32 justify-between px-3 h-12">
                                    <button
                                        onClick={() => handleQuantity("dec")}
                                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-medium text-sm">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantity("inc")}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Main CTA */}
                                <Button
                                    className="flex-1 h-12 text-base font-semibold bg-black hover:bg-gray-800"
                                    disabled={!selectedSize}
                                    onClick={handleAddToCart}
                                >

                                    Add to Cart
                                </Button>

                                {/* Wishlist/Share (Optional features) */}
                                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                                    <Heart size={20} />
                                </Button>
                            </div>

                            <Button variant="secondary" className="w-full h-12 font-medium bg-gray-100 hover:bg-gray-200">
                                Buy It Now
                            </Button>
                        </div>

                        {/* Accordion Details */}
                        <div className="pt-6">
                            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">

                                {/* Description */}
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-base font-medium">Description</AccordionTrigger>
                                    <AccordionContent className="text-gray-600 leading-relaxed">
                                        {product.description}
                                        <p className="mt-2">
                                            Designed for comfort and versatility, this piece from {product.brand} is essential for your wardrobe.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Product Details (Material, SKU, etc) */}
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-base font-medium">Product Details</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2 text-sm text-gray-600 list-disc pl-4">
                                            <li><span className="font-semibold text-gray-900">Material:</span> {product.material}</li>
                                            <li><span className="font-semibold text-gray-900">Gender:</span> {product.gender}</li>
                                            <li><span className="font-semibold text-gray-900">SKU:</span> {product.sku}</li>
                                            <li><span className="font-semibold text-gray-900">Category:</span> {product.category}</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Shipping (Static/Placeholder info usually required) */}
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-base font-medium">Shipping & Returns</AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-600">
                                        Free standard shipping on orders over $50. Returns accepted within 30 days of purchase.
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}