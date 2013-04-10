var request = require('request');

// Verify a particular assertion
var verify = function(assertion, next) {
  request.post({
    url: 'https://verifier.login.persona.org/verify',
    form: {
      audience: process.env.AUDIENCE,
      assertion: assertion
    }
  }, function(e, res, body) {
    if (e) return next(e);

    // Attempt to parse JSON response.
    try { next(null, JSON.parse(body)); } catch(e) { next(e); }
  });
};

module.exports = function(app) {

  // Verify an assertion.
  app.post('/signin', function(req, res) {
    verify(req.param('assertion'), function(e, result) {
      if (e) return res.end(500);

      // Bail if authentication fails.
      if (result.status !== 'okay') return res.end(401);

      // Set some session data and finish up.
      req.session.email = result.email;
      res.end();
    });
  });

  // Clear session data.
  app.post('/signout', function(req, res) {
    req.session = null;
    res.end();
  });

};
