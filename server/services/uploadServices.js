import fs from "fs";
import db from "../config/db.js";

export const uploadReceiptService = async (transactionId, file) => {
  if (!file) {
    await db.query("UPDATE transactions SET receipt = ? WHERE id = ?", [
      null,
      transactionId,
    ]);
    return;
  }

  const receiptPath = file.path;

  const [transaction] = await db.query(
    "SELECT * FROM transactions WHERE id = ?",
    [transactionId],
  );

  if (transaction.length === 0) {
    throw new Error("Transaction not found");
  }

  await db.query("UPDATE transactions SET receipt = ? WHERE id = ?", [
    receiptPath,
    transactionId,
  ]);

  return receiptPath;
};

export const updateReceiptService = async (transactionId, file) => {
  if (!file) {
    await db.query("UPDATE transactions SET receipt = ? WHERE id = ?", [
      null,
      transactionId,
    ]);
    return;
  }

  const newReceiptPath = file.path;

  const [transaction] = await db.query(
    "SELECT receipt FROM transactions WHERE id = ?",
    [transactionId],
  );

  if (transaction.length === 0) {
    throw new Error("Transaction not found");
  }

  const oldReceiptPath = transaction[0].receipt;
  if (oldReceiptPath) {
    fs.unlinkSync(oldReceiptPath);
  }

  await db.query("UPDATE transactions SET receipt = ? WHERE id = ?", [
    newReceiptPath,
    transactionId,
  ]);

  return newReceiptPath;
};

export const deleteReceiptService = async (transactionId) => {
  const [transaction] = await db.query(
    "SELECT receipt FROM transactions WHERE id = ?",
    [transactionId],
  );

  if (transaction.length === 0) {
    throw new Error("Transaction not found");
  }

  const receiptPath = transaction[0].receipt;
  if (receiptPath) {
    fs.unlinkSync(receiptPath);
  }

  await db.query("UPDATE transactions SET receipt = NULL WHERE id = ?", [
    transactionId,
  ]);
};

export const fetchReceiptService = async (transactionId) => {
  const [transaction] = await db.query(
    "SELECT receipt FROM transactions WHERE id = ?",
    [transactionId],
  );

  if (transaction.length === 0) {
    throw new Error("Transaction not found");
  }

  return transaction[0].receipt;
};
