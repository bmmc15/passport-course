const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");

router.get("/protected", (req, res, next) => {});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          success: false,
          msg: "Could not find user",
        });
      }
      const isValid = utils.validPassword(password, user.hash, user.salt);
      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          user,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: true, msg: "You entered the wrong password" });
      }
    })
    .catch((err) => next(err));
});
router.post("/register", function (req, res, next) {
  const { username, password } = req.body;

  const { salt, hash } = utils.genPassword(password);

  const newUser = new User({
    username,
    salt,
    hash,
  });

  newUser
    .save()
    .then((user) => {
      const jwt = utils.issueJWT(user);
      res.json({
        success: true,
        user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
