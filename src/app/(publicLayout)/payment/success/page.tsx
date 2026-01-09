import SuccessPayment from "@/components/payment/SuccessPayment";
import { Suspense } from "react";

const PaymentSuccessPage = () => {
    return (
        <div className="w-full flex justify-center">
            <Suspense fallback={<div className="py-20 flex flex-col items-center">Verifying Transaction...</div>}>
                <SuccessPayment />
            </Suspense>
        </div>
    );
};

export default PaymentSuccessPage;
