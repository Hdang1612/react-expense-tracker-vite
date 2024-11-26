import express from "express";
import { fetchUsers, signUp, logIn ,update ,deleteUser} from "../controller/userController.js"

const route = express.Router();

route.post("/signup",signUp)
route.get("/login",logIn)
route.get("/getAllUsers",fetchUsers)
route.put("/update/:id",update)
route.delete("/delete/:id",deleteUser)

export default route