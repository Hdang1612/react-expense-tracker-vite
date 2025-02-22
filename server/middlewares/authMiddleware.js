import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // Header format: "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token, JWT_SECRET_KEY, (error, data) => {
      if (error) return res.status(403).json({ message: "Wrong token" });
      req.user = data;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
