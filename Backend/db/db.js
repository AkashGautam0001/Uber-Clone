const mongoose = require("mongoose");

async function connecToDb() {
  if (!process.env.DB_URL) {
    throw new Error("Must provide a valid DB_URL");
  }

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to Db");
  } catch (err) {
    console.log(err, "Error connecting to DB");
    throw err;
  }
}

module.exports = connecToDb;
