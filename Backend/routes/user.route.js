const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("first name must be at least 3 characters"),
    body("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("last name must be at least 3 characters"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  userController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  userController.loginUser
);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = router;
