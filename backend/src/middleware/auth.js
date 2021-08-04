const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      type: "User",
      message: "Not logged into Github",
    });
  }
};
module.exports = isLoggedIn;
