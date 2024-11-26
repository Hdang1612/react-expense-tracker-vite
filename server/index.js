import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";

const app = express();

app.use(bodyParser.json()); // mọi yêu cầu http đều đi qua middleware này trước khi được route handler xử lý ,
//nếu ko có thì req.body -- > undefined
dotenv.config(); // trả về process.env chưa các hằng
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL) //kết nối đến database
  .then(() => {
    console.log("connected successful");
    app.listen(PORT, () => {  //chạy server
      console.log("server is running on port ", PORT);
    });
  })
  .catch((error) => console.log(error));

  app.use("/api/user",route)