import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

dotenv.config();

export const addTransaction = async (req, res) => {
  try {
    const { transactionBody } = req.body;
    const email = req.user.email;
    transactionBody.userEmail = email;
    console.log(transactionBody.userEmail);
    const keys = Object.keys(transactionBody);
    const values = Object.values(transactionBody);
    await db.query(
      `INSERT INTO transactions (${keys.join(", ")})
            VALUES (${keys.map(() => "?").join(", ")})`,
      values,
    );
    res.status(200).json({ message: "Add transaction successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const [transactionExist] = await db.query(
      "DELETE FROM transactions WHERE id=?",
      [id],
    );
    if (transactionExist.affectedRows == 0) {
      return res.status(404).json({
        message: "transaction not found",
      });
    }
    res.status(201).json({ message: "Delete Successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const [transactionExist] = await db.query(
      "SELECT * FROM transactions WHERE id =?",
      [id],
    );
    if (transactionExist.length == 0) {
      return res.status(400).json({ message: "Transaction not found" });
    }
    await db.query(
      "UPDATE  transactions SET   transactionType= ?, transactionCategory= ? ,transactionAmount= ? ,transactionDescription= ? , createAt= ? WHERE id = ?",
      [
        req.body.transactionType || transactionExist[0].transactionType,
        req.body.transactionCategory || transactionExist[0].transactionCategory,
        req.body.transactionAmount || transactionExist[0].transactionAmount,
        req.body.transactionDescription ||
          transactionExist[0].transactionDescription,
        req.body.createAt || transactionExist[0].createAt,
        id,
      ],
    );
    res.status(200).json({ message: "Update Successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
export const fetchAllTransactions = async (req, res) => {
  try {
    const email = req.user.email;
    const [listTransaction] = await db.query(
      "SELECT * FROM transactions WHERE userEmail =?",
      [email],
    );
    if (listTransaction.length == 0) {
      res.status(200).json({ message: "No transaction" });
    }
    res.status(200).json({ data: listTransaction });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const fetchTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await db.query(
      "SELECT * FROM transactions WHERE id =?",
      [id],
    );
    if (!transaction) {
      res.status(400).json({ message: "Transaction not found" });
    }
    res.status(200).json({ transaction: transaction[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const searchTransaction = async (req, res) => {
  try {
    const search = req.query.des || "";
    const category = req.query.cate || "";
    const type = req.query.type || "";
    const uPrice = Number(req.query.uprice);
    const dPrice = Number(req.query.dprice);
    const searchPattern = `%${search}%`;
    const catePattern = `%${category}%`;
    const typePattern = `%${type}%`;
    const email = req.user.email;
    const [transactions] = await db.query(
      ` SELECT * FROM transactions WHERE transactionDescription LIKE ? AND transactionCategory LIKE ? AND transactionType LIKE ? AND userEmail = ? AND transactionAmount BETWEEN ? AND ? `,
      [searchPattern, catePattern, typePattern, email, dPrice, uPrice],
    );
    if (transactions.length == 0) {
      res.status(200).json({ message: "No transaction" });
    } else {
      res.status(200).json({ data: transactions });
    }
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
