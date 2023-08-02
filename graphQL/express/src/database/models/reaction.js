module.exports = (sequelize, DataTypes) =>
  sequelize.define('reaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    post_type: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    // 1 is like, 0 is dislike
    reaction: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  })