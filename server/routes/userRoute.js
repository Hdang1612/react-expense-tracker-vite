import express from "express";
import {
  fetchUsers,
  signUp,
  logIn,
  update,
  deleteUser,
  forgotPassword,
  resetPassword,
  updatePassword
} from "../controller/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const route = express.Router();

route.post("/signup", signUp);
route.post("/login", logIn);
route.get("/getAllUsers",verifyToken, fetchUsers);
route.put("/update/:id",verifyToken, update);
route.delete("/delete/:id",verifyToken, deleteUser);
route.post("/forgot-password", forgotPassword);
route.get("/reset-password/:id/:token", resetPassword);
route.post("/reset-password/:id/:token", updatePassword);

export default route;
