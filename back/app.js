const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const db = require("./models");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportConfig = require("./passport");
const cors = require("cors");
const app = express();

/**
 * Router 설정
 */
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

const PORT = 4000;

/**
 * MySQL & Sequelize 셋팅
 * - npm i mysql2 sequelize sequelize-cli
 * - npx sequelize init
 * - npx sequelize db:create
 */
db.sequelize
  .sync()
  .then(() => {
    console.log("MySQL Connected");
  })
  .catch(console.error);

/**
 * passport 설정
 */
passportConfig();

/**
 * Middleware
 * - cors (npm i cors)
 * - session (npm i express-session) / (npm i cookie-parser)
 */
app.use(
  cors({
    // true -> 보낸 곳의 주소가 자동으로 들어감
    origin: true,
    // origin: "*"
    credentials: false,
  })
);
app.use(express.json()); // front에서 json 형태로 데이터 보내주면 req.body에 json 형태로 데이터 넣어줌
app.use(express.urlencoded({ extended: true })); // form-submit 했을때 urlencoded 방식으로 처리해줌
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/post", postRouter);

/**
 * 에러 처리 미들웨어
 * - express 내부에 존재
 * - 직접 작성해도 됨
 */
// app.use((err, req, res, next) => {

// });

app.listen(4000, () => {
  console.log(`Server is Starting at ${PORT}`);
});
