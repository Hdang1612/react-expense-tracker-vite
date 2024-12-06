import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import routeTransaction from "./routes/transactionRoute.js";
import cors from "cors";
import db from "./config/db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json()); // mọi yêu cầu http đều đi qua middleware này trước khi được route handler xử lý ,
//nếu ko có thì req.body -- > undefined
dotenv.config(); // trả về process.env chưa các hằng
const PORT = process.env.PORT;

db.query("SELECT 1")
  .then(() => {
    console.log("connected db");
    app.listen(PORT, () => {
      console.log("server is running on port ", PORT);
    });
  })
  .catch((err) => console.log("connected failed"));

app.use("/api/user", route);
app.use("/api/transaction", routeTransaction);
