const router = require("express").Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

// user signup
router.post("/signup", async (req, res, next) => {
  try {
    const data = req.body;
    // hashing password
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(data.password, salt);
    // updating user
    const newUser = await new userModel({
      username: data.username,
      email: data.email,
      password: hashedPass,
    });
    const update = await newUser.save();
    res.status(200).json(update);
  } catch (error) {
    next(error);
  }
});

// signin

router.post("/signin", async (req, res, next) => {
  try {
    const data = req.body;
    const findUser = await userModel.findOne({ email: data.email });
    if (findUser) {
      const checkPass = await bcrypt.compare(data.password, findUser.password);
      if (checkPass) {
        res.status(200).json(findUser);
      } else {
        res.status(400).json("wrong password");
      }
    } else res.status(404).json("user not found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
