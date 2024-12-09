const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.services");
const blacklistTokenModel = require("../models/blacklistToken.model");

/**
 * Registers a new captain
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware in the Express chain
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} - If the request body is invalid
 * @throws {Error} - If the captain already exists
 * @throws {Error} - If an error occurs during the registration process
 */
module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName: { firstName, lastName },
    email,
    password,
    vehicle: { color, plate, capacity, vehicleType },
  } = req.body;

  const isCaptainAlreadyExists = await captainModel.findOne({ email });
  if (isCaptainAlreadyExists) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const hashPassword = await captainModel.hashPassword(password);
  console.log("hashPassword", hashPassword);

  try {
    const captain = await captainService.createCaptain({
      firstName,
      lastName,
      email,
      password: hashPassword,
      color,
      plate,
      capacity,
      vehicleType,
    });

    const token = await captain.generateAuthToken();

    res.status(201).json({ token, captain });
  } catch (err) {
    next(err);
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  console.log("email", email, "password", password);

  try {
    const captain = await captainModel.findOne({ email }).select("+password");

    console.log("captain", captain);
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    const isMatch = await captain.comparePassword(password);
    console.log("isMatch", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = await captain.generateAuthToken();
    console.log("token", token);

    res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ token, captain });
  } catch (err) {
    next(err);
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    const captain = req.captain;
    res.status(200).json({ captain });
  } catch (err) {
    next(err);
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized : No token" });
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};
