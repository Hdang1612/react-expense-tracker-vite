import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { update } from "../controller/userController.js";

export const addCategoryService = async (categoryBody, email) => {
  categoryBody.userEmail = email;
  categoryBody.id = uuidv4();
  categoryBody.isDeleteAble = 1;
  const keys = Object.keys(categoryBody);
  const values = Object.values(categoryBody);
  const [categoryExist] = await db.query(
    "SELECT * FROM categories WHERE name =? AND userEmail=?",
    [categoryBody.name, categoryBody.userEmail],
  );
  if (categoryExist.length > 0) {
    throw new Error("Category name existed");
  }
  await db.query(
    `INSERT INTO categories (${keys.join(", ")})
        VALUES (${keys.map(() => "?").join(", ")})`,
    values,
  );

  return categoryBody;
};

export const deleteCategoryService = async (id, email) => {
  const [category] = await db.query(
    "SELECT * FROM categories WHERE id = ? AND userEmail = ?",
    [id, email],
  );
  if (category[0].isDeleteAble === 0) {
    throw new Error("Default Category - Cannot delete");
  }
  console.log();
  const result = await db.query(
    "DELETE FROM categories WHERE id=? AND userEmail=? AND isDeleteAble=1",
    [id, email],
  );
  return result;
};

export const updateCategoryService = async (id, body) => {
  const [categoryExist] = await db.query(
    "SELECT * FROM categories WHERE id =?",
    [id],
  );

  const updateCategory = {
    name: body.name || categoryExist[0].name,
    id: categoryExist[0].id,
    image: body.image || null,
  };
  const [categoryExisting] = await db.query(
    "SELECT * FROM categories WHERE name =? AND id !=?",
    [updateCategory.name, id],
  );
  if (categoryExisting.length > 0) {
    throw new Error("Category name existed");
  }

  await db.query("UPDATE categories SET name= ?,image= ? WHERE id = ?", [
    updateCategory.name,
    updateCategory.image,
    id,
  ]);
  return updateCategory;
};

export const fetchAllCategoriesService = async (email) => {
  const [listCategories] = await db.query(
    "SELECT * FROM categories WHERE userEmail =? ",
    [email],
  );
  return listCategories;
};

export const fetchCategoryService = async (id, email) => {
  const [category] = await db.query(
    "SELECT * FROM categories WHERE id=? AND userEmail=? ",
    [id, email],
  );
  return category[0];
};
