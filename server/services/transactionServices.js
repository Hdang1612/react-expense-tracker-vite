import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Add Transaction
export const addTransactionService = async (transactionBody, email) => {
  transactionBody.userEmail = email;
  transactionBody.id = uuidv4();

  const keys = Object.keys(transactionBody);
  const values = Object.values(transactionBody);
  console.log(transactionBody)
  await db.query(
    `INSERT INTO transactions (${keys.join(", ")})
        VALUES (${keys.map(() => "?").join(", ")})`,
    values,
  );
  return transactionBody;
};

// Delete Transaction
export const deleteTransactionService = async (id, email) => {
  const result = await db.query(
    "DELETE FROM transactions WHERE id=? AND userEmail=?",
    [id, email],
  );
  return result;
};

// Update Transaction
export const updateTransactionService = async (id, body) => {
  const [transactionExist] = await db.query(
    "SELECT * FROM transactions WHERE id =?",
    [id],
  );
  if (transactionExist.length == 0) return null;

  const updateTransaction = {
    transactionType:
      body.transactionType || transactionExist[0].transactionType,
    transactionCategory:
      body.transactionCategory || transactionExist[0].transactionCategory,
    transactionAmount:
      body.transactionAmount || transactionExist[0].transactionAmount,
    transactionDescription:
      body.transactionDescription || transactionExist[0].transactionDescription,
    createAt: body.createAt || transactionExist[0].createAt,
    receipt: body.receipt || transactionExist[0].receipt,
    id: transactionExist[0].id,
  };

  await db.query(
    "UPDATE transactions SET transactionType= ?, transactionCategory= ?, transactionAmount= ?, transactionDescription= ?, createAt= ?, receipt= ? WHERE id = ?",
    [
      updateTransaction.transactionType,
      updateTransaction.transactionCategory,
      updateTransaction.transactionAmount,
      updateTransaction.transactionDescription,
      updateTransaction.createAt,
      updateTransaction.receipt,
      id,
    ],
  );

  return updateTransaction;
};

// Fetch All Transactions
export const fetchAllTransactionsService = async (email) => {
  const [listTransaction] = await db.query(
    "SELECT * FROM transactions WHERE userEmail =? ORDER BY createAt DESC",
    [email],
  );
  return listTransaction;
};

// Fetch Single Transaction
export const fetchTransactionService = async (id, email) => {
  const [transaction] = await db.query(
    `SELECT id, transactionType, transactionCategory, transactionAmount, transactionDescription, receipt, 
     DATE_FORMAT(createAt, '%Y-%c-%d') AS createAt  
     FROM transactions WHERE id =? AND userEmail=?`,
    [id, email],
  );
  return transaction[0];
};

// Search Transactions
export const searchTransactionService = async (
  searchPattern,
  catePattern,
  typePattern,
  email,
  dPrice,
  uPrice,
  limit,
  offset,
) => {
  const [transactions] = await db.query(
    `SELECT * FROM transactions WHERE transactionDescription LIKE ? 
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

  return {
    transactions,
    total: totalRecords[0]?.total || 0,
    totalPages: Math.ceil(totalRecords[0]?.total / limit) || 0,
  };
};
