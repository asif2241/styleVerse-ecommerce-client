import SuccessPayment from "@/components/payment/SuccessPayment";
import { Suspense } from "react";

const PaymentSuccessPage = () => {
    return (
        <div className="w-full flex justify-center">
            <Suspense fallback={<div className="py-10">Loading cart...</div>}>
                <SuccessPayment></SuccessPayment>
            </Suspense>
        </div>
    );
};

export default PaymentSuccessPage;
