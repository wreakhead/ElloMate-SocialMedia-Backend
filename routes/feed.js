const router = require("express").Router();
const feedModel = require("../models/feed");
const userModel = require("../models/user");
// upload a post
router.post("/", async (req, res, next) => {
  try {
    const newfeedPost = new feedModel(req.body);
    const uploadPost = await newfeedPost.save();
    res.status(200).json(uploadPost);
  } catch (error) {
    next(error);
  }
});

// updating post
router.put("/:id", async (req, res, next) => {
  try {
    const getPost = await feedModel.findById(req.params.id);
    if (getPost.userId === req.body.userId) {
      await feedModel.updateOne({ $set: req.body });
      res.status(200).json("post updated");
    } else {
      res.status(403).json("Not your post bro..");
    }
  } catch (error) {
    next(error);
  }
});

// delete

router.delete("/:id", async (req, res, next) => {
  try {
    const getPost = await feedModel.findById(req.params.id);
    if (getPost.userId === req.body.userId) {
      await feedModel.deleteOne();
      res.status(200).json("post deleted");
    } else {
      res.status(403).json("Not your post bro..");
    }
  } catch (error) {
    next(error);
  }
});

// like or dislike
router.put("/:id/like", async (req, res, next) => {
  try {
    const getPost = await feedModel.findById(req.params.id);
    if (!getPost.likes.includes(req.body.userId)) {
      await feedModel.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("liked");
    } else {
      await feedModel.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("disliked");
    }
  } catch (error) {
    next(error);
  }
});

// get post
router.get("/:id", async (req, res, next) => {
  try {
    try {
      const getPost = await feedModel.findById(req.params.id);

      res.status(200).json(getPost);
    } catch (error) {
      res.status(404).json("no such post");
    }
  } catch (error) {
    next(error);
  }
});
// get posts

router.get("/feeds/:userId", async (req, res, next) => {
  try {
    try {
      const currentUser = await userModel.findById(req.params.userId);
      const getPosts = await feedModel.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return feedModel.find({ userId: friendId });
        })
      );

      res.status(200).json(getPosts.concat(...friendPosts));
    } catch (error) {
      res.status(404).json("no posts");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
