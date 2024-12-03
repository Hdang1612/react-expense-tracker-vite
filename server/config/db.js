// import mongoose from "mongoose";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
const MYSQL_HOST = "localhost";
const MYSQL_USER = process.env.MYSQL_USER_NAME;
const MYSQL_PASSWORD = process.env.MYSQL_USER_PASSWORD;
const MYSQL_DATABASE = "mydb";

const db = await mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

export default db;
