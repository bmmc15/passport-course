module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else {
    res.status(401).json("You're not authorized");
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) next();
  else {
    res.status(401).json("You're not admin");
  }
};
