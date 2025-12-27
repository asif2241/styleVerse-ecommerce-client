import { z } from "zod";

// --- Zod Schema for Validation ---
export const shippingFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" }),

    email: z
        .string()
        .email({ message: "Please enter a valid email address" }),

    phone: z
        .string()
        .min(11, { message: "Phone number must be at least 11 digits" })
        .regex(/^\d+$/, { message: "Phone number must contain only digits" }), // Optional: ensures only numbers

    address: z
        .string()
        .min(5, { message: "Address must be at least 5 characters long" }),

    city: z
        .string()
        .min(2, { message: "City name is too short" }),
});

// --- TypeScript Type Inferred from Schema ---
export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

// --- Cart Item Type (If you don't have it yet) ---
// Based on your previous code usage
// export type CartItemType = {
//     _id: string;
//     title: string;
//     price: number;
//     images: string[];
//     selectedSize: string;
//     selectedColor: number; // Index of the selected image/color
//     quantity: number;
//     brand: string;
//     // ... add other product fields if needed
// };

// export type CartItemsType = CartItemType[];







export type CartItemType = {
    productId: string;
    title: string;
    slug: string;
    image: string;
    price: number;
    color?: string;
    selectedSize: string;
    quantity: number;
};


export type CartItemsType = CartItemType[];

export type CartStoreStateType = {
    cart: CartItemsType;
    hasHydrated: boolean;
};

export type CartStoreActionsType = {
    addToCart: (product: CartItemType) => void;
    removeFromCart: (product: CartItemType) => void;
    clearCart: () => void;
};

//this is for category maping in the PublicNavbar
export interface Category {
    _id: string;
    name: string;
    children: Category[];
}