import { baseApi } from "@/redux/baseApi";

export interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}


export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (productData) => ({
                url: "/products/create",
                method: "POST",
                body: productData,
            }),
        }),
        getAllProducts: builder.query({
            query: (params) => ({
                url: "/products",
                method: "GET",
                params
            }),
            providesTags: ["PRODUCTS"]
        }),

        updateProduct: builder.mutation({
            query: ({ productId, formData }) => ({
                url: `/products/${productId}`,
                method: "PATCH",
                body: formData
            }),
            invalidatesTags: ["PRODUCTS"]
        }),
        deleteProduct: builder.mutation({
            query: ({ productId }) => ({
                url: `/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PRODUCTS"]
        }),
    }),
});

export const {
    useAddProductMutation,
    useGetAllProductsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,
} = productApi;