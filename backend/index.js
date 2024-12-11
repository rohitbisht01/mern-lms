const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routers/userRoute");
const courseRoute = require("./routers/courseRoute");
const connectDb = require("./database/connectDb");

dotenv.config({});

connectDb();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
