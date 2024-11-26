import express from "express";
import { fetch, signUp, logIn ,update ,deleteUser} from "../controller/userController.js"

const route = express.Router();

route.post("/signup",signUp)
route.get("/login",logIn)
route.get("/getAllUsers",fetch)
route.put("/update/:id",update)
route.delete("/delete/:id",deleteUser)

export default route