import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  fetchAllCategories,
  fetchCategoryById,
} from "../controller/categoryController.js";

const routeCategory = express.Router();
routeCategory.post("/add", verifyToken, addCategory);
routeCategory.put("/update/:id", verifyToken, updateCategory);
routeCategory.delete("/delete/:id", verifyToken, deleteCategory);
routeCategory.get("/fetchAll", verifyToken, fetchAllCategories);
routeCategory.get("/:id", verifyToken, fetchCategoryById);

export default routeCategory;
