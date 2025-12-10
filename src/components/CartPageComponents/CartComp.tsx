"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import ShippingForm from "./ShippingForm";

const steps = [
    { id: 1, title: "Shopping Cart" },
    { id: 2, title: "Shipping Address" },
];

// ❗ Replace this with Zustand cart data later
// import useCartStore from "@/stores/cartStore"
// const { cart, removeFromCart } = useCartStore();
const dummyCart = [
    {
        id: "1",
        name: "Casual Blue Shirt",
        price: 24.99,
        quantity: 2,
        selectedSize: "M",
        selectedColor: "Blue",
        images: [
            "https://res.cloudinary.com/drdaqqxwz/image/upload/v1758546466/samples/shoe.jpg",
        ],
    },
];

export default function CartClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeStep = parseInt(searchParams.get("step") || "1");

    // Real: const cart = cartStore.cart
    const cart = dummyCart;

    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const goToStep = (step: number) => {
        router.push(`/cart?step=${step}`, { scroll: false });
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl px-4 py-10">
            {/* TITLE */}
            <h1 className="text-2xl font-semibold text-center">Your Shopping Cart</h1>

            {/* STEP INDICATOR */}
            <div className="flex items-center justify-center gap-10">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex flex-col items-center pb-2 border-b-2 ${activeStep === step.id
                                ? "border-black text-black"
                                : "border-gray-200 text-gray-400"
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep === step.id ? "bg-black" : "bg-gray-400"
                                }`}
                        >
                            {step.id}
                        </div>
                        <span className="text-sm font-medium">{step.title}</span>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* LEFT CONTENT */}
                <div className="w-full lg:w-7/12 shadow-md border p-6 rounded-lg bg-white">
                    {activeStep === 1 ? (
                        cart.length > 0 ? (
                            cart.map((item) => (
                                <div
                                    key={item.id + item.selectedSize}
                                    className="flex items-center justify-between mb-6"
                                >
                                    {/* IMAGE + DETAILS */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden">
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Size: {item.selectedSize}
                                            </p>
                                            <p className="font-medium mt-1">${item.price}</p>
                                        </div>
                                    </div>

                                    {/* DELETE */}
                                    <button className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-sm">
                                Your cart is empty.
                            </p>
                        )
                    ) : (
                        <ShippingForm />
                    )}
                </div>

                {/* RIGHT SUMMARY */}
                <div className="w-full lg:w-5/12 shadow-md border p-6 rounded-lg bg-white h-max">
                    <h2 className="font-semibold mb-4">Order Summary</h2>

                    <div className="flex justify-between text-sm mb-2">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                        <span>Shipping</span>
                        <span>Calculated in next step</span>
                    </div>

                    <hr className="my-4 border-gray-200" />

                    {activeStep === 1 ? (
                        <button
                            onClick={() => goToStep(2)}
                            className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            Continue <ArrowRight size={14} />
                        </button>
                    ) : (
                        <button
                            className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            Proceed to Payment <ArrowRight size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
