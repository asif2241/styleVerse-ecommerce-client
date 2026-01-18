import { baseApi } from "@/redux/baseApi";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllUsers: builder.query({
            query: (params) => ({
                url: "/user/all-users",
                method: "GET",
                params
            }),
            providesTags: ["USERS"]
        }),
        getSingleUser: builder.query({
            query: (params) => ({
                url: `/user/${params}`,
                method: "GET",
            })
        }),
        getMe: builder.query({
            query: () => ({
                url: `/user/me`,
                method: "GET",
            })
        }),
        updateUser: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/user/${id}`,
                method: "PATCH",
                body: formData
            }),
            invalidatesTags: ["USERS"]
        }),
        blockUser: builder.mutation({
            query: (params) => ({
                url: `/user/block/${params}`,
                method: "PATCH",
            }),
            invalidatesTags: ["USERS"]
        }),
        unblockUser: builder.mutation({
            query: (params) => ({
                url: `/user/unblock/${params}`,
                method: "PATCH",
            }),
            invalidatesTags: ["USERS"]
        }),

    }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery, useBlockUserMutation, useUnblockUserMutation, useUpdateUserMutation, useGetMeQuery } = usersApi;