export function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD", // Change the currency to USD
  }).format(value);
}
