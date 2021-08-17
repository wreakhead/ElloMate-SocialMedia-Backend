const router = require("express").Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

// update user data
router.put("/:id", async (req, res, next) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt();
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

// get followers

router.get("followers/:userId", async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.userId);
    const followers = await Promise.all(
      user.follower.map((followerId) => {
        return userModel.findById(followerId);
      })
    );
    let followerList = [];
    friends.map((follower) => {
      const { _id, username, profilePicture } = follower;
      followerList.push({ _id, username, profilePicture });
    });
    res, status(200).json(followerList);
  } catch (error) {}
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
            $push: { following: req.params.id },
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

// unfollow
router.put("/:id/unfollow", async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      try {
        const userToUnFollow = await userModel.findById(req.params.id);
        const currentUser = await userModel.findById(req.body.userId);
        if (userToUnFollow.followers.includes(req.body.userId)) {
          await userToUnFollow.updateOne({
            $pull: { followers: req.body.userId },
          });
          await currentUser.updateOne({
            $pull: { following: req.params.id },
          });
          res.status(200).json("You unfollowed");
        } else {
          res.send(403).json("You have to follow first da!");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You can't run away from yourself");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
