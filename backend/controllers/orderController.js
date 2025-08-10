import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      orderType,
      address,
      reservationDetails,
      paymentMethod,
      email,
      cartItems,
      price,
      quantity,
      status,
      transactionId,
    } = req.body;

    // Validate required fields
    if (!orderType || !paymentMethod || !email || !cartItems || !price) {
      return res.status(400).json({ error: "Missing required order data" });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Conditional validation
    if (orderType === "delivery") {
      if (!address?.street || !address?.city || !address?.phone) {
        return res.status(400).json({ error: "Delivery address is required" });
      }
    } else if (orderType === "dine-in") {
      if (
        !reservationDetails?.date ||
        !reservationDetails?.time ||
        !reservationDetails?.guests
      ) {
        return res.status(400).json({
          error: "Reservation details are required for dine-in orders",
        });
      }
    }

    // Construct the new order object
    const newOrder = await Order.create({
      email,
      price,
      quantity,
      status,
      transactionId,
      paymentMethod,
      orderType,
      address: orderType === "delivery" ? address : undefined,
      reservationDetails:
        orderType === "dine-in" ? reservationDetails : undefined,
      cartItems,
      paid: paymentMethod === "card",
    });

    // Clear cart after order
    await Cart.deleteMany({ email });

    res.status(201).json({
      message: "Order created and cart cleared successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const email = req.query.email;
  // console.log(email);
  const query = { email: email };

  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  const orders = await Order.find(query).sort({ createdAt: -1 }).exec();

  if (!orders) {
    return res.status(404).send({ message: "No orders found" });
  }

  res.status(200).json(orders);
});

// For admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  console.log("Updating order status to:", status);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true } // return the updated doc
  );

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ message: "Status updated", order });
});

export const deleteCompletedOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status !== "completed" && order.status !== "delivered") {
    return res
      .status(400)
      .json({ message: "Only completed/delivered orders can be deleted" });
  }

  await order.deleteOne();
  res.json({ message: "Order deleted" });
});
