"use client"
import React, { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from "sonner"

const ProductCard = () => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const { addToCart } = useCartStore()

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size!");
            return;
        }

        addToCart({
            productId: product._id,
            title: product.title,
            slug: product.slug,
            image: product.images[0],
            price: product.discountPrice ? product.discountPrice : product.price,
            color: product.color,
            selectedSize,
            quantity: 1,
        });
        // console.log({
        //     productId: product._id,
        //     title: product.title,
        //     slug: product.slug,
        //     image: product.images[0],
        //     price: product.discountPrice ? product.discountPrice : product.price,
        //     color: product.color,
        //     selectedSize,
        //     quantity: 1,
        // });
    };


    const product = {
        _id: "6932b860312fce551b696161",
        title: "Casual Blue Shirt",
        description: "A stylish casual blue shirt made from 100% cotton.",
        images: ["https://res.cloudinary.com/drdaqqxwz/image/upload/v1758546466/samples/shoe.jpg", "https://res.cloudinary.com/drdaqqxwz/image/upload/v1758546472/cld-sample-5.jpg"],
        price: 29.99,
        discountPrice: 24.99,
        category: "SHIRT",
        brand: "FashionBrand",
        sizes: [
            { size: "S", quantity: 10, isInStock: true },
            { size: "M", quantity: 15, isInStock: true },
            { size: "L", quantity: 5, isInStock: true }
        ],
        color: "Blue",
        material: "Cotton",
        gender: "MEN",
        averageRating: 0,
        isFeatured: false,
        sku: "CB-SHIRT-BLUE-005",
        slug: "casual-blue-shirt-4"
    };

    const discountPercentage = Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
    );

    const availableSizes = product.sizes.filter(s => s.isInStock).map(s => s.size);

    return (
        <Card className="block rounded-lg p-4 shadow-xs shadow-indigo-100 relative overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
            {/* Image Container */}
            <div className="relative  overflow-hidden h-56 bg-gray-100">
                {/* Placeholder Image - Replace with actual product image */}
                <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 h-56 w-full rounded-md  transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Discount Badge */}
                {product.discountPrice && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-semibold">
                        {discountPercentage}% OFF
                    </Badge>
                )}

                {/* Wishlist Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                >
                    <Heart
                        className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
                            }`}
                    />
                </Button>

                {/* Quick Add Overlay - Shows on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-end">
                    <Button
                        className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                        onClick={() => console.log('Quick add to cart')}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Quick Add
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <CardContent className="p-4">
                {/* Brand & Category */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase font-medium">
                        {product.brand}
                    </span>
                    <Badge variant="outline" className="text-xs">
                        {product.category}
                    </Badge>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-base mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
                    {product.title}
                </h3>

                {/* Color & Material */}
                <p className="text-xs text-gray-500 mb-3">
                    {product.color} • {product.material}
                </p>

                {/* Available Sizes */}
                <div className="flex gap-1 mb-3">
                    {availableSizes.map((size) => (
                        <Badge
                            key={size}
                            variant={selectedSize === size ? "default" : "secondary"}
                            className="text-xs px-2 py-0.5 cursor-pointer"
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Badge>
                    ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                        ${product.discountPrice.toFixed(2)}
                    </span>
                    {product.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </CardContent>

            {/* Add to Cart Button */}
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;