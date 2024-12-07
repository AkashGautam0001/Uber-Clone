const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");

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
