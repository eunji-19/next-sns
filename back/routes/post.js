const express = require("express");
const { Post, Comment, Image, Hashtag, User } = require("../models");
const comment = require("../models/comment");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

/**
 * 게시글 추가하기
 */
router.post("/add", isLoggedIn, async (req, res, next) => {
  try {
    /**
     * 새로운 게시글 생성
     */
    const newPost = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    /**
     * 새로운 게시글 생성 후 해당 id 를 통해
     * Front에 해당하는 게시글 내용 포함하여 보내줌
     */
    const fullNewPost = await Post.findOne({
      where: { id: newPost.id },
      includes: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          mode: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 사람 ,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullNewPost);
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
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 게시글 좋아요
 */
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다");
    }
    /**
     * 게시글과 사용자 테이블간의 관계 이용
     */
    await post.addLikers(req.user.id);
    res.status(201).json({ postId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 게시글 좋아요 취소
 */
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다");
    }
    /**
     * 게시글과 사용자 테이블간의 관계 이용
     */
    await post.removeLikers(req.user.id);
    res.status(201).json({ postId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 게시글 삭제하기
 */
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    /**
     * 게시글 아이디
     * 내가 쓴 글인지 확인 -> 내 아이디
     */
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ postId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
