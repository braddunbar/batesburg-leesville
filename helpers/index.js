
var escaper = /(\u2028)|(\u2029)|(<\/)/g;

var escape = function(match, u2028, u2029, etago) {
  if (u2028) return '\\u2028';
  if (u2029) return '\\u2029';
  return '<\\/';
};

var stringify = function(text) {
  return JSON.stringify(text).replace(escaper, escape);
};

module.exports = function(req, res, next) {
  var locals = res.locals;

  locals.req = req;
  locals.stringify = stringify;

  next();
};
