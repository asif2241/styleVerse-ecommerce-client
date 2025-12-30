/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { shippingFormSchema, ShippingFormInputs } from "@/types";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { useEffect } from "react";
import { useCreateOrderMutation } from "@/redux/features/order/order.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

const DIVISIONS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna",
  "Barishal", "Sylhet", "Rangpur", "Mymensingh"
];

interface ShippingFormProps {
  onCityChange: (city: string) => void;
}

export default function ShippingForm({ onCityChange }: ShippingFormProps) {
  const { cart, clearCart } = useCartStore();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data } = useUserInfoQuery(undefined);
  const user = data?.data;


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: { city: "" }
  });

  // Watch city changes to update the parent summary fee
  const selectedCity = watch("city");

  useEffect(() => {
    onCityChange(selectedCity);
  }, [selectedCity, onCityChange]);

  const onSubmit = async (data: ShippingFormInputs) => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!user) return toast.error("Please login first to create an order");

    const orderPayload = {
      products: cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        size: item.selectedSize,
      })),
      shippingAddress: `${data.address}, ${data.city}`,
      // Pass other fields if your backend expects them separately
      phone: data.phone,
      email: data.email,
      name: data.name,
    };

    console.log(orderPayload);

    try {
      const response = await createOrder(orderPayload).unwrap();
      console.log(response);

      if (response.data.paymentUrl) {
        clearCart();
        window.location.href = response.data.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Checkout failed");
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="font-bold text-lg border-b pb-2">Shipping Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-bold uppercase">Name</label>
          <input {...register("name")} className="w-full border-b py-2 outline-none text-sm focus:border-black" placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-[10px]">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase">Email</label>
          <input {...register("email")} className="w-full border-b py-2 outline-none text-sm focus:border-black" placeholder="john@example.com" />
          {errors.email && <p className="text-red-500 text-[10px]">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase">Phone</label>
          <input {...register("phone")} className="w-full border-b py-2 outline-none text-sm focus:border-black" placeholder="017xxxxxxxx" />
          {errors.phone && <p className="text-red-500 text-[10px]">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase">City / Division</label>
          <select
            {...register("city")}
            className="w-full border-b py-2 outline-none text-sm focus:border-black bg-transparent"
          >
            <option value="">Select City</option>
            {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.city && <p className="text-red-500 text-[10px]">{errors.city.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-gray-500 font-bold uppercase">Full Address</label>
          <input {...register("address")} className="w-full border-b py-2 outline-none text-sm focus:border-black" placeholder="House 12, Road 5..." />
          {errors.address && <p className="text-red-500 text-[10px]">{errors.address.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 mt-4 hover:bg-zinc-800 disabled:bg-gray-400"
      >
        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Proceed to Payment <ArrowRight size={18} /></>}
      </button>
    </form>
  );
}