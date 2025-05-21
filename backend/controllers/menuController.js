import Menu from "../models/menuModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllMenuItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const category = req.query.category;
  const sortParam = req.query.sort || "default";
  const search = req.query.search || "";

  const query = {};

  if (category) query.category = category;
  if (search) {
    query.name = { $regex: search, $options: "i" }; // case-insensitive match
  }

  // Sorting logic
  let sort = { createdAt: -1 }; // default
  if (sortParam === "name-asc") sort = { name: 1 };
  else if (sortParam === "name-desc") sort = { name: -1 };
  else if (sortParam === "price-asc") sort = { price: 1 };
  else if (sortParam === "price-desc") sort = { price: -1 };

  const total = await Menu.countDocuments(query);
  const menus = await Menu.find(query)
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    items: menus,
    currentPage: page,
    totalPages: Math.ceil(total / pageSize),
    totalItems: total,
  });
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

  if (!menu) {
    res.status(404);
    throw new Error("Menu item not found");
  }

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

export const getPopularDishes = asyncHandler(async (req, res) => {
  const popularItems = await Menu.find({ category: "popular" });

  res.json(popularItems);
});
