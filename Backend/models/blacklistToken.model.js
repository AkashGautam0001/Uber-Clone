const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // When the token is created, we set the createdAt date to the current date and time.
  // We also set an index on this field with an expiration of 24 hours. This means that
  // after 24 hours, any tokens that have not been used will be automatically removed
  // from the database.
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "24h" },
  },
});

module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
