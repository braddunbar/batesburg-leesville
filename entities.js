var mustAuth = require('./helpers/must-auth');
var Entity = require('./db/entity');

var _ = require('underscore');

var findEntity = function(req, res, next) {
  Entity.find(req.params.id, function(e, entity) {
    if (e) return res.render('500', {error: e});
    if (!entity) return res.render('404');
    req.entity = res.locals.entity = entity;
    next();
  });
};

var canEdit = function(req, res, next) {
  if (!req.user || !req.user.can('edit', req.entity)) {
    return res.render('401');
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
    var q = Entity.table.where("'" + req.params.tag + "' = any(tags)");
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
      name: req.body.name,
      owner_id: req.user.id
    });

    entity.save(function(e) {
      if (e) return res.render('500', {error: e});
      res.redirect(entity.url());
    });
  });

  // Photos

  app.post('/entities/:id/photos/upload', findEntity, canEdit,
  function(req, res) {
    console.log(req.body);
    res.redirect(req.entity.url());
  });

  // Edit
  app.get('/entities/:id/edit', findEntity, canEdit, function(req, res) {
    res.render('entities/edit');
  });

  app.post('/entities/:id', findEntity, canEdit, function(req, res) {
    _.extend(req.entity, _.pick(req.body,
      'name', 'phone', 'street', 'city', 'zip', 'description'
    ));
    req.entity.tags = req.body.tags.split(/[,\s]+/);

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
