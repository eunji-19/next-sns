const express = require("express");
const { Post, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

/**
 * 게시글 추가하기
 */
router.post("/add", isLoggedIn, async (req, res, next) => {
  try {
    const newPost = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 댓글 추가하기 - 해당 게시글
 */
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    /**
     * 게시글 id가 정확한지 확인
     */
    const exactPost = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!exactPost) {
      return res.status(403).send("존재하지 않는 게시글입니다");
    }

    const newComment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/", (req, res) => {
  res.json({
    id: 1,
  });
});

module.exports = router;
