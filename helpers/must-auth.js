
module.exports = function(req, res, next) {
  if (!req.user) return res.render('401');
  next();
};
