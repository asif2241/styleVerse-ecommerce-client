"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Trash2, ArrowRight, ChevronLeft } from "lucide-react";
import ShippingForm from "./ShippingForm";
import { useCartStore } from "@/stores/useCartStore";

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
];

export default function CartClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, removeFromCart } = useCartStore();

  // Local state to track the city selected in ShippingForm
  const [selectedCity, setSelectedCity] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Dynamic Shipping logic
  const shippingFee = activeStep === 1
    ? 0
    : (selectedCity === "Dhaka" ? 60 : selectedCity === "" ? 0 : 120);

  const total = subtotal + shippingFee;

  const goToStep = (step: number) => {
    router.push(`/cart?step=${step}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center">Checkout</h1>

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center gap-10">
        {steps.map((step) => (
          <div key={step.id} className={`flex flex-col items-center gap-2 border-b-2 pb-2 transition-all ${activeStep >= step.id ? "border-black text-black" : "border-gray-200 text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${activeStep >= step.id ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}>
              {step.id}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-7/12 shadow-sm border p-6 rounded-2xl bg-white">
          {activeStep > 1 && (
            <button onClick={() => goToStep(1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-black mb-4 transition-colors">
              <ChevronLeft size={16} /> Back to Cart
            </button>
          )}

          {activeStep === 1 ? (
            <div className="space-y-6">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.productId + item.selectedSize} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.selectedSize}</p>
                        <p className="font-bold mt-1">${item.price}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-gray-400">Your cart is empty.</p>
              )}
            </div>
          ) : (
            <ShippingForm onCityChange={(city) => setSelectedCity(city)} />
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-full lg:w-5/12 border p-8 rounded-3xl bg-gray-50 h-max sticky top-6">
          <h2 className="font-bold text-lg mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping Fee</span>
              <span>
                {activeStep === 1 ? (
                  <span className="italic text-gray-400">Calculated in next step</span>
                ) : (
                  selectedCity ? `${shippingFee} TK` : "Select a city"
                )}
              </span>
            </div>
            <div className="pt-4 border-t flex justify-between items-end">
              <span className="font-bold text-lg">Total</span>
              <span className="text-2xl font-black text-black">
                {activeStep === 1 ? subtotal.toFixed(2) : total.toFixed(2)} {activeStep === 2 && "TK"}
              </span>
            </div>
          </div>

          {/* Remove Summary button in Step 2 as it's inside the ShippingForm */}
          {activeStep === 1 && cart.length > 0 && (
            <button
              onClick={() => goToStep(2)}
              className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 mt-8 font-bold hover:bg-zinc-800 transition-all"
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}