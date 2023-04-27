require("mandatoryenv").load(["DB"]);
const { DB } = process.env;

const Sequelize = require("sequelize");
const db = new Sequelize({
  dialect: "sqlite",
  storage: DB,
  logging: (...msg) => console.log(msg)

  // logging: false,
});
module.exports = db;
