import { baseApi } from "@/redux/baseApi";




export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderPayload) => ({
                url: "/order",
                method: "POST",
                body: orderPayload,
            }),
            invalidatesTags: ["ORDERS"]
        }),
    }),
});

export const {
    useCreateOrderMutation
} = productApi;