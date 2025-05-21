import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protected routes
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.decoded = decoded; // <-- ADD THIS
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});


// middleware/authMiddleware.js
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
});
