import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TOKEN_LOGIN = process.env.EXPIRATION_TOKEN_LOGIN;
const EXPIRATION_TOKEN_EMAIL = process.env.EXPIRATION_TOKEN_EMAIL;

// Sign Up Service
export const signUpService = async (email, password, name, phoneNumber) => {
  const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await db.query(
    "INSERT INTO users (name, email, password, phoneNumber) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, phoneNumber],
  );

  return { name, email, phoneNumber };
};

// Log In Service
export const logInService = async (email, password) => {
  const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (existingUser.length === 0) {
    throw new Error("User not exists");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser[0].password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ email: existingUser[0].email }, JWT_SECRET_KEY, {
    expiresIn: EXPIRATION_TOKEN_LOGIN,
  });

  return { token, name: existingUser[0].name, email: existingUser[0].email };
};

// Fetch All Users Service
export const fetchUsersService = async () => {
  const [users] = await db.query("SELECT * FROM users");
  return users;
};

// Update User Service
export const updateUserService = async (email, userData) => {
  const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (existingUser.length === 0) {
    throw new Error("User not found");
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  await db.query(
    "UPDATE users SET name = ?, email = ?, password = ?, phoneNumber = ? WHERE email = ?",
    [
      userData.name || existingUser[0].name,
      userData.email || existingUser[0].email,
      userData.password || existingUser[0].password,
      userData.phoneNumber || existingUser[0].phoneNumber,
      email,
    ],
  );
};

// Delete User Service
export const deleteUserService = async (email) => {
  const [result] = await db.query("DELETE FROM users WHERE email=?", [email]);
  return result;
};

// Forgot Password Service
export const forgotPasswordService = async (email, resetUrl) => {
  const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (existingUser.length === 0) {
    throw new Error("User not found");
  }

  const secret = JWT_SECRET_KEY + existingUser[0].password;
  const token = jwt.sign({ email: existingUser[0].email }, secret, {
    expiresIn: EXPIRATION_TOKEN_EMAIL,
  });

  const link = `${resetUrl}${existingUser[0].email}/${token}`;

  return link;
};

// Update Password Service
export const updatePasswordService = async (email, token, newPassword) => {
  const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  const secret = JWT_SECRET_KEY + existingUser[0].password;
  jwt.verify(token, secret);

  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE users SET password = ? WHERE email = ?", [
    encryptedPassword,
    email,
  ]);
};
