import Cart from "../models/cartModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const getCartByEmail = asyncHandler(async (req, res) => {
  const email = req.query.email;
  // console.log(email);
  const query = { email: email };

  const cart = await Cart.find(query).exec();

  res.status(200).json(cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { menuItemId, name, recipe, image, price, quantity, email } = req.body;

  // exiting menu item
  const existingCartItem = await Cart.findOne({ email, menuItemId });
  // console.log(existingCartItem)
  if (existingCartItem) {
    return res
      .status(400)
      .json({ message: "Product already exists in the cart!" });
  }

  const cartItem = await Cart.create({
    menuItemId,
    name,
    recipe,
    image,
    price,
    quantity,
    email,
  });

  res.status(201).json(cartItem);
});

export const deleteCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id;

  const deletedCart = await Cart.findByIdAndDelete(cartId);

  if (!deletedCart) {
    return res.status(401).json("Cart Items not found!");
  }

  res.status(200).json("Cart Item Deleted Successfully!");
});

export const updateCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id;

  const { menuItemId, name, recipe, image, price, quantity, email } = req.body;

  const updatedCart = await Cart.findByIdAndUpdate(
    cartId,
    { menuItemId, name, recipe, image, price, quantity, email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCart) {
    res.status(404);
    throw new Error({ message: "Cart Item not found" });
  }

  res.status(200).json(updatedCart);
});

export const getCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id;

  const cartItem = await Cart.findById(cartId);

  res.status(200).json(cartItem);
});
