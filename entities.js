var mustAuth = require('./helpers/must-auth');
var Entity = require('./db/entity');

var _ = require('underscore');

var findEntity = function(req, res, next) {
  Entity.find(req.param('id'), function(e, entity) {
    if (e) return res.status(500).end(e);
    req.entity = res.locals.entity = entity;
    next();
  });
};

var mustOwn = function(req, res, next) {
  if (!req.user || !req.entity || req.user.id !== req.entity.owner_id) {
    return res.status(401).end();
  }
  next();
};

module.exports = function(app) {

  // New
  app.get('/entities/new', mustAuth, function(req, res) {
    res.render('entities/new');
  });

  // Create
  app.post('/entities', mustAuth, function(req, res) {
    var entity = new Entity({
      name: req.param('name'),
      owner_id: req.user.id
    });

    entity.save(function(e) {
      if (e) return res.status(500).end(e);
      res.redirect('/entities/' + entity.id);
    });
  });

  // Edit
  app.get('/entities/:id/edit', findEntity, mustOwn, function(req, res) {
    res.render('entities/edit');
  });

  app.post('/entities/:id', findEntity, mustOwn, function(req, res) {
    _.extend(req.entity, {
      name: req.param('name')
    });

    req.entity.save(function(e) {
      if (e) return res.status(500).end(e);
      res.redirect('/entities/' + req.entity.id);
    });
  });

  // Show
  app.get('/entities/:id', findEntity, function(req, res) {
    res.render('entities/show');
  });

};
