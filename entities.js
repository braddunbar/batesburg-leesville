var mustAuth = require('./helpers/must-auth');
var Entity = require('./db/entity');

var _ = require('underscore');

var findEntity = function(req, res, next) {
  Entity.find(req.param('id'), function(e, entity) {
    if (e) return res.render('500', {error: e});
    if (!entity) return res.render('404');
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

  // Index
  app.get('/entities', function(req, res) {
    var q = Entity.table.select(Entity.table.star());
    Entity.query(q, function(e, entities) {
      if (e) return res.render('500', {error: e});
      res.render('entities/index', {entities: entities});
    });
  });

  // Tagged
  app.get('/entities/tagged/:tag', function(req, res) {
    var q = Entity.table.where("'" + req.param('tag') + "' = any(tags)");
    Entity.query(q, function(e, entities) {
      if (e) return res.render('500', {error: e});
      res.render('entities/index', {entities: entities});
    });
  });

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
      if (e) return res.render('500', {error: e});
      res.redirect(entity.url());
    });
  });

  // Edit
  app.get('/entities/:id/edit', findEntity, mustOwn, function(req, res) {
    res.render('entities/edit');
  });

  app.post('/entities/:id', findEntity, mustOwn, function(req, res) {
    _.extend(req.entity, {
      name: req.param('name'),
      phone: req.param('phone'),
      description: req.param('description'),
      tags: req.param('tags').split(/[,\s]+/)
    });

    req.entity.save(function(e) {
      if (e) return res.render('500', {error: e});
      res.redirect(req.entity.url());
    });
  });

  // Show
  app.get('/entities/:id*', findEntity, function(req, res) {
    res.render('entities/show');
  });

};
