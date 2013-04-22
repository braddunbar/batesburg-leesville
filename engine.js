var fs = require('fs');
var async = require('async');
var _ = require('underscore');

// Compile a template function.
var compile = function(path, next) {
  fs.readFile(path, function(e, data) {
    if (e) return next(e);
    try {
      next(null, _.template(data.toString(), null, {variable: 'o'}));
    } catch (e) {
      next(e);
    }
  });
};

// Compile and cache a template function.
var cache = async.memoize(compile);

// Render a template.
module.exports = function(path, options, next) {
  var paths = [path];
  var layout = options.layout || options.settings.layout;

  // If a layout is specified, compile it.
  if (layout) paths.push(layout);

  // Cache the template if appropriate.
  var f = options.cache ? cache : compile;

  // Compile templates.
  async.map(paths, f, function(e, results) {
    if (e) return next(e);

    // Grab results.
    var template = results[0];
    var layout = results[1];

    // Render the template, with layout if necessary.
    try {
      var html = template.call(options);
      options.content = html;
      if (layout) html = layout.call(options);
      next(null, html);
    } catch(e) {
      next(e);
    }
  });
};
