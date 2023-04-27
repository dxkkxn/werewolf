const Sequelize = require('sequelize');
const db = require('./database.js');
const games = require('./games.js');
const powers = require('./powers.js');

const powersProbabilities = db.define(
  'powersProbabilities',
  {
    probability: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { timestamps: false }
);

games.belongsToMany(powers, { foreignKey: 'idGame', primary_key: true, through: 'powersProbabilities' });
powers.belongsToMany(games, { foreignKey: 'power', primary_key: true, through: 'powersProbabilities' });
module.exports = powersProbabilities;
