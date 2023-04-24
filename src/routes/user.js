const express = require("express");
const router = express.Router();
const { getUsers, addUser } = require("../controllers/user.js");
const { validateAddUser } = require("../middlewares/validateUser.js");
router.get("/users", getUsers);
router.post("/users", validateAddUser, addUser);
// router.get("/users", user.getUsers);
// router.post("/users", user.newUser);
// router.delete("/users", user.deleteAll);

// router.get("/users/:email", user.getUserByEmail);
// router.put("/users", user.updateUser);
// router.delete("/users/:id", user.deleteUser);

// router.delete("/api/users/delete", user.deleteAll);
// router.delete("/api/users/:username", user.deleteUser);
// router.delete("/api/users/delete",user.deleteUsers);
// router.post("/login", user.login);

// router.get("/getjwtDeleg/:username", user.getToken);

// router.get("/whoami", user.verifyToken, user.getLogin);

module.exports = router;
