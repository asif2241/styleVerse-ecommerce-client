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

    }),
});

export const {
    useAddProductMutation
} = productApi;