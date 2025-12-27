import { baseApi } from "@/redux/baseApi";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCategory: builder.query({
            query: () => ({
                url: "/category",
                method: "GET",
            }),
        }),

    }),
});

export const {
    useAllCategoryQuery
} = categoryApi;