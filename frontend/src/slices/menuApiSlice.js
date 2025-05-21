// src/slices/menuApiSlice.js
import { MENU_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const menuApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        category = "",
        sort = "default",
        search = "",
      }) => {
        const params = new URLSearchParams({
          page,
          pageSize,
          category,
          sort,
          search,
        });

        return {
          url: `${MENU_URL}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Menu"],
    }),

    // Get single menu item
    getMenuItemById: builder.query({
      query: (id) => ({
        url: `${MENU_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Menu"],
    }),

    // Create menu item
    createMenuItem: builder.mutation({
      query: (newItem) => ({
        url: `${MENU_URL}`,
        method: "POST",
        body: newItem,
        credentials: "include",
      }),
      invalidatesTags: ["Menu"],
    }),

    // Update menu item
    updateMenuItem: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${MENU_URL}/${id}`,
        method: "PATCH",
        body: updatedData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Menu", id },
        "Menu",
      ],
    }),

    // Delete menu item
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `${MENU_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Menu", id }, "Menu"],
    }),
    getPopularDishes: builder.query({
      query: () => `${MENU_URL}/popular`,
      method: "GET",
      providesTags: ["Menu"],
      credentials: "include",
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useGetPopularDishesQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApiSlice;
