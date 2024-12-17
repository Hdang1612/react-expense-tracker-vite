import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import db from "../config/db.js";
import {
  deleteUserService,
  fetchUsersService,
  forgotPasswordService,
  logInService,
  signUpService,
  updatePasswordService,
  updateUserService,
} from "../services/userServices.js";

dotenv.config();
const APP_PASS = process.env.APP_PASSWORD;
const RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL;
const EMAIL_SEND = process.env.EMAIL_SEND;
const EMAIL_RECEIVE = process.env.EMAIL_RECEIVE;
export const signUp = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;
    const registerData = await signUpService(
      email,
      password,
      name,
      phoneNumber,
    );
    res.status(200).json({
      message: "SignUp successful",
      userData: registerData,
    });
  } catch (error) {
    if (error.message) res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server error." });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await logInService(email, password);
    return res.status(200).json({
      message: "Login successful",
      token: user.token,
      userData: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (
      error.message === "User not exists" ||
      error.message === "Invalid password"
    ) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server error." });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await fetchUsersService();
    if (users.length === 0) {
      return res.status(404).json({ message: "User not founded" });
    }
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error." });
  }
};

export const update = async (req, res) => {
  try {
    const email = req.params.email;
    await updateUserService(email, req.body);
    res.status(200).json({ message: "update successful" });
  } catch (error) {
    if (error.message) res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await deleteUserService(email);
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(201).json({ message: "Deleted Successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const link = await forgotPasswordService(email, RESET_PASSWORD_URL);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_SEND,
        pass: APP_PASS,
      },
    });

    var mailOptions = {
      from: EMAIL_SEND,
      to: EMAIL_RECEIVE,
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
    res.status(200).json({ message: "email sent !" });
  } catch (error) {
    if (error.message) res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server error." });
  }
};

export const updatePassword = async (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;
  try {
    await updatePasswordService(email, token, password);
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
