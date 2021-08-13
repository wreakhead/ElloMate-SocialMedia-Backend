const router = require("express").Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

// update user data
router.put("/:id", async (req, res, next) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(12);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          res.status(500).json(error);
        }
      }
      try {
        const updateUser = await userModel.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account update done!");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Not your account mister!");
    }
  } catch (error) {
    next(error);
  }
});
// delete user
router.delete("/:id", async (req, res, next) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const updateUser = await userModel.deleteOne({ _id: req.params.id });
        res.status(200).json("Account Deleted!");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Not your account mister!");
    }
  } catch (error) {
    next(error);
  }
});

// fetch a user

router.get("/:id", async (req, res, next) => {
  try {
    const getUser = await userModel.findById(req.params.id);
    const { password, updatedAt, ...other } = getUser._doc;
    res.status(200).json(other);
  } catch (error) {
    next(error);
  }
});

// follow a friend/user

router.put("/:id/follow", async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      try {
        const userToFollow = await userModel.findById(req.params.id);
        const currentUser = await userModel.findById(req.body.userId);
        if (!userToFollow.followers.includes(req.body.userId)) {
          await userToFollow.updateOne({
            $push: { followers: req.body.userId },
          });
          await currentUser.updateOne({
            $push: { following: req.body.userId },
          });
          res.status(200).json("Now you can watch their sh*t!");
        } else {
          res
            .send(403)
            .json("How many times do you wanna follow the same person?");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("What a narcissist");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
