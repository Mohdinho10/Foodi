import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import {
  createUser,
  deleteUser,
  getAdmin,
  getAllUsers,
  makeAdmin,
} from "../controllers/userController.js";

const router = Router();

router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.post("/", createUser);
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);
router.get("/admin/:email", isAuthenticated, getAdmin);
router.patch("/admin/:id", isAuthenticated, isAdmin, makeAdmin);

export default router;
