import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000", // or wherever your API lives
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access-token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
    credentials: "include", // optional
  }),
  tagTypes: ["User", "Cart", "Menu", "Order"],
  endpoints: () => ({}),
});
