import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { notFound, errorHandler } from "./middleware/ErrorMiddleware.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

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
