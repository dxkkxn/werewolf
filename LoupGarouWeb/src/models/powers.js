const Sequelize = require('sequelize');
const db = require('./database.js');

const powers = db.define(
  'powers',
  {
    name: {
      primaryKey: true,
      type: Sequelize.STRING(16),
      allowNull: false,
      unique: true
    }
  },
  { timestamps: false }
);
module.exports = powers;
