import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "Order pending" },
    transactionId: { type: String },
    paymentMethod: { type: String, required: true },
    paid: { type: Boolean, default: false },
    orderType: { type: String, enum: ["delivery", "dine-in"], required: true },
    address: {
      street: String,
      city: String,
      phone: String,
    },
    reservationDetails: {
      guests: Number,
      date: String,
      time: String,
      specialRequest: String,
    },
    cartItems: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
