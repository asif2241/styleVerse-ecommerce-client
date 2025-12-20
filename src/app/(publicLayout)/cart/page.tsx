import CartClient from "@/components/CartPageComponents/CartComp";
import { Suspense } from "react";

const CartPage = () => {
    return (
        <div className="w-full flex justify-center">
            <Suspense fallback={<div className="py-10">Loading cart...</div>}>
                <CartClient />
            </Suspense>
        </div>
    );
};

export default CartPage;
