import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
//Schema : mô tả cấu trúc của dữ liệu trong một document trong MongoDB
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber:{
    type:String,
    required:true
  },
});

export default mongoose.model("users", userSchema);
