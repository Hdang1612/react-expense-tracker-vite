import User from "../model//userModel.js";
import bcrypt from "bcrypt";

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
    res.status(200).json(saveUser);
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
    return res
      .status(200)
      .json({ message: "Login successful", userData: userExist });
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
    // const newPwd=req.body.password
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
