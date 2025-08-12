export const BASE_URL =
  // eslint-disable-next-line no-undef
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://foodi-6kyv.onrender.com";

export const MENU_URL = "/api/menu";
export const CART_URL = "/api/cart";
export const USERS_URL = "/api/users";
export const ORDER_URL = "/api/orders";
