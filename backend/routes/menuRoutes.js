import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItem,
  getPopularDishes,
  updateMenuItem,
} from "../controllers/menuController.js";

const router = Router();

// GET popular items (specific route first to avoid :id conflict)
router.get("/popular", getPopularDishes);

// GET all menu items
router.get("/", getAllMenuItems);

// POST a new menu item
router.post("/", createMenuItem);

// DELETE a menu item by ID
router.delete("/:id", deleteMenuItem);

// GET a single menu item by ID
router.get("/:id", getMenuItem);

// PATCH (update) a menu item by ID
router.patch("/:id", updateMenuItem);

export default router;
