// src/slices/cartApiSlice.js
import { CART_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get cart items by email (requires authentication)
    getCartByEmail: builder.query({
      query: (email) => ({
        url: `${CART_URL}?email=${email}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Cart"],
    }),

    // Add item to cart
    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: CART_URL,
        method: "POST",
        body: cartItem,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Delete item from cart by ID
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `${CART_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update item in cart by ID
    updateCartItem: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `${CART_URL}/${id}`,
        method: "PUT",
        body: updatedData,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Get single cart item by ID
    getCartItem: builder.query({
      query: (id) => ({
        url: `${CART_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetCartByEmailQuery,
  useAddToCartMutation,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
  useGetCartItemQuery,
} = cartApiSlice;
