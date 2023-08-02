module.exports = (sequelize, DataTypes) =>
  sequelize.define('reply2', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reply2Active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  })
