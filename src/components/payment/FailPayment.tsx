"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCcw, LifeBuoy, ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FailPayment() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    // Extract data from URL
    const transactionId = searchParams.get("transactionId");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");

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

                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-red-50 p-4 rounded-full">
                        <AlertCircle size={48} className="text-red-500" />
                    </div>
                </div>

                {/* Status Text */}
                <h1 className="text-3xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">
                    Payment Failed
                </h1>
                <p className="text-gray-500 font-medium mb-8">
                    {message || "We couldn't process your transaction at this time."}
                </p>

                {/* Transaction Card */}
                <div className="bg-red-50/50 rounded-3xl p-6 mb-8 border border-red-100 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-red-400 tracking-widest">Attempted Amount</span>
                        <span className="text-lg font-black text-gray-900">{amount} TK</span>
                    </div>

                    <div className="pt-4 border-t border-dashed border-red-200">
                        <label className="text-[10px] font-bold uppercase text-red-400 tracking-widest block mb-2">
                            Transaction Reference
                        </label>
                        <div
                            onClick={handleCopy}
                            className="flex items-center justify-between bg-white border border-red-100 rounded-xl p-3 cursor-pointer hover:border-red-300 transition-colors group"
                        >
                            <span className="text-xs font-mono text-gray-600 truncate mr-2">
                                {transactionId}
                            </span>
                            {copied ? (
                                <Check size={14} className="text-green-500" />
                            ) : (
                                <Copy size={14} className="text-gray-400 group-hover:text-red-500" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/cart?step=2")}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                    >
                        Try Again <RefreshCcw size={18} />
                    </button>

                    <Link
                        href="/contact"
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-400 hover:text-black transition-colors"
                    >
                        <LifeBuoy size={16} /> Contact Support
                    </Link>
                </div>

                {/* Back Link */}
                <button
                    onClick={() => router.push("/")}
                    className="mt-6 text-xs font-semibold text-gray-400 flex items-center justify-center gap-1 mx-auto hover:text-black"
                >
                    <ArrowLeft size={12} /> Back to Home
                </button>
            </div>
        </div>
    );
}