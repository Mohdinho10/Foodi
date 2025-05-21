import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { notFound, errorHandler } from "./middleware/ErrorMiddleware.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));



app.post("/jwt", async (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res
    .cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "Strict", // Protects against CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .send({ success: true });
});


app.use("/api/menu", menuRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose connected successfully"))
  .catch((err) => err);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
