import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  fetchAllTransactions,
  fetchTransaction,
  searchTransaction,
} from "../controller/transactionController.js";

const routeTransaction = express.Router();
routeTransaction.post("/add", verifyToken, addTransaction);
routeTransaction.get("/fetchAllTransaction", verifyToken, fetchAllTransactions);
routeTransaction.get("/fetchTransaction/:id", verifyToken, fetchTransaction);
routeTransaction.get("/search", verifyToken, searchTransaction);
routeTransaction.put("/update/:id", verifyToken, updateTransaction);
routeTransaction.delete("/delete/:id", verifyToken, deleteTransaction);
// routeTransaction.get("/pagination", verifyToken, Pagination);

export default routeTransaction;
