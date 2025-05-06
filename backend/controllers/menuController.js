import Menu from "../models/menuModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllMenuItems = asyncHandler(async (req, res) => {
  const menus = await Menu.find({}).sort({ createdAt: -1 });

  res.status(200).json(menus);
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const newItemData = req.body;

  const newItem = await Menu.create(newItemData);

  res.status(200).json(newItem);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  const deletedItem = await Menu.findByIdAndDelete(itemId);

  if (!deletedItem) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.status(200).json({ message: "Menu Item deleted successfully!" });
});

export const getMenuItem = asyncHandler(async (req, res) => {
  const menuId = req.params.id;

  const menu = await Menu.findById(menuId);

  res.status(200).json(menu);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const menuId = req.params.id;
  const { name, recipe, image, category, price } = req.body;

  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    { name, recipe, image, category, price },
    { new: true, runValidator: true }
  );

  if (!updatedMenu) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.status(200).json(updatedMenu);
});
