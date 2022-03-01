const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: "Hashtag",
        tableName: "hashtags",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장 + 이모티콘
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define(
//     "Hashtag",
//     {
//       // id 는 기본적으로 들어있다
//       name: {
//         type: DataTypes.STRING(20),
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8mb4",
//       collate: "utf8mb4_general_ci", // 한글 저장 + 이모티콘
//     }
//   );

//   Hashtag.associate = (db) => {
//     // belongsToMany의 경우 중간 테이블이 생성
//     // PostHashTag Table(HashtagId, PostId)
//     db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
//   };

//   return Hashtag;
// };
