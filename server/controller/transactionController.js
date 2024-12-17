import dotenv from "dotenv";
import {
  addTransactionService,
  deleteTransactionService,
  fetchAllTransactionsService,
  fetchTransactionService,
  searchTransactionService,
  updateTransactionService,
} from "../services/transactionServices.js";

dotenv.config();

export const addTransaction = async (req, res) => {
  try {
    const { transactionBody } = req.body;
    const email = req.user.email;
    transactionBody.userEmail = email;
    const transaction = await addTransactionService(transactionBody, email);
    res
      .status(201)
      .json({ message: "Add transaction successful", data: transaction });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;
    const [result] = await deleteTransactionService(id, email);
    if (result.affectedRows == 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    res.status(200).json({ message: "Delete Successful", id: id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updateTransaction = await updateTransactionService(id, body);
    if (!updateTransaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }
    res
      .status(200)
      .json({ message: "Update Successful", data: updateTransaction });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const fetchAllTransactions = async (req, res) => {
  try {
    const email = req.user.email;
    const listTransaction = await fetchAllTransactionsService(email);
    if (listTransaction.length == 0) {
      res.status(200).json({ message: "No transaction" });
    } else {
      res.status(200).json({ data: listTransaction });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const fetchTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;
    const transaction = await fetchTransactionService(id, email);
    if (!transaction) {
      res.status(400).json({ message: "Transaction not found" });
    }
    res.status(200).json({ transaction: transaction });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const searchTransaction = async (req, res) => {
  try {
    const search = req.query.des || "";
    const category = req.query.cate || "";
    const type = req.query.type || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const uPrice = Number(req.query.uprice) || 10000000;
    const dPrice = Number(req.query.dprice) || 0;

    const searchPattern = `%${search}%`;
    const catePattern = `%${category}%`;
    const typePattern = `%${type}%`;
    const email = req.user.email;
    const offset = (page - 1) * limit;
    const filterResult = await searchTransactionService(
      searchPattern,
      catePattern,
      typePattern,
      email,
      dPrice,
      uPrice,
      limit,
      offset,
    );
    const total = filterResult.total;
    const totalPages = filterResult.totalPages;
    if (filterResult.transactions.length == 0) {
      res.status(200).json({ message: "No transaction" });
    } else {
      res.status(200).json({
        data: filterResult.transactions,
        pagination: {
          totalRecords: total,
          totalPages,
          currentPage: page,
          limit,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
