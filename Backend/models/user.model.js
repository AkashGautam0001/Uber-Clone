const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters"],
    },
    lastName: {
      type: String,
      minLength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [8, "Password must be at least 8 characters long"],
  },
  socketId: {
    type: String,
  },
});

/**
 * Generates an authentication token
 * @returns {String} - the JWT token
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET
  );
  return token;
};

/**
 * Compares the provided password with the user's hashed password
 * @param {string} password - the password to compare
 * @returns {Promise<boolean>} - whether the password matches
 */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Hashes a password with bcrypt
 * @param {string} password - the password to hash
 * @returns {Promise<string>} - the hashed password
 */
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
