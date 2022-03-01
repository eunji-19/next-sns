const express = require("express");
const { Post, Comment, Image, Hashtag, User } = require("../models");
const { isLoggedIn } = require("./middlewares");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (err) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const baseName = path.basename(file.originalname, ext); // fileName
      done(null, baseName + "_" + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

/**
 * 게시글 추가하기
 */
router.post("/add", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    /**
     * 새로운 게시글 생성
     */
    const newPost = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    /**
     * 해시태그를 게시글에서 뽑아내기
     */
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
        )
      );
      // [[노드, true], [리액트, true]] => [[노드], [리액트]]
      await newPost.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러개 올리면 image: [test1.png, test2.png ]
        // DB에는 이미지 주소만 올라감
        const images = await Promise.all(
          req.body.image.map((item) => Image.create({ src: item }))
        );
        await newPost.addImages(images);
      } else {
        // 이미지를 한개만 올리면 image: test1.png
        const image = await Image.create({ src: req.body.image });
        await newPost.addImages(image);
      }
    }

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

/**
 * 이미지 업로드
 * - npm i multer
 * - 이미지 여러개 upload.array("image") -> frontend input의 name 속성(image)
 * - 이미지 한개 upload.single("image ")
 * - 텍스트만 가져감 upload.none()
 */
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    try {
      console.log(req.files);
      res.json(req.files.map((value) => value.filename));
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

/**
 * 리트윗
 */
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("해당 게시글이 없습니다");
    }

    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("본인 게시글은 리트윗 할 수 없습니다");
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
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
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 하나의 특정 게시글 조회
 */
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("해당 게시글이 없습니다");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
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
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
