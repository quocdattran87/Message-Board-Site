module.exports = (sequelize, DataTypes) =>
  sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(96),
      allowNull: false
    },
    twoFactorAuthentication: {
      type: DataTypes.STRING(96),
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    date: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    profilePic: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    accountActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    visitors: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  })
