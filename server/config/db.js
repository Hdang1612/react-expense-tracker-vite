import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const MONGOURL = process.env.MONGO_URL;
    await mongoose.connect(MONGOURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error( error.message);
  }
};

export default connectDB;
