/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useCreateOrderMutation } from "@/redux/features/order/order.api";
import { useCartStore } from "@/stores/useCartStore";
import { Loader2, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function OrderReview({ shippingData, shippingFee, subtotal }: any) {
    const { cart, clearCart } = useCartStore();
    const isLoading = false
    // const [createOrder, { isLoading }] = useCreateOrderMutation();

    const handlePayment = async () => {
        const payload = {
            products: cart.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                size: item.selectedSize
            })),
            shippingAddress: `${shippingData.address}, ${shippingData.city}`,
        };

        // try {
        //     const res = await createOrder(payload).unwrap();
        //     if (res.paymentUrl) {
        //         clearCart();
        //         window.location.href = res.paymentUrl;
        //     }
        // } catch (err) {
        //     toast.error("Something went wrong!");
        // }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold">3. Review & Pay</h2>

            <div className="bg-zinc-50 p-4 rounded-xl border border-dashed border-zinc-300">
                <div className="flex gap-2 items-center text-zinc-500 mb-2">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Shipping To</span>
                </div>
                <p className="font-bold">{shippingData.name}</p>
                <p className="text-sm text-zinc-600">{shippingData.address}, {shippingData.city}</p>
                <p className="text-sm text-zinc-600">{shippingData.phone}</p>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Payment Details</p>
                <div className="flex justify-between text-sm">
                    <span>Order Value</span>
                    <span>{subtotal} TK</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Delivery ({shippingData.city})</span>
                    <span>{shippingFee} TK</span>
                </div>
            </div>

            <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-100 transition-all"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                Pay via SSLCommerz
            </button>
        </div>
    );
}