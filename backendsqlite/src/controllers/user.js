const users = require("../models/users.js");
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../util/CodeError.js");
const bcrypt = require("bcrypt");
const jws = require("jws");
require("mandatoryenv").load(["TOKENSECRET"]);
const { TOKENSECRET } = process.env;
const validator = require("validator");

const getUsers = async (req, res) => {
  try {
    const data = await users.findAll({
      attributes: ["id", "username", "password"],
    });
    res.json({ status: true, message: "returning users", data });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};
const addUser = async (req, res) => {
  try {
    const { username, password, confirmPassword } = JSON.parse(req.body.data);
    console.log(username, password);
    //encryptin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await users.create({
      username: username,
      password: hashedPassword,
    });
    res.json({ status: true, message: "user Added" });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};
// const updateUser = async (req,res) => {
//   try {
//     const {username,newUsername} = JSON.parse(req.body.data);
//     await users.update({
//       username:username,
//       where:{username}
//     })
//   } catch (error) {
//     res.send({ status: false, message: error.message });
//   }
// };
//TODO
// const deleteUser = async (req,res) =>{
//   try {
//     await users.
//   } catch (error) {
//
//   }
// }
module.exports = {
  getUsers,
  addUser,
  // updateUser,
  // deleteUser,
};
