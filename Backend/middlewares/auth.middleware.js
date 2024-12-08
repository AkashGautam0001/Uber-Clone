const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Middleware to check if the user is authenticated
 *
 * @function
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain
 *
 * @returns {Promise<void>}
 */
module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized : No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized : User not found" });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized : Invalid token" });
  }
};
