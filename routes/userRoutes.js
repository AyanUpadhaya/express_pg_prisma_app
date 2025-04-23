const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  getSingleUser,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/search", getSingleUser);

module.exports = router;
