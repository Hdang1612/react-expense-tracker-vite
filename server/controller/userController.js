import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import db from "../config/db.js";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const APP_PASS = process.env.APP_PASSWORD;
const RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL;
export const signUp = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO users (name, email, password, phoneNumber) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phoneNumber],
    );
    res.status(200).json({
      message: "Login successful",
      userData: {
        name,
        email,
        phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length == 0) {
      return res.status(400).json({ message: "User not exists" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser[0].password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ email: existingUser[0].email }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      userData: {
        email: existingUser[0].email,
        name: existingUser[0].name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    if (users.length === 0) {
      return res.status(404).json({ message: "User not founded" });
    }
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const update = async (req, res) => {
  try {
    const email = req.params.email;
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }
    if (req.body.email) {
      const [emailExists] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [req.body.email],
      );
      if (emailExists.length > 0 && emailExists[0].email !== email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    await db.query(
      "UPDATE users SET name = ?, email = ?, password = ?, phoneNumber = ? WHERE email = ?",
      [
        req.body.name || existingUser[0].name,
        req.body.email || existingUser[0].email,
        req.body.password || existingUser[0].password,
        req.body.phoneNumber || existingUser[0].phoneNumber,
        email,
      ],
    );
    res.status(200).json({ message: "update successful" });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const [userExist] = await db.query("DELETE FROM users WHERE email=?", [
      email,
    ]);
    if (userExist.affectedRows == 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(201).json({ message: "Deleted Successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const secret = JWT_SECRET_KEY + existingUser[0].password;
    const token = jwt.sign({ email: existingUser[0].email }, secret, {
      expiresIn: "3m",
    });
    const link = `${RESET_PASSWORD_URL}${existingUser[0].email}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tohaidang161@gmail.com",
        pass: APP_PASS,
      },
    });

    var mailOptions = {
      from: "tohaidang161@gmail.com",
      to: "dangdang1612003@gmail.com",
      subject: "Password reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json("email sent !");
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const updatePassword = async (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;
  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const secret = JWT_SECRET_KEY + existingUser[0].password;
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET  password = ? WHERE email = ?", [
      encryptedPassword || userExist[0].password,
      email,
    ]);
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
