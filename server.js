const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
//const cors = require("cors");
const user = require("./routes/users");
const auth = require("./routes/auth");
const feed = require("./routes/feed");

//for file upload
const multer = require("multer");
const path = require("path");

dotenv.config();
port = process.env.PORT || 9000;

mongoose.connect(
  process.env.KEY,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
//app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    
    res.status(200).json("uploaded");
  } catch (error) {}
});

app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/feed", feed);

app.listen(port, () => {
  console.log("server@ 9000");
});
