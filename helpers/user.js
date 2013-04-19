var User = require('../db/user');

module.exports = function(req, res, next) {
  var email = req.session.email;
  if (!email) return next();

  User.findByEmail(email, function(e, user) {
    if (e) return next(e);
    req.user = res.locals.user = user;
    next();
  });
};
