const crypto = require("crypto");

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt,
    genHash,
  };
};

const validPassword = (password, hash, salt) => {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === verifyHash;
};

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
