module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // id 는 기본적으로 들어있다
      email: {
        type: DataTypes.STRING(50),
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );

  /**
   * 다대다 관계
   * - User, Post
   * - User, Hashtag
   * - User, User
   */
  User.associate = (db) => {
    // 사용자 1명이 Post(게시글) 여러개 가질 수 있음
    // 사용자 -> 게시글 좋아요 가능
    // 게시글 좋아요 -> 사용자로부터 여러개 좋아요 받을 수 있음 => 다대다 관계(belongsToMany )
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // 중간 테이블 이름 정할 수 있음

    // 팔로잉, 팔로워 (같은 테이블 내에도 관계가 존재 할 수 있음)
    // 다대다 관계 -> 중간 테이블 생성됨
    // 같은 테이블의 경우 UserId가 동일 하므로 ForeignKey를 이용하여 ID 이름을 변경해줌 -> followingId, followerId
    // through : 테이블 이름 변경
    // foreignKey: 컬럼의 아이디를 변경
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Following",
      foreignKey: "FollowerId",
    });
  };

  return User;
};
