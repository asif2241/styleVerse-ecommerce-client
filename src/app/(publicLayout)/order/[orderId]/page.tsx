// app/admin/orders/[orderId]/page.tsx (Server Component)
import OrderDetailsPage from "@/components/shared/OrderDetailsPage";

type Props = {
    params: Promise<{ orderId: string }>;
};

export default async function OrderDetailsPageServer({ params }: Props) {
    const { orderId } = await params;

    return <OrderDetailsPage orderId={orderId} />;
}