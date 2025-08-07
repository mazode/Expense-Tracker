const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  loginUser,
  registerUser,
  getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

module.exports = router;
