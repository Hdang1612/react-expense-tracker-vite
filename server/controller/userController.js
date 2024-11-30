import User from "../model//userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// import crypto, { sign } from "crypto";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const APP_PASS= process.env.APP_PASSWORD
export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email }); // trả về object có email trùng hoặc null nếu ko có
    if (userExist) {
      return res.status(400).json({ message: "user already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = new User({
      ...req.body,
      password: hashedPassword,
    });
    const saveUser = await userData.save(); //lưu vào cơ sở dữ liệu
    res.status(200).json({ message: "Login successful", userData: saveUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: userExist._id, email: userExist.email },
      JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );
    return res.status(200).json({
      message: "Login successful",
      token,
      userData: {
        id: userExist._id,
        email: userExist.email,
        name: userExist.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "User not founded" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // new:true --> hàm trả về bản ghi sau khi cập nhật
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await User.findOneAndDelete(id);
    res.status(201).json({ message: "Deleted Successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const secret = JWT_SECRET_KEY + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "3m",
    });
    const link = `http://localhost:8000/api/user/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tohaidang161@gmail.com',
        pass: APP_PASS
      }
    });
    
    var mailOptions = {
      from: 'tohaidang161@gmail.com',
      to: 'dangdang1612003@gmail.com',
      subject: 'Password reset',
      text: link,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(200).json("email sent !");
  } catch (error) {
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const secret = JWT_SECRET_KEY + oldUser.password;
    const verify = jwt.verify(token, secret);
    res
      .status(200)
      .json({ message: "Token verified successfully",email: verify.email });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
export const updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const secret = JWT_SECRET_KEY + oldUser.password;
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: id },
      {
        $set: {
          password: encryptedPassword,
        },
      },
    );
    res
      .status(200)
      .json({ message: "Updated"});
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
