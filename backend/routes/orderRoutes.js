import { Router } from "express";
import {
  createOrder,
  deleteCompletedOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.put("/:id", verifyToken, verifyAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteCompletedOrder);

export default router;
