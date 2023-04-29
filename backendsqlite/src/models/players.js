const Sequelize = require('sequelize');
const db = require('./database.js');
const games = require('./games.js');
const users = require('./users.js');

const players = db.define(
  'players',
  {
    idPlayer: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['idGame', 'username']
      }
    ]
  }
);
games.belongsToMany(users, { foreignKey: 'idGame', primaryKey: true, through: 'players' });
users.belongsToMany(games, { foreignKey: 'username', primaryKey: true, through: 'players' });

module.exports = players;
