import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  menuItemId: String,
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  recipe: String,
  image: String,
  price: Number,
  quantity: Number,
  email: {
    type: String,
    true: true,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
