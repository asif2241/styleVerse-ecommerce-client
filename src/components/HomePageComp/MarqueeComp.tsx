"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

import LevisLogo from "@/assets/images/marquee-images/Levi's_logo.svg.png";
import LuisVuittonLogo from "@/assets/images/marquee-images/Louis-Vuitton-logo.png";
import AddidasLogo from "@/assets/images/marquee-images/adidas-logo-png-free-11658916006x6lzpxmcri.png";
import GucciLogo from "@/assets/images/marquee-images/gucci-logo-vector-11574229321sa6icbqlz3.png";
import HMLogo from "@/assets/images/marquee-images/h-and-m-logo-3d-model-b98f805201.jpg";
import NikeLogo from "@/assets/images/marquee-images/nike-just-do-it-wallpaper-preview.jpg";
import ZaraLogo from "@/assets/images/marquee-images/zara-logo-png_seeklogo-423532.png";

const LOGOS = [
    { name: "Levi's", src: LevisLogo },
    { name: "Louis Vuitton", src: LuisVuittonLogo },
    { name: "Adidas", src: AddidasLogo },
    { name: "Gucci", src: GucciLogo },
    { name: "H&M", src: HMLogo },
    { name: "Nike", src: NikeLogo },
    { name: "Zara", src: ZaraLogo },
];

export default function LogoMarquee() {
    return (
        <section className="py-12 bg-background text-center">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-semibold text-muted-foreground mb-8">
                    Trusted by top fashion brands
                </h3>

                <Marquee
                    gradient={true}
                    gradientColor="white"
                    speed={40}
                    pauseOnHover={true}
                    className="overflow-hidden py-4"
                >
                    {LOGOS.map((logo, index) => (
                        <div
                            key={index}
                            className="mx-8 md:mx-12 flex items-center justify-center relative h-20 md:w-32 w-24 cursor-pointer  transition-all duration-300 opacity-70 hover:opacity-100"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100px, 128px"
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}