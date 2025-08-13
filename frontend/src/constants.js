export const BASE_URL =
  // eslint-disable-next-line no-undef
  import.meta.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export const MENU_URL = "/api/menu";
export const CART_URL = "/api/cart";
export const USERS_URL = "/api/users";
export const ORDER_URL = "/api/orders";
