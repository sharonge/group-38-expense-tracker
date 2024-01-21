const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Routes for user authentication
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
