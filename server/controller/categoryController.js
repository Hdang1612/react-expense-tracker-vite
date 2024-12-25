import multer from "multer";
import {
  addCategoryService,
  updateCategoryService,
  deleteCategoryService,
  fetchAllCategoriesService,
  fetchCategoryService,
} from "../services/categoryServices.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/categories");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const addCategory = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Error uploading file" });
    try {
      const { name } = req.body;
      const email = req.user.email;
      const categoryBody = { name };
      console.log(req.body);
      if (req.file) {
        categoryBody.image = `/upload/categories/${req.file.filename}`;
      } else {
        categoryBody.image = null;
      }
      const category = await addCategoryService(categoryBody, email);
      res
        .status(200)
        .json({ message: "Add category successful", data: category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
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
    return res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Error uploading file" });
    try {
      const id = req.params.id;
      const body = req.body;
      if (req.file) {
        body.image = `/upload/categories/${req.file.filename}`;
      }
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
  });
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
