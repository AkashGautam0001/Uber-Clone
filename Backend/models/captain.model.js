const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
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
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [8, "Password must be at least 8 characters long"],
  },
  socketId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minLength: [3, "Color name must be at least 3 characters"],
    },
    plate: {
      type: String,
      required: true,
      minLength: [3, "Plate name must be at least 3 characters"],
    },
    capacity: {
      type: Number,
      required: true,
      minLength: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["motorcycle", "auto", "car"],
    },
  },

  location: {
    lat: {
      type: Number,
      //   required: true,
    },
    lng: {
      type: Number,
      //   required: true,
    },
  },
});

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("captain", captainSchema);

module.exports = captainModel;
