const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        /**
         * req.body.email -> email
         * 만약
         * req.body.id => usernameField: "id"
         */
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          /**
           * email 있는지 여부부터 확인
           */
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // done(서버에러, 성공여부, client에러)
            return done(null, false, { reason: "존재하지 않는 이메일입니다" });
          }

          /**
           * 비밀번호 비교
           */
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다" });
        } catch (err) {
          console.error(err);
          // Server Error
          return done(err);
        }
      }
    )
  );
};
