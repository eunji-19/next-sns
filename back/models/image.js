module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      // id 는 기본적으로 들어있다
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장 + 이모티콘
    }
  );

  Image.associate = (db) => {
    // 이미지는 소유한 게시글이 정해져 있다
    db.Image.belongsTo(db.Post);
  };

  return Image;
};
