const Post = require("../models/Post");

const router = require("express").Router();

router.get("/", function (req, res) {
  res.json({ msg: "hey" });
});

router.get("/posts", async function (req, res) {
  try {
    const posts = await Post.find({ isPublic: true });
    res.json({ posts });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/posts/:postId", async function (req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    res.json({ post });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.post(
  "/posts/:postId/comments",
  async function (req, res, next) {
    try {
      const post = await Post.findById(req.params.postId);
      post.comments.push({
        username: req.body.username,
        title: req.body.title,
        content: req.body.content,
      });
      await post.save();
      return res.json({ comments: post.comments });
    } catch (error) {
      res.json({ error });
    }
  }
);

module.exports = router;
