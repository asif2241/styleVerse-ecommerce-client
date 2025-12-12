import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShippingFormInputs } from "@/types";

type ShippingStoreType = {
    shippingData: ShippingFormInputs | null;
    setShippingData: (data: ShippingFormInputs) => void;
};

export const useShippingStore = create<ShippingStoreType>()(
    persist(
        (set) => ({
            shippingData: null,
            setShippingData: (data) => set({ shippingData: data }),
        }),
        { name: "shipping-store" }
    )
);
