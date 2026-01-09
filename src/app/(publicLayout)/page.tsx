import FeaturedProducts from "@/components/HomePageComp/FeaturedProducts";
import { HomeCarousel } from "@/components/HomePageComp/HomeCarousel";
import LogoMarquee from "@/components/HomePageComp/MarqueeComp";
import Newsletter from "@/components/HomePageComp/Newxletter";
import ServiceFeaturesSection from "@/components/HomePageComp/ServiceFeaturesSection";
import { Suspense } from "react"; // Import Suspense

export default function Home() {
    return (
        <>
            <main>
                <HomeCarousel />
                <LogoMarquee />

                {/* Wrap FeaturedProducts here */}
                <Suspense fallback={<FeaturedLoadingSkeleton />}>
                    <FeaturedProducts />
                </Suspense>

                <ServiceFeaturesSection />
                <Newsletter />
            </main>
        </>
    );
}

// A simple loading skeleton to match your grid layout
function FeaturedLoadingSkeleton() {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="max-w-[1500px] w-11/12 mx-auto">
                <div className="h-10 w-64 bg-gray-200 animate-pulse mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] w-full bg-gray-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}