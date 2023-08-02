module.exports = (sequelize, DataTypes) =>
  sequelize.define('post', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    postActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  })
