const express = require("express");
const { Post, User, Image, Comment } = require("../models");
const router = express.Router();

/**
 * DB
 * - limit
 * - offset
 * - findAll
 * : 모든 게시글
 */
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      //   where: { UserId: 1 },
      //   where: { id: lastId },
      limit: 10, // 10개씩 가져오기
      //   offsett: 0, // 1 ~ 10(1번 게시글부터 10번게시글까지) if 10 -> (10번 게시글부터 20번게시글까지)
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람 ,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
