import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  uploadReceipt,
  updateReceipt,
  deleteReceipt,
  fetchReceipt,
} from "../controller/uploadController.js";
const routeUpload = express.Router();
routeUpload.post("/upload/:id", verifyToken, uploadReceipt);
routeUpload.put("/update/:id", verifyToken, updateReceipt);
routeUpload.delete("/delete/:id", verifyToken, deleteReceipt);
routeUpload.get("/:id", verifyToken, fetchReceipt);

export default routeUpload;
