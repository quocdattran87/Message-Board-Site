module.exports = (sequelize, DataTypes) =>
  sequelize.define('admin', {
    date: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    visitors: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  })
