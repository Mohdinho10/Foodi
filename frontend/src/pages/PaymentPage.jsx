import CheckoutForm from "../components/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useGetCartByEmailQuery } from "../slices/cartApiSlice";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function Payment() {
  const user = useSelector((state) => state.auth.userInfo);

  const { data: cart = [] } = useGetCartByEmailQuery(user?.email, {
    skip: !user?.email, // skip query if user is not yet loaded
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = parseFloat(cartTotal.toFixed(2));

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-28 xl:px-24">
      <Elements stripe={stripePromise}>
        <CheckoutForm totalPrice={totalPrice} cart={cart} />
      </Elements>
    </div>
  );
}

export default Payment;
