const users = require("../models/users.js");
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../util/CodeError.js");
const bcrypt = require("bcrypt");
// const jws = require("jws");
// require("mandatoryenv").load(["TOKENSECRET"]);
// const { TOKENSECRET } = process.env;
const validator = require("validator");

// const isInDatabase = async()=>{
//
// }
const validateAddUser = async (req, res, next) => {
  if (!has(req.body, ["data"])) {
    throw new CodeError("You must include a request body", status.BAD_REQUEST);
  }
  const { username, password, confirmPassword } = JSON.parse(req.body.data);
  if (!username) {
    throw new CodeError("You must specify a username", status.BAD_REQUEST);
  }
  if (!password) {
    throw new CodeError("You must specify a password", status.BAD_REQUEST);
  }
  const options = {
    minLength: 8, // Minimum password length (default: 8)
    minLowercase: 1, // Minimum number of lowercase letters (default: 1)
    minUppercase: 1, // Minimum number of uppercase letters (default: 1)
    minNumbers: 1, // Minimum number of numeric digits (default: 1)
    minSymbols: 1, // Minimum number of special characters (default: 1)
  };
  if (!validator.isStrongPassword(password, options)) {
    throw new CodeError("You must digit a valid password", status.BAD_REQUEST);
  }
  if (password != confirmPassword) {
    throw new CodeError("the passwords does not match ", status.BAD_REQUEST);
  }
  const userAlreadyExist = await users.findOne({
    where: {
      username: username,
    },
  });
  if (userAlreadyExist) {
    throw new CodeError(
      "the user already exist in the database ",
      status.BAD_REQUEST
    );
  }
  next();
};
module.exports = {
  validateAddUser,
};
