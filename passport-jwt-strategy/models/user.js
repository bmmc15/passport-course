const mongoose = require("mongoose");
const utils = require("../lib/utils");

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
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

UserSchema.methods.issueJwt = function () {
  return utils.issueJWT(this);
};

mongoose.model("User", UserSchema);
