const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        // RetweetId
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 이모티콘 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define(
//     "Post",
//     {
//       // id 는 기본적으로 들어있다
//       content: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8mb4",
//       collate: "utf8mb4_general_ci", // 한글 저장 + 이모티콘
//     }
//   );

//   Post.associate = (db) => {
//     // 어떤 게시글은 사용자에게 속해있음
//     // 1개의 게시글 여러개의 댓글, 여러개의 이미지
//     // 1개의 해시태그 -> 여러개의 게시글
//     // 1개의 게시글 -> 여러개의 해시태그 => 다대다 관계
//     // 게시글 작성자
//     // belongsTo -> 단수
//     // post.addUser(), post.getUser(), post.setUser()(set -> 수정)
//     db.Post.belongsTo(db.User);
//     // post.addComments(), post.getComments()
//     db.Post.hasMany(db.Comment);
//     // hasMany 복수 -> Images로 생성됨
//     // post.addImages(), post.getImages()
//     db.Post.hasMany(db.Image);
//     // post.addHashtags()
//     db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
//     // db.Post.belongsTo(db.User)와 헷갈리지 않도록 as 를 통해서 설정
//     // 나중에 as에 따라서 post.getLikers() 처럼 게시글 좋아요 누른 사람을 가져옴
//     // post.addLikers(), post.removeLikers()
//     db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // 좋아요
//     // ReTweet -> 어떤 게시글이 어떤 게시글의 리트윗
//     // as: Retweet -> postId에서 RetweetId로 변경됨
//     // post.addRetweet()
//     db.Post.belongsTo(db.Post, { as: "Retweet" });
//   };

//   return Post;
// };
