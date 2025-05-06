import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
} from "../controllers/menuController.js";

const router = Router();

// get all menu items
router.get("/", getAllMenuItems);

// post a menu item
router.post("/", createMenuItem);

// delete a menu item
router.delete("/:id", deleteMenuItem);

// get single menu item
router.get("/:id", getMenuItem);

// update single menu item
router.patch("/:id", updateMenuItem);

export default router;
