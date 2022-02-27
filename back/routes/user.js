const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { User, Post } = require("../models"); // 구조분해 할당 (db.User -> User)
const router = express.Router();

/**
 * 로그인 유지
 */
router.get("/login", async (req, res, next) => {
  try {
    console.log("user id ", req.user);
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // attributes: ["id", "email", "nickname"],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Following",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 로그인
 * - npm i passport, passport-local
 */
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // server error
    if (err) {
      console.error(err);
      next(err);
    }
    // client error
    if (info) {
      return res.status(401).send(info.reason);
    }
    // passport login
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      /**
       * 쿠키(Cookie)
       * - res.setHeader("cookie", "임의의 값");
       * - 알아서 session과 연결해줌
       * - 서버쪽에서는 통째로 데이터 들고 있고 프론트에서는 '임의의 값' 보내줌
       * - 서버쪽에서 통째로 들고 있는 데이터 -> Session
       * Redis
       * - 세션 저장용 DB
       * User
       * - server : user
       * - saga: action.data
       * - reducer: me
       */
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ["id", "email", "nickname"],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Following",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

/**
 * 로그아웃
 */
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.status(200).send("Logout Success");
});

/**
 * 회원가입
 * - 비밀번호 암호화 : npm i bcrypt
 */
router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  try {
    console.log("post ", req.body);
    // 기존에 있는 사용자인지 확인
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    /**
     * status
     * - 200 : 성공
     * - 300 : redirect
     * - 400 : client error
     * - 500 : server error
     * return 안해주면 밑에 res.send까지 실행됨
     */
    if (exUser) {
      return res.status(403).send("이미 사용중인 이메일입니다.");
    }

    // 비밀번호 hash
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // 새로운 사용자 생성
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    // res.setHeader("Access-Control-Allow-Origin", "http:localhost:3100");
    res.status(201).send("Signup Ok");
  } catch (error) {
    console.error(error);
    next(error); // status(500)
  }
});

/**
 * 닉네임 수정하기
 */
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 팔로우하기
 */
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const findUser = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!findUser) {
      return res.status(403).send("해당 사용자가 없습니다");
    }

    await findUser.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 팔로우 취소하기
 */
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const findUser = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!findUser) {
      return res.status(403).send("해당 사용자가 없습니다");
    }

    await findUser.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 팔로잉, 팔로우 목록 불러오기
 */
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const findUser = await User.findOne({
      where: { id: req.user.id },
    });
    if (!findUser) {
      return res.status(403).send("해당 사용자가 없습니다");
    }

    const followers = await findUser.getFollowers();
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const findUser = await User.findOne({
      where: { id: req.user.id },
    });
    if (!findUser) {
      return res.status(403).send("해당 사용자가 없습니다");
    }

    const followings = await findUser.getFollowing();
    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * 팔로워 차단
 */
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    /**
     * 존재 하는 사용자인지 확인
     */
    const findUser = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!findUser) {
      return res.status(403).send("해당 사용자가 없습니다");
    }

    await findUser.removeFollowing(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
