import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  createUser,
  deleteUser,
  getAdmin,
  getAllUsers,
  makeAdmin,
  logout
} from "../controllers/userController.js";

const router = Router();

router.get("/", verifyToken, verifyAdmin,  getAllUsers);
router.post("/", createUser);
router.post("/logout", logout)
router.delete("/:id",verifyToken, verifyAdmin,   deleteUser);
router.get("/admin/:email",verifyToken,  getAdmin);
router.patch("/admin/:id",verifyToken, verifyAdmin,   makeAdmin);

export default router;
