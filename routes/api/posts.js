const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

// @route POST api/posts
// @desc create a post
// @access Private
router.post(
  "/",
  [auth, [check("text", "Please include text").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    console.log({ errors: errors.errors });
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.errors });
    try {
      const user = await User.findById(req.user.id);
      const post = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });
      res.json(await post.save());
    } catch (e) {
      console.error(e);
      res.status(500).send("Server error");
    }
  }
);

// @route PUT api/posts
// @desc Update a post
// @access Private
router.put(
  "/:id",
  [auth, [check("text", "Please include text").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    console.log({ errors: errors.errors });
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.errors });
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          errors: [{ msg: "Post does not exist" }],
        });
      }
      if (!(String(post.user) === req.user.id)) {
        return res.status(403).json({
          errors: [{ msg: "Unauthorized: You must be the author" }],
        });
      }
      const updated = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: { text: req.body.text } },
        // You want findOneAndUpdate to return the updated doc, not original
        { new: true }
      );
      res.json(updated);
    } catch (e) {
      console.error(e);
      res.status(500).send("Server error");
    }
  }
);

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log({ postId: req.params.id });
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        errors: [{ msg: "Post does not exist" }],
      });
    }
    console.log({ post });
    if (!(String(post.user) === req.user.id)) {
      return res.status(403).json({
        errors: [{ msg: "Unauthorized: You must be the author" }],
      });
    }
    const deleted = await Post.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// @route POST api/posts/:id/like/
// @desc Like
// @access Private
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        errors: [{ msg: "Post does not exist" }],
      });
    }
    console.log("before", post.likes);
    let liked = false;
    post.likes.forEach((like) => {
      if (String(like.user) === req.user.id) {
        liked = true;
      }
    });
    if (liked)
      return res.status(409).json({
        errors: [{ msg: "You've already liked the post" }],
      });
    else post.likes.unshift({ user: req.user.id });
    console.log("after", post.likes);
    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// @route DELETE api/posts/:id/like/
// @desc Unlike
// @access Private
router.delete("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        errors: [{ msg: "Post does not exist" }],
      });
    }
    console.log("before", post.likes);
    let likeIndex;
    post.likes.forEach((like, index) => {
      if (String(like.user) === req.user.id) {
        likeIndex = index;
      }
    });
    if (typeof likeIndex === "undefined") {
      return res.status(409).json({
        errors: [{ msg: "You must have liked the post to unlike" }],
      });
    }
    post.likes.splice(likeIndex, 1);
    console.log("after", post.likes);
    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// @route POST api/posts/:id/comments/
// @desc Comment
// @access Private
router.post(
  "/:id/comments/",
  [auth, [check("text", "Please include text").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    console.log({ errors: errors.errors });
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.errors });
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: "User does not exist!" }] });
      }
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Post does not exist!" }] });
      }
      const comment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      post.comments.push(comment);
      await post.save();
      res.json(post.comments);
    } catch (e) {
      console.error(e);
      res.status(500).send("Server error");
    }
  }
);
// @route DELETE api/posts/:id/comments/:id
// @desc Remove Comment
// @access Private
router.delete("/:postId/comments/:commentId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ errors: [{ msg: "User does not exist!" }] });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post does not exist!" }] });
    }
    post.comments = post.comments.filter((comment) =>
      !(req.params.commentId === comment.id) ? true : false
    );
    await post.save();
    res.json(post.comments);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

module.exports = router;
