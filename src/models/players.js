const db = require('./database.js');
const games = require('./games.js');
const users = require('./users.js');

const players = db.define(
  'players',
  {},
  { timestamps: false }
);
games.belongsToMany(users, { foreignKey: 'idGame', primary_key: true, through: 'players' });
users.belongsToMany(games, { foreignKey: 'userName', primary_key: true, through: 'players' });

module.exports = players;
