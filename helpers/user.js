var User = require('../db/user');

module.exports = function(req, res, next) {
  var email = req.session.email;
  if (!email) return next();

  User.findOrCreateByEmail(email, function(e, user) {
    if (e) return next(e);
    req.user = res.locals.user = user;
    next();
  });
};
