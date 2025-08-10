import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { formatCurrency } from "../utils/currency";
import { useNavigate } from "react-router-dom";

function CheckoutForm({ totalPrice, cart }) {
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [orderType, setOrderType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [address, setAddress] = useState({ street: "", city: "", phone: "" });
  const [reservation, setReservation] = useState({
    guests: 1,
    date: "",
    time: "",
    specialRequest: "",
  });

  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const stripe = useStripe();
  const elements = useElements();

  // Create Payment Intent for card
  useEffect(() => {
    if (paymentMethod === "card" && totalPrice > 0) {
      axios
        .post("http://localhost:3000/create-payment-intent", { totalPrice })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => {
          console.error("Error creating payment intent", err);
          toast.error("Failed to initialize payment");
        });
    }
  }, [totalPrice, paymentMethod]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate based on order type
    if (
      orderType === "delivery" &&
      (!address.street || !address.city || !address.phone)
    ) {
      toast.error("Please complete the delivery address.");
      return;
    }

    if (
      orderType === "dine-in" &&
      (!reservation.date || !reservation.time || !reservation.guests)
    ) {
      toast.error("Please complete reservation details.");
      return;
    }

    const orderData = {
      email: user?.email,
      price: totalPrice,
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      status: paymentMethod === "card" ? "Order pending" : "Cash on delivery",
      // transactionId: paymentMethod === "card" ? paymentIntent?.id : undefined,
      orderType,
      paymentMethod,
      cartItems: cart.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        menuItemId: item.menuItemId,
      })),
      ...(orderType === "delivery" && { address }),
      ...(orderType === "dine-in" && { reservationDetails: reservation }),
    };

    // Process Card Payment
    if (paymentMethod === "card") {
      if (!stripe || !elements) return;
      const card = elements.getElement(CardElement);
      if (!card) return;

      const { error, paymentMethod: stripePaymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (error) {
        console.log("[Stripe error]", error);
        setCardError(error.message);
        return;
      }

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Anonymous",
              email: user?.email || "unknown",
            },
          },
        });

      if (confirmError) {
        console.log("[Payment confirm error]", confirmError);
        setCardError(confirmError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        setCardError("");

        // Add transaction ID to order
        orderData.transactionId = paymentIntent.id;

        try {
          const res = await createOrder(orderData).unwrap();
          console.log("Order saved:", res);
          toast.success("Order placed successfully!");
          navigate("/orders");
        } catch (err) {
          console.error("Failed to save order", err);
          toast.error("Order failed to save");
        }
      }
    }

    // Handle Cash Payment
    if (paymentMethod === "cash") {
      try {
        const res = await createOrder(orderData).unwrap();
        console.log("Order saved:", res);
        toast.success("Cash order placed successfully!");
        navigate("/orders");
      } catch (err) {
        console.error("Failed to save order", err);
        toast.error("Order failed to save");
      }
    }
  };

  return (
    <div className="flex flex-col items-start justify-start gap-8 sm:flex-row">
      {/* Left Side - Order Summary */}
      <div className="w-full space-y-6 md:w-1/2">
        <div>
          <h4 className="mb-2 text-lg font-semibold">Order Summary</h4>
          <p>Total price: ${totalPrice}</p>
          <p>Number of Items: {cart.length}</p>
        </div>

        {/* Order Type */}
        <div>
          <label className="mb-2 block font-medium">Order Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={orderType === "delivery"}
                onChange={() => setOrderType("delivery")}
              />
              Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="orderType"
                value="dine-in"
                checked={orderType === "dine-in"}
                onChange={() => setOrderType("dine-in")}
              />
              Dine-In
            </label>
          </div>
        </div>

        {/* Delivery Address Form */}
        {orderType === "delivery" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="input-bordered input w-full focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="input-bordered input w-full focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className="input-bordered input w-full focus:outline-none"
              required
            />
          </div>
        )}

        {/* Dine-In Reservation Form */}
        {orderType === "dine-in" && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Number of Guests"
              value={reservation.guests}
              onChange={(e) =>
                setReservation({ ...reservation, guests: e.target.value })
              }
              className="input-bordered input w-full focus:outline-none"
              required
            />
            <input
              type="date"
              value={reservation.date}
              onChange={(e) =>
                setReservation({ ...reservation, date: e.target.value })
              }
              className="input-bordered input w-full focus:outline-none"
              required
            />
            <input
              type="time"
              value={reservation.time}
              onChange={(e) =>
                setReservation({ ...reservation, time: e.target.value })
              }
              className="input-bordered input w-full focus:outline-none"
              required
            />
            <textarea
              placeholder="Special Request (optional)"
              value={reservation.specialRequest}
              onChange={(e) =>
                setReservation({
                  ...reservation,
                  specialRequest: e.target.value,
                })
              }
              className="textarea-bordered textarea w-full focus:outline-none"
            ></textarea>
          </div>
        )}

        {/* Payment Method Selector */}
        <div>
          <label className="mb-2 mt-4 block font-medium">Payment Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Cash on Delivery
            </label>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Section */}
      {paymentMethod === "card" && (
        <div className="md-1/3 card w-full max-w-sm shrink-0 space-y-4 rounded-xl bg-white px-4 py-8 shadow-2xl">
          <h4 className="text-lg font-semibold">Process your payment</h4>
          <h5 className="font-medium">Credit/Debit Card</h5>
          <form onSubmit={handleSubmit}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
            <button
              type="submit"
              className="btn mt-5 w-full bg-black text-white disabled:opacity-60"
              disabled={!stripe || isCreating}
            >
              {isCreating ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span>Pay {formatCurrency(totalPrice)}</span>
              )}
            </button>
          </form>
          {cardError && <p className="text-red-500">{cardError}</p>}
        </div>
      )}

      {/* Cash Payment - Just Show Place Order Button */}
      {paymentMethod === "cash" && (
        <div className="card w-full max-w-sm space-y-4 rounded-xl bg-white px-4 py-8 shadow-2xl">
          <h4 className="text-lg font-semibold">Cash on Delivery</h4>
          <p>
            Your order will be placed and you’ll pay upon delivery or dine-in.
          </p>
          <button
            onClick={handleSubmit}
            className="btn w-full bg-green-600 text-white hover:bg-green-700"
            disabled={isCreating}
          >
            {isCreating ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;
