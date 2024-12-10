import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const addTransaction = async (req, res) => {
  try {
    const { transactionBody } = req.body;
    const email = req.user.email;
    transactionBody.userEmail = email;
    transactionBody.id = uuidv4();
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
    const email = req.user.email;
    const [transactionExist] = await db.query(
      "DELETE FROM transactions WHERE id=? AND userEmail=?",
      [id, email],
    );
    if (transactionExist.affectedRows == 0) {
      return res.status(404).json({
        message: "transaction not found",
      });
    }
    res.status(201).json({ message: "Delete Successful" });
  } catch (error) {
    console.error("Error during update:", error.message);
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
      "SELECT * FROM transactions WHERE userEmail =? ORDER BY createAt DESC ",
      [email],
    );
    if (listTransaction.length == 0) {
      res.status(200).json({ message: "No transaction" });
    } else {
      res.status(200).json({ data: listTransaction });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const fetchTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;
    const transaction = await db.query(
      "SELECT * FROM transactions WHERE id =? AND userEmail=?",
      [id, email],
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const uPrice = Number(req.query.uprice) || 10000000;
    const dPrice = Number(req.query.dprice) || 0;

    const searchPattern = `%${search}%`;
    const catePattern = `%${category}%`;
    const typePattern = `%${type}%`;
    const email = req.user.email;
    const offset = (page - 1) * limit;
    console.log(
      searchPattern,
      catePattern,
      typePattern,
      email,
      dPrice,
      uPrice,
      limit,
      offset,
    );
    const [transactions] = await db.query(
      ` SELECT * FROM transactions WHERE transactionDescription LIKE ? 
      AND transactionCategory LIKE ? 
      AND transactionType LIKE ? 
      AND userEmail = ? 
      AND transactionAmount BETWEEN ? AND ? 
      ORDER BY createAt DESC 
      LIMIT ? OFFSET ?`,
      [
        searchPattern,
        catePattern,
        typePattern,
        email,
        dPrice,
        uPrice,
        limit,
        offset,
      ],
    );
    console.log(transactions);

    const [totalRecords] = await db.query(
      `SELECT COUNT(*) as total 
       FROM transactions 
       WHERE transactionDescription LIKE ? 
         AND transactionCategory LIKE ? 
         AND transactionType LIKE ? 
         AND userEmail = ? 
         AND transactionAmount BETWEEN ? AND ?`,
      [searchPattern, catePattern, typePattern, email, dPrice, uPrice],
    );

    const total = totalRecords[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    if (transactions.length == 0) {
      res.status(200).json({ message: "No transaction" });
    } else {
      res.status(200).json({
        data: transactions,
        pagination: {
          totalRecords: total,
          totalPages,
          currentPage: page,
          limit,
        },
      });
    }
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const filterByPeriodTime = async (req, res) => {
  try {
    const period = req.query.period || "";

    let sqlQuery = "";
    let params = [req.user.email];

    // Lọc theo ngày hôm nay
    if (period === "today") {
      sqlQuery = `
        SELECT 
          id,
          transactionType,
          transactionCategory,
          transactionAmount,
          transactionDescription,
          DATE_FORMAT(createAt, '%d-%c-%Y') AS createAt  
        FROM transactions
        WHERE userEmail = ? 
          AND DATE(createAt) = CURDATE() 
        ORDER BY createAt DESC
`;
    }
    // Lọc theo tuần (bắt đầu từ thứ 2 và kết thúc vào chủ nhật)
    else if (period === "weekly") {
      sqlQuery = `
        SELECT 
          YEARWEEK(createAt, 1) AS weekNumber, 
          MIN(DATE_ADD(createAt, INTERVAL(1 - WEEKDAY(createAt)) DAY)) AS weekStart,
          MAX(DATE_ADD(createAt, INTERVAL(7 - WEEKDAY(createAt)) DAY)) AS weekEnd,
          JSON_ARRAYAGG(JSON_OBJECT(
            'id', id,
            'transactionType', transactionType,
            'transactionCategory', transactionCategory,
            'transactionAmount', transactionAmount,
            'transactionDescription', transactionDescription,
            'createAt', createAt
          )) AS transactions
        FROM transactions
        WHERE userEmail = ?
        GROUP BY YEARWEEK(createAt, 1)
        ORDER BY weekNumber DESC;
      `;
    }
    // Lọc theo tháng
    else if (period === "monthly") {
      sqlQuery = `
        SELECT 
          YEAR(createAt) AS year, 
          MONTH(createAt) AS month, 
          JSON_ARRAYAGG(JSON_OBJECT(
            'id', id,
            'transactionType', transactionType,
            'transactionCategory', transactionCategory,
            'transactionAmount', transactionAmount,
            'transactionDescription', transactionDescription,
            'createAt', createAt
          )) AS transactions
        FROM transactions
        WHERE userEmail = ?
        GROUP BY YEAR(createAt), MONTH(createAt)
        ORDER BY year DESC, month DESC;
      `;
    }
    const [transactions] = await db.query(sqlQuery, params);

    let result = [];
    if (period === "weekly") {
      result = transactions.map((week) => ({
        label: `${new Date(week.weekStart).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })} - ${new Date(week.weekEnd).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}`,
        transactions: week.transactions,
      }));
    } else if (period === "monthly") {
      result = transactions.map((month) => ({
        label: `${new Date(month.year, month.month - 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`,
        transactions: month.transactions,
      }));
    } else {
      result = transactions;
    }

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error filtering transactions by period:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
