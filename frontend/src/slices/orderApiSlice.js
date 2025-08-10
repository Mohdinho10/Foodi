// src/slices/orderApiSlice.js
import { ORDER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `${ORDER_URL}`, // e.g., /api/orders
        method: "POST",
        body: orderData,
        credentials: "include", // if using cookies with JWT
      }),
    }),
    getMyOrders: builder.query({
      query: (email) => ({
        url: `${ORDER_URL}/my-orders`,
        method: "GET",
        params: { email },
        credentials: "include",
      }),
    }),
    getAllOrders: builder.query({
      query: () => `${ORDER_URL}`,
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${ORDER_URL}/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    deleteCompletedOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteCompletedOrderMutation,
} = orderApiSlice;
