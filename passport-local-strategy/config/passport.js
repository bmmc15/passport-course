const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const { validPassword } = require("../lib/passwordUtils");
const User = connection.models.User;

const verifyCallback = (username, password, done) => {
  User.findOne({ username })
    .then((user) => {
      if (!user) return done(null, false);
      const isValid = validPassword(password, user.hash, user.salt);

      return isValid ? done(null, user) : done(null, false);
    })
    .catch((err) => done(err));
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
