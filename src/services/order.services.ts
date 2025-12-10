// "use server"

// import { serverFetch } from "@/lib/server-fetch";
// import { cookies } from "next/headers";

// export const createOrder = async (_currentState: any, formData: FormData) => {
//   try {
//     // Get shipping data from form
//     const name = formData.get('name') as string;
//     const email = formData.get('email') as string;
//     const phone = formData.get('phone') as string;
//     const address = formData.get('address') as string;
//     const city = formData.get('city') as string;
//     const district = formData.get('district') as string;
//     const postalCode = formData.get('postalCode') as string;

//     // Get cart items (you'll need to pass this from the client)
//     const cartItemsJson = formData.get('cartItems') as string;
//     const cartItems = JSON.parse(cartItemsJson);

//     // Validate required fields
//     if (!name || !email || !phone || !address || !city || !district) {
//       return {
//         success: false,
//         message: "Please fill in all required fields"
//       };
//     }

//     if (!cartItems || cartItems.length === 0) {
//       return {
//         success: false,
//         message: "Cart is empty"
//       };
//     }

//     // Format shipping address as a single string
//     const shippingAddress = `${address}, ${city}, ${district}${postalCode ? ', ' + postalCode : ''}`;

//     // Format products array according to your Order model
//     const products = cartItems.map((item: any) => ({
//       product: item._id,           // MongoDB ObjectId of the product
//       quantity: item.quantity,      // Number of items
//       size: item.selectedSize,      // Selected size
//       unitPrice: item.discountPrice || item.price  // Price per unit
//     }));

//     // Create order payload
//     // Note: Your backend will calculate totalAmount, deliveryCharge, and finalAmount
//     // in the pre-validate hook, so we don't need to send them
//     const orderData = {
//       products: products,
//       shippingAddress: shippingAddress,
//       discount: 0, // You can add discount logic here
//       // user will be set from the authenticated user on backend
//       // totalAmount, deliveryCharge, finalAmount will be calculated by backend
//     };

//     // Make API call to create order
//     const res = await serverFetch.post("/orders/create", {
//       body: JSON.stringify(orderData),
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });

//     const result = await res.json();

//     if (result.success) {
//       return {
//         success: true,
//         message: "Order placed successfully!",
//         data: result.data
//       };
//     }

//     return {
//       success: false,
//       message: result.message || "Failed to create order"
//     };

//   } catch (error: any) {
//     // Re-throw NEXT_REDIRECT errors
//     if (error?.digest?.startsWith('NEXT_REDIRECT')) {
//       throw error;
//     }

//     console.error('Create order error:', error);
//     return {
//       success: false,
//       message: process.env.NODE_ENV === 'development'
//         ? error.message
//         : "Failed to place order. Please try again."
//     };
//   }
// };