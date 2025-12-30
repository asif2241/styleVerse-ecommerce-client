"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SuccessPayment() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    // Extract data from URL
    const transactionId = searchParams.get("transactionId");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");

    const handleCopy = () => {
        if (transactionId) {
            navigator.clipboard.writeText(transactionId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 text-center border border-gray-100">

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                        <div className="relative bg-green-500 p-4 rounded-full">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Status Text */}
                <h1 className="text-3xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">
                    {status === "success" ? "Order Confirmed" : "Payment Received"}
                </h1>
                <p className="text-gray-500 font-medium mb-8">
                    {message || "Your payment has been processed successfully."}
                </p>

                {/* Transaction Card */}
                <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Amount Paid</span>
                        <span className="text-xl font-black text-orange-600">${amount}</span>
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-200">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">
                            Transaction ID
                        </label>
                        <div
                            onClick={handleCopy}
                            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-black transition-colors group"
                        >
                            <span className="text-xs font-mono text-gray-600 truncate mr-2">
                                {transactionId}
                            </span>
                            {copied ? (
                                <Check size={14} className="text-green-500" />
                            ) : (
                                <Copy size={14} className="text-gray-400 group-hover:text-black" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/products")}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                    >
                        Continue Shopping <ShoppingBag size={18} />
                    </button>

                    {/* <Link
                        href="/orders"
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-400 hover:text-black transition-colors"
                    >
                        View Order History <ArrowRight size={16} />
                    </Link> */}
                </div>

                {/* Footer Support
                <p className="mt-8 text-[11px] text-gray-400 px-6 leading-relaxed">
                    A confirmation email has been sent to your inbox.
                    If you have any questions, please contact our support.
                </p> */}
            </div>
        </div>
    );
}