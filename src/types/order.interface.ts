// types/order.ts

export interface Product {
    title: string;
    images: string[];
    price: number;
    discountPrice: number;
}

export interface OrderProductItem {
    product: Product;
    quantity: number;
    size: string;
    unitPrice: number;
    _id: string;
}

export interface User {
    _id: string,
    name: string;
    email: string;
}

export interface Payment {
    transactionId: string;
    status: "PAID" | "UNPAID" | "REFUNDED" | "FAILED" | "CANCELLED"; // adjust if you have more statuses
}

export enum ORDER_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED"
}

// this is only for order details page
export interface ISingleOrder {
    _id: string;
    user: User;
    products: OrderProductItem[];
    discount: number;
    deliveryCharge: number;
    status: ORDER_STATUS;
    shippingAddress: string;
    phone: string;
    email: string;
    name: string;
    totalAmount: number;
    finalAmount: number;
    createdAt: string; // ISO date string
    updatedAt: string;
    __v: number;
    payment?: Payment; // optional, might not exist for unpaid orders
}

