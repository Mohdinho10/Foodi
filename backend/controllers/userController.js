import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) throw new Error("No User found!");

  res.status(200).json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const userdata = req.body;
  const query = { email: user.email };

  const existingUser = await User.findOne(query);

  if (existingUser) res.status(400).send("User already exists");

  const user = await User.create(userdata);

  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted successfully!" });
});

export const getAdmin = asyncHandler(async (req, res) => {
  const email = req.params.email;
  const query = { email: email };

  const user = await User.findOne(query);
  // console.log(user)
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  let admin = false;

  if (user) {
    admin = user?.role === "admin";
  }
  res.status(200).json({ admin });
});

export const makeAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, photoURL, role } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(updatedUser);
});
