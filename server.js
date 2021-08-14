const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes/users");
const auth = require("./routes/auth");
const feed = require("./routes/feed");

dotenv.config();
port = process.env.PORT || 9000;

mongoose.connect(
  process.env.KEY,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user", router);
app.use("/api/auth", auth);
app.use("/api/feed", feed);

app.listen(port, () => {
  console.log("server@ 8000");
});
