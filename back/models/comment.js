const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "Comment",
        tableName: "comments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }

  static assoicate(db) {
    // belongsTo 가 있는 곳에 UserId, PostId 등이 생긴다
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Comment = sequelize.define(
//     "Comment",
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

//   Comment.associate = (db) => {
//     // belongsTo 가 있는 곳에 UserId, PostId 등이 생긴다
//     db.Comment.belongsTo(db.User);
//     db.Comment.belongsTo(db.Post);
//   };

//   return Comment;
// };
