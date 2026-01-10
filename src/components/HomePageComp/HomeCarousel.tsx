"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";


// Import your images
import Image1 from "@/assets/images/1676.jpg"; // Replace with your image paths
import Image2 from "@/assets/images/1985.jpg";
import Image3 from "@/assets/images/8886.jpg";
import Link from "next/link";

// Define slide data with professional e-commerce content
const SLIDE_DATA = [
    {
        id: 1,
        image: Image1,
        title: "New Season Arrivals",
        description:
            "Discover the latest trends in fashion. Shop our new collection of premium apparel designed for style and comfort.",
        buttonText: "Shop Now",
        buttonIcon: <ShoppingBag className="ml-2 h-4 w-4" />,
        contentAlign: "center", // For responsive alignment
    },
    {
        id: 2,
        image: Image2,
        title: "Urban Streetwear Staples",
        description:
            "Elevate your everyday look with our curated selection of hoodies, tees, and denim. Express your unique style.",
        buttonText: "Explore Collection",
        buttonIcon: <ArrowRight className="ml-2 h-4 w-4" />,
        contentAlign: "center",
    },
    {
        id: 3,
        image: Image3,
        title: "Premium Denim & Essentials",
        description:
            "Find your perfect fit. Our high-quality denim and timeless essentials are built to last and impress.",
        buttonText: "Shop Denim",
        buttonIcon: <ShoppingBag className="ml-2 h-4 w-4" />,
        contentAlign: "center",
    },
];

export function HomeCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    return (
        <Carousel
            plugins={[plugin.current]}
            className="relative w-full mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {SLIDE_DATA.map((slide) => (
                    <CarouselItem key={slide.id} className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full font-sans">
                        {/* Background Image */}
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover brightness-50" // Darken image for better text readability
                            priority={slide.id === 1} // Prioritize loading the first image
                        />

                        {/* Content Overlay */}
                        <div className={`absolute inset-0 flex items-center p-6 md:p-12 lg:p-20
              ${slide.contentAlign === 'left' ? 'justify-start' :
                                slide.contentAlign === 'center' ? 'justify-center text-center' :
                                    'justify-end text-right'
                            }`}
                        >
                            <div className="max-w-xl text-white space-y-4 text-center md:space-y-6">
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-base md:text-lg lg:text-xl opacity-90">
                                    {slide.description}
                                </p>
                                <Link href={`/products`}>
                                    <Button size="lg" className="font-semibold cursor-pointer">
                                        {slide.buttonText}
                                        {slide.buttonIcon}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Carousel Controls (optional, can be removed or styled) */}
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
        </Carousel>

    );
}