import EditProductFormClient from "@/components/dashboar/EditProductPageClient";
import { IProduct } from "@/types/product.interface";

type Props = {
    params: { slug: string };
};

export default async function EditProductPage({ params }: Props) {
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
            {/* here will be EditProductPageClient.tsx */}
            <EditProductFormClient initialProduct={product}></EditProductFormClient>
        </>
    );
}