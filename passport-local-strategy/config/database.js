const mongoose = require("mongoose");
const utils = require("../lib/passwordUtils");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  admin: Boolean,
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
  })
  .get(function () {
    this._password;
  });

UserSchema.pre("save", function (next) {
  if (this._password) {
    const { salt, hash } = utils.genPassword(this._password);

    this._password = undefined;
    this.hash = hash;
    this.salt = salt;
  }
  next();
});

UserSchema.methods.isValidPassword = function (password) {
  return utils.validPassword(password, this.hash, this.salt);
};

const User = connection.model("User", UserSchema);

// Expose the connection
module.exports = connection;
