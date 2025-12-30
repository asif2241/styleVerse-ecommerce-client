import FailPayment from "@/components/payment/FailPayment";
import { Suspense } from "react";

const PaymentFailPage = () => {
    return (
        <div className="w-full flex justify-center">
            <Suspense fallback={<div className="py-10">Loading cart...</div>}>
                <FailPayment></FailPayment>
            </Suspense>
        </div>
    );
};

export default PaymentFailPage;
