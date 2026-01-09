import { baseApi } from "@/redux/baseApi";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCategory: builder.query({
            query: () => ({
                url: "/category",
                method: "GET",
            }),
            providesTags: ["CATEGORIES"]
        }),
        addCategory: builder.mutation({
            query: (category) => ({
                url: "/category/create",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["CATEGORIES"]
        }),
    }),
});

export const {
    useAllCategoryQuery,
    useAddCategoryMutation
} = categoryApi;