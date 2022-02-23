const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  /**
   * req.login 이후에 실행됨
   * - serializeUser (req.login(user) 의 user내용이 들어감)
   */
  passport.serializeUser((user, done) => {
    // Cookie랑 묶어줄 정보 연결
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
      });
      done(null, user); // req.user 에 user 정보 넣어줌
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
