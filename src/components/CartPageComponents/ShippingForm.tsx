"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { shippingFormSchema, ShippingFormInputs } from "@/types";
import { useRouter } from "next/navigation";

export default function ShippingForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingFormInputs>({
        resolver: zodResolver(shippingFormSchema),
    });

    const onSubmit = (data: ShippingFormInputs) => {
        console.log("Shipping Data:", data);
        router.push("/cart?step=2", { scroll: false });
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            {/* NAME */}
            <div>
                <label className="text-xs text-gray-500">Name</label>
                <input
                    {...register("name")}
                    className="w-full border-b border-gray-300 py-2 outline-none text-sm"
                    placeholder="John Doe"
                />
                {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
            </div>

            {/* EMAIL */}
            <div>
                <label className="text-xs text-gray-500">Email</label>
                <input
                    {...register("email")}
                    className="w-full border-b border-gray-300 py-2 outline-none text-sm"
                    placeholder="johndoe@gmail.com"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
            </div>

            {/* PHONE */}
            <div>
                <label className="text-xs text-gray-500">Phone</label>
                <input
                    {...register("phone")}
                    className="w-full border-b border-gray-300 py-2 outline-none text-sm"
                    placeholder="0123456789"
                />
                {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
            </div>

            {/* ADDRESS */}
            <div>
                <label className="text-xs text-gray-500">Address</label>
                <input
                    {...register("address")}
                    className="w-full border-b border-gray-300 py-2 outline-none text-sm"
                    placeholder="123 Main Street"
                />
                {errors.address && (
                    <p className="text-red-500 text-xs">{errors.address.message}</p>
                )}
            </div>

            {/* CITY */}
            <div>
                <label className="text-xs text-gray-500">City</label>
                <input
                    {...register("city")}
                    className="w-full border-b border-gray-300 py-2 outline-none text-sm"
                    placeholder="Dhaka"
                />
                {errors.city && (
                    <p className="text-red-500 text-xs">{errors.city.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
                Proceed to Payment <ArrowRight size={14} />
            </button>
        </form>
    );
}
