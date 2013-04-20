var mustAuth = require('./helpers/must-auth');
var Entity = require('./db/entity');

module.exports = function(app) {

  app.get('/entities/new', mustAuth, function(req, res) {
    res.render('entities/new');
  });

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

  app.get('/entities/:id', function(req, res) {
    Entity.find(req.param('id'), function(e, entity) {
      if (e) return res.status(500).end(e);
      res.render('entities/show', {
        entity: entity
      });
    });
  });

};
