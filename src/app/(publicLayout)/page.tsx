import { HomeCarousel } from "@/components/HomePageComp/HomeCarousel";
import LogoMarquee from "@/components/HomePageComp/MarqueeComp";
import ProductCard from "@/components/HomePageComp/ProductCard";
import { Carousel } from "@/components/ui/carousel";


export default function Home() {
    return (
        <>
            {/* <Head>
      
      </Head> */}
            <main>
                <HomeCarousel></HomeCarousel>
                <LogoMarquee></LogoMarquee>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </main>
        </>
    );
}