const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const { commentValidation } = require("../validators");

const router = require("express").Router();

router.get("/posts", async function (req, res) {
  try {
    const posts = await Post.find({ isPublic: true });
    if (!posts) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Couldn't find posts" }] });
    }
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

router.get("/posts/:postId", async function (req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post Not Found" }] });
    }
    post.views = post.views + 1;
    await post.save();
    res.json({ post });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

router.post(
  "/posts/:postId/comments",
  commentValidation,
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Post not found" }] });
      }
      post.comments.push({
        username: req.body.username,
        title: req.body.title,
        content: req.body.content,
      });
      await post.save();
      return res.json({ comments: post.comments });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

//MOCK
router.post("/posts/mock", async function (req, res, next) {
  const post = await Post.create({
    title: "aaaa",
    content: "aaaa",
    isPublic: true,
    date: new Date(),
  });
  res.json({ post });
});

module.exports = router;
