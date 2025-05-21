import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  addToCart,
  deleteCart,
  getCart,
  getCartByEmail,
  updateCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", getCartByEmail);
router.post("/", addToCart);
router.delete("/:id", deleteCart);
router.put("/:id", updateCart);
router.get("/:id", getCart);

export default router;
