
var escaper = /(\u2028)|(\u2029)|(<\/)/g;

var escapeJs = function(text) {
  return text.replace(escaper, function(match, u2028, u2029, etago) {
    if (u2028) return '\\u2028';
    if (u2029) return '\\u2029';
    if (etago) return '<\\/';
  });
}

module.exports = function(req, res, next) {
  var locals = res.locals;

  locals.req = req;
  locals.escapeJs = escapeJs;

  next();
};
