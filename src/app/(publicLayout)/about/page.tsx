/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Sparkles, Leaf, Globe, ShoppingBag } from 'lucide-react';
import HeroImage from "@/assets/images/8886.jpg";
import OurStoryImage from "@/assets/images/our-story-image.jpg";
import Image from 'next/image';

const AboutPage = () => {
    return (
        <div className="bg-white text-zinc-900">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={HeroImage}
                        alt="Luxury fashion hero background"
                        fill
                        className="object-cover object-center brightness-[0.65] scale-105 transition-transform duration-700"
                        priority // important for hero!
                        placeholder="blur" // nice loading effect
                        quality={85}
                    />
                </div>

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="container mx-auto px-6 text-center z-10 relative">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 italic text-white drop-shadow-lg">
                        DEFINING STYLE.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto font-light drop-shadow-md">
                        StyleVerse is more than a store. It’s a curated universe where fashion meets individuality.
                    </p>
                </div>

                {/* Optional decorative element - keep or remove */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-zinc-200 rounded-full blur-3xl opacity-30" />
            </section>

            {/* Our Story Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Column */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">OUR STORY</h2>
                        <p className="text-zinc-600 leading-relaxed">
                            Founded in 2024, StyleVerse began with a simple observation: fashion was becoming too fast and too impersonal. We wanted to create a space where every piece tells a story of craftsmanship and character.
                        </p>
                        <p className="text-zinc-600 leading-relaxed">
                            We scout the globe for designers who challenge the status quo, ensuring that our collection isn't just "on-trend," but ahead of the curve.
                        </p>
                    </div>

                    {/* Image Column */}
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-zinc-100">
                        <Image
                            src={OurStoryImage}
                            alt="StyleVerse team showcasing traditional and modern craftsmanship"
                            fill
                            className="object-cover object-center hover:scale-105 transition-transform duration-700"
                            quality={85}
                            placeholder="blur"
                        />
                    </div>
                </div>
            </section>
            {/* Core Values */}
            <section className="bg-zinc-900 text-white py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">THE STYLEVERSE ETHOS</h2>
                        <div className="h-1 w-20 bg-white mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4 flex flex-col items-center">
                            <div className="p-4 bg-zinc-800 rounded-full">
                                <Sparkles className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-semibold">Curation First</h3>
                            <p className="text-zinc-400 font-light">We don't sell everything. We only sell the best. Quality always trumps quantity.</p>
                        </div>

                        <div className="space-y-4 flex flex-col items-center">
                            <div className="p-4 bg-zinc-800 rounded-full">
                                <Leaf className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-semibold">Sustainable Soul</h3>
                            <p className="text-zinc-400 font-light">Ethical sourcing is at the heart of our supply chain. Style shouldn't cost the Earth.</p>
                        </div>

                        <div className="space-y-4 flex flex-col items-center">
                            <div className="p-4 bg-zinc-800 rounded-full">
                                <Globe className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-semibold">Inclusive Reach</h3>
                            <p className="text-zinc-400 font-light">Fashion is a universal language. Our sizes and styles reflect the world we live in.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-b border-zinc-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold">50k+</div>
                            <div className="text-zinc-500 text-sm uppercase tracking-widest mt-2">Happy Stylists</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">120+</div>
                            <div className="text-zinc-500 text-sm uppercase tracking-widest mt-2">Premium Brands</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">24/7</div>
                            <div className="text-zinc-500 text-sm uppercase tracking-widest mt-2">Active Support</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">Worldwide</div>
                            <div className="text-zinc-500 text-sm uppercase tracking-widest mt-2">Shipping</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to join the Verse?</h2>
                <button className="bg-zinc-900 text-white px-8 py-3 rounded-full hover:bg-zinc-800 transition-all flex items-center gap-2 mx-auto">
                    <ShoppingBag className="w-5 h-5" />
                    Shop the Collection
                </button>
            </section>
        </div>
    );
};

export default AboutPage;