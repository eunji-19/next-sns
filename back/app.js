const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const db = require("./models");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportConfig = require("./passport");
const cors = require("cors");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const app = express();

/**
 * Router 설정
 */
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");

const PORT = 4000;
// const PORT = 80;

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
 * morgan 설정
 */
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

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
    // origin: "*"
    // credentials - cookie도 함께 전달
    // Access-control-origin
    // Access-control-credentials
    // origin: true,
    origin: [
      "http://localhost:80",
      "http://dmswlc19.com",
      "http://3.84.1.47:3100",
    ],
    credentials: true,
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // front에서 json 형태로 데이터 보내주면 req.body에 json 형태로 데이터 넣어줌
app.use(express.urlencoded({ extended: true })); // form-submit 했을때 urlencoded 방식으로 처리해줌
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === "production" && ".dmswlc19.com",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

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
