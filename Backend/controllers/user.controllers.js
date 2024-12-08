const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");

/**
 * @function register
 * @description Register a new user and generate an authentication token
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain
 * @returns {Promise<void>}
 */
module.exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;
  const hashPassword = await userModel.hashPassword(password);
  console.log(fullName, email, hashPassword);
  try {
    const user = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashPassword,
    });
    console.log("user", user);
    const token = await user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * @function loginUser
 * @description Login a user and generate an authentication token
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain
 * @returns {Promise<void>}
 */
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        messsage: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};
