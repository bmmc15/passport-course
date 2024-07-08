const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");

router.get("/protected", (req, res, next) => {});

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    res.status(401).json({
      success: false,
      msg: "Could not find user",
    });
  }
  const isValid = user.isValidPassword(password);
  if (isValid) {
    const tokenObject = user.issueJwt();
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
});

router.post("/register", async function (req, res, next) {
  const { username, password } = req.body;

  const newUser = new User({
    username,
    password: password,
  });

  const savedUser = await newUser.save();

  const jwt = savedUser.issueJwt();
  res.json({
    success: true,
    user: savedUser,
    token: jwt.token,
    expiresIn: jwt.expires,
  });
});

module.exports = router;
