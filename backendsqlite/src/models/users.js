// Validation is done in the controller files
const Sequelize = require('sequelize');
const db = require('./database.js');

const users = db.define(
  'users',
  {
    username: {
      primaryKey: true,
      type: Sequelize.STRING(16),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    avatarId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },
  { timestamps: false }
);
module.exports = users;
