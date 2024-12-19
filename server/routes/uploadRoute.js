import express from "express";

import {
  uploadReceipt,
  updateReceipt,
  deleteReceipt,
  fetchReceipt,
} from "../controller/uploadController.js";
const routeUpload = express.Router();
routeUpload.post("/upload/:id", uploadReceipt);
routeUpload.put("/update/:id", updateReceipt);
routeUpload.delete("/delete/:id", deleteReceipt);
routeUpload.get("/:id", fetchReceipt);

export default routeUpload;
