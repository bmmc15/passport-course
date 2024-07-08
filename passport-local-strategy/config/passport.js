const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const User = connection.models.User;

const verifyCallback = async function (username, password, done) {
  const user = await User.findOne({ username });
  if (!user) return done(null, false);

  const isValid = user.isValidPassword(password);

  return isValid ? done(null, user) : done(null, false);
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
