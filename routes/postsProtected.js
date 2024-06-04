const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const {
  commentValidation,
  postValidation,
} = require("../validators");
const router = require("express").Router();

router.get("/", async function (req, res) {
  try {
    const posts = await Post.aggregate([
      {
        $project: {
          title: 1,
          content: 1,
          views: 1,
          date: 1,
          comments_count: { $size: "$comments" },
          isPublic: 1,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

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

router.get("/:postId", async function (req, res) {
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

// POST a post
router.post("/", postValidation, async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      isPublic: req.body.isPublic,
      date: new Date(),
    });
    await newPost.save();
    return res.json({ post: newPost });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// PUT a post
router.put(
  "/:postId",
  postValidation,
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.postId);
      post.title = req.body.title;
      post.content = req.body.content;
      post.isPublic = req.body.isPublic;
      await post.save();
      return res.json({ post });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);
// DELETE a post
router.delete("/:postId", async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post not found" }] });
    }

    await post.deleteOne();
    return res.json({ msg: "Post deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "Server error" }] });
  }
});

router.delete("/:postId/:commentId", async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments = post.comments.filter(
      (comment) => comment._id != req.params.commentId
    );
    await post.save();
    return res.json({ comments: post.comments });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
