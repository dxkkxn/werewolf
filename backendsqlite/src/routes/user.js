const express = require("express");

const router = express.Router();
const { getUsers, addUser } = require("../controllers/user.js");
const { validateAddUser } = require("../middlewares/validateUser.js");
// router.get("/users", getUsers);
router.post("/singin", validateAddUser, addUser);

module.exports = router
