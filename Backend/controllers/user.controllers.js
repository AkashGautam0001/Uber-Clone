const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

/**
 * @function register
 * @description Register a new user and generate an authentication token
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain
 * @returns {Promise<void>}
 */
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  const isUserAlreadyExits = await userModel.findOne({ email });

  if (isUserAlreadyExits) {
    return res.status(400).json({ message: "User already exists" });
  }

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

    console.log(token);

    res.cookie("token", token, {
      // httpOnly: true,
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @function getUserProfile
 * @description Returns the profile of the logged in user
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain

 * @returns {Promise<void>}
 */
module.exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * @function logoutUser
 * @description Logs out the user by clearing the authentication token cookie and blacklisting the token
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs during the logout process
 */
module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized : No token" });
    }

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
