const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { User, Post } = require("../models"); // 구조분해 할당 (db.User -> User)
const router = express.Router();

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

module.exports = router;
