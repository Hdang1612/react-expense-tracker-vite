import express from "express";
import {
  fetchUsers,
  signUp,
  logIn,
  update,
  deleteUser,
} from "../controller/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const route = express.Router();

route.post("/signup", signUp);
route.post("/login", logIn);
route.get("/getAllUsers",verifyToken, fetchUsers);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteUser);

export default route;
