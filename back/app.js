const express = require("express");
const db = require("./models");
const app = express();

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

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/", (req, res) => {
  res.send("Hello api");
});

app.use("/post", postRouter);

app.listen(4000, () => {
  console.log(`Server is Starting at ${PORT}`);
});
