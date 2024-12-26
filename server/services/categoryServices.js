import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { update } from "../controller/userController.js";

export const addCategoryService = async (categoryBody, email) => {
  categoryBody.userEmail = email;
  categoryBody.id = uuidv4();
  const keys = Object.keys(categoryBody);
  const values = Object.values(categoryBody);
  const [categoryExist] = await db.query("SELECT * FROM categories WHERE name =? AND userEmail=?",[categoryBody.name,categoryBody.userEmail] )
  if( categoryExist.length > 0) {
    throw new Error("Category name existed")
  }
  await db.query(
    `INSERT INTO categories (${keys.join(", ")})
        VALUES (${keys.map(() => "?").join(", ")})`,
    values,
  );

  return categoryBody;
};

export const deleteCategoryService = async (id, email) => {
  const result = await db.query(
    "DELETE FROM categories WHERE id=? AND userEmail=?",
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
    type: body.type || categoryExist[0].type,
    id: categoryExist[0].id,
  };
  const [categoryExisting] = await db.query("SELECT * FROM categories WHERE name =?",[updateCategory.name] )
  if( categoryExisting.length > 0) {
    throw new Error("Category name existed")
  }
  
  await db.query("UPDATE categories SET name= ?, type= ? WHERE id = ?", [
    updateCategory.name,
    updateCategory.type,
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
