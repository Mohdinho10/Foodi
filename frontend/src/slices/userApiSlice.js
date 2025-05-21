import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin only)
    getAllUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    // Create a new user
    createUser: builder.mutation({
      query: (userData) => ({
        url: USERS_URL,
        method: "POST",
        body: userData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),

    // Delete a user (admin only)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // Get admin status by email
    getAdminStatus: builder.query({
      query: (email) => ({
        url: `${USERS_URL}/admin/${email}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Make a user an admin (admin only)
    makeAdmin: builder.mutation({
      query: ({ id, userData }) => ({
        url: `${USERS_URL}/admin/${id}`,
        method: "PATCH",
        body: userData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),

});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useLogoutMutation,
  useDeleteUserMutation,
  useGetAdminStatusQuery,
  useMakeAdminMutation,
} = usersApiSlice;
