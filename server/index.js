import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";

import route from "./routes/userRoute.js";
import routeTransaction from "./routes/transactionRoute.js";
import routeUpload from "./routes/uploadRoute.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json()); // mọi yêu cầu http đều đi qua middleware này trước khi được route handler xử lý ,
//nếu ko có thì req.body -- > undefined
dotenv.config();
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
app.use("/api/receipt", routeUpload);
