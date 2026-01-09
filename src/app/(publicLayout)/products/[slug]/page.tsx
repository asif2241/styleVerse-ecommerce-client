import ProductDetails from "@/components/DetailsPageComp/ProductDetails";
import { IProduct } from "@/types/product.interface";

type Props = {
    params: { slug: string };
};

export const generateMetaData = async ({ params }: Props) => {
    const { slug } = await params
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/products/${slug}`);
    const data = await res.json();
    const product: IProduct = data.data;

    return {
        title: product?.slug,
        description: product?.description
    }
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug } = await params
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/products/${slug}`
        //     , {
        //     next: { revalidate: 60 }, // ISR: regenerate every hour
        // }
    );


    const data = await res.json();
    const product: IProduct = data.data;
    return (
        <>
            <ProductDetails product={product}></ProductDetails>
        </>
    );
}