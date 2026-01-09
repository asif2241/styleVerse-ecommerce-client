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
        getAllOrders: builder.query({
            query: (params) => ({
                url: "/order/all-orders",
                method: "GET",
                params
            }),
            providesTags: ["ORDERS"]
        }),
        getSingleOrder: builder.query({
            query: ({ orderId }) => ({
                url: `/order/${orderId}`,
                method: "GET",
            })
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetAllOrdersQuery,
    useGetSingleOrderQuery
} = productApi;