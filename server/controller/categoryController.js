import {
  addCategoryService,
  updateCategoryService,
  deleteCategoryService,
  fetchAllCategoriesService,
  fetchCategoryService,
} from "../services/categoryServices.js";

export const addCategory = async (req, res) => {
  try {
    const { categoryBody } = req.body;
    const email = req.user.email;
    const category = await addCategoryService(categoryBody, email);
    res
      .status(200)
      .json({ message: "Add category successful", data: category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;
    const [result] = await deleteCategoryService(id, email);
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updateCategory = await updateCategoryService(id, body);
    if (!updateCategory) {
      return res.status(400).json({ message: "category not found" });
    }
    res
      .status(200)
      .json({ message: "Update successful", data: updateCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchAllCategories = async (req, res) => {
  try {
    const email = req.user.email;
    const listCategories = await fetchAllCategoriesService(email);
    if (listCategories.length == 0) {
      res.status(200).json({ message: "No categories" });
    } else {
      res.status(200).json({ data: listCategories });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const fetchCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;
    const category = await fetchCategoryService(id, email);
    res.status(200).json({ category: category });
  } catch (error) {
    console.log(error.message);
  }
};
