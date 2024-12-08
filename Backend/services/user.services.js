const userModel = require("../models/user.model");

/**
 * Creates a new user
 * @param {Object} data - user data
 * @param {string} data.firstName - user first name
 * @param {string} data.lastName - user last name
 * @param {string} data.email - user email
 * @param {string} data.password - user password
 * @returns {Promise<Object>} - the created user
 * @throws {Error} - if any of the required fields are not provided
 */
module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
  });
  return user;
};
